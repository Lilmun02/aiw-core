import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { supabase } from "./lib/supabase.js";

const GUEST_ACCESS_KEY = "aiwcore_guest_access";

function isInstalledApp() {
  const isStandaloneDisplay = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const isIosInstalledApp = window.navigator.standalone === true;

  return isStandaloneDisplay || isIosInstalledApp;
}

function AppStartup() {
  const navigate = useNavigate();

  const [appMode] = useState(() => isInstalledApp());

  const [showLoadingScreen, setShowLoadingScreen] = useState(appMode);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);

  const [minimumLoadComplete, setMinimumLoadComplete] =
    useState(!appMode);

  const [sessionChecked, setSessionChecked] = useState(!appMode);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    if (!appMode) {
      return undefined;
    }

    let isMounted = true;

    async function checkSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Startup session error:", error.message);
      }

      setCurrentSession(session ?? null);
      setSessionChecked(true);
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [appMode]);

  useEffect(() => {
    if (!appMode) {
      return undefined;
    }

    const progressTimer = window.setTimeout(() => {
      setProgressStarted(true);
    }, 100);

    const minimumLoadTimer = window.setTimeout(() => {
      setMinimumLoadComplete(true);
    }, 1650);

    return () => {
      window.clearTimeout(progressTimer);
      window.clearTimeout(minimumLoadTimer);
    };
  }, [appMode]);

  useEffect(() => {
    if (
      !appMode ||
      !showLoadingScreen ||
      !minimumLoadComplete ||
      !sessionChecked
    ) {
      return undefined;
    }

    setIsFadingOut(true);

    const finishTimer = window.setTimeout(() => {
      setShowLoadingScreen(false);

      const currentPath = window.location.pathname;
      const isAuthenticationPage =
        currentPath === "/login" || currentPath === "/signup";

      const hasGuestAccess =
        window.localStorage.getItem(GUEST_ACCESS_KEY) === "true";

      if (
        !currentSession &&
        !hasGuestAccess &&
        !isAuthenticationPage
      ) {
        setShowWelcomeScreen(true);
      }
    }, 300);

    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [
    appMode,
    currentSession,
    minimumLoadComplete,
    sessionChecked,
    showLoadingScreen,
  ]);

  function handleCreateAccount() {
    setShowWelcomeScreen(false);
    navigate("/signup");
  }

  function handleLogin() {
    setShowWelcomeScreen(false);
    navigate("/login");
  }

  function handleGuestAccess() {
    window.localStorage.setItem(GUEST_ACCESS_KEY, "true");

    setShowWelcomeScreen(false);
    navigate("/", { replace: true });
  }

  return (
    <>
      <App />

      {showLoadingScreen && (
        <div
          role="status"
          aria-label="AIWCORE is loading"
          className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#070d1a] px-6 transition-opacity duration-300 ${
            isFadingOut
              ? "pointer-events-none opacity-0"
              : "opacity-100"
          }`}
        >
          <div className="w-full max-w-sm text-center">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              <div className="absolute h-28 w-28 animate-ping rounded-full border border-blue-500/20" />

              <div className="absolute h-24 w-24 animate-pulse rounded-full bg-blue-600/10" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 text-4xl shadow-2xl shadow-blue-900/30">
                🤖
              </div>
            </div>

            <h1 className="mt-7 text-3xl font-black tracking-tight text-white">
              AIWCORE
            </h1>

            <p className="mt-3 text-sm font-semibold text-slate-400">
              Find the right AI in minutes.
            </p>

            <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full bg-blue-600 transition-all duration-[1500ms] ease-out ${
                  progressStarted ? "w-full" : "w-0"
                }`}
              />
            </div>

            <p className="mt-4 animate-pulse text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Loading AI discovery
            </p>
          </div>
        </div>
      )}

      {showWelcomeScreen && (
        <div className="fixed inset-0 z-[9998] flex min-h-screen items-center justify-center overflow-y-auto bg-[#070d1a] px-5 py-10 text-white">
          <div className="w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-700 bg-slate-900 text-4xl shadow-2xl shadow-blue-900/30">
                🤖
              </div>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-blue-500">
                AIWCORE
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
                Welcome to AIWCORE
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-400">
                Discover, explore, and find the right AI tools for the
                way you work.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-[0.98]"
                >
                  Create Account
                </button>

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:border-blue-500 hover:bg-slate-800 active:scale-[0.98]"
                >
                  Log In
                </button>

                <button
                  type="button"
                  onClick={handleGuestAccess}
                  className="w-full rounded-xl px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                >
                  Continue as Guest
                </button>
              </div>

              <div className="my-5 border-t border-slate-800" />

              <p className="text-center text-xs leading-5 text-slate-500">
                Guest access lets you browse AIWCORE. Create an account
                to unlock your profile and member features.
              </p>
            </div>

            <p className="mt-6 text-center text-xs text-slate-600">
              Ambition • Integrity • Willingness
            </p>
          </div>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppStartup />
    </BrowserRouter>
  </StrictMode>,
);