/**
 * Audio synthesis (Text-to-Speech) and Web Speech Recognition helpers
 */

export function speakText(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('India')))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export interface SpeechRecognitionResultState {
  transcript: string;
  isListening: boolean;
  error?: string;
}

export class SpeechListener {
  private recognition: any = null;
  private isSupported: boolean = false;
  private onTranscriptUpdate?: (text: string, isFinal: boolean) => void;
  private onErrorCallback?: (err: string) => void;
  private isListeningActive = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const combined = (finalTranscript + ' ' + interimTranscript).trim();
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(combined, Boolean(finalTranscript));
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (this.onErrorCallback) {
          this.onErrorCallback(event.error || 'Speech capture error');
        }
      };

      this.recognition.onend = () => {
        this.isListeningActive = false;
      };
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public start(
    onTranscript: (text: string, isFinal: boolean) => void,
    onError?: (err: string) => void
  ): boolean {
    if (!this.isSupported || !this.recognition) return false;
    this.onTranscriptUpdate = onTranscript;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
      this.isListeningActive = true;
      return true;
    } catch (e) {
      console.warn('Recognition already started or error:', e);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListeningActive) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping recognition:', e);
      }
      this.isListeningActive = false;
    }
  }

  public get listening(): boolean {
    return this.isListeningActive;
  }
}
