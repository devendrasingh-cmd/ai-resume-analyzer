const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");
const { analyzeResume } = require("../controllers/resumeController");

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);

module.exports = router;
