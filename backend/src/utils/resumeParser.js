const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractResumeText = async (filePath, mimetype) => {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".pdf" || mimetype === "application/pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    return data.text.trim();
  }

  if (
    extension === ".docx" ||
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      path: filePath,
    });

    return result.value.trim();
  }

  throw new Error("Unsupported resume format");
};

module.exports = {
  extractResumeText,
};
