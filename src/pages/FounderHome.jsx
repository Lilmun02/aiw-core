import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import FounderPwaSetup from "../components/founder/FounderPwaSetup.jsx";
import { supabase } from "../lib/supabase.js";

const FOUNDER_EMAIL = "lilmunofficial18@gmail.com";

function FounderHome() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [founderName, setFounderName] = useState("Founder");

  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

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
    }

    verifyFounder();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

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
            Your private mobile control center for AIWCORE. Only tools that are fully connected and ready to use appear here.
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
              onClick={() => window.location.reload()}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-3.5 text-sm font-black text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              ↻ Refresh Control Center
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Control Center
            </p>
            <p className="mt-3 text-2xl font-black text-white">Online</p>
            <p className="mt-1 text-sm text-emerald-400">Founder access verified</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Active Tool
            </p>
            <p className="mt-3 text-2xl font-black text-white">Notifications</p>
            <p className="mt-1 text-sm text-blue-400">Ready from mobile</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Security
            </p>
            <p className="mt-3 text-2xl font-black text-white">Founder Only</p>
            <p className="mt-1 text-sm text-slate-400">Account verification active</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                Quick Actions
              </p>
              <h2 className="mt-2 text-2xl font-black">Available founder tools</h2>
            </div>

            <span className="text-xs font-bold text-slate-500">v1.0</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/founder/lilmun/notifications")}
            className="group w-full rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 text-left transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-500/15"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="text-3xl">🔔</div>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-black text-emerald-300">
                LIVE
              </span>
            </div>
            <h3 className="mt-5 text-xl font-black">Push Notifications</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Send announcements, update alerts, and important messages directly from your phone.
            </p>
            <p className="mt-5 text-sm font-black text-blue-400 group-hover:text-blue-300">
              Open Notification Center →
            </p>
          </button>
        </section>

        <div className="mt-8">
          <FounderPwaSetup />
        </div>
      </div>
    </main>
  );
}

export default FounderHome;
