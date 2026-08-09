import { Capacitor } from "@capacitor/core";

function Header() {
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <header className={isNativeApp ? "py-7 text-center" : "py-16 text-center"}>
      <div className={`inline-flex items-center ${isNativeApp ? "gap-3" : "gap-4"}`}>
        <span className={isNativeApp ? "text-4xl" : "text-6xl"}>🤖</span>

        <h1
          className={`${
            isNativeApp ? "text-4xl" : "text-6xl"
          } font-extrabold tracking-tight text-white`}
        >
          AIWCORE
        </h1>
      </div>

      <h2
        className={`mx-auto max-w-4xl font-bold leading-tight text-white ${
          isNativeApp ? "mt-6 text-[2rem]" : "mt-8 text-4xl"
        }`}
      >
        Discover, compare, and explore the world's best AI tools.
      </h2>

      <p
        className={`mx-auto max-w-3xl text-slate-400 ${
          isNativeApp ? "mt-4 text-base leading-7" : "mt-6 text-xl leading-8"
        }`}
      >
        Whether you're writing, coding, designing, creating videos, or growing
        a business, AIWCORE helps you discover the right AI faster—all in one
        place.
      </p>
    </header>
  );
}

export default Header;