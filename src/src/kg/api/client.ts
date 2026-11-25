/* eslint-disable @typescript-eslint/no-explicit-any */
import { KG_API_BASE, KG_FALLBACK_BOARD_ID, KG_FALLBACK_CLASS_ID } from '../config';
import { VoiceLang } from '../types';
import {
  Activity, Chapter, Ids, Lang4, LessonCard, LessonDetail, Localization, Localized, Phrase, Question, Video, Welcome,
} from './types';

const cache = new Map<string, Promise<unknown>>();

function request<T>(path: string): Promise<T> {
  const hit = cache.get(path);
  if (hit) return hit as Promise<T>;
  const job = (async () => {
    const res = await fetch(`${KG_API_BASE}${path}`, { headers: { Accept: 'application/json' } });
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
  })();
  cache.set(path, job);
  job.catch(() => cache.delete(path));
  return job;
}

const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : undefined);
const num = (v: unknown, fallback = 0): number => (typeof v === 'number' && isFinite(v) ? v : Number(v) || fallback);
const list = (v: unknown): any[] => (Array.isArray(v) ? v : []);

function loc(o: any, prefix?: string): Localized {
  const pick = (l: Lang4) => str(prefix ? o?.[`${prefix}_${l}`] : o?.[l]) ?? null;
  return { en: pick('en'), ur: pick('ur'), pa: pick('pa'), ps: pick('ps') };
}

const CODE_TO_LANG: Record<string, Lang4> = { en: 'en', 'ur-PK': 'ur', 'pa-Arab-PK': 'pa', 'ps-PK': 'ps' };
const CHAIN: Record<VoiceLang, Lang4[]> = { ur: ['ur', 'en'], pa: ['pa', 'ur', 'en'], ps: ['ps', 'ur', 'en'] };

/** Picks the text (and the audio of the SAME language) for the voice the child chose. */
export function localize(text: Localized | undefined, audio: Localized | undefined, voice: VoiceLang): Localization | null {
  for (const l of CHAIN[voice]) {
    const t = text?.[l];
    if (t && t.trim() && t.trim() !== '...') return { text: t, audio: audio?.[l] || null, lang: l };
  }
  return null;
}

const memo = new Map<string, Promise<unknown>>();
function cached<T>(key: string, make: () => Promise<T>): Promise<T> {
  const hit = memo.get(key);
  if (hit) return hit as Promise<T>;
  const job = make();
  memo.set(key, job);
  job.catch(() => memo.delete(key));
  return job;
}

export function resolveIds(): Promise<Ids> {
  return cached('ids', async () => {
    const [boards, classes] = await Promise.all([
      request<any[]>('/api/boards').catch(() => [] as any[]),
      request<any[]>('/api/classes').catch(() => [] as any[]),
    ]);
    const board = list(boards).find((b) => /punjab|^pb$/i.test(`${b.fullname ?? ''} ${b.name ?? ''}`)) ?? list(boards)[0];
    const kg = list(classes).find((c) => /kindergarten|^kg$/i.test(String(c.name ?? ''))) ?? null;
    return {
      boardId: num(board?.id, KG_FALLBACK_BOARD_ID),
      classId: num(kg?.id, KG_FALLBACK_CLASS_ID),
      className: str(kg?.name) ?? 'Kindergarten',
      classNameUr: str(kg?.urdu_name),
    };
  });
}

export async function getWelcome(classId: number): Promise<Welcome> {
  const data = await request<any>(`/api/classes/${classId}/welcome`);
  const text: Localized = {};
  const audio: Localized = {};
  for (const l of list(data?.localizations)) {
    const lang = CODE_TO_LANG[String(l.language_code)];
    if (!lang || l.is_active === false) continue;
    text[lang] = str(l.welcome_text) ?? null;
    audio[lang] = str(l.voiceover_url) ?? null;
  }
  return { text, audio };
}

export async function getChapters(classId: number): Promise<Chapter[]> {
  const data = await request<any>(`/api/classes/${classId}/chapters`);
  return list(data?.chapters)
    .filter((c) => c.status !== false)
    .map((c) => ({
      id: num(c.id),
      nameEn: str(c.name_en) ?? 'Chapter',
      nameUr: str(c.name_ur),
      descriptionEn: str(c.description_en),
      descriptionUr: str(c.description_ur),
      thumbnail: str(c.thumbnail) ?? null,
    }));
}

function toCard(l: any): LessonCard {
  return {
    id: num(l.id),
    slug: String(l.slug),
    titleEn: str(l.title_en) ?? 'Lesson',
    titleUr: str(l.title_ur),
    descriptionEn: str(l.description_en),
    minutes: l.estimated_minutes ? num(l.estimated_minutes) : undefined,
    order: num(l.learning_order, 9999),
    chapterId: l.chapter?.id !== undefined ? num(l.chapter.id) : undefined,
  };
}

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getClassLessons(classId: number): Promise<LessonCard[]> {
  const data = await request<any>(`/api/classes/${classId}/lessons`);
  return list(data?.lessons).filter((l) => l.slug).map(toCard).sort(byOrder);
}

export async function getChapterLessons(classId: number, chapterId: number): Promise<LessonCard[]> {
  const data = await request<any>(`/api/classes/${classId}/chapters/${chapterId}/lessons`);
  return list(data?.lessons).filter((l) => l.slug).map(toCard).sort(byOrder);
}

function toQuestion(q: any): Question {
  return {
    id: num(q.id),
    type: str(q.type),
    prompt: str(q.prompt) ?? str(q.prompt_en) ?? '',
    explanationEn: str(q.explanation_en),
    explanationUr: str(q.explanation_ur),
    options: list(q.options).map((o) => ({
      id: num(o.id),
      text: str(o.option_text) ?? str(o.text) ?? str(o.label_en) ?? '',
      correct: o.is_correct === true || o.is_correct === 1,
    })),
  };
}

function toActivity(a: any): Activity {
  return {
    id: a.id !== undefined ? num(a.id) : undefined,
    stage: str(a.stage),
    type: String(a.activity_type ?? ''),
    titleEn: str(a.title_en),
    titleUr: str(a.title_ur),
    instructionsEn: str(a.instructions_en),
    instructionsUr: str(a.instructions_ur),
    titles: loc(a, 'title'),
    instructions: loc(a, 'instructions'),
    config: a.config && typeof a.config === 'object' ? a.config : {},
    order: num(a.sort_order, 9999),
    questions: list(a.questions).map(toQuestion),
    passPercent: num(a.pass_score_percent, 60),
  };
}

export async function getLesson(boardId: number, classId: number, slug: string): Promise<LessonDetail> {
  const d = await request<any>(`/api/boards/${boardId}/classes/${classId}/lessons/${encodeURIComponent(slug)}`);
  const det = d?.details ?? {};
  const concept = det.concept ?? {};
  const videos: Video[] = list(d?.videos)
    .filter((v) => str(v.video_url))
    .map((v) => ({
      id: num(v.id),
      order: num(v.sort_order, 1),
      role: str(v.video_role),
      titleEn: str(v.title_en),
      titleUr: str(v.title_ur),
      url: String(v.video_url),
      thumbnail: str(v.thumbnail_url) ?? null,
      seconds: v.duration_seconds ? num(v.duration_seconds) : undefined,
    }))
    .sort(byOrder);
  return {
    id: num(d?.id),
    slug: String(d?.slug ?? slug),
    titleEn: str(d?.title_en) ?? 'Lesson',
    titleUr: str(d?.title_ur),
    minutes: d?.estimated_minutes ? num(d.estimated_minutes) : undefined,
    chapter: d?.chapter
      ? { id: num(d.chapter.id), nameEn: str(d.chapter.name_en) ?? '', nameUr: str(d.chapter.name_ur) }
      : undefined,
    intro: { text: loc(det.teacher_intro), audio: loc(det.teacher_intro_audio) },
    concept: {
      symbol: str(concept.symbol),
      wordEn: str(concept.word_en),
      wordUr: str(concept.word_ur),
      phonetic: str(concept.phonetic_sound),
      imageUrl: str(concept.image_url) ?? null,
    },
    explanation: { text: loc(det.teacher_explanation), audio: loc(det.teacher_explanation_audio) },
    videos,
    activities: list(d?.activities).map(toActivity).sort(byOrder),
  };
}

export async function getPhrases(): Promise<Map<string, Phrase>> {
  const data = await request<any[]>('/api/teacher-phrases');
  const map = new Map<string, Phrase>();
  for (const p of list(data)) {
    if (p.phrase_key) map.set(String(p.phrase_key), { key: String(p.phrase_key), text: loc(p.text), audio: loc(p.audio) });
  }
  return map;
}