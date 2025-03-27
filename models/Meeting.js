const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: String, required: true },
  audioPath: { type: String, required: true },
  transcript: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  summary: { type: String, default: "" },
  summaryHistory: { type: [String], default: [] },
  isFavorite: {type: Boolean, default: false, },
});



module.exports = mongoose.model("Meeting", MeetingSchema);
