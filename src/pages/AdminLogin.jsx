import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase.js";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSigningIn(true);
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error("Admin login error:", error);
      setErrorMessage("Incorrect email or password.");
      setIsSigningIn(false);
      return;
    }

    navigate("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070d1a] px-5 text-white">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <div className="text-center">
          <span className="text-5xl">🤖</span>

          <h1 className="mt-4 text-3xl font-extrabold">
            AIWCORE Admin
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Sign in to review submissions and manage the platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              disabled={isSigningIn}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              disabled={isSigningIn}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningIn ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <a
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          ← Return to AIWCORE
        </a>
      </section>
    </main>
  );
}

export default AdminLogin;