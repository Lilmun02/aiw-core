 const featuredTools = [
  {
    name: "ChatGPT",
    category: "Chatbot",
    description:
      "A powerful AI assistant for writing, research, ideas, coding, and everyday tasks.",
    icon: "🤖",
    website: "https://chatgpt.com",
    rating: "4.9",
  },
  {
    name: "Canva",
    category: "Design",
    description:
      "Create graphics, presentations, social posts, and AI-powered designs.",
    icon: "🎨",
    website: "https://www.canva.com",
    rating: "4.8",
  },
  {
    name: "Runway",
    category: "Video",
    description:
      "Create and edit videos using advanced AI-powered tools.",
    icon: "🎥",
    website: "https://runwayml.com",
    rating: "4.7",
  },
];

function FeaturedTools() {
  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Recommended
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Featured AI Tools
          </h2>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          View All →
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredTools.map((tool) => (
          <article
            key={tool.name}
            className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/70 hover:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-3xl">
                {tool.icon}
              </div>

              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                Featured
              </span>
            </div>

            <p className="mt-6 text-sm font-medium text-blue-400">
              {tool.category}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white">
              {tool.name}
            </h3>

            <p className="mt-3 min-h-20 text-base leading-7 text-slate-400">
              {tool.description}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-sm font-semibold text-amber-400">
                ★ {tool.rating}
              </span>

              <a
                href={tool.website}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Visit Tool
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturedTools;