 import { getNextStreakBadge } from "../../lib/profileBadges.js";

function OverviewTab({
  displayName,
  streak,
  featuredBadge = null,
}) {
  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;
  const totalDays = streak?.total_days || 0;

  const nextStreakBadge = getNextStreakBadge(currentStreak);

  const daysRemaining = nextStreakBadge
    ? Math.max(nextStreakBadge.requirement - currentStreak, 0)
    : 0;

  const progress = nextStreakBadge
    ? Math.min(
        (currentStreak / nextStreakBadge.requirement) * 100,
        100,
      )
    : 100;

  return (
    <div className="space-y-10">
      <section>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-400">
          Member Dashboard
        </p>

        <h2 className="mt-2 text-2xl font-black">
          Welcome back, {displayName || "Member"}.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Track your activity, earned recognition, and progress across
          AIWCORE.
        </p>
      </section>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-300">
              Daily Activity
            </p>

            <h3 className="mt-2 text-2xl font-black">
              Your AIWCORE streak
            </h3>
          </div>

          <div className="text-right">
            <p className="text-4xl font-black text-orange-300">
              {currentStreak}
            </p>

            <p className="text-sm text-slate-500">
              {currentStreak === 1
                ? "consecutive day"
                : "consecutive days"}
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-3 text-center">
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

        <div className="mt-8">
          {nextStreakBadge ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-black text-white">
                    Next badge: {nextStreakBadge.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Unlocks at {nextStreakBadge.requirement} consecutive
                    days.
                  </p>
                </div>

                <span className="text-sm font-bold text-orange-300">
                  {daysRemaining}{" "}
                  {daysRemaining === 1 ? "day" : "days"} remaining
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <div>
              <p className="font-black text-amber-300">
                Highest streak badge unlocked
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Keep returning to extend your streak and personal record.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-slate-800 pt-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
          Featured Badge
        </p>

        {featuredBadge ? (
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center text-4xl">
              {featuredBadge.icon}
            </div>

            <div>
              <h3 className="text-xl font-black text-white">
                {featuredBadge.name}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                {featuredBadge.description}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-5">
            <h3 className="text-xl font-black text-white">
              Your first badge awaits
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Continue using AIWCORE and reaching milestones to earn
              recognition on your profile.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default OverviewTab;