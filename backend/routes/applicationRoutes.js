const express = require("express");
const {
  applyToJob,
  getMyApplications,
  getApplicatntsForJob,
  getApplicationById,
  updateStatus,
} = require("../controllers/applicationController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/:jobId", protect, applyToJob);
router.get("/my", protect, getMyApplications);
router.get("/job/:jobId", protect, getApplicatntsForJob);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateStatus);
module.exports = router;
