const express = require("express");
const {
  addQuestionToSession,
  togglePinQuestion,
  updateQuestionNote,
} = require("../controllers/interviewQuestionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addQuestionToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);

module.exports = router;
