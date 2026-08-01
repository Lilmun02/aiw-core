import AvatarCard from "./AvatarCard";

function ProfileHeader({
  avatarUrl,
  displayName,
  isFounder = false,
  isUploadingAvatar = false,
  isRemovingAvatar = false,
  onUploadAvatar,
  onRemoveAvatar,
  onEditProfile,
  onLogout,
  isLoggingOut = false,
}) {
  return (
    <>
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
          <AvatarCard
            avatarUrl={avatarUrl}
            displayName={displayName}
            isFounder={isFounder}
            isUploadingAvatar={isUploadingAvatar}
            isRemovingAvatar={isRemovingAvatar}
            onUploadAvatar={onUploadAvatar}
            onRemoveAvatar={onRemoveAvatar}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onEditProfile}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
            >
              Edit Profile
            </button>

            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className="rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;