 function AchievementsTab({
  earnedBadges = [],
  achievementCount = 0,
  streak,
}) {
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const totalDays = streak?.total_days || 0;

  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
          Achievements
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Your AIWCORE progress
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Badges appear here only after your account reaches the required
          milestone or status.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 border-y border-slate-800 py-6 text-center">
        <div>
          <p className="text-2xl font-black text-white">
            {earnedBadges.length}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Badges
          </p>
        </div>

        <div className="border-x border-slate-800">
          <p className="text-2xl font-black text-orange-300">
            {currentStreak}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Day Streak
          </p>
        </div>

        <div>
          <p className="text-2xl font-black text-white">
            {achievementCount}
          </p>

          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
            Achievements
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
              Earned Recognition
            </p>

            <h3 className="mt-2 text-2xl font-black">
              Your badges
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            {earnedBadges.length === 1
              ? "1 badge earned"
              : `${earnedBadges.length} badges earned`}
          </p>
        </div>

        {earnedBadges.length ? (
          <div className="mt-7 space-y-6">
            {earnedBadges.map((badge) => (
              <article
                key={badge.id}
                className="flex items-start gap-4 border-b border-slate-800 pb-6 last:border-b-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center text-4xl">
                  {badge.icon}
                </div>

                <div>
                  <h4 className="text-xl font-black text-white">
                    {badge.name}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {badge.description}
                  </p>

                  {badge.category === "streak" && badge.requirement && (
                    <p className="mt-3 text-xs font-bold uppercase tracking-wider text-orange-300">
                      Unlocked at {badge.requirement} consecutive days
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 border-y border-slate-800 py-10 text-center">
            <div className="text-4xl">✨</div>

            <h4 className="mt-4 text-xl font-black text-white">
              No badges earned yet
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Continue using AIWCORE, building your streak, and participating
              in eligible programs to earn recognition.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-slate-800 pt-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
          Activity Milestones
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-black text-white">
              {currentStreak}
            </p>

            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Current
            </p>
          </div>

          <div className="border-x border-slate-800">
            <p className="text-2xl font-black text-white">
              {longestStreak}
            </p>

            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Longest
            </p>
          </div>

          <div>
            <p className="text-2xl font-black text-white">
              {totalDays}
            </p>

            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AchievementsTab;