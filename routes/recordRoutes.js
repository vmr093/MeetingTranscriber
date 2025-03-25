const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const Meeting = require("../models/Meeting");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Use multer to save uploaded audio to disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /api/recordings/upload
router.post("/upload", upload.single("audio"), async (req, res) => {
  const { title, userId } = req.body;
  const audioPath = req.file?.path;

  if (!title || !userId || !audioPath) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    // Save to DB
    const meeting = new Meeting({
      title,
      user: userId,
      audioPath,
      transcript: transcription.text,
    });

    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    console.error("❌ Whisper transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe and save recording" });
  }
});

module.exports = router;
