const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, required: true, trim: true },
    experience: { type: String, required: true, trim: true },
    topicsToFocus: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewQuestion",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
