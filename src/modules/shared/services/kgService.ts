/**
 * kgService.ts — KG-ONLY v2 API service
 *
 * Used ONLY by useKGSubjects.ts (and therefore only by KGClassView /
 * KGLectureView). Completely separate from classService.ts, which stays
 * on v1 and keeps serving Grade 1–12 unchanged.
 *
 * Every endpoint below has been manually verified against the live API
 * for Kindergarten (classId = 1):
 *
 *   GET /v2/api/classes                                   → {success, message, data: [...]}
 *   GET /v2/api/subjects/{classId}                         → {success, message, data: [...]}
 *   GET /v2/api/chapters/{subjectId}                       → {success, message, data: [...]}
 *   GET /v2/api/videos?content_type=GRADE&parent_id={id}   → {success, message, data: [...]}
 *
 * IMPORTANT — known backend issue (do not "fix" client-side):
 *   /v2/api/subjects/{classId} currently ignores classId and always
 *   returns Kindergarten's subjects, regardless of which class is
 *   requested. This is why this service must NOT be reused for any
 *   class other than Kindergarten until the backend fixes that route.
 *
 * IMPORTANT — content_type:
 *   The /videos endpoint's parent_id is NOT unique per content type —
 *   chapter id 1 and an unrelated "COURSE" id 1 both exist. Omitting
 *   content_type returns both mixed together. content_type=GRADE is
 *   required and verified to isolate KG lecture videos correctly.
 */

const BASE_URL = "https://api.zaheen.com.pk/v2/api";
const KG_CONTENT_TYPE = "GRADE";

const unwrap = (json: any) => json?.data ?? json;

export const fetchKGClasses = async () => {
  const res = await fetch(`${BASE_URL}/classes`);
  if (!res.ok) throw new Error("KG classes fetch failed");
  return unwrap(await res.json());
};

export const fetchKGSubjects = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/subjects/${classId}`);
  if (!res.ok) throw new Error("KG subjects fetch failed");
  return unwrap(await res.json());
};

export const fetchKGChapters = async (subjectId: number) => {
  const res = await fetch(`${BASE_URL}/chapters/${subjectId}`);
  if (!res.ok) throw new Error("KG chapters fetch failed");
  return unwrap(await res.json());
};

export const fetchKGVideos = async (chapterId: number) => {
  const res = await fetch(
    `${BASE_URL}/videos?content_type=${KG_CONTENT_TYPE}&parent_id=${chapterId}`
  );
  if (!res.ok) throw new Error("KG videos fetch failed");
  return unwrap(await res.json());
};

/**
 * Single-video detail. IMPORTANT: this is the ONLY endpoint that returns
 * `video_url` (a full, already-absolute CDN URL). The list endpoint above
 * (used to populate chapter grids) does NOT include it — confirmed by
 * direct testing. Call this right before playback, the same way
 * fetchJourneyForVideo() is already called before mounting the player.
 */
export const fetchKGVideoDetail = async (videoId: number) => {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error("KG video detail fetch failed");
  return unwrap(await res.json());
};