import { useRef } from "react";

function AvatarUploader({
  avatarUrl,
  displayName,
  isUploading = false,
  isRemoving = false,
  onUpload,
  onRemove,
}) {
  const fileInputRef = useRef(null);

  function openFilePicker() {
    if (isUploading || isRemoving) return;
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || !onUpload) return;
    await onUpload(file);
  }

  const initial = displayName?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={openFilePicker}
        disabled={isUploading || isRemoving}
        aria-label={avatarUrl ? "Change profile picture" : "Add profile picture"}
        className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-violet-400/60 bg-[#10131d] shadow-[0_0_42px_rgba(124,58,237,0.28)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:h-32 sm:w-32"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName || "AIWCORE Member"} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-500 text-5xl font-black text-white">
            {initial}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/70 px-2 py-2 text-[10px] font-black text-white backdrop-blur transition sm:translate-y-full sm:group-hover:translate-y-0">
          {isUploading ? "Uploading..." : avatarUrl ? "Change" : "Add Photo"}
        </span>

        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          </span>
        )}
      </button>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading || isRemoving}
          className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading ? "Uploading..." : avatarUrl ? "Change Photo" : "Add Photo"}
        </button>

        {avatarUrl && (
          <button
            type="button"
            onClick={onRemove}
            disabled={isUploading || isRemoving}
            className="rounded-full border border-red-500/30 bg-red-500/[0.08] px-3 py-1.5 text-[10px] font-black text-red-200 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        )}
      </div>

      <p className="text-center text-[10px] leading-4 text-slate-600">
        JPG, PNG, WebP, or GIF · 5 MB max
      </p>
    </div>
  );
}

export default AvatarUploader;
