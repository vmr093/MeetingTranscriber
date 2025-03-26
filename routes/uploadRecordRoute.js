const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Meeting = require("../models/Meeting");
const { OpenAI } = require("openai");

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
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

    if (!req.file)
      return res.status(400).json({ error: "No audio file uploaded" });
    if (!userId) return res.status(400).json({ error: "Missing user ID" });

    const audioPath = path.join(__dirname, "..", "uploads", req.file.filename);

    // 🔊 Step 1: Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    const transcript = transcription.text;

    // 🧠 Step 2: Format with GPT prompt
    const summaryPrompt = `
Format the following transcript into structured meeting notes with these sections:

1. **Meeting Overview**
2. **Key Decisions**
3. **Action Items**
4. **Discussion Highlights**
5. **Next Steps**
6. **Questions & Concerns**
7. **Attendees (Optional)**

Transcript:
${transcript}
    `;

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that formats meeting transcripts.",
        },
        { role: "user", content: summaryPrompt },
      ],
    });

    const formattedSummary = gptResponse.choices[0].message.content;

    // 💾 Step 3: Save to database
    const newMeeting = new Meeting({
      title,
      user: userId,
      audioPath: `/uploads/${req.file.filename}`,
      transcript,
      summary: formattedSummary,
      summaryHistory: [formattedSummary],
    });

    await newMeeting.save();
    res.json(newMeeting);
  } catch (error) {
    console.error("❌ Upload or processing error:", error);
    res.status(500).json({ error: "Failed to upload or process recording" });
  }
});

module.exports = router;
