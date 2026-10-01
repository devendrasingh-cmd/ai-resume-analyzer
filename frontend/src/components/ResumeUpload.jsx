import { useRef, useState } from "react";
import API from "../services/api";

function ResumeUpload({ jobDescription }) {
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const openFilePicker = () => {
    if (loading) return;

    setMessage("");
    fileInputRef.current?.click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx"
    ];

    const extension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setMessage(
        "Please select a PDF, DOC or DOCX file."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "File size must be less than 5 MB."
      );
      e.target.value = "";
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);
    formData.append(
      "jobDescription",
      jobDescription || ""
    );

    setLoading(true);
    setMessage("");
    setAnalysis(null);

    try {
      const response = await API.post(
        "/resumes/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAnalysis(
        response.data.analysis || null
      );

      setMessage(
        response.data.message ||
        "Resume analyzed successfully"
      );

    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
        "Resume analysis failed"
      );

    } finally {
      setLoading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
        className="hidden"
      />

      <button
        type="button"
        onClick={openFilePicker}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Analyzing Resume..."
          : "Upload & Analyze Resume"}
      </button>

      <p className="mt-2 text-xs text-slate-500">
        PDF, DOC or DOCX • Maximum 5 MB
      </p>

      {message && (
        <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
          {message}
        </div>
      )}

      {analysis && (
        <div className="mt-6 space-y-5">

          {/* ATS SCORE */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <p className="text-sm text-slate-400">
              ATS Score
            </p>

            <p className="mt-2 text-6xl font-bold text-blue-500">
              {analysis.atsScore ?? 0}%
            </p>

            {jobDescription?.trim() && (
              <p className="mt-2 text-sm text-slate-400">
                Job Description Match:{" "}
                <span className="font-semibold text-white">
                  {analysis.keywordMatchScore ?? 0}%
                </span>
              </p>
            )}

            {!jobDescription?.trim() && (
              <p className="mt-2 text-sm text-slate-400">
                General resume ATS analysis
              </p>
            )}
          </div>

          {/* MATCHED KEYWORDS */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <h4 className="text-lg font-semibold">
              Matched Keywords
            </h4>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.matchedKeywords?.length > 0 ? (
                analysis.matchedKeywords.map(
                  (keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-green-900/40 px-3 py-1 text-sm text-green-300"
                    >
                      {keyword}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-slate-500">
                  No job-specific keywords matched.
                </p>
              )}
            </div>
          </div>

          {/* MISSING KEYWORDS */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <h4 className="text-lg font-semibold">
              Missing Keywords
            </h4>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.missingKeywords?.length > 0 ? (
                analysis.missingKeywords.map(
                  (keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-red-900/40 px-3 py-1 text-sm text-red-300"
                    >
                      {keyword}
                    </span>
                  )
                )
              ) : (
                <p className="text-sm text-green-400">
                  No important missing keywords.
                </p>
              )}
            </div>
          </div>

          {/* RESUME INFORMATION */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <h4 className="text-lg font-semibold">
              Resume Information
            </h4>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Word Count
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {analysis.wordCount ?? 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Keyword Match
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {analysis.keywordMatchScore ?? 0}%
                </p>
              </div>

            </div>
          </div>

          {/* SECTIONS */}
          {analysis.sections && (
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
              <h4 className="text-lg font-semibold">
                Resume Sections
              </h4>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(
                  analysis.sections
                ).map(([section, present]) => (
                  <div
                    key={section}
                    className="flex items-center justify-between rounded-lg bg-slate-900 p-3"
                  >
                    <span className="capitalize text-slate-300">
                      {section}
                    </span>

                    <span
                      className={
                        present
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {present
                        ? "Present"
                        : "Missing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUGGESTIONS */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <h4 className="text-lg font-semibold">
              Suggestions
            </h4>

            {analysis.suggestions?.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {analysis.suggestions.map(
                  (suggestion, index) => (
                    <li
                      key={index}
                      className="rounded-lg bg-slate-900 p-3 text-sm text-slate-300"
                    >
                      {index + 1}. {suggestion}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-green-400">
                No major suggestions.
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

export default ResumeUpload;
