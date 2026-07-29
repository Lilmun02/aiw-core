import { useNavigate } from "react-router-dom";

function MyToolsTab() {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0a1221] px-6 py-16 text-center">
      <div className="text-5xl">📤</div>

      <h2 className="mt-5 text-2xl font-black">My Tools</h2>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
        AI tools submitted through your account will appear here.
      </p>

      <button
        type="button"
        onClick={() => navigate("/submit-tool")}
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
      >
        Submit a Tool
      </button>
    </section>
  );
}

export default MyToolsTab;