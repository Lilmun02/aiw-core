import { useEffect } from "react";

const listingStyles = {
  "Launch Spotlight":
    "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Trending:
    "border-orange-500/30 bg-orange-500/10 text-orange-300",
  New:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Featured:
    "border-purple-500/30 bg-purple-500/10 text-purple-300",
};

const listingIcons = {
  "Launch Spotlight": "⭐",
  Trending: "🔥",
  New: "🚀",
  Featured: "💎",
};

function ToolModal({ tool, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-700 bg-[#0b1220] p-6 shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${tool.name}-modal-title`}
      >
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-4xl">
              {tool.icon}
            </div>

            <div>
              <p className="text-sm font-medium text-blue-400">
                {tool.category}
              </p>

              <h2
                id={`${tool.name}-modal-title`}
                className="mt-1 text-3xl font-bold text-white"
              >
                {tool.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tool details"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xl text-slate-300 transition hover:border-blue-500 hover:text-white"
          >
            ×
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              listingStyles[tool.listingType] || listingStyles.Featured
            }`}
          >
            {listingIcons[tool.listingType] || "⭐"} {tool.listingType}
          </span>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              tool.reviewed
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            {tool.reviewed
              ? "✔ AIWCORE Reviewed"
              : "⏳ Review Pending"}
          </span>

          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            ★ {tool.rating}
          </span>
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            About this tool
          </h3>

          <p className="mt-3 text-base leading-8 text-slate-300">
            {tool.description}
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
          <h3 className="text-sm font-bold text-white">
            You may also like
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {tool.similarTools.map((similarTool) => (
              <span
                key={similarTool}
                className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
              >
                {similarTool}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={tool.website}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-500"
          >
            Visit {tool.name}
          </a>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToolModal;