import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FeedbackArchive from "../components/admin/FeedbackArchive.jsx";
import FeedbackInbox from "../components/admin/FeedbackInbox.jsx";
import FeedbackTabs from "../components/admin/FeedbackTabs.jsx";
import PendingSubmissions from "../components/admin/PendingSubmissions.jsx";
import PublishedListings from "../components/admin/PublishedListings.jsx";
import RemovedListings from "../components/admin/RemovedListings.jsx";
import { supabase } from "../lib/supabase.js";

const FOUNDER_EMAIL = "lilmunofficial18@gmail.com";

function AdminDashboard() {
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

    async function verifyAdminAndLoad() {
      setIsLoading(true);
      setErrorMessage("");

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const signedInEmail = session?.user?.email?.trim().toLowerCase();

      if (
        error ||
        !session?.user ||
        signedInEmail !== FOUNDER_EMAIL.toLowerCase()
      ) {
        if (session?.user) {
          await supabase.auth.signOut();
        }

        if (isMounted) {
          navigate("/admin-login", { replace: true });
        }

        return;
      }

      await loadDashboard();
    }

    verifyAdminAndLoad();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;

      const signedInEmail =
        currentSession?.user?.email?.trim().toLowerCase();

      if (
        !currentSession?.user ||
        signedInEmail !== FOUNDER_EMAIL.toLowerCase()
      ) {
        navigate("/admin-login", { replace: true });
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

    await Promise.allSettled([
      fetchSubmissions(),
      fetchPublishedTools(),
      fetchRemovedTools(),
      fetchFeedback(),
    ]);

    setIsLoading(false);
  }

  async function fetchSubmissions() {
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

  async function fetchPublishedTools() {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Fetch published tools error:", error);
      setErrorMessage("Could not load published listings.");
      return;
    }

    setPublishedTools(data || []);
  }

  async function fetchRemovedTools() {
    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("status", "removed")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Fetch removed tools error:", error);
      setErrorMessage("Could not load removed listings.");
      return;
    }

    setRemovedTools(data || []);
  }

  async function fetchFeedback() {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch feedback error:", error);
      setErrorMessage("Could not load feedback.");
      return;
    }

    const items = data || [];

    setActiveFeedback(items.filter((item) => item.status !== "archived"));
    setArchivedFeedback(items.filter((item) => item.status === "archived"));
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
    const tool = resolveItem(value, submissions);
    if (!tool) return;

    setProcessingId(tool.id);
    clearMessages();

    const { data: publishedTool, error: toolError } = await supabase
      .from("tools")
      .insert([
        {
          company_name: tool.company_name,
          tool_name: tool.tool_name,
          website_url: tool.website_url,
          description: tool.description,
          category: tool.category || "Other",
          status: "published",
          placement: "standard",
          featured: false,
          published_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (toolError) {
      console.error("Publish tool error:", toolError);
      setErrorMessage("Approval failed. The tool could not be published.");
      setProcessingId(null);
      return;
    }

    const { error: submissionError } = await supabase
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", tool.id);

    if (submissionError) {
      console.error("Update submission error:", submissionError);
      await supabase.from("tools").delete().eq("id", publishedTool.id);
      setErrorMessage(
        "Approval was reversed because the submission status could not be updated."
      );
      setProcessingId(null);
      return;
    }

    setSubmissions((current) =>
      current.filter((submission) => submission.id !== tool.id)
    );
    setPublishedTools((current) => [publishedTool, ...current]);
    setReviewingId(null);
    setMessage(`${tool.tool_name} was approved and published.`);
    setProcessingId(null);
  }

  async function handleReject(value) {
    const tool = resolveItem(value, submissions);
    if (!tool) return;

    setProcessingId(tool.id);
    clearMessages();

    const { error } = await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", tool.id);

    if (error) {
      console.error("Reject submission error:", error);
      setErrorMessage("Rejection failed.");
      setProcessingId(null);
      return;
    }

    setSubmissions((current) =>
      current.filter((submission) => submission.id !== tool.id)
    );
    setReviewingId(null);
    setMessage(`${tool.tool_name} was rejected.`);
    setProcessingId(null);
  }

  async function handleRemoveTool(value) {
    const tool = resolveItem(value, publishedTools);
    if (!tool) return;

    setProcessingToolId(tool.id);
    clearMessages();

    const { data, error } = await supabase
      .from("tools")
      .update({ status: "removed" })
      .eq("id", tool.id)
      .select()
      .single();

    if (error) {
      console.error("Remove tool error:", error);
      setErrorMessage("Could not remove this listing.");
      setProcessingToolId(null);
      return;
    }

    setPublishedTools((current) =>
      current.filter((item) => item.id !== tool.id)
    );
    setRemovedTools((current) => [data, ...current]);
    setMessage(`${tool.tool_name} was removed from public listings.`);
    setProcessingToolId(null);
  }

  async function handleRestoreTool(value) {
    const tool = resolveItem(value, removedTools);
    if (!tool) return;

    setProcessingToolId(tool.id);
    clearMessages();

    const { data, error } = await supabase
      .from("tools")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", tool.id)
      .select()
      .single();

    if (error) {
      console.error("Restore tool error:", error);
      setErrorMessage("Could not restore this listing.");
      setProcessingToolId(null);
      return;
    }

    setRemovedTools((current) =>
      current.filter((item) => item.id !== tool.id)
    );
    setPublishedTools((current) => [data, ...current]);
    setMessage(`${tool.tool_name} was restored.`);
    setProcessingToolId(null);
  }

  async function handlePermanentDelete(value) {
    const tool = resolveItem(value, removedTools);
    if (!tool) return;

    const confirmed = window.confirm(
      `Permanently delete "${tool.tool_name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const typedConfirmation = window.prompt(
      `Type DELETE to permanently remove "${tool.tool_name}".`
    );

    if (typedConfirmation !== "DELETE") {
      setErrorMessage("Permanent delete was cancelled.");
      return;
    }

    setProcessingToolId(tool.id);
    clearMessages();

    const { error } = await supabase
      .from("tools")
      .delete()
      .eq("id", tool.id);

    if (error) {
      console.error("Permanent delete error:", error);
      setErrorMessage("Could not permanently delete this listing.");
      setProcessingToolId(null);
      return;
    }

    setRemovedTools((current) =>
      current.filter((item) => item.id !== tool.id)
    );
    setMessage(`${tool.tool_name} was permanently deleted.`);
    setProcessingToolId(null);
  }

  async function handleFeatureTool(value) {
    const tool = resolveItem(value, publishedTools);
    if (!tool) return;

    setProcessingToolId(tool.id);
    clearMessages();

    const featured = !tool.featured;

    const { data, error } = await supabase
      .from("tools")
      .update({ featured })
      .eq("id", tool.id)
      .select()
      .single();

    if (error) {
      console.error("Feature tool error:", error);
      setErrorMessage("Could not update the featured status.");
      setProcessingToolId(null);
      return;
    }

    setPublishedTools((current) =>
      current.map((item) => (item.id === tool.id ? data : item))
    );
    setMessage(
      featured
        ? `${tool.tool_name} is now featured.`
        : `${tool.tool_name} is no longer featured.`
    );
    setProcessingToolId(null);
  }

  async function updateFeedbackStatus(value, newStatus) {
    const feedbackItem = resolveItem(value, [
      ...activeFeedback,
      ...archivedFeedback,
    ]);
    if (!feedbackItem) return;

    setProcessingFeedbackId(feedbackItem.id);
    clearMessages();

    const { data, error } = await supabase
      .from("feedback")
      .update({ status: newStatus })
      .eq("id", feedbackItem.id)
      .select()
      .single();

    if (error) {
      console.error("Update feedback error:", error);
      setErrorMessage("Could not update the feedback status.");
      setProcessingFeedbackId(null);
      return;
    }

    if (newStatus === "archived") {
      setActiveFeedback((current) =>
        current.filter((item) => item.id !== feedbackItem.id)
      );
      setArchivedFeedback((current) => [data, ...current]);
    } else {
      setActiveFeedback((current) =>
        current.map((item) => (item.id === feedbackItem.id ? data : item))
      );
    }

    setMessage(`Feedback marked as ${newStatus}.`);
    setProcessingFeedbackId(null);
  }

  async function restoreFeedback(value) {
    const feedbackItem = resolveItem(value, archivedFeedback);
    if (!feedbackItem) return;

    setProcessingFeedbackId(feedbackItem.id);
    clearMessages();

    const { data, error } = await supabase
      .from("feedback")
      .update({ status: "reviewed" })
      .eq("id", feedbackItem.id)
      .select()
      .single();

    if (error) {
      console.error("Restore feedback error:", error);
      setErrorMessage("Could not restore the archived feedback.");
      setProcessingFeedbackId(null);
      return;
    }

    setArchivedFeedback((current) =>
      current.filter((item) => item.id !== feedbackItem.id)
    );
    setActiveFeedback((current) => [data, ...current]);
    setMessage("Feedback restored to the active inbox.");
    setProcessingFeedbackId(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/admin-login");
  }

  const newFeedbackCount = activeFeedback.filter(
    (item) => item.status === "new"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-slate-800 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              AIWCORE Control Center
            </p>
            <h1 className="mt-3 text-4xl font-extrabold">Admin Dashboard</h1>
            <p className="mt-3 text-slate-400">
              Manage submissions, listings, and user feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-fit rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Sign Out
          </button>
        </header>

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

        {isLoading ? (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-lg font-bold">Loading dashboard...</p>
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
              <div>
                <h2 className="text-2xl font-bold">Feedback</h2>
                <p className="mt-2 text-slate-400">
                  Review active feedback or manage archived records.
                </p>
              </div>

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

export default AdminDashboard;