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

// GET /api/meetings/favorites - Fetch only favorites
router.get("/favorites", async (req, res) => {
  try {
    const favorites = await Meeting.find({ isFavorite: true }).sort({
      uploadedAt: -1,
    });
    res.json(favorites);
  } catch (err) {
    console.error("Error fetching favorites:", err);
    res.status(500).json({ message: "Failed to fetch favorites" });
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

// POST /api/meetings/start-recording - Create new meeting placeholder
router.post("/start-recording", async (req, res) => {
  const { title, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).json({ message: "Title and userId are required" });
  }

  try {
    const newMeeting = await Meeting.create({
      title,
      user: userId,
      audioPath: "placeholder-recording.mp3", // Will be replaced by real audio file
    });

    res.status(201).json(newMeeting);
  } catch (err) {
    console.error("❌ Failed to start recording:", err);
    res.status(500).json({ message: "Server error while starting recording" });
  }
});

// ✅ DELETE /api/meetings/:id - Delete a meeting
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Meeting.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.json({ message: "Meeting deleted", deleted });
  } catch (err) {
    console.error("Failed to delete meeting:", err);
    res.status(500).json({ message: "Error deleting meeting" });
  }
});

// PATCH /api/meetings/:id/favorite
router.patch("/:id/favorite", async (req, res) => {
  try {
    const { isFavorite } = req.body;
    const updated = await Meeting.findByIdAndUpdate(
      req.params.id,
      { isFavorite },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating favorite:", err);
    res.status(500).json({ message: "Failed to update favorite" });
  }
});


module.exports = router;
