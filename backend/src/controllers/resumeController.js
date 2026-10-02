const fs = require("fs");
const { extractResumeText } = require("../utils/resumeParser");
const Analysis = require("../models/Analysis");

const analyzeResume = async (req, res) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    uploadedFilePath = req.file.path;

    const resumeText = await extractResumeText(
      req.file.path,
      req.file.mimetype
    );

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message: "Could not extract text from resume",
      });
    }

    const jobDescription = req.body.jobDescription || "";

    const resumeTextLower = resumeText.toLowerCase();
    const jdTextLower = jobDescription.toLowerCase();

    /*
      Common ATS keywords.
      These are used only when they actually appear
      in the job description.
    */
    const skills = [
      "javascript",
      "typescript",
      "react",
      "node.js",
      "node",
      "mongodb",
      "express.js",
      "express",
      "html",
      "css",
      "python",
      "java",
      "sql",
      "git",
      "github",
      "docker",
      "aws",
      "azure",
      "rest api",
      "tailwind",
      "bootstrap",
      "redux",
      "next.js",
      "vite",
      "figma",
      "firebase",
      "postgresql",
      "mysql",
      "redis",
      "graphql",
      "jest",
      "cypress",
      "fastapi",
      "django",
      "spring boot",
      "kubernetes",
      "linux",
      "ci/cd",
      "github actions",
    ];

    /*
      Find skills mentioned in the job description.
    */
    const jdSkills = skills.filter((skill) =>
      jdTextLower.includes(skill)
    );

    /*
      Find skills from JD that are also present in resume.
    */
    const matchedKeywords = jdSkills.filter((skill) =>
      resumeTextLower.includes(skill)
    );

    /*
      Find JD skills missing from resume.
    */
    const missingKeywords = jdSkills.filter(
      (skill) => !resumeTextLower.includes(skill)
    );

    /*
      If a JD is provided, calculate actual keyword match.
      If no JD is provided, don't punish the resume.
    */
    const keywordMatchScore =
      jdSkills.length > 0
        ? Math.round(
            (matchedKeywords.length / jdSkills.length) * 100
          )
        : 0;

    /*
      Resume section detection.
    */
    const sections = {
      contact:
        /email|phone|mobile|linkedin|github|contact/i.test(
          resumeText
        ),

      summary:
        /summary|professional summary|objective|profile/i.test(
          resumeText
        ),

      skills:
        /skills|technical skills|technologies|tech stack/i.test(
          resumeText
        ),

      experience:
        /experience|work experience|employment|professional experience/i.test(
          resumeText
        ),

      education:
        /education|qualification|degree|b\.tech|bachelor|master/i.test(
          resumeText
        ),

      projects:
        /projects|project experience|personal projects/i.test(
          resumeText
        ),
    };

    const sectionCount =
      Object.values(sections).filter(Boolean).length;

    /*
      Section score: maximum 20.
    */
    const sectionScore = Math.round(
      (sectionCount / 6) * 20
    );

    /*
      Keyword score: maximum 40.
      If no JD is provided, give a neutral baseline.
    */
    const keywordScore =
      jdSkills.length > 0
        ? Math.round(keywordMatchScore * 0.4)
        : 20;

    /*
      Resume length score: maximum 10.
    */
    const wordCount = resumeText
      .split(/\s+/)
      .filter(Boolean).length;

    let lengthScore = 0;

    if (wordCount >= 300 && wordCount <= 800) {
      lengthScore = 10;
    } else if (wordCount >= 200 && wordCount <= 1000) {
      lengthScore = 7;
    } else if (wordCount >= 100 && wordCount <= 1200) {
      lengthScore = 4;
    } else {
      lengthScore = 2;
    }

    /*
      Contact score: maximum 5.
    */
    let contactScore = 0;

    if (/email/i.test(resumeText)) {
      contactScore += 2;
    }

    if (/phone|mobile/i.test(resumeText)) {
      contactScore += 1;
    }

    if (/linkedin/i.test(resumeText)) {
      contactScore += 1;
    }

    if (/github/i.test(resumeText)) {
      contactScore += 1;
    }

    /*
      Achievement score: maximum 10.
    */
    const achievementMatches =
      resumeText.match(
        /\d+%|\d+\+|\$\d+|increased|improved|reduced|achieved|optimized|saved|generated|built|developed|implemented/gi
      ) || [];

    const achievementScore = Math.min(
      10,
      achievementMatches.length * 2
    );

    /*
      Formatting / ATS-friendly signals: maximum 5.
    */
    let formattingScore = 0;

    if (sections.summary) {
      formattingScore += 1;
    }

    if (sections.skills) {
      formattingScore += 1;
    }

    if (sections.experience) {
      formattingScore += 1;
    }

    if (sections.education) {
      formattingScore += 1;
    }

    if (sections.projects) {
      formattingScore += 1;
    }

    /*
      Final ATS score.
      Maximum possible score = 100.
    */
    const atsScore = Math.min(
      100,
      keywordScore +
        sectionScore +
        lengthScore +
        contactScore +
        achievementScore +
        formattingScore
    );

    /*
      Suggestions.
    */
    const suggestions = [];

    if (jdSkills.length > 0 && missingKeywords.length > 0) {
      suggestions.push(
        `Consider adding relevant keywords from the job description: ${missingKeywords.join(", ")}`
      );
    }

    if (!sections.contact) {
      suggestions.push(
        "Add clear contact information including email and phone number."
      );
    }

    if (!sections.summary) {
      suggestions.push(
        "Add a concise professional summary tailored to the target role."
      );
    }

    if (!sections.skills) {
      suggestions.push(
        "Add a dedicated Technical Skills section."
      );
    }

    if (!sections.experience) {
      suggestions.push(
        "Add relevant work experience, internships, freelance work, or practical experience."
      );
    }

    if (!sections.education) {
      suggestions.push(
        "Add an Education section with your degree and institution."
      );
    }

    if (!sections.projects) {
      suggestions.push(
        "Add relevant projects with technologies and your contribution."
      );
    }

    if (wordCount < 200) {
      suggestions.push(
        "Resume content appears short. Add relevant project, experience, and achievement details."
      );
    }

    if (wordCount > 1000) {
      suggestions.push(
        "Resume is quite long. Consider removing repetitive or less relevant information."
      );
    }

    if (achievementMatches.length === 0) {
      suggestions.push(
        "Add measurable achievements using numbers, percentages, performance improvements, or results."
      );
    }

    if (
      jdSkills.length > 0 &&
      keywordMatchScore < 50
    ) {
      suggestions.push(
        "Tailor your resume more closely to the job description's required technologies and skills."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Resume has good ATS-friendly structure. Continue tailoring keywords for each job application."
      );
    }

    /*
      Data saved to MongoDB.
    */
    const analysisData = {
      user: req.user._id,
      resumeName: req.file.originalname,
      jobDescription,
      atsScore,
      keywordMatchScore,
      matchedKeywords,
      missingKeywords,
      jdSkills,
      wordCount,
      sections,
      suggestions,
    };

    const savedAnalysis = await Analysis.create(
      analysisData
    );

    /*
      Remove uploaded file after analysis.
      MongoDB stores the analysis result, so the local
      uploaded resume does not need to remain on disk.
    */
    try {
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch (cleanupError) {
      console.error(
        "Uploaded file cleanup error:",
        cleanupError.message
      );
    }

    return res.status(200).json({
      message: "Resume analyzed successfully",

      analysis: {
        ...analysisData,
        id: savedAnalysis._id,
        createdAt: savedAnalysis.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "Resume analysis error:",
      error
    );

    /*
      Cleanup uploaded file if analysis fails.
    */
    try {
      if (
        uploadedFilePath &&
        fs.existsSync(uploadedFilePath)
      ) {
        fs.unlinkSync(uploadedFilePath);
      }
    } catch (cleanupError) {
      console.error(
        "File cleanup error:",
        cleanupError.message
      );
    }

    return res.status(500).json({
      message: "Resume analysis failed",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeResume,
};
