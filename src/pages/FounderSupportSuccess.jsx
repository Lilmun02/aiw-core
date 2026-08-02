import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { supabase } from "../lib/supabase.js";

function FounderSupportSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;

    async function verifySupporter() {
      const sessionId = searchParams.get("session_id");
      if (!sessionId) {
        if (isMounted) setStatus("missing");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (isMounted) setStatus("signed-out");
        return;
      }

      const { data, error } = await supabase
        .from("founder_supporters")
        .select("user_id,status,support_source,supported_since")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (!error && data?.status === "active") {
        setStatus("active");
        return;
      }

      attempts += 1;
      if (attempts < 8) {
        window.setTimeout(verifySupporter, 1500);
      } else {
        setStatus("pending");
      }
    }

    verifySupporter();
    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  const content = {
    verifying: ["Confirming your support...", "Stripe has returned you to AIWCORE. We’re waiting for the secure payment confirmation."],
    active: ["Welcome, Founder Supporter!", "Your $49 one-time support was verified and your permanent Founder Supporter status is active."],
    pending: ["Payment received — activation pending", "Stripe may still be delivering the secure confirmation. Refresh this page in a moment."],
    missing: ["Checkout session missing", "Return to Founder Support and begin checkout again."],
    "signed-out": ["Sign in to confirm your support", "Your payment may be complete, but AIWCORE needs your account session to show the result."],
  }[status];

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070d1a] px-5 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-blue-500/25 bg-slate-900/80 p-8 text-center shadow-2xl shadow-blue-950/30">
        <div className="text-5xl">{status === "active" ? "🏅" : status === "verifying" ? "⏳" : "💙"}</div>
        <h1 className="mt-5 text-3xl font-black">{content[0]}</h1>
        <p className="mt-4 leading-7 text-slate-300">{content[1]}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {status === "pending" && (
            <button type="button" onClick={() => window.location.reload()} className="rounded-xl bg-blue-600 px-5 py-3 font-black hover:bg-blue-500">Refresh Status</button>
          )}
          <button type="button" onClick={() => navigate(status === "active" ? "/profile" : "/founder-support")} className="rounded-xl border border-slate-700 px-5 py-3 font-black text-slate-200 hover:border-slate-500">
            {status === "active" ? "View My Profile" : "Return to Founder Support"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default FounderSupportSuccess;
