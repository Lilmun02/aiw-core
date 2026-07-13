function Footer() {
  function scrollToSection(sectionId) {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  return (
    <footer className="border-t border-slate-800 bg-[#050a14]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
        <div>
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3 text-xl font-extrabold text-white"
          >
            <span className="text-2xl">🤖</span>
            <span>AIWCORE</span>
          </button>

          <p className="mt-4 max-w-sm leading-7 text-slate-400">
            Discover, compare, and explore AI tools built to help people create,
            work, learn, and grow.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Discover AI smarter.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-white">Explore</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <button
              type="button"
              onClick={() => scrollToSection("home")}
              className="w-fit text-left transition hover:text-white"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("categories")}
              className="w-fit text-left transition hover:text-white"
            >
              Categories
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("featured")}
              className="w-fit text-left transition hover:text-white"
            >
              Featured Tools
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("submit-tool")}
              className="w-fit text-left transition hover:text-white"
            >
              Submit a Tool
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">For AI Companies</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <button
              type="button"
              onClick={() => scrollToSection("submit-tool")}
              className="w-fit text-left transition hover:text-white"
            >
              List Your AI Tool
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("submit-tool")}
              className="w-fit text-left transition hover:text-white"
            >
              Partner With AIWCORE
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("submit-tool")}
              className="w-fit text-left transition hover:text-white"
            >
              Featured Listing Inquiry
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-5 py-5 text-center text-sm text-slate-500">
        © 2026 AIWCORE. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;