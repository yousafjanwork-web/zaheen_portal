import { useState, useEffect, useRef } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiOptions {
  enabled?: boolean;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = [],
  options: ApiOptions = {},
): ApiState<T> {
  const { enabled = true } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!enabled) {
      // Not ready to fetch yet (e.g. waiting on realId). Stay in a clean
      // "waiting" state — do NOT leave a stale error/data from a previous
      // fetch sitting around, or callers relying on `error` will briefly
      // render a false error state.
      setState({ data: null, loading: true, error: null });
      return;
    }

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
  }, [...deps, enabled]);

  return state;
}