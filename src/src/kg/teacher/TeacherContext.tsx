import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { localize } from '../api/client';
import { Localized } from '../api/types';
import { usePhrases } from '../api/useApi';
import { speak } from '../audio/voice';
import { useKg } from '../context/KgContext';
import { SpeechLang } from '../types';

export interface Line { id: number; text: string; audio: string | null; lang: SpeechLang }

interface TeacherValue {
  line: Line | null;
  phrasesReady: boolean;
  say: (l: { text: string; audio?: string | null; lang?: SpeechLang }) => void;
  sayLocalized: (text: Localized | undefined, audio: Localized | undefined) => boolean;
  react: (phraseKey: string, fallback?: string) => void;
  replay: () => void;
}

const TeacherContext = createContext<TeacherValue | null>(null);

/**
 * The teacher's bubble text is stored per page AND per voice ("/kg|ps"), never as one global line.
 * It is also mirrored to sessionStorage, so leaving KG and coming back restores the right text
 * instead of an empty bubble ("Coming soon").
 */
const LINES_KEY = 'zaheen.kg.lines';
type LineMap = Record<string, Line>;

const scopeOf = (pathname: string) => pathname.replace(/\/+$/, '') || '/';
const keyOf = (pathname: string, voice: string) => `${scopeOf(pathname)}|${voice}`;

function loadLines(): LineMap {
  try {
    const raw = typeof window === 'undefined' ? null : window.sessionStorage.getItem(LINES_KEY);
    const parsed = raw ? (JSON.parse(raw) as LineMap) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveLines(map: LineMap) {
  try {
    window.sessionStorage.setItem(LINES_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable: lines still work for this visit */
  }
}

export function TeacherProvider({ children }: { children: ReactNode }) {
  const { voice } = useKg();
  const { pathname } = useLocation();
  const phrases = usePhrases();
  const [lines, setLines] = useState<LineMap>(loadLines);
  const counter = useRef(Object.values(lines).reduce((m, l) => Math.max(m, l?.id ?? 0), 0));
  const latest = useRef({ voice, phrases: phrases.data, pathname });
  latest.current = { voice, phrases: phrases.data, pathname };

  // Only the line that belongs to THIS page and THIS voice is shown.
  const line = lines[keyOf(pathname, voice)] ?? null;
  const lineRef = useRef<Line | null>(null);
  lineRef.current = line;

  const say = useCallback<TeacherValue['say']>((l) => {
    const next: Line = { id: ++counter.current, text: l.text, audio: l.audio ?? null, lang: l.lang ?? 'en' };
    const key = keyOf(latest.current.pathname, latest.current.voice);
    setLines((prev) => {
      const map = { ...prev, [key]: next };
      saveLines(map);
      return map;
    });
    speak({ url: next.audio ?? undefined, text: next.text, lang: next.lang });
  }, []);

  const sayLocalized = useCallback<TeacherValue['sayLocalized']>(
    (text, audio) => {
      const hit = localize(text, audio, latest.current.voice);
      if (hit) say(hit);
      return !!hit;
    },
    [say]
  );

  const react = useCallback<TeacherValue['react']>(
    (key, fallback) => {
      const p = latest.current.phrases?.get(key);
      const hit = p ? localize(p.text, p.audio, latest.current.voice) : null;
      if (hit) say(hit);
      else if (fallback) say({ text: fallback, lang: 'en' });
    },
    [say]
  );

  const replay = useCallback(() => {
    const l = lineRef.current;
    if (l) speak({ url: l.audio ?? undefined, text: l.text, lang: l.lang });
  }, []);

  const value = useMemo(
    () => ({ line, phrasesReady: !phrases.loading, say, sayLocalized, react, replay }),
    [line, phrases.loading, say, sayLocalized, react, replay]
  );
  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>;
}

export function useTeacher(): TeacherValue {
  const ctx = useContext(TeacherContext);
  if (!ctx) throw new Error('useTeacher must be used inside <KgLayout />');
  return ctx;
}