import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Lesson } from "../types";
import {
  fetchLessonsRaw,
  fetchLessonByIdRaw,
  VocabApiError,
} from "../services/vocabApi";
import { mapLessonSummary, mapLessonDetail } from "../services/mappers";

// ============================================================
// VOCAB MODULE — LESSONS CONTEXT
// ============================================================
// Drop-in replacement for the old `data/lessons.ts` static file.
// Every page that used to do:
//     import { lessons } from '../data/lessons';
// now does:
//     import { useLessonsData } from '../context/LessonsContext';
//     const { lessons, isLoading, error } = useLessonsData();
//
// Why it fetches full detail for every lesson up front:
// GET /api/vocab/lessons (the list endpoint) only returns lesson
// metadata — no `words`, no `activity_questions`, no
// `quiz_questions`. Several pages (Home, Courses, WordGarden,
// Flashcards, StoryStudio, AdminPanel) need the full word list for
// every lesson, not just the one being played. So on first load we:
//   1. GET /api/vocab/lessons          → get the list of 19 lessons
//   2. GET /api/vocab/lessons/:id  ×19 → hydrate each with full detail
// This happens once, is cached in memory for the session, and is
// cheap since there are only 19 lessons. If sir's lesson list ever
// grows a lot, ask him about adding a `?include=words` option to
// the list endpoint instead of doing 19 detail calls.
// ============================================================

interface LessonsContextType {
  lessons: Lesson[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  getLessonById: (id: string) => Lesson | undefined;
  getLessonsByAgeGroup: (ageGroup: "junior" | "senior") => Lesson[];
  getTotalWordsLearned: (completedLessonIds: string[]) => number;
}

const LessonsContext = createContext<LessonsContextType | null>(null);

export function LessonsProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const listResponse = await fetchLessonsRaw();
      const summaries: Lesson[] = (listResponse?.data || []).map(
        mapLessonSummary,
      );

      // Hydrate every lesson with full detail (words, activity
      // questions, quiz questions) in parallel.
      const detailed = await Promise.all(
        summaries.map(async (summary) => {
          try {
            const detailResponse = await fetchLessonByIdRaw(summary.id);
            return mapLessonDetail(detailResponse?.data ?? detailResponse);
          } catch {
            // If one lesson's detail fails, don't blow up the whole
            // list — fall back to the summary (words will be empty
            // for that one lesson only).
            return summary;
          }
        }),
      );

      detailed.sort((a, b) => a.order - b.order);
      setLessons(detailed);
    } catch (err) {
      setError(
        err instanceof VocabApiError
          ? err.message
          : "Something went wrong loading lessons.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getLessonById = useCallback(
    (id: string) => lessons.find((l) => l.id === id),
    [lessons],
  );

  const getLessonsByAgeGroup = useCallback(
    (ageGroup: "junior" | "senior") =>
      lessons.filter((l) => l.ageGroup === ageGroup || l.ageGroup === "both"),
    [lessons],
  );

  const getTotalWordsLearned = useCallback(
    (completedLessonIds: string[]) =>
      lessons
        .filter((l) => completedLessonIds.includes(l.id))
        .reduce((sum, l) => sum + l.words.length, 0),
    [lessons],
  );

  return (
    <LessonsContext.Provider
      value={{
        lessons,
        isLoading,
        error,
        refetch: load,
        getLessonById,
        getLessonsByAgeGroup,
        getTotalWordsLearned,
      }}
    >
      {children}
    </LessonsContext.Provider>
  );
}

export function useLessonsData() {
  const ctx = useContext(LessonsContext);
  if (!ctx)
    throw new Error("useLessonsData must be used within a LessonsProvider");
  return ctx;
}
