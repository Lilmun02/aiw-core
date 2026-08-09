function SavedTab() {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-5 py-12 text-center sm:px-8 sm:py-16">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl text-violet-200">
        ☆
      </div>

      <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
        Saved AI
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">Your saved tools will live here</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        Bookmarking is not live yet. Once it is added to AIWCORE, the tools you save will appear in this space.
      </p>
    </section>
  );
}

export default SavedTab;
