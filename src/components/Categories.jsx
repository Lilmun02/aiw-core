 const categories = [
  { name: "Chatbots", searchValue: "Chatbot", icon: "💬" },
  { name: "Writing", searchValue: "writing", icon: "✍️" },
  { name: "Image Generation", searchValue: "design", icon: "🖼️" },
  { name: "Video", searchValue: "video", icon: "🎥" },
  { name: "Code Assistant", searchValue: "coding", icon: "💻" },
  { name: "Productivity", searchValue: "productivity", icon: "📈" },
];

function Categories({ setSearchTerm }) {
  function handleCategoryClick(searchValue) {
    setSearchTerm(searchValue);

    document
      .getElementById("featured")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          Browse Categories
        </h2>

        <span className="text-sm text-slate-400">
          Explore AI by category
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => handleCategoryClick(category.searchValue)}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-5 transition duration-200 hover:scale-105 hover:border-blue-500 hover:bg-slate-800"
          >
            <div className="text-3xl">{category.icon}</div>

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