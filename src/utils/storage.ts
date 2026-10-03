import { UserProfile, VocabularyWord, Badge } from '../types/index.ts';
import { INITIAL_VOCABULARY_WORDS, INITIAL_BADGES } from '../data/defaultData.ts';

const STORAGE_KEYS = {
  PROFILE: 'vanilingo_profile_v1',
  WORDS: 'vanilingo_words_v1',
  THEME: 'vanilingo_theme_v1',
  PENDING_SYNC: 'vanilingo_pending_sync'
};

export function getTodayString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function generateSyncCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const nums = '23456789';
  let code = 'VANI-';
  for (let i = 0; i < 2; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    code += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return code;
}

export function calculateLevel(xp: number): { level: number; title: string; nextLevelXp: number; progress: number } {
  if (xp < 250) {
    return { level: 1, title: 'Novice Scholar', nextLevelXp: 250, progress: (xp / 250) * 100 };
  } else if (xp < 600) {
    return { level: 2, title: 'Aspiring Articulator', nextLevelXp: 600, progress: ((xp - 250) / 350) * 100 };
  } else if (xp < 1200) {
    return { level: 3, title: 'Eloquence Practitioner', nextLevelXp: 1200, progress: ((xp - 600) / 600) * 100 };
  } else if (xp < 2200) {
    return { level: 4, title: 'Vāda Dialectic Master', nextLevelXp: 2200, progress: ((xp - 1200) / 1000) * 100 };
  } else {
    return { level: 5, title: 'Lexical Polymath', nextLevelXp: 3500, progress: Math.min(100, ((xp - 2200) / 1300) * 100) };
  }
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure syncCode exists
      if (!parsed.syncCode) {
        parsed.syncCode = generateSyncCode();
      }
      return updateStreakOnLoad(parsed);
    }
  } catch (err) {
    console.warn('Error reading stored profile:', err);
  }

  const today = getTodayString();
  const defaultProfile: UserProfile = {
    syncCode: generateSyncCode(),
    name: 'Diligent Learner',
    activeTrack: 'iks',
    difficulty: 'intermediate',
    xp: 120,
    level: 1,
    streak: 1,
    lastActiveDate: today,
    historyDates: [today],
    dailyGoalWords: 5,
    todayWordsCount: 2,
    totalQuizzesCompleted: 0,
    totalInterviewsCompleted: 0,
    unlockedBadgeIds: ['badge-first-word'],
    weakWordIds: [],
    masteredWordIds: [],
    practiceHistory: [],
    savedNotes: []
  };

  saveStoredProfile(defaultProfile);
  return defaultProfile;
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('Error saving profile to localStorage:', err);
  }
}

export function getStoredWords(): VocabularyWord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WORDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored words:', err);
  }

  saveStoredWords(INITIAL_VOCABULARY_WORDS);
  return INITIAL_VOCABULARY_WORDS;
}

export function saveStoredWords(words: VocabularyWord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (err) {
    console.warn('Error saving words to localStorage:', err);
  }
}

export function updateStreakOnLoad(profile: UserProfile): UserProfile {
  const today = getTodayString();
  if (profile.lastActiveDate === today) {
    return profile;
  }

  const lastDate = new Date(profile.lastActiveDate);
  const currentDate = new Date(today);
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Next day streak continues
    profile.streak += 1;
    profile.lastActiveDate = today;
    if (!profile.historyDates.includes(today)) {
      profile.historyDates.push(today);
    }
    profile.todayWordsCount = 0;
  } else if (diffDays > 1) {
    // Missed a day
    profile.streak = 1;
    profile.lastActiveDate = today;
    if (!profile.historyDates.includes(today)) {
      profile.historyDates.push(today);
    }
    profile.todayWordsCount = 0;
  }

  saveStoredProfile(profile);
  return profile;
}

export async function syncToCloud(profile: UserProfile, words: VocabularyWord[]): Promise<{ success: boolean; error?: string; timestamp?: string }> {
  try {
    const response = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncCode: profile.syncCode,
        data: {
          profile,
          words
        }
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Server rejected cloud backup');
    }

    const result = await response.json();
    return { success: true, timestamp: result.savedAt };
  } catch (error: any) {
    console.warn('Cloud sync error:', error);
    return { success: false, error: error.message || 'Offline or network unreachable' };
  }
}

export async function loadFromCloud(syncCode: string): Promise<{ success: boolean; data?: { profile: UserProfile; words: VocabularyWord[] }; error?: string }> {
  try {
    const response = await fetch(`/api/sync/load/${encodeURIComponent(syncCode.trim().toUpperCase())}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Sync code not found in cloud');
    }

    const json = await response.json();
    if (json.data && json.data.profile) {
      saveStoredProfile(json.data.profile);
      if (json.data.words) {
        saveStoredWords(json.data.words);
      }
      return { success: true, data: json.data };
    }
    throw new Error('Invalid cloud profile payload');
  } catch (error: any) {
    return { success: false, error: error.message || 'Could not restore cloud profile' };
  }
}
