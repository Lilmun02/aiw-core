 import { useState } from "react";
import { supabase } from "../lib/supabase";

function FeedbackForm() {
  const [category, setCategory] = useState("General Feedback");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const { error } = await supabase.from("feedback").insert([
      {
        category,
        title,
        description,
        email: email || null,
        status: "new",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
      return;
    }

    setMessage("Thank you! Your feedback was submitted.");
    setCategory("General Feedback");
    setTitle("");
    setDescription("");
    setEmail("");
  }

  return (
    <section className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Help Shape AIWCORE
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Send Feedback
        </h2>

        <p className="mt-2 text-slate-400">
          Report a bug, suggest a feature, or tell us what you think.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <select
  id="feedback-category"
  name="category"
  value={category}
  onChange={(event) => setCategory(event.target.value)}
  autoComplete="off"
  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
>
  <option>General Feedback</option>
  <option>Bug Report</option>
  <option>Feature Request</option>
</select>

        <input
          id="feedback-title"
          name="title"
          type="text"
          placeholder="Feedback title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoComplete="off"
          required
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <textarea
          id="feedback-description"
          name="description"
          placeholder="Tell us more..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          autoComplete="off"
          required
          rows="5"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <input
          id="feedback-email"
          name="email"
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
        />

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Submit Feedback
        </button>

        {message && (
          <p className="text-sm text-slate-300">
            {message}
          </p>
        )}
      </form>
    </section>
  );
}

export default FeedbackForm;