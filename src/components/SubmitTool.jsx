 import { useState } from "react";
import { supabase } from "../lib/supabase.js";

function SubmitTool() {
  const initialForm = {
    company: "",
    tool: "",
    website: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    if (submitted) {
      setSubmitted(false);
    }

    if (errorMessage) {
      setErrorMessage("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitted(false);
    setErrorMessage("");

    const { error } = await supabase.from("submissions").insert([
      {
        company_name: form.company.trim(),
        tool_name: form.tool.trim(),
        website_url: form.website.trim(),
        description: form.description.trim(),
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Submission error:", error);
      setErrorMessage(
        "We could not submit your tool right now. Please try again."
      );
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setForm(initialForm);
    setIsSubmitting(false);
  }

  return (
    <section
      id="submit-tool"
      className="scroll-mt-24 mt-20 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Join AIWCORE
        </p>

        <h2 className="mt-3 text-4xl font-bold text-white">
          Submit Your AI Tool
        </h2>

        <p className="mt-4 text-slate-400">
          Own an AI product? Submit your tool to AIWCORE and help users discover
          what you&apos;ve built.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <input
            type="text"
            name="tool"
            value={form.tool}
            onChange={handleChange}
            placeholder="AI Tool Name"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website URL"
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your AI tool..."
            required
            disabled={isSubmitting}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full rounded-xl py-4 text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
              submitted
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {isSubmitting
              ? "Submitting..."
              : submitted
                ? "✓ Submitted"
                : "Submit Tool"}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h3 className="text-lg font-bold text-red-300">
              Submission Failed
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {errorMessage}
            </p>
          </div>
        )}

        {submitted && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
            <h3 className="text-lg font-bold text-emerald-300">
              ✅ Submission Received
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Thank you for submitting your AI tool!
              <br />
              Our team will review your submission and contact you if additional
              information is needed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default SubmitTool;