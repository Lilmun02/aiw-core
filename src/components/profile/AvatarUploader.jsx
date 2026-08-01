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
    if (isUploading || isRemoving) {
      return;
    }

    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !onUpload) {
      return;
    }

    await onUpload(file);
  }

  const initial =
    displayName?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="flex flex-col items-start gap-3">
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
        aria-label={
          avatarUrl
            ? "Change profile picture"
            : "Add profile picture"
        }
        className="group relative h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-[#0d1526] bg-[#111c31] shadow-xl transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={`${displayName || "AIWCORE Member"} profile`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-500 text-5xl font-black text-white">
            {initial}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/65 px-2 py-2 text-xs font-bold text-white backdrop-blur transition sm:translate-y-full sm:group-hover:translate-y-0">
          {isUploading
            ? "Uploading..."
            : avatarUrl
              ? "Change Photo"
              : "Add Photo"}
        </span>

        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          </span>
        )}
      </button>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={isUploading || isRemoving}
          className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-200 transition hover:bg-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploading
            ? "Uploading..."
            : avatarUrl
              ? "Change Photo"
              : "Add Photo"}
        </button>

        {avatarUrl && (
          <button
            type="button"
            onClick={onRemove}
            disabled={isUploading || isRemoving}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        )}
      </div>

      <p className="max-w-[15rem] text-xs leading-5 text-slate-500">
        JPG, PNG, WebP, or GIF. Maximum size 5 MB.
      </p>
    </div>
  );
}

export default AvatarUploader;