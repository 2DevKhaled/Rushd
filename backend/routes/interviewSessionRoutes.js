const express = require("express");
const {
  createSession,
  deleteSession,
  getMySessions,
  getSessionById,
} = require("../controllers/interviewSessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

module.exports = router;
