const categories = [
  { name: "Chatbots", icon: "💬" },
  { name: "Writing", icon: "✍️" },
  { name: "Image Generation", icon: "🖼️" },
  { name: "Video", icon: "🎥" },
  { name: "Code Assistant", icon: "💻" },
  { name: "Productivity", icon: "📊" },
];

function Categories() {
  return (
    <section className="categories-section">
      <h2>Browse Categories</h2>

      <div className="categories-grid">
        {categories.map((category) => (
          <button
            className="category-card"
            type="button"
            key={category.name}
          >
            <span className="category-icon">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Categories;