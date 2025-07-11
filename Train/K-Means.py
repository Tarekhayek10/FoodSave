from pymongo import MongoClient
import pandas as pd
from sklearn.cluster import KMeans
from collections import Counter
import joblib
import json

# Step 1: Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client.foodsave
requests_collection = db.requests

# Step 2: Get all request coordinates
cursor = requests_collection.find({}, {"location": 1})
locations = [
    (doc["location"]["lat"], doc["location"]["lng"])
    for doc in cursor if "location" in doc and "lat" in doc["location"] and "lng" in doc["location"]
]

if len(locations) < 2:
    raise ValueError("❌ Not enough requests to train KMeans.")

df = pd.DataFrame(locations, columns=["lat", "lng"])
coords = df[["lat", "lng"]].values

# Step 3: Train KMeans with 2 clusters
kmeans = KMeans(n_clusters=2, random_state=42)
labels = kmeans.fit_predict(coords)

# Step 4: Count requests per cluster
label_counts = Counter(labels)
sorted_clusters = sorted(label_counts.items(), key=lambda x: x[1], reverse=True)

# Step 5: Assign high/low based on density
cluster_labels = {
    sorted_clusters[0][0]: "📈 High Demand Area",
    sorted_clusters[1][0]: "📉 Low Demand Area"
}

# Step 6: Save model and labels
joblib.dump(kmeans, "models/kmeans_model.pkl")
with open("models/kmeans_cluster_labels.json", "w") as f:
    json.dump(cluster_labels, f)

print("✅ KMeans retrained and saved.")
print("📊 Cluster Labels:", cluster_labels)
