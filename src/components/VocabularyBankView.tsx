import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Volume2, 
  BookOpen, 
  Check, 
  Clock, 
  Sparkles, 
  BookmarkCheck, 
  Share2,
  ChevronDown
} from 'lucide-react';
import { VocabularyWord, TrackId, DifficultyLevel } from '../types/index.ts';
import { TRACK_INFO } from '../data/defaultData.ts';
import { speakText } from '../utils/audio.ts';

interface VocabularyBankViewProps {
  words: VocabularyWord[];
  activeTrack: TrackId;
  onMasterWord: (wordId: string) => void;
  onSelectTrack: (track: TrackId) => void;
}

export const VocabularyBankView: React.FC<VocabularyBankViewProps> = ({
  words,
  activeTrack,
  onMasterWord,
  onSelectTrack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<TrackId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [expandedWordId, setExpandedWordId] = useState<string | null>(null);

  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.etymology.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedTrackFilter === 'all' || w.tracks.includes(selectedTrackFilter);
    const matchesDifficulty = selectedDifficulty === 'all' || w.difficulty === selectedDifficulty;
    return matchesSearch && matchesTrack && matchesDifficulty;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header and Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Linguistic Treasury & Vocabulary Bank
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive vocabulary with phonetic guides, etymological roots, and Indian Knowledge System parallels.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>{filteredWords.length} words found</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-slate-800">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, roots, or definitions..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Track Filter */}
          <select
            value={selectedTrackFilter}
            onChange={(e) => setSelectedTrackFilter(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Disciplines</option>
            <option value="iks">📜 Indian Knowledge & Logic</option>
            <option value="tech">💻 Tech & Computer Science</option>
            <option value="business">💼 Business & Strategy</option>
            <option value="medicine">🩺 Healthcare & Medicine</option>
            <option value="humanities">⚖️ Law & Humanities</option>
            <option value="general">✨ Everyday Fluency</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWords.map((word) => {
          const isExpanded = expandedWordId === word.id;
          const isMastered = word.masteryStatus === 'mastered';

          return (
            <div
              key={word.id}
              className={`rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900 p-5 space-y-3.5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 ${
                isMastered ? 'border-emerald-200/80 dark:border-emerald-900/40' : 'border-stone-200 dark:border-slate-800'
              }`}
            >
              {/* Word Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                      {word.word}
                    </h3>
                    <button
                      onClick={() => speakText(word.word)}
                      className="p-1 rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isMastered && (
                      <span className="flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <Check className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-[11px]">{word.phonetic}</span>
                    <span>·</span>
                    <span className="italic">{word.partOfSpeech}</span>
                    <span>·</span>
                    <span className="capitalize">{word.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={() => onMasterWord(word.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isMastered
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-50 dark:bg-slate-800 text-slate-400 border-stone-200 dark:border-slate-700 hover:text-emerald-600'
                  }`}
                  title={isMastered ? 'Mastered word' : 'Mark as mastered'}
                >
                  <BookmarkCheck className="w-4 h-4" />
                </button>
              </div>

              {/* Definition */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {word.definition}
              </p>

              {/* Interview Context Sentence */}
              <div className="p-3 rounded-xl bg-stone-50/80 dark:bg-slate-950/50 border border-stone-100 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                  Interview Articulation Example:
                </span>
                <p className="italic text-slate-800 dark:text-slate-200">
                  "{word.interviewContextSentence}"
                </p>
              </div>

              {/* Collapsible Deep Etymology & IKS section */}
              {isExpanded && (
                <div className="pt-2 border-t border-stone-100 dark:border-slate-800 space-y-2.5 text-xs animate-in fade-in-50 duration-200">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                      Roots & Etymology:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{word.etymology}</p>
                  </div>

                  {word.iksConnection && (
                    <div className="bg-amber-50/60 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/40">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-[10px] uppercase">
                        Indian Knowledge Systems Context:
                      </span>
                      <p className="text-amber-950 dark:text-amber-200 mt-0.5 leading-relaxed">
                        {word.iksConnection}
                      </p>
                    </div>
                  )}

                  {/* Synonyms & Antonyms */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                    <span className="font-semibold text-slate-400">Synonyms:</span>
                    {word.synonyms.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Expand Toggle */}
              <button
                onClick={() => setExpandedWordId(isExpanded ? null : word.id)}
                className="w-full text-center text-xs text-indigo-600 dark:text-indigo-400 hover:underline pt-1 flex items-center justify-center gap-1 font-medium"
              >
                <span>{isExpanded ? 'Show less' : 'View etymology & IKS concept'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
