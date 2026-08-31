import { useEffect, useState, useCallback } from "react";
import { LeaderboardEntry } from "../types";
import { fetchLeaderboardRaw, VocabApiError } from "../services/vocabApi";
import { mapLeaderboardEntry } from "../services/mappers";

// Replaces the old MOCK_LEADERS array in pages/Leaderboard.tsx with
// a live call to GET /api/vocab/leaderboard. No auth needed.
export function useLeaderboardData() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchLeaderboardRaw();
      const list = res?.data ?? res ?? [];
      setEntries(
        Array.isArray(list)
          ? list.map((raw: any, i: number) => mapLeaderboardEntry(raw, i))
          : [],
      );
    } catch (err) {
      setError(
        err instanceof VocabApiError
          ? err.message
          : "Could not load the leaderboard right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, isLoading, error, refetch: load };
}
