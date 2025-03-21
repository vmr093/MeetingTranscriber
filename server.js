require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors()); // Enable CORS

// Load environment variables
const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("AI Meeting Summarizer Backend is Running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
