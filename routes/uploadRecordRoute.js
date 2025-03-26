// routes/uploadRecordRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Meeting = require("../models/Meeting");

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!req.file || !userId || !title) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const newMeeting = new Meeting({
      title,
      user: userId, // Firebase UID as string
      audioPath: `/uploads/${req.file.filename}`,
    });

    await newMeeting.save();

    res.json(newMeeting);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Failed to upload and save meeting" });
  }
});

module.exports = router;
