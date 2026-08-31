import { useEffect, useState, useCallback } from "react";
import { Badge } from "../types";
import { fetchBadgesRaw, VocabApiError } from "../services/vocabApi";
import { mapBadge } from "../services/mappers";

// Replaces the old static `data/badges.ts` (`allBadges`) with a
// live call to GET /api/vocab/badges. No auth needed.
export function useBadgesData() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchBadgesRaw();
      const list = res?.data ?? res ?? [];
      setBadges(Array.isArray(list) ? list.map(mapBadge) : []);
    } catch (err) {
      setError(
        err instanceof VocabApiError
          ? err.message
          : "Could not load badges right now.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { badges, isLoading, error, refetch: load };
}
