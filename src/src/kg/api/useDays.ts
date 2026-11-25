import { useMemo } from 'react';
import { LessonCard } from './types';
import { useChapters, useClassLessons } from './useApi';
import { SUBJECT_ORDER, SubjectKey, subjectOf } from './useDayPlan';

export interface DayEntry {
  subject: SubjectKey;
  lesson: LessonCard;
}

export interface DayInfo {
  /** 1-based day number. */
  day: number;
  entries: DayEntry[];
}

/**
 * Day N = the Nth lesson of the English, Maths and Urdu chapters, in the API's own order.
 * Only lessons that really exist are listed, so a day never has empty "coming soon" slots.
 */
export function useDays() {
  const chapters = useChapters();
  const lessons = useClassLessons();

  const days = useMemo<DayInfo[]>(() => {
    if (!chapters.data || !lessons.data) return [];
    const bySubject = new Map<SubjectKey, LessonCard[]>();
    for (const c of chapters.data) {
      const s = subjectOf(c);
      if (!s || bySubject.has(s)) continue;
      bySubject.set(s, lessons.data.filter((l) => l.chapterId === c.id));
    }
    const total = Math.max(0, ...Array.from(bySubject.values()).map((v) => v.length));
    const out: DayInfo[] = [];
    for (let d = 0; d < total; d++) {
      const entries: DayEntry[] = [];
      SUBJECT_ORDER.forEach((subject) => {
        const lesson = bySubject.get(subject)?.[d];
        if (lesson) entries.push({ subject, lesson });
      });
      if (entries.length) out.push({ day: d + 1, entries });
    }
    return out;
  }, [chapters.data, lessons.data]);

  return {
    days,
    loading: chapters.loading || lessons.loading,
    error: chapters.error || lessons.error,
    retry: () => {
      chapters.retry();
      lessons.retry();
    },
  };
}