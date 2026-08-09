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
    <div className="flex flex-col items-center text-center">
      <AvatarUploader
        avatarUrl={avatarUrl}
        displayName={displayName}
        isUploading={isUploadingAvatar}
        isRemoving={isRemovingAvatar}
        onUpload={onUploadAvatar}
        onRemove={onRemoveAvatar}
      />

      <div className="mt-5 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-violet-300">
          AIWCORE Profile
        </p>

        <h1 className="mt-2 break-words text-3xl font-black tracking-tight text-white sm:text-4xl">
          {displayName || "AIWCORE Member"}
        </h1>

        <p className="mt-2 text-sm font-black text-violet-300 sm:text-base">
          {isFounder ? "Founder" : "AI Explorer"}
        </p>

        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-6 text-slate-400">
          {isFounder
            ? "Building AIWCORE and shaping a better way to discover useful AI."
            : "Exploring AIWCORE, building progress, and discovering useful AI tools."}
        </p>
      </div>
    </div>
  );
}

export default AvatarCard;
