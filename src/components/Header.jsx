function Header() {
  return (
    <header className="py-16 text-center">
      <div className="inline-flex items-center gap-4">
        <span className="text-6xl">🤖</span>

        <h1 className="text-6xl font-extrabold tracking-tight text-white">
          AIWCORE
        </h1>
      </div>

      <h2 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-tight text-white">
        Discover, compare, and explore the world's best AI tools.
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-xl leading-8 text-slate-400">
        Whether you're writing, coding, designing, creating videos, or growing
        a business, AIWCORE helps you discover the right AI faster—all in one
        place.
      </p>
    </header>
  );
}

export default Header;