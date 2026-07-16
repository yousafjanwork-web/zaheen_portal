/**
 * classService.ts — SHARED v2 API service for ALL classes
 * (KG, Primary, Middle, Senior / Grade 9-12).
 *
 * CONSOLIDATED 2026-07-16: previously each age band had its own
 * duplicate service (kgService.ts, primaryService.ts, middleService.ts,
 * seniorService.ts) plus a matching duplicate hook. That split existed
 * because of a suspected backend bug where /v2/api/subjects/{classId}
 * always returned Kindergarten's subjects regardless of classId.
 *
 * That bug is CONFIRMED FIXED as of 2026-07-16 — verified live:
 *   /v2/api/subjects/1 → returns Kindergarten subjects
 *   /v2/api/subjects/2 → returns Grade 1 subjects (correctly different)
 *
 * With the root cause gone, there is no reason to keep four near-identical
 * services in sync by hand. This file is now the ONLY class/subject/
 * chapter/video service in the app. kgService.ts, primaryService.ts,
 * middleService.ts, seniorService.ts and their matching hooks
 * (useKGSubjects.ts, usePrimarySubjects.ts, useMiddleSubjects.ts,
 * useSeniorSubjects.ts) are safe to delete once every view that imported
 * them has been switched to useClassSubjects/classService (see migration
 * checklist at the bottom of this comment block).
 *
 * Endpoints (identical shape across all age bands, confirmed):
 *   GET /v2/api/classes
 *   GET /v2/api/subjects/{classId}
 *   GET /v2/api/chapters/{subjectId}
 *   GET /v2/api/videos?content_type=GRADE&parent_id={chapterId}
 *   GET /v2/api/videos/{videoId}   → single-video detail, includes video_url
 *
 * content_type=GRADE is required on every /videos list call — parent_id
 * is NOT unique per content type (a "COURSE" id 1 and a "GRADE" chapter
 * id 1 can both exist), confirmed across KG through Grade 9-12.
 *
 * NORMALIZATION — ported from kgService's useKGSubjects.ts, which had
 * already solved this correctly. Raw v2 fields (title_en, thumbnail_url,
 * description_html_en, etc.) are normalized here into the stable
 * .name / .urdu_name / .desc / .urdu_desc / .thumbnailUrl contract that
 * every view component (KGLectureView, PrimarySubjectDetailView,
 * MiddleSubjectDetailView, SubjectLecturesView) already reads. This step
 * was MISSING from classService/useClassSubjects before this change —
 * that's why thumbnails/descriptions went blank when KGLectureView was
 * switched over to the shared hook without it.
 *
 * MIGRATION CHECKLIST (delete old files only after all boxes are checked):
 *   [ ] KGLectureView.tsx / KGClassView.tsx           → use useClassSubjects
 *   [ ] PrimarySubjectDetailView.tsx / PrimaryClassView.tsx → use useClassSubjects
 *   [ ] MiddleSubjectDetailView.tsx / MiddleClassView.tsx   → use useClassSubjects
 *   [ ] SubjectLecturesView.tsx (senior)               → use useClassSubjects
 *   [ ] grep codebase for "useKGSubjects", "usePrimarySubjects",
 *       "useMiddleSubjects", "useSeniorSubjects", "kgService",
 *       "primaryService", "middleService", "seniorService" → zero results
 *   [ ] delete kgService.ts, primaryService.ts, middleService.ts, seniorService.ts
 *   [ ] delete useKGSubjects.ts, usePrimarySubjects.ts, useMiddleSubjects.ts, useSeniorSubjects.ts
 */

const BASE_URL = "https://api.zaheen.com.pk/v2/api";
const GRADE_CONTENT_TYPE = "GRADE";

const unwrap = (json: any) => json?.data ?? json;

/* ─────────────────────────────────────────────────────────────
   Raw fetchers
──────────────────────────────────────────────────────────────── */
export const fetchClasses = async () => {
  const res = await fetch(`${BASE_URL}/classes`);
  if (!res.ok) throw new Error("Classes fetch failed");
  return unwrap(await res.json());
};

export const fetchSubjects = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/subjects/${classId}`);
  if (!res.ok) throw new Error("Subjects fetch failed");
  return unwrap(await res.json());
};

export const fetchChapters = async (subjectId: number) => {
  const res = await fetch(`${BASE_URL}/chapters/${subjectId}`);
  if (!res.ok) throw new Error("Chapters fetch failed");
  return unwrap(await res.json());
};

export const fetchVideos = async (chapterId: number) => {
  const res = await fetch(
    `${BASE_URL}/videos?content_type=${GRADE_CONTENT_TYPE}&parent_id=${chapterId}`
  );
  if (!res.ok) throw new Error("Videos fetch failed");
  return unwrap(await res.json());
};

/**
 * Single-video detail — the ONLY endpoint that returns `video_url`
 * (a full, already-absolute CDN URL). Call this right before playback,
 * not when building the list/grid.
 */
export const fetchVideoDetail = async (videoId: number) => {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error("Video detail fetch failed");
  return unwrap(await res.json());
};

/* ─────────────────────────────────────────────────────────────
   Normalization types & helpers
   (ported as-is from useKGSubjects.ts — proven to work correctly)
──────────────────────────────────────────────────────────────── */
export interface NormalizedClass {
  id: number;
  name: string;
  urdu_name: string;
  thumbnail_url?: string;
  [key: string]: any;
}

export interface NormalizedSubject {
  id: number;
  name: string;
  urdu_name: string;
  desc?: string;
  urdu_desc?: string;
  thumbnail_url?: string;
  /** Lucide icon-name hint when thumbnail_url isn't a real URL (e.g. "BookOpen") */
  _iconHint?: string;
  [key: string]: any;
}

export interface NormalizedChapter {
  id: number;
  name: string;
  urdu_name?: string;
  subject_id: number;
  [key: string]: any;
}

export interface NormalizedVideo {
  id: number;
  name: string;
  urdu_name?: string;
  desc?: string;
  urdu_desc?: string;
  thumbnailUrl?: string;
  path: string;
  [key: string]: any;
}

const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
};

const isUrl = (s?: string): boolean =>
  !!s && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));

export const normalizeClass = (raw: any): NormalizedClass => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "Class",
  urdu_name: raw.name_ur || raw.urdu_name || raw.name_en || raw.name || "",
  thumbnail_url: isUrl(raw.thumbnail_url)
    ? raw.thumbnail_url
    : isUrl(raw.thumbnail)
    ? raw.thumbnail
    : undefined,
});

export const normalizeSubject = (raw: any): NormalizedSubject => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "Subject",
  urdu_name: raw.name_ur || raw.urdu_name || "",
  desc: raw.description_en || raw.desc || "",
  urdu_desc: raw.description_ur || raw.urdu_desc || "",
  thumbnail_url: raw.thumbnail_url,
  _iconHint: !isUrl(raw.thumbnail_url) ? raw.thumbnail_url : undefined,
});

// Chapters endpoint does not return subject_id — caller's loop supplies it.
export const normalizeChapter = (raw: any, subjectId: number): NormalizedChapter => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "",
  urdu_name: raw.name_ur || raw.urdu_name || undefined,
  subject_id: raw.subject_id ?? subjectId,
});

export const normalizeVideo = (raw: any): NormalizedVideo => {
  const nameEn = raw.title_en || raw.title || raw.name || "";
  const nameUr = raw.title_ur || raw.urdu_name || nameEn;

  const descEnRaw =
    raw.description_html_en || raw.description_en || raw.description || raw.desc || "";
  const descUrRaw =
    raw.description_html_ur || raw.description_ur || raw.urdu_desc || "";

  const rawThumb = raw.thumbnail_url || raw.thumbnail;
  const thumb =
    (isUrl(rawThumb) ? rawThumb : undefined) ||
    (isUrl(raw.thumbnailUrl) ? raw.thumbnailUrl : undefined);

  return {
    ...raw,
    id: raw.id,
    name: nameEn,
    urdu_name: nameUr || undefined,
    desc: stripHtml(descEnRaw) || undefined,
    urdu_desc: stripHtml(descUrRaw) || undefined,
    thumbnailUrl: thumb,
    path: raw.path || "",
  };
};