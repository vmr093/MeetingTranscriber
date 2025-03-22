const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { transcript } = req.body;
  console.log("📥 Incoming transcript:", transcript);

  if (!transcript) {
    return res.status(400).json({ error: "Transcript is required" });
  }

  try {
    const prompt = `
      Here's a transcript of a meeting:

      "${transcript}"

      Summarize the key discussion points in bullet form. Include action items, decisions, and follow-ups if any.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    res.json({ summary });
  } catch (error) {
    console.error("🔥 OpenAI Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI summarization failed." });
  }
});

module.exports = router;
