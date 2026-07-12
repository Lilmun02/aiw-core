 import { useState } from "react";
import ToolModal from "./ToolModal.jsx";

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
        className="group flex h-full cursor-pointer flex-col rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/70 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
            {tool.icon}
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              listingStyles[tool.listingType] || listingStyles.Featured
            }`}
          >
            {listingIcons[tool.listingType] || "⭐"} {tool.listingType}
          </span>
        </div>

        <p className="mt-6 text-sm font-medium text-blue-400">
          {tool.category}
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
          {tool.name}
        </h3>

        <p className="mt-4 text-base leading-7 text-slate-400">
          {tool.description}
        </p>

        <p className="mt-5 text-sm font-semibold text-blue-400 transition group-hover:text-blue-300">
          View details →
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-5">
          <span className="text-sm font-semibold text-amber-400">
            ★ {tool.rating}
          </span>

          <a
            href={tool.website}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Visit Tool
          </a>
        </div>
      </article>

      {isModalOpen && (
        <ToolModal
          tool={tool}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default ToolCard;