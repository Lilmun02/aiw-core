const STREAK_BADGES = [
  {
    id: "streak-30",
    name: "Core Member",
    icon: "💎",
    requirement: 30,
    description:
      "Maintained an active AIWCORE streak for 30 consecutive days.",
  },
  {
    id: "streak-14",
    name: "Dedicated User",
    icon: "🏆",
    requirement: 14,
    description:
      "Maintained an active AIWCORE streak for 14 consecutive days.",
  },
  {
    id: "streak-7",
    name: "Consistent User",
    icon: "⚡",
    requirement: 7,
    description:
      "Maintained an active AIWCORE streak for 7 consecutive days.",
  },
  {
    id: "streak-3",
    name: "Active User",
    icon: "🔥",
    requirement: 3,
    description:
      "Maintained an active AIWCORE streak for 3 consecutive days.",
  },
];

export function getEarnedBadges({
  isFounder = false,
  isFounderSupporter = false,
  hasEarlyAccess = false,
  currentStreak = 0,
}) {
  const badges = [];

  if (isFounder) {
    badges.push({
      id: "original-founder",
      name: "Original Founder",
      icon: "👑",
      category: "founder",
      description:
        "Reserved exclusively for the Founder and creator of AIWCORE.",
    });
  }

  if (isFounderSupporter) {
    badges.push({
      id: "founder-supporter",
      name: "Founder Supporter",
      icon: "💎",
      category: "supporter",
      description:
        "Awarded to members who officially joined the Founder Support Program.",
    });
  }

  if (hasEarlyAccess) {
    badges.push({
      id: "early-access",
      name: "Early Access",
      icon: "🚀",
      category: "early-access",
      description:
        "Awarded to members who helped test AIWCORE during its early-access stage.",
    });
  }

  const earnedStreakBadges = STREAK_BADGES.filter(
    (badge) => currentStreak >= badge.requirement,
  )
    .reverse()
    .map((badge) => ({
      ...badge,
      category: "streak",
    }));

  return [...badges, ...earnedStreakBadges];
}

export function getNextStreakBadge(currentStreak = 0) {
  const milestones = [...STREAK_BADGES].reverse();

  return (
    milestones.find((badge) => currentStreak < badge.requirement) || null
  );
}

export function getAchievementCount({
  earnedBadges = [],
  currentStreak = 0,
  longestStreak = 0,
  totalDays = 0,
}) {
  let count = earnedBadges.length;

  if (currentStreak > 0) {
    count += 1;
  }

  if (longestStreak >= 7) {
    count += 1;
  }

  if (totalDays >= 10) {
    count += 1;
  }

  return count;
}

export function getFeaturedBadge(earnedBadges = []) {
  if (!earnedBadges.length) {
    return null;
  }

  const priority = [
    "original-founder",
    "founder-supporter",
    "early-access",
    "streak-30",
    "streak-14",
    "streak-7",
    "streak-3",
  ];

  return (
    priority
      .map((badgeId) =>
        earnedBadges.find((badge) => badge.id === badgeId),
      )
      .find(Boolean) || earnedBadges[0]
  );
}