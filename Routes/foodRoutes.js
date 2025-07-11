const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const { Food } = require("../models");

// Configure image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ POST /donate - Save donation to MongoDB
router.post("/donate", upload.single("image"), async (req, res) => {
  console.log("🔥 POST /donate hit");
  console.log("📦 body:", req.body);
  console.log("🖼 file:", req.file);

  try {
    const { user, foodName, quantity, expirationDate, lat, lng } = req.body;

    // Validate required fields
    if (!foodName || !quantity || !expirationDate || !lat || !lng || !req.file) {
      console.log("⚠️ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newFood = new Food({
      user: user || undefined, // allow saving even if user is missing
      foodName,
      quantity,
      expirationDate,
      imageUrl: req.file ? req.file.path : "",
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
    });

    try {
      await newFood.save();
      console.log("✅ Saved to MongoDB:", newFood);
      res.status(200).json({ message: "Donation submitted successfully." });
    } catch (mongooseError) {
      console.error("❌ Mongoose save error:", mongooseError);
      res.status(500).json({ error: "Mongoose failed to save donation." });
    }
  } catch (error) {
    console.error("❌ Error handling donation:", error);
    res.status(500).json({ error: "Unexpected server error." });
  }
});

// ✅ GET /donations - List all donations
router.get("/donations", async (req, res) => {
  try {
    const donations = await Food.find().select("-__v");
    res.status(200).json(donations);
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

