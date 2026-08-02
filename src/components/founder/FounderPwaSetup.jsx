import { useEffect, useState } from "react";

const DEFAULT_MANIFEST = "/manifest.webmanifest";
const FOUNDER_MANIFEST = "/founder-manifest.webmanifest";

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function FounderPwaSetup() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneMode());
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    const previousManifest = manifestLink?.getAttribute("href") || DEFAULT_MANIFEST;
    const previousTitle = document.title;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const previousTheme = themeMeta?.getAttribute("content");

    if (manifestLink) {
      manifestLink.setAttribute("href", FOUNDER_MANIFEST);
    }

    document.title = "AIWCORE Founder Control";
    themeMeta?.setAttribute("content", "#020617");

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      if (manifestLink) {
        manifestLink.setAttribute("href", previousManifest);
      }

      document.title = previousTitle;

      if (previousTheme) {
        themeMeta?.setAttribute("content", previousTheme);
      }

      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
      return;
    }

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isIos) {
      setShowIosHelp(true);
      return;
    }

    setShowIosHelp(true);
  }

  if (isInstalled) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
        Founder Control is running as an installed app.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-white">Install Founder Control</p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Add this private control center to your phone so it opens directly to founder tools.
          </p>
        </div>

        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-500"
        >
          Install App
        </button>
      </div>

      {showIosHelp && (
        <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-slate-300">
          On iPhone or iPad, tap the Share button, choose <strong>Add to Home Screen</strong>, then confirm. On Android, open the browser menu and choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.
        </div>
      )}
    </div>
  );
}

export default FounderPwaSetup;
