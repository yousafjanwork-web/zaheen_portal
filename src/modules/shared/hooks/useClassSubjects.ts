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
  const [classInfo, setClassInfo] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [chapterVideos, setChapterVideos] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);

  // class + subjects
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const classes = await fetchClasses();
        const cls = classes.find((c: any) => c.id === Number(classId));
        setClassInfo(cls);

        const subs = await fetchSubjects(classId);
        setSubjects(subs);

        const selected =
          subs.find((s: any) => s.id === selectedSubjectId) || subs[0];

        setSelectedSubject(selected);
      } finally {
        setLoading(false);
      }
    };

    if (classId) load();
  }, [classId]);

  // chapters + videos
  useEffect(() => {
    if (!selectedSubject) return;

    const loadChapters = async () => {
      setLoading(true);
      try {
        const chaps = await fetchChapters(selectedSubject.id);
        setChapters(chaps);

        const videoMap: Record<number, any[]> = {};

        await Promise.all(
          chaps.map(async (c: any) => {
            try {
              videoMap[c.id] = await fetchVideos(c.id);
            } catch {
              videoMap[c.id] = [];
            }
          })
        );

        setChapterVideos(videoMap);
      } finally {
        setLoading(false);
      }
    };

    loadChapters();
  }, [selectedSubject]);

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