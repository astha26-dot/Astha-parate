import React, { useState } from 'react';
import { 
  Flame, 
  Target, 
  ArrowRight, 
  Volume2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Mic, 
  BrainCircuit, 
  TrendingUp,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UserProfile, VocabularyWord, TrackId } from '../types/index.ts';
import { TRACK_INFO, UNLOCKABLE_MODULES } from '../data/defaultData.ts';
import { speakText } from '../utils/audio.ts';
import { calculateLevel } from '../utils/storage.ts';

interface DashboardViewProps {
  profile: UserProfile;
  words: VocabularyWord[];
  onStartQuiz: () => void;
  onStartInterview: () => void;
  onSelectTrack: (track: TrackId) => void;
  onMasterWord: (wordId: string) => void;
  onOpenBadgesModal: () => void;
  onOpenSyncModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  words,
  onStartQuiz,
  onStartInterview,
  onSelectTrack,
  onMasterWord,
  onOpenBadgesModal,
  onOpenSyncModal
}) => {
  const currentTrack = TRACK_INFO[profile.activeTrack];
  const levelData = calculateLevel(profile.xp);

  // Filter words by status
  const masteredWords = words.filter((w) => w.masteryStatus === 'mastered');
  const learningWords = words.filter((w) => w.masteryStatus === 'learning');
  const weakWords = words.filter((w) => profile.weakWordIds.includes(w.id) || (w.timesPracticed > 0 && w.timesCorrect / w.timesPracticed < 0.6));

  // Quick Flashcard Review State for Weak Area
  const [activeWeakIndex, setActiveWeakIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const currentWeakWord = weakWords.length > 0 ? weakWords[activeWeakIndex % weakWords.length] : words[0];

  // Days of week for streak visualization
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDay = new Date().getDay(); // 0 is Sunday
  const todayIndex = todayDay === 0 ? 6 : todayDay - 1;

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Motivational IKS Grounding */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Eloquence & Interview Journey</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {profile.name}!
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              "विद्या ददाति विनयं विनयाद्याति पात्रताम्" — True knowledge bestows humility, and humility brings articulate capability. Keep your {profile.streak}-day streak burning bright today.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={onStartQuiz}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
              >
                <span>Take Daily Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onStartInterview}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-colors backdrop-blur-sm"
              >
                <Mic className="w-3.5 h-3.5 text-rose-400" />
                <span>Mock Interview Practice</span>
              </button>
            </div>
          </div>

          {/* Quick Track Switch Card */}
          <div className="bg-white/10 dark:bg-white/5 border border-white/15 p-4 rounded-xl backdrop-blur-md min-w-[240px]">
            <span className="text-xs text-slate-400 block mb-1">Current Focus Track</span>
            <div className="font-semibold text-sm text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              {currentTrack.name}
            </div>
            <p className="text-xs text-slate-300 line-clamp-2 mb-3">
              {currentTrack.description}
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => onSelectTrack('iks')}
                className={`p-1.5 rounded text-left transition-colors ${profile.activeTrack === 'iks' ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-400/30' : 'bg-black/20 text-slate-300 hover:bg-black/40'}`}
              >
                📜 IKS & Logic
              </button>
              <button
                onClick={() => onSelectTrack('tech')}
                className={`p-1.5 rounded text-left transition-colors ${profile.activeTrack === 'tech' ? 'bg-indigo-500/30 text-indigo-200 font-bold border border-indigo-400/30' : 'bg-black/20 text-slate-300 hover:bg-black/40'}`}
              >
                💻 Tech & AI
              </button>
              <button
                onClick={() => onSelectTrack('business')}
                className={`p-1.5 rounded text-left transition-colors ${profile.activeTrack === 'business' ? 'bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-400/30' : 'bg-black/20 text-slate-300 hover:bg-black/40'}`}
              >
                💼 Business
              </button>
              <button
                onClick={() => onSelectTrack('humanities')}
                className={`p-1.5 rounded text-left transition-colors ${profile.activeTrack === 'humanities' ? 'bg-purple-500/30 text-purple-200 font-bold border border-purple-400/30' : 'bg-black/20 text-slate-300 hover:bg-black/40'}`}
              >
                ⚖️ Law & UPSC
              </button>
            </div>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Gamification & Metric Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Flame Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {profile.streak}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Active Flame
            </span>
          </div>
          {/* Weekly Dots */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 dark:border-slate-800 text-[10px]">
            {daysOfWeek.map((day, idx) => {
              const isPast = idx <= todayIndex;
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-slate-400">{day}</span>
                  <div 
                    className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      idx === todayIndex 
                        ? 'bg-amber-500 ring-2 ring-amber-300 dark:ring-amber-800' 
                        : isPast 
                          ? 'bg-emerald-500' 
                          : 'bg-stone-200 dark:bg-slate-800'
                    }`}
                  >
                    {isPast && <Check className="w-2 h-2 text-white stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mastered Vocabulary Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Vocabulary Bank</span>
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {masteredWords.length}
            </span>
            <span className="text-xs text-slate-400">
              / {words.length} mastered
            </span>
          </div>
          <div className="mt-3 w-full bg-stone-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(8, (masteredWords.length / words.length) * 100)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{learningWords.length} in learning</span>
            <span>{weakWords.length} needing review</span>
          </div>
        </div>

        {/* Mock Interviews Completed Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interview Drills</span>
            <Mic className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              {profile.practiceHistory.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Evaluations
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 border-t border-stone-100 dark:border-slate-800 pt-2">
            {profile.practiceHistory.length > 0
              ? `Avg Fluency: ${Math.round(profile.practiceHistory.reduce((acc, c) => acc + c.evaluation.fluencyScore, 0) / profile.practiceHistory.length)}%`
              : 'Mic & Writing Pad ready'}
          </p>
        </div>

        {/* Level & Rank Card */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Scholar Rank</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Lvl {levelData.level}
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 truncate">
              {levelData.title}
            </span>
          </div>
          <div className="mt-3 w-full bg-stone-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelData.progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{profile.xp} XP</span>
            <span>Next: {levelData.nextLevelXp} XP</span>
          </div>
        </div>
      </section>

      {/* Main Two-Column Layout: Focus Center & Educational Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Areas Needing Improvement & Performance Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Areas Needing Improvement / Focus Center */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h2 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                  Focus Center: Areas Needing Improvement
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Spaced Repetition Flashcard
              </span>
            </div>

            {currentWeakWord ? (
              <div className="bg-stone-50 dark:bg-slate-950/60 rounded-xl p-5 border border-stone-200 dark:border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                        {currentWeakWord.word}
                      </h3>
                      <button
                        onClick={() => speakText(currentWeakWord.word)}
                        className="p-1 rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{currentWeakWord.phonetic}</span>
                      <span>·</span>
                      <span className="italic">{currentWeakWord.partOfSpeech}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onMasterWord(currentWeakWord.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Mastered</span>
                  </button>
                </div>

                {/* Flip Card Action */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-lg border border-stone-200 dark:border-slate-800 hover:border-amber-400/50 transition-colors"
                >
                  {!isFlipped ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {currentWeakWord.definition}
                      </p>
                      <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        Tap to reveal Etymology & Indian Knowledge System insight →
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-400">Etymology & Roots:</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{currentWeakWord.etymology}</p>
                      </div>
                      {currentWeakWord.iksConnection && (
                        <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded border border-amber-200/40">
                          <span className="text-[11px] uppercase font-bold text-amber-700 dark:text-amber-400">
                            Indian Knowledge Systems (IKS) Insight:
                          </span>
                          <p className="text-xs text-amber-900 dark:text-amber-200 mt-0.5">
                            {currentWeakWord.iksConnection}
                          </p>
                        </div>
                      )}
                      <div>
                        <span className="text-[11px] uppercase font-bold text-slate-400">Interview Context:</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                          "{currentWeakWord.interviewContextSentence}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Word / Navigation */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">
                    Weak words queue: {activeWeakIndex + 1} of {Math.max(1, weakWords.length)}
                  </span>
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setActiveWeakIndex((prev) => prev + 1);
                    }}
                    className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    <span>Next Review Word</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                No weak words pending! All tested words are currently solid.
              </div>
            )}
          </div>

          {/* Performance Radar / Skill Breakdown */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <h2 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                  Linguistic Performance Over Time
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Evaluation Metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Skill 1: Vocabulary Variety */}
              <div className="space-y-1.5 p-3 rounded-lg bg-stone-50 dark:bg-slate-950/40 border border-stone-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Vocabulary Precision</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">88%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Replaces generic verbs with elevated academic terms.</span>
              </div>

              {/* Skill 2: Dialectic & Argumentation */}
              <div className="space-y-1.5 p-3 rounded-lg bg-stone-50 dark:bg-slate-950/40 border border-stone-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Argument Structure (Hetu/STAR)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">82%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Clear thesis, reasoned evidence, and impactful conclusion.</span>
              </div>

              {/* Skill 3: Fluency & Cadence */}
              <div className="space-y-1.5 p-3 rounded-lg bg-stone-50 dark:bg-slate-950/40 border border-stone-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Spoken Fluency (Filler Reduction)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">76%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '76%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Minimizing "um", "like", and hesitations with the mic.</span>
              </div>

              {/* Skill 4: Conceptual Depth */}
              <div className="space-y-1.5 p-3 rounded-lg bg-stone-50 dark:bg-slate-950/40 border border-stone-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Domain Grounding (IKS/Tech)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">92%</span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                </div>
                <span className="text-[11px] text-slate-500">Deep resonance with study background and ethics.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Long-Term Educational Goals & Unlockables */}
        <div className="space-y-6">
          
          {/* Long-Term Educational Goals */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <h2 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                Educational Goals
              </h2>
            </div>

            <div className="space-y-3">
              {/* Goal 1 */}
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-950/50 border border-stone-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Master 20 Domain Words
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {masteredWords.length} / 20
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (masteredWords.length / 20) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Goal 2 */}
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-950/50 border border-stone-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    10 Spoken Mock Responses
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {profile.practiceHistory.length} / 10
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (profile.practiceHistory.length / 10) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Goal 3 */}
              <div className="p-3 rounded-lg bg-stone-50 dark:bg-slate-950/50 border border-stone-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    7-Day Consistency Streak
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {profile.streak} / 7 days
                  </span>
                </div>
                <div className="w-full bg-stone-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (profile.streak / 7) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Unlockable Content & Modules */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-500" />
                <h2 className="font-serif font-bold text-slate-900 dark:text-white text-base">
                  Unlockable Masterclasses
                </h2>
              </div>
              <button
                onClick={onOpenBadgesModal}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View Badges
              </button>
            </div>

            <div className="space-y-3">
              {UNLOCKABLE_MODULES.map((mod) => {
                const isUnlocked = levelData.level >= mod.requiredLevel;
                return (
                  <div 
                    key={mod.id}
                    className={`p-3 rounded-lg border text-xs space-y-1.5 transition-colors ${
                      isUnlocked 
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/40 text-slate-800 dark:text-slate-200' 
                        : 'bg-stone-50 dark:bg-slate-950/40 border-stone-200 dark:border-slate-800 text-slate-400 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {mod.title}
                      </span>
                      {isUnlocked ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-stone-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold">
                          Lvl {mod.requiredLevel} req
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {mod.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cloud Sync Quick Status */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/30 dark:to-indigo-950/30 border border-sky-200/60 dark:border-sky-800/40 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-sky-950 dark:text-sky-200 block">
                Cloud Sync Code: <span className="font-mono">{profile.syncCode}</span>
              </span>
              <span className="text-[11px] text-sky-700 dark:text-sky-400">
                Study on your phone or laptop with zero streak loss.
              </span>
            </div>
            <button
              onClick={onOpenSyncModal}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-colors whitespace-nowrap"
            >
              Sync Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
