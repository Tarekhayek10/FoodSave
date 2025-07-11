const express = require("express");
const connectDB = require("./config");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Routes
const userRoutes = require("./Routes/userRoutes");
const foodRoutes = require("./Routes/foodRoutes");
const requestRoutes = require("./Routes/requestRoutes");
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/requests", requestRoutes);


// Flask ML Server URL
const FLASK_API = "http://127.0.0.1:4000";

// --- 1️⃣ Image Upload Handling ---
app.use("/uploads", express.static(uploadDir));

// Check if file exists before accessing
app.get("/uploads/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

// --- 2️⃣ CNN Image Classification ---
app.post("/api/predict-image", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API}/predict-image`, req.files);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to classify image" });
    }
});

// --- 3️⃣ Food Demand Prediction (KMeans & DBSCAN) ---
app.post("/api/predict-cluster", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API}/predict-cluster`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to predict food demand" });
    }
});

// --- 4️⃣ Food Quality Prediction (SVM) ---
app.post("/api/predict-quality", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API}/predict-quality`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to predict food quality" });
    }
});

// --- 5️⃣ Route Optimization (Reinforcement Learning) ---
app.post("/api/optimize-route", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API}/optimize-route`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to optimize route" });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
