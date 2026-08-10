import { Capacitor } from "@capacitor/core";

function Header() {
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <header className={isNativeApp ? "pt-7 pb-2" : "pt-14 pb-4 sm:pt-20"}>
      <div className="mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-violet-300">
          <span aria-hidden="true">✦</span>
          AI discovery, simplified
        </div>

        <h1
          className={`mx-auto font-black tracking-[-0.045em] text-white ${
            isNativeApp
              ? "mt-5 max-w-sm text-[2.55rem] leading-[1.04]"
              : "mt-6 max-w-4xl text-5xl leading-[1.02] sm:text-6xl lg:text-7xl"
          }`}
        >
          Find the right AI tool without the noise.
        </h1>

        <p
          className={`mx-auto text-slate-400 ${
            isNativeApp
              ? "mt-4 max-w-md text-[0.95rem] leading-6"
              : "mt-6 max-w-2xl text-lg leading-8 sm:text-xl"
          }`}
        >
          Search, compare, and discover useful AI for work, creativity, coding,
          and everyday ideas—all from one focused directory.
        </p>

        <div
          className={`mx-auto flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400 ${
            isNativeApp ? "mt-5" : "mt-7"
          }`}
        >
          <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
            ⚡ Fast discovery
          </span>
          <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
            ✓ Reviewed listings
          </span>
          <span className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5">
            ◇ Built for AI explorers
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;