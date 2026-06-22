const express = require("express");
const { getEmployers, updateEmployerStatus } = require("../controllers/adminController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/employers", getEmployers);
router.patch("/employers/:id/status", updateEmployerStatus);

module.exports = router;
