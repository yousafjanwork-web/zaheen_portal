import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClassLessons, resolveIds } from '../api/client';
import { getProgress, ProgressRow } from '../api/progress';
import { LessonCard } from '../api/types';
import { KG_BASE_PATH } from '../config';

/* Same look as the LMS dashboard (dark cards, amber / blue accents). */
const amber = '#F0B429';
const amberDim = 'rgba(240,180,41,0.12)';
const blue = '#3B82F6';
const blueDim = 'rgba(59,130,246,0.12)';
const green = '#10B981';
const greenDim = 'rgba(16,185,129,0.12)';
const surface = 'rgba(15,23,42,0.92)';
const surfaceEl = 'rgba(255,255,255,0.04)';
const surfaceBdr = 'rgba(255,255,255,0.07)';

const Stat = ({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) => (
  <div
    className="rounded-2xl p-4 flex items-center gap-3"
    style={{ background: surfaceEl, border: `1px solid ${surfaceBdr}` }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ background: color === amber ? amberDim : color === green ? greenDim : blueDim }}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold mt-0.5" style={{ color }}>{value}</p>
    </div>
  </div>
);

/**
 * KG learning progress for the LMS dashboard.
 * Everything comes from the backend: lesson list + the child's saved progress
 * (the same data that is written when a lesson is completed in the KG module).
 */
export function KgProgressPanel({ userId }: { userId: number }) {
  const navigate = useNavigate();
  const [data, setData] = useState<{ lessons: LessonCard[]; rows: ProgressRow[] } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setData(null);
    setError('');
    (async () => {
      try {
        const ids = await resolveIds();
        const [lessons, rows] = await Promise.all([
          getClassLessons(ids.classId),
          getProgress(userId, ids.classId).catch(() => [] as ProgressRow[]), // new child = no progress yet
        ]);
        if (alive) setData({ lessons: [...lessons].sort((a, b) => a.order - b.order), rows });
      } catch {
        if (alive) setError('Could not load KG progress. Please refresh.');
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  if (error) {
    return (
      <div
        className="px-4 py-3 rounded-xl text-sm"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}
      >
        ⚠ {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 rounded-2xl bg-white/10" />
        <div className="h-48 rounded-2xl bg-white/10" />
      </div>
    );
  }

  const byslug = new Map(data.rows.map((r) => [r.slug, r]));
  // Only lessons the child has really finished are ever shown.
  const completed = data.lessons.filter((l) => byslug.get(l.slug)?.completed);
  const stars = completed.reduce((sum, l) => sum + (byslug.get(l.slug)?.stars ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Completed" value={completed.length} icon="✅" color={blue} />
        <Stat label="Stars" value={stars} icon="⭐" color={amber} />
        <Stat label="Lessons" value={data.lessons.length} icon="📚" color={green} />
      </div>

      {completed.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4">Completed lessons</p>
          <div className="space-y-2">
            {completed.map((l) => {
              const r = byslug.get(l.slug)!;
              return (
                <button
                  key={l.id}
                  onClick={() => navigate(`${KG_BASE_PATH}/lesson/${l.slug}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:opacity-80"
                  style={{ background: greenDim, border: '1px solid rgba(16,185,129,0.28)' }}
                >
                  <span className="text-base">✅</span>
                  <span className="flex-1 min-w-0 text-white text-sm truncate">{l.titleEn}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: amber }}>
                    {r.stars > 0 ? '★'.repeat(Math.min(3, r.stars)) : 'Done'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}