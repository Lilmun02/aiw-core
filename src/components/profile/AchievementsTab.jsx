 function AchievementsTab() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
          Achievements
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Your Badges
        </h2>
      </div>

      <div className="max-w-md rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-[#0a1221] p-7">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-300/30 bg-amber-400/10 text-5xl shadow-lg shadow-amber-500/10">
          👑
        </div>

        <h3 className="mt-6 text-2xl font-black text-amber-200">
          Original Founder
        </h3>

        <p className="mt-2 text-sm font-bold text-amber-400">
          Founder Achievement
        </p>

        <p className="mt-4 text-sm leading-6 text-slate-300">
          Awarded to the Founder & CEO responsible for creating AIWCORE.
        </p>

        <div className="mt-6 border-t border-amber-400/20 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Founded
          </p>

          <p className="mt-1 font-bold text-white">
            July 4, 2026
          </p>
        </div>
      </div>
    </section>
  );
}

export default AchievementsTab;