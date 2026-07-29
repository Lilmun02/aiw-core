 import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AchievementsTab from "../components/profile/AchievementsTab";
import MyToolsTab from "../components/profile/MyToolsTab";
import OverviewTab from "../components/profile/OverviewTab";
import ProfileHeader from "../components/profile/ProfileHeader";
import SavedTab from "../components/profile/SavedTab";
import SettingsTab from "../components/profile/SettingsTab";

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

  const isFounder =
    user?.email?.toLowerCase() === founderEmail.toLowerCase();

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
    ...(isFounder
      ? [
          {
            id: "achievements",
            label: "Achievements",
          },
        ]
      : []),
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
        return isFounder ? <AchievementsTab /> : null;

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
            onCancel={() => changeTab("overview")}
          />
        );

      case "overview":
      default:
        return (
          <OverviewTab
            displayName={displayName}
            isFounder={isFounder}
          />
        );
    }
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
          <ProfileHeader
            displayName={displayName}
            isFounder={isFounder}
            onEditProfile={() => changeTab("settings")}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />

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
            {renderActiveTab()}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Profile;