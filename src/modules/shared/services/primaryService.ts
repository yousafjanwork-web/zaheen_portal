/**
 * primaryService.ts — PRIMARY (Grade 1–5)-ONLY v2 API service
 *
 * Used ONLY by usePrimarySubjects.ts (and therefore only by
 * PrimarySubjectsView.tsx / PrimarySubjectDetailView.tsx). Completely
 * separate from classService.ts (Grade 6–8, 9–12, still on v1) and from
 * kgService.ts (Kindergarten's own isolated v2 path).
 *
 * Verified directly against the live API for Grade 1 (classId = 2):
 *
 *   GET /v2/api/classes                                   → {success, message, data: [...]}
 *   GET /v2/api/subjects/{classId}                         → {success, message, data: [...]}
 *   GET /v2/api/chapters/{subjectId}                       → {success, message, data: [...]}  (no subject_id field)
 *   GET /v2/api/videos?content_type=GRADE&parent_id={id}   → {success, message, data: [...]}
 *   GET /v2/api/videos/{videoId}                           → {success, message, data: {..., video_url, ...}}
 *
 * content_type=GRADE confirmed correct for Grade 1 content (same value as
 * Kindergarten) — verified by inspecting an unfiltered /videos?parent_id=
 * response and checking the actual content_type on real items, not assumed.
 *
 * Same gotchas as KG, repeated here for Primary:
 *   - parent_id is NOT unique per content type; content_type is required.
 *   - The /videos LIST endpoint does NOT include the playable video_url —
 *     only the single /videos/{id} DETAIL endpoint does. Fetch it lazily
 *     at video-selection time, not from the list/grid data.
 */

const BASE_URL = "https://api.zaheen.com.pk/v2/api";
const PRIMARY_CONTENT_TYPE = "GRADE";

const unwrap = (json: any) => json?.data ?? json;

export const fetchPrimaryClasses = async () => {
  const res = await fetch(`${BASE_URL}/classes`);
  if (!res.ok) throw new Error("Primary classes fetch failed");
  return unwrap(await res.json());
};

export const fetchPrimarySubjects = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/subjects/${classId}`);
  if (!res.ok) throw new Error("Primary subjects fetch failed");
  return unwrap(await res.json());
};

export const fetchPrimaryChapters = async (subjectId: number) => {
  const res = await fetch(`${BASE_URL}/chapters/${subjectId}`);
  if (!res.ok) throw new Error("Primary chapters fetch failed");
  return unwrap(await res.json());
};

export const fetchPrimaryVideos = async (chapterId: number) => {
  const res = await fetch(
    `${BASE_URL}/videos?content_type=${PRIMARY_CONTENT_TYPE}&parent_id=${chapterId}`
  );
  if (!res.ok) throw new Error("Primary videos fetch failed");
  return unwrap(await res.json());
};

/**
 * Single-video detail — the ONLY endpoint that returns `video_url`
 * (a full, already-absolute CDN URL). Call this right before playback.
 */
export const fetchPrimaryVideoDetail = async (videoId: number) => {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error("Primary video detail fetch failed");
  return unwrap(await res.json());
};