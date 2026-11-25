import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/shared/context/AuthContext';
import { resetLesson } from '../api/progress';
import { DayView } from '../api/useDayView';
import { KG_BASE_PATH } from '../config';
import { useKg } from '../context/KgContext';

/** Small "Retry Day N" button, shown beside the main button when the next day is the current one. */
export function RetryDayButton({ day, lessons, isUr }: { day: number; lessons: DayView['lessons']; isUr: boolean }) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { resetLessons } = useKg();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const retry = async () => {
    if (busy || lessons.length === 0) return;
    setBusy(true);
    setFailed(false);
    try {
      if (userId) {
        const results = await Promise.allSettled(lessons.map((l) => resetLesson(userId, l.id)));
        const okSlugs = lessons.filter((_, n) => results[n].status === 'fulfilled').map((l) => l.slug);
        resetLessons(okSlugs);
        if (okSlugs.length < lessons.length) throw new Error('reset failed');
      } else {
        resetLessons(lessons.map((l) => l.slug));
      }
      navigate(`${KG_BASE_PATH}/lesson/${lessons[0].slug}`, { state: { dayFlow: true } });
    } catch {
      setFailed(true);
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={retry}
      disabled={busy}
      className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 text-sm font-extrabold transition-transform hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-60 disabled:cursor-wait"
      style={{ order: 2, flex: '0 0 auto', minHeight: 56, background: '#FFF7ED', color: '#C2410C', border: '2px solid #FDBA74' }}
    >
      <span aria-hidden="true">🔄</span>
      {busy ? '…' : failed ? (isUr ? 'پھر کوشش کریں' : 'Try again') : isUr ? `دن ${day} دوبارہ` : `Retry Day ${day}`}
    </button>
  );
}

const toyButton =
  'flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-base font-extrabold text-white ' +
  'transition-transform hover:-translate-y-0.5 active:translate-y-1 disabled:opacity-60 disabled:cursor-wait';

/**
 * Shown on the Today page once a day is finished:
 *  - Retry Day N : resets that day's lessons on the server (POST .../lessons/:lessonId/reset) and starts it again
 *  - Next Day N+1: starts the next day, only when the child taps it
 */
export function TodayActions({ view, isUr }: { view: DayView | null; isUr: boolean }) {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { resetLessons } = useKg();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!view || !view.complete) return null;

  const retry = async () => {
    if (busy || view.lessons.length === 0) return;
    setBusy(true);
    setError('');
    try {
      if (userId) {
        const results = await Promise.allSettled(view.lessons.map((l) => resetLesson(userId, l.id)));
        const okSlugs = view.lessons.filter((_, n) => results[n].status === 'fulfilled').map((l) => l.slug);
        resetLessons(okSlugs);
        if (okSlugs.length < view.lessons.length) throw new Error('reset failed');
      } else {
        resetLessons(view.lessons.map((l) => l.slug));
      }
      navigate(`${KG_BASE_PATH}/lesson/${view.lessons[0].slug}`, { state: { dayFlow: true } });
    } catch {
      setError(isUr ? 'دوبارہ شروع نہیں ہو سکا۔ پھر کوشش کریں۔' : 'Could not restart this day. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 'auto', flex: '1 1 100%' }}>
      <div className={`grid gap-3 ${view.next ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <button
          type="button"
          className={toyButton}
          style={{ background: 'linear-gradient(135deg,#FFAE4D,#F57C1F)', boxShadow: '0 6px 0 #C85F0F' }}
          onClick={retry}
          disabled={busy}
        >
          <span className="text-2xl" aria-hidden="true">
            🔄
          </span>
          {busy ? '…' : isUr ? `دن ${view.day} دوبارہ` : `Retry Day ${view.day}`}
        </button>
        {view.next && (
          <button
            type="button"
            className={toyButton}
            style={{ background: 'linear-gradient(135deg,#4ADE80,#16A34A)', boxShadow: '0 6px 0 #0F7A37' }}
            onClick={() => navigate(`${KG_BASE_PATH}/lesson/${view.next!.slug}`, { state: { dayFlow: true } })}
            disabled={busy}
          >
            <span className="text-2xl" aria-hidden="true">
              🚀
            </span>
            {isUr ? `اگلا دن ${view.next.day}` : `Next Day ${view.next.day}`}
          </button>
        )}
      </div>
      {error && <p className="zkg-error mt-3">{error}</p>}
    </div>
  );
}