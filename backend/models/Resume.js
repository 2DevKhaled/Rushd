const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "سيرة ذاتية بدون عنوان", trim: true },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accentColor: { type: String, default: "#111827" },
    professionalSummary: { type: String, default: "" },
    skills: [{ type: String }],
    languages: [
      {
        name: { type: String, default: "" },
        proficiency: { type: String, default: "" },
      },
    ],
    personalInfo: {
      image: { type: String, default: "" },
      fullName: { type: String, default: "" },
      profession: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" },
        isCurrent: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        name: { type: String, default: "" },
        type: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        field: { type: String, default: "" },
        graduationDate: { type: String, default: "" },
        gpa: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true, minimize: false },
);

module.exports = mongoose.model("Resume", resumeSchema);
