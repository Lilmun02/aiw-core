import { Capacitor } from "@capacitor/core";

const categories = [
  { name: "Chatbots", searchValue: "Chatbot", icon: "💬", hint: "Assistants & chat" },
  { name: "Writing", searchValue: "writing", icon: "✍️", hint: "Content & copy" },
  { name: "Image Generation", searchValue: "design", icon: "🖼️", hint: "Images & design" },
  { name: "Video", searchValue: "video", icon: "🎥", hint: "Create & edit" },
  { name: "Code Assistant", searchValue: "coding", icon: "💻", hint: "Build & debug" },
  { name: "Productivity", searchValue: "productivity", icon: "📈", hint: "Work smarter" },
];

function Categories({ setSearchTerm }) {
  const isNativeApp = Capacitor.isNativePlatform();

  function handleCategoryClick(searchValue) {
    setSearchTerm(searchValue);

    document
      .getElementById("featured")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className={isNativeApp ? "mt-10" : "mt-14"}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
            Explore
          </p>
          <h2 className={`${isNativeApp ? "mt-1 text-2xl" : "mt-2 text-3xl"} font-black tracking-tight text-white`}>
            Browse by category
          </h2>
        </div>

        {!isNativeApp && (
          <span className="text-sm text-slate-500">Pick a category to filter tools</span>
        )}
      </div>

      <div className={`grid grid-cols-2 ${isNativeApp ? "gap-3" : "gap-3 sm:grid-cols-3 lg:grid-cols-6"}`}>
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => handleCategoryClick(category.searchValue)}
            className={`group border border-slate-800 bg-slate-900/70 text-left shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-slate-900 active:scale-[0.98] ${
              isNativeApp ? "rounded-2xl p-4" : "rounded-2xl p-4 lg:p-5"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className={`${isNativeApp ? "text-2xl" : "text-3xl"}`} aria-hidden="true">
                {category.icon}
              </span>
              <span className="text-slate-700 transition group-hover:text-violet-400">↗</span>
            </div>

            <p className="mt-4 text-sm font-bold leading-5 text-white">
              {category.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">{category.hint}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;