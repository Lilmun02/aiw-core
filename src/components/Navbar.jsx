const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Categories", href: "#categories" },
  { name: "Featured", href: "#featured" },
  { name: "Blog", href: "#blog" },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070d1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a
          href="#home"
          className="flex items-center gap-3 text-xl font-extrabold text-white"
        >
          <span className="text-2xl">🤖</span>
          <span>AIW Core</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Submit a Tool
        </button>
      </div>
    </nav>
  );
}

export default Navbar;