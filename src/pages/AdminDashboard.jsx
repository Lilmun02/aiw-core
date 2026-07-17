 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase.js";

function AdminDashboard() {
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [reviewingId, setReviewingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [processingFeedbackId, setProcessingFeedbackId] = useState(null);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSubmissions();
    fetchFeedback();
  }, []);

  async function fetchSubmissions() {
    setErrorMessage("");

    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch submissions error:", error);
      setErrorMessage("Could not load pending submissions.");
      return;
    }

    setSubmissions(data || []);
  }

  async function fetchFeedback() {
    setErrorMessage("");

    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch feedback error:", error);
      setErrorMessage("Could not load feedback.");
      return;
    }

    setFeedback(data || []);
  }

  async function handleApprove(tool) {
    setProcessingId(tool.id);
    setMessage("");
    setErrorMessage("");

    const { error: toolError } = await supabase.from("tools").insert([
      {
        company_name: tool.company_name,
        tool_name: tool.tool_name,
        website_url: tool.website_url,
        description: tool.description,
        category: "Other",
        status: "published",
        placement: "standard",
        featured: false,
        published_at: new Date().toISOString(),
      },
    ]);

    if (toolError) {
      console.error("Publish tool error:", toolError);
      setErrorMessage(
        "Approval failed. The database still needs permission to publish tools."
      );
      setProcessingId(null);
      return;
    }

    const { error: submissionError } = await supabase
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", tool.id);

    if (submissionError) {
      console.error("Update submission error:", submissionError);
      setErrorMessage(
        "The tool was published, but the submission status could not be updated."
      );
      setProcessingId(null);
      return;
    }

    setSubmissions((currentSubmissions) =>
      currentSubmissions.filter((submission) => submission.id !== tool.id)
    );

    setReviewingId(null);
    setMessage(`${tool.tool_name} was approved and published.`);
    setProcessingId(null);
  }

  async function handleReject(tool) {
    setProcessingId(tool.id);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", tool.id);

    if (error) {
      console.error("Reject submission error:", error);
      setErrorMessage(
        "Rejection failed. The database still needs permission to update submissions."
      );
      setProcessingId(null);
      return;
    }

    setSubmissions((currentSubmissions) =>
      currentSubmissions.filter((submission) => submission.id !== tool.id)
    );

    setReviewingId(null);
    setMessage(`${tool.tool_name} was rejected.`);
    setProcessingId(null);
  }

  async function updateFeedbackStatus(feedbackItem, newStatus) {
    setProcessingFeedbackId(feedbackItem.id);
    setMessage("");
    setErrorMessage("");

    const { error } = await supabase
      .from("feedback")
      .update({ status: newStatus })
      .eq("id", feedbackItem.id);

    if (error) {
      console.error("Update feedback error:", error);
      setErrorMessage("Could not update the feedback status.");
      setProcessingFeedbackId(null);
      return;
    }

    setFeedback((currentFeedback) =>
      currentFeedback.map((item) =>
        item.id === feedbackItem.id
          ? { ...item, status: newStatus }
          : item
      )
    );

    setMessage(`Feedback marked as ${newStatus}.`);
    setProcessingFeedbackId(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/admin-login");
  }

  function getFeedbackStatusClasses(status) {
    if (status === "resolved") {
      return "bg-emerald-500/10 text-emerald-300";
    }

    if (status === "reviewed") {
      return "bg-blue-500/10 text-blue-300";
    }

    return "bg-yellow-500/10 text-yellow-300";
  }

  const newFeedbackCount = feedback.filter(
    (item) => item.status === "new"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              AIWCORE Control Center
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-slate-400">
              Manage tool submissions and review user feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-fit rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Sign Out
          </button>
        </div>

        {message && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {errorMessage}
          </div>
        )}

        <section className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">
              Pending Submissions
            </h2>

            <span className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-bold text-yellow-300">
              {submissions.length} Pending
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
              <p className="text-xl font-bold">
                No pending submissions
              </p>

              <p className="mt-3 text-slate-400">
                New tool submissions will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {submissions.map((tool) => {
                const isReviewing = reviewingId === tool.id;
                const isProcessing = processingId === tool.id;

                return (
                  <article
                    key={tool.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">
                          {tool.tool_name}
                        </h3>

                        <p className="mt-1 text-slate-400">
                          {tool.company_name}
                        </p>

                        <span className="mt-4 inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-sm font-semibold text-yellow-300">
                          {tool.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setReviewingId(
                            isReviewing ? null : tool.id
                          )
                        }
                        className="w-fit rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-3 font-bold text-blue-300 transition hover:bg-blue-500/20"
                      >
                        {isReviewing ? "Close Review" : "Review"}
                      </button>
                    </div>

                    {isReviewing && (
                      <div className="mt-6 border-t border-slate-800 pt-6">
                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="rounded-2xl bg-slate-950 p-5">
                            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                              Company
                            </p>

                            <p className="mt-2 text-lg">
                              {tool.company_name}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-950 p-5">
                            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                              Website
                            </p>

                            <a
                              href={tool.website_url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 block break-all text-lg text-blue-400 hover:text-blue-300"
                            >
                              {tool.website_url}
                            </a>
                          </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-slate-950 p-5">
                          <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                            Description
                          </p>

                          <p className="mt-3 leading-7 text-slate-300">
                            {tool.description}
                          </p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => handleApprove(tool)}
                            disabled={isProcessing}
                            className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Approve & Publish"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReject(tool)}
                            disabled={isProcessing}
                            className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-14 border-t border-slate-800 pt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Feedback Inbox
              </h2>

              <p className="mt-2 text-slate-400">
                Bug reports, feature requests, and general feedback.
              </p>
            </div>

            <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300">
              {newFeedbackCount} New
            </span>
          </div>

          {feedback.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
              <p className="text-xl font-bold">
                No feedback yet
              </p>

              <p className="mt-3 text-slate-400">
                New feedback submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {feedback.map((item) => {
                const isProcessing =
                  processingFeedbackId === item.id;

                return (
                  <article
                    key={item.id}
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-400">
                          {item.category}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                          {item.title}
                        </h3>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${getFeedbackStatusClasses(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-950 p-5">
                      <p className="leading-7 text-slate-300">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl bg-slate-950 p-5">
                        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                          Contact Email
                        </p>

                        {item.email ? (
                          <a
                            href={`mailto:${item.email}`}
                            className="mt-2 block break-all text-blue-400 hover:text-blue-300"
                          >
                            {item.email}
                          </a>
                        ) : (
                          <p className="mt-2 text-slate-400">
                            Anonymous
                          </p>
                        )}
                      </div>

                      <div className="rounded-2xl bg-slate-950 p-5">
                        <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                          Submitted
                        </p>

                        <p className="mt-2 text-slate-300">
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          updateFeedbackStatus(
                            item,
                            "reviewed"
                          )
                        }
                        disabled={
                          isProcessing ||
                          item.status === "reviewed" ||
                          item.status === "resolved"
                        }
                        className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Mark Reviewed
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateFeedbackStatus(
                            item,
                            "resolved"
                          )
                        }
                        disabled={
                          isProcessing ||
                          item.status === "resolved"
                        }
                        className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Updating..."
                          : "Mark Resolved"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;