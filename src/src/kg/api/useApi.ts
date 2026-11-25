import { useEffect, useRef, useState } from 'react';
import { getChapterLessons, getChapters, getClassLessons, getLesson, getPhrases, getWelcome, resolveIds } from './client';
import { Chapter, Ids, LessonCard, LessonDetail, Phrase, Welcome } from './types';

export interface Remote<T> { data: T | null; error: string | null; loading: boolean; retry: () => void }

export function useRemote<T>(key: string | null, load: () => Promise<T>): Remote<T> {
  const [state, setState] = useState<{ data: T | null; error: string | null; loading: boolean }>({
    data: null, error: null, loading: key !== null,
  });
  const [tick, setTick] = useState(0);
  const loader = useRef(load);
  loader.current = load;

  useEffect(() => {
    if (key === null) {
      setState({ data: null, error: null, loading: false });
      return;
    }
    let alive = true;
    setState((s) => ({ data: s.data, error: null, loading: true }));
    loader
      .current()
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((e: unknown) =>
        alive && setState({ data: null, error: e instanceof Error ? e.message : 'Could not load', loading: false })
      );
    return () => {
      alive = false;
    };
  }, [key, tick]);

  return { ...state, retry: () => setTick((t) => t + 1) };
}

function useWithIds<T>(key: string | null, load: (ids: Ids) => Promise<T>): Remote<T> {
  const ids = useRemote<Ids>('ids', resolveIds);
  const waiting = key === null || !ids.data;
  const r = useRemote<T>(waiting ? null : `${key}@${ids.data!.boardId}:${ids.data!.classId}`, () => load(ids.data!));
  return {
    data: r.data,
    error: ids.error || r.error,
    loading: ids.loading || r.loading,
    retry: () => {
      ids.retry();
      r.retry();
    },
  };
}

export const useIds = () => useRemote<Ids>('ids', resolveIds);
export const usePhrases = () => useRemote<Map<string, Phrase>>('phrases', getPhrases);
export const useWelcome = () => useWithIds<Welcome>('welcome', (i) => getWelcome(i.classId));
export const useChapters = () => useWithIds<Chapter[]>('chapters', (i) => getChapters(i.classId));
export const useClassLessons = () => useWithIds<LessonCard[]>('class-lessons', (i) => getClassLessons(i.classId));
export const useChapterLessons = (chapterId: number | null) =>
  useWithIds<LessonCard[]>(chapterId === null ? null : `chapter-lessons:${chapterId}`, (i) =>
    getChapterLessons(i.classId, chapterId as number)
  );
export const useLesson = (slug: string | undefined) =>
  useWithIds<LessonDetail>(slug ? `lesson:${slug}` : null, (i) => getLesson(i.boardId, i.classId, slug as string));