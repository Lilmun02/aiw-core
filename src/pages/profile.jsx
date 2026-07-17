 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setMessage("");
      setIsError(false);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (sessionError) {
        setIsError(true);
        setMessage(sessionError.message);
        setIsLoading(false);
        return;
      }

      const currentUser = session?.user;

      if (!currentUser) {
        navigate("/login", { replace: true });
        return;
      }

      setUser(currentUser);

      const defaultDisplayName =
        currentUser.user_metadata?.full_name ||
        currentUser.email?.split("@")[0] ||
        "AIWCORE Founder";

      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (profileError) {
        setIsError(true);
        setMessage(profileError.message);
        setDisplayName(defaultDisplayName);
        setIsLoading(false);
        return;
      }

      if (existingProfile) {
        setDisplayName(existingProfile.display_name || defaultDisplayName);
        setIsLoading(false);
        return;
      }

      const { data: createdProfile, error: createError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: currentUser.id,
            display_name: defaultDisplayName,
          },
          {
            onConflict: "id",
          },
        )
        .select("display_name")
        .single();

      if (!isMounted) {
        return;
      }

      if (createError) {
        setIsError(true);
        setMessage(createError.message);
        setDisplayName(defaultDisplayName);
        setIsLoading(false);
        return;
      }

      setDisplayName(createdProfile?.display_name || defaultDisplayName);
      setIsLoading(false);
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) {
        return;
      }

      if (event === "SIGNED_OUT" || !currentSession) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSave(event) {
    event.preventDefault();

    if (!user) {
      return;
    }

    const cleanDisplayName = displayName.trim();

    if (!cleanDisplayName) {
      setIsError(true);
      setMessage("Please enter a display name.");
      return;
    }

    setIsSaving(true);
    setMessage("");
    setIsError(false);

    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name: cleanDisplayName,
      },
      {
        onConflict: "id",
      },
    );

    setIsSaving(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    setDisplayName(cleanDisplayName);
    setMessage("Profile updated successfully.");
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    setMessage("");
    setIsError(false);

    const { error } = await supabase.auth.signOut();

    setIsLoggingOut(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    navigate("/", { replace: true });
  }

  function changeTab(tabName) {
    setActiveTab(tabName);
    setMessage("");
    setIsError(false);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070d1a] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />
          <p className="text-slate-300">Loading My AIWCORE...</p>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "saved", label: "Saved AI" },
    { id: "tools", label: "My Tools" },
    { id: "achievements", label: "Achievements" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <main className="min-h-screen bg-[#070d1a] text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            ← Return to AIWCORE
          </button>

          <button
            type="button"
            onClick={() => changeTab("settings")}
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
          >
            ⚙ Settings
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1526] shadow-2xl">
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-500 sm:h-56">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%)]" />
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="absolute right-8 top-8 text-right">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/70">
                My AIWCORE
              </p>

              <p className="mt-2 max-w-xs text-sm text-white/80">
                Building the future of AI discovery.
              </p>
            </div>
          </div>

          <div className="relative px-6 pb-8 sm:px-10">
            <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl border-4 border-[#0d1526] bg-[#111c31] text-5xl shadow-xl">
                  👤
                </div>

                <div className="pb-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black sm:text-4xl">
                      {displayName || "AIWCORE Founder"}
                    </h1>

                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                      👑 Original Founder
                    </span>
                  </div>

                  <p className="text-lg font-bold text-blue-300">
                    Founder & CEO of AIWCORE
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-400">
                    🚀 Founded July 4, 2026
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => changeTab("settings")}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  Edit Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging Out..." : "Log Out"}
                </button>
              </div>
            </div>
          </div>

          <nav className="border-y border-slate-800 px-4 sm:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changeTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="p-6 sm:p-8 lg:p-10">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <section>
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                      Founder Dashboard
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Welcome back, {displayName || "Founder"}.
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      This is your personal space for tracking your activity,
                      tools, badges, and progress across AIWCORE.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-800 bg-[#0a1221] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">⭐</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Saved
                        </span>
                      </div>

                      <p className="mt-6 text-3xl font-black">0</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Saved AI tools
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#0a1221] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">📤</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Submitted
                        </span>
                      </div>

                      <p className="mt-6 text-3xl font-black">0</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Submitted tools
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">👑</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400/70">
                          Badges
                        </span>
                      </div>

                      <p className="mt-6 text-3xl font-black text-amber-300">
                        1
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Original Founder
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#0a1221] p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🚀</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Since
                        </span>
                      </div>

                      <p className="mt-6 text-xl font-black">July 4, 2026</p>

                      <p className="mt-1 text-sm text-slate-400">
                        AIWCORE founded
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                  <section className="rounded-2xl border border-slate-800 bg-[#0a1221] p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                          Recent Activity
                        </p>

                        <h3 className="mt-2 text-xl font-black">
                          Your AIWCORE journey
                        </h3>
                      </div>

                      <span className="text-2xl">🔥</span>
                    </div>

                    <div className="mt-8 rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center">
                      <p className="text-lg font-bold text-slate-200">
                        No activity yet
                      </p>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Saved tools, submissions, reviews, and other activity
                        will appear here as AIWCORE grows.
                      </p>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-transparent p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10 text-3xl">
                      👑
                    </div>

                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                      Exclusive Badge
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                      Original Founder
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Awarded exclusively to the creator and Founder of
                      AIWCORE. This badge cannot be purchased or earned by
                      another account.
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <section className="rounded-2xl border border-slate-800 bg-[#0a1221] px-6 py-16 text-center">
                <div className="text-5xl">⭐</div>

                <h2 className="mt-5 text-2xl font-black">Saved AI</h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                  Your saved AI tools will appear here once bookmarking is
                  added to AIWCORE.
                </p>
              </section>
            )}

            {activeTab === "tools" && (
              <section className="rounded-2xl border border-slate-800 bg-[#0a1221] px-6 py-16 text-center">
                <div className="text-5xl">📤</div>

                <h2 className="mt-5 text-2xl font-black">My Tools</h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
                  AI tools submitted through your account will appear here.
                </p>
              </section>
            )}

            {activeTab === "achievements" && (
              <section>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Achievements
                  </p>

                  <h2 className="mt-2 text-2xl font-black">Your badges</h2>
                </div>

                <div className="max-w-md rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-[#0a1221] p-7">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-300/30 bg-amber-400/10 text-5xl shadow-lg shadow-amber-500/10">
                    👑
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-amber-200">
                    Original Founder
                  </h3>

                  <p className="mt-2 text-sm font-bold text-amber-400">
                    Founder Achievement
                  </p>

                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Awarded to the Founder & CEO responsible for creating
                    AIWCORE.
                  </p>

                  <div className="mt-6 border-t border-amber-400/20 pt-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Founded
                    </p>

                    <p className="mt-1 font-bold text-white">July 4, 2026</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === "settings" && (
              <section className="mx-auto max-w-3xl">
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
                    Account Settings
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Edit your profile
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Update the information displayed on your AIWCORE profile.
                  </p>
                </div>

                <form
                  onSubmit={handleSave}
                  className="space-y-6 rounded-3xl border border-slate-800 bg-[#0a1221] p-6 sm:p-8"
                >
                  <div>
                    <label
                      htmlFor="displayName"
                      className="mb-2 block text-sm font-bold text-slate-200"
                    >
                      Display name
                    </label>

                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                      maxLength={50}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-[#111c31] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-slate-200"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-[#070d1a] px-4 py-3 text-slate-500"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      Your login email is managed securely through Supabase.
                    </p>
                  </div>

                  {message && (
                    <div
                      role="status"
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        isError
                          ? "border-red-500/30 bg-red-500/10 text-red-300"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </button>

                    <button
                      type="button"
                      onClick={() => changeTab("overview")}
                      className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;