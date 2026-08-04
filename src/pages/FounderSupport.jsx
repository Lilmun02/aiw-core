import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { supabase } from "../lib/supabase.js";

const benefits = [
  ["🏅", "Permanent Recognition", "Keep a permanent Founder Supporter badge and early-support recognition as AIWCORE grows."],
  ["📜", "Digital Certificate", "Unlock a Founder Support certificate and a supported-since date tied to your account."],
  ["🚀", "Early Opportunities", "Receive eligible early-access opportunities, previews, and supporter announcements."],
  ["💬", "Community Influence", "Share feedback that can help shape AIWCORE during its foundation stage."],
  ["❤️", "Support the Mission", "Your one-time contribution helps AIWCORE continue building a trusted AI discovery platform."],
  ["✨", "Growing Benefits", "Founder Support benefits can expand over time without removing your permanent recognition."],
];

function FounderSupport() {
  const navigate = useNavigate();
  const [session, setSession] = useState(undefined);
  const [accountRole, setAccountRole] = useState("user");
  const [isSupporter, setIsSupporter] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFounder = accountRole === "founder";

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      setIsCheckingStatus(true);
      setErrorMessage("");

      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (sessionError) {
        setSession(null);
        setErrorMessage(
          "AIWCORE could not verify your account. Please refresh and try again.",
        );
        setIsCheckingStatus(false);
        return;
      }

      setSession(currentSession);

      if (!currentSession?.user) {
        setAccountRole("user");
        setIsSupporter(false);
        setIsCheckingStatus(false);
        return;
      }

      const [profileResult, supporterResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("account_role,is_founding_supporter")
          .eq("id", currentSession.user.id)
          .maybeSingle(),
        supabase
          .from("founder_supporters")
          .select("user_id,status,support_source,supported_since")
          .eq("user_id", currentSession.user.id)
          .maybeSingle(),
      ]);

      if (!isMounted) return;

      if (profileResult.error) {
        console.error(
          "Unable to load account role:",
          profileResult.error.message,
        );
        setErrorMessage("AIWCORE could not verify your account role.");
      } else {
        setAccountRole(profileResult.data?.account_role || "user");
      }

      if (supporterResult.error) {
        console.error(
          "Unable to load Founder Supporter status:",
          supporterResult.error.message,
        );
        setErrorMessage((current) =>
          current || "AIWCORE could not check your Founder Supporter status.",
        );
        setIsSupporter(Boolean(profileResult.data?.is_founding_supporter));
      } else {
        setIsSupporter(
          (Boolean(supporterResult.data) &&
            supporterResult.data.status === "active") ||
            Boolean(profileResult.data?.is_founding_supporter),
        );
      }

      setIsCheckingStatus(false);
    }

    loadStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);

      if (!currentSession) {
        setAccountRole("user");
        setIsSupporter(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function startCheckout() {
    if (!session?.user) {
      navigate("/login");
      return;
    }

    if (isFounder || isSupporter) {
      return;
    }

    setIsStartingCheckout(true);
    setErrorMessage("");

    const { data, error } = await supabase.functions.invoke(
      "create-founder-support-checkout",
      { body: {} },
    );

    if (error || !data?.url) {
      setErrorMessage(
        data?.error || error?.message || "Checkout could not be started.",
      );
      setIsStartingCheckout(false);
      return;
    }

    window.location.assign(data.url);
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={() => navigate("/")} />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/70 via-slate-950 to-[#070d1a] px-6 py-12 text-center shadow-2xl shadow-blue-950/20 sm:px-10 sm:py-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              Built for AIWCORE’s earliest believers
            </span>
            <p className="mt-7 text-sm font-black uppercase tracking-[0.28em] text-blue-400">
              Founder Support Program
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
              Help shape what AIWCORE becomes.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Founder Support is optional. AIWCORE remains usable on the free
              tier, while supporters receive permanent recognition and growing
              benefits.
            </p>

            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-blue-500/30 bg-blue-500/10 p-6">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                One-time Founder Support
              </p>
              <p className="mt-3 text-5xl font-black">$49</p>
              <p className="mt-2 text-sm text-slate-300">
                One payment. No monthly subscription. Permanent Founder
                Supporter status after verified payment.
              </p>
            </div>

            <div className="mt-8">
              {isCheckingStatus ? (
                <p className="text-slate-300">Checking your account status...</p>
              ) : isFounder ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-amber-400/40 bg-amber-400/10 px-6 py-6">
                  <p className="text-xl font-black text-amber-300">
                    👑 AIWCORE Founder Account
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-100/80">
                    You created AIWCORE. Founder Support benefits are already
                    unlocked for this account, and no purchase is required.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="mt-5 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300"
                  >
                    View Founder Profile
                  </button>
                </div>
              ) : isSupporter ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-6 py-5">
                  <p className="text-lg font-black text-emerald-300">
                    ✓ Founder Supporter Recognized
                  </p>
                  <p className="mt-2 text-sm text-emerald-100/80">
                    Your account already has permanent Founder Support status.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-emerald-950 hover:bg-emerald-400"
                  >
                    View My Profile
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={startCheckout}
                    disabled={isStartingCheckout}
                    className="rounded-xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isStartingCheckout
                      ? "Opening Secure Checkout..."
                      : session?.user
                        ? "Join Founder Support — $49"
                        : "Sign In to Join Founder Support"}
                  </button>
                  <p className="text-sm text-slate-500">
                    Secure checkout is handled by Stripe. Card details never
                    pass through AIWCORE.
                  </p>
                </div>
              )}
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200"
              >
                {errorMessage}
              </div>
            )}
          </div>
        </section>

        <section className="mt-14">
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-400">
              Program Benefits
            </p>
            <h2 className="mt-3 text-3xl font-black">More than a badge</h2>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([icon, title, description]) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <div className="text-3xl">{icon}</div>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-slate-800 bg-[#0d1526] p-7 sm:p-10">
          <h2 className="text-3xl font-black">Your choice remains clear</h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Joining Founder Support is optional. People who do not join keep
            access to AIWCORE’s default free tier. Existing pre-payment Founder
            Supporters remain grandfathered and do not need to pay again.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default FounderSupport;
