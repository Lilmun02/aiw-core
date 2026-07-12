 import { useState } from "react";

function SubmitTool() {
  const initialForm = {
    company: "",
    tool: "",
    website: "",
    description: "",
  };

  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    if (submitted) {
      setSubmitted(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSubmitted(true);
    setForm(initialForm);
  }

  return (
    <section
      id="submit-tool"
      className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl"
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
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="text"
            name="tool"
            value={form.tool}
            onChange={handleChange}
            placeholder="AI Tool Name"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website URL"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <textarea
            rows="5"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your AI tool..."
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className={`w-full rounded-xl py-4 text-lg font-bold text-white transition ${
              submitted
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {submitted ? "✓ Submitted" : "Submit Tool"}
          </button>
        </form>

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