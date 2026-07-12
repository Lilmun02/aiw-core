 import ToolCard from "./ToolCard.jsx";

const featuredTools = [
  {
    name: "ChatGPT",
    category: "Chatbot",
    description:
      "A powerful AI assistant for writing, research, ideas, coding, and everyday tasks.",
    icon: "🤖",
    website: "https://chatgpt.com",
    rating: "4.9",
    listingType: "Launch Spotlight",
    reviewed: true,
    similarTools: ["Claude", "Gemini", "Perplexity"],
    keywords: [
      "chatgpt",
      "chat",
      "assistant",
      "ai",
      "code",
      "coding",
      "programming",
      "developer",
      "python",
      "javascript",
      "writing",
      "research",
      "productivity",
    ],
  },
  {
    name: "Canva",
    category: "Design",
    description:
      "Create graphics, presentations, social posts, and AI-powered designs.",
    icon: "🎨",
    website: "https://www.canva.com",
    rating: "4.8",
    listingType: "Trending",
    reviewed: true,
    similarTools: [
      "Adobe Express",
      "Microsoft Designer",
      "Figma AI",
    ],
    keywords: [
      "design",
      "logo",
      "thumbnail",
      "poster",
      "flyer",
      "graphics",
      "branding",
      "presentation",
      "image",
    ],
  },
  {
    name: "Runway",
    category: "Video",
    description:
      "Create and edit videos using advanced AI-powered tools.",
    icon: "🎥",
    website: "https://runwayml.com",
    rating: "4.7",
    listingType: "New",
    reviewed: false,
    similarTools: [
      "Pika",
      "Kling",
      "Veo",
    ],
    keywords: [
      "video",
      "youtube",
      "editing",
      "animation",
      "movie",
      "film",
      "creator",
    ],
  },
];

function FeaturedTools({ searchTerm }) {
  const search = searchTerm.trim().toLowerCase();

  const filteredTools = featuredTools.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.category,
      tool.description,
      tool.listingType,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search);
  });

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

          <p className="mt-2 text-sm text-slate-400">
            Discover launch spotlights, trending AI, and powerful new tools.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Back to Search ↑
        </button>
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.name} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 text-center">
          <p className="text-xl font-bold text-white">
            No AI tools found
          </p>

          <p className="mt-2 text-slate-400">
            Try searching by AI name, feature, category, or keyword.
          </p>
        </div>
      )}
    </section>
  );
}

export default FeaturedTools;