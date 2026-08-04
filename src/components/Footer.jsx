import { Link, useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  function goToSection(sectionId) {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <footer className="border-t border-slate-800 bg-[#050a14]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
        <div>
          <button
            type="button"
            onClick={() => goToSection("home")}
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
              onClick={() => goToSection("home")}
              className="w-fit text-left transition hover:text-white"
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => goToSection("categories")}
              className="w-fit text-left transition hover:text-white"
            >
              Categories
            </button>

            <button
              type="button"
              onClick={() => goToSection("featured")}
              className="w-fit text-left transition hover:text-white"
            >
              Featured Tools
            </button>

            <Link to="/submit-tool" className="w-fit transition hover:text-white">
              Submit a Tool
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Get Involved</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/founder-support" className="w-fit transition hover:text-white">
              Founder Support
            </Link>

            <Link to="/feedback" className="w-fit transition hover:text-white">
              Contact & Feedback
            </Link>

            <Link to="/profile" className="w-fit transition hover:text-white">
              My AIWCORE Profile
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-white">Legal</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <Link to="/terms" className="w-fit transition hover:text-white">
              Terms of Service
            </Link>

            <Link to="/privacy" className="w-fit transition hover:text-white">
              Privacy Policy
            </Link>

            <Link
              to="/founder-support-terms"
              className="w-fit transition hover:text-white"
            >
              Founder Support Terms
            </Link>
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
