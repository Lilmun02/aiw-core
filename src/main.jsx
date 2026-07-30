import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";

function isInstalledApp() {
  const isStandaloneDisplay = window.matchMedia(
    "(display-mode: standalone)",
  ).matches;

  const isIosInstalledApp = window.navigator.standalone === true;

  return isStandaloneDisplay || isIosInstalledApp;
}

function AppStartup() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(() =>
    isInstalledApp(),
  );
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);

  useEffect(() => {
    if (!showLoadingScreen) {
      return undefined;
    }

    const progressTimer = window.setTimeout(() => {
      setProgressStarted(true);
    }, 100);

    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
    }, 1650);

    const finishTimer = window.setTimeout(() => {
      setShowLoadingScreen(false);
    }, 1950);

    return () => {
      window.clearTimeout(progressTimer);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, [showLoadingScreen]);

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