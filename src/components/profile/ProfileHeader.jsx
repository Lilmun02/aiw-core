import { useNavigate } from "react-router-dom";

import AvatarCard from "./AvatarCard";
import ProfileStatsRow from "./ProfileStatsRow";

function ProfileHeader({
  avatarUrl,
  displayName,
  isFounder = false,
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

  return (
    <>
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-500 sm:h-56">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%)]" />

        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="absolute right-8 top-8 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/70">
            My AIWCORE
          </p>

          <p className="mt-2 max-w-xs text-sm text-white/80">
            Building the future of AI discovery.
          </p>
        </div>
      </div>

      <div className="relative px-6 pb-1 sm:px-10">
        <div className="-mt-16">
          <AvatarCard
            avatarUrl={avatarUrl}
            displayName={displayName}
            isFounder={isFounder}
            isUploadingAvatar={isUploadingAvatar}
            isRemovingAvatar={isRemovingAvatar}
            onUploadAvatar={onUploadAvatar}
            onRemoveAvatar={onRemoveAvatar}
          />
        </div>

        {isFounder && (
          <button
            type="button"
            onClick={() => navigate("/founder/lilmun")}
            className="mt-6 flex w-full items-center justify-between rounded-2xl border border-amber-400/35 bg-amber-400/10 px-5 py-4 text-left transition hover:border-amber-300 hover:bg-amber-400/15 active:scale-[0.99]"
          >
            <span>
              <span className="block text-sm font-black text-amber-200">
                👑 Founder Control
              </span>
              <span className="mt-1 block text-sm text-slate-400">
                Manage AIWCORE from your phone.
              </span>
            </span>

            <span className="text-xl text-amber-200">→</span>
          </button>
        )}

        <div className="mt-7">
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
    </>
  );
}

export default ProfileHeader;