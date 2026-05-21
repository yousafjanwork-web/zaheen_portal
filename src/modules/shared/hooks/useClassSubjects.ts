import { useEffect, useState } from "react";
import {
  fetchClasses,
  fetchSubjects,
  fetchChapters,
  fetchVideos,
} from "@/modules/shared/services/classService";

export const useClassSubjects = (
  classId: number,
  selectedSubjectId?: number
) => {
  const [classInfo, setClassInfo]       = useState<any>(null);
  const [subjects, setSubjects]         = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [chapters, setChapters]         = useState<any[]>([]);
  const [chapterVideos, setChapterVideos] = useState<Record<number, any[]>>({});
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!classId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        // ── 1. classes + subjects ──────────────────────────────
        const [classes, subs] = await Promise.all([
          fetchClasses(),
          fetchSubjects(classId),
        ]);

        if (cancelled) return;

        const cls = classes.find((c: any) => c.id === Number(classId));
        const selected = subs.find((s: any) => s.id === selectedSubjectId) || subs[0];

        setClassInfo(cls);
        setSubjects(subs);
        setSelectedSubject(selected);

        // ── 2. chapters for EVERY subject (not just selected) ──
        //    This is the key fix: we need counts for all subjects
        //    so the subject overview cards can show real numbers.
        const allChaptersArrays = await Promise.all(
          subs.map((s: any) =>
            fetchChapters(s.id).catch(() => [] as any[])
          )
        );

        if (cancelled) return;

        // Flatten into one array, each chapter already carries subject_id
        // from the API. If the API doesn't include subject_id, we tag it here.
        const allChapters: any[] = [];
        subs.forEach((s: any, i: number) => {
          (allChaptersArrays[i] || []).forEach((ch: any) => {
            allChapters.push({ ...ch, subject_id: ch.subject_id ?? s.id });
          });
        });

        setChapters(allChapters);

        // ── 3. videos for every chapter ────────────────────────
        const videoMap: Record<number, any[]> = {};

        await Promise.all(
          allChapters.map(async (ch: any) => {
            try {
              videoMap[ch.id] = await fetchVideos(ch.id);
            } catch {
              videoMap[ch.id] = [];
            }
          })
        );

        if (cancelled) return;
        setChapterVideos(videoMap);

      } catch (err) {
        console.error("useClassSubjects load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [classId, selectedSubjectId]);

  // Allow the view to switch the selected subject without re-fetching everything
  return {
    classInfo,
    subjects,
    selectedSubject,
    setSelectedSubject,
    chapters,
    chapterVideos,
    loading,
  };
};