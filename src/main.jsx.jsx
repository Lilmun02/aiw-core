 import {
  StrictMode,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { supabase } from "./lib/supabase.js";

const GUEST_ACCESS_KEY = "aiwcore_guest_access";
const AUTH_FLOW_KEY = "aiwcore_auth_flow";
const APP_STARTED_KEY = "aiwcore_app_started";

const LOADING_MESSAGES = [
  "Preparing AI discovery",
  "Organizing featured tools",
  "Checking your access",
  "Almost ready",
];

function isInstalledApp() {
  const isStandaloneDisplay = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const isIosInstalledApp = window.navigator.standalone === true;

  return isStandaloneDisplay || isIosInstalledApp;
}

function AppStartup() {
  const navigate = useNavigate();
  const location = useLocation();

  const [appMode] = useState(() => isInstalledApp());

  const [shouldRunStartup] = useState(
    () =>
      appMode &&
      window.sessionStorage.getItem(APP_STARTED_KEY) !== "true",
  );

  const [showLoadingScreen, setShowLoadingScreen] =
    useState(shouldRunStartup);
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [changelogUpdates, setChangelogUpdates] = useState([]);

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const [minimumLoadComplete, setMinimumLoadComplete] =
    useState(!shouldRunStartup);

  const [sessionChecked, setSessionChecked] = useState(!appMode);
  const [currentSession, setCurrentSession] = useState(null);

  const isAuthenticationPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setCurrentSession(session ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [appMode]);

  useEffect(() => {
    if (!appMode || !showLoadingScreen) {
      return undefined;
    }

    const progressTimer = window.setTimeout(() => {
      setProgressStarted(true);
    }, 100);

    const messageTimer = window.setInterval(() => {
      setLoadingMessageIndex((currentIndex) => {
        return (currentIndex + 1) % LOADING_MESSAGES.length;
      });
    }, 900);

    const minimumLoadTimer = window.setTimeout(() => {
      setMinimumLoadComplete(true);
    }, 4000);

    return () => {
      window.clearTimeout(progressTimer);
      window.clearInterval(messageTimer);
      window.clearTimeout(minimumLoadTimer);
    };
  }, [appMode, showLoadingScreen]);

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
      window.sessionStorage.setItem(APP_STARTED_KEY, "true");

      const hasGuestAccess =
        window.sessionStorage.getItem(GUEST_ACCESS_KEY) === "true";

      if (!currentSession && !hasGuestAccess) {
        if (window.location.pathname !== "/") {
          navigate("/", { replace: true });
        }

        setShowWelcomeScreen(true);
      }
    }, 300);

    return () => {
      window.clearTimeout(finishTimer);
    };
  }, [
    appMode,
    currentSession,
    isAuthenticationPage,
    minimumLoadComplete,
    navigate,
    sessionChecked,
    showLoadingScreen,
  ]);

  useEffect(() => {
    async function loadChangelog() {
      const { data, error } = await supabase.from("changelog_updates").select("*").eq("is_published", true).order("published_at",{ascending:false}).limit(10);
      if (error) { console.error("Failed to load changelog:", error); return; }
      setChangelogUpdates(data ?? []);
    }
    loadChangelog();
  }, []);

  useLayoutEffect(() => {
    if (
      !appMode ||
      showLoadingScreen ||
      location.pathname !== "/"
    ) {
      return;
    }

    const returningFromAuthentication =
      window.sessionStorage.getItem(AUTH_FLOW_KEY) === "true";

    if (!returningFromAuthentication) {
      return;
    }

    window.sessionStorage.removeItem(AUTH_FLOW_KEY);

    const hasGuestAccess =
      window.sessionStorage.getItem(GUEST_ACCESS_KEY) === "true";

    if (!currentSession && !hasGuestAccess) {
      setShowWelcomeScreen(true);
    }
  }, [
    appMode,
    currentSession,
    location.pathname,
    showLoadingScreen,
  ]);

  function handleCreateAccount() {
    window.sessionStorage.setItem(AUTH_FLOW_KEY, "true");

    setShowWelcomeScreen(false);
    setShowChangelog(false);
    navigate("/signup");
  }

  function handleLogin() {
    window.sessionStorage.setItem(AUTH_FLOW_KEY, "true");

    setShowWelcomeScreen(false);
    setShowChangelog(false);
    navigate("/login");
  }

  function handleGuestAccess() {
    window.sessionStorage.setItem(GUEST_ACCESS_KEY, "true");
    window.sessionStorage.removeItem(AUTH_FLOW_KEY);

    setShowWelcomeScreen(false);
    setShowChangelog(false);
    navigate("/", { replace: true });
  }

  function handleAuthenticationBack() {
    const hasGuestAccess =
      window.sessionStorage.getItem(GUEST_ACCESS_KEY) === "true";

    window.sessionStorage.removeItem(AUTH_FLOW_KEY);

    navigate("/", { replace: true });

    if (!currentSession && !hasGuestAccess) {
      setShowWelcomeScreen(true);
    }
  }

  return (
    <>
      <App />

      {appMode &&
        isAuthenticationPage &&
        !showLoadingScreen && (
          <button
            type="button"
            onClick={handleAuthenticationBack}
            aria-label="Go back to the AIWCORE welcome screen"
            className="fixed left-4 top-4 z-[9997] inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/95 px-4 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur transition hover:border-blue-500 hover:bg-slate-800 active:scale-[0.98]"
            style={{
              marginTop: "env(safe-area-inset-top)",
            }}
          >
            <span aria-hidden="true">←</span>
            <span>Back</span>
          </button>
        )}

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
                className={`h-full rounded-full bg-blue-600 transition-all duration-[3800ms] ease-linear ${
                  progressStarted ? "w-full" : "w-0"
                }`}
              />
            </div>

            <p className="mt-4 min-h-5 animate-pulse text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              {LOADING_MESSAGES[loadingMessageIndex]}
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

      {appMode && showWelcomeScreen && !showLoadingScreen && (
        <div
          className="fixed right-4 z-[10000] flex flex-col items-end gap-3"
          style={{
            bottom:
              "calc(1rem + env(safe-area-inset-bottom))",
          }}
        >
          {showChangelog && (
            <section
              aria-label="AIWCORE updates"
              className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-400">
                    AIWCORE Updates
                  </p>

                  <h2 className="mt-1 text-lg font-bold">
                    What’s new
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowChangelog(false)}
                  aria-label="Close update notes"
                  className="rounded-lg px-2 py-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-80 overflow-y-auto">{changelogUpdates.length===0?(<div className="rounded-xl bg-slate-950/70 p-3"><p className="text-sm text-slate-400">No updates available.</p></div>):(changelogUpdates.map((update)=>(<div key={update.id} className="rounded-xl border border-slate-700 bg-slate-950/70 p-3"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-blue-400">v{update.version}</span><span className="text-xs text-slate-500">{new Date(update.published_at).toLocaleDateString()}</span></div><h3 className="mt-2 font-bold text-white">{update.title}</h3>{update.description&&<p className="mt-1 text-sm text-slate-300">{update.description}</p>}{update.changes?.length>0&&<ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">{update.changes.map((c,i)=><li key={i}>{c}</li>)}</ul>}</div>)))}</div>
            </section>
          )}

          <button
            type="button"
            onClick={() => setShowChangelog((current) => !current)}
            aria-expanded={showChangelog}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/95 px-4 py-2.5 text-sm font-bold text-white shadow-xl backdrop-blur transition hover:border-blue-500 hover:bg-slate-800 active:scale-[0.98]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            <span>What’s New</span>
          </button>
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