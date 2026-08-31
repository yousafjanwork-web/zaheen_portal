import { useEffect, useState, useCallback } from "react";
import {
  fetchDashboardRaw,
  VocabApiError,
} from "../services/vocabApi";
import { getItem } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/storage";
import {
  mapDashboard,
  VocabDashboardData,
  ZERO_DASHBOARD,
} from "../services/mappers";

// GET /api/vocab/dashboard requires the logged-in user's Bearer
// token. Per sir's instructions: if nobody is logged in, we never
// call this endpoint at all — we just render the zero state.
//
// `token` should come from Zaheen's own auth (the same token used
// elsewhere in the site) — pass `null`/`undefined` when there is no
// logged-in user.
function loadFromLocalStorage(): VocabDashboardData {
  const user = getItem<any>(STORAGE_KEYS.USER, null);
  const completedLessonIds = getItem<string[]>(STORAGE_KEYS.COMPLETED_LESSONS, []);
  const badges = getItem<any[]>(STORAGE_KEYS.BADGES, []);
  if (!user) return ZERO_DASHBOARD;
  return {
    xp:                 user.xp              ?? 0,
    level:              user.level            ?? 1,
    streak:             getItem<number>(STORAGE_KEYS.STREAK, 0),
    coins:              user.coins            ?? 0,
    wordsLearned:       user.wordsLearned     ?? 0,
    lessonsCompleted:   user.lessonsCompleted ?? 0,
    completedLessonIds,
    unlockedBadges:     badges,
  };
}

export function useVocabDashboard(token: string | null | undefined, isLoggedIn?: boolean) {
  const [data, setData] = useState<VocabDashboardData>(() =>
    isLoggedIn ? loadFromLocalStorage() : ZERO_DASHBOARD
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isLoggedIn) {
      setData(ZERO_DASHBOARD);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Always load from localStorage first — instant, no flicker
    setData(loadFromLocalStorage());

    // If we have a token, also fetch from API to get server-side data
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardRaw(token);
      setData(mapDashboard(res));
    } catch (err) {
      // API failed — localStorage data is already showing, just clear loading
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoggedIn]);

  useEffect(() => {
    load();
  }, [load]);

    return { data, isLoading, error, refetch: load, isLoggedIn: !!isLoggedIn };
}
