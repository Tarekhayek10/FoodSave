import json
import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pickle
import tensorflow as tf
import numpy as np
import cv2
import os
from datetime import datetime
from Train.rl import RouteEnv



def calculate_days_to_expire(expiration_date):
    exp_date = datetime.strptime(expiration_date, "%Y-%m-%d").date()
    now = datetime.utcnow().date()
    diff = exp_date - now
    return diff.days

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Backend API
NODE_BACKEND = "http://127.0.0.1:5000/api"

# Load Machine Learning Models
mobilenetv2_bestmodel = tf.keras.models.load_model("models/mobilenetv2_bestmodel.h5")
kmeans_model = pickle.load(open("models/kmeans_model.pkl", "rb"))
dbscan_model = pickle.load(open("models/dbscan_model.pkl", "rb"))
svm_bundle = pickle.load(open("models/svm_model.pkl", "rb"))  
svm_model = svm_bundle["model"]                               
svm_label_map = svm_bundle["label_map"]
rl_model = tf.keras.models.load_model("models/dqn_route_optimizer_model.h5", compile=False)



# Load mapping from file
with open("models/class_mapping.json", "r") as f:
    class_map = json.load(f)

# --- 1️⃣ CNN Food Image Classification ---
@app.route("/predict-image", methods=["POST"])
def predict_image():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    image = request.files["image"]
    image_path = "temp_image.jpg"
    image.save(image_path)

    # Preprocess Image
    img = cv2.imread(image_path)
    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # ✅ Always convert BGR → RGB
    img = img / 255.0                           # ✅ Match training preprocessing
    img = np.expand_dims(img, axis=0)


    # Predict using CNN
    predictions = mobilenetv2_bestmodel.predict(img)
    category = int(np.argmax(predictions))
    food_name = class_map.get(str(category), f"Class {category}")

    # Delete temp file
    os.remove(image_path)

    return jsonify({"category": category, "food_name": food_name})


@app.route("/predict-cluster", methods=["POST"])
def predict_cluster():
    data = request.json.get("features", [])
    print("📥 Incoming features:", data)

    if not data:
        return jsonify({"error": "No features provided"}), 400

    try:
        kmeans_cluster = kmeans_model.predict([data])[0]
        print("📊 Predicted cluster:", kmeans_cluster)

        cluster_labels = {
            0: "📈 High Demand Area",
            1: "📊 Moderate Demand",
            2: "📉 Low Demand",
            3: "⚠️ Sporadic Demand",
            4: "🔍 Unclassified Zone"
        }
        demand_label = cluster_labels.get(int(kmeans_cluster), "🔍 Unknown Cluster")

        return jsonify({
            "kmeans_cluster": int(kmeans_cluster),
            "demand_label": demand_label
        })

    except Exception as e:
        print("❌ Prediction error:", str(e))  # 👈 very important
        return jsonify({"error": str(e)}), 500



# --- 3️⃣ Food Quality Prediction (SVM) ---
@app.route("/predict-quality", methods=["POST"])
def predict_quality():
    try:
        payload = request.json

        # Required fields
        expiration_date = payload.get("expirationDate")
        temp_stored = payload.get("tempStored")
        food_name = payload.get("foodName")

        # Validation
        if None in [expiration_date, temp_stored, food_name]:
            print("❌ Missing one or more required fields:", payload)
            return jsonify({"error": "Missing required fields"}), 400

        # Convert inputs
        temp_stored = float(temp_stored)
        food_name = int(food_name)

        # Calculate backend-controlled features
        days_to_expire = calculate_days_to_expire(expiration_date)
        

        features = [food_name, temp_stored, days_to_expire]
        print("📥 Features for SVM:", features)

        # Predict using the SVM model
        result = svm_model.predict([features])[0]
        print("🔍 SVM prediction result:", result)

        return jsonify({
            "quality_score": int(result),
            "quality_label": svm_label_map[result]
        })

    except Exception as e:
        print("❌ Exception during quality prediction:", str(e))
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

@app.route("/optimize-route", methods=["POST"])
def optimize_route():
    try:
        data = request.json
        food_id = data.get("foodId")
        request_id = data.get("requestId")

        if not food_id or not request_id:
            return jsonify({"error": "Missing foodId or requestId"}), 400

        donor_res = requests.get(f"{NODE_BACKEND}/food/donations")
        request_res = requests.get(f"{NODE_BACKEND}/requests")

        donors = donor_res.json()
        requests_data = request_res.json()

        donor = next((d for d in donors if str(d["_id"]) == food_id), None)
        recipient = next((r for r in requests_data if str(r["_id"]) == request_id), None)

        if not donor or not recipient:
            return jsonify({"error": "Invalid donor or recipient ID"}), 404

        donor_coord = (donor["location"]["lat"], donor["location"]["lng"])
        recipient_coords = [(recipient["location"]["lat"], recipient["location"]["lng"])]

        env = RouteEnv(donor_coord, recipient_coords)
        route = [env.donor]
        done = False
        expected_input_size = rl_model.input_shape[-1]

        while not done:
            available = [i for i in range(env.num_recipients) if i not in env.visited]
            if not available:
                break

            raw_state = env._get_state()
            if len(raw_state) < expected_input_size:
                pad = np.zeros(expected_input_size - len(raw_state))
                state = np.concatenate([raw_state, pad])
            else:
                state = raw_state

            q_values = rl_model.predict(np.expand_dims(state, axis=0), verbose=0)[0]
            action = int(np.argmax(q_values))
            if action not in available:
                action = random.choice(available)
            _, _, done, _ = env.step(action)
            route.append(env.current_pos)

        formatted = [{"lat": lat, "lng": lng} for lat, lng in route]
        return jsonify({"optimized_route": formatted})

    except Exception as e:
        print("❌ Exception during optimization:", str(e))
        return jsonify({"error": str(e)}), 500
    print("✅ Optimized Route:", formatted)







# --- 5️⃣ Donation Submission (Send to Node.js Backend) ---
@app.route("/donate", methods=["POST"])
def donate():
    print("🟢 Flask received POST /donate")
    print("Form Keys:", list(request.form.keys()))
    print("Form Data:", dict(request.form))


    # Explicitly extract fields including user ID
    image = request.files.get("image")
    form_data = {
        'user': request.form.get("user"),
        'foodName': request.form.get("foodName"),
        'quantity': request.form.get("quantity"),
        'expirationDate': request.form.get("expirationDate"),
        'lat': request.form.get("lat"),
        'lng': request.form.get("lng")
    }

    files = {'image': (image.filename, image.stream, image.mimetype)} if image else {}

    response = requests.post(
        f"{NODE_BACKEND}/food/donate",
        data=form_data,
        files=files
    )

    return jsonify(response.json()), response.status_code



# --- 6️⃣ Get Available Donations ---
@app.route("/donations", methods=["GET"])
def get_donations():
    response = requests.get(f"{NODE_BACKEND}/food/donations")
    return jsonify(response.json()), response.status_code

@app.route("/login", methods=["POST"])
def login():
    response = requests.post(f"{NODE_BACKEND}/users/login", json=request.json)
    print("LOGIN RESPONSE:", response.status_code, response.json())  # Debugging
    return jsonify(response.json()), response.status_code

@app.route("/signup", methods=["POST"])
def signup():
    response = requests.post(f"{NODE_BACKEND}/users/signup", json=request.json)
    print("SIGN-UP RESPONSE:", response.status_code, response.json())  # Debugging
    return jsonify(response.json()), response.status_code

@app.route("/request-food", methods=["POST"])
def request_food():
    data = request.json
    print("🍽️ New food request received:", data)

    # Here you could save the request in your database or handle it
    return jsonify({"message": "Request received successfully!"}), 200



# Run Flask App
if __name__ == "__main__":
    app.run(debug=True, port=4000)
