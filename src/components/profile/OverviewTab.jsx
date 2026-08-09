import { getNextStreakBadge } from "../../lib/profileBadges.js";

function formatJoinedDate(joinedAt) {
  if (!joinedAt) return "Not available";

  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function OverviewTab({
  displayName,
  email = "",
  joinedAt = null,
  isFounder = false,
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
    ? Math.min((currentStreak / nextStreakBadge.requirement) * 100, 100)
    : 100;

  return (
    <div className="space-y-3 sm:space-y-4">
      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
              About
            </p>
            <h2 className="mt-1 text-xl font-black text-white">
              {displayName || "AIWCORE Member"}
            </h2>
          </div>
          <span className="rounded-xl border border-violet-400/15 bg-violet-500/[0.08] px-3 py-1.5 text-xs font-black text-violet-200">
            {isFounder ? "Founder" : "AI Explorer"}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          {isFounder
            ? "Founder profile for building and managing AIWCORE."
            : "Your AIWCORE identity for tracking progress, saved AI, tools, and achievements."}
        </p>

        <div className="mt-5 space-y-2 border-t border-white/[0.07] pt-4 text-sm">
          <div className="flex items-start gap-3 rounded-2xl bg-black/15 px-3 py-3">
            <span className="text-violet-300" aria-hidden="true">✉</span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Email</p>
              <p className="mt-0.5 break-all font-semibold text-slate-300">
                {email || "Not available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-black/15 px-3 py-3">
            <span className="text-violet-300" aria-hidden="true">◷</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">Member since</p>
              <p className="mt-0.5 font-semibold text-slate-300">
                {formatJoinedDate(joinedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-300">
              Recent Progress
            </p>
            <h3 className="mt-1 text-xl font-black text-white">Activity streak</h3>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-orange-300">{currentStreak}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">days</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
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

        <div className="mt-5 border-t border-white/[0.07] pt-4">
          {nextStreakBadge ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white">Next: {nextStreakBadge.name}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Reach {nextStreakBadge.requirement} consecutive days to unlock it.
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-orange-400/10 px-2.5 py-1 text-[10px] font-black text-orange-300">
                  {daysRemaining} left
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm font-black text-violet-200">Highest streak badge unlocked</p>
              <p className="mt-1 text-xs text-slate-500">Keep your activity going and extend your personal record.</p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300">
          Featured Badge
        </p>

        {featuredBadge ? (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl shadow-[0_0_28px_rgba(124,58,237,0.12)]">
              {featuredBadge.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-white">{featuredBadge.name}</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">{featuredBadge.description}</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center">
            <div className="text-2xl">✦</div>
            <h3 className="mt-2 font-black text-white">Your first badge awaits</h3>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Keep using AIWCORE and reaching real milestones to earn recognition.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

export default OverviewTab;
