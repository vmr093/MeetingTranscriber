require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;

const corsOptions = {
  origin: function (origin, callback) {
    // Allow localhost during development
    const isLocalhost = !origin || origin.includes("localhost");

    // Allow any *.vercel.app subdomain
    const isVercel = origin && /\.vercel\.app$/.test(new URL(origin).hostname);

    if (isLocalhost || isVercel) {
      callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      callback(new Error("CORS policy: Origin not allowed"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));



app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS policy: Origin not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// 🔓 Serve static uploads (images, audio, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("AI Meeting Summarizer Backend is Running!");
});

// 🛣️ Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const meetingRoutes = require("./routes/meetingRoutes");
app.use("/api/meetings", meetingRoutes);

const summarizeRoute = require("./routes/summarize");
app.use("/api/summarize", summarizeRoute);

const uploadRecordRoute = require("./routes/uploadRecordRoute");
app.use("/api/record", uploadRecordRoute);

const recordRoutes = require("./routes/recordRoutes");
app.use("/api/recordings", recordRoutes);

const uploadAvatarRoute = require("./routes/uploadAvatarRoute");
app.use("/api/users", uploadAvatarRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
