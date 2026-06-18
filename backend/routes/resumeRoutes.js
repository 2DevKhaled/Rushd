const express = require("express");
const {
  createResume,
  deleteResume,
  getMyResumes,
  getPublicResumeById,
  getResumeById,
  updateResume,
} = require("../controllers/resumeController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/create", protect, createResume);
router.get("/my", protect, getMyResumes);
router.get("/get/:resumeId", protect, getResumeById);
router.get("/public/:resumeId", getPublicResumeById);
router.put("/update", protect, upload.single("image"), updateResume);
router.delete("/delete/:resumeId", protect, deleteResume);

module.exports = router;
