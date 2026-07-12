 const navLinks = [
  { name: "Home", href: "#home", resetsHome: true },
  { name: "Categories", href: "#categories" },
  { name: "Featured", href: "#featured" },
  { name: "Submit", href: "#submit-tool" },
];

function Navbar({ onLogoClick }) {
  function handleHomeClick(event) {
    event.preventDefault();
    onLogoClick();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070d1a]/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <a
          href="#home"
          onClick={handleHomeClick}
          className="flex items-center gap-3 text-xl font-extrabold text-white"
          aria-label="Return to the AIWCORE homepage"
        >
          <span className="text-2xl">🤖</span>
          <span>AIWCORE</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={link.resetsHome ? handleHomeClick : undefined}
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </div>

        <a
          href="#submit-tool"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Submit a Tool
        </a>
      </div>
    </nav>
  );
}

export default Navbar;