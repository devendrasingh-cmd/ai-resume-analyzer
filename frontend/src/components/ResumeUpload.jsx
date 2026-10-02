import { useRef, useState } from "react";
import API from "../services/api";

function ResumeUpload({ jobDescription, onAnalysisComplete }) {
  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      setMessage("Only PDF, DOC and DOCX files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Resume size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription || "");

    setLoading(true);
    setMessage("");
    setAnalysis(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please login first.");
        return;
      }

      const response = await API.post(
        "/resumes/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data.analysis || null;

      setMessage(
        response.data.message || "Resume analyzed successfully."
      );

      setAnalysis(result);

      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error("Resume analysis error:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Resume analysis failed."
      );
    } finally {
      setLoading(false);

      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const openFilePicker = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Needs Major Improvement";
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
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* ATS Score */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  ATS Compatibility Score
                </p>

                <p className="mt-2 text-6xl font-bold text-blue-500">
                  {analysis.atsScore ?? 0}%
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {getScoreLabel(Number(analysis.atsScore) || 0)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-5">
                <p className="text-xs text-slate-500">
                  Job Match
                </p>

                <p className="mt-1 text-3xl font-bold text-green-400">
                  {analysis.keywordMatchScore ?? 0}%
                </p>
              </div>

            </div>
          </div>

          {/* Matched Keywords */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                Matched Keywords
              </h4>

              <span className="rounded-full bg-green-900/40 px-3 py-1 text-xs text-green-300">
                {analysis.matchedKeywords?.length || 0}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.matchedKeywords?.length > 0 ? (
                analysis.matchedKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-green-900/40 px-3 py-1 text-sm text-green-300"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No matched keywords found.
                </p>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">
                Missing Keywords
              </h4>

              <span className="rounded-full bg-red-900/40 px-3 py-1 text-xs text-red-300">
                {analysis.missingKeywords?.length || 0}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.missingKeywords?.length > 0 ? (
                analysis.missingKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-red-900/40 px-3 py-1 text-sm text-red-300"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-green-400">
                  No important missing keywords found.
                </p>
              )}
            </div>
          </div>

          {/* Resume Information */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <h4 className="text-lg font-semibold">
              Resume Information
            </h4>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-xs text-slate-500">
                  Word Count
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {analysis.wordCount ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-xs text-slate-500">
                  Job Keywords
                </p>

                <p className="mt-1 text-xl font-semibold">
                  {analysis.jdSkills?.length ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-xs text-slate-500">
                  Matched
                </p>

                <p className="mt-1 text-xl font-semibold text-green-400">
                  {analysis.matchedKeywords?.length ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-slate-900 p-4">
                <p className="text-xs text-slate-500">
                  Missing
                </p>

                <p className="mt-1 text-xl font-semibold text-red-400">
                  {analysis.missingKeywords?.length ?? 0}
                </p>
              </div>

            </div>
          </div>

          {/* Sections */}
          {analysis.sections && (
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
              <h4 className="text-lg font-semibold">
                Resume Sections
              </h4>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {Object.entries(analysis.sections).map(
                  ([section, present]) => (
                    <div
                      key={section}
                      className="flex items-center justify-between rounded-xl bg-slate-900 p-4"
                    >
                      <span className="capitalize text-sm">
                        {section}
                      </span>

                      <span
                        className={
                          present
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {present ? "? Found" : "? Missing"}
                      </span>
                    </div>
                  )
                )}

              </div>
            </div>
          )}

          {/* Suggestions */}
          <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
            <h4 className="text-lg font-semibold">
              Resume Improvement Suggestions
            </h4>

            {analysis.suggestions?.length > 0 ? (
              <div className="mt-4 space-y-3">
                {analysis.suggestions.map(
                  (suggestion, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-4"
                    >
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold">
                          {index + 1}
                        </span>

                        <p className="text-sm leading-6 text-slate-300">
                          {suggestion}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-green-400">
                No major suggestions.
              </p>
            )}
          </div>

          {/* Job Description */}
          {analysis.jobDescription && (
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-6">
              <h4 className="text-lg font-semibold">
                Job Description Used
              </h4>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">
                {analysis.jobDescription}
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
