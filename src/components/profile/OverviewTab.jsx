 function getStreakBadge(currentStreak) {
  if (currentStreak >= 30) {
    return {
      name: "Core Member",
      icon: "👑",
      description:
        "Maintained an active AIWCORE streak for at least 30 consecutive days.",
      nextGoal: null,
    };
  }

  if (currentStreak >= 14) {
    return {
      name: "Dedicated User",
      icon: "💎",
      description:
        "Maintained an active AIWCORE streak for at least 14 consecutive days.",
      nextGoal: 30,
    };
  }

  if (currentStreak >= 7) {
    return {
      name: "Consistent User",
      icon: "⚡",
      description:
        "Maintained an active AIWCORE streak for at least 7 consecutive days.",
      nextGoal: 14,
    };
  }

  if (currentStreak >= 3) {
    return {
      name: "Active User",
      icon: "🔥",
      description:
        "Maintained an active AIWCORE streak for at least 3 consecutive days.",
      nextGoal: 7,
    };
  }

  return {
    name: null,
    icon: "✨",
    description:
      "Return to AIWCORE on consecutive days to earn your first activity badge.",
    nextGoal: 3,
  };
}

function OverviewTab({ displayName, isFounder, streak }) {
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const totalDays = streak?.total_days || 0;

  const streakBadge = getStreakBadge(currentStreak);
  const earnedStreakBadge = Boolean(streakBadge.name);
  const badgeCount = (isFounder ? 1 : 0) + (earnedStreakBadge ? 1 : 0);

  const daysUntilNextBadge = streakBadge.nextGoal
    ? Math.max(streakBadge.nextGoal - currentStreak, 0)
    : 0;

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            {isFounder ? "Founder Dashboard" : "Member Dashboard"}
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Welcome back, {displayName || "Member"}.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            This is your personal space for tracking your activity, tools,
            badges, and progress across AIWCORE.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0a1221] p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">⭐</span>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Saved
              </span>
            </div>

            <p className="mt-6 text-3xl font-black">0</p>

            <p className="mt-1 text-sm text-slate-400">
              Saved AI tools
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0a1221] p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📤</span>

              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Submitted
              </span>
            </div>

            <p className="mt-6 text-3xl font-black">0</p>

            <p className="mt-1 text-sm text-slate-400">
              Submitted tools
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">
                {earnedStreakBadge ? streakBadge.icon : "🏅"}
              </span>

              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/70">
                Badges
              </span>
            </div>

            <p className="mt-6 text-3xl font-black text-amber-300">
              {badgeCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {badgeCount === 0
                ? "No badges yet"
                : badgeCount === 1
                  ? "Badge earned"
                  : "Badges earned"}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400/20 bg-orange-400/5 p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔥</span>

              <span className="text-xs font-bold uppercase tracking-wider text-orange-300/70">
                Current Streak
              </span>
            </div>

            <p className="mt-6 text-3xl font-black text-orange-300">
              {currentStreak}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {currentStreak === 1 ? "Consecutive day" : "Consecutive days"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-[#0a1221] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Daily Activity
              </p>

              <h3 className="mt-2 text-xl font-black">
                Your AIWCORE Streak
              </h3>
            </div>

            <span className="text-3xl">🔥</span>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-[#070d1a] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current
              </p>

              <p className="mt-3 text-3xl font-black text-orange-300">
                {currentStreak}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Day streak
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#070d1a] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Longest
              </p>

              <p className="mt-3 text-3xl font-black">
                {longestStreak}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Best streak
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#070d1a] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Active
              </p>

              <p className="mt-3 text-3xl font-black">
                {totalDays}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Active days
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-[#070d1a] p-5">
            {streakBadge.nextGoal ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-slate-200">
                    Next badge at {streakBadge.nextGoal} days
                  </p>

                  <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-bold text-slate-300">
                    {daysUntilNextBadge}{" "}
                    {daysUntilNextBadge === 1 ? "day" : "days"} remaining
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (currentStreak / streakBadge.nextGoal) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  Return on consecutive days to keep your streak active.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-amber-300">
                  Maximum activity badge reached
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  Keep returning to extend your streak and set a new personal
                  record.
                </p>
              </>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-transparent p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10 text-3xl">
            {earnedStreakBadge ? streakBadge.icon : "✨"}
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Activity Badge
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {earnedStreakBadge
              ? streakBadge.name
              : "Your First Badge Awaits"}
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            {streakBadge.description}
          </p>

          {isFounder && (
            <div className="mt-6 border-t border-amber-300/20 pt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👑</span>

                <div>
                  <p className="font-black text-amber-200">
                    Original Founder
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Awarded exclusively to the creator and Founder of AIWCORE.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default OverviewTab;