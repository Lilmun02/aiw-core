function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050a14]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3 lg:px-12">
        <div>
          <a
            href="#home"
            className="flex items-center gap-3 text-xl font-extrabold text-white"
          >
            <span className="text-2xl">🤖</span>
            <span>AIWCORE</span>
          </a>

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
            <a href="#home" className="w-fit transition hover:text-white">
              Home
            </a>

            <a href="#categories" className="w-fit transition hover:text-white">
              Categories
            </a>

            <a href="#featured" className="w-fit transition hover:text-white">
              Featured Tools
            </a>

            <a href="#submit-tool" className="w-fit transition hover:text-white">
              Submit a Tool
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">For AI Companies</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <a href="#submit-tool" className="w-fit transition hover:text-white">
              List Your AI Tool
            </a>

            <a href="#submit-tool" className="w-fit transition hover:text-white">
              Partner With AIWCORE
            </a>

            <a href="#submit-tool" className="w-fit transition hover:text-white">
              Featured Listing Inquiry
            </a>
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