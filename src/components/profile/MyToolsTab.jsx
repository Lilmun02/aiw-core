import { useNavigate } from "react-router-dom";

function MyToolsTab() {
  const navigate = useNavigate();

  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-5 py-12 text-center sm:px-8 sm:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl text-violet-200">
        ◇
      </div>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
        My Tools
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">Your AIWCORE submissions</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        AI tools submitted through your account will appear here as the account-linked tools view is expanded.
      </p>

      <button
        type="button"
        onClick={() => navigate("/submit-tool")}
        className="mt-7 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-black text-white shadow-[0_10px_30px_rgba(124,58,237,0.22)] transition hover:brightness-110 active:scale-[0.98]"
      >
        Submit a Tool
      </button>
    </section>
  );
}

export default MyToolsTab;
