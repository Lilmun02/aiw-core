function AchievementsTab({
  earnedBadges = [],
  achievementCount = 0,
  streak,
}) {
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const totalDays = streak?.total_days || 0;

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
          Achievements
        </p>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">Your AIWCORE progress</h2>
            <p className="mt-2 max-w-lg text-xs leading-5 text-slate-500">
              Recognition appears here only after your account reaches a real milestone or eligible status.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-black text-violet-300">{achievementCount}</p>
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-600">total</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
              Badge Collection
            </p>
            <h3 className="mt-1 text-lg font-black text-white">Earned badges</h3>
          </div>
          <span className="rounded-full border border-white/[0.08] bg-black/15 px-3 py-1 text-xs font-black text-slate-400">
            {earnedBadges.length}
          </span>
        </div>

        {earnedBadges.length ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {earnedBadges.map((badge) => (
              <article
                key={badge.id}
                className="rounded-2xl border border-white/[0.07] bg-black/15 p-4 text-center transition hover:border-violet-400/25"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] text-3xl shadow-[0_0_24px_rgba(124,58,237,0.12)]">
                  {badge.icon}
                </div>
                <h4 className="mt-3 text-sm font-black text-white">{badge.name}</h4>
                <p className="mt-1 text-[10px] leading-4 text-slate-500">{badge.description}</p>
                {badge.category === "streak" && badge.requirement && (
                  <p className="mt-2 text-[9px] font-black uppercase tracking-wider text-orange-300">
                    {badge.requirement}-day streak
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center">
            <div className="text-3xl">✦</div>
            <h4 className="mt-3 font-black text-white">No badges earned yet</h4>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
              Continue using AIWCORE and reaching eligible milestones to build your collection.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
          Activity Milestones
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            [currentStreak, "Current"],
            [longestStreak, "Longest"],
            [totalDays, "Active days"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/[0.06] bg-black/15 px-2 py-4 text-center">
              <p className="text-xl font-black text-white">{value}</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-slate-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AchievementsTab;
