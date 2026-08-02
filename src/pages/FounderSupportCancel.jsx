import { useNavigate } from "react-router-dom";

function FounderSupportCancel() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070d1a] px-5 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900/80 p-8 text-center">
        <div className="text-5xl">↩️</div>
        <h1 className="mt-5 text-3xl font-black">Checkout canceled</h1>
        <p className="mt-4 leading-7 text-slate-300">
          You were not charged, and your AIWCORE account remains on the free tier. Founder Support is still available while enrollment is open.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => navigate("/founder-support")} className="rounded-xl bg-blue-600 px-5 py-3 font-black hover:bg-blue-500">
            Return to Founder Support
          </button>
          <button type="button" onClick={() => navigate("/")} className="rounded-xl border border-slate-700 px-5 py-3 font-black text-slate-200 hover:border-slate-500">
            Continue on Free Tier
          </button>
        </div>
      </section>
    </main>
  );
}

export default FounderSupportCancel;
