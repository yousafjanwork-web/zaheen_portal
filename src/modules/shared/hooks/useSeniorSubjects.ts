/**
 * useSeniorSubjects.ts — SENIOR (Grade 9–12)-ONLY hook
 *
 * Drop-in replacement for useClassSubjects, used ONLY inside
 * ClassSubjectsView.tsx and SubjectLecturesView.tsx (the views being
 * repurposed for Grade 9–12 — the last unmigrated band). After this is
 * wired in, the shared useClassSubjects.ts / classService.ts should have
 * NO remaining callers in the app — confirm with a project-wide search
 * before deleting them, don't assume.
 *
 * Return shape matches what ClassSubjectsView/SubjectLecturesView already
 * destructure: { classInfo, subjects, chapters, chapterVideos, loading,
 * error } — same contract as every other grade-band hook in this app.
 */
import { useEffect, useState, useRef } from "react";
import {
  fetchSeniorClasses,
  fetchSeniorSubjects,
  fetchSeniorChapters,
  fetchSeniorVideos,
  fetchSeniorVideoDetail,
} from "@/modules/shared/services/seniorService";

/**
 * Re-exported so SubjectLecturesView can fetch the real playable
 * video_url at selection time (the list endpoint used below does not
 * include it — confirmed by direct testing, same as every other band).
 */
export { fetchSeniorVideoDetail };

/* ─────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
export interface NormalizedClass {
  id: number;
  name: string;
  urdu_name: string;
  thumbnail_url?: string;
  [key: string]: any;
}

export interface NormalizedSubject {
  id: number;
  name: string;
  urdu_name: string;
  desc?: string;
  urdu_desc?: string;
  thumbnail_url?: string;
  _iconHint?: string;
  [key: string]: any;
}

export interface NormalizedChapter {
  id: number;
  name: string;
  urdu_name?: string;
  subject_id: number;
  [key: string]: any;
}

export interface NormalizedVideo {
  id: number;
  name: string;
  urdu_name?: string;
  desc?: string;
  urdu_desc?: string;
  thumbnailUrl?: string;
  path: string;
  [key: string]: any;
}

interface UseSeniorSubjectsResult {
  classInfo: NormalizedClass | null;
  subjects: NormalizedSubject[];
  chapters: NormalizedChapter[];
  chapterVideos: Record<number, NormalizedVideo[]>;
  loading: boolean;
  error: string | null;
}

/* ─────────────────────────────────────────────────────────────
   Helpers
──────────────────────────────────────────────────────────────── */
const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
};

const isUrl = (s?: string): boolean =>
  !!s && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));

/* ─────────────────────────────────────────────────────────────
   Normalizers
──────────────────────────────────────────────────────────────── */
const normalizeClass = (raw: any): NormalizedClass => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "Class",
  urdu_name: raw.name_ur || raw.urdu_name || raw.name_en || raw.name || "",
  thumbnail_url: isUrl(raw.thumbnail_url)
    ? raw.thumbnail_url
    : isUrl(raw.thumbnail)
    ? raw.thumbnail
    : undefined,
});

export const normalizeSubject = (raw: any): NormalizedSubject => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "Subject",
  urdu_name: raw.name_ur || raw.urdu_name || "",
  desc: raw.description_en || raw.desc || "",
  urdu_desc: raw.description_ur || raw.urdu_desc || "",
  thumbnail_url: raw.thumbnail_url,
  _iconHint: !isUrl(raw.thumbnail_url) ? raw.thumbnail_url : undefined,
});

// Chapters endpoint does not return subject_id — caller's loop supplies it.
const normalizeChapter = (raw: any, subjectId: number): NormalizedChapter => ({
  ...raw,
  id: raw.id,
  name: raw.name_en || raw.name || "",
  urdu_name: raw.name_ur || raw.urdu_name || undefined,
  subject_id: raw.subject_id ?? subjectId,
});

const normalizeVideo = (raw: any): NormalizedVideo => {
  const nameEn = raw.title_en || raw.title || raw.name || "";
  const nameUr = raw.title_ur || raw.urdu_name || nameEn;

  const descEnRaw =
    raw.description_html_en || raw.description_en || raw.description || raw.desc || "";
  const descUrRaw =
    raw.description_html_ur || raw.description_ur || raw.urdu_desc || "";

  const rawThumb = raw.thumbnail_url || raw.thumbnail;
  const thumb =
    (isUrl(rawThumb) ? rawThumb : undefined) ||
    (isUrl(raw.thumbnailUrl) ? raw.thumbnailUrl : undefined);

  return {
    ...raw,
    id: raw.id,
    name: nameEn,
    urdu_name: nameUr || undefined,
    desc: stripHtml(descEnRaw) || undefined,
    urdu_desc: stripHtml(descUrRaw) || undefined,
    thumbnailUrl: thumb,
    path: raw.path || "",
  };
};

/* ─────────────────────────────────────────────────────────────
   Hook
──────────────────────────────────────────────────────────────── */
export const useSeniorSubjects = (classId: number): UseSeniorSubjectsResult => {
  const [classInfo, setClassInfo] = useState<NormalizedClass | null>(null);
  const [subjects, setSubjects] = useState<NormalizedSubject[]>([]);
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
        /* ── 1. Class info ── */
        const classesRaw = await fetchSeniorClasses();
        const normalizedClasses = (classesRaw || []).map(normalizeClass);
        const normalizedClass =
          normalizedClasses.find((c: any) => c.id === Number(classId)) || null;

        /* ── 2. Subjects ── */
        const subjectsRaw = await fetchSeniorSubjects(classId);
        const normalizedSubjects = (subjectsRaw || []).map(normalizeSubject);

        /* ── 3. Chapters + videos (parallel per subject) ── */
        const allChapters: NormalizedChapter[] = [];
        const videoMap: Record<number, NormalizedVideo[]> = {};

        await Promise.all(
          normalizedSubjects.map(async (subject: NormalizedSubject) => {
            try {
              const chaptersRaw = await fetchSeniorChapters(subject.id);
              const normalizedChaps = (chaptersRaw || []).map((ch: any) =>
                normalizeChapter(ch, subject.id)
              );
              allChapters.push(...normalizedChaps);

              await Promise.all(
                normalizedChaps.map(async (chapter: NormalizedChapter) => {
                  try {
                    const videosRaw = await fetchSeniorVideos(chapter.id);
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

        setClassInfo(normalizedClass);
        setSubjects(normalizedSubjects);
        setChapters(allChapters);
        setChapterVideos(videoMap);
      } catch (err: any) {
        if (cancelled || !mountedRef.current) return;
        setError(err?.message ?? "Unknown error");
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [classId]);

  return { classInfo, subjects, chapters, chapterVideos, loading, error };
};