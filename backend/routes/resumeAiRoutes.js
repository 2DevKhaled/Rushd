const express = require("express");
const {
  enhanceJobDescription,
  enhanceProfessionalSummary,
  uploadResume,
} = require("../controllers/resumeAiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/enhance-pro-summary", protect, enhanceProfessionalSummary);
router.post("/enhance-job-description", protect, enhanceJobDescription);
router.post("/upload-resume", protect, uploadResume);

module.exports = router;
