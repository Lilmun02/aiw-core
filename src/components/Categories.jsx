import { Capacitor } from "@capacitor/core";

const categories = [
  { name: "Chatbots", searchValue: "Chatbot", icon: "💬" },
  { name: "Writing", searchValue: "writing", icon: "✍️" },
  { name: "Image Generation", searchValue: "design", icon: "🖼️" },
  { name: "Video", searchValue: "video", icon: "🎥" },
  { name: "Code Assistant", searchValue: "coding", icon: "💻" },
  { name: "Productivity", searchValue: "productivity", icon: "📈" },
];

function Categories({ setSearchTerm }) {
  const isNativeApp = Capacitor.isNativePlatform();

  function handleCategoryClick(searchValue) {
    setSearchTerm(searchValue);

    document
      .getElementById("featured")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className={isNativeApp ? "mt-12" : "mt-16"}>
      <div
        className={`mb-6 ${
          isNativeApp
            ? "space-y-1"
            : "flex items-center justify-between"
        }`}
      >
        <h2 className={`${isNativeApp ? "text-2xl" : "text-3xl"} font-bold text-white`}>
          Browse Categories
        </h2>

        <span className="block text-sm text-slate-400">
          Explore AI by category
        </span>
      </div>

      <div className={`grid grid-cols-2 ${isNativeApp ? "gap-3" : "gap-4"} md:grid-cols-3 lg:grid-cols-6`}>
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => handleCategoryClick(category.searchValue)}
            className={`rounded-2xl border border-slate-700 bg-slate-900 transition duration-200 hover:border-violet-500 hover:bg-slate-800 ${
              isNativeApp ? "p-4 active:scale-[0.98]" : "p-5 hover:scale-105"
            }`}
          >
            <div className={isNativeApp ? "text-2xl" : "text-3xl"}>{category.icon}</div>

            <p className="mt-3 text-sm font-semibold text-white">
              {category.name}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;