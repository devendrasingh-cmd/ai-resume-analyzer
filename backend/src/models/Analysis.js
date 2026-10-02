const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    jobDescription: {
      type: String,
      default: "",
    },

    atsScore: {
      type: Number,
      required: true,
    },

    keywordMatchScore: {
      type: Number,
      default: 0,
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    jdSkills: {
      type: [String],
      default: [],
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    sections: {
      type: Object,
      default: {},
    },

    suggestions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Analysis", analysisSchema);
