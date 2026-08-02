 import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AchievementsTab from "../components/profile/AchievementsTab";
import MyToolsTab from "../components/profile/MyToolsTab";
import OverviewTab from "../components/profile/OverviewTab";
import ProfileHeader from "../components/profile/ProfileHeader";
import SavedTab from "../components/profile/SavedTab";
import SettingsTab from "../components/profile/SettingsTab";

import {
  removeAvatar,
  uploadAvatar,
} from "../lib/avatarStorage.js";

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

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [streak, setStreak] = useState(emptyStreak);
  const [isFounderSupporter, setIsFounderSupporter] =
    useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] =
    useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] =
    useState(false);

  const founderEmail = "lilmunofficial18@gmail.com";

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
        "AIWCORE Member";

      const { error: checkInError } = await supabase.rpc(
        "check_in_user_streak",
      );

      if (checkInError) {
        console.error(
          "Profile streak check-in failed:",
          checkInError.message,
        );
      }

      const [
        profileResult,
        streakResult,
        supporterResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("display_name, avatar_url")
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
          .select("user_id")
          .eq("user_id", currentUser.id)
          .maybeSingle(),
      ]);

      if (!isMounted) {
        return;
      }

      if (streakResult.error) {
        console.error(
          "Unable to load streak information:",
          streakResult.error.message,
        );
      } else if (streakResult.data) {
        setStreak({
          current_streak:
            streakResult.data.current_streak || 0,
          longest_streak:
            streakResult.data.longest_streak || 0,
          total_days:
            streakResult.data.total_days || 0,
          last_active_date:
            streakResult.data.last_active_date || null,
        });
      } else {
        setStreak(emptyStreak);
      }

      if (supporterResult.error) {
        console.error(
          "Unable to load Founder Supporter status:",
          supporterResult.error.message,
        );

        setIsFounderSupporter(false);
      } else {
        setIsFounderSupporter(
          Boolean(supporterResult.data),
        );
      }

      if (profileResult.error) {
        setIsError(true);
        setMessage(profileResult.error.message);
        setDisplayName(defaultDisplayName);
        setAvatarUrl(null);
        setIsLoading(false);
        return;
      }

      if (profileResult.data) {
        setDisplayName(
          profileResult.data.display_name ||
            defaultDisplayName,
        );

        setAvatarUrl(
          profileResult.data.avatar_url || null,
        );

        setIsLoading(false);
        return;
      }

      const {
        data: createdProfile,
        error: createError,
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: currentUser.id,
            display_name: defaultDisplayName,
            avatar_url: null,
          },
          {
            onConflict: "id",
          },
        )
        .select("display_name, avatar_url")
        .single();

      if (!isMounted) {
        return;
      }

      if (createError) {
        setIsError(true);
        setMessage(createError.message);
        setDisplayName(defaultDisplayName);
        setAvatarUrl(null);
        setIsLoading(false);
        return;
      }

      setDisplayName(
        createdProfile?.display_name ||
          defaultDisplayName,
      );

      setAvatarUrl(
        createdProfile?.avatar_url || null,
      );

      setIsLoading(false);
    }

    loadProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted) {
          return;
        }

        if (
          event === "SIGNED_OUT" ||
          !currentSession
        ) {
          navigate("/login", {
            replace: true,
          });
        }
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const isFounder =
    user?.email?.toLowerCase() ===
    founderEmail.toLowerCase();

  const earnedBadges = useMemo(
    () =>
      getEarnedBadges({
        isFounder,
        isFounderSupporter,
        hasEarlyAccess: false,
        currentStreak:
          streak.current_streak || 0,
      }),
    [
      isFounder,
      isFounderSupporter,
      streak.current_streak,
    ],
  );

  const featuredBadge = useMemo(
    () => getFeaturedBadge(earnedBadges),
    [earnedBadges],
  );

  const achievementCount = useMemo(
    () =>
      getAchievementCount({
        earnedBadges,
        currentStreak:
          streak.current_streak || 0,
        longestStreak:
          streak.longest_streak || 0,
        totalDays:
          streak.total_days || 0,
      }),
    [earnedBadges, streak],
  );

  async function handleUploadAvatar(file) {
    if (
      !user ||
      isUploadingAvatar ||
      isRemovingAvatar
    ) {
      return;
    }

    setIsUploadingAvatar(true);
    setMessage("");
    setIsError(false);

    try {
      const uploadedAvatarUrl =
        await uploadAvatar({
          userId: user.id,
          file,
        });

      setAvatarUrl(uploadedAvatarUrl);

      setMessage(
        "Profile picture updated successfully.",
      );
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
    if (
      !user ||
      !avatarUrl ||
      isUploadingAvatar ||
      isRemovingAvatar
    ) {
      return;
    }

    const shouldRemove = window.confirm(
      "Remove your current profile picture?",
    );

    if (!shouldRemove) {
      return;
    }

    setIsRemovingAvatar(true);
    setMessage("");
    setIsError(false);

    try {
      await removeAvatar(user.id);

      setAvatarUrl(null);

      setMessage(
        "Profile picture removed successfully.",
      );
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

    if (!user) {
      return;
    }

    const cleanDisplayName =
      displayName.trim();

    if (!cleanDisplayName) {
      setIsError(true);
      setMessage(
        "Please enter a display name.",
      );
      return;
    }

    setIsSaving(true);
    setMessage("");
    setIsError(false);

    const { error } = await supabase
      .from("profiles")
      .upsert(
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

    setMessage(
      "Profile updated successfully.",
    );
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    setMessage("");
    setIsError(false);

    const { error } =
      await supabase.auth.signOut();

    setIsLoggingOut(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
      return;
    }

    navigate("/", {
      replace: true,
    });
  }

  function changeTab(tabName) {
    setActiveTab(tabName);
    setMessage("");
    setIsError(false);
  }

  const tabs = [
    {
      id: "overview",
      label: "Overview",
    },
    {
      id: "saved",
      label: "Saved AI",
    },
    {
      id: "tools",
      label: "My Tools",
    },
    {
      id: "achievements",
      label: "Achievements",
    },
    {
      id: "settings",
      label: "Settings",
    },
  ];

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
            achievementCount={
              achievementCount
            }
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
            onCancel={() =>
              changeTab("overview")
            }
          />
        );

      case "overview":
      default:
        return (
          <OverviewTab
            displayName={displayName}
            streak={streak}
            featuredBadge={
              featuredBadge
            }
          />
        );
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070d1a] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="text-slate-300">
            Loading My AIWCORE...
          </p>
        </div>
      </main>
    );
  }

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
            onClick={() =>
              changeTab("settings")
            }
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white"
          >
            ⚙ Settings
          </button>
        </div>

        {message &&
          activeTab !== "settings" && (
            <div
              role={
                isError
                  ? "alert"
                  : "status"
              }
              className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                isError
                  ? "border-red-500/40 bg-red-500/10 text-red-200"
                  : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {message}
            </div>
          )}

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-[#0d1526] shadow-2xl">
          <ProfileHeader
            avatarUrl={avatarUrl}
            displayName={displayName}
            isFounder={isFounder}
            isUploadingAvatar={
              isUploadingAvatar
            }
            isRemovingAvatar={
              isRemovingAvatar
            }
            onUploadAvatar={
              handleUploadAvatar
            }
            onRemoveAvatar={
              handleRemoveAvatar
            }
            badgeCount={
              earnedBadges.length
            }
            currentStreak={
              streak.current_streak || 0
            }
            achievementCount={
              achievementCount
            }
            onBadgesClick={() =>
              changeTab("achievements")
            }
            onStreakClick={() =>
              changeTab("overview")
            }
            onAchievementsClick={() =>
              changeTab("achievements")
            }
            onEditProfile={() =>
              changeTab("settings")
            }
            onLogout={handleLogout}
            isLoggingOut={
              isLoggingOut
            }
          />

          <nav className="border-y border-slate-800 px-4 sm:px-8">
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    changeTab(tab.id)
                  }
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
            {renderActiveTab()}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;