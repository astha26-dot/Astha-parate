import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Sun, 
  Moon, 
  Cloud, 
  Wifi, 
  WifiOff, 
  Award, 
  BookOpen, 
  Mic2, 
  BarChart3, 
  Users2, 
  CheckCircle2
} from 'lucide-react';
import { UserProfile, TrackId } from '../types/index.ts';
import { calculateLevel } from '../utils/storage.ts';
import { TRACK_INFO } from '../data/defaultData.ts';

interface NavbarProps {
  profile: UserProfile;
  activeTab: 'dashboard' | 'quiz' | 'interview' | 'words' | 'leaderboard';
  setActiveTab: (tab: 'dashboard' | 'quiz' | 'interview' | 'words' | 'leaderboard') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSyncModal: () => void;
  onOpenBadgesModal: () => void;
  isOnline: boolean;
  onSelectTrack: (track: TrackId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenSyncModal,
  onOpenBadgesModal,
  isOnline,
  onSelectTrack
}) => {
  const levelData = calculateLevel(profile.xp);
  const currentTrack = TRACK_INFO[profile.activeTrack];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Track Selector */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-serif font-black text-lg tracking-tight">वा</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    VaniLingo
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10 px-1.5 py-0.5 rounded">
                    IKS & Eloquence
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] sm:max-w-[220px]">
                  {currentTrack.name}
                </div>
              </div>
            </button>

            {/* Quick Track Switcher Dropdown */}
            <div className="hidden lg:block relative group">
              <select
                value={profile.activeTrack}
                onChange={(e) => onSelectTrack(e.target.value as TrackId)}
                aria-label="Select study focus track"
                className="text-xs bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-none rounded-lg px-2.5 py-1.5 cursor-pointer font-medium focus:ring-2 focus:ring-amber-500"
              >
                <option value="iks">📜 Indian Knowledge & Logic (Nyaya/Vāda)</option>
                <option value="tech">💻 Computer Science & AI</option>
                <option value="business">💼 Business, Strategy & Leadership</option>
                <option value="medicine">🩺 Healthcare & Life Sciences</option>
                <option value="humanities">⚖️ Law, Humanities & UPSC</option>
                <option value="general">✨ Everyday Fluency</option>
              </select>
            </div>
          </div>

          {/* Gamification Stats: Streak, Level, XP */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/40 text-amber-700 dark:text-amber-300 text-xs font-semibold"
              title={`${profile.streak} Day Active Streak! Practice daily to protect your flame.`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile.streak} {profile.streak === 1 ? 'day' : 'days'}</span>
            </div>

            {/* XP & Level */}
            <div 
              onClick={onOpenBadgesModal}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-800/80 border border-stone-200/70 dark:border-slate-700 text-xs cursor-pointer hover:border-indigo-400 transition-colors"
              title={`Level ${levelData.level}: ${levelData.title} (${profile.xp} XP). Click to view badges.`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Lvl {levelData.level}</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">{profile.xp} XP</span>
              </div>
            </div>

            {/* Badges Button */}
            <button
              onClick={onOpenBadgesModal}
              aria-label="View unlocked badges"
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors relative"
              title="View Badges & Rewards"
            >
              <Award className="w-4 h-4" />
              {profile.unlockedBadgeIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Cloud Sync Status Button */}
            <button
              onClick={onOpenSyncModal}
              aria-label="Cloud sync settings"
              className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-sky-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              title="Cloud Synchronization & Device Linking"
            >
              <Cloud className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden md:inline font-mono text-[11px]">{profile.syncCode}</span>
            </button>

            {/* Offline/Online Indicator */}
            <div 
              className="flex items-center" 
              title={isOnline ? 'Online with Cloud AI enabled' : 'Offline mode active (Local storage & offline quiz ready)'}
            >
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to light theme' : 'Switch to nighttime dark theme'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 mt-2 pt-2 border-t border-stone-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar text-xs font-medium">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Interactive Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'interview'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Mic2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Interview Coach & Mic</span>
          </button>

          <button
            onClick={() => setActiveTab('words')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'words'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Vocabulary Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Users2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Community & Ranks</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
