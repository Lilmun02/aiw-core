 import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("Login succeeded, but no active session was created.");
      }

      setMessage("Login successful. Redirecting...");

      window.location.replace("/profile");
    } catch (error) {
      setIsError(true);
      setMessage(error.message || "Unable to log in. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-white"
            >
              <span aria-hidden="true">🤖</span>
              <span>AIWCORE</span>
            </Link>

            <h1 className="mt-6 text-3xl font-bold">Welcome back</h1>

            <p className="mt-2 text-sm text-slate-400">
              Log in to access My AIWCORE.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {message && (
              <div
                role="status"
                className={`rounded-xl border px-4 py-3 text-sm ${
                  isError
                    ? "border-red-500/30 bg-red-500/10 text-red-300"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-slate-500 transition hover:text-slate-300"
            >
              Return to AIWCORE
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;