/**
 * seniorService.ts — SENIOR (Grade 9–12)-ONLY v2 API service
 *
 * Used ONLY by useSeniorSubjects.ts (and therefore only by
 * ClassSubjectsView.tsx / SubjectLecturesView.tsx, repurposed here for
 * Grade 9–12). This is the LAST grade band — once wired in, no view in
 * the app should still depend on classService.ts / the shared
 * useClassSubjects.ts. Completely separate from kgService.ts,
 * primaryService.ts, and middleService.ts.
 *
 * Verified directly against the live API for Grade 9 (classId = 10):
 *
 *   GET /v2/api/classes
 *   GET /v2/api/subjects/{classId}                         → name_en/name_ur/description_en/description_ur/thumbnail_url
 *   GET /v2/api/chapters/{subjectId}                       → same shape, no subject_id field
 *   GET /v2/api/videos?content_type=GRADE&parent_id={id}   → title_en/title_ur/description_html_en/description_html_ur
 *   GET /v2/api/videos/{videoId}                           → adds video_url (full absolute CDN URL)
 *
 * content_type=GRADE confirmed correct for Grade 9–12 content — same
 * value as every other band — verified directly, not assumed.
 *
 * Same gotchas as every other band, repeated here for Senior:
 *   - parent_id is NOT unique per content type; content_type is required.
 *   - The /videos LIST endpoint does NOT include the playable video_url —
 *     only the single /videos/{id} DETAIL endpoint does. Fetch it lazily
 *     at video-selection time, not from the list/grid data.
 */

const BASE_URL = "https://api.zaheen.com.pk/v2/api";
const SENIOR_CONTENT_TYPE = "GRADE";

const unwrap = (json: any) => json?.data ?? json;

export const fetchSeniorClasses = async () => {
  const res = await fetch(`${BASE_URL}/classes`);
  if (!res.ok) throw new Error("Senior classes fetch failed");
  return unwrap(await res.json());
};

export const fetchSeniorSubjects = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/subjects/${classId}`);
  if (!res.ok) throw new Error("Senior subjects fetch failed");
  return unwrap(await res.json());
};

export const fetchSeniorChapters = async (subjectId: number) => {
  const res = await fetch(`${BASE_URL}/chapters/${subjectId}`);
  if (!res.ok) throw new Error("Senior chapters fetch failed");
  return unwrap(await res.json());
};

export const fetchSeniorVideos = async (chapterId: number) => {
  const res = await fetch(
    `${BASE_URL}/videos?content_type=${SENIOR_CONTENT_TYPE}&parent_id=${chapterId}`
  );
  if (!res.ok) throw new Error("Senior videos fetch failed");
  return unwrap(await res.json());
};

/**
 * Single-video detail — the ONLY endpoint that returns `video_url`
 * (a full, already-absolute CDN URL). Call this right before playback.
 */
export const fetchSeniorVideoDetail = async (videoId: number) => {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error("Senior video detail fetch failed");
  return unwrap(await res.json());
};