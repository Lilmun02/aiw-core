import { useNavigate } from "react-router-dom";

import AvatarCard from "./AvatarCard";
import ProfileStatsRow from "./ProfileStatsRow";

function formatJoinedDate(joinedAt) {
  if (!joinedAt) return null;

  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function ProfileHeader({
  avatarUrl,
  displayName,
  isFounder = false,
  joinedAt = null,
  isUploadingAvatar = false,
  isRemovingAvatar = false,
  onUploadAvatar,
  onRemoveAvatar,
  badgeCount = 0,
  currentStreak = 0,
  achievementCount = 0,
  onBadgesClick,
  onStreakClick,
  onAchievementsClick,
}) {
  const navigate = useNavigate();
  const joinedLabel = formatJoinedDate(joinedAt);

  return (
    <header className="relative overflow-hidden px-4 pb-5 pt-6 sm:px-7 sm:pb-7 sm:pt-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_50%_-10%,rgba(124,58,237,0.48),transparent_57%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(145deg,rgba(59,7,100,0.35),rgba(9,12,20,0)_70%)]" />

      <div className="relative">
        <AvatarCard
          avatarUrl={avatarUrl}
          displayName={displayName}
          isFounder={isFounder}
          isUploadingAvatar={isUploadingAvatar}
          isRemovingAvatar={isRemovingAvatar}
          onUploadAvatar={onUploadAvatar}
          onRemoveAvatar={onRemoveAvatar}
        />

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-violet-200">
            {isFounder ? "Founder" : "Member"}
          </span>

          {joinedLabel && (
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-bold text-slate-400">
              Joined {joinedLabel}
            </span>
          )}
        </div>

        {isFounder && (
          <button
            type="button"
            onClick={() => navigate("/founder/lilmun")}
            className="mx-auto mt-5 flex w-full max-w-md items-center justify-between rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] px-4 py-3 text-left transition hover:border-violet-300/40 hover:bg-violet-500/[0.12] active:scale-[0.99]"
          >
            <span>
              <span className="block text-sm font-black text-violet-100">
                Founder Control
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Open AIWCORE platform operations.
              </span>
            </span>
            <span className="text-lg text-violet-300">→</span>
          </button>
        )}

        <div className="mt-5">
          <ProfileStatsRow
            badgeCount={badgeCount}
            currentStreak={currentStreak}
            achievementCount={achievementCount}
            onBadgesClick={onBadgesClick}
            onStreakClick={onStreakClick}
            onAchievementsClick={onAchievementsClick}
          />
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
