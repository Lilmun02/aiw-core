import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase.js";
import ToolCard from "./ToolCard.jsx";

const coreTools = [
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
    similarTools: ["Adobe Express", "Microsoft Designer", "Figma AI"],
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
    similarTools: ["Pika", "Kling", "Veo"],
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
  const [databaseTools, setDatabaseTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchPublishedTools();
  }, []);

  async function fetchPublishedTools() {
    setIsLoading(true);
    setLoadError("");

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Published tools error:", error);
      setLoadError("Newly approved tools could not be loaded.");
      setIsLoading(false);
      return;
    }

    const formattedTools = (data || []).map((tool) => ({
      id: tool.id,
      name: tool.tool_name,
      category: tool.category || "Other",
      description: tool.description,
      icon: tool.featured ? "⭐" : "🚀",
      website: tool.website_url,
      rating: "New",
      listingType:
        tool.placement === "featured"
          ? "Featured"
          : tool.placement === "launch_spotlight"
            ? "Launch Spotlight"
            : "New",
      reviewed: true,
      similarTools: [],
      keywords: [
        tool.tool_name,
        tool.company_name,
        tool.category,
        tool.description,
        tool.placement,
      ].filter(Boolean),
    }));

    setDatabaseTools(formattedTools);
    setIsLoading(false);
  }

  const allTools = [...databaseTools, ...coreTools];
  const search = searchTerm.trim().toLowerCase();

  const filteredTools = allTools.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.category,
      tool.description,
      tool.listingType,
      ...(tool.keywords || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(search);
  });

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-5">
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
          className="shrink-0 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Back to Search ↑
        </button>
      </div>

      {loadError && (
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
          {loadError}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 text-center">
          <p className="text-lg font-bold text-white">Loading AI tools...</p>
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id ? `database-${tool.id}` : `core-${tool.name}`}
              tool={tool}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-12 text-center">
          <p className="text-xl font-bold text-white">No AI tools found</p>

          <p className="mt-2 text-slate-400">
            Try searching by AI name, feature, category, or keyword.
          </p>
        </div>
      )}
    </section>
  );
}

export default FeaturedTools;