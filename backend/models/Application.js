const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    resume: { type: String },
    resumeId: { type: mongoose.Schema.ObjectId, ref: "Resume" },
    status: {
      type: String,
      enum: ["Applied", "In Review", "Rejected", "Accepted"],
      default: "Applied",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
