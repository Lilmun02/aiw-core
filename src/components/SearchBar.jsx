 function SearchBar({ searchTerm, setSearchTerm }) {
  function handleSubmit(event) {
    event.preventDefault();

    document
      .getElementById("featured")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="mt-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search AI tools, categories, or features..."
          aria-label="Search AI tools"
          className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          className="bg-blue-600 px-8 font-semibold text-white transition hover:bg-blue-500"
        >
          Search
        </button>
      </form>
    </section>
  );
}

export default SearchBar;