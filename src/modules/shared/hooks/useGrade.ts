/**
 * useGrade.ts — backs useGrades(), used by grade-listing pages
 * (PrimaryGradesView, MiddleGradesView, and similar "pick your grade"
 * screens — NOT the subject/chapter/video views, which use
 * useClassSubjects from classService.ts instead).
 *
 * MIGRATED to v2 API via gradeService.ts. v2 returns name_en/name_ur
 * (not name/urdu_name like the old /api), so this file now normalizes
 * those fields the same way classService.ts does for consistency.
 *
 * ⚠️ CALL-SITE BUG FOUND DURING MIGRATION (2026-07-16):
 * This hook requires TWO arguments: useGrades(type, isUrdu).
 * PrimaryGradesView.tsx was calling it with only ONE argument:
 *     useGrades("primary")
 * This makes isUrdu undefined → every isUrdu check silently falls back
 * to English, even when the site is set to Urdu, on that page only.
 * Check MiddleGradesView.tsx and any KG-grades-listing page for the same
 * mistake — every call site must pass isUrdu as the second argument:
 *     useGrades("primary", isUrdu)
 * This is NOT fixed automatically by this file's migration — each
 * page's call site must be corrected separately.
 */
import { useEffect, useState } from "react";
import { fetchGrades, fetchSubjectsByClass } from "@/modules/shared/services/gradeService";

const gradeImages: Record<number, string> = {
  7: "https://images.unsplash.com/photo-1588072432836-e10032774350",
  8: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
  9: "https://images.unsplash.com/photo-1513258496099-48168024aec0",
  10: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  11: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc",
  12: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  13: "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
};

const filterGrades = (data: any[], type: string) => {
  if (type === "kg") return data.filter((g) => g.id === 1);
  if (type === "1-5") return data.filter((g) => g.id >= 2 && g.id <= 6);
  if (type === "6-8") return data.filter((g) => g.id >= 7 && g.id <= 9);
  if (type === "9-12") return data.filter((g) => g.id >= 10 && g.id <= 13);
  if (type === "k-12") return data;
  return data.filter((g) => g.id >= 2 && g.id <= 6);
};

// v2 returns name_en/name_ur — normalize to the same .name/.urdu_name
// contract used everywhere else in this project (classService.ts etc.)
const normalizeGrade = (raw: any) => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "",
  urdu_name: raw.name_ur || raw.urdu_name || "",
  thumbnailUrl: raw.thumbnail_url || raw.thumbnailUrl,
});

const normalizeSubjectName = (raw: any) => ({
  ...raw,
  name: raw.name_en || raw.name || "",
  urdu_name: raw.name_ur || raw.urdu_name || "",
});

export const useGrades = (type: string, isUrdu: boolean) => {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const rawData = await fetchGrades();
        const normalizedData = (rawData || []).map(normalizeGrade);
        const filtered = filterGrades(normalizedData, type);

        const result = await Promise.all(
          filtered.map(async (g) => {
            try {
              const subjectsRaw = await fetchSubjectsByClass(g.id);
              const subjects = (subjectsRaw || []).map(normalizeSubjectName);

              const subjectNames = subjects.map((s: any) =>
                isUrdu ? s.urdu_name || s.name : s.name
              );

              return {
                id: g.id,
                name: g.name,
                urdu_name: g.urdu_name,
                title: isUrdu ? g.urdu_name || g.name : g.name,
                lessons: `${subjectNames.length} ${isUrdu ? "مضامین" : "Subjects"}`,
                description: isUrdu
                  ? "طلباء کے لیے اعلیٰ معیار کا تعلیمی مواد۔"
                  : "High-quality educational content designed for students.",
                image: gradeImages[g.id] || g.thumbnailUrl,
                subjects: subjectNames,
              };
            } catch {
              return {
                id: g.id,
                name: g.name,
                urdu_name: g.urdu_name,
                title: isUrdu ? g.urdu_name || g.name : g.name,
                lessons: `0 ${isUrdu ? "مضامین" : "Subjects"}`,
                description: "",
                image: g.thumbnailUrl,
                subjects: [],
              };
            }
          })
        );

        if (!cancelled) setGrades(result);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [type, isUrdu]);

  return { grades, loading };
};