import { useAuth } from '@/modules/shared/context/AuthContext';
import { useKg } from '../context/KgContext';
import { usePlayground } from './progress';
import { SubjectKey, useDayPlan } from './useDayPlan';

export type RowStatus = 'done' | 'current' | 'upcoming' | 'soon';

export interface TodayRow {
  key: string;
  subject: string;
  title: string;
  slug: string | null;
  status: RowStatus;
}

export interface Today {
  day: number;
  rows: TodayRow[];
  /** The lesson "Start Today's Class" opens, or null when there is nothing left today. */
  startSlug: string | null;
  total: number;
  completed: number;
  stars: number;
}

const SUBJECT_NAME: Record<SubjectKey, string> = { english: 'English', math: 'Mathematics', urdu: 'Urdu' };

/**
 * Today's class.
 * Logged in  -> sir's playground API (daily_class + stats), exactly as the server sends it.
 * Not logged in (or the API fails) -> built from the lesson list, progress kept in this browser.
 */
export function useToday() {
  const { userId } = useAuth();
  const { totalStars, isDone } = useKg();
  const remote = usePlayground(userId ?? null);
  const local = useDayPlan();

  const useServer = !!userId && !remote.error;
  let today: Today | null = null;

  if (useServer && remote.data) {
    const p = remote.data;
    const rows: TodayRow[] = p.schedule.map((s) => ({
      key: `${s.slot}`,
      subject: s.subjectName,
      title: s.title,
      slug: s.lessonSlug,
      status: !s.lessonSlug ? 'soon' : s.status === 'completed' ? 'done' : s.status === 'current' ? 'current' : 'upcoming',
    }));
    const startSlug = p.allDone ? null : p.currentSlug ?? rows.find((r) => r.slug && r.status !== 'done')?.slug ?? null;
    today = { day: p.day, rows, startSlug, total: p.stats.total, completed: p.stats.completed, stars: p.stats.stars };
  } else if (!useServer && local.plan) {
    const plan = local.plan;
    const firstPending = plan.slots.find((s) => s.lesson && !s.done);
    const rows: TodayRow[] = plan.slots.map((s) => ({
      key: s.subject,
      subject: SUBJECT_NAME[s.subject],
      title: s.lesson?.titleEn ?? '',
      slug: s.lesson?.slug ?? null,
      status: !s.lesson ? 'soon' : s.done ? 'done' : firstPending?.subject === s.subject ? 'current' : 'upcoming',
    }));
    today = {
      day: plan.day,
      rows,
      startSlug: firstPending?.lesson?.slug ?? null,
      total: local.lessons.length,
      completed: local.lessons.filter((l) => isDone(l.slug)).length,
      stars: totalStars,
    };
  }

  return {
    today,
    loading: useServer ? remote.loading : local.loading,
    error: useServer ? remote.error : local.error,
    retry: useServer ? remote.retry : local.retry,
  };
}
