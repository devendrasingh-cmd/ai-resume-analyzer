import { useEffect, useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import {
  getProfile,
  getAnalysisHistory,
  logoutUser,
  deleteAnalysis,
} from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);

      const data = await getAnalysisHistory();

      setHistory(data.analyses || []);
    } catch (error) {
      console.error("History error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
        loadHistory();
      })
      .catch((error) => {
        console.error("Profile error:", error);
        logoutUser();
        window.location.href = "/login";
      });
  }, []);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  const handleAnalysisComplete = () => {
    loadHistory();
  };

  const handleDeleteAnalysis = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?"
    );

    if (!confirmed) return;

    try {
      await deleteAnalysis(id);

      setHistory((prev) =>
        prev.filter((item) => item._id !== id)
      );

      alert("Analysis deleted successfully.");
    } catch (error) {
      console.error("Delete analysis error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete analysis"
      );
    }
  };

  const totalAnalyses = history.length;

  const averageScore =
    totalAnalyses > 0
      ? Math.round(
          history.reduce(
            (sum, item) => sum + (Number(item.atsScore) || 0),
            0
          ) / totalAnalyses
        )
      : 0;

  const highestScore =
    totalAnalyses > 0
      ? Math.max(
          ...history.map(
            (item) => Number(item.atsScore) || 0
          )
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <nav className="border-b border-slate-800 bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <h1 className="text-xl font-bold">
            AI Resume Analyzer
          </h1>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-10">

        <h2 className="text-3xl font-bold">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h2>

        <p className="mt-2 text-slate-400">
          Analyze your resume with or without a specific job description.
        </p>

        {/* Statistics */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Total Analyses
            </p>

            <p className="mt-2 text-4xl font-bold text-blue-400">
              {totalAnalyses}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Resumes analyzed
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Average ATS Score
            </p>

            <p className="mt-2 text-4xl font-bold text-green-400">
              {averageScore}%
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Across all analyses
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Highest ATS Score
            </p>

            <p className="mt-2 text-4xl font-bold text-purple-400">
              {highestScore}%
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Best resume score
            </p>
          </div>

        </div>

        {/* Job Description */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-semibold">
            Job Description
            <span className="ml-2 text-sm font-normal text-slate-500">
              (Optional)
            </span>
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Paste a job description if you want a job-specific ATS analysis.
          </p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Optional: Paste the job description here..."
            rows={9}
            className="mt-5 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            {jobDescription.length} characters
          </p>

        </div>

        {/* Resume Upload */}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h3 className="text-xl font-semibold">
            Resume Analysis
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Upload your PDF, DOC or DOCX resume.
          </p>

          <div className="mt-5">
            <ResumeUpload
              jobDescription={jobDescription}
              onAnalysisComplete={handleAnalysisComplete}
            />
          </div>

        </div>

        {/* Previous Analyses */}

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-xl font-semibold">
                Previous Analyses
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Your previous resume analysis results.
              </p>
            </div>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {history.length}
            </span>

          </div>

          {historyLoading ? (

            <p className="mt-6 text-sm text-slate-400">
              Loading history...
            </p>

          ) : history.length === 0 ? (

            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-6 text-center">
              <p className="text-slate-400">
                No previous analyses yet.
              </p>
            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {history.map((item) => (

                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-700 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="min-w-0">

                    <p className="truncate font-semibold">
                      {item.resumeName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center gap-4">

                    <div className="text-right">

                      <p className="text-xs text-slate-500">
                        ATS Score
                      </p>

                      <p className="text-2xl font-bold text-blue-400">
                        {item.atsScore}%
                      </p>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => {
                          window.location.href = `/analysis/${item._id}`;
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteAnalysis(item._id)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>
    </div>
  );
}

export default Dashboard;
