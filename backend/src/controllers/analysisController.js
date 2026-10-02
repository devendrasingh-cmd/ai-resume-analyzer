const Analysis = require("../models/Analysis");

const saveAnalysis = async (req, res) => {
  try {
    const {
      resumeName,
      jobDescription,
      atsScore,
      keywordMatchScore,
      matchedKeywords,
      missingKeywords,
      jdSkills,
      wordCount,
      sections,
      suggestions,
    } = req.body;

    const analysis = await Analysis.create({
      user: req.user._id,
      resumeName,
      jobDescription,
      atsScore,
      keywordMatchScore,
      matchedKeywords,
      missingKeywords,
      jdSkills,
      wordCount,
      sections,
      suggestions,
    });

    res.status(201).json({
      message: "Analysis saved successfully",
      analysis,
    });
  } catch (error) {
    console.error("Save analysis error:", error);

    res.status(500).json({
      message: "Failed to save analysis",
      error: error.message,
    });
  }
};

const getAnalysisHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      analyses,
    });
  } catch (error) {
    console.error("History error:", error);

    res.status(500).json({
      message: "Failed to fetch analysis history",
      error: error.message,
    });
  }
};

const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    res.status(200).json({
      analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);

    res.status(500).json({
      message: "Failed to fetch analysis",
      error: error.message,
    });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({
        message: "Analysis not found",
      });
    }

    await Analysis.deleteOne({
      _id: analysis._id,
    });

    return res.status(200).json({
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    console.error("Delete analysis error:", error);

    return res.status(500).json({
      message: "Failed to delete analysis",
      error: error.message,
    });
  }
};

module.exports = {
  saveAnalysis,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
};

