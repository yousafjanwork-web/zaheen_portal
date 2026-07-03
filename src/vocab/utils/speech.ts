// Text-to-Speech utility using Web Speech API
export class SpeechManager {
  private static instance: SpeechManager;
  private synth: SpeechSynthesis;
  private isSpeaking = false;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  static getInstance(): SpeechManager {
    if (!SpeechManager.instance) {
      SpeechManager.instance = new SpeechManager();
    }
    return SpeechManager.instance;
  }

  speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: 'child' | 'female' | 'male';
    onEnd?: () => void;
    onStart?: () => void;
  }): Promise<void> {
    return new Promise((resolve) => {
      this.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      utterance.rate = options?.rate ?? 0.85;
      utterance.pitch = options?.pitch ?? 1.2;
      utterance.volume = options?.volume ?? 1.0;

      const voices = this.synth.getVoices();
      const preferredVoice = this.findBestVoice(voices);
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        options?.onEnd?.();
        this.onEndCallback?.();
        resolve();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        options?.onEnd?.();
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  speakWord(word: string, pronunciation: string): Promise<void> {
    return new Promise((resolve) => {
      this.cancel();

      const wordUtterance = new SpeechSynthesisUtterance(word);
      wordUtterance.rate = 0.6;
      wordUtterance.pitch = 1.3;
      wordUtterance.volume = 1.0;

      const voices = this.synth.getVoices();
      const voice = this.findBestVoice(voices);
      if (voice) wordUtterance.voice = voice;

      wordUtterance.onend = () => {
        setTimeout(() => {
          const pronUtterance = new SpeechSynthesisUtterance(`That's pronounced: ${pronunciation}`);
          pronUtterance.rate = 0.85;
          pronUtterance.pitch = 1.2;
          if (voice) pronUtterance.voice = voice;
          pronUtterance.onend = () => resolve();
          pronUtterance.onerror = () => resolve();
          this.synth.speak(pronUtterance);
        }, 400);
      };

      wordUtterance.onerror = () => resolve();
      this.synth.speak(wordUtterance);
    });
  }

  speakDefinition(word: string, definition: string): Promise<void> {
    return this.speak(`${word} means: ${definition}`, { rate: 0.8, pitch: 1.2 });
  }

  speakExample(sentence: string): Promise<void> {
    return this.speak(`Here's an example: ${sentence}`, { rate: 0.85, pitch: 1.1 });
  }

  speakEncouragement(message: string): Promise<void> {
    return this.speak(message, { rate: 0.9, pitch: 1.4 });
  }

  // Robot mascot voice — slightly higher pitch, friendly cadence
  speakRobot(text: string, options?: {
    onEnd?: () => void;
    onStart?: () => void;
  }): Promise<void> {
    return this.speak(text, {
      rate: 0.88,
      pitch: 1.35,
      volume: 1.0,
      onStart: options?.onStart,
      onEnd: options?.onEnd,
    });
  }

  speakQuizQuestion(question: string, options: string[]): Promise<void> {
    const optionsText = options.map((o, i) => `Choice ${String.fromCharCode(65 + i)}: ${o}`).join('. ');
    return this.speak(`${question} Your options are: ${optionsText}`, { rate: 0.8 });
  }

  cancel(): void {
    this.synth.cancel();
    this.isSpeaking = false;
  }

  stop(): void {
    this.cancel();
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  setOnEndCallback(callback: (() => void) | null): void {
    this.onEndCallback = callback;
  }

  private findBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const englishVoices = voices.filter(v => v.lang.startsWith('en'));

    const googleVoice = englishVoices.find(v => v.name.includes('Google'));
    const microsoftVoice = englishVoices.find(v => v.name.includes('Microsoft'));
    const femaleVoice = englishVoices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.includes('Samantha') ||
      v.name.includes('Victoria') ||
      v.name.includes('Karen')
    );

    return googleVoice || microsoftVoice || femaleVoice || englishVoices[0] || voices[0] || null;
  }

  static isAvailable(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const speech = SpeechManager.getInstance();
