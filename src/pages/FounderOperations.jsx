import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FeedbackArchive from "../components/admin/FeedbackArchive.jsx";
import FeedbackInbox from "../components/admin/FeedbackInbox.jsx";
import FeedbackTabs from "../components/admin/FeedbackTabs.jsx";
import PendingSubmissions from "../components/admin/PendingSubmissions.jsx";
import PublishedListings from "../components/admin/PublishedListings.jsx";
import RemovedListings from "../components/admin/RemovedListings.jsx";
import { isFounderUser } from "../lib/founderAccess.js";
import { supabase } from "../lib/supabase.js";

function FounderOperations() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [publishedTools, setPublishedTools] = useState([]);
  const [removedTools, setRemovedTools] = useState([]);
  const [activeFeedback, setActiveFeedback] = useState([]);
  const [archivedFeedback, setArchivedFeedback] = useState([]);
  const [reviewingId, setReviewingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [processingToolId, setProcessingToolId] = useState(null);
  const [processingFeedbackId, setProcessingFeedbackId] = useState(null);
  const [feedbackTab, setFeedbackTab] = useState("inbox");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyAndLoad() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error || !isFounderUser(session?.user)) {
        navigate("/", { replace: true });
        return;
      }

      await loadDashboard();
    }

    verifyAndLoad();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted && !isFounderUser(session?.user)) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function loadDashboard() {
    setIsLoading(true);
    setErrorMessage("");

    const [submissionsResult, publishedResult, removedResult, feedbackResult] =
      await Promise.all([
        supabase
          .from("submissions")
          .select("id, company_name, tool_name, website_url, description, category, status, created_at, owner_id")
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
        supabase
          .from("tools")
          .select("id, company_name, tool_name, website_url, description, category, status, placement, featured, published_at, owner_id")
          .eq("status", "published")
          .order("published_at", { ascending: false }),
        supabase
          .from("tools")
          .select("id, company_name, tool_name, website_url, description, category, status, placement, featured, published_at, owner_id")
          .eq("status", "removed")
          .order("published_at", { ascending: false }),
        supabase
          .from("feedback")
          .select("id, title, email, description, status, created_at")
          .order("created_at", { ascending: false }),
      ]);

    const firstError =
      submissionsResult.error ||
      publishedResult.error ||
      removedResult.error ||
      feedbackResult.error;

    if (firstError) {
      console.error("Founder operations load error:", firstError);
      setErrorMessage("Some founder operations data could not be loaded.");
    }

    setSubmissions(submissionsResult.data || []);
    setPublishedTools(publishedResult.data || []);
    setRemovedTools(removedResult.data || []);

    const feedback = (feedbackResult.data || []).map((item) => ({
      ...item,
      name: item.title || "",
      message: item.description || "",
    }));
    setActiveFeedback(feedback.filter((item) => item.status !== "archived"));
    setArchivedFeedback(feedback.filter((item) => item.status === "archived"));
    setIsLoading(false);
  }

  function clearMessages() {
    setMessage("");
    setErrorMessage("");
  }

  function resolveItem(value, collection) {
    if (value && typeof value === "object") return value;
    return collection.find((item) => item.id === value);
  }

  function toggleReview(value) {
    const id = value && typeof value === "object" ? value.id : value;
    setReviewingId((current) => (current === id ? null : id));
  }

  async function handleApprove(value) {
    const submission = resolveItem(value, submissions);
    if (!submission) return;

    setProcessingId(submission.id);
    clearMessages();

    const { data, error } = await supabase.rpc("approve_submission", {
      p_submission_id: submission.id,
    });

    setProcessingId(null);

    if (error) {
      console.error("Approve submission error:", error);
      setErrorMessage(error.message || "Approval failed.");
      return;
    }

    const publishedTool = Array.isArray(data) ? data[0] : data;
    setSubmissions((current) =>
      current.filter((item) => item.id !== submission.id),
    );
    if (publishedTool) {
      setPublishedTools((current) => [publishedTool, ...current]);
    } else {
      await loadDashboard();
    }
    setReviewingId(null);
    setMessage(`${submission.tool_name} was approved and published.`);
  }

  async function handleReject(value) {
    const submission = resolveItem(value, submissions);
    if (!submission) return;

    setProcessingId(submission.id);
    clearMessages();

    const { error } = await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", submission.id);

    setProcessingId(null);

    if (error) {
      setErrorMessage("Rejection failed.");
      return;
    }

    setSubmissions((current) =>
      current.filter((item) => item.id !== submission.id),
    );
    setReviewingId(null);
    setMessage(`${submission.tool_name} was rejected.`);
  }

  async function updateTool(tool, changes, successMessage) {
    setProcessingToolId(tool.id);
    clearMessages();

    const { data, error } = await supabase
      .from("tools")
      .update(changes)
      .eq("id", tool.id)
      .select()
      .single();

    setProcessingToolId(null);

    if (error) {
      setErrorMessage("The listing could not be updated.");
      return null;
    }

    setMessage(successMessage);
    return data;
  }

  async function handleRemoveTool(value) {
    const tool = resolveItem(value, publishedTools);
    if (!tool) return;
    const data = await updateTool(
      tool,
      { status: "removed" },
      `${tool.tool_name} was removed from public listings.`,
    );
    if (!data) return;
    setPublishedTools((current) => current.filter((item) => item.id !== tool.id));
    setRemovedTools((current) => [data, ...current]);
  }

  async function handleRestoreTool(value) {
    const tool = resolveItem(value, removedTools);
    if (!tool) return;
    const data = await updateTool(
      tool,
      { status: "published", published_at: new Date().toISOString() },
      `${tool.tool_name} was restored.`,
    );
    if (!data) return;
    setRemovedTools((current) => current.filter((item) => item.id !== tool.id));
    setPublishedTools((current) => [data, ...current]);
  }

  async function handleFeatureTool(value) {
    const tool = resolveItem(value, publishedTools);
    if (!tool) return;
    const featured = !tool.featured;
    const data = await updateTool(
      tool,
      { featured },
      featured
        ? `${tool.tool_name} is now featured.`
        : `${tool.tool_name} is no longer featured.`,
    );
    if (!data) return;
    setPublishedTools((current) =>
      current.map((item) => (item.id === tool.id ? data : item)),
    );
  }

  async function handlePermanentDelete(value) {
    const tool = resolveItem(value, removedTools);
    if (!tool) return;

    if (!window.confirm(`Permanently delete "${tool.tool_name}"?`)) return;
    if (window.prompt("Type DELETE to confirm.") !== "DELETE") return;

    setProcessingToolId(tool.id);
    clearMessages();
    const { error } = await supabase.from("tools").delete().eq("id", tool.id);
    setProcessingToolId(null);

    if (error) {
      setErrorMessage("Could not permanently delete this listing.");
      return;
    }

    setRemovedTools((current) => current.filter((item) => item.id !== tool.id));
    setMessage(`${tool.tool_name} was permanently deleted.`);
  }

  async function updateFeedbackStatus(value, status) {
    const item = resolveItem(value, [...activeFeedback, ...archivedFeedback]);
    if (!item) return;

    setProcessingFeedbackId(item.id);
    clearMessages();
    const { data, error } = await supabase
      .from("feedback")
      .update({ status })
      .eq("id", item.id)
      .select()
      .single();
    setProcessingFeedbackId(null);

    if (error) {
      setErrorMessage("Could not update the feedback status.");
      return;
    }

    const normalizedData = data
      ? {
          ...data,
          name: data.title || "",
          message: data.description || "",
        }
      : data;

    if (status === "archived") {
      setActiveFeedback((current) => current.filter((entry) => entry.id !== item.id));
      setArchivedFeedback((current) => [normalizedData, ...current]);
    } else {
      setActiveFeedback((current) =>
        current.map((entry) => (entry.id === item.id ? normalizedData : entry)),
      );
    }
    setMessage(`Feedback marked as ${status}.`);
  }

  async function restoreFeedback(value) {
    const item = resolveItem(value, archivedFeedback);
    if (!item) return;

    setProcessingFeedbackId(item.id);
    clearMessages();
    const { data, error } = await supabase
      .from("feedback")
      .update({ status: "reviewed" })
      .eq("id", item.id)
      .select()
      .single();
    setProcessingFeedbackId(null);

    if (error) {
      setErrorMessage("Could not restore the archived feedback.");
      return;
    }

    const normalizedData = data
      ? {
          ...data,
          name: data.title || "",
          message: data.description || "",
        }
      : data;

    setArchivedFeedback((current) => current.filter((entry) => entry.id !== item.id));
    setActiveFeedback((current) => [normalizedData, ...current]);
    setMessage("Feedback restored to the active inbox.");
  }

  const newFeedbackCount = activeFeedback.filter(
    (item) => item.status === "new",
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Founder Control
            </p>
            <h1 className="mt-3 text-4xl font-extrabold">Platform Operations</h1>
            <p className="mt-3 text-slate-400">
              Manage submissions, listings, and user feedback.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/founder/lilmun")}
            className="w-fit rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            ← Founder Control
          </button>
        </header>

        {message && <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">{message}</div>}
        {errorMessage && <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{errorMessage}</div>}

        {isLoading ? (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-lg font-bold">Loading operations...</p>
          </div>
        ) : (
          <>
            <PendingSubmissions
              submissions={submissions}
              tools={submissions}
              reviewingId={reviewingId}
              processingId={processingId}
              setReviewingId={setReviewingId}
              onToggleReview={toggleReview}
              onApprove={handleApprove}
              handleApprove={handleApprove}
              onReject={handleReject}
              handleReject={handleReject}
            />
            <PublishedListings
              listings={publishedTools}
              tools={publishedTools}
              publishedTools={publishedTools}
              processingId={processingToolId}
              processingToolId={processingToolId}
              onFeature={handleFeatureTool}
              handleFeatureTool={handleFeatureTool}
              onRemove={handleRemoveTool}
              handleRemoveTool={handleRemoveTool}
            />
            <RemovedListings
              listings={removedTools}
              tools={removedTools}
              removedTools={removedTools}
              processingId={processingToolId}
              processingToolId={processingToolId}
              onRestore={handleRestoreTool}
              handleRestoreTool={handleRestoreTool}
              onPermanentDelete={handlePermanentDelete}
              handlePermanentDelete={handlePermanentDelete}
              onDelete={handlePermanentDelete}
              handleDelete={handlePermanentDelete}
            />

            <section className="mt-14 border-t border-slate-800 pt-10">
              <h2 className="text-2xl font-bold">Feedback</h2>
              <p className="mt-2 text-slate-400">Review active feedback or manage archived records.</p>
              <FeedbackTabs
                activeTab={feedbackTab}
                setActiveTab={setFeedbackTab}
                onTabChange={setFeedbackTab}
                inboxCount={activeFeedback.length}
                activeCount={activeFeedback.length}
                newCount={newFeedbackCount}
                archiveCount={archivedFeedback.length}
                archivedCount={archivedFeedback.length}
              />
              {feedbackTab === "inbox" ? (
                <FeedbackInbox
                  feedback={activeFeedback}
                  items={activeFeedback}
                  activeFeedback={activeFeedback}
                  processingFeedbackId={processingFeedbackId}
                  processingId={processingFeedbackId}
                  onReview={(item) => updateFeedbackStatus(item, "reviewed")}
                  onResolve={(item) => updateFeedbackStatus(item, "resolved")}
                  onArchive={(item) => updateFeedbackStatus(item, "archived")}
                  updateFeedbackStatus={updateFeedbackStatus}
                />
              ) : (
                <FeedbackArchive
                  feedback={archivedFeedback}
                  items={archivedFeedback}
                  archivedFeedback={archivedFeedback}
                  processingFeedbackId={processingFeedbackId}
                  processingId={processingFeedbackId}
                  onRestore={restoreFeedback}
                  restoreFeedback={restoreFeedback}
                />
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default FounderOperations;
