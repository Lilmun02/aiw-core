import { useState } from "react";

import { supabase } from "../../lib/supabase.js";

function SettingsTab({
  user,
  displayName,
  setDisplayName,
  email,
  message,
  isError,
  isSaving,
  handleSave,
  onSave,
  onCancel,
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const accountEmail = email || user?.email || "";
  const saveProfile = onSave || handleSave;

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLogoutError(error.message);
      setIsLoggingOut(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
          Profile Settings
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Edit your profile</h2>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Update the information currently supported on your AIWCORE profile.
        </p>

        <form onSubmit={saveProfile} className="mt-6 space-y-5">
          <div>
            <label htmlFor="displayName" className="mb-2 block text-xs font-black text-slate-300">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={50}
              required
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15"
              placeholder="Enter your display name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-black text-slate-300">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={accountEmail}
              readOnly
              className="w-full cursor-not-allowed rounded-2xl border border-white/[0.06] bg-black/15 px-4 py-3.5 text-sm text-slate-500"
            />
            <p className="mt-2 text-[10px] leading-4 text-slate-600">
              Your login email is managed securely through your AIWCORE account.
            </p>
          </div>

          {message && (
            <div
              role={isError ? "alert" : "status"}
              className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${
                isError
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {message}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="submit"
              disabled={isSaving || !saveProfile}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm font-black text-slate-300 transition hover:border-violet-400/25 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Account Access
        </p>
        <h3 className="mt-1 text-lg font-black text-white">Sign out of AIWCORE</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          You can sign back in at any time using your account email.
        </p>

        {logoutError && (
          <div role="alert" className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {logoutError}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-5 w-full rounded-2xl border border-red-500/30 bg-red-500/[0.06] px-5 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "Logging Out..." : "Log Out"}
        </button>
      </div>
    </section>
  );
}

export default SettingsTab;
