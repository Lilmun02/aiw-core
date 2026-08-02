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
  const accountEmail = email || user?.email || "";
  const saveProfile = onSave || handleSave;

  return (
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
        onSubmit={saveProfile}
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
            value={accountEmail}
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-[#070d1a] px-4 py-3 text-slate-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            Your login email is managed securely through Supabase.
          </p>
        </div>

        {message && (
          <div
            role={isError ? "alert" : "status"}
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
            disabled={isSaving || !saveProfile}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-700 px-6 py-3 font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default SettingsTab;