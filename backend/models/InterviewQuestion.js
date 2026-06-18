const mongoose = require("mongoose");

const interviewQuestionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      index: true,
    },
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    note: { type: String, default: "" },
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("InterviewQuestion", interviewQuestionSchema);
