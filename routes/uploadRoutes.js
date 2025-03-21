const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const Meeting = require("../models/Meeting");

const router = express.Router();

// Create uploads folder if needed
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configure multer
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

// POST /api/upload - Upload + transcribe
router.post("/", upload.single("audio"), async (req, res) => {
  try {
    const { title, userId } = req.body;
    const filePath = req.file.path;

    // Prepare audio for Whisper
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("model", "whisper-1");

    const whisperResponse = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const transcriptText = whisperResponse.data.text;

    // Save to MongoDB
    const newMeeting = new Meeting({
      title,
      user: userId,
      audioPath: filePath,
      transcript: transcriptText,
      uploadedAt: new Date(),
    });

    await newMeeting.save();

    res.status(200).json({
      message: "File uploaded and transcribed successfully!",
      meeting: newMeeting,
    });
  } catch (error) {
    console.error(
      "Upload/Transcription error:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Upload or transcription failed" });
  }
});

console.log("✅ Upload routes loaded with Whisper support");
module.exports = router;
