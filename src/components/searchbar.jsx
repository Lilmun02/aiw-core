function SearchBar() {
  return (
    <section className="search-section">
      <div className="search-box">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search AI tools, categories, or features..."
          aria-label="Search AI tools"
        />

        <button type="button">Search</button>
      </div>
    </section>
  );
}

export default SearchBar;