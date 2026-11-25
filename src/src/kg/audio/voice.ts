import { SpeakOptions, SpeechLang } from '../types';

/**
 * Tiny audio engine (no backend, no Web Audio).
 * - Plays a recorded clip when a url is given.
 * - Falls back to the browser voice if the clip is missing or fails.
 * - If the browser blocks autoplay, the sound is queued and plays on the
 *   user's first click / key press.
 */

type Listener = () => void;

let current: HTMLAudioElement | null = null;
let speaking = false;
let pending: (() => void) | null = null;
let gestureBound = false;
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
const listeners = new Set<Listener>();

function setSpeaking(value: boolean) {
  if (speaking === value) return;
    speaking = value;
  if (!value) analyser = null;
  listeners.forEach((l) => l());
}

export function subscribeSpeaking(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSpeaking(): boolean {
  return speaking;
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

/** Only called for clips loaded with CORS, so routing through Web Audio is safe. */
function wireAnalyser(el: HTMLAudioElement) {
  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    if (!audioCtx) audioCtx = new Ctor();
    const ctx = audioCtx;
    const connect = () => {
      if (current !== el || ctx.state !== 'running') return;
      const src = ctx.createMediaElementSource(el);
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      src.connect(an);
      an.connect(ctx.destination);
      analyser = an;
    };
    if (ctx.state === 'running') connect();
    else void ctx.resume().then(connect).catch(() => undefined);
  } catch {
    analyser = null;
  }
}

/** 0..1 mouth opening. Real loudness if available, otherwise a natural talking rhythm. */
export function getMouthLevel(): number {
  if (!speaking) return 0;
  if (analyser) {
    const buf = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    return Math.min(1, Math.sqrt(sum / buf.length) * 8);
  }
  const t = performance.now() / 1000;
  const pause = Math.sin(t * 2.8) > -0.8 ? 1 : 0; // short natural pauses
  const env = 0.55 + 0.45 * Math.sin(t * 8.2 + Math.sin(t * 3.1));
  const lvl = pause * (0.12 + 0.88 * Math.pow(Math.abs(Math.sin(t * 17)), 0.8) * env);
  return Math.max(0, Math.min(1, lvl));
}

export function stopVoice() {
  pending = null;
  if (current) {
    current.onended = null;
    current.onerror = null;
    current.pause();
    current = null;
  }
  synth()?.cancel();
  setSpeaking(false);
}

function queueUntilGesture(run: () => void) {
  pending = run;
  if (gestureBound || typeof window === 'undefined') return;
  gestureBound = true;
  const fire = () => {
    window.removeEventListener('click', fire, true);
    window.removeEventListener('keydown', fire, true);
    gestureBound = false;
    const job = pending;
    pending = null;
    if (job) job();
  };
  window.addEventListener('click', fire, true);
  window.addEventListener('keydown', fire, true);
}

const LANG_PREFIXES: Record<SpeechLang, string[]> = {
  en: ['en'],
  ur: ['ur'],
  pa: ['pa', 'ur'],
  ps: ['ps', 'fa', 'ur'],
};

function pickVoice(lang: SpeechLang): SpeechSynthesisVoice | null {
  const voices = synth()?.getVoices() ?? [];
  for (const prefix of LANG_PREFIXES[lang]) {
    const hit = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (hit) return hit;
  }
  return null;
}

function speakWithBrowserVoice(opts: SpeakOptions) {
  const s = synth();
  const lang = opts.lang ?? 'en';
  if (!s || !opts.text) {
    setSpeaking(false);
    return;
  }
  const voice = pickVoice(lang);
  if (!voice) {
    // No suitable voice installed: stay silent instead of reading in the wrong language.
    setSpeaking(false);
    return;
  }
  const u = new SpeechSynthesisUtterance(opts.text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 0.9;
  u.onend = () => setSpeaking(false);
  u.onerror = (e) => {
    setSpeaking(false);
    if (e.error === 'not-allowed') queueUntilGesture(() => speak(opts));
  };
  setSpeaking(true);
  s.speak(u);
}

export function speak(opts: SpeakOptions, useCors = true) {
  stopVoice();
  if (!opts.url) {
    speakWithBrowserVoice(opts);
    return;
  }
    const el = new Audio();
  if (useCors) el.crossOrigin = 'anonymous';
  el.src = opts.url;
  current = el;
  el.onplaying = () => {
      if (current === el) {
      setSpeaking(true);
      if (useCors) wireAnalyser(el);
    }
  };
  el.onended = () => {
    if (current === el) {
      current = null;
      setSpeaking(false);
    }
  };
   el.onerror = () => {
    if (useCors && current === el) {
      current = null;
      speak(opts, false); // CORS not allowed by the server: retry plain, no analyser
      return;
    }
    if (current !== el) return;
    current = null;
    speakWithBrowserVoice(opts);
  };
  el.play().catch((err: unknown) => {
    if (current !== el) return;
    current = null;
    if (err instanceof DOMException && err.name === 'NotAllowedError') {
      queueUntilGesture(() => speak(opts));
    } else {
      speakWithBrowserVoice(opts);
    }
  });
}
