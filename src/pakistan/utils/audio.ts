// Soft procedural SFX via Web Audio — no external assets needed.

let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) {
    ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return ctx;
};

const tone = (freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08) => {
  try {
    const c = getCtx();
    if (c.state === "suspended") void c.resume();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration);
  } catch {
    // Audio may be blocked until user gesture
  }
};

export const sfx = {
  click: () => {
    tone(600, 0.08, "sine", 0.06);
    tone(900, 0.06, "sine", 0.04);
  },
  success: () => {
    tone(523, 0.12, "sine", 0.08);
    setTimeout(() => tone(659, 0.12, "sine", 0.08), 100);
    setTimeout(() => tone(784, 0.18, "sine", 0.1), 200);
  },
  wrong: () => {
    tone(300, 0.15, "triangle", 0.05);
    setTimeout(() => tone(250, 0.2, "triangle", 0.04), 120);
  },
  star: () => {
    tone(800, 0.1, "sine", 0.07);
    setTimeout(() => tone(1200, 0.15, "sine", 0.06), 80);
  },
  whoosh: () => {
    tone(400, 0.2, "sawtooth", 0.03);
    setTimeout(() => tone(200, 0.15, "sawtooth", 0.02), 50);
  },
  celebrate: () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => tone(f, 0.2, "sine", 0.08), i * 90);
    });
  },
  pop: () => tone(700, 0.08, "square", 0.04),
  coin: () => {
    tone(980, 0.08, "sine", 0.06);
    setTimeout(() => tone(1310, 0.12, "sine", 0.05), 70);
  },
};

export const playAmbient = (enabled: boolean) => {
  if (!enabled) return;
  try {
    const c = getCtx();
    if (c.state === "suspended") void c.resume();
  } catch {
    /* ignore */
  }
};

export const speak = (text: string, enabled = true, lang = "en-US") => {
  if (!enabled || typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92;
  u.pitch = 1.15;
  u.lang = lang === "ur" ? "ur-PK" : "en-US";
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find(
      (v) =>
        v.lang.startsWith(lang === "ur" ? "ur" : "en") &&
        /female|child|samantha|karen|google/i.test(v.name)
    ) || voices.find((v) => v.lang.startsWith(lang === "ur" ? "ur" : "en"));
  if (preferred) u.voice = preferred;
  window.speechSynthesis.speak(u);
};

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
