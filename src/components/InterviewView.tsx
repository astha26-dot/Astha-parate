import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Keyboard, 
  PenTool, 
  Sparkles, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Volume2, 
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { InterviewQuestion, EvaluatedAnswer, TrackId, UserProfile, DifficultyLevel } from '../types/index.ts';
import { INITIAL_INTERVIEW_QUESTIONS, TRACK_INFO } from '../data/defaultData.ts';
import { CanvasPad } from './CanvasPad.tsx';
import { SpeechListener, speakText } from '../utils/audio.ts';

interface InterviewViewProps {
  profile: UserProfile;
  activeTrack: TrackId;
  onRecordEvaluation: (result: EvaluatedAnswer) => void;
  onUpdateXp: (xpToAdd: number) => void;
  onSelectTrack: (track: TrackId) => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({
  profile,
  activeTrack,
  onRecordEvaluation,
  onUpdateXp,
  onSelectTrack
}) => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(INITIAL_INTERVIEW_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputMode, setInputMode] = useState<'mic' | 'typed' | 'canvas'>('mic');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speechListener, setSpeechListener] = useState<SpeechListener | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluatedAnswer['evaluation'] | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  const [audioPulse, setAudioPulse] = useState(false);

  // Filter questions for active track or show all if track has few
  const trackFilteredQuestions = questions.filter(
    (q) => q.track === activeTrack || q.track === 'general'
  );
  const activeQuestionList = trackFilteredQuestions.length > 0 ? trackFilteredQuestions : questions;
  const currentQ = activeQuestionList[currentIdx % activeQuestionList.length] || questions[0];

  useEffect(() => {
    const listener = new SpeechListener();
    setSpeechListener(listener);
  }, []);

  const toggleRecording = () => {
    if (!speechListener) return;

    if (isRecording) {
      speechListener.stop();
      setIsRecording(false);
      setAudioPulse(false);
    } else {
      if (!speechListener.checkSupport()) {
        alert('Web Speech recognition is not supported in this browser. Please use the Typing Pad or Handwriting Pad.');
        setInputMode('typed');
        return;
      }
      setIsRecording(true);
      setAudioPulse(true);

      speechListener.start(
        (transcript) => {
          setSpeechTranscript(transcript);
          setTypedAnswer(transcript);
        },
        (err) => {
          console.warn('Speech error:', err);
          setIsRecording(false);
          setAudioPulse(false);
        }
      );
    }
  };

  const handleEvaluate = async () => {
    const answerToEval = (inputMode === 'mic' ? speechTranscript : typedAnswer).trim();
    if (!answerToEval) {
      alert('Please provide an answer using speech, typing, or the handwriting pad first!');
      return;
    }

    if (isRecording && speechListener) {
      speechListener.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ.question,
          answer: answerToEval,
          backgroundTrack: TRACK_INFO[activeTrack].name,
          difficulty: selectedDifficulty
        })
      });

      const data = await response.json();
      if (data.evaluation) {
        setEvaluationResult(data.evaluation);
        const evaluatedRecord: EvaluatedAnswer = {
          questionId: currentQ.id,
          questionText: currentQ.question,
          candidateAnswer: answerToEval,
          mode: inputMode === 'mic' ? 'speech' : inputMode === 'canvas' ? 'handwriting' : 'typed',
          timestamp: new Date().toISOString(),
          evaluation: data.evaluation
        };
        onRecordEvaluation(evaluatedRecord);
        onUpdateXp(50); // XP reward for mock interview drill
      }
    } catch (err) {
      console.warn('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetAnswer = () => {
    setTypedAnswer('');
    setSpeechTranscript('');
    setEvaluationResult(null);
    if (isRecording && speechListener) {
      speechListener.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header bar with Track selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-stone-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
              Mock Interview Simulator & Eloquence Evaluator
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
              {TRACK_INFO[activeTrack].name}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real speech recognition, interactive stylus/canvas pad, and AI vocabulary enrichment.
          </p>
        </div>

        {/* Input Mode Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setInputMode('mic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              inputMode === 'mic'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Mic (Speech)</span>
          </button>

          <button
            onClick={() => setInputMode('typed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              inputMode === 'typed'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Typing Pad</span>
          </button>

          <button
            onClick={() => setInputMode('canvas')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              inputMode === 'canvas'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Writing Pad</span>
          </button>
        </div>
      </div>

      {/* The Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Navigation & Question Metadata */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">
              QUESTION {currentIdx + 1} OF {activeQuestionList.length}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-amber-600 dark:text-amber-400 capitalize font-medium">
              {currentQ.category.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setCurrentIdx((prev) => (prev > 0 ? prev - 1 : activeQuestionList.length - 1));
                handleResetAnswer();
              }}
              className="p-1 rounded-lg border border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-800"
              title="Previous question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentIdx((prev) => (prev + 1) % activeQuestionList.length);
                handleResetAnswer();
              }}
              className="p-1 rounded-lg border border-stone-200 dark:border-slate-800 hover:bg-stone-100 dark:hover:bg-slate-800"
              title="Next question"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Title & Prompt */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h2>
            <button
              onClick={() => speakText(currentQ.question)}
              className="p-2 rounded-xl text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors shrink-0 ml-3"
              title="Read Question Aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* Recommended Vocabulary High-Yield Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">
              Elevated vocabulary to weave in:
            </span>
            {currentQ.recommendedKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Dialectic / Cultural Rhetoric Tip */}
        {currentQ.culturalInsight && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Indian Rhetorical Wisdom & Logic Framework:</span>
              <p className="mt-0.5 text-amber-800 dark:text-amber-200/90 leading-relaxed">
                {currentQ.culturalInsight}
              </p>
            </div>
          </div>
        )}

        {/* Input Interface Based on Mode */}
        <div className="space-y-4 pt-2">
          
          {/* Mode 1: Microphone Speech Mode */}
          {inputMode === 'mic' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800 text-center space-y-4">
                {/* Visualizer & Mic Button */}
                <div className="relative inline-block">
                  {audioPulse && (
                    <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-25" />
                  )}
                  <button
                    onClick={toggleRecording}
                    className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md ${
                      isRecording
                        ? 'bg-rose-600 text-white hover:bg-rose-700 scale-105'
                        : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:scale-105 border-2 border-rose-200 dark:border-rose-900'
                    }`}
                    title={isRecording ? 'Click to stop speaking' : 'Click to start speaking into microphone'}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>

                <div>
                  <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    {isRecording ? 'Recording your speech... Speak naturally!' : 'Click the microphone and speak your answer'}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    The AI coach will evaluate your vocabulary choices, fluency rate, and filler words.
                  </p>
                </div>

                {/* Live Transcript Display */}
                <div className="text-left bg-white dark:bg-slate-900 p-4 rounded-xl border border-stone-200 dark:border-slate-800 min-h-[90px] text-sm text-slate-800 dark:text-slate-200">
                  {speechTranscript ? (
                    <p className="italic">"{speechTranscript}"</p>
                  ) : (
                    <span className="text-slate-400 text-xs">
                      Spoken transcript will appear here in real time...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Typing Pad */}
          {inputMode === 'typed' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Type your candidate response:</span>
                <span className="font-mono text-[11px] text-slate-400">
                  {typedAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </label>
              <textarea
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="In addressing this challenge, my primary focus was... (Feel free to draft your response using Situation, Task, Action, and Result)"
                rows={5}
                className="w-full p-4 rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          )}

          {/* Mode 3: Interactive Writing Pad Canvas */}
          {inputMode === 'canvas' && (
            <div className="space-y-2">
              <CanvasPad
                initialPrompt="Write keywords or draft response points"
                onTranscribedText={(text) => {
                  setTypedAnswer(text);
                  setInputMode('typed');
                }}
              />
            </div>
          )}

          {/* Submission and Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleResetAnswer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Answer</span>
            </button>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-semibold text-xs shadow-md transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isEvaluating ? 'Evaluating Speech & Vocabulary...' : 'Submit for AI Evaluation'}</span>
            </button>
          </div>

        </div>

        {/* Evaluation Output Section */}
        {evaluationResult && (
          <div className="border-t border-stone-200 dark:border-slate-800 pt-6 space-y-6 animate-in fade-in-50 duration-300">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  Linguistic & Interview Evaluation Report
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Overall: {evaluationResult.overallScore} / 100
              </span>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Vocabulary Score</span>
                <span className="font-serif text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {evaluationResult.vocabularyScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Fluency & Cadence</span>
                <span className="font-serif text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {evaluationResult.fluencyScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Articulation Clarity</span>
                <span className="font-serif text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {evaluationResult.clarityScore}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-950/60 border border-stone-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 block">Fillers Detected</span>
                <span className="font-serif text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {evaluationResult.fillerWordsDetected.length}
                </span>
              </div>
            </div>

            {/* Elevated Vocabulary Upgrades */}
            {evaluationResult.elevatedVocabSuggestions.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                  Elevated Vocabulary Upgrades (Replace & Level Up)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {evaluationResult.elevatedVocabSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-stone-50 dark:bg-slate-950/40 border border-stone-200 dark:border-slate-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-rose-600 dark:text-rose-400 line-through">
                          "{sug.originalWord}"
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                          {sug.betterAlternative}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">
                        {sug.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grammar, Punctuation & Rhetoric Feedback */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-950/40 border border-stone-200 dark:border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Coach's Articulation Advice:
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {evaluationResult.grammarAndPunctuationNotes}
              </p>
              {evaluationResult.culturalOrConceptualInsight && (
                <div className="pt-2 border-t border-stone-200 dark:border-slate-800 text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Vāda / Epistemic Rationale: </span>
                  {evaluationResult.culturalOrConceptualInsight}
                </div>
              )}
            </div>

            {/* Exemplary Polished Model Answer */}
            {evaluationResult.exemplaryRewrite && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-amber-950/20 dark:to-indigo-950/20 border border-amber-200/50 dark:border-amber-800/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Exemplary Executive Rewrite (Benchmark STAR Response):
                  </span>
                  <button
                    onClick={() => speakText(evaluationResult.exemplaryRewrite)}
                    className="p-1 rounded text-slate-600 hover:text-amber-600"
                    title="Listen to polished response"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-800 dark:text-slate-200 italic leading-relaxed">
                  "{evaluationResult.exemplaryRewrite}"
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
