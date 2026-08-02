import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FounderPwaSetup from "../components/founder/FounderPwaSetup.jsx";
import { supabase } from "../lib/supabase.js";

const FOUNDER_EMAIL = "lilmunofficial18@gmail.com";

function FounderHome() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

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

      setIsChecking(false);
    }

    verifyFounder();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-300">Verifying founder access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <FounderPwaSetup />

      <div className="mx-auto mt-6 w-full max-w-4xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-sm font-bold text-slate-400 transition hover:text-white"
        >
          ← Return to AIWCORE
        </button>

        <header className="mt-8 border-b border-slate-800 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Private Founder PWA
          </p>

          <h1 className="mt-3 text-4xl font-black">LilMun Control Center</h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Your mobile command center for AIWCORE. Push notifications are live now, and future founder tools will be added here without requiring a computer.
          </p>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate("/founder/lilmun/notifications")}
            className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-6 text-left transition hover:border-blue-400 hover:bg-blue-500/15"
          >
            <div className="text-3xl">🔔</div>
            <h2 className="mt-4 text-xl font-black">Push Notifications</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Send app announcements and release updates from your phone.
            </p>
          </button>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 opacity-70">
            <div className="text-3xl">🚀</div>
            <h2 className="mt-4 text-xl font-black">Coming Next</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Releases, changelogs, analytics, users, listings, and platform controls.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default FounderHome;
