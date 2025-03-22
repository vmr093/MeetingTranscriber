const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  audioPath: { type: String, required: true },
  transcript: { type: String }, // 👈 Add this
  uploadedAt: { type: Date, default: Date.now },
  summary: { type: String, default: "" },
  summary: {type: String, default: "",},
  summaryHistory: {type: [String], default: [],},
});

module.exports = mongoose.model("Meeting", MeetingSchema);