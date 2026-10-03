import React, { useState } from 'react';
import { X, Cloud, RefreshCw, Check, Copy, ArrowRight, Laptop, Smartphone, Download, Upload } from 'lucide-react';
import { UserProfile, VocabularyWord } from '../types/index.ts';
import { syncToCloud, loadFromCloud } from '../utils/storage.ts';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  words: VocabularyWord[];
  onCloudRestored: (newProfile: UserProfile, newWords: VocabularyWord[]) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  words,
  onCloudRestored
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [restoreCode, setRestoreCode] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const result = await syncToCloud(profile, words);
    setIsSyncing(false);
    if (result.success) {
      setSyncStatus(`Successfully backed up to cloud at ${new Date(result.timestamp || Date.now()).toLocaleTimeString()}`);
    } else {
      setSyncStatus(`Sync issue: ${result.error}`);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(profile.syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestoreFromCode = async () => {
    if (!restoreCode.trim()) return;
    setIsRestoring(true);
    setRestoreError(null);

    const result = await loadFromCloud(restoreCode.trim());
    setIsRestoring(false);

    if (result.success && result.data) {
      onCloudRestored(result.data.profile, result.data.words);
      onClose();
    } else {
      setRestoreError(result.error || 'Failed to restore profile with this code.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-stone-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-slate-800 bg-stone-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-500" />
            <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
              Cloud Synchronization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs">
          
          {/* Current Device Sync Code */}
          <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40 space-y-3">
            <span className="font-bold text-sky-950 dark:text-sky-200 block text-xs">
              Your Universal Sync Code
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Use this code to seamlessly link and synchronize your streak, vocabulary mastery, and interview history across any laptop or smartphone.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-base font-bold tracking-widest text-slate-900 dark:text-white bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-stone-200 dark:border-slate-800 text-center">
                {profile.syncCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 text-[11px]">
                Active streak: {profile.streak} days · {profile.xp} XP
              </span>
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync to Cloud'}</span>
              </button>
            </div>

            {syncStatus && (
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 pt-1">
                ✓ {syncStatus}
              </p>
            )}
          </div>

          {/* Link Another Device */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
              Link & Restore from Another Device
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Already have a VaniLingo sync code on another device? Enter it below to restore your progress.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={restoreCode}
                onChange={(e) => setRestoreCode(e.target.value.toUpperCase())}
                placeholder="e.g. VANI-8924"
                className="flex-1 px-3 py-2 rounded-lg border border-stone-200 dark:border-slate-800 bg-stone-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
              />
              <button
                onClick={handleRestoreFromCode}
                disabled={isRestoring || !restoreCode.trim()}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 font-semibold transition-colors disabled:opacity-40"
              >
                {isRestoring ? 'Linking...' : 'Restore'}
              </button>
            </div>

            {restoreError && (
              <p className="text-[11px] text-rose-500">
                {restoreError}
              </p>
            )}
          </div>

          {/* Device illustration info */}
          <div className="flex items-center justify-around p-3 rounded-xl bg-stone-50 dark:bg-slate-950/40 border border-stone-100 dark:border-slate-800 text-slate-500 text-[11px]">
            <div className="flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-slate-400" />
              <span>Desktop & Laptop</span>
            </div>
            <span className="text-slate-300">⇄</span>
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <span>Mobile Phone</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 dark:bg-slate-950/60 border-t border-stone-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
