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
      label: "Badges",
      onClick: onBadgesClick,
    },
    {
      id: "streak",
      icon: "🔥",
      value: currentStreak,
      label: "Streak",
      onClick: onStreakClick,
    },
    {
      id: "achievements",
      icon: "🏆",
      value: achievementCount,
      label: "Achievements",
      onClick: onAchievementsClick,
    },
  ];

  return (
    <div className="grid grid-cols-3 border-y border-slate-800/80 py-5">
      {stats.map((stat, index) => (
        <button
          key={stat.id}
          type="button"
          onClick={stat.onClick}
          className={`flex min-w-0 flex-col items-center justify-center px-1 text-center transition active:scale-[0.98] sm:px-3 ${
            stat.onClick
              ? "cursor-pointer hover:text-white"
              : "cursor-default"
          } ${index > 0 ? "border-l border-slate-800/80" : ""}`}
        >
          <span className="text-2xl" aria-hidden="true">
            {stat.icon}
          </span>

          <span className="mt-2 text-2xl font-black text-white">
            {stat.value}
          </span>

          <span className="mt-1 w-full whitespace-normal break-words text-[10px] font-bold uppercase leading-tight tracking-normal text-slate-500 sm:text-xs sm:tracking-[0.08em]">
            {stat.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ProfileStatsRow;