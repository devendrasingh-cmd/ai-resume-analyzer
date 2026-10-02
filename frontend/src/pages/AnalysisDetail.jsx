import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ScoreBar({ label, value, max, description }) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <p className="text-lg font-bold text-blue-400">
          {value}/{max}
        </p>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get(`/analyses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAnalysis(response.data.analysis);
      } catch (err) {
        console.error("Analysis detail error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load analysis"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading analysis...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-700"
        >
          Back to Dashboard
        </button>

        <p className="mt-6 text-red-400">
          {error || "Analysis not found"}
        </p>
      </div>
    );
  }

  const atsScore = Number(analysis.atsScore) || 0;
  const keywordScore = Number(analysis.keywordMatchScore) || 0;

  const sectionValues = analysis.sections
    ? Object.values(analysis.sections)
    : [];

  const sectionsFound = sectionValues.filter(Boolean).length;

  const wordCount = Number(analysis.wordCount) || 0;

  let scoreStatus = "Needs Improvement";
  let scoreMessage =
    "Your resume needs more optimization for ATS compatibility.";

  if (atsScore >= 80) {
    scoreStatus = "Strong Resume";
    scoreMessage =
      "Your resume has a strong ATS-friendly structure.";
  } else if (atsScore >= 60) {
    scoreStatus = "Good Foundation";
    scoreMessage =
      "Your resume has a good foundation but can still be improved.";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div>
            <h1 className="text-xl font-bold">
              AI Resume Analyzer
            </h1>

            <p className="text-xs text-slate-500">
              ATS Analysis Report
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div>
          <p className="text-sm text-blue-400">
            Resume Analysis Report
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {analysis.resumeName}
          </h2>

          {analysis.createdAt && (
            <p className="mt-2 text-sm text-slate-500">
              Analyzed on{" "}
              {new Date(
                analysis.createdAt
              ).toLocaleString()}
            </p>
          )}
        </div>

        {/* Main Score */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center lg:col-span-1">

            <p className="text-sm text-slate-400">
              Overall ATS Score
            </p>

            <p className="mt-4 text-7xl font-bold text-blue-400">
              {atsScore}
            </p>

            <p className="text-2xl text-slate-500">
              / 100
            </p>

            <p className="mt-5 text-lg font-semibold">
              {scoreStatus}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {scoreMessage}
            </p>

          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Keyword Match
              </p>

              <p className="mt-2 text-4xl font-bold text-green-400">
                {keywordScore}%
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Job description keywords matched
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Word Count
              </p>

              <p className="mt-2 text-4xl font-bold text-purple-400">
                {wordCount}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Words detected in resume
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Sections Detected
              </p>

              <p className="mt-2 text-4xl font-bold text-yellow-400">
                {sectionsFound}/6
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Important resume sections
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">
                Missing Keywords
              </p>

              <p className="mt-2 text-4xl font-bold text-red-400">
                {analysis.missingKeywords?.length || 0}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Keywords to consider adding
              </p>
            </div>

          </div>
        </div>

        {/* Score Breakdown */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-semibold">
            ATS Score Breakdown
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Factors contributing to your resume's ATS score.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <ScoreBar
              label="Keyword Match"
              value={Math.round(keywordScore * 0.4)}
              max={40}
              description="Job-specific keyword relevance"
            />

            <ScoreBar
              label="Resume Sections"
              value={Math.round((sectionsFound / 6) * 20)}
              max={20}
              description="Important resume sections"
            />

            <ScoreBar
              label="Resume Length"
              value={
                wordCount >= 300 && wordCount <= 800
                  ? 10
                  : wordCount >= 200 && wordCount <= 1000
                  ? 7
                  : wordCount >= 100 && wordCount <= 1200
                  ? 4
                  : 2
              }
              max={10}
              description="Resume content length"
            />

            <ScoreBar
              label="Contact Information"
              value={
                (analysis.sections?.contact ? 3 : 0) +
                (analysis.sections?.contact &&
                /linkedin/i.test(
                  analysis.jobDescription || ""
                )
                  ? 1
                  : 0)
              }
              max={5}
              description="Contact and professional profile information"
            />

            <ScoreBar
              label="Achievements"
              value={
                analysis.suggestions?.some((item) =>
                  item.toLowerCase().includes("measurable")
                )
                  ? 0
                  : 10
              }
              max={10}
              description="Measurable accomplishments"
            />

            <ScoreBar
              label="Structure"
              value={Math.min(5, sectionsFound)}
              max={5}
              description="ATS-friendly resume structure"
            />

          </div>
        </section>

        {/* Job Description */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-semibold">
            Target Job Description
          </h3>

          <div className="mt-4 rounded-xl bg-slate-950 p-5">

            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {analysis.jobDescription ||
                "No job description was provided. This analysis was performed as a general resume analysis."}
            </p>

          </div>
        </section>

        {/* Keywords */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-xl font-semibold">
              Matched Keywords
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Skills detected in both the job description and resume.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {analysis.matchedKeywords?.length ? (
                analysis.matchedKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-green-900/40 px-3 py-1.5 text-sm text-green-300"
                  >
                    ? {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No matched keywords found.
                </p>
              )}

            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="text-xl font-semibold">
              Missing Keywords
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Skills mentioned in the job description but not detected in the resume.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {analysis.missingKeywords?.length ? (
                analysis.missingKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-red-900/40 px-3 py-1.5 text-sm text-red-300"
                  >
                    + {keyword}
                  </span>
                ))
              ) : (
                <p className="text-sm text-green-400">
                  No important missing keywords detected.
                </p>
              )}

            </div>
          </section>

        </div>

        {/* Resume Sections */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-semibold">
            Resume Sections
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            {Object.entries(
              analysis.sections || {}
            ).map(([section, present]) => (

              <div
                key={section}
                className="flex items-center justify-between rounded-xl bg-slate-950 p-4"
              >

                <span className="capitalize text-sm text-slate-300">
                  {section}
                </span>

                <span
                  className={
                    present
                      ? "text-sm font-semibold text-green-400"
                      : "text-sm font-semibold text-red-400"
                  }
                >
                  {present ? "? Found" : "? Missing"}
                </span>

              </div>

            ))}

          </div>
        </section>

        {/* Suggestions */}
        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-semibold">
            Improvement Suggestions
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Recommendations generated from the resume analysis.
          </p>

          {analysis.suggestions?.length ? (

            <div className="mt-5 space-y-3">

              {analysis.suggestions.map(
                (suggestion, index) => (

                  <div
                    key={index}
                    className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
                      {index + 1}
                    </span>

                    <p className="text-sm leading-6 text-slate-300">
                      {suggestion}
                    </p>

                  </div>

                )
              )}

            </div>

          ) : (

            <p className="mt-5 text-green-400">
              No major suggestions.
            </p>

          )}

        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-700"
          >
            Analyze Another Resume
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 font-semibold hover:bg-slate-800"
          >
            Print / Save Report
          </button>

        </div>

      </main>
    </div>
  );
}

export default AnalysisDetail;
