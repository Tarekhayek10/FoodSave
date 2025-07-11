const express = require("express");
const router = express.Router();
const { Request } = require("../models");

// POST /api/request - Save a new food request
router.post("/", async (req, res) => {
  try {
    const { user, foodId, location } = req.body;
    if (!user || !foodId || !location?.lat || !location?.lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newRequest = new Request({
      user,
      foodId,
      location: {
        lat: location.lat,
        lng: location.lng
      },
      requestedAt: new Date()
    });

    const saved = await newRequest.save();
    res.status(201).json({
      message: "Request saved successfully",
      requestId: saved._id,
    });

  } catch (err) {
    console.error("❌ Error saving request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/request - Fetch all requests
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().select("-__v");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
