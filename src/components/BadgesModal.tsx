import React from 'react';
import { X, Award, CheckCircle2, Lock, Flame, Sparkles, Trophy } from 'lucide-react';
import { Badge, UserProfile } from '../types/index.ts';
import { INITIAL_BADGES } from '../data/defaultData.ts';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
              Scholar Badges & Milestone Rewards
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-stone-100 dark:border-slate-800 pb-3">
            <span>
              {profile.unlockedBadgeIds.length} of {INITIAL_BADGES.length} Badges Unlocked
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              Total XP: {profile.xp}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {INITIAL_BADGES.map((badge) => {
              const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                    isUnlocked
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                      : 'bg-stone-50/60 dark:bg-slate-950/40 border-stone-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-stone-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-slate-900 dark:text-white text-sm">
                        {badge.title}
                      </span>
                      {isUnlocked && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 ml-1" />
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {badge.description}
                    </p>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block pt-0.5">
                      Requirement: {badge.criteriaText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 dark:bg-slate-950/60 border-t border-stone-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold text-xs transition-colors"
          >
            Close Treasury
          </button>
        </div>
      </div>
    </div>
  );
};
