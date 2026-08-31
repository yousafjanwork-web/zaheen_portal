/**
 * seniorService.ts — LEGACY past-papers-only service.
 *
 * All other Grade 9-12 data (classes, subjects, chapters, videos) now
 * goes through the shared classService.ts / useClassSubjects.ts, same
 * as every other grade band. This file survives ONLY because past
 * papers have not been added to v2 yet (per Sir's instruction).
 *
 * When past papers are added to v2, update PASTPAPERS_BASE_URL_LEGACY
 * to the new v2 endpoint below, or move this function into
 * classService.ts entirely and delete this file.
 */

const PASTPAPERS_BASE_URL_LEGACY = "https://api.zaheen.com.pk/api";

const unwrap = (json: any) => json?.data ?? json;

export const fetchSeniorPastPapers = async (classId: number, subjectId: number) => {
  const res = await fetch(
    `${PASTPAPERS_BASE_URL_LEGACY}/pastpapers?class_id=${classId}&subject_id=${subjectId}`
  );
  if (!res.ok) throw new Error("Senior past papers fetch failed");
  return unwrap(await res.json());
};