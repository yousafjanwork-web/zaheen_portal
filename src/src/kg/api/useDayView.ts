import { useMemo } from 'react';
import { useKg } from '../context/KgContext';
import { LessonCard } from './types';
import { SUBJECT_ORDER, SubjectKey } from './useDayPlan';
import { DayEntry, useDays } from './useDays';
import { Today } from './useToday';

const SUBJECT_NAME: Record<SubjectKey, string> = { english: 'English', math: 'Mathematics', urdu: 'Urdu' };

function keyOf(name: string): SubjectKey | null {
  const t = name.toLowerCase();
  if (t.includes('urdu')) return 'urdu';
  if (t.includes('math')) return 'math';
  if (t.includes('english')) return 'english';
  return null;
}

/** Subject order for a day: the order the API sends today's class in (English / Maths / Urdu can come in any order). */
function orderFrom(names: string): SubjectKey[] {
  const order: SubjectKey[] = [];
  names.split('|').forEach((name) => {
    const k = keyOf(name);
    if (k && !order.includes(k)) order.push(k);
  });
  SUBJECT_ORDER.forEach((k) => {
    if (!order.includes(k)) order.push(k);
  });
  return order;
}

/** Puts the lessons of one day in the API's subject order. `names` = the subject names of the API's schedule joined by "|". */
export function sortDayEntries(entries: DayEntry[], names: string): DayEntry[] {
  const order = orderFrom(names);
  return [...entries].sort((a, b) => order.indexOf(a.subject) - order.indexOf(b.subject));
}

export interface DayRow {
  key: string;
  subject: string;
  title: string;
  slug: string;
  status: 'done' | 'current' | 'upcoming';
}

export interface DayView {
  day: number;
  rows: DayRow[];
  /** First lesson of this day that is not finished yet (null when the day is finished). */
  startSlug: string | null;
  /** Every lesson of this day is finished. */
  complete: boolean;
  /** The lessons of this day, in order (used by Retry). */
  lessons: LessonCard[];
  /** The next day, if the course has one. It only starts when the child taps "Next Day". */
  next: { day: number; slug: string } | null;
  /** Day numbers that are fully finished (shown as "Day N Completed"). */
  completedDays: number[];
  /** The finished day just before the shown one, so it can be retried while the next day is current. */
  prev: { day: number; lessons: LessonCard[] } | null;
}

/**
 * The day shown on the Today page, from the child's own progress.
 * - the first day that is not finished yet (or the last day when everything is finished)
 * - a finished day stays on screen until the child taps Next Day (or Retry)
 * Subjects keep the order the API sends for today's class (English / Maths / Urdu can come in any order).
 */
export function useDayView(today: Today | null) {
  const { days, loading, error, retry } = useDays();
  const { isDone } = useKg();
  const orderKey = today ? today.rows.map((r) => r.subject).join('|') : '';

  const view = useMemo<DayView | null>(() => {
    if (!days.length) return null;

    const sorted = days.map((d) => ({ day: d.day, entries: sortDayEntries(d.entries, orderKey) }));

    const finished = (n: number) => sorted[n].entries.every((e) => isDone(e.lesson.slug));


    let i = sorted.findIndex((_, n) => !finished(n));
    if (i === -1) i = sorted.length - 1; // everything finished: stay on the last day


    const shown = sorted[i];
    const complete = finished(i);
    const pending = shown.entries.find((e) => !isDone(e.lesson.slug));
    const next = complete ? sorted[i + 1] : undefined;

    return {
      day: shown.day,
      rows: shown.entries.map((e) => ({
        key: e.lesson.slug,
        subject: SUBJECT_NAME[e.subject],
        title: e.lesson.titleEn,
        slug: e.lesson.slug,
        status: isDone(e.lesson.slug) ? 'done' : pending && pending.lesson.slug === e.lesson.slug ? 'current' : 'upcoming',
      })),
      startSlug: pending ? pending.lesson.slug : null,
      complete,
      lessons: shown.entries.map((e) => e.lesson),
      next: next ? { day: next.day, slug: next.entries[0].lesson.slug } : null,
      completedDays: sorted.filter((_, n) => finished(n)).map((d) => d.day),
      prev: !complete && i > 0 ? { day: sorted[i - 1].day, lessons: sorted[i - 1].entries.map((e) => e.lesson) } : null,
    };
  }, [days, isDone, orderKey]);

  return { view, loading, error, retry };
}