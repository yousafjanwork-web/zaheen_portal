import { useEffect, useState, useCallback } from "react";
import {
  fetchDashboardRaw,
  VocabApiError,
} from "../services/vocabApi";
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
export function useVocabDashboard(token: string | null | undefined) {
  const [data, setData] = useState<VocabDashboardData>(ZERO_DASHBOARD);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      // Not logged in — don't call the API, just show zeros.
      setData(ZERO_DASHBOARD);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardRaw(token);
      setData(mapDashboard(res));
    } catch (err) {
      setError(
        err instanceof VocabApiError
          ? err.message
          : "Could not load your dashboard right now.",
      );
      setData(ZERO_DASHBOARD);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch: load, isLoggedIn: !!token };
}
