import { useState } from 'react';
import { ArrowLeft, Check, Clock, Lock, Play, RotateCcw, Star } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useChapterLessons, useChapters } from '../api/useApi';
import { subjectOf } from '../api/useDayPlan';
import { KG_BASE_PATH } from '../config';
import { readSession, useKg } from '../context/KgContext';
import { LanguageCode } from '../types';

const UI_KEY = 'zaheen.kg.ui';

/** All the lessons of one subject (chapter), straight from the API, in its order. */
export function ChapterPage() {
  const { chapterId } = useParams();
  const id = chapterId && /^\d+$/.test(chapterId) ? Number(chapterId) : null;
  const chapters = useChapters();
  const lessons = useChapterLessons(id);
  const { isDone, starsFor } = useKg();
  const [lang] = useState<LanguageCode>(() => (readSession(UI_KEY) === 'ur' ? 'ur' : 'en'));
  const isUr = lang === 'ur';

  if (id === null) return <Navigate to={KG_BASE_PATH} replace />;

  const chapter = chapters.data?.find((c) => c.id === id);
  const list = lessons.data ?? [];
  const firstPending = list.find((l) => !isDone(l.slug));

  return (
    <main className="zkg-page" style={{ display: 'grid', gap: 16 }}>
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <Link to={`${KG_BASE_PATH}/today`} className="zkg-back">
            <ArrowLeft size={16} aria-hidden="true" /> {isUr ? 'مضامین پر واپس' : 'Back to Subjects'}
          </Link>
          <h1 className="zkg-h1" style={{ marginTop: 8 }}>
            {(isUr ? chapter?.nameUr : undefined) || chapter?.nameEn || 'Lessons'}
          </h1>
        </div>

        {chapters.data && chapters.data.length > 1 && (
          <div className="zkg-seg" role="tablist" aria-label="Subjects">
            {chapters.data.map((c) => {
              const k = subjectOf(c);
              const label = k === 'english' ? 'English' : k === 'urdu' ? 'Urdu' : k === 'math' ? 'Math' : c.nameEn;
              return (
                <Link key={c.id} to={`${KG_BASE_PATH}/chapter/${c.id}`} role="tab" aria-selected={c.id === id} className={`zkg-seg-btn${c.id === id ? ' is-active' : ''}`}>
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {lessons.loading && <div className="zkg-skeleton zkg-skeleton-tall" aria-busy="true" />}

      {lessons.error && (
        <p className="zkg-error">
          We could not load the lessons.
          <button type="button" className="zkg-retry" onClick={lessons.retry}>
            Try again
          </button>
        </p>
      )}

      {lessons.data && list.length === 0 && <p className="zkg-note-box">Coming soon</p>}

      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {list.map((l, i) => {
          const finished = isDone(l.slug);
          const ready = !finished && firstPending?.slug === l.slug;
          const stars = starsFor(l.slug);
          return (
            <li key={l.slug}>
              <Link
                to={`${KG_BASE_PATH}/lesson/${l.slug}`}
                className="flex items-center gap-4 rounded-2xl border px-4 py-3"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  background: finished ? '#EAF9F1' : '#fff',
                  borderColor: finished ? '#60C994' : ready ? '#57BCEB' : '#E2E8F0',
                  borderWidth: ready || finished ? 2 : 1,
                }}
              >
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0"
                  style={{ background: finished ? '#60C994' : ready ? '#57BCEB' : '#EEF2F7', color: finished || ready ? '#fff' : '#475569' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <small className="text-slate-500 font-semibold flex items-center gap-1">
                    {isUr ? 'سبق' : 'Lesson'} {i + 1}
                    {l.minutes && (
                      <>
                        {' · '}
                        <Clock size={12} aria-hidden="true" /> {l.minutes} {isUr ? 'منٹ' : 'min'}
                      </>
                    )}
                  </small>
                  <strong className="block text-slate-900">{(isUr ? l.titleUr : undefined) || l.titleEn}</strong>
                  <small className="font-semibold" style={{ color: finished ? '#059669' : '#0284C7' }}>
                    {finished ? (
                      <span className="inline-flex items-center gap-1">
                        <Check size={12} aria-hidden="true" /> {isUr ? 'مکمل' : 'Completed'}
                        {stars > 0 && (
                          <>
                            {' · '}
                            <Star size={12} className="fill-current" aria-hidden="true" /> {stars}
                          </>
                        )}
                      </span>
                    ) : ready ? (
                      isUr ? 'کھیلنے کے لیے تیار' : 'Ready to play'
                    ) : (
                      isUr ? 'آنے والا (دیکھنے کے لیے دبائیں)' : 'Upcoming (tap to preview)'
                    )}
                  </small>
                </span>
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shrink-0"
                  style={{ background: ready ? '#FFD45C' : '#F1F5F9', color: '#0F172A' }}
                >
                  {finished ? (
                    <>
                      <RotateCcw size={14} aria-hidden="true" /> {isUr ? 'دوبارہ دیکھیں' : 'Revisit Lesson'}
                    </>
                  ) : ready ? (
                    <>
                      <Play size={14} className="fill-current" aria-hidden="true" /> {isUr ? 'سبق شروع کریں' : 'Start Lesson'}
                    </>
                  ) : (
                    <>
                      <Lock size={14} aria-hidden="true" /> {isUr ? 'سبق آزمائیں' : 'Try Lesson'}
                    </>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
