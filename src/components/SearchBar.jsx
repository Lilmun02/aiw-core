import { Capacitor } from "@capacitor/core";

function SearchBar({ searchTerm, setSearchTerm }) {
  const isNativeApp = Capacitor.isNativePlatform();

  function handleSubmit(event) {
    event.preventDefault();

    document
      .getElementById("featured")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className={`${isNativeApp ? "mt-5" : "mt-10"} flex justify-center`}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-lg"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={isNativeApp ? "Search AI tools..." : "Search AI tools, categories, or features..."}
          aria-label="Search AI tools"
          className={`min-w-0 flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none ${
            isNativeApp ? "px-4 py-3" : "px-6 py-4"
          }`}
        />

        <button
          type="submit"
          className={`shrink-0 font-semibold text-white transition ${
            isNativeApp
              ? "bg-violet-600 px-5 hover:bg-violet-500"
              : "bg-blue-600 px-8 hover:bg-blue-500"
          }`}
        >
          Search
        </button>
      </form>
    </section>
  );
}

export default SearchBar;