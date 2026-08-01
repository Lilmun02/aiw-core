 import AvatarUploader from "./AvatarUploader";

function AvatarCard({
  avatarUrl,
  displayName,
  isFounder = false,
  isUploadingAvatar = false,
  isRemovingAvatar = false,
  onUploadAvatar,
  onRemoveAvatar,
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
      <AvatarUploader
        avatarUrl={avatarUrl}
        displayName={displayName}
        isUploading={isUploadingAvatar}
        isRemoving={isRemovingAvatar}
        onUpload={onUploadAvatar}
        onRemove={onRemoveAvatar}
      />

      <div className="pb-1">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-black sm:text-4xl">
            {displayName || "AIWCORE Member"}
          </h1>

          {isFounder && (
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
              👑 Original Founder
            </span>
          )}
        </div>

        <p className="text-lg font-bold text-blue-300">
          {isFounder ? "Founder & CEO of AIWCORE" : "AIWCORE Member"}
        </p>

        <p className="mt-2 text-sm font-medium text-slate-400">
          {isFounder
            ? "🚀 Founded July 4, 2026"
            : "Exploring AI with AIWCORE"}
        </p>
      </div>
    </div>
  );
}

export default AvatarCard;