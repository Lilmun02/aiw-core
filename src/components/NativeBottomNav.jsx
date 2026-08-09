import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase.js";

const primaryItems = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "categories", label: "Categories", icon: "▦" },
  { id: "search", label: "Search", icon: "⌕" },
  { id: "profile", label: "Profile", icon: "◉" },
  { id: "more", label: "More", icon: "•••" },
];

const hiddenPaths = new Set(["/login", "/signup", "/profile"]);

function NativeBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(undefined);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) setSession(currentSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  if (hiddenPaths.has(location.pathname)) return null;

  function scrollHomeSection(sectionId) {
    setMoreOpen(false);

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname === "/") {
      scrollToSection();
      return;
    }

    navigate(`/#${sectionId}`);
    window.setTimeout(scrollToSection, 80);
  }

  function handlePrimary(itemId) {
    if (itemId === "home") {
      setMoreOpen(false);
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    if (itemId === "categories") {
      scrollHomeSection("categories");
      return;
    }

    if (itemId === "search") {
      scrollHomeSection("search");
      return;
    }

    if (itemId === "profile") {
      setMoreOpen(false);
      navigate(session?.user ? "/profile" : "/login");
      return;
    }

    setMoreOpen((current) => !current);
  }

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut();
    setIsLoggingOut(false);

    if (error) {
      console.error("Native logout error:", error.message);
      return;
    }

    setMoreOpen(false);
    navigate("/", { replace: true });
  }

  function activeItem(itemId) {
    if (itemId === "home") return location.pathname === "/";
    if (itemId === "profile") return location.pathname === "/profile";
    if (itemId === "more") return moreOpen;
    return false;
  }

  return (
    <>
      {moreOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMoreOpen(false)}
            className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm"
          />

          <section className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[90] mx-auto max-w-lg rounded-[26px] border border-white/10 bg-[#0a0d15]/98 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-300">
                  AIWCORE
                </p>
                <p className="mt-1 text-lg font-black text-white">More</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-slate-300"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => navigate("/founder-support")} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm font-bold text-slate-200">
                🚀 Founder Support
              </button>
              <button type="button" onClick={() => navigate(session?.user ? "/submit-tool" : "/login")} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm font-bold text-slate-200">
                ↗ Submit a Tool
              </button>
              <button type="button" onClick={() => navigate("/feedback")} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm font-bold text-slate-200">
                ◇ Feedback
              </button>
              <button type="button" onClick={() => navigate("/terms")} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm font-bold text-slate-200">
                Terms
              </button>
              <button type="button" onClick={() => navigate("/privacy")} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm font-bold text-slate-200">
                Privacy
              </button>
              {session?.user ? (
                <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm font-bold text-red-200 disabled:opacity-60">
                  {isLoggingOut ? "Logging out..." : "Log Out"}
                </button>
              ) : (
                <button type="button" onClick={() => navigate("/login")} className="rounded-2xl border border-violet-500/25 bg-violet-500/10 px-4 py-3 text-left text-sm font-bold text-violet-200">
                  Log In
                </button>
              )}
            </div>
          </section>
        </>
      )}

      <nav className="native-bottom-nav fixed inset-x-0 bottom-0 z-[100] border-t border-white/10 bg-[#070910]/96 px-2 pt-2 backdrop-blur-xl">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {primaryItems.map((item) => {
            const active = activeItem(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handlePrimary(item.id)}
                className={`min-w-0 rounded-2xl px-1 py-2 text-center transition active:scale-[0.96] ${
                  active
                    ? "bg-violet-500/14 text-violet-300"
                    : "text-slate-500"
                }`}
              >
                <span className="block h-5 text-lg font-black leading-5" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="mt-1 block truncate text-[10px] font-bold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default NativeBottomNav;
