import { Capacitor } from "@capacitor/core";

const quickSearches = ["Chatbots", "Writing", "Coding", "Video"];

function SearchBar({ searchTerm, setSearchTerm }) {
  const isNativeApp = Capacitor.isNativePlatform();

  function goToResults() {
    document
      .getElementById("featured")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    goToResults();
  }

  function handleQuickSearch(value) {
    setSearchTerm(value);
    window.setTimeout(goToResults, 0);
  }

  return (
    <section className={`${isNativeApp ? "mt-5" : "mt-8"} flex justify-center`}>
      <div className="w-full max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className={`group flex w-full items-center overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl shadow-black/20 transition focus-within:border-violet-500/70 ${
            isNativeApp ? "rounded-2xl" : "rounded-3xl"
          }`}
        >
          <span className={`${isNativeApp ? "pl-4" : "pl-6"} text-lg text-slate-500`} aria-hidden="true">
            ⌕
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={isNativeApp ? "What AI are you looking for?" : "Search by tool, category, feature, or task..."}
            aria-label="Search AI tools"
            className={`min-w-0 flex-1 bg-transparent text-white placeholder:text-slate-500 focus:outline-none ${
              isNativeApp ? "px-3 py-4 text-sm" : "px-4 py-5 text-base sm:text-lg"
            }`}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mr-1 rounded-lg px-2 py-2 text-sm text-slate-500 transition hover:text-white"
              aria-label="Clear search"
            >
              ×
            </button>
          )}

          <button
            type="submit"
            className={`shrink-0 font-bold text-white transition ${
              isNativeApp
                ? "m-1.5 rounded-xl bg-violet-600 px-4 py-3 text-sm hover:bg-violet-500"
                : "m-2 rounded-2xl bg-violet-600 px-6 py-3.5 hover:bg-violet-500 sm:px-8"
            }`}
          >
            Search
          </button>
        </form>

        <div className={`flex flex-wrap items-center justify-center gap-2 ${isNativeApp ? "mt-3" : "mt-4"}`}>
          <span className="text-xs font-medium text-slate-500">Popular:</span>
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleQuickSearch(item)}
              className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-400 transition hover:border-violet-500/50 hover:text-violet-300"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SearchBar;