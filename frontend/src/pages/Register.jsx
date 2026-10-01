import { useState } from "react";
import { registerUser } from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
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
    setMessage("");
    setLoading(true);

    try {
      const data = await registerUser(form);
      setMessage(data.message);
      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Registration failed"
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
          Create Account
        </h1>

        <p className="mt-2 text-slate-400">
          Create your AI Resume Analyzer account
        </p>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="mt-6 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          minLength="8"
          required
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default Register;
