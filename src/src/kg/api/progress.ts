/* eslint-disable @typescript-eslint/no-explicit-any */
import { KG_API_BASE } from '../config';
import { useIds, useRemote } from './useApi';

/* Progress APIs (sir's "SECTION 2"). Never cached: they change every time a lesson is finished. */

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${KG_API_BASE}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init?.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* not JSON */
  }
  if (!res.ok || !body || body.success === false) {
    throw new Error((body && body.message) || `Request failed (${res.status})`);
  }
  return body.data as T;
}

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v : null);
const num = (v: unknown, fallback = 0): number => (typeof v === 'number' && isFinite(v) ? v : Number(v) || fallback);
const list = (v: unknown): any[] => (Array.isArray(v) ? v : []);

/* ---------- GET /api/users/:userId/classes/:classId/playground ---------- */

export interface ScheduleRow {
  slot: number;
  subjectSlug: string;
  subjectName: string;
  lessonSlug: string | null;
  title: string;
  status: string;
}

export interface Playground {
  stats: { total: number; completed: number; stars: number };
  day: number;
  allDone: boolean;
  schedule: ScheduleRow[];
  currentSlug: string | null;
}

export async function getPlayground(userId: number, classId: number): Promise<Playground> {
  const d = await call<any>(`/api/users/${userId}/classes/${classId}/playground`);
  const dc = d?.daily_class ?? {};
  const schedule: ScheduleRow[] = list(dc.schedule)
    .map((s) => ({
      slot: num(s.slot),
      subjectSlug: str(s.subject_slug) ?? '',
      subjectName: str(s.subject_name_en) ?? '',
      lessonSlug: str(s.lesson_slug),
      title: str(s.title_en) ?? '',
      status: str(s.status) ?? 'upcoming',
    }))
    .sort((a, b) => a.slot - b.slot);
  return {
    stats: {
      total: num(d?.stats?.total_lessons),
      completed: num(d?.stats?.completed_lessons),
      stars: num(d?.stats?.total_stars),
    },
    day: num(dc.day_number, 1),
    allDone: dc.is_all_done === true,
    schedule,
    currentSlug: str(dc.current_slot?.lesson_slug),
  };
}

export function usePlayground(userId: number | null) {
  const ids = useIds();
  const key = userId && ids.data ? `playground:${userId}:${ids.data.classId}` : null;
  return useRemote<Playground>(key, () => getPlayground(userId as number, (ids.data as { classId: number }).classId));
}

/* ---------- GET /api/users/:userId/classes/:classId/progress ---------- */

export interface ProgressRow { slug: string; completed: boolean; stars: number }

export async function getProgress(userId: number, classId: number): Promise<ProgressRow[]> {
  const rows = await call<any>(`/api/users/${userId}/classes/${classId}/progress`);
  return list(rows)
    .filter((r) => r.slug)
    .map((r) => ({ slug: String(r.slug), completed: r.status === 'completed', stars: num(r.stars_earned) }));
}

/* ---------- POST /api/users/:userId/lessons/:lessonId/complete ---------- */

export interface CompleteResult { stars: number; nextSlug: string | null }

/* ---------- POST /api/users/:userId/lessons/:lessonId/reset ---------- */

/** Resets a completed lesson so the child can start it again from scratch. */
export async function resetLesson(userId: number, lessonId: number): Promise<void> {
  await call<unknown>(`/api/users/${userId}/lessons/${lessonId}/reset`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function completeLesson(
  userId: number,
  lessonId: number,
  body: { correct_answers: number; total_questions: number; duration_seconds: number }
): Promise<CompleteResult> {
  const d = await call<any>(`/api/users/${userId}/lessons/${lessonId}/complete`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return {
    stars: num(d?.stars_earned),
    nextSlug: str(d?.next_recommendation?.lesson_slug) ?? str(d?.daily_class?.current_slot?.lesson_slug),
  };
}
