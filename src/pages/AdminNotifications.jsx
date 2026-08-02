import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { isFounderUser } from "../lib/founderAccess.js";
import { supabase } from "../lib/supabase.js";

function isValidInternalPath(value) {
  return value.startsWith("/") && !value.startsWith("//");
}

function AdminNotifications() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("🎉 Welcome to AIWCORE");
  const [body, setBody] = useState(
    "Push Notifications are now live! You’ll receive important AIWCORE updates, new features, and platform announcements directly on your device.",
  );
  const [url, setUrl] = useState("/");
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function verifyFounder() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error || !isFounderUser(session?.user)) {
        navigate("/", { replace: true });
        return;
      }

      setIsChecking(false);
    }

    verifyFounder();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;

      if (!isFounderUser(currentSession?.user)) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSend(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const cleanUrl = url.trim() || "/";

    if (!cleanTitle || !cleanBody) {
      setErrorMessage("Add a title and message before sending.");
      return;
    }

    if (!isValidInternalPath(cleanUrl)) {
      setErrorMessage("Destination must be an internal AIWCORE path beginning with one /.");
      return;
    }

    const confirmed = window.confirm(
      "Send this push notification to every subscribed AIWCORE device?",
    );

    if (!confirmed) return;

    setIsSending(true);
    setMessage("");
    setErrorMessage("");

    const { data, error } = await supabase.functions.invoke("send-push", {
      body: {
        title: cleanTitle,
        body: cleanBody,
        url: cleanUrl,
      },
    });

    setIsSending(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMessage(
      `Notification sent to ${data?.sent || 0} device${data?.sent === 1 ? "" : "s"}. ${data?.failed ? `${data.failed} failed.` : ""}`,
    );
  }

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-300">Verifying founder access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/founder/lilmun")}
          className="text-sm font-bold text-slate-400 transition hover:text-white"
        >
          ← Back to Founder Control
        </button>

        <header className="mt-8 border-b border-slate-800 pb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            AIWCORE Founder Broadcasts
          </p>

          <h1 className="mt-3 text-4xl font-black">Push Notification Center</h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Send one announcement to every visitor or member who opted into AIWCORE push notifications.
          </p>
        </header>

        <form
          onSubmit={handleSend}
          className="mt-8 space-y-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8"
        >
          <div>
            <label htmlFor="push-title" className="mb-2 block text-sm font-bold">
              Notification title
            </label>
            <input
              id="push-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              required
              placeholder="AIWCORE Update"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="push-body" className="mb-2 block text-sm font-bold">
              Message
            </label>
            <textarea
              id="push-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              maxLength={240}
              required
              rows={5}
              placeholder="Tell the AIWCORE community what changed."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-right text-xs text-slate-500">{body.length}/240</p>
          </div>

          <div>
            <label htmlFor="push-url" className="mb-2 block text-sm font-bold">
              Open destination
            </label>
            <input
              id="push-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="/"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />
            <p className="mt-2 text-xs text-slate-500">
              Use an internal AIWCORE path such as /, /profile, or /founder-support.
            </p>
          </div>

          {message && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 font-black transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending Notification..." : "Send to All Subscribers"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminNotifications;
