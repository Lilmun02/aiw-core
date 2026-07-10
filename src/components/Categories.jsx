 const categories = [
  { name: "Chatbots", icon: "💬" },
  { name: "Writing", icon: "✍️" },
  { name: "Image Generation", icon: "🖼️" },
  { name: "Video", icon: "🎥" },
  { name: "Code Assistant", icon: "💻" },
  { name: "Productivity", icon: "📈" },
];

function Categories() {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
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
            className="rounded-2xl border border-slate-700 bg-slate-900 p-5 transition duration-200 hover:border-blue-500 hover:bg-slate-800 hover:scale-105"
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