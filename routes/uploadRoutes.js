const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
const Meeting = require("../models/Meeting");

const router = express.Router();

// Storage config for multer
const upload = multer({ dest: "uploads/" });

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/upload/audio
router.post("/audio", upload.single("audio"), async (req, res) => {
  try {
    const { title, userId } = req.body;
    const audioPath = req.file.path;

    if (!audioPath || !title || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Transcribe with OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
      response_format: "text",
    });

    // Save to DB
    const newMeeting = new Meeting({
      title,
      user: userId,
      audioPath,
      transcript: transcription,
    });

    await newMeeting.save();

    res.status(201).json(newMeeting);
  } catch (err) {
    console.error("❌ Error in audio upload route:", err);
    res.status(500).json({ error: "Failed to process recording" });
  }
});

module.exports = router;
