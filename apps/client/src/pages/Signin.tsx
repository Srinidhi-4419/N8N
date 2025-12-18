"use client";

import { useState } from "react";
import { apiSignin, setAuthToken } from "../lib/http"; // adjust path
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiSignin(form);
      setAuthToken(res.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center">Sign In</h2>

        <div className="mt-6 space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          New here?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create account
          </a>
        </p>
      </form>
    </div>
  );
}
