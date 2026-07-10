 function Header() {
  return (
    <header className="text-center py-16">
      <div className="inline-flex items-center gap-4">
        <span className="text-6xl">🤖</span>

        <h1 className="text-6xl font-extrabold tracking-tight text-white">
          AIW Core
        </h1>
      </div>

      <p className="mt-5 text-xl text-slate-400 max-w-2xl mx-auto">
        Discover the world's best AI tools in one place.
      </p>
    </header>
  );
}

export default Header;