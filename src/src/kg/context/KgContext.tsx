import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/modules/shared/context/AuthContext';
import { resolveIds } from '../api/client';
import { getProgress } from '../api/progress';
import { DEFAULT_VOICE, isVoiceLang } from '../data/voices';
import { VoiceLang } from '../types';

const VOICE_KEY = 'zaheen.kg.voice';
const CHOSEN_KEY = 'zaheen.kg.voiceChosen';
const PROGRESS_KEY = 'zaheen.kg.progress';
/** Saved steps are kept per child, so one child's progress never leaks into another child's account. */
let activeProgressKey = PROGRESS_KEY;

export function readSession(key: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string) {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the module still works for this visit */
  }
}

interface Progress {
  /** Best star count per finished lesson. */
  best: Record<string, number>;
  /** Per lesson: finished step key -> score (quiz = first-try correct count, anything else = 1, skipped = 0). */
  steps: Record<string, Record<string, number>>;
}

function readProgress(): Progress {
  try {
    const raw = typeof window === 'undefined' ? null : window.localStorage.getItem(activeProgressKey);
    const parsed = raw ? (JSON.parse(raw) as Partial<Progress>) : null;
    if (parsed && typeof parsed.best === 'object' && parsed.best) {
      return { best: parsed.best, steps: parsed.steps && typeof parsed.steps === 'object' ? parsed.steps : {} };
    }
  } catch {
    /* ignore corrupt data */
  }
  return { best: {}, steps: {} };
}

function writeProgress(p: Progress) {
  try {
    window.localStorage.setItem(activeProgressKey, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

interface KgContextValue {
  voice: VoiceLang;
  /** True once the child has confirmed a voice in this browser session. */
  voiceChosen: boolean;
  setVoice: (v: VoiceLang) => void;
  confirmVoice: (v: VoiceLang) => void;
  /** Re-opens the language (voice) chooser page. */
  openVoiceChooser: () => void;
  starsFor: (lessonId: string) => number;
  isDone: (lessonId: string) => boolean;
  totalStars: number;
  doneCount: number;
  finishLesson: (lessonId: string, stars: number) => void;
  stepsOf: (lessonId: string) => Record<string, number>;
  markStep: (lessonId: string, key: string, score?: number) => void;
  /** Forget these lessons (finished + saved steps) after they were reset on the server. */
  resetLessons: (lessonIds: string[]) => void;
}

const KgContext = createContext<KgContextValue | null>(null);

export function KgProvider({ children }: { children: ReactNode }) {
  const { userId } = useAuth();
  const [voiceChosen, setVoiceChosen] = useState<boolean>(() => readSession(CHOSEN_KEY) === '1');
  const [voice, setVoiceState] = useState<VoiceLang>(() => {
    const saved = readSession(VOICE_KEY);
    return readSession(CHOSEN_KEY) === '1' && isVoiceLang(saved) ? saved : DEFAULT_VOICE;
  });
  activeProgressKey = userId ? `${PROGRESS_KEY}.u${userId}` : PROGRESS_KEY;
  const [progress, setProgress] = useState<Progress>(readProgress);
  // A different child logged in on this browser: load THEIR saved steps, never the previous child's.
  useEffect(() => {
    setProgress(readProgress());
  }, [userId]);
  /** Completed lessons (slug -> stars) from the server. null = not logged in, or the server could not be reached. */
  const [remote, setRemote] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!userId) {
      setRemote(null);
      return;
    }
    let alive = true;
    resolveIds()
      .then((ids) => getProgress(userId, ids.classId))
      .then((rows) => {
        if (!alive) return;
        const next: Record<string, number> = {};
        rows.forEach((r) => {
          if (r.completed) next[r.slug] = r.stars;
        });
        setRemote(next);
      })
      .catch(() => {
        /* server unreachable: fall back to what this browser knows */
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const setVoice = useCallback((v: VoiceLang) => {
    setVoiceState(v);
    writeSession(VOICE_KEY, v);
  }, []);

  const confirmVoice = useCallback((v: VoiceLang) => {
    setVoiceState(v);
    writeSession(VOICE_KEY, v);
    writeSession(CHOSEN_KEY, '1');
    setVoiceChosen(true);
  }, []);

  const openVoiceChooser = useCallback(() => {
    setVoiceChosen(false);
  }, []);

  const finishLesson = useCallback((lessonId: string, stars: number) => {
    setProgress((prev) => {
      const next: Progress = { ...prev, best: { ...prev.best, [lessonId]: Math.max(prev.best[lessonId] ?? 0, stars) } };
      writeProgress(next);
      return next;
    });
    setRemote((prev) => (prev ? { ...prev, [lessonId]: Math.max(prev[lessonId] ?? 0, stars) } : prev));
  }, []);

  const markStep = useCallback((lessonId: string, key: string, score = 1) => {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        steps: { ...prev.steps, [lessonId]: { ...(prev.steps[lessonId] ?? {}), [key]: score } },
      };
      writeProgress(next);
      return next;
    });
  }, []);

  const resetLessons = useCallback((lessonIds: string[]) => {
    setProgress((prev) => {
      const best = { ...prev.best };
      const steps = { ...prev.steps };
      lessonIds.forEach((id) => {
        delete best[id];
        delete steps[id];
      });
      const next: Progress = { ...prev, best, steps };
      writeProgress(next);
      return next;
    });
    setRemote((prev) => {
      if (!prev) return prev;
      const next = { ...prev };
      lessonIds.forEach((id) => delete next[id]);
      return next;
    });
  }, []);

  const value = useMemo<KgContextValue>(() => {
    const done = userId && remote ? remote : progress.best;
    const ids = Object.keys(done);
    return {
      voice,
      voiceChosen,
      setVoice,
      openVoiceChooser,
      confirmVoice,
      starsFor: (id) => done[id] ?? 0,
      isDone: (id) => id in done,
      totalStars: ids.reduce((sum, id) => sum + done[id], 0),
      doneCount: ids.length,
      finishLesson,
      stepsOf: (id) => progress.steps[id] ?? {},
      markStep,
      resetLessons,
    };
  }, [voice, voiceChosen, progress, remote, userId, setVoice, confirmVoice, openVoiceChooser, finishLesson, markStep, resetLessons]);

  return <KgContext.Provider value={value}>{children}</KgContext.Provider>;
}

export function useKg(): KgContextValue {
  const ctx = useContext(KgContext);
  if (!ctx) throw new Error('useKg must be used inside <KgLayout />');
  return ctx;
}
