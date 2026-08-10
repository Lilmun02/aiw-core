import { useState } from "react";
import ToolModal from "./ToolModal.jsx";

const listingStyles = {
  "Launch Spotlight": "border-blue-500/30 bg-blue-500/10 text-blue-300",
  Trending: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  New: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Featured: "border-violet-500/30 bg-violet-500/10 text-violet-300",
};

const listingIcons = {
  "Launch Spotlight": "⭐",
  Trending: "🔥",
  New: "🚀",
  Featured: "💎",
};

function ToolCard({ tool }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal();
    }
  }

  return (
    <>
      <article
        onClick={openModal}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex="0"
        aria-label={`View details for ${tool.name}`}
        className="group flex h-full cursor-pointer flex-col rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-700/70 bg-slate-800/80 text-2xl shadow-inner sm:h-14 sm:w-14 sm:text-3xl">
            {tool.icon}
          </div>

          <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-bold sm:px-3 sm:text-xs ${listingStyles[tool.listingType] || listingStyles.Featured}`}>
            {listingIcons[tool.listingType] || "⭐"} {tool.listingType}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-violet-400">
          <span>{tool.category}</span>
          {tool.reviewed && <span className="text-emerald-400" title="Reviewed by AIWCORE">✓ Reviewed</span>}
        </div>

        <h3 className="mt-2 text-xl font-black tracking-tight text-white sm:text-2xl">
          {tool.name}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
          {tool.description}
        </p>

        <p className="mt-4 text-sm font-bold text-violet-400 transition group-hover:text-violet-300">
          View details →
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
          <span className="text-sm font-bold text-amber-400">★ {tool.rating}</span>

          <a
            href={tool.website}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="rounded-xl border border-violet-500/30 bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            Visit Tool ↗
          </a>
        </div>
      </article>

      {isModalOpen && <ToolModal tool={tool} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default ToolCard;