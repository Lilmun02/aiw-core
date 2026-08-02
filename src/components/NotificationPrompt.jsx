import { useEffect, useState } from "react";

import {
  getCurrentPushSubscription,
  subscribeToPushNotifications,
  supportsPushNotifications,
} from "../lib/pushNotifications.js";

const DISMISSED_KEY = "aiwcore-push-prompt-dismissed";

function isInstalledApp() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    let promptTimer;

    async function checkStatus() {
      if (!isInstalledApp() || !supportsPushNotifications()) {
        return;
      }

      if (window.localStorage.getItem(DISMISSED_KEY) === "true") {
        return;
      }

      if (Notification.permission === "denied") {
        return;
      }

      const subscription = await getCurrentPushSubscription().catch(() => null);

      if (isMounted && !subscription) {
        promptTimer = window.setTimeout(() => {
          if (isMounted) {
            setIsVisible(true);
          }
        }, 5000);
      }
    }

    checkStatus();

    return () => {
      isMounted = false;

      if (promptTimer) {
        window.clearTimeout(promptTimer);
      }
    };
  }, []);

  async function handleEnable() {
    setIsEnabling(true);
    setErrorMessage("");

    try {
      await subscribeToPushNotifications();
      window.localStorage.removeItem(DISMISSED_KEY);
      setIsVisible(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "AIWCORE could not enable notifications.",
      );
    } finally {
      setIsEnabling(false);
    }
  }

  function handleDismiss() {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[12000] mx-auto max-w-md rounded-2xl border border-blue-500/30 bg-slate-950/95 p-5 text-white shadow-2xl backdrop-blur">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-2xl">
          🔔
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-black">Stay updated with AIWCORE</h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Get notified when new AIWCORE app updates, features, and important
            announcements go live.
          </p>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-300" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleEnable}
              disabled={isEnabling}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isEnabling ? "Enabling..." : "Enable Notifications"}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              disabled={isEnabling}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default NotificationPrompt;
