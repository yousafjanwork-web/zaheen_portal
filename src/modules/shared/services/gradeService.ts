<<<<<<< HEAD
const BASE_URL = "https://api.zaheen.com.pk/api";

export const fetchGrades = async () => {
  const res = await fetch(`${BASE_URL}/board/1/classes`);
  if (!res.ok) throw new Error("Failed to fetch grades");
  return res.json();
};

export const fetchSubjectsByClass = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/class/${classId}/subjects`);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return res.json();
=======
/**
 * gradeService.ts — v2 API service backing useGrades() (grade-listing
 * pages: PrimaryGradesView, MiddleGradesView, and similar).
 *
 * Migrated from old /api to /v2/api, same confirmed pattern as
 * classService.ts. Endpoints confirmed via API docs (Academics section):
 *   GET /api/classes            → same shape as /v2/api/classes
 *   GET /api/subjects/{classId} → same shape as /v2/api/subjects/{classId}
 *   GET /api/chapters/{subjectId} (not used here, but confirmed same family)
 *
 * NOTE: fetchGrades() here returns the FULL class list, unfiltered.
 * filterGrades() in useGrade.ts slices it by id range per grade band
 * (kg / 1-5 / 6-8 / 9-12). This still works after migration because the
 * v2 /classes endpoint returns the same id values we already confirmed
 * earlier in this project (1 = Kindergarten, 2-6 = Grade 1-5, etc.).
 */

const BASE_URL = "https://api.zaheen.com.pk/v2/api";

const unwrap = (json: any) => json?.data ?? json;

export const fetchGrades = async () => {
  const res = await fetch(`${BASE_URL}/classes`);
  if (!res.ok) throw new Error("Failed to fetch grades");
  return unwrap(await res.json());
};

export const fetchSubjectsByClass = async (classId: number) => {
  const res = await fetch(`${BASE_URL}/subjects/${classId}`);
  if (!res.ok) throw new Error("Failed to fetch subjects");
  return unwrap(await res.json());
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
};