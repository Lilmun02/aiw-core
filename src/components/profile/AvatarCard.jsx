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

      <div className="min-w-0 pb-1">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-blue-300">
          AIWCORE Profile
        </p>

        <h1 className="break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
          {displayName || "AIWCORE Member"}
        </h1>

        <p className="mt-2 text-base font-bold text-slate-200 sm:text-lg">
          {isFounder ? "Founder & CEO of AIWCORE" : "AI Explorer"}
        </p>

        <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-400">
          {isFounder
            ? "Building AIWCORE and shaping a better way to discover AI tools."
            : "Discovering, saving, and exploring useful AI across the AIWCORE ecosystem."}
        </p>
      </div>
    </div>
  );
}

export default AvatarCard;