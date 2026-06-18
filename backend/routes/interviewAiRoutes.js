const express = require("express");
const {
  generateConceptExplanation,
  generateInterviewQuestions,
} = require("../controllers/interviewAiController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);

module.exports = router;
