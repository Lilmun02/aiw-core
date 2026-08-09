import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AchievementsTab from "../components/profile/AchievementsTab";
import MyToolsTab from "../components/profile/MyToolsTab";
import OverviewTab from "../components/profile/OverviewTab";
import ProfileHeader from "../components/profile/ProfileHeader";
import SavedTab from "../components/profile/SavedTab";
import SettingsTab from "../components/profile/SettingsTab";

import { removeAvatar, uploadAvatar } from "../lib/avatarStorage.js";
import {
  getAchievementCount,
  getEarnedBadges,
  getFeaturedBadge,
} from "../lib/profileBadges.js";
import { supabase } from "../lib/supabase.js";

const emptyStreak = {
  current_streak: 0,
  longest_streak: 0,
  total_days: 0,
  last_active_date: null,
};

const tabs = [
  { id: "overview", label: "Overview", icon: "▦" },
  { id: "saved", label: "Saved", icon: "⌑" },
  { id: "tools", label: "Tools", icon: "◇" },
  { id: "achievements", label: "Awards", icon: "✦" },
  { id: "settings", label: "More", icon: "•••" },
];

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [accountRole, setAccountRole] = useState("user");
  const [streak, setStreak] = useState(emptyStreak);
  const [isFounderSupporter, setIsFounderSupporter] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

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

      if (!isMounted) return;

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
        "AIWCORE Member";

      const { error: checkInError } = await supabase.rpc(
        "check_in_user_streak",
      );

      if (checkInError) {
        console.error("Profile streak check-in failed:", checkInError.message);
      }

      const [profileResult, streakResult, supporterResult] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            "display_name, avatar_url, account_role, is_founding_supporter",
          )
          .eq("id", currentUser.id)
          .maybeSingle(),
        supabase
          .from("user_streaks")
          .select(
            "current_streak, longest_streak, total_days, last_active_date",
          )
          .eq("user_id", currentUser.id)
          .maybeSingle(),
        supabase
          .from("founder_supporters")
          .select("user_id,status")
          .eq("user_id", currentUser.id)
          .maybeSingle(),
      ]);

      if (!isMounted) return;

      if (streakResult.error) {
        console.error(
          "Unable to load streak information:",
          streakResult.error.message,
        );
      } else if (streakResult.data) {
        setStreak({
          current_streak: streakResult.data.current_streak || 0,
          longest_streak: streakResult.data.longest_streak || 0,
          total_days: streakResult.data.total_days || 0,
          last_active_date: streakResult.data.last_active_date || null,
        });
      } else {
        setStreak(emptyStreak);
      }

      if (profileResult.error) {
        setIsError(true);
        setMessage(profileResult.error.message);
        setDisplayName(defaultDisplayName);
        setAvatarUrl(null);
        setAccountRole("user");
        setIsFounderSupporter(false);
        setIsLoading(false);
        return;
      }

      const supporterActive =
        Boolean(supporterResult.data) && supporterResult.data.status === "active";

      if (supporterResult.error) {
        console.error(
          "Unable to load Founder Supporter status:",
          supporterResult.error.message,
        );
      }

      if (profileResult.data) {
        setDisplayName(profileResult.data.display_name || defaultDisplayName);
        setAvatarUrl(profileResult.data.avatar_url || null);
        setAccountRole(profileResult.data.account_role || "user");
        setIsFounderSupporter(
          Boolean(profileResult.data.is_founding_supporter) || supporterActive,
        );
        setIsLoading(false);
        return;
      }

      const { data: createdProfile, error: createError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: currentUser.id,
            display_name: defaultDisplayName,
            avatar_url: null,
            account_role: "user",
          },
          { onConflict: "id" },
        )
        .select(
          "display_name, avatar_url, account_role, is_founding_supporter",
        )
        .single();

      if (!isMounted) return;

      if (createError) {
        setIsError(true);
        setMessage(createError.message);
        setDisplayName(defaultDisplayName);
        setAvatarUrl(null);
        setAccountRole("user");
        setIsFounderSupporter(false);
        setIsLoading(false);
        return;
      }

      setDisplayName(createdProfile?.display_name || defaultDisplayName);
      setAvatarUrl(createdProfile?.avatar_url || null);
      setAccountRole(createdProfile?.account_role || "user");
      setIsFounderSupporter(
        Boolean(createdProfile?.is_founding_supporter) || supporterActive,
      );
      setIsLoading(false);
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;
      if (event === "SIGNED_OUT" || !currentSession) {
        navigate("/login", { replace: true });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const isFounder = accountRole === "founder";

  const earnedBadges = useMemo(
    () =>
      getEarnedBadges({
        isFounder,
        isFounderSupporter,
        hasEarlyAccess: false,
        currentStreak: streak.current_streak || 0,
      }),
    [isFounder, isFounderSupporter, streak.current_streak],
  );

  const featuredBadge = useMemo(
    () => getFeaturedBadge(earnedBadges),
    [earnedBadges],
  );

  const achievementCount = useMemo(
    () =>
      getAchievementCount({
        earnedBadges,
        currentStreak: streak.current_streak || 0,
        longestStreak: streak.longest_streak || 0,
        totalDays: streak.total_days || 0,
      }),
    [earnedBadges, streak],
  );

  async function handleUploadAvatar(file) {
    if (!user || isUploadingAvatar || isRemovingAvatar) return;

    setIsUploadingAvatar(true);
    setMessage("");
    setIsError(false);

    try {
      const uploadedAvatarUrl = await uploadAvatar({ userId: user.id, file });
      setAvatarUrl(uploadedAvatarUrl);
      setMessage("Profile picture updated successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "AIWCORE could not upload your profile picture.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    if (!user || !avatarUrl || isUploadingAvatar || isRemovingAvatar) return;

    if (!window.confirm("Remove your current profile picture?")) return;

    setIsRemovingAvatar(true);
    setMessage("");
    setIsError(false);

    try {
      await removeAvatar(user.id);
      setAvatarUrl(null);
      setMessage("Profile picture removed successfully.");
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "AIWCORE could not remove your profile picture.",
      );
    } finally {
      setIsRemovingAvatar(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!user) return;

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
      { id: user.id, display_name: cleanDisplayName },
      { onConflict: "id" },
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

  function changeTab(tabName, shouldScroll = false) {
    setActiveTab(tabName);
    setMessage("");
    setIsError(false);

    if (shouldScroll) {
      window.requestAnimationFrame(() => {
        document.getElementById("profile-tab-panel")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }

  function renderActiveTab() {
    switch (activeTab) {
      case "saved":
        return <SavedTab />;
      case "tools":
        return <MyToolsTab />;
      case "achievements":
        return (
          <AchievementsTab
            earnedBadges={earnedBadges}
            achievementCount={achievementCount}
            streak={streak}
          />
        );
      case "settings":
        return (
          <SettingsTab
            user={user}
            displayName={displayName}
            setDisplayName={setDisplayName}
            handleSave={handleSave}
            isSaving={isSaving}
            message={message}
            isError={isError}
            onCancel={() => changeTab("overview", true)}
          />
        );
      case "overview":
      default:
        return (
          <OverviewTab
            displayName={displayName}
            email={user?.email || ""}
            joinedAt={user?.created_at || null}
            isFounder={isFounder}
            streak={streak}
            featuredBadge={featuredBadge}
          />
        );
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070d] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-violet-500" />
          <p className="text-slate-300">Loading My AIWCORE...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#151026_0%,#080a12_30%,#05070d_72%)] pb-28 text-white md:pb-10">
      <div className="mx-auto w-full max-w-3xl px-3 py-4 sm:px-6 sm:py-7">
        <div className="mb-4 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Return to AIWCORE"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-slate-200 transition hover:border-violet-400/40 hover:text-white active:scale-95"
          >
            ←
          </button>

          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-300">
              AIWCORE
            </p>
            <p className="mt-0.5 text-sm font-black text-white">My Profile</p>
          </div>

          <button
            type="button"
            onClick={() => changeTab("settings", true)}
            aria-label="Open profile settings"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-slate-200 transition hover:border-violet-400/40 hover:text-white active:scale-95"
          >
            ⚙
          </button>
        </div>

        {message && activeTab !== "settings" && (
          <div
            role={isError ? "alert" : "status"}
            className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
              isError
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            }`}
          >
            {message}
          </div>
        )}

        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0d15]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur">
          <ProfileHeader
            avatarUrl={avatarUrl}
            displayName={displayName}
            isFounder={isFounder}
            joinedAt={user?.created_at || null}
            isUploadingAvatar={isUploadingAvatar}
            isRemovingAvatar={isRemovingAvatar}
            onUploadAvatar={handleUploadAvatar}
            onRemoveAvatar={handleRemoveAvatar}
            badgeCount={earnedBadges.length}
            currentStreak={streak.current_streak || 0}
            achievementCount={achievementCount}
            onBadgesClick={() => changeTab("achievements", true)}
            onStreakClick={() => changeTab("overview", true)}
            onAchievementsClick={() => changeTab("achievements", true)}
          />

          <nav className="mx-3 mb-3 rounded-2xl border border-white/10 bg-[#080b12]/90 p-1.5 sm:mx-5">
            <div className="grid grid-cols-5 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changeTab(tab.id, true)}
                  className={`min-w-0 rounded-xl px-1 py-2.5 text-center transition active:scale-[0.97] ${
                    activeTab === tab.id
                      ? "bg-violet-500/15 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)]"
                      : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                  }`}
                >
                  <span className="block text-base font-black leading-none" aria-hidden="true">
                    {tab.icon}
                  </span>
                  <span className="mt-1.5 block truncate text-[10px] font-bold sm:text-xs">
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </nav>

          <div
            id="profile-tab-panel"
            className="scroll-mt-4 border-t border-white/[0.06] p-3 sm:p-5"
          >
            {renderActiveTab()}
          </div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070910]/95 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-xl px-1 py-2 text-center text-slate-500 transition active:scale-95"
          >
            <span className="block text-lg">⌂</span>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/#categories")}
            className="rounded-xl px-1 py-2 text-center text-slate-500 transition active:scale-95"
          >
            <span className="block text-lg">▦</span>
            <span className="text-[10px] font-bold">Categories</span>
          </button>
          <button
            type="button"
            onClick={() => window.location.assign("/#home")}
            className="rounded-xl px-1 py-2 text-center text-slate-500 transition active:scale-95"
          >
            <span className="block text-lg">⌕</span>
            <span className="text-[10px] font-bold">Search</span>
          </button>
          <button
            type="button"
            onClick={() => changeTab("saved", true)}
            className={`rounded-xl px-1 py-2 text-center transition active:scale-95 ${
              activeTab === "saved" ? "text-violet-300" : "text-slate-500"
            }`}
          >
            <span className="block text-lg">☆</span>
            <span className="text-[10px] font-bold">Saved</span>
          </button>
          <button
            type="button"
            onClick={() => changeTab("overview", true)}
            className={`rounded-xl px-1 py-2 text-center transition active:scale-95 ${
              activeTab !== "saved" ? "text-violet-300" : "text-slate-500"
            }`}
          >
            <span className="block text-lg">●</span>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </main>
  );
}

export default Profile;
