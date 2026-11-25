import { speak } from '../audio/voice';

/**
 * Sound helpers used by the lesson activities.
 * Small synthesised effects (no files) + a thin wrapper around the module's voice engine.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq: number, startOffset: number, duration: number, type: OscillatorType = 'sine', gainPeak = 0.14) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);
  gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
  gain.gain.exponentialRampToValueAtTime(gainPeak, ctx.currentTime + startOffset + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startOffset);
  osc.stop(ctx.currentTime + startOffset + duration + 0.02);
}

export function playPopSound() {
  playTone(520, 0, 0.08, 'sine', 0.08);
}

export function playSuccessChime() {
  playTone(523.25, 0, 0.14, 'triangle', 0.13);
  playTone(659.25, 0.1, 0.16, 'triangle', 0.13);
  playTone(783.99, 0.2, 0.28, 'triangle', 0.15);
}

export function playTryAgainTone() {
  playTone(392, 0, 0.16, 'sine', 0.09);
  playTone(349.23, 0.14, 0.22, 'sine', 0.09);
}

/** Wakes the audio engine after a tap (kept so the ported activities work unchanged). */
export function unlockVoicePortal() {
  getAudioContext();
}

/** Speaks text with the browser voice (English or Urdu). */
export function speakText(text: string, lang: 'en' | 'ur' = 'en', _options?: unknown) {
  if (!text) return;
  speak({ text, lang });
}
