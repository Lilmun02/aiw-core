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
      <div className="relative min-h-52 overflow-hidden bg-[linear-gradient(135deg,#0b1730_0%,#12285b_52%,#0d5b78_100%)] sm:min-h-60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.32),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(34,211,238,0.2),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0d1526] to-transparent" />

        <div className="relative flex items-start justify-between gap-6 px-6 pt-7 sm:px-10 sm:pt-9">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
              My AIWCORE
            </div>

            <p className="mt-4 max-w-md text-sm font-medium leading-6 text-blue-100/75 sm:text-base">
              Your AI discovery identity — progress, saved tools, achievements, and contributions in one place.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 text-right backdrop-blur sm:block">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">
              Profile Status
            </p>
            <p className="mt-1 text-sm font-bold text-white">Active Explorer</p>
          </div>
        </div>
      </div>

      <div className="relative px-6 pb-2 sm:px-10">
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
            className="mt-6 flex w-full items-center justify-between rounded-2xl border border-blue-400/25 bg-blue-500/10 px-5 py-4 text-left transition hover:border-blue-300/60 hover:bg-blue-500/15 active:scale-[0.99]"
          >
            <span>
              <span className="block text-sm font-black text-blue-100">
                Founder Control
              </span>
              <span className="mt-1 block text-sm text-slate-400">
                Open platform operations and manage AIWCORE.
              </span>
            </span>

            <span className="text-xl text-blue-200">→</span>
          </button>
        )}

        <div className="mt-7 rounded-2xl border border-slate-800/90 bg-slate-950/45 p-2 shadow-inner">
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