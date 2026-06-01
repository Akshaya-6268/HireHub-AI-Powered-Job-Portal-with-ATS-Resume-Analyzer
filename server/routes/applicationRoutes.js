const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/:jobId", authMiddleware, applyToJob);
router.get("/me", authMiddleware, getMyApplications);
router.get("/recruiter", authMiddleware, getRecruiterApplications);

module.exports = router;
