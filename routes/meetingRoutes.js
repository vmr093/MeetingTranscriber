const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

// GET /api/meetings - Fetch all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ uploadedAt: -1 });

    if (!Array.isArray(meetings)) {
      console.error("❌ Meetings is not an array:", meetings);
      return res.status(500).json({ message: "Meetings data is invalid" });
    }

    res.json(meetings);
  } catch (error) {
    console.error("❌ Failed to fetch meetings:", error);
    res.status(500).json({ message: "Error fetching meetings" });
  }
});

// PATCH /api/meetings/:id/summary
router.patch("/:id/summary", async (req, res) => {
  const { summary } = req.body;

  if (!summary) return res.status(400).json({ error: "Summary is required" });

  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { summary },
      { new: true }
    );
    res.json(meeting);
  } catch (err) {
    console.error("Error saving summary:", err);
    res.status(500).json({ error: "Failed to save summary" });
  }
});

// GET /api/meetings/:id - Fetch a single meeting by ID
router.get("/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }
    res.json(meeting);
  } catch (err) {
    console.error("Error fetching meeting by ID:", err);
    res.status(500).json({ error: "Failed to fetch meeting" });
  }
});

module.exports = router;
