import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Play, Star } from 'lucide-react';
import { useUserDisplayName } from '@/modules/shared/hooks/useUserDisplayName';
import { useChapters, useClassLessons, usePhrases } from '../api/useApi';
import { SubjectKey, subjectOf } from '../api/useDayPlan';
import { RowStatus, useToday } from '../api/useToday';
import { useDayView } from '../api/useDayView';
import { RetryDayButton, TodayActions } from '../components/TodayActions';
import { useIsSpeaking } from '../audio/useSpeaking';
import { KG_BASE_PATH, KG_SUBJECT_IMAGES, KG_TEACHER_IMAGE } from '../config';
import { readSession, useKg, writeSession } from '../context/KgContext';
import { useTeacher } from '../teacher/TeacherContext';
import { LanguageCode } from '../types';

const UI_KEY = 'zaheen.kg.ui';
const CARD_ORDER: SubjectKey[] = ['english', 'urdu', 'math'];
const CARD_NAME: Record<SubjectKey, { en: string; ur: string }> = {
  english: { en: 'English', ur: 'انگریزی' },
  urdu: { en: 'Urdu', ur: 'اردو' },
  math: { en: 'Mathematics', ur: 'ریاضی' },
};
const STATUS_LABEL: Record<RowStatus, { en: string; ur: string }> = {
  done: { en: 'Done', ur: 'مکمل' },
  current: { en: 'Up Next', ur: 'اب' },
  upcoming: { en: 'Next', ur: 'اگلا' },
  soon: { en: 'Coming soon', ur: 'جلد آ رہا ہے' },
};

export function KgTodayPage() {
  const navigate = useNavigate();
  const displayName = useUserDisplayName() || null;
  const { voice, isDone } = useKg();
  const { sayLocalized } = useTeacher();
  const speaking = useIsSpeaking();

  const phrases = usePhrases();
  const startLesson = phrases.data?.get('start_lesson');
  const chapters = useChapters();
  const lessons = useClassLessons();
  const base = useToday();
  const dv = useDayView(base.today);
  const view = dv.view;
  const loading = base.loading || dv.loading;
  const error = base.error || dv.error;
  const retry = () => {
    base.retry();
    dv.retry();
  };
  // Day, rows and the Start button follow the child's own progress through the API's lessons.
  const today = base.today && view ? { ...base.today, day: view.day, rows: view.rows, startSlug: view.startSlug } : base.today;
  const [lang, setLangState] = useState<LanguageCode>(() => (readSession(UI_KEY) === 'ur' ? 'ur' : 'en'));
  const isUr = lang === 'ur';
  const setLang = (l: LanguageCode) => {
    setLangState(l);
    writeSession(UI_KEY, l);
  };

  // Auto-play Voice on page load
  useEffect(() => {
    if (startLesson && voice) {
      // Choti si delay taake page aur assets load ho jayein
      const timer = setTimeout(() => {
        sayLocalized(startLesson.text, startLesson.audio);
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startLesson, voice]); // Jab data load ho ya voice change ho, toh bajao



  return (
    <main className="zkg-page" style={{ display: 'grid', gap: 20 }}>
      {/* ── Header ── */}
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-extrabold text-xl shrink-0"
            style={{ background: '#EBF7FD', border: '2px solid #57BCEB', color: '#0284C7' }}
            aria-hidden="true"
          >
            {(displayName ?? 'K').trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight">
              {displayName ? (isUr ? `ہیلو، ${displayName}!` : `Hello, ${displayName}!`) : isUr ? 'ہیلو!' : 'Hello!'}
            </h1>
            {today && (
              <p className="text-sm font-semibold text-slate-500">
                {isUr
                  ? `${today.total} میں سے ${today.completed} سبق مکمل · ${today.stars} ستارے`
                  : `${today.completed} of ${today.total} lessons completed · ${today.stars} stars earned`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {today && (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-slate-900" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <Star size={18} className="fill-current" style={{ color: '#F59E0B' }} aria-hidden="true" /> {today.stars}
            </span>
          )}
          <div className="zkg-seg" role="radiogroup" aria-label="Language">
            <button type="button" role="radio" aria-checked={!isUr} className={`zkg-seg-btn${!isUr ? ' is-active' : ''}`} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" role="radio" aria-checked={isUr} className={`zkg-seg-btn zkg-ur${isUr ? ' is-active' : ''}`} onClick={() => setLang('ur')}>
              اردو
            </button>
          </div>
        </div>
      </header>

      {/* ── Miss Ayesha + Today's class ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-stretch">
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
          <div className={'zkg-dock-stage' + (speaking ? ' is-speaking' : '')} style={{ aspectRatio: '1 / 1.05' }}>
            <img className="zkg-dock-img" src={KG_TEACHER_IMAGE} alt="Miss Ayesha" width={560} height={617} />
          </div>
          <p className="mt-3 text-center font-extrabold text-slate-900">
            Miss Ayesha <span className="font-semibold text-slate-500">· KG Teacher</span>
          </p>
        </section>

        <section className="rounded-3xl border-2 shadow-lg overflow-hidden flex flex-col bg-white" style={{ borderColor: '#BAE6FD' }}>
          {loading && <div className="zkg-skeleton zkg-skeleton-tall m-8" aria-busy="true" />}

          {error && !today && (
            <p className="zkg-error m-8">
              We could not load today&apos;s class.
              <button type="button" className="zkg-retry" onClick={retry}>
                Try again
              </button>
            </p>
          )}

          {today && (
            <>
              <div
                className="px-8 py-7 flex items-center justify-between gap-4 flex-wrap"
                style={{ background: 'linear-gradient(135deg,#0284C7 0%,#57BCEB 100%)', color: '#fff' }}
              >
                <div>
                  <p className="text-sm font-extrabold tracking-widest uppercase" style={{ opacity: 0.9 }}>
                    {isUr ? 'آج کی کلاس' : "Today's class"}
                  </p>
                  <h2 className="text-4xl font-extrabold leading-tight">{isUr ? 'دن ' + today.day : 'Day ' + today.day}</h2>
                </div>
                <span className="rounded-full px-5 py-2 text-sm font-extrabold" style={{ background: 'rgba(255,255,255,.22)' }}>
                  {today.rows.length} {isUr ? 'اسباق' : 'lessons'}
                </span>
              </div>

              <div className="p-8 flex flex-col flex-1">
                {view && view.completedDays.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {view.completedDays.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold"
                        style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC' }}
                      >
                        <Check size={14} aria-hidden="true" /> {isUr ? 'دن ' + d + ' مکمل' : 'Day ' + d + ' Completed'}
                      </span>
                    ))}
                  </div>
                )}

                <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
                  {today.rows.map((r, i) => (
                    <li
                      key={r.key}
                      className="flex items-center gap-4 rounded-2xl border-2 px-5 py-4"
                      style={{
                        background: r.status === 'current' ? '#EBF7FD' : '#F8FAFC',
                        borderColor: r.status === 'current' ? '#57BCEB' : '#E2E8F0',
                      }}
                    >
                      <span
                        className="w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-lg shrink-0"
                        style={{
                          background: r.status === 'done' ? '#22C55E' : r.status === 'current' ? '#0284C7' : '#E2E8F0',
                          color: r.status === 'done' || r.status === 'current' ? '#fff' : '#64748B',
                        }}
                      >
                        {r.status === 'done' ? <Check size={22} aria-hidden="true" /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-lg font-bold text-slate-900">
                        {r.subject}
                        {r.title ? ': ' + r.title : ''}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-4 py-1.5 text-xs font-extrabold"
                        style={{
                          background: r.status === 'done' ? '#DCFCE7' : r.status === 'current' ? '#DBEAFE' : '#F1F5F9',
                          color: r.status === 'done' ? '#15803D' : r.status === 'current' ? '#0369A1' : '#64748B',
                        }}
                      >
                        {isUr ? STATUS_LABEL[r.status].ur : STATUS_LABEL[r.status].en}
                      </span>
                    </li>
                  ))}
                </ol>

                <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', alignItems: 'stretch', gap: 12, flexWrap: 'wrap' }}>
                  {view && view.prev && today.startSlug && (
                    <RetryDayButton day={view.prev.day} lessons={view.prev.lessons} isUr={isUr} />
                  )}
                  <style>{`
                    @keyframes zkgBounce { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-8px) scale(1.03); } }
                    @keyframes zkgRing { 0% { box-shadow: 0 0 0 0 rgba(245,158,11,.6); } 70% { box-shadow: 0 0 0 24px rgba(245,158,11,0); } 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); } }
                    @keyframes zkgShine { 0% { left: -60%; } 60%, 100% { left: 130%; } }
                    @keyframes zkgWiggle { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-14deg) scale(1.2); } 40% { transform: rotate(12deg) scale(1.2); } 60% { transform: rotate(-8deg); } 80% { transform: rotate(6deg); } }
                    .zkg-start-wiggle { position: relative; overflow: hidden; animation: zkgBounce 1.6s ease-in-out infinite, zkgRing 1.6s ease-out infinite; }
                    .zkg-start-wiggle::after { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent); transform: skewX(-20deg); animation: zkgShine 2.4s ease-in-out infinite; pointer-events: none; }
                    .zkg-start-wiggle:hover { animation-play-state: paused; transform: scale(1.05); }
                    .zkg-start-icon { animation: zkgWiggle 1.6s ease-in-out infinite; }
                    @media (prefers-reduced-motion: reduce) { .zkg-start-wiggle, .zkg-start-wiggle::after, .zkg-start-icon { animation: none; } }
                  `}</style>
                  {today.startSlug ? (
                    <button
                      type="button"
                      className="zkg-btn zkg-btn-sun zkg-btn-lg zkg-start-wiggle"
                      style={{ flex: '1 1 260px' }}
                      onClick={() => navigate(KG_BASE_PATH + '/lesson/' + today.startSlug, { state: { dayFlow: true } })}
                    >
                      <Play size={22} aria-hidden="true" className="zkg-start-icon" /> {isUr ? 'دن ' + today.day + ' سیکھنا شروع کریں' : 'Start Learning Day ' + today.day}
                    </button>
                  ) : (
                    <TodayActions view={view} isUr={isUr} />
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ── Subjects ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-extrabold text-slate-900">{isUr ? 'اپنے مضامین دیکھیں' : 'Explore Your Subjects'}</h2>
          <Link to={KG_BASE_PATH} className="zkg-back">
            <ArrowLeft size={16} aria-hidden="true" /> KG home
          </Link>
        </div>

        {chapters.error && (
          <p className="zkg-error">
            We could not load the subjects.
            <button type="button" className="zkg-retry" onClick={chapters.retry}>
              Try again
            </button>
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CARD_ORDER.map((k) => {
            const chapter = (chapters.data ?? []).find((c) => subjectOf(c) === k);
            if (!chapter) return null;
            const mine = (lessons.data ?? []).filter((l) => l.chapterId === chapter.id);
            const done = mine.filter((l) => isDone(l.slug)).length;
            return (
              <Link
                key={k}
                to={`${KG_BASE_PATH}/chapter/${chapter.id}`}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <img src={KG_SUBJECT_IMAGES[k]} alt="" className="w-full object-cover" style={{ height: 190, background: '#EFF6FF' }} />
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-2xl font-extrabold text-slate-900">{isUr ? CARD_NAME[k].ur : CARD_NAME[k].en}</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {done}/{mine.length} {isUr ? 'مکمل' : 'done'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {(isUr ? chapter.descriptionUr : undefined) || chapter.descriptionEn || 'Coming soon'}
                  </p>
                  <span className="mt-auto pt-3 flex items-center justify-between font-bold text-slate-900" style={{ borderTop: '1px solid #E2E8F0' }}>
                    {isUr ? 'تمام اسباق دیکھیں' : 'Open Learning Path'} <ArrowRight size={18} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}