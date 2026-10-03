import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { QuizView } from './components/QuizView.tsx';
import { InterviewView } from './components/InterviewView.tsx';
import { VocabularyBankView } from './components/VocabularyBankView.tsx';
import { LeaderboardView } from './components/LeaderboardView.tsx';
import { BadgesModal } from './components/BadgesModal.tsx';
import { CloudSyncModal } from './components/CloudSyncModal.tsx';
import { 
  UserProfile, 
  VocabularyWord, 
  TrackId, 
  EvaluatedAnswer 
} from './types/index.ts';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredWords, 
  saveStoredWords,
  syncToCloud
} from './utils/storage.ts';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [words, setWords] = useState<VocabularyWord[]>(getStoredWords);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'interview' | 'words' | 'leaderboard'>('dashboard');
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vanilingo_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Online / Offline State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Modals
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Sync theme to root DOM
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('vanilingo_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Online/Offline detection & Auto-sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync when coming back online
      syncToCloud(profile, words).catch((e) => console.warn('Auto-sync notice:', e));
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker for offline capabilities if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Service worker registration failed:', err);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [profile, words]);

  // Check and unlock badges
  const checkBadgeUnlocks = (updatedProfile: UserProfile, updatedWords: VocabularyWord[]) => {
    const unlocked = new Set(updatedProfile.unlockedBadgeIds);
    let newlyUnlocked = false;

    // First Word
    const masteredCount = updatedWords.filter((w) => w.masteryStatus === 'mastered').length;
    if (masteredCount >= 1 && !unlocked.has('badge-first-word')) {
      unlocked.add('badge-first-word');
      newlyUnlocked = true;
    }

    // 3-Day streak
    if (updatedProfile.streak >= 3 && !unlocked.has('badge-3-streak')) {
      unlocked.add('badge-3-streak');
      newlyUnlocked = true;
    }

    // 7-Day streak
    if (updatedProfile.streak >= 7 && !unlocked.has('badge-7-streak')) {
      unlocked.add('badge-7-streak');
      newlyUnlocked = true;
    }

    // IKS Scholar
    const iksMastered = updatedWords.filter((w) => w.tracks.includes('iks') && w.masteryStatus === 'mastered').length;
    if (iksMastered >= 3 && !unlocked.has('badge-iks-scholar')) {
      unlocked.add('badge-iks-scholar');
      newlyUnlocked = true;
    }

    // Voice Interview
    const hasVoiceDrill = updatedProfile.practiceHistory.some((h) => h.mode === 'speech');
    if (hasVoiceDrill && !unlocked.has('badge-interview-voice')) {
      unlocked.add('badge-interview-voice');
      newlyUnlocked = true;
    }

    // Ink Master (Handwriting pad used)
    const hasInkDrill = updatedProfile.practiceHistory.some((h) => h.mode === 'handwriting');
    if (hasInkDrill && !unlocked.has('badge-ink-master')) {
      unlocked.add('badge-ink-master');
      newlyUnlocked = true;
    }

    // Elevate Speaker (85+ score)
    const hasHighScore = updatedProfile.practiceHistory.some((h) => h.evaluation.overallScore >= 85);
    if (hasHighScore && !unlocked.has('badge-elevated-speaker')) {
      unlocked.add('badge-elevated-speaker');
      newlyUnlocked = true;
    }

    if (newlyUnlocked) {
      updatedProfile.unlockedBadgeIds = Array.from(unlocked);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch (e) {
        console.warn('Confetti trigger error', e);
      }
    }

    saveStoredProfile(updatedProfile);
    setProfile({ ...updatedProfile });
  };

  const handleUpdateXp = (xpToAdd: number) => {
    setProfile((prev) => {
      const nextProfile = {
        ...prev,
        xp: prev.xp + xpToAdd
      };
      saveStoredProfile(nextProfile);
      return nextProfile;
    });
  };

  const handleRecordQuizResult = (correctCount: number, total: number, weakWord?: string) => {
    setProfile((prev) => {
      const weakList = [...prev.weakWordIds];
      if (weakWord && !weakList.includes(weakWord)) {
        weakList.push(weakWord);
      }
      const nextProfile: UserProfile = {
        ...prev,
        totalQuizzesCompleted: prev.totalQuizzesCompleted + 1,
        weakWordIds: weakList
      };

      if (correctCount === total && total >= 3) {
        if (!nextProfile.unlockedBadgeIds.includes('badge-quiz-ace')) {
          nextProfile.unlockedBadgeIds.push('badge-quiz-ace');
        }
      }

      saveStoredProfile(nextProfile);
      checkBadgeUnlocks(nextProfile, words);
      return nextProfile;
    });
  };

  const handleRecordEvaluation = (evaluatedRecord: EvaluatedAnswer) => {
    setProfile((prev) => {
      const nextProfile: UserProfile = {
        ...prev,
        totalInterviewsCompleted: prev.totalInterviewsCompleted + 1,
        practiceHistory: [evaluatedRecord, ...prev.practiceHistory]
      };
      saveStoredProfile(nextProfile);
      checkBadgeUnlocks(nextProfile, words);
      return nextProfile;
    });
  };

  const handleMasterWord = (wordId: string) => {
    const nextWords = words.map((w) => {
      if (w.id === wordId) {
        return {
          ...w,
          masteryStatus: (w.masteryStatus === 'mastered' ? 'learning' : 'mastered') as any
        };
      }
      return w;
    });
    setWords(nextWords);
    saveStoredWords(nextWords);

    setProfile((prev) => {
      const nextMastered = nextWords.filter((w) => w.masteryStatus === 'mastered').map((w) => w.id);
      const nextProfile = {
        ...prev,
        masteredWordIds: nextMastered,
        weakWordIds: prev.weakWordIds.filter((id) => id !== wordId),
        xp: prev.xp + 15
      };
      saveStoredProfile(nextProfile);
      checkBadgeUnlocks(nextProfile, nextWords);
      return nextProfile;
    });
  };

  const handleSelectTrack = (track: TrackId) => {
    setProfile((prev) => {
      const nextProfile = {
        ...prev,
        activeTrack: track
      };
      saveStoredProfile(nextProfile);
      return nextProfile;
    });
  };

  const handleCloudRestored = (newProfile: UserProfile, newWords: VocabularyWord[]) => {
    setProfile(newProfile);
    setWords(newWords);
    saveStoredProfile(newProfile);
    saveStoredWords(newWords);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* Sticky Header with Navigation and Gamification Badges */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        isOnline={isOnline}
        onSelectTrack={handleSelectTrack}
      />

      {/* Main Workspace View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            words={words}
            onStartQuiz={() => setActiveTab('quiz')}
            onStartInterview={() => setActiveTab('interview')}
            onSelectTrack={handleSelectTrack}
            onMasterWord={handleMasterWord}
            onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            profile={profile}
            activeTrack={profile.activeTrack}
            onUpdateXp={handleUpdateXp}
            onRecordQuizResult={handleRecordQuizResult}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewView
            profile={profile}
            activeTrack={profile.activeTrack}
            onRecordEvaluation={handleRecordEvaluation}
            onUpdateXp={handleUpdateXp}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {activeTab === 'words' && (
          <VocabularyBankView
            words={words}
            activeTrack={profile.activeTrack}
            onMasterWord={handleMasterWord}
            onSelectTrack={handleSelectTrack}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            profile={profile}
            activeTrack={profile.activeTrack}
          />
        )}
      </main>

      {/* Badges Treasury Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        profile={profile}
      />

      {/* Cloud Synchronization Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        profile={profile}
        words={words}
        onCloudRestored={handleCloudRestored}
      />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-stone-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-800 dark:text-slate-200">VaniLingo</span>
            <span>·</span>
            <span>Indian Knowledge Systems & Professional English Eloquence</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Offline-Ready PWA</span>
            <span>·</span>
            <span>Cloud Synced: <span className="font-mono">{profile.syncCode}</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
