import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Flame, 
  BookOpen,
  Mic,
  Brain,
  Layers,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, TrackId, DifficultyLevel, UserProfile } from '../types/index.ts';
import { INITIAL_QUIZ_QUESTIONS, TRACK_INFO } from '../data/defaultData.ts';
import { speakText, SpeechListener } from '../utils/audio.ts';

interface QuizViewProps {
  profile: UserProfile;
  activeTrack: TrackId;
  onUpdateXp: (xpToAdd: number) => void;
  onRecordQuizResult: (correctCount: number, total: number, weakWord?: string) => void;
  onSelectTrack: (track: TrackId) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  profile,
  activeTrack,
  onUpdateXp,
  onRecordQuizResult,
  onSelectTrack
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(INITIAL_QUIZ_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);
  const [activeDifficulty, setActiveDifficulty] = useState<DifficultyLevel>('intermediate');
  
  // Voice Pronunciation Practice feature inside Quiz
  const [isVoiceTesting, setIsVoiceTesting] = useState(false);
  const [voiceTestPassed, setVoiceTestPassed] = useState<boolean | null>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const isCorrect = selectedOption === currentQ.correctIndex;

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      speakText('Correct', 1.0);
    } else {
      speakText('Review this root', 1.0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setVoiceTestPassed(null);
    } else {
      // Finished Quiz
      setIsQuizFinished(true);
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 0 : 0);
      const earnedXp = finalScore * 25 + 20;
      onUpdateXp(earnedXp);
      onRecordQuizResult(finalScore, questions.length);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizFinished(false);
    setVoiceTestPassed(null);
  };

  const handleGenerateAiQuiz = async () => {
    setIsGeneratingAiQuiz(true);
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          backgroundTrack: TRACK_INFO[activeTrack].name,
          difficulty: activeDifficulty,
          topic: 'High-Yield Vocabulary and Dialectic Logic'
        })
      });
      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        handleRestartQuiz();
      }
    } catch (err) {
      console.warn('Failed to load AI quiz, keeping existing bank', err);
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handleVoicePronounceTest = () => {
    const listener = new SpeechListener();
    if (!listener.checkSupport()) {
      alert('Speech recognition not supported in this browser. You can listen using the audio speaker button.');
      return;
    }

    setIsVoiceTesting(true);
    setVoiceTestPassed(null);

    listener.start((transcript) => {
      listener.stop();
      setIsVoiceTesting(false);
      const cleanTarget = currentQ.word.toLowerCase();
      const cleanTranscript = transcript.toLowerCase();
      if (cleanTranscript.includes(cleanTarget)) {
        setVoiceTestPassed(true);
        speakText('Excellent pronunciation!', 1.0);
      } else {
        setVoiceTestPassed(false);
      }
    }, () => {
      setIsVoiceTesting(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Quiz Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-slate-900 dark:text-white">
              Daily Interactive Quiz
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
              {TRACK_INFO[activeTrack].name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Progressive difficulty & etymological grounding.
          </p>
        </div>

        {/* Level Controls & Dynamic AI Generation */}
        <div className="flex items-center gap-2">
          {/* Difficulty Segmented Buttons */}
          <div className="flex items-center bg-stone-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors font-medium ${
                  activeDifficulty === lvl
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateAiQuiz}
            disabled={isGeneratingAiQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isGeneratingAiQuiz ? 'Generating...' : 'AI Custom Quiz'}</span>
          </button>
        </div>
      </div>

      {!isQuizFinished ? (
        /* Active Quiz Card */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Progress & Target Word Header */}
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Current Score: {score}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakText(currentQ.word)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                title="Hear correct pronunciation"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Hear "{currentQ.word}"</span>
              </button>

              <button
                onClick={handleVoicePronounceTest}
                disabled={isVoiceTesting}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-medium border border-rose-200 dark:border-rose-800 transition-colors"
                title="Speak this word into the mic to test your accent & pronunciation"
              >
                <Mic className={`w-3.5 h-3.5 ${isVoiceTesting ? 'animate-pulse text-red-500' : 'text-rose-500'}`} />
                <span>{isVoiceTesting ? 'Listening...' : 'Pronounce with Mic'}</span>
              </button>
            </div>
          </div>

          {/* Voice Pronunciation Feedback Banner */}
          {voiceTestPassed !== null && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              voiceTestPassed 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
                : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
            }`}>
              {voiceTestPassed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Brilliant pronunciation! Your articulation of "{currentQ.word}" was clear and confident. (+10 bonus XP)</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Speech received. Try clicking "Hear" above and speaking once more at a measured pace.</span>
                </>
              )}
            </div>
          )}

          {/* The Question Text */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Contextual Fill-in Challenge
            </span>
            <p className="font-serif text-lg sm:text-xl font-medium text-slate-900 dark:text-white leading-relaxed">
              "{currentQ.question}"
            </p>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              let btnStyle = 'border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-950/40 hover:border-slate-400 text-slate-800 dark:text-slate-200';

              if (isAnswerSubmitted) {
                if (idx === currentQ.correctIndex) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                } else if (idx === selectedOption) {
                  btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                } else {
                  btnStyle = 'border-stone-200 dark:border-slate-800 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`flex items-center justify-between p-4 rounded-xl border text-left font-medium text-sm transition-all ${btnStyle}`}
                >
                  <span className="capitalize">{opt}</span>
                  {isAnswerSubmitted && idx === currentQ.correctIndex && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  )}
                  {isAnswerSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanatory Drawer on Submission */}
          {isAnswerSubmitted && (
            <div className={`p-5 rounded-xl border text-xs space-y-3 animate-in fade-in-50 duration-300 ${
              isCorrect
                ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}`}>
                  {isCorrect ? '✓ Spot-On Articulation!' : 'Reviewing Etymology & Context:'}
                </span>
                <span className="text-slate-500 font-mono text-[11px]">{currentQ.phonetic}</span>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>

              {currentQ.iksNote && (
                <div className="pt-2 border-t border-amber-200/50 dark:border-amber-800/40">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                    Indian Knowledge System (IKS) & Philosophical Root:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {currentQ.iksNote}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-semibold text-xs transition-colors shadow-sm"
                >
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You scored <span className="font-bold text-amber-600 dark:text-amber-400">{score}</span> out of {questions.length} questions.
              Your linguistic repository has grown with elevated vocabulary concepts.
            </p>
          </div>

          {/* Score metric boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto text-left">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Accuracy</span>
              <span className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {Math.round((score / questions.length) * 100)}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">XP Earned</span>
              <span className="font-serif text-xl font-bold text-indigo-600 dark:text-indigo-400">
                +{score * 25 + 20} XP
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block">Streak Status</span>
              <div className="flex items-center gap-1 font-serif text-xl font-bold text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500" />
                <span>Protected</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry This Quiz</span>
            </button>

            <button
              onClick={handleGenerateAiQuiz}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate New AI Challenge</span>
            </button>
          </div>
        </div>
      )}

      {/* Track Quick Selector */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
        <span>Looking to explore other fields?</span>
        <div className="flex gap-2 font-medium">
          <button onClick={() => onSelectTrack('iks')} className="hover:underline text-amber-600 dark:text-amber-400">IKS Logic</button>
          <span>·</span>
          <button onClick={() => onSelectTrack('tech')} className="hover:underline text-indigo-600 dark:text-indigo-400">Computer Science</button>
          <span>·</span>
          <button onClick={() => onSelectTrack('business')} className="hover:underline text-emerald-600 dark:text-emerald-400">Business</button>
        </div>
      </div>
    </div>
  );
};
