import { useState } from "react";
import { loginUser } from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      await loginUser(form);

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >
        <h1 className="text-3xl font-bold text-white">
          Login
        </h1>

        <p className="mt-2 text-slate-400">
          Login to AI Resume Analyzer
        </p>

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-400">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;
