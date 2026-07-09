/**
 * Generic hook for API calls with loading / error state.
 * Usage:
 *   const { data, loading, error } = useApi(() => fetchCategories(), []);
 */

import { useState, useEffect, useRef } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  // Keep a stable ref to the fetcher so the effect doesn't re-run when an
  // inline arrow function is passed (identity changes on every render).
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetcherRef.current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Something went wrong';
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
