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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "✅ Account created! Check your email if confirmation is required."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2">
          Create Your AIWCORE Account
        </h1>

        <p className="text-slate-400 mb-6">
          Join the AI discovery platform.
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg p-3 bg-slate-800 text-white border border-slate-700"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg p-3 bg-slate-800 text-white border border-slate-700"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg p-3 bg-slate-800 text-white border border-slate-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition rounded-lg p-3 font-semibold text-black"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm text-white">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}