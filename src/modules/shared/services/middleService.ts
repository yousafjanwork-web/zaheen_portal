/**
 * middleService.ts — MIDDLE (Grade 6–8)-ONLY v2 API service
 *
 * Used ONLY by useMiddleSubjects.ts (and therefore only by
 * MiddleSubjectsView.tsx / MiddleSubjectDetailView.tsx). Completely
 * separate from classService.ts (Grade 9–12, still on v1), kgService.ts,
 * and primaryService.ts.
 *
 * Verified directly against the live API for Grade 6 (classId = 7):
 *
 *   GET /v2/api/classes
 *   GET /v2/api/subjects/{classId}                         → name_en/name_ur/description_en/description_ur/thumbnail_url
 *   GET /v2/api/chapters/{subjectId}                       → same shape, no subject_id field
 *   GET /v2/api/videos?content_type=GRADE&parent_id={id}   → title_en/title_ur/description_html_en/description_html_ur
 *   GET /v2/api/videos/{videoId}                           → adds video_url (full absolute CDN URL)
 *
 * content_type=GRADE confirmed correct for Grade 6–8 content — same value
 * as KG and Grade 1–5 — verified directly, not assumed.
 *
 * Same gotchas as KG/Primary, repeated here for Middle:
 *   - parent_id is NOT unique per content type; content_type is required.
 *   - The /videos LIST endpoint does NOT include the playable video_url —
 *     only the single /videos/{id} DETAIL endpoint does. Fetch it lazily
 *     at video-selection time, not from the list/grid data.
 */

const BASE_URL = "https://api.zaheen.com.pk/v2/api";
const MIDDLE_CONTENT_TYPE = "GRADE";

const unwrap = (json: any) => json?.data ?? json;

export const fetchMiddleClasses = async () => {
  const res = await fetch(`${BASE_URL}/classes`);
  if (!res.ok) throw new Error("Middle classes fetch failed");
  return unwrap(await res.json());
};

export const fetchMiddleSubjects = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/subjects/${classId}`);
  if (!res.ok) throw new Error("Middle subjects fetch failed");
  return unwrap(await res.json());
};

export const fetchMiddleChapters = async (subjectId: number) => {
  const res = await fetch(`${BASE_URL}/chapters/${subjectId}`);
  if (!res.ok) throw new Error("Middle chapters fetch failed");
  return unwrap(await res.json());
};

export const fetchMiddleVideos = async (chapterId: number) => {
  const res = await fetch(
    `${BASE_URL}/videos?content_type=${MIDDLE_CONTENT_TYPE}&parent_id=${chapterId}`
  );
  if (!res.ok) throw new Error("Middle videos fetch failed");
  return unwrap(await res.json());
};

/**
 * Single-video detail — the ONLY endpoint that returns `video_url`
 * (a full, already-absolute CDN URL). Call this right before playback.
 */
export const fetchMiddleVideoDetail = async (videoId: number) => {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error("Middle video detail fetch failed");
  return unwrap(await res.json());
};