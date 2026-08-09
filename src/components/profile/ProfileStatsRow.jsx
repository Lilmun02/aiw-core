function ProfileStatsRow({
  badgeCount = 0,
  currentStreak = 0,
  achievementCount = 0,
  onBadgesClick,
  onStreakClick,
  onAchievementsClick,
}) {
  const stats = [
    {
      id: "badges",
      icon: "✦",
      value: badgeCount,
      label: "Badges",
      onClick: onBadgesClick,
      accent: "text-violet-300",
    },
    {
      id: "streak",
      icon: "🔥",
      value: currentStreak,
      label: "Day Streak",
      onClick: onStreakClick,
      accent: "text-orange-300",
    },
    {
      id: "achievements",
      icon: "🏆",
      value: achievementCount,
      label: "Achievements",
      onClick: onAchievementsClick,
      accent: "text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <button
          key={stat.id}
          type="button"
          onClick={stat.onClick}
          className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.035] px-2 py-4 text-center transition hover:border-violet-400/25 hover:bg-white/[0.055] active:scale-[0.98] sm:px-4"
        >
          <span className={`block text-xl font-black ${stat.accent}`} aria-hidden="true">
            {stat.icon}
          </span>

          <span className="mt-2 block text-2xl font-black text-white">
            {stat.value}
          </span>

          <span className="mt-1 block truncate text-[9px] font-black uppercase tracking-[0.08em] text-slate-500 sm:text-[10px]">
            {stat.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ProfileStatsRow;
