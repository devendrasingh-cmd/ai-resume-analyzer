import { useEffect, useState } from "react";
import ResumeUpload from "../components/ResumeUpload";
import { getProfile, logoutUser } from "../services/api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
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

          <div className="mt-2 flex justify-between">
            <p className="text-xs text-slate-500">
              {jobDescription.length} characters
            </p>

            {jobDescription.trim() && (
              <p className="text-xs text-green-400">
                Job description added
              </p>
            )}
          </div>

        </div>

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
            />
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;
