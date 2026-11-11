/**
 * Child-friendly synthesized audio and speech utility for Zaheen portal
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /** Soft cheerful tap/pop sound when tapping buttons or items */
  playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Audio fallback silent
    }
  }

  /** Count item tap sound (pitch increases as number increments) */
  playCountSound(countNumber: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const now = ctx.currentTime;
      const baseFreq = 260 + Math.min(countNumber, 10) * 35;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.25, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback
    }
  }

  /** Joyful harp arpeggio when answering correctly */
  playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = now + i * 0.08;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  /** Gentle warm wobble for encouraging "Let's try again!" - never harsh buzzer */
  playGentleTryAgain() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(330, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.22);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Audio fallback
    }
  }

  /** Star chime */
  playStarEarn() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1318.5, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio fallback
    }
  }

  /** Grand celebration fanfare */
  playFanfare() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const fanfare = [
        { f: 523.25, d: 0.12, t: 0 },
        { f: 523.25, d: 0.12, t: 0.14 },
        { f: 523.25, d: 0.12, t: 0.28 },
        { f: 659.25, d: 0.22, t: 0.44 },
        { f: 783.99, d: 0.3, t: 0.68 },
        { f: 1046.5, d: 0.5, t: 0.95 },
      ];
      const now = ctx.currentTime;

      fanfare.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = now + note.t;
        osc.frequency.setValueAtTime(note.f, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + note.d + 0.05);
      });
    } catch {
      // Audio fallback
    }
  }

  private currentAudioElement: HTMLAudioElement | null = null;

  /** Stop any currently playing audio or speech */
  stopAudio() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /** Play custom recorded voice or audio file, with fallback to SpeechSynthesis */
  playCustomAudio(
    audioUrl?: string,
    fallbackText?: string,
    fallbackLang: 'en' | 'ur' = 'en'
  ): Promise<void> {
    if (this.isMuted) return Promise.resolve();
    this.stopAudio();

    if (audioUrl) {
      return new Promise<void>((resolve) => {
        try {
          const audio = new Audio(audioUrl);
          this.currentAudioElement = audio;

          audio.onended = () => {
            this.currentAudioElement = null;
            resolve();
          };

          audio.onerror = () => {
            this.currentAudioElement = null;
            if (fallbackText) {
              this.speak(fallbackText, fallbackLang);
            }
            resolve();
          };

          audio.play().catch(() => {
            this.currentAudioElement = null;
            if (fallbackText) {
              this.speak(fallbackText, fallbackLang);
            }
            resolve();
          });
        } catch {
          if (fallbackText) {
            this.speak(fallbackText, fallbackLang);
          }
          resolve();
        }
      });
    }

    if (fallbackText) {
      this.speak(fallbackText, fallbackLang);
    }
    return Promise.resolve();
  }

  /** Speak text out loud for pre-readers and pronunciation */
  speak(text: string, lang: 'en' | 'ur' = 'en') {
    if (this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slightly slower, kindergarten pacing
      utterance.pitch = 1.1; // Friendly tone

      if (lang === 'ur') {
        utterance.lang = 'ur-PK';
        // Check if an Urdu or Hindi voice exists
        const voices = window.speechSynthesis.getVoices();
        const urduVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('hi'));
        if (urduVoice) {
          utterance.voice = urduVoice;
        }
      } else {
        utterance.lang = 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech error
    }
  }
}

export const sounds = new SoundEffects();
