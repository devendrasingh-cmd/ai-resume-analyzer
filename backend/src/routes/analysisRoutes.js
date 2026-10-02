const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} = require("../controllers/analysisController");

const router = express.Router();

router.post("/", protect, saveAnalysis);

router.get("/", protect, getAnalysisHistory);

router.get("/:id", protect, getAnalysisById);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;

