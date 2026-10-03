import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Download, Sparkles, Check, Palette } from 'lucide-react';

interface CanvasPadProps {
  onTranscribedText?: (text: string) => void;
  initialPrompt?: string;
  className?: string;
  onSaveDrawing?: (dataUrl: string) => void;
}

export const CanvasPad: React.FC<CanvasPadProps> = ({
  onTranscribedText,
  initialPrompt = 'Write or sketch vocabulary notes, mind maps, or phonetic spellings here...',
  className = '',
  onSaveDrawing
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563eb');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Save initial blank state
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.strokeStyle = isEraser ? (document.documentElement.classList.contains('dark') ? '#090d16' : '#ffffff') : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    // Save state for undo
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-15), currentState]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const blank = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([blank]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previous = newHistory[newHistory.length - 1];
    ctx.putImageData(previous, 0, 0);
    setHistory(newHistory);
  };

  const handleTranscribeHandwriting = () => {
    setIsRecognizing(true);
    // Transcribe simulated handwriting analysis
    setTimeout(() => {
      setIsRecognizing(false);
      if (onTranscribedText) {
        onTranscribedText("Samatvam / Equanimity: Poise under technical interrogation. (Hetu -> Udāharaṇa structure)");
      }
    }, 800);
  };

  const handleSaveToNotebook = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    if (onSaveDrawing) {
      onSaveDrawing(dataUrl);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className={`flex flex-col border border-stone-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm ${className}`}>
      {/* Canvas Toolset Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-stone-50 dark:bg-slate-900 border-b border-stone-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            Writing & Mindmap Pad
          </span>
          <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">{initialPrompt}</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Colors */}
          <div className="flex items-center gap-1 mr-2 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-stone-200 dark:border-slate-700">
            {['#2563eb', '#f59e0b', '#10b981', '#ec4899', '#6366f1'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                className={`w-4 h-4 rounded-full transition-transform ${color === c && !isEraser ? 'scale-125 ring-2 ring-slate-400' : 'hover:scale-110'}`}
                style={{ backgroundColor: c }}
                title={`Select color ${c}`}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-lg border border-stone-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setLineWidth(2)}
              className={`px-1 rounded ${lineWidth === 2 ? 'bg-stone-200 dark:bg-slate-700 font-bold' : ''}`}
              title="Fine tip"
            >
              Fine
            </button>
            <button
              type="button"
              onClick={() => setLineWidth(4)}
              className={`px-1 rounded ${lineWidth === 4 ? 'bg-stone-200 dark:bg-slate-700 font-bold' : ''}`}
              title="Medium tip"
            >
              Med
            </button>
            <button
              type="button"
              onClick={() => setLineWidth(7)}
              className={`px-1 rounded ${lineWidth === 7 ? 'bg-stone-200 dark:bg-slate-700 font-bold' : ''}`}
              title="Broad tip"
            >
              Bold
            </button>
          </div>

          {/* Eraser */}
          <button
            type="button"
            onClick={() => setIsEraser(!isEraser)}
            className={`p-1.5 rounded-md border transition-colors ${
              isEraser
                ? 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700'
            }`}
            title="Eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          {/* Undo */}
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="p-1.5 rounded-md border bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-700 disabled:opacity-40"
            title="Undo stroke"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={clearCanvas}
            className="px-2 py-1 rounded-md border border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Drawing Surface */}
      <div className="relative w-full h-52 sm:h-64 bg-stone-50/50 dark:bg-slate-950/60 touch-none cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />

        {/* Paper grid subtle pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '16px 16px'
          }}
        />
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between px-3 py-2 bg-stone-50/90 dark:bg-slate-900 border-t border-stone-200 dark:border-slate-800 text-xs">
        <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
          Supports stylus & touch screen input
        </span>

        <div className="flex items-center gap-2">
          {onTranscribedText && (
            <button
              type="button"
              onClick={handleTranscribeHandwriting}
              disabled={isRecognizing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-300/40 transition-colors font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isRecognizing ? 'Transcribing...' : 'Convert to Text'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveToNotebook}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-200/70 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors font-medium"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Save Note</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
