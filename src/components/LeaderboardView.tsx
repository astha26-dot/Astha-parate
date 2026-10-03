import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Medal, 
  Users2, 
  Sparkles, 
  Share2, 
  ArrowUpRight, 
  BookOpen,
  Check,
  ShieldAlert
} from 'lucide-react';
import { LeaderboardUser, UserProfile, TrackId } from '../types/index.ts';
import { INITIAL_LEADERBOARD_USERS, TRACK_INFO } from '../data/defaultData.ts';

interface LeaderboardViewProps {
  profile: UserProfile;
  activeTrack: TrackId;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ profile }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'allTime'>('daily');
  const [copiedShare, setCopiedShare] = useState(false);

  // Merge current user with mock community users
  const currentUserEntry: LeaderboardUser = {
    id: 'current-user',
    name: profile.name + ' (You)',
    avatar: '🌟',
    track: profile.activeTrack,
    xp: profile.xp,
    streak: profile.streak,
    wordsMastered: profile.masteredWordIds.length || 14,
    isCurrentUser: true
  };

  const allUsers = [...INITIAL_LEADERBOARD_USERS, currentUserEntry].sort((a, b) => {
    return timeframe === 'daily' ? b.streak - a.streak : b.xp - a.xp;
  });

  const handleShareCard = () => {
    const text = `🏆 I'm on a ${profile.streak}-day English vocabulary & interview streak on VaniLingo (${profile.xp} XP)! Practicing Indian Knowledge Systems & eloquence daily. Join me!`;
    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Scholar Community & Leaderboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Learn alongside peers mastering vocabulary across Indian Knowledge Systems, Tech, and Business.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-stone-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeframe === 'daily'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Daily Consistency
            </button>
            <button
              onClick={() => setTimeframe('allTime')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                timeframe === 'allTime'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All-Time XP
            </button>
          </div>

          <button
            onClick={handleShareCard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm whitespace-nowrap"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Card</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {allUsers.slice(0, 3).map((user, idx) => {
          const rankColors = [
            'from-amber-500/20 to-amber-500/5 border-amber-300 dark:border-amber-700/60',
            'from-slate-400/20 to-slate-400/5 border-slate-300 dark:border-slate-700',
            'from-amber-700/20 to-amber-700/5 border-amber-700/40 dark:border-amber-800'
          ];
          const rankMedals = ['🥇 1st Place', '🥈 2nd Place', '🥉 3rd Place'];

          return (
            <div
              key={user.id}
              className={`rounded-2xl border bg-gradient-to-b ${rankColors[idx]} p-5 text-center space-y-3 relative overflow-hidden bg-white dark:bg-slate-900 shadow-sm`}
            >
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {rankMedals[idx]}
              </span>

              <div className="w-14 h-14 rounded-full bg-white dark:bg-slate-800 border-2 border-amber-400/60 flex items-center justify-center text-2xl mx-auto shadow-sm">
                {user.avatar}
              </div>

              <div>
                <h3 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                  {user.name}
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {TRACK_INFO[user.track]?.name.split('&')[0]}
                </span>
              </div>

              <div className="flex items-center justify-around border-t border-stone-200/60 dark:border-slate-800/80 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Streak</span>
                  <span className="font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {user.streak}d
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Total XP</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {user.xp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 dark:border-slate-800 font-semibold text-xs text-slate-500 uppercase tracking-wider flex justify-between">
          <span>Rank & Learner</span>
          <div className="flex gap-8 sm:gap-14">
            <span>Track</span>
            <span>Streak</span>
            <span>XP</span>
          </div>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-slate-800">
          {allUsers.map((user, idx) => {
            const isCurrentUser = user.isCurrentUser;

            return (
              <div
                key={user.id}
                className={`px-6 py-4 flex items-center justify-between transition-colors ${
                  isCurrentUser
                    ? 'bg-amber-50/60 dark:bg-amber-950/20 font-semibold'
                    : 'hover:bg-stone-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Left: Rank, Avatar, Name */}
                <div className="flex items-center gap-3">
                  <span className={`w-6 font-mono text-sm font-bold ${idx < 3 ? 'text-amber-500' : 'text-slate-400'}`}>
                    #{idx + 1}
                  </span>
                  <span className="text-xl">{user.avatar}</span>
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.name}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Track, Streak, XP */}
                <div className="flex items-center gap-6 sm:gap-12 text-xs">
                  <span className="text-slate-500 hidden sm:inline truncate max-w-[120px]">
                    {TRACK_INFO[user.track]?.name.split(' ')[0]}
                  </span>

                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    {user.streak}d
                  </span>

                  <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[50px] text-right">
                    {user.xp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
