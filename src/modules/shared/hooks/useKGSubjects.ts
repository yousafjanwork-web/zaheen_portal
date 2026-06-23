/**
 * useKGSubjects.ts — KG-ONLY hook
 *
 * Drop-in replacement for useClassSubjects, but used ONLY inside
 * KGClassView.tsx and KGLectureView.tsx. The shared useClassSubjects.ts
 * (used by Grade 1–12 views) is NOT touched by this file at all.
 *
 * Return shape matches what KGClassView/KGLectureView already destructure:
 *   { classInfo, subjects, chapters, chapterVideos, loading, error }
 *
 * Subject/video fields are normalized from v2's name_en/description_en/etc.
 * into the stable .name/.urdu_name/.desc/.urdu_desc/.thumbnail_url contract
 * the existing UI components already read — no component-level field
 * renames needed beyond swapping the import.
 */
import { useEffect, useState, useRef } from "react";
import {
  fetchKGClasses,
  fetchKGSubjects,
  fetchKGChapters,
  fetchKGVideos,
  fetchKGVideoDetail,
} from "@/modules/shared/services/kgService";

/**
 * Re-exported so KGLectureView can fetch the real playable video_url at
 * selection time (the list endpoint used below does not include it).
 */
export { fetchKGVideoDetail };

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
  /** Lucide icon-name hint when thumbnail_url isn't a real URL (e.g. "BookOpen") */
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

interface UseKGSubjectsResult {
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
export const useKGSubjects = (classId: number): UseKGSubjectsResult => {
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
        const classesRaw = await fetchKGClasses();
        const normalizedClasses = (classesRaw || []).map(normalizeClass);
        const normalizedClass =
          normalizedClasses.find((c: any) => c.id === Number(classId)) || null;

        /* ── 2. Subjects ── */
        const subjectsRaw = await fetchKGSubjects(classId);
        const normalizedSubjects = (subjectsRaw || []).map(normalizeSubject);

        /* ── 3. Chapters + videos (parallel per subject) ── */
        const allChapters: NormalizedChapter[] = [];
        const videoMap: Record<number, NormalizedVideo[]> = {};

        await Promise.all(
          normalizedSubjects.map(async (subject: NormalizedSubject) => {
            try {
              const chaptersRaw = await fetchKGChapters(subject.id);
              const normalizedChaps = (chaptersRaw || []).map((ch: any) =>
                normalizeChapter(ch, subject.id)
              );
              allChapters.push(...normalizedChaps);

              await Promise.all(
                normalizedChaps.map(async (chapter: NormalizedChapter) => {
                  try {
                    const videosRaw = await fetchKGVideos(chapter.id);
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