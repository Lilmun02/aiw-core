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
    title: "Founder Supporter Recognition",
    description:
      "Receive permanent recognition as an early supporter of the AIWCORE mission.",
  },
  {
    icon: "💬",
    title: "Community Influence",
    description:
      "Share feedback that can help shape the direction of AIWCORE as the platform grows.",
  },
  {
    icon: "🤝",
    title: "Support the Mission",
    description:
      "Help AIWCORE build a trusted AI discovery platform centered on ambition, integrity, and willingness.",
  },
];

function FounderSupport() {
  const [session, setSession] = useState(undefined);
  const [isSupporter, setIsSupporter] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

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
          "We could not verify your account. Please refresh and try again.",
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
          "We could not check your Founder Supporter status. Please try again.",
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
      if (isMounted) {
        setSession(currentSession);

        if (!currentSession) {
          setIsSupporter(false);
          setIsCheckingStatus(false);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleJoinProgram() {
    setMessage("");
    setErrorMessage("");

    if (!session?.user) {
      navigate("/login");
      return;
    }

    if (isSupporter) {
      setMessage("You are already an AIWCORE Founder Supporter.");
      return;
    }

    setIsJoining(true);

    const { error } = await supabase.from("founder_supporters").insert({
      user_id: session.user.id,
    });

    setIsJoining(false);

    if (error) {
      if (error.code === "23505") {
        setIsSupporter(true);
        setMessage("You are already an AIWCORE Founder Supporter.");
        return;
      }

      console.error("Founder Supporter enrollment error:", error.message);
      setErrorMessage(
        "We could not complete your enrollment. Please try again.",
      );
      return;
    }

    setIsSupporter(true);
    setMessage(
      "Welcome to the Founders Supporter Program. Your support is now officially recognized.",
    );
  }

  function handleHomeClick() {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <Navbar onLogoClick={handleHomeClick} />

      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-12 sm:px-8 lg:px-12">
        <section className="overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/60 via-slate-950 to-[#070d1a] px-6 py-12 shadow-2xl shadow-blue-950/20 sm:px-10 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              Built for AIWCORE's earliest believers
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Founders Supporter Program
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Join the community helping AIWCORE grow into a trusted home for
              discovering AI tools, supporting builders, and connecting people
              with technology that serves a real purpose.
            </p>

            <div className="mt-8">
              {isCheckingStatus ? (
                <div className="mx-auto flex w-fit items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-slate-300">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
                  Checking your supporter status...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleJoinProgram}
                  disabled={isJoining || isSupporter}
                  className={`rounded-xl px-7 py-4 text-base font-bold transition ${
                    isSupporter
                      ? "cursor-default border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  }`}
                >
                  {isJoining
                    ? "Joining Program..."
                    : isSupporter
                      ? "✓ Founder Supporter"
                      : "Become a Founder Supporter"}
                </button>
              )}
            </div>

            {message && (
              <div
                className="mx-auto mt-5 max-w-2xl rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm leading-6 text-emerald-200"
                role="status"
              >
                {message}
              </div>
            )}

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

        <section className="mt-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Program Benefits
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Your support becomes part of AIWCORE's foundation
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900"
              >
                <div className="text-3xl">{benefit.icon}</div>

                <h3 className="mt-4 text-xl font-bold text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-8 text-center sm:px-10">
          <h2 className="text-2xl font-bold text-white">
            This is only the beginning
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-400">
            Founder Supporter benefits may expand as AIWCORE grows. Early
            members will remain recognized for supporting the platform during
            its foundation stage.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default FounderSupport;