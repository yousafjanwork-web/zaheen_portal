import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '@/modules/shared/context/AuthContext';
import { completeLesson } from '../api/progress';
import { Activity, LessonDetail, Question, Video } from '../api/types';
import { useClassLessons, useLesson, usePhrases } from '../api/useApi';
import { localize } from '../api/client';
import { KG_BASE_PATH } from '../config';
import { readSession, useKg, writeSession } from '../context/KgContext';
import { speak, stopVoice } from '../audio/voice';
import { useVideoProgress } from '@/modules/shared/hooks/useVideoProgress';
import { useAutoAdvance } from '../audio/useAutoAdvance';
import { useDays } from '../api/useDays';
import { sortDayEntries } from '../api/useDayView';
import { useToday } from '../api/useToday';
import { useTeacher } from '../teacher/TeacherContext';
import { Avatar } from '../teacher/Avatar';
import { LanguageCode } from '../types';
import { ActivityEngine } from '../activities/ActivityEngine';
import { QuestionView } from '../components/QuestionView';

const UI_KEY = 'zaheen.kg.ui';

/* ---------- what this screen can draw (and only if the API sent what it needs) ---------- */

const OPTION_BASED = new Set(['picture_match', 'listen_select', 'multiple_choice', 'color_recognition', 'shape_recognition']);
const hasList = (v: unknown) => Array.isArray(v) && v.length > 0;

function canRender(a: Activity): boolean {
  const c = a.config || {};
  switch (a.type) {
    case 'letter_tracing':
    case 'number_tracing':
      return typeof c.character === 'string' && c.character.length > 0;
    case 'case_match':
      return !!c.capitalLetter && !!c.smallLetter && hasList(c.distractorCapitals) && hasList(c.distractorSmalls);
    case 'classroom_game':
      return hasList(c.rounds) || hasList(c.cards);
    case 'counting':
      return !!c.count && !!c.correctCount && hasList(c.choices);
    case 'sequence_order':
      return hasList(c.sequence) && hasList(c.shuffled);
    default:
      return OPTION_BASED.has(a.type) && hasList(c.options);
  }
}

const isQuiz = (a: Activity) => a.stage === 'assessment' || a.type === 'quiz';

/* ---------- the lesson as ONE ordered list, exactly as the API sends it ---------- */

type Step =
  | { key: string; kind: 'video'; video: Video }
  | { key: string; kind: 'activity'; activity: Activity }
  | { key: string; kind: 'quiz'; activity: Activity; questions: Question[] };

type QuizStep = Extract<Step, { kind: 'quiz' }>;

function buildSteps(lesson: LessonDetail): Step[] {
  const steps: Step[] = lesson.videos.map((v) => ({ key: `v:${v.id}`, kind: 'video' as const, video: v }));
  lesson.activities.forEach((a, i) => {
    const key = `a:${a.id ?? `i${i}`}`;
    if (isQuiz(a)) {
      if (a.questions.length) steps.push({ key, kind: 'quiz', activity: a, questions: a.questions });
    } else {
      steps.push({ key, kind: 'activity', activity: a });
    }
  });
  return steps;
}

export function LessonPlayPage() {
  const { slug } = useParams();
  const lesson = useLesson(slug);

  if (lesson.loading) {
    return (
      <main className="zkg-page">
        <div className="zkg-skeleton zkg-skeleton-tall" aria-busy="true" />
      </main>
    );
  }
  if (lesson.error || !lesson.data) {
    return (
      <main className="zkg-page">
        <p className="zkg-error">
          We could not load this lesson.
          <button type="button" className="zkg-retry" onClick={lesson.retry}>
            Try again
          </button>
        </p>
        <p style={{ marginTop: 16 }}>
          <Link to={KG_BASE_PATH} className="zkg-back">
            <ArrowLeft size={18} aria-hidden="true" /> KG home
          </Link>
        </p>
      </main>
    );
  }
  return <Runner key={lesson.data.slug} lesson={lesson.data} />;
}

function Runner({ lesson }: { lesson: LessonDetail }) {
  const { voice, finishLesson, stepsOf, markStep, isDone } = useKg();
  const { say, sayLocalized, react, phrasesReady } = useTeacher();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const allLessons = useClassLessons();
  const { days } = useDays();
  const location = useLocation();
  // Set by Start Learning / Retry / Next Day on the Today page: the whole day runs subject after subject.
  const dayFlow = !!(location.state as { dayFlow?: boolean } | null)?.dayFlow;
  const todayBase = useToday();
  const orderKey = todayBase.today ? todayBase.today.rows.map((r) => r.subject).join('|') : '';
  const startedAt = useRef(Date.now());
  const mounted = useRef(true);
  const sent = useRef(false);
  const [posted, setPosted] = useState(false);
  const [apiNext, setApiNext] = useState<string | null>(null);

  const steps = useMemo(() => buildSteps(lesson), [lesson]);
  const saved = stepsOf(lesson.slug);
  const empty = steps.length === 0;

  // Resume: start at the first step that has not been finished yet.
  const [idx, setIdx] = useState(() => {
    const first = steps.findIndex((s) => !(s.key in saved));
    return first === -1 ? 0 : first;
  });
  const [qIdx, setQIdx] = useState(0);
  const [qRight, setQRight] = useState(0);
  const [lang, setLangState] = useState<LanguageCode>(() => (readSession(UI_KEY) === 'ur' ? 'ur' : 'en'));

  // Next lesson = the next one in the API's own order that is not finished yet.
  const list = allLessons.data ?? [];
  const at = list.findIndex((l) => l.slug === lesson.slug);
  const next = at >= 0 ? list.slice(at + 1).find((l) => !isDone(l.slug)) : undefined;
  const nextKnown = !!allLessons.data;

  const step: Step | undefined = steps[idx];
  const done = idx >= steps.length;
  const isUr = lang === 'ur';
  const setLang = (l: LanguageCode) => {
    setLangState(l);
    writeSession(UI_KEY, l);
  };

  /** Saves the step (so a return visit skips it) and moves on. */
  const complete = (key: string, score = 1) => {
    markStep(lesson.slug, key, score);
    setIdx((n) => n + 1);
    setQIdx(0);
    setQRight(0);
  };

  // Is this the last lesson of its day? (Day N = the Nth lesson of each subject.)
  const dayFinished = useMemo(() => {
    const d = days.find((x) => x.entries.some((e) => e.lesson.slug === lesson.slug));
    return !!d && d.entries.every((e) => e.lesson.slug === lesson.slug || isDone(e.lesson.slug));
  }, [days, lesson.slug, isDone]);

  // The next unfinished lesson of THIS day, in the API's subject order (English -> Urdu -> Maths ...).
  const nextInDay = useMemo(() => {
    const d = days.find((x) => x.entries.some((e) => e.lesson.slug === lesson.slug));
    if (!d) return undefined;
    const sorted = sortDayEntries(d.entries, orderKey);
    const at = sorted.findIndex((e) => e.lesson.slug === lesson.slug);
    const pending = sorted.filter((e) => e.lesson.slug !== lesson.slug && !isDone(e.lesson.slug));
    return (pending.find((e) => sorted.indexOf(e) > at) ?? pending[0])?.lesson.slug;
  }, [days, lesson.slug, isDone, orderKey]);
  // A subject finished in the middle of a running day: no completion screen, no completion voice, just go on.
  const chaining = dayFlow && !dayFinished && !!nextInDay;

  // After English / Urdu in a running day: announce what comes next in the voice chosen at the start, then move on.
  const phrases = usePhrases();
  const announce = useMemo(() => {
    if (!chaining) return null;
    const subject = days.flatMap((d) => d.entries).find((e) => e.lesson.slug === lesson.slug)?.subject;
    const key = subject === 'english' ? 'english_lesson_complete' : subject === 'urdu' ? 'urdu_lesson_complete' : null;
    const p = key ? phrases.data?.get(key) : null;
    return p ? localize(p.text, p.audio, voice) : null;
  }, [chaining, days, lesson.slug, phrases.data, voice]);
  const showAnnounce = chaining && done && !empty && !!announce;
  const announced = useRef(false);
  useEffect(() => {
    if (!showAnnounce || !announce || announced.current) return;
    announced.current = true;
    speak({ url: announce.audio ?? undefined, text: announce.text, lang: announce.lang });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnnounce, announce]);
  useAutoAdvance(
    showAnnounce && posted,
    () => {
      if (nextInDay) navigate(`${KG_BASE_PATH}/lesson/${nextInDay}`, { replace: true, state: { dayFlow: true } });
    },
    3000,
    9000,
  );

  const quizSteps = steps.filter((s): s is QuizStep => s.kind === 'quiz');
  const total = quizSteps.reduce((n, s) => n + s.questions.length, 0);
  const firstTry = quizSteps.reduce((n, s) => n + (saved[s.key] ?? 0), 0);
  const ratio = total ? firstTry / total : 1;
  const stars = total === 0 ? 3 : 1 + (ratio >= 0.5 ? 1 : 0) + (ratio >= 0.8 ? 1 : 0);

  useEffect(() => {
    if (empty) return;
    if (!step) {
      // The custom completion voice plays once: at the end of the whole day (never between subjects).
      if (!chaining) react('lesson_complete');
    }
    else if (step.kind === 'video') {
      if (idx === 0) sayLocalized(lesson.intro.text, lesson.intro.audio);
      else stopVoice();
    } else if (step.kind === 'activity') sayLocalized(step.activity.instructions, undefined);
    else {
      const q = step.questions[qIdx];
      if (q) say({ text: q.prompt, lang: 'en' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, qIdx, voice, phrasesReady]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Lesson finished: tell the server (logged-in child) or remember it in this browser (guest).
  useEffect(() => {
    if (!done || empty || sent.current) return;
    sent.current = true;
    if (!userId) {
      finishLesson(lesson.slug, stars);
      setPosted(true);
      return;
    }
    completeLesson(userId, lesson.id, {
      correct_answers: firstTry,
      total_questions: total,
      duration_seconds: Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)),
    })
      .then((r) => {
        finishLesson(lesson.slug, r.stars || stars);
        if (mounted.current) setApiNext(r.nextSlug);
      })
      .catch(() => finishLesson(lesson.slug, stars))
      .finally(() => {
        if (mounted.current) setPosted(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, empty]);

  // Next lesson: the server's recommendation first, otherwise the next one in the API's own order.
  const targetSlug = apiNext && apiNext !== lesson.slug ? apiNext : next?.slug;
  const targetKnown = !!apiNext || nextKnown;

  // Lesson finished -> go straight to the next lesson.
  useEffect(() => {
    // The child decides what comes next on the Today page: never jump to the next lesson by itself.
    void [targetSlug, targetKnown];
  }, [done, empty, posted, targetSlug, navigate]);

  // Subject finished while the day is still running: move straight on to the next subject.
  useEffect(() => {
    if (!chaining || !done || empty || !posted || !nextInDay || announce) return;
    navigate(`${KG_BASE_PATH}/lesson/${nextInDay}`, { replace: true, state: { dayFlow: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaining, done, empty, posted, nextInDay, announce]);

  // Lesson (or day) finished: let Miss Ayesha finish speaking, then go back to Today's class. Nothing starts by itself.
  useAutoAdvance(
    done && !empty && posted && !chaining,
    () => navigate(`${KG_BASE_PATH}/today`, { replace: true }),
    2500,
    20000,
  );

  const nextKind = steps[idx + 1]?.kind;
  const activityOnly = steps.filter((s) => s.kind === 'activity');

  return (
    <main className="zkg-page zkg-lesson-wide">
      <header className="zkg-play-top">
        <Link to={KG_BASE_PATH} className="zkg-back">
          <ArrowLeft size={18} aria-hidden="true" /> KG home
        </Link>
        <div className="zkg-lesson-title">
          <strong>{lesson.titleEn}</strong>
          {lesson.titleUr && (
            <span className="zkg-ur" dir="rtl">
              {lesson.titleUr}
            </span>
          )}
        </div>
        <div className="zkg-seg" role="radiogroup" aria-label="Lesson language">
          <button
            type="button"
            role="radio"
            aria-checked={!isUr}
            className={`zkg-seg-btn${!isUr ? ' is-active' : ''}`}
            onClick={() => setLang('en')}
          >
            English
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={isUr}
            className={`zkg-seg-btn zkg-ur${isUr ? ' is-active' : ''}`}
            onClick={() => setLang('ur')}
          >
            اردو
          </button>
        </div>
        <ol className="zkg-dots zkg-play-dots" aria-label={`Step ${Math.min(idx + 1, steps.length)} of ${steps.length}`}>
          {steps.map((s, n) => (
            <li key={s.key} className={n < idx ? 'is-done' : n === idx ? 'is-now' : ''} />
          ))}
        </ol>
      </header>

      <section className="zkg-card zkg-play">
        <div className="zkg-play-body" key={`${idx}-${qIdx}`}>
          {empty && (
            <div className="zkg-center">
              <p className="zkg-note-box">Coming soon</p>
            </div>
          )}

          {step && step.kind === 'video' && (
            <div className="zkg-center">
              <LessonVideo
                key={step.video.id}
                videoId={step.video.id}
                url={step.video.url}
                poster={step.video.thumbnail}
                title={isUr ? step.video.titleUr || step.video.titleEn : step.video.titleEn}
                onEnded={() => complete(step.key)}
              />
              <button type="button" className="zkg-btn zkg-btn-primary zkg-btn-lg" onClick={() => complete(step.key)}>
                {nextKind === 'video'
                  ? isUr ? 'اگلی ویڈیو' : 'Next video'
                  : nextKind
                    ? isUr ? 'سرگرمیاں شروع کریں' : 'Start activities'
                    : isUr ? 'ختم کریں' : 'Finish'}{' '}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}

          {step && step.kind === 'activity' && (
            <ActivityStep
              key={step.key}
              activity={step.activity}
              index={activityOnly.indexOf(step)}
              count={activityOnly.length}
              language={lang}
              last={idx + 1 >= steps.length}
              onNext={(completed) => complete(step.key, completed ? 1 : 0)}
            />
          )}

          {step && step.kind === 'quiz' && (
            <div className="zkg-center">
              <p className="zkg-count-label">
                {isUr ? 'سوال' : 'Question'} {qIdx + 1} / {step.questions.length}
              </p>
              <QuestionView
                key={`${step.key}-${qIdx}`}
                question={step.questions[qIdx]}
                language={lang}
                last={qIdx + 1 >= step.questions.length}
                onCorrect={() => react('correct_answer')}
                onWrong={() => react('try_again')}
                onDone={(ok) => {
                  const right = qRight + (ok ? 1 : 0);
                  if (qIdx + 1 < step.questions.length) {
                    setQRight(right);
                    setQIdx(qIdx + 1);
                  } else {
                    complete(step.key, right);
                  }
                }}
              />
            </div>
          )}

          {done && !empty && chaining && <div className="zkg-skeleton zkg-skeleton-tall" aria-busy="true" />}

          {done && !empty && !chaining && (
            <div className="zkg-center zkg-finish">
              <div className="zkg-trophy" aria-hidden="true">
                🎉
              </div>
              <h2 className="zkg-h2">
                {isUr ? 'سبق مکمل!' : 'Lesson complete!'}
              </h2>
              <div className="zkg-finish-stars" role="img" aria-label={`${stars} of 3 stars`}>
                {[1, 2, 3].map((n) => (
                  <Star key={n} size={44} className={n <= stars ? 'is-on' : ''} aria-hidden="true" />
                ))}
              </div>
              {total > 0 && (
                <p className="zkg-muted">
                  {firstTry} of {total} questions right on the first try
                </p>
              )}
              <div className="zkg-actions">
                <Link to={`${KG_BASE_PATH}/today`} className="zkg-btn zkg-btn-primary zkg-btn-lg">
                  <ArrowLeft size={18} aria-hidden="true" /> Today&apos;s class
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {showAnnounce && announce && (
        <div className="zkg-backdrop" role="dialog" aria-modal="true" aria-live="polite">
          <div
            style={{
              background: '#fff',
              borderRadius: 28,
              padding: '28px 32px',
              maxWidth: 520,
              width: '100%',
              textAlign: 'center',
              boxShadow: 'var(--zkg-shadow)',
            }}
          >
            <div style={{ width: 170, margin: '0 auto 16px' }}>
              <Avatar />
            </div>
            <p
              className={announce.lang === 'en' ? '' : 'zkg-ur'}
              dir={announce.lang === 'en' ? 'ltr' : 'rtl'}
              style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.7, color: 'var(--zkg-ink)' }}
            >
              {announce.text}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function LessonVideo({
  url, poster, title, onEnded, videoId,
}: {
  url: string;
  poster?: string | null;
  title?: string;
  videoId: number;
  /** Called 1 second after the video finishes. */
  onEnded?: () => void;
}) {
  const timer = useRef(0);
  const { isLoggedIn } = useAuth();
  const vp = useVideoProgress([videoId], isLoggedIn);
  const viewed = useRef(false);
  const resumed = useRef(false);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const goOn = (ms: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onEnded?.(), ms);
  };
  const [failed, setFailed] = useState(false);
  if (failed) return <p className="zkg-error">The video could not be loaded right now. You can continue.</p>;
  return (
    <figure className="zkg-video-wrap">
      <video
        className="zkg-video"
        src={url}
        poster={poster ?? undefined}
        controls
        playsInline
        preload="metadata"
        onPlay={() => {
          window.clearTimeout(timer.current);
          if (!viewed.current) {
            viewed.current = true;
            vp.handleView(videoId);
          }
        }}
        onLoadedMetadata={(e) => {
          if (resumed.current) return;
          resumed.current = true;
          const el = e.currentTarget;
          vp.fetchJourneyForVideo(videoId).then((pos) => {
            // Continue where the child stopped (but restart if it was almost finished).
            if (pos > 5 && el.duration && pos < el.duration - 10) el.currentTime = pos;
          });
        }}
        onTimeUpdate={(e) =>
          vp.handleTimeUpdate(videoId, e.currentTarget.currentTime, e.currentTarget.duration)
        }
        onEnded={(e) => {
          vp.handleEnded(videoId, e.currentTarget.duration);
          goOn(1000);
        }}
        onError={() => {
          setFailed(true);
          goOn(2500);
        }}
        aria-label={title}
      />
      {title && <figcaption>{title}</figcaption>}
    </figure>
  );
}

function ActivityStep({
  activity, index, count, language, last, onNext,
}: {
  activity: Activity;
  index: number;
  count: number;
  language: LanguageCode;
  last: boolean;
  /** true = the child finished it, false = skipped or not available */
  onNext: (completed: boolean) => void;
}) {
  const { react } = useTeacher();
  const [done, setDone] = useState(false);
  const reacted = useRef(false);
  const isUr = language === 'ur';
  const supported = canRender(activity);
  const title = isUr ? activity.titleUr || activity.titleEn : activity.titleEn;

  // Little children: move to the next activity by itself once this one is done.
  useAutoAdvance(done, () => onNext(true), 1800);

  return (
    <div className="zkg-act">
      <div className="zkg-act-head">
        <h2 className={`zkg-act-title${isUr ? ' zkg-ur' : ''}`} dir={isUr ? 'rtl' : 'ltr'}>
          {title}
        </h2>
        <span className="zkg-count-label">
          {isUr ? 'سرگرمی' : 'Activity'} {index + 1} / {count}
        </span>
      </div>

      {supported ? (
        <ActivityEngine
          activity={activity}
          language={language}
          onAttempt={({ isCorrect }) => {
            if (isCorrect) {
              reacted.current = true;
              react('correct_answer');
            } else {
              react('try_again');
            }
          }}
          onComplete={() => {
            setDone(true);
            if (!reacted.current) {
              reacted.current = true;
              react('correct_answer');
            }
          }}
        />
      ) : (
        <p className="zkg-note-box">Coming soon</p>
      )}

      <div className="zkg-actions">
        {done || !supported ? (
          <button type="button" className="zkg-btn zkg-btn-primary zkg-btn-lg" onClick={() => onNext(done)}>
            {last ? 'Finish' : 'Next'} <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="zkg-skip" onClick={() => onNext(false)}>
            Skip this activity
          </button>
        )}
      </div>
    </div>
  );
}
