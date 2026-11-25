import { useMemo } from 'react';
import { useKg } from '../context/KgContext';
import { Chapter, LessonCard } from './types';
import { useChapters, useClassLessons } from './useApi';

export type SubjectKey = 'english' | 'math' | 'urdu';

/** The order of a class day: English, then Maths, then Urdu. */
export const SUBJECT_ORDER: SubjectKey[] = ['english', 'math', 'urdu'];

/** Which subject a chapter belongs to (the API has no subject name, so this reads the chapter text). */
export function subjectOf(c: Chapter): SubjectKey | null {
  const text = `${c.nameEn} ${c.descriptionEn ?? ''}`.toLowerCase();
  if (/urdu/.test(text)) return 'urdu';
  if (/math|counting|number/.test(text)) return 'math';
  if (/english|alphabet/.test(text)) return 'english';
  return null;
}

export interface DaySlot {
  subject: SubjectKey;
  chapter: Chapter | null;
  lesson: LessonCard | null;
  done: boolean;
}

export interface DayPlan {
  /** 1-based number of the day the child is on. */
  day: number;
  totalDays: number;
  slots: DaySlot[];
}

/**
 * Day N = the Nth lesson (by learning_order) of the English, Maths and Urdu chapters.
 * The current day is the first day that still has an unfinished lesson.
 */
export function useDayPlan() {
  const chapters = useChapters();
  const lessons = useClassLessons();
  const { isDone } = useKg();

  const plan = useMemo<DayPlan | null>(() => {
    if (!chapters.data || !lessons.data) return null;

    const bySubject = new Map<SubjectKey, { chapter: Chapter; lessons: LessonCard[] }>();
    for (const c of chapters.data) {
      const s = subjectOf(c);
      if (!s || bySubject.has(s)) continue;
      bySubject.set(s, { chapter: c, lessons: lessons.data.filter((l) => l.chapterId === c.id) });
    }

    const totalDays = Math.max(0, ...Array.from(bySubject.values()).map((v) => v.lessons.length));
    const dayDone = (d: number) =>
      SUBJECT_ORDER.every((s) => {
        const l = bySubject.get(s)?.lessons[d];
        return !l || isDone(l.slug);
      });

    let d = 0;
    while (d < totalDays - 1 && dayDone(d)) d++;

    const slots: DaySlot[] = SUBJECT_ORDER.map((subject) => {
      const entry = bySubject.get(subject);
      const lesson = entry?.lessons[d] ?? null;
      return { subject, chapter: entry?.chapter ?? null, lesson, done: !!lesson && isDone(lesson.slug) };
    });

    return { day: d + 1, totalDays, slots };
  }, [chapters.data, lessons.data, isDone]);

  return {
    plan,
    lessons: lessons.data ?? [],
    loading: chapters.loading || lessons.loading || (!plan && !chapters.error && !lessons.error),
    error: chapters.error || lessons.error,
    retry: () => {
      chapters.retry();
      lessons.retry();
    },
  };
}