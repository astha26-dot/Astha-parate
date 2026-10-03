export type TrackId = 
  | 'iks' 
  | 'tech' 
  | 'business' 
  | 'medicine' 
  | 'humanities' 
  | 'general';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface VocabularyWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  simpleDefinition: string;
  etymology: string; // Roots, Latin/Greek or Sanskrit cognate
  iksConnection?: string; // Concept link to Indian Knowledge Systems
  exampleSentence: string;
  interviewContextSentence: string;
  synonyms: string[];
  antonyms: string[];
  tracks: TrackId[];
  difficulty: DifficultyLevel;
  masteryStatus: 'learning' | 'reviewing' | 'mastered';
  timesPracticed: number;
  timesCorrect: number;
  lastPracticed?: string;
}

export interface QuizQuestion {
  id: string;
  word: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  phonetic: string;
  iksNote?: string;
  difficulty: DifficultyLevel;
  track: TrackId;
}

export interface InterviewQuestion {
  id: string;
  track: TrackId;
  category: 'behavioral' | 'technical' | 'situational' | 'leadership' | 'iks_philosophy';
  difficulty: DifficultyLevel;
  title: string;
  question: string;
  recommendedKeywords: string[];
  sampleStarFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  tips: string;
  culturalInsight?: string;
}

export interface EvaluatedAnswer {
  questionId: string;
  questionText: string;
  candidateAnswer: string;
  mode: 'speech' | 'typed' | 'handwriting';
  timestamp: string;
  evaluation: {
    vocabularyScore: number;
    fluencyScore: number;
    clarityScore: number;
    overallScore: number;
    fillerWordsDetected: string[];
    elevatedVocabSuggestions: Array<{
      originalWord: string;
      betterAlternative: string;
      explanation: string;
    }>;
    grammarAndPunctuationNotes: string;
    culturalOrConceptualInsight: string;
    exemplaryRewrite: string;
  };
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'vocabulary' | 'interview' | 'iks' | 'mastery';
  unlockedAt?: string;
  criteriaText: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  track: TrackId;
  xp: number;
  streak: number;
  wordsMastered: number;
  isCurrentUser?: boolean;
  rank?: number;
}

export interface UserProfile {
  syncCode: string;
  name: string;
  activeTrack: TrackId;
  difficulty: DifficultyLevel;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  historyDates: string[]; // List of YYYY-MM-DD dates practiced
  dailyGoalWords: number;
  todayWordsCount: number;
  totalQuizzesCompleted: number;
  totalInterviewsCompleted: number;
  unlockedBadgeIds: string[];
  weakWordIds: string[];
  masteredWordIds: string[];
  practiceHistory: EvaluatedAnswer[];
  savedNotes: Array<{
    id: string;
    word: string;
    note: string;
    drawingData?: string;
    createdAt: string;
  }>;
}
