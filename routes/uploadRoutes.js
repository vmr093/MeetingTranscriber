const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Meeting = require("../models/Meeting");

const router = express.Router();

// Ensure "uploads" directory exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// POST /api/upload - Upload audio and save meeting
router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const { title, userId } = req.body;
    const filePath = req.file.path;

    const newMeeting = new Meeting({
      title,
      user: userId,
      audioPath: filePath,
      uploadedAt: new Date(),
    });

    await newMeeting.save();

    res.status(200).json({
      message: "File uploaded and meeting saved!",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

console.log("✅ Upload routes loaded");
module.exports = router;
