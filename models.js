const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Will be hashed
});

const User = mongoose.model("User", UserSchema);

// Food Donation Schema
const FoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  foodName: String,
  quantity: String,
  expirationDate: String,
  imageUrl: String,
  location: {
    lat: Number,
    lng: Number,
  },
  donatedAt: { type: Date, default: Date.now }
});


const Food = mongoose.model("Food", FoodSchema);

module.exports = { User, Food };

// Request Schema
const RequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
  location: {
    lat: Number,
    lng: Number,
  },
  requestedAt: { type: Date, default: Date.now },
});

const Request = mongoose.model("Request", RequestSchema);

module.exports = { User, Food, Request };

