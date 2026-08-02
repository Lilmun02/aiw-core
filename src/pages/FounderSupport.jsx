 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { supabase } from "../lib/supabase.js";

const benefits = [
  {
    icon: "🚀",
    title: "Early Platform Access",
    description:
      "Experience selected AIWCORE updates and community features as they are released.",
  },
  {
    icon: "🏅",
    title: "Permanent Recognition",
    description:
      "Remain recognized as someone who supported AIWCORE during its earliest stage.",
  },
  {
    icon: "💬",
    title: "Community Influence",
    description:
      "Share feedback that can help shape AIWCORE as the platform continues growing.",
  },
  {
    icon: "🤝",
    title: "Support the Mission",
    description:
      "Help AIWCORE build a trusted platform centered on ambition, integrity, and willingness.",
  },
];

const principles = [
  {
    title: "Limited Enrollment",
    description:
      "Founder Support will only remain available during AIWCORE’s foundation stage.",
  },
  {
    title: "One-Time Support",
    description:
      "When enrollment opens, joining will require one optional one-time payment—not a monthly subscription.",
  },
  {
    title: "Permanent Status",
    description:
      "Approved Founder Supporters will keep their recognition after enrollment closes.",
  },
];

function FounderSupport() {
  const navigate = useNavigate();

  const [session, setSession] = useState(undefined);
  const [isSupporter, setIsSupporter] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSupporterStatus() {
      setIsCheckingStatus(true);
      setErrorMessage("");

      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (sessionError) {
        console.error("Session error:", sessionError.message);
        setSession(null);
        setErrorMessage(
          "AIWCORE could not verify your account. Please refresh and try again.",
        );
        setIsCheckingStatus(false);
        return;
      }

      setSession(currentSession);

      if (!currentSession?.user) {
        setIsCheckingStatus(false);
        return;
      }

      const { data, error } = await supabase
        .from("founder_supporters")
        .select("user_id")
        .eq("user_id", currentSession.user.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Supporter status error:", error.message);
        setErrorMessage(
          "AIWCORE could not check your Founder Supporter status. Please try again.",
        );
        setIsCheckingStatus(false);
        return;
      }

      setIsSupporter(Boolean(data));
      setIsCheckingStatus(false);
    }

    loadSupporterStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) {
        return;
      }

      setSession(currentSession);

      if (!currentSession) {
        setIsSupporter(false);
        setIsCheckingStatus(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function handleHomeClick() {
    navigate("/");
  }

  function handleAccountAction() {
    if (!session?.user) {
      navigate("/login");
      return;
    }

    navigate("/profile");
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={handleHomeClick} />

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8 sm:pt-12 lg:px-12">
        <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/70 via-slate-950 to-[#070d1a] px-6 py-12 shadow-2xl shadow-blue-950/20 sm:px-10 sm:py-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              Built for AIWCORE’s earliest believers
            </span>

            <p className="mt-7 text-sm font-black uppercase tracking-[0.28em] text-blue-400">
              Founder Support Program
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Help shape what AIWCORE becomes.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              The Founder Support Program recognizes the early people who
              believe in AIWCORE’s mission and choose to support its continued
              development.
            </p>

            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-700/80 bg-slate-950/65 p-5 text-left backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
                  💎
                </div>

                <div>
                  <p className="font-bold text-white">
                    Optional one-time support
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Enrollment and payment are not open yet. The final price
                    and complete terms will be clearly shown before anyone
                    joins.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {isCheckingStatus ? (
                <div className="mx-auto flex w-fit items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-slate-300">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
                  Checking your supporter status...
                </div>
              ) : isSupporter ? (
                <div className="mx-auto max-w-xl rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-6 py-5">
                  <p className="text-lg font-black text-emerald-300">
                    ✓ Founder Supporter Recognized
                  </p>

                  <p className="mt-2 text-sm leading-6 text-emerald-100/80">
                    Your account is already registered in the Founder Support
                    Program.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="mt-5 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-emerald-950 transition hover:bg-emerald-400"
                  >
                    View My Profile
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-xl border border-blue-400/25 bg-blue-600/35 px-7 py-4 text-base font-black text-blue-100/70"
                  >
                    Enrollment Opening Later
                  </button>

                  <p className="mt-3 text-sm text-slate-500">
                    No payment is being collected right now.
                  </p>

                  {!session?.user && (
                    <button
                      type="button"
                      onClick={handleAccountAction}
                      className="mt-5 text-sm font-bold text-blue-300 transition hover:text-blue-200"
                    >
                      Sign in to prepare your account →
                    </button>
                  )}
                </div>
              )}
            </div>

            {errorMessage && (
              <div
                className="mx-auto mt-5 max-w-2xl rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm leading-6 text-red-200"
                role="alert"
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

            <h2 className="mt-3 text-3xl font-black text-white">
              Support that becomes part of the foundation
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              Founder Support is designed around recognition, participation,
              and helping AIWCORE grow responsibly.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-2xl">
                  {benefit.icon}
                </div>

                <h3 className="mt-5 text-xl font-black text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-slate-800 bg-[#0d1526] p-6 sm:p-9">
          <div className="grid gap-7 lg:grid-cols-[0.9fr_1.3fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-400">
                How it will work
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Clear from the beginning
              </h2>

              <p className="mt-4 leading-7 text-slate-400">
                AIWCORE will announce the final enrollment window, one-time
                price, and available benefits before payment opens.
              </p>
            </div>

            <div className="space-y-4">
              {principles.map((principle, index) => (
                <div
                  key={principle.title}
                  className="flex gap-4 rounded-2xl border border-slate-800 bg-slate-950/55 p-5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                    {index + 1}
                  </span>

                  <div>
                    <h3 className="font-black text-white">
                      {principle.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-950/50 to-slate-950 px-6 py-10 text-center sm:px-10">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-400">
            AIWCORE
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Ambition. Integrity. Willingness.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
            Founder Support is one way early believers will be able to help
            protect and grow that mission.
          </p>

          <button
            type="button"
            onClick={handleAccountAction}
            className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-black text-white transition hover:bg-blue-500"
          >
            {session?.user ? "Return to My Profile" : "Create an Account"}
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FounderSupport;