const Resume = require("../models/Resume");

const parseResumeData = (resumeData) => {
  if (!resumeData) return {};
  if (typeof resumeData === "string") return JSON.parse(resumeData);
  return resumeData;
};

const getImageUrl = (req) => {
  if (!req.file) return "";
  return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
};

const sanitizeResumeUpdate = (resumeData) => {
  const {
    _id,
    user,
    createdAt,
    updatedAt,
    __v,
    ...safeResumeData
  } = resumeData || {};

  return safeResumeData;
};

exports.createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user._id,
      title: req.body.title || "سيرة ذاتية جديدة",
      personalInfo: {
        fullName: req.user.name || "",
        email: req.user.email || "",
        image: req.user.avatar || "",
      },
    });

    res.status(201).json({ message: "Resume created successfully", resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });

    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPublicResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      public: true,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const resumeId = req.body.resumeId || req.params.resumeId;
    const resumeData = sanitizeResumeUpdate(parseResumeData(req.body.resumeData));
    const imageUrl = getImageUrl(req);

    if (imageUrl) {
      resumeData.personalInfo = {
        ...(resumeData.personalInfo || {}),
        image: imageUrl,
      };
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, user: req.user._id },
      resumeData,
      { new: true, runValidators: true },
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Saved successfully", resume });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
