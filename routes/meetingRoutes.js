const express = require("express");
const router = express.Router();
const Meeting = require("../models/Meeting");

// GET /api/meetings - Fetch all meetings
router.get("/", async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ uploadedAt: -1 });
    res.json(meetings);
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    res.status(500).json({ message: "Error fetching meetings" });
  }
});

module.exports = router;
