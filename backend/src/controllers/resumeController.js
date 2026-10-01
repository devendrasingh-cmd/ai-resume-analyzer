const fs = require("fs");
const { extractResumeText } = require("../utils/resumeParser");

const SKILLS = [
  "javascript",
  "typescript",
  "react",
  "react.js",
  "node",
  "node.js",
  "express",
  "express.js",
  "mongodb",
  "mysql",
  "postgresql",
  "sql",
  "html",
  "css",
  "tailwind",
  "bootstrap",
  "redux",
  "next.js",
  "vite",
  "python",
  "java",
  "c++",
  "git",
  "github",
  "docker",
  "aws",
  "azure",
  "rest api",
  "api",
  "figma",
  "firebase",
  "fastapi",
  "postman",
  "linux",
  "ci/cd",
  "github actions"
];

const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^\w\s.+#/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const containsSkill = (text, skill) => {
  const normalizedSkill = skill.toLowerCase();

  if (normalizedSkill === "node.js") {
    return text.includes("node.js") || text.includes("node js");
  }

  if (normalizedSkill === "react.js") {
    return text.includes("react.js") || text.includes("react js");
  }

  if (normalizedSkill === "express.js") {
    return text.includes("express.js") || text.includes("express js");
  }

  if (normalizedSkill === "next.js") {
    return text.includes("next.js") || text.includes("next js");
  }

  if (normalizedSkill === "c++") {
    return text.includes("c++");
  }

  if (normalizedSkill === "c++") {
    return text.includes("c++");
  }

  return text.includes(normalizedSkill);
};

const analyzeResume = async (req, res) => {
  let uploadedFile = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    uploadedFile = req.file.path;

    const resumeText = await extractResumeText(
      req.file.path,
      req.file.mimetype
    );

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        message: "Could not extract text from resume",
      });
    }

    const jobDescription = (req.body.jobDescription || "").trim();

    const resumeTextLower = normalizeText(resumeText);
    const jdTextLower = normalizeText(jobDescription);

    // -------------------------
    // JOB DESCRIPTION ANALYSIS
    // -------------------------

    let jdSkills = [];
    let matchedKeywords = [];
    let missingKeywords = [];
    let keywordMatchScore = 0;

    if (jobDescription) {
      jdSkills = SKILLS.filter((skill) =>
        containsSkill(jdTextLower, skill)
      );

      matchedKeywords = jdSkills.filter((skill) =>
        containsSkill(resumeTextLower, skill)
      );

      missingKeywords = jdSkills.filter(
        (skill) => !containsSkill(resumeTextLower, skill)
      );

      keywordMatchScore =
        jdSkills.length > 0
          ? Math.round(
              (matchedKeywords.length / jdSkills.length) * 100
            )
          : 0;
    }

    // -------------------------
    // RESUME SECTIONS
    // -------------------------

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
        /experience|work experience|employment|internship/i.test(
          resumeText
        ),

      education:
        /education|qualification|degree|b\.tech|bachelor|college|university/i.test(
          resumeText
        ),

      projects:
        /projects|project experience|personal projects/i.test(
          resumeText
        )
    };

    const sectionCount =
      Object.values(sections).filter(Boolean).length;

    // Maximum 25 points
    const sectionScore = Math.round(
      (sectionCount / 6) * 25
    );

    // -------------------------
    // WORD COUNT
    // -------------------------

    const words = resumeText
      .split(/\s+/)
      .map((word) => word.trim())
      .filter(Boolean);

    const wordCount = words.length;

    let lengthScore = 0;

    if (wordCount >= 300 && wordCount <= 800) {
      lengthScore = 15;
    } else if (wordCount >= 200 && wordCount <= 1000) {
      lengthScore = 12;
    } else if (wordCount >= 100 && wordCount <= 1200) {
      lengthScore = 8;
    } else {
      lengthScore = 4;
    }

    // -------------------------
    // ACHIEVEMENTS
    // -------------------------

    const measurable =
      /\b\d+%|\b\d+\+|\bincreased\b|\bimproved\b|\breduced\b|\bachieved\b|\bdeployed\b|\bbuilt\b|\bdeveloped\b|\boptimized\b/i.test(
        resumeText
      );

    const achievementScore = measurable ? 15 : 7;

    // -------------------------
    // CONTACT / ATS FORMAT
    // -------------------------

    const contactScore = sections.contact ? 10 : 0;

    // -------------------------
    // KEYWORD SCORE
    // -------------------------

    let keywordScore = 0;

    if (jobDescription && jdSkills.length > 0) {
      keywordScore = Math.round(keywordMatchScore * 0.35);
    } else {
      const resumeSkills = SKILLS.filter((skill) =>
        containsSkill(resumeTextLower, skill)
      );

      keywordScore = Math.min(
        20,
        resumeSkills.length * 2
      );
    }

    // -------------------------
    // FINAL ATS SCORE
    // -------------------------

    let atsScore =
      keywordScore +
      sectionScore +
      lengthScore +
      achievementScore +
      contactScore;

    // Keep score realistic
    atsScore = Math.max(0, Math.min(100, atsScore));

    // -------------------------
    // SUGGESTIONS
    // -------------------------

    const suggestions = [];

    if (jobDescription && missingKeywords.length > 0) {
      suggestions.push(
        `Consider adding relevant keywords: ${missingKeywords.join(", ")}`
      );
    }

    if (!sections.summary) {
      suggestions.push(
        "Add a professional summary near the top of your resume."
      );
    }

    if (!sections.skills) {
      suggestions.push(
        "Add a dedicated Technical Skills section."
      );
    }

    if (!sections.experience) {
      suggestions.push(
        "Add work experience or internship details if applicable."
      );
    }

    if (!sections.projects) {
      suggestions.push(
        "Add relevant projects with technologies and your contribution."
      );
    }

    if (!measurable) {
      suggestions.push(
        "Add measurable achievements using numbers, percentages, or impact."
      );
    }

    if (!sections.contact) {
      suggestions.push(
        "Add clear contact information such as email, phone, LinkedIn, or GitHub."
      );
    }

    if (wordCount < 200) {
      suggestions.push(
        "Resume content appears short. Add relevant skills, projects, experience, and achievements."
      );
    }

    if (wordCount > 1000) {
      suggestions.push(
        "Consider reducing unnecessary content and keeping the resume concise."
      );
    }

    return res.status(200).json({
      message: "Resume analyzed successfully",

      analysis: {
        atsScore,
        keywordMatchScore,
        matchedKeywords,
        missingKeywords,
        jdSkills,
        wordCount,
        sections,
        suggestions
      }
    });

  } catch (error) {
    console.error("Resume analysis error:", error);

    return res.status(500).json({
      message: "Resume analysis failed",
      error: error.message
    });

  } finally {
    // Delete temporary uploaded file after analysis
    if (uploadedFile) {
      try {
        if (fs.existsSync(uploadedFile)) {
          fs.unlinkSync(uploadedFile);
        }
      } catch (deleteError) {
        console.error(
          "Could not delete uploaded file:",
          deleteError.message
        );
      }
    }
  }
};

module.exports = {
  analyzeResume
};
