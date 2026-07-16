/**
 * useClassSubjects.ts — SHARED hook for ALL classes (KG through Grade 9-12).
 *
 * CONSOLIDATED 2026-07-16 — see the large comment block at the top of
 * classService.ts for the full history and migration checklist. In short:
 * the per-age-band duplicate hooks (useKGSubjects, usePrimarySubjects,
 * useMiddleSubjects, useSeniorSubjects) existed because of a suspected
 * backend bug that has since been confirmed fixed. This hook now carries
 * the same field normalization useKGSubjects.ts already had, so every
 * view gets consistent .name/.urdu_name/.desc/.urdu_desc/.thumbnailUrl
 * fields regardless of which class/age-band it's rendering.
 */
import { useEffect, useState, useRef } from "react";
import {
  fetchClasses,
  fetchSubjects,
  fetchChapters,
  fetchVideos,
  fetchVideoDetail,
  normalizeClass,
  normalizeSubject,
  normalizeChapter,
  normalizeVideo,
  NormalizedClass,
  NormalizedSubject,
  NormalizedChapter,
  NormalizedVideo,
} from "@/modules/shared/services/classService";

/**
 * Re-exported so views can fetch the real playable video_url at
 * selection time (the list endpoint does not include it).
 */
export { fetchVideoDetail };

interface UseClassSubjectsResult {
  classInfo: NormalizedClass | null;
  subjects: NormalizedSubject[];
  selectedSubject: NormalizedSubject | null;
  setSelectedSubject: (s: NormalizedSubject) => void;
  chapters: NormalizedChapter[];
  chapterVideos: Record<number, NormalizedVideo[]>;
  loading: boolean;
  error: string | null;
}

export const useClassSubjects = (
  classId: number,
  selectedSubjectId?: number
): UseClassSubjectsResult => {
  const [classInfo, setClassInfo] = useState<NormalizedClass | null>(null);
  const [subjects, setSubjects] = useState<NormalizedSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<NormalizedSubject | null>(null);
  const [chapters, setChapters] = useState<NormalizedChapter[]>([]);
  const [chapterVideos, setChapterVideos] = useState<Record<number, NormalizedVideo[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!classId || isNaN(classId)) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        /* ── 1. Classes + subjects ── */
        const [classesRaw, subjectsRaw] = await Promise.all([
          fetchClasses(),
          fetchSubjects(classId),
        ]);

        if (cancelled || !mountedRef.current) return;

        const normalizedClasses = (classesRaw || []).map(normalizeClass);
        const normalizedClassInfo =
          normalizedClasses.find((c: any) => c.id === Number(classId)) || null;
        const normalizedSubjects = (subjectsRaw || []).map(normalizeSubject);
        const selected =
          normalizedSubjects.find((s: any) => s.id === selectedSubjectId) ||
          normalizedSubjects[0] ||
          null;

        setClassInfo(normalizedClassInfo);
        setSubjects(normalizedSubjects);
        setSelectedSubject(selected);

        /* ── 2. Chapters for EVERY subject (not just selected) ──
           Needed so subject overview cards can show real lecture counts. */
        const allChapters: NormalizedChapter[] = [];
        const videoMap: Record<number, NormalizedVideo[]> = {};

        await Promise.all(
          normalizedSubjects.map(async (subject: NormalizedSubject) => {
            try {
              const chaptersRaw = await fetchChapters(subject.id);
              const normalizedChaps = (chaptersRaw || []).map((ch: any) =>
                normalizeChapter(ch, subject.id)
              );
              allChapters.push(...normalizedChaps);

              /* ── 3. Videos for every chapter ── */
              await Promise.all(
                normalizedChaps.map(async (chapter: NormalizedChapter) => {
                  try {
                    const videosRaw = await fetchVideos(chapter.id);
                    videoMap[chapter.id] = (videosRaw || []).map(normalizeVideo);
                  } catch {
                    videoMap[chapter.id] = [];
                  }
                })
              );
            } catch {
              /* subject has no chapters yet — skip silently */
            }
          })
        );

        if (cancelled || !mountedRef.current) return;

        setChapters(allChapters);
        setChapterVideos(videoMap);
      } catch (err: any) {
        if (cancelled || !mountedRef.current) return;
        setError(err?.message ?? "Unknown error");
        console.error("useClassSubjects load error:", err);
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [classId, selectedSubjectId]);

  return {
    classInfo,
    subjects,
    selectedSubject,
    setSelectedSubject,
    chapters,
    chapterVideos,
    loading,
    error,
  };
};