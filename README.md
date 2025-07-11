#  AI-Powered Food Donation Platform

A full-stack web application that connects food donors with recipients using AI-based models to optimize donation safety, demand prediction, and delivery routing. Built with React.js (TypeScript), Flask, and integrated with machine learning models and Google Maps API.

---

##  Features

- **Food Image Recognition** using MobileNetV2(Food 101 dataset from kaggle)
- **Food Safety Prediction** using SVM (temperature, expiration)
- **Route Optimization** using Deep Q-Network (DQN) and Google Maps
- **Food Demand Clustering** using KMeans & DBSCAN
-  **Location-based Donation & Request System**
-  User authentication and secure food request workflow

---

##  Tech Stack

###  Frontend
- React.js (TypeScript)
- Google Maps JavaScript API
- HTML, CSS, JavaScript

###  Machine Learning
- MobileNetV2 (TensorFlow, Keras)
- Support Vector Machine (Scikit-learn)
- DQN (Reinforcement Learning)
- KMeans, DBSCAN (Clustering)

###  Backend
- Flask (Python) – ML and API layer
- Node.js + Express – Web API 
- MongoDB + Mongoose – Database
- JWT & bcrypt – Authentication

---

##  Project Structure
FoodSave/
│
├── flask-api/ # ML models and Flask server
├── frontend/ # React.js frontend
├── node-backend/ # (Optional) Node.js backend
├── README.md
├── .gitignore
└── requirements.txt / package.json


---

##  How to Run the Project

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/FoodSave.git
cd food-donation-app

### 2. Flask API (Machine Learning)
cd flask-api
pip install -r requirements.txt
python app.py


### 3. Frontend (React)
cd ../frontend
npm install
npm start

### 4. Node Backend
cd ../node-backend
npm install
node index.js

 ML Models Overview
MobileNetV2: Identifies the food type from uploaded images.

SVM: Predicts if food is safe to donate based on temp_stored, days_to_expire, and food type.

DQN: Learns optimal delivery routes between donors and recipients.

KMeans & DBSCAN: Classify regions into high/low demand areas based on food request clusters.

 Authentication
Users can sign up, log in, and submit donations or requests.

Authentication is secured using JWT and passwords are hashed with bcrypt.

 Author
Tarik Haik
Computer Engineering Graduate – Istinye University
Email: tarekhayek002@gmail.com
Location: Istanbul, Turkey









