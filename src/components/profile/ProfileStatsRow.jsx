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
      icon: "🏅",
      value: badgeCount,
      label: badgeCount === 1 ? "Badge" : "Badges",
      onClick: onBadgesClick,
    },
    {
      id: "streak",
      icon: "🔥",
      value: currentStreak,
      label: currentStreak === 1 ? "Day Streak" : "Day Streak",
      onClick: onStreakClick,
    },
    {
      id: "achievements",
      icon: "🏆",
      value: achievementCount,
      label: achievementCount === 1 ? "Achievement" : "Achievements",
      onClick: onAchievementsClick,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 border-y border-slate-800/80 py-5">
      {stats.map((stat, index) => (
        <button
          key={stat.id}
          type="button"
          onClick={stat.onClick}
          className={`flex min-w-0 flex-col items-center justify-center px-2 text-center transition active:scale-[0.98] ${
            stat.onClick
              ? "cursor-pointer hover:text-white"
              : "cursor-default"
          } ${
            index > 0
              ? "border-l border-slate-800/80"
              : ""
          }`}
        >
          <span className="text-2xl" aria-hidden="true">
            {stat.icon}
          </span>

          <span className="mt-2 text-2xl font-black text-white">
            {stat.value}
          </span>

          <span className="mt-1 truncate text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">
            {stat.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ProfileStatsRow;