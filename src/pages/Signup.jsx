import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: {
        data: {
          name: formData.name.trim(),
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "✅ Account created! Your device may offer to save this password for faster future logins. Check your email if confirmation is required.",
    );

    setFormData((current) => ({
      ...current,
      name: "",
      password: "",
    }));
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Create Your AIWCORE Account
        </h1>

        <p className="mb-6 text-slate-400">Join the AI discovery platform.</p>

        <form onSubmit={handleSignup} autoComplete="on" className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
          />

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            />
            <p className="mt-2 text-xs text-slate-500">
              Your phone or browser can generate and save your password so it can autofill when you return. AIWCORE does not store a readable copy of your password.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-black transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm text-white">{message}</p>
        )}
      </div>
    </div>
  );
}
