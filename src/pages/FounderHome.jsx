import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FounderPwaSetup from "../components/founder/FounderPwaSetup.jsx";
import { supabase } from "../lib/supabase.js";

const FOUNDER_EMAIL = "lilmunofficial18@gmail.com";

function toLocalDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function FounderHome() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [founderName, setFounderName] = useState("Founder");
  const [version, setVersion] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [changesText, setChangesText] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");
  const [publishError, setPublishError] = useState(false);
  const [memberStats, setMemberStats] = useState({
    totalMembers: null,
    activeToday: null,
    activeThisWeek: null,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  async function loadMemberStats() {
    setIsLoadingStats(true);
    setStatsError("");

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);

    const todayDate = toLocalDateString(today);
    const weekStartDate = toLocalDateString(weekStart);

    const [membersResult, todayResult, weekResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("user_streaks")
        .select("user_id", { count: "exact", head: true })
        .gte("last_active_date", todayDate),
      supabase
        .from("user_streaks")
        .select("user_id", { count: "exact", head: true })
        .gte("last_active_date", weekStartDate),
    ]);

    const firstError =
      membersResult.error || todayResult.error || weekResult.error;

    if (firstError) {
      setStatsError(firstError.message);
      setIsLoadingStats(false);
      return;
    }

    setMemberStats({
      totalMembers: membersResult.count ?? 0,
      activeToday: todayResult.count ?? 0,
      activeThisWeek: weekResult.count ?? 0,
    });
    setIsLoadingStats(false);
  }

  useEffect(() => {
    let isMounted = true;

    async function verifyFounder() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const email = session?.user?.email?.trim().toLowerCase();

      if (error || email !== FOUNDER_EMAIL.toLowerCase()) {
        navigate("/", { replace: true });
        return;
      }

      const metadata = session?.user?.user_metadata ?? {};
      const displayName =
        metadata.display_name || metadata.full_name || metadata.name || "LilMun";

      setFounderName(displayName);
      setIsChecking(false);
      loadMemberStats();
    }

    verifyFounder();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function publishChangelog(event) {
    event.preventDefault();

    const cleanVersion = version.trim().replace(/^v/i, "");
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const changes = changesText
      .split("\n")
      .map((change) => change.trim())
      .filter(Boolean);

    if (!cleanVersion || !cleanTitle || changes.length === 0) {
      setPublishError(true);
      setPublishMessage(
        "Add a version, title, and at least one change before publishing.",
      );
      return;
    }

    setIsPublishing(true);
    setPublishError(false);
    setPublishMessage("");

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    const email = session?.user?.email?.trim().toLowerCase();

    if (sessionError || email !== FOUNDER_EMAIL.toLowerCase()) {
      setIsPublishing(false);
      setPublishError(true);
      setPublishMessage("Founder verification failed. Please sign in again.");
      return;
    }

    const { error } = await supabase.from("changelog_updates").insert({
      version: cleanVersion,
      title: cleanTitle,
      description: cleanDescription || null,
      changes,
      is_published: true,
      published_at: new Date().toISOString(),
    });

    setIsPublishing(false);

    if (error) {
      setPublishError(true);
      setPublishMessage(error.message);
      return;
    }

    setVersion("");
    setTitle("");
    setDescription("");
    setChangesText("");
    setPublishError(false);
    setPublishMessage("Changelog published successfully.");
  }

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-blue-500" />
          <p className="text-slate-300">Verifying founder access...</p>
        </div>
      </main>
    );
  }

  const formatStat = (value) =>
    isLoadingStats || value === null ? "—" : value.toLocaleString();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-8 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-slate-700 hover:text-white"
          >
            ← AIWCORE
          </button>

          <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
            Private Access
          </span>
        </div>

        <header className="mt-8 overflow-hidden rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-500/15 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-blue-950/20 sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-400">
            Founder Control
          </p>

          <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
            {greeting}, {founderName}.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Your private mobile control center for AIWCORE. Notifications, changelog publishing, and member activity stats are ready to use.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/founder/lilmun/notifications")}
              className="rounded-2xl bg-blue-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              🔔 Send Push Notification
            </button>

            <button
              type="button"
              onClick={() =>
                document.getElementById("publish-changelog")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="rounded-2xl border border-violet-500/40 bg-violet-500/10 px-5 py-3.5 text-sm font-black text-violet-200 transition hover:border-violet-400 hover:bg-violet-500/15"
            >
              📝 Publish Changelog
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Control Center</p>
            <p className="mt-3 text-2xl font-black text-white">Online</p>
            <p className="mt-1 text-sm text-emerald-400">Founder access verified</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Active Tools</p>
            <p className="mt-3 text-2xl font-black text-white">3 Live</p>
            <p className="mt-1 text-sm text-blue-400">Notifications, logs + stats</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Security</p>
            <p className="mt-3 text-2xl font-black text-white">Founder Only</p>
            <p className="mt-1 text-sm text-slate-400">Account verification active</p>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-emerald-500/20 bg-slate-900/65 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Member Activity</p>
              <h2 className="mt-2 text-2xl font-black">AIWCORE users</h2>
              <p className="mt-2 text-sm text-slate-400">Based on profiles and the existing streak check-in activity.</p>
            </div>
            <button
              type="button"
              onClick={loadMemberStats}
              disabled={isLoadingStats}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-emerald-500 hover:text-white disabled:opacity-60"
            >
              {isLoadingStats ? "Refreshing..." : "↻ Refresh Stats"}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-bold text-slate-400">Total Members</p>
              <p className="mt-2 text-3xl font-black">{formatStat(memberStats.totalMembers)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-bold text-slate-400">Active Today</p>
              <p className="mt-2 text-3xl font-black text-emerald-300">{formatStat(memberStats.activeToday)}</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm font-bold text-slate-400">Active This Week</p>
              <p className="mt-2 text-3xl font-black text-blue-300">{formatStat(memberStats.activeThisWeek)}</p>
            </div>
          </div>

          {statsError && (
            <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200">
              Stats could not load: {statsError}
            </p>
          )}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => navigate("/founder/lilmun/notifications")} className="group rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 text-left transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-500/15">
            <div className="flex items-start justify-between gap-4"><div className="text-3xl">🔔</div><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">LIVE</span></div>
            <h2 className="mt-5 text-xl font-black">Push Notifications</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Send announcements, update alerts, and important messages directly from your phone.</p>
            <p className="mt-5 text-sm font-black text-blue-400 group-hover:text-blue-300">Open Notification Center →</p>
          </button>

          <button type="button" onClick={() => document.getElementById("publish-changelog")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="group rounded-3xl border border-violet-500/30 bg-violet-500/10 p-6 text-left transition hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-500/15">
            <div className="flex items-start justify-between gap-4"><div className="text-3xl">📝</div><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">LIVE</span></div>
            <h2 className="mt-5 text-xl font-black">Publish Changelog</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Publish version notes directly to the existing AIWCORE changelog system.</p>
            <p className="mt-5 text-sm font-black text-violet-300 group-hover:text-violet-200">Open Publisher ↓</p>
          </button>
        </section>

        <section id="publish-changelog" className="scroll-mt-6 mt-8 rounded-[2rem] border border-violet-500/25 bg-slate-900/70 p-5 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">Changelog Publisher</p>
          <h2 className="mt-2 text-2xl font-black">Publish an AIWCORE update</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Each line in the changes box becomes its own bullet in the app changelog.</p>

          <form onSubmit={publishChangelog} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-slate-300">Version<input value={version} onChange={(event) => setVersion(event.target.value)} placeholder="0.4.1" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400" /></label>
              <label className="block text-sm font-bold text-slate-300">Title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Founder Control update" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400" /></label>
            </div>
            <label className="block text-sm font-bold text-slate-300">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A quick summary of this release." rows={3} className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400" /></label>
            <label className="block text-sm font-bold text-slate-300">Changes — one per line<textarea value={changesText} onChange={(event) => setChangesText(event.target.value)} placeholder={"Added Founder Control\nAdded mobile push sender\nImproved profile navigation"} rows={6} className="mt-2 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-400" /></label>

            {publishMessage && (
              <div role={publishError ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm font-bold ${publishError ? "border-red-500/40 bg-red-500/10 text-red-200" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"}`}>
                {publishMessage}
              </div>
            )}

            <button type="submit" disabled={isPublishing} className="w-full rounded-xl bg-violet-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60">
              {isPublishing ? "Publishing..." : "Publish Changelog"}
            </button>
          </form>
        </section>

        <div className="mt-8"><FounderPwaSetup /></div>
      </div>
    </main>
  );
}

export default FounderHome;
