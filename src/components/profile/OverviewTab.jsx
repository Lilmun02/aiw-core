 function OverviewTab({ displayName, isFounder }) {
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
              <span className="text-2xl">👑</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400/70">
                Badges
              </span>
            </div>

            <p className="mt-6 text-3xl font-black text-amber-300">
              {isFounder ? 1 : 0}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {isFounder ? "Original Founder" : "No badges yet"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0a1221] p-5">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🚀</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Since
              </span>
            </div>

            <p className="mt-6 text-xl font-black">July 4, 2026</p>

            <p className="mt-1 text-sm text-slate-400">
              AIWCORE founded
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-[#0a1221] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Recent Activity
              </p>

              <h3 className="mt-2 text-xl font-black">
                Your AIWCORE Journey
              </h3>
            </div>

            <span className="text-2xl">🔥</span>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 px-6 py-10 text-center">
            <p className="text-lg font-bold text-slate-200">
              No activity yet
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Saved tools, submissions, reviews, and achievements will appear
              here as AIWCORE grows.
            </p>
          </div>
        </section>

        {isFounder ? (
          <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-transparent p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-400/10 text-3xl">
              👑
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Exclusive Badge
            </p>

            <h3 className="mt-2 text-2xl font-black">
              Original Founder
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Awarded exclusively to the creator and Founder of AIWCORE.
            </p>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-800 bg-[#0a1221] p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-800/60 text-3xl">
              ✨
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Achievements
            </p>

            <h3 className="mt-2 text-2xl font-black">
              More badges coming soon
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Future AIWCORE activity and milestones will unlock achievements
              here.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

export default OverviewTab;