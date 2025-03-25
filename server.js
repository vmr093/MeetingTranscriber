require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Load environment variables
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;


// Middleware

const allowedOrigins = [
  "http://localhost:5173",
  "https://meetingtranscriber.vercel.app",
  "https://meeting-transcriber-onbqpsssf-vmr093s-projects.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("AI Meeting Summarizer Backend is Running!");
});

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes); // keep for manual uploads

const meetingRoutes = require("./routes/meetingRoutes");
app.use("/api/meetings", meetingRoutes);

const summarizeRoute = require("./routes/summarize");
app.use("/api/summarize", summarizeRoute);

// 🆕 Use this for recorded audio + transcription
const uploadRecordRoute = require("./routes/uploadRecordRoute");
app.use("/api/record", uploadRecordRoute);

// Optional: recordings management (if you want it later)
const recordRoutes = require("./routes/recordRoutes");
app.use("/api/recordings", recordRoutes);





// Debug: List registered routes
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`📌 Active Route: ${r.route.path}`);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
