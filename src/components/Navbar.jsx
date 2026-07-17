 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

const menuLinks = [
  { name: "Home", icon: "🏠", sectionId: "home", resetsHome: true },
  { name: "Categories", icon: "📂", sectionId: "categories" },
  { name: "Featured", icon: "⭐", sectionId: "featured" },
];

function Navbar({ onLogoClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(undefined);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleHomeClick() {
    closeMenu();

    if (onLogoClick) {
      onLogoClick();
    }
  }

  function handleSectionClick(sectionId, resetsHome = false) {
    closeMenu();

    if (resetsHome) {
      handleHomeClick();
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSubmitClick() {
    closeMenu();

    document.getElementById("submit-tool")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handlePageNavigation(path) {
    closeMenu();
    navigate(path);
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    setIsLoggingOut(false);
    closeMenu();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    navigate("/");
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070d1a]/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={handleHomeClick}
            className="flex shrink-0 items-center gap-2 text-lg font-extrabold text-white sm:gap-3 sm:text-xl"
            aria-label="Return to the AIWCORE homepage"
          >
            <span className="text-xl sm:text-2xl">🤖</span>
            <span>AIWCORE</span>
          </button>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={handleHomeClick}
              className="rounded-lg px-2 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white sm:px-3 sm:text-sm"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => handleSectionClick("categories")}
              className="rounded-lg px-2 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white sm:px-3 sm:text-sm"
            >
              Categories
            </button>

            {session === undefined ? (
              <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-800" />
            ) : session ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
              >
                {isLoggingOut ? "Logging Out..." : "Log Out"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePageNavigation("/login")}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 sm:px-4 sm:text-sm"
              >
                Log In
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="ml-1 flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 text-white transition hover:border-blue-500 hover:bg-slate-800 sm:h-11 sm:w-11"
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
            >
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </button>
          </div>
        </div>
      </nav>

      <div
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col border-l border-slate-800 bg-[#0b1220] shadow-2xl transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="AIWCORE navigation menu"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <p className="text-lg font-bold text-white">AIWCORE Menu</p>
            <p className="text-sm text-slate-400">
              Find the right AI in minutes.
            </p>
          </div>

          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 text-xl text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            aria-label="Close navigation menu"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="space-y-2">
            {menuLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() =>
                  handleSectionClick(link.sectionId, link.resetsHome)
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </button>
            ))}
          </div>

          <div className="my-5 border-t border-slate-800" />

          <div className="space-y-2">
            {session === undefined ? (
              <div className="h-12 w-full animate-pulse rounded-xl bg-slate-800" />
            ) : session ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex w-full items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-left font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>🚪</span>
                <span>{isLoggingOut ? "Logging Out..." : "Log Out"}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handlePageNavigation("/login")}
                  className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-left font-semibold text-white transition hover:bg-blue-500"
                >
                  <span>🔐</span>
                  <span>Log In</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePageNavigation("/signup")}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <span>👤</span>
                  <span>Create Account</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleSubmitClick}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>📤</span>
              <span>Submit a Tool</span>
            </button>

            <button
              type="button"
              onClick={() => handlePageNavigation("/feedback")}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <span>💬</span>
              <span>Feedback</span>
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 px-6 py-5">
          <p className="text-center text-xs text-slate-500">
            AI discovery built around ambition, integrity, and willingness.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Navbar;