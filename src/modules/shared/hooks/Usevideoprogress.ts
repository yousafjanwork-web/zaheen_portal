/**
 * useVideoProgress.ts  — v8
 *
 * What changed from v7:
 *
 *  FIX — fetchJourney() now awaits resolveUserId() instead of calling
 *    getUserIdSync(). This eliminates a race condition where the bulk
 *    pre-load effect fired before the async user ID resolve had settled
 *    (e.g. on a fresh remount with cached chapter data), causing all
 *    17+ progress fetches to return null and progressMap to stay empty —
 *    showing "Not started" on every card despite saved progress.
 *
 *    Since resolveUserId() caches its result in _cachedUserId after the
 *    first call, the 20+ parallel fetchJourney() calls in Promise.all
 *    all hit the fast path and cost nothing extra.
 *
 *    Also removed the now-redundant standalone await resolveUserId()
 *    at the top of the bulk load() function — fetchJourney handles it.
 *
 *  Everything else (throttle, beacon, safeDuration, clearUserCache,
 *  per-video fetch, flush-on-unload) is UNCHANGED from v7.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const BASE        = "https://api.zaheen.com.pk/v2";
const THROTTLE_MS = 10_000;

/* ─────────────────────────────────────────────────────────────
   Module-level cache — valid only for the current logged-in user.
   Call clearUserCache() at logout to invalidate it.
──────────────────────────────────────────────────────────────── */
let _cachedUserId: number | null = null;

/**
 * Call this during logout, BEFORE wiping localStorage.
 * Resets the in-memory cache so the next login resolves fresh.
 */
export function clearUserCache(): void {
  _cachedUserId = null;
}

/* ─────────────────────────────────────────────────────────────
   User ID helper
──────────────────────────────────────────────────────────────── */
export async function resolveUserId(): Promise<number | null> {
  const storedRaw = localStorage.getItem("user_id");
  const storedId  = storedRaw ? Number(storedRaw) : null;

  // If the cache belongs to a different user, invalidate it.
  if (_cachedUserId !== null && _cachedUserId !== storedId) {
    _cachedUserId = null;
  }

  const nameIsSaved = !!localStorage.getItem("user_name");

  // Both id and name already resolved for this user — fast path.
  if (_cachedUserId !== null && nameIsSaved) {
    return _cachedUserId;
  }

  // Need the API — either first login, or name was never fetched.
  const msisdn = localStorage.getItem("msisdn");
  if (!msisdn) {
    if (storedId) { _cachedUserId = storedId; return _cachedUserId; }
    return null;
  }

  try {
    const res = await fetch(
      `${BASE}/api/users?msisdn=${encodeURIComponent(msisdn)}`,
      { headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) {
      if (storedId) { _cachedUserId = storedId; return _cachedUserId; }
      return null;
    }
    const json = await res.json();
    const data = json?.data;
    const id: number | undefined = data?.id;
    if (!id) return null;

    _cachedUserId = id;
    localStorage.setItem("user_id", String(id));

    const displayName: string =
      data?.name?.trim() ||
      data?.username?.trim() ||
      "";
    if (displayName) {
      localStorage.setItem("user_name", displayName);
    }

    window.dispatchEvent(
      new CustomEvent("userResolved", {
        detail: { id, name: displayName || msisdn },
      })
    );

    return id;
  } catch {
    if (storedId) { _cachedUserId = storedId; return _cachedUserId; }
    return null;
  }
}

/** Synchronous read — only works after resolveUserId() has been called once */
function getUserIdSync(): number | null {
  if (_cachedUserId !== null) return _cachedUserId;
  const stored = localStorage.getItem("user_id");
  if (stored) {
    _cachedUserId = Number(stored);
    return _cachedUserId;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────
   Auth headers
──────────────────────────────────────────────────────────────── */
function getHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}

/* ─────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
export interface VideoProgress {
  video_id:        number;
  watched_seconds: number;
  last_position:   number;
  total_duration:  number;
  is_completed:    boolean;
}

/* ─────────────────────────────────────────────────────────────
   Safe duration helper
──────────────────────────────────────────────────────────────── */
function safeDuration(d: number): number {
  if (!d || !isFinite(d) || isNaN(d)) return 0;
  return Math.round(d);
}

/* ─────────────────────────────────────────────────────────────
   API — POST /api/videos/progress
──────────────────────────────────────────────────────────────── */
async function postProgress(payload: {
  video_id:        number;
  watched_seconds: number;
  last_position:   number;
  total_duration:  number;
}) {
  if (payload.total_duration <= 0) return;
  const user_id = getUserIdSync();
  if (!user_id) return;

  try {
    const res = await fetch(`${BASE}/api/videos/progress`, {
      method:  "POST",
      headers: getHeaders(),
      body:    JSON.stringify({ user_id, ...payload }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[progress] ${res.status}`, text);
    }
  } catch (err) {
    console.warn("[progress] network error", err);
  }
}

/* ─────────────────────────────────────────────────────────────
   API — beacon on tab-close / unload
──────────────────────────────────────────────────────────────── */
function beaconProgress(payload: {
  video_id:        number;
  watched_seconds: number;
  last_position:   number;
  total_duration:  number;
}) {
  if (payload.total_duration <= 0) return;
  const user_id = getUserIdSync();
  if (!user_id) return;

  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE}/api/videos/progress`, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ user_id, ...payload }));
  } catch { /* page is unloading — ignore */ }
}

/* ─────────────────────────────────────────────────────────────
   API — POST /api/videos/view
──────────────────────────────────────────────────────────────── */
async function postView(videoId: number) {
  const user_id = getUserIdSync();
  if (!user_id) return;

  try {
    const res = await fetch(`${BASE}/api/videos/view`, {
      method:  "POST",
      headers: getHeaders(),
      body:    JSON.stringify({ user_id, video_id: videoId, watched_seconds: 0 }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[view] ${res.status}`, text);
    }
  } catch (err) {
    console.warn("[view] network error", err);
  }
}

/* ─────────────────────────────────────────────────────────────
   API — GET /api/videos/learning-journey/:videoId?user_id=…

   FIX (v8): now awaits resolveUserId() instead of getUserIdSync().
   This ensures the user ID is always ready before firing the fetch,
   even on a fresh remount where _cachedUserId hasn't settled yet.
──────────────────────────────────────────────────────────────── */
async function fetchJourney(videoId: number): Promise<VideoProgress | null> {
  const user_id = await resolveUserId(); // ← was getUserIdSync()
  if (!user_id) return null;

  try {
    const res = await fetch(
      `${BASE}/api/videos/learning-journey/${videoId}?user_id=${user_id}`,
      { headers: getHeaders() }
    );
    if (!res.ok) return null;

    const json = await res.json();
    const cv   = json?.data?.current_video;
    if (!cv) return null;

    const progress       = cv.progress ?? {};
    const total_duration = safeDuration(cv.duration_seconds ?? 0);

    return {
      video_id:        videoId,
      watched_seconds: progress.watched_seconds ?? 0,
      last_position:   progress.last_position   ?? 0,
      total_duration,
      is_completed:    Boolean(progress.completed),
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   Hook
──────────────────────────────────────────────────────────────── */
export function useVideoProgress(allVideoIds: number[], isLoggedIn: boolean) {
  const [progressMap,     setProgressMap]     = useState<Record<number, number>>({});
  const [watchedSet,      setWatchedSet]      = useState<Set<number>>(new Set());
  const [lastPositionMap, setLastPositionMap] = useState<Record<number, number>>({});

  const lastPositionRef = useRef<Record<number, number>>({});
  const pendingRef      = useRef<{
    video_id:        number;
    watched_seconds: number;
    last_position:   number;
    total_duration:  number;
  } | null>(null);
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Resolve user_id as soon as the user is logged in ───── */
  useEffect(() => {
    if (!isLoggedIn) return;
    resolveUserId();
  }, [isLoggedIn]);

  /* ── helpers ─────────────────────────────────────────────── */
  const setPosition = useCallback((videoId: number, pos: number) => {
    lastPositionRef.current = { ...lastPositionRef.current, [videoId]: pos };
    setLastPositionMap((p) => ({ ...p, [videoId]: pos }));
  }, []);

  const flushPending = useCallback(() => {
    if (!isLoggedIn || !pendingRef.current) return;
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
      throttleRef.current = null;
    }
    beaconProgress(pendingRef.current);
    pendingRef.current = null;
  }, [isLoggedIn]);

  /* ── Bulk pre-load when the subject page opens ───────────── */
  useEffect(() => {
    if (!isLoggedIn || allVideoIds.length === 0) return;
    let cancelled = false;

    async function load() {
      if (cancelled) return;

      // fetchJourney() now calls resolveUserId() internally, so we no
      // longer need a standalone await resolveUserId() here. The first
      // of the parallel calls will resolve the ID; the rest hit the
      // fast-path cache (_cachedUserId) at zero cost.
      const results = await Promise.all(allVideoIds.map(fetchJourney));
      if (cancelled) return;

      const newProgress:  Record<number, number> = {};
      const newWatched    = new Set<number>();
      const newPositions: Record<number, number> = {};

      results.forEach((r) => {
        if (!r) return;
        const pct =
          r.total_duration > 0
            ? Math.min(100, Math.round((r.watched_seconds / r.total_duration) * 100))
            : 0;
        newProgress[r.video_id]  = pct;
        newPositions[r.video_id] = r.last_position;
        if (r.is_completed || pct >= 95) newWatched.add(r.video_id);
      });

      setProgressMap(newProgress);
      lastPositionRef.current = newPositions;
      setLastPositionMap(newPositions);
      setWatchedSet(newWatched);
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, allVideoIds.join(",")]);

  /* ── Per-video fetch when user clicks a video ────────────── */
  const fetchJourneyForVideo = useCallback(
    async (videoId: number): Promise<number> => {
      if (!isLoggedIn) return 0;
      const r = await fetchJourney(videoId); // resolveUserId() handled inside
      if (!r) return 0;

      const pct =
        r.total_duration > 0
          ? Math.min(100, Math.round((r.watched_seconds / r.total_duration) * 100))
          : 0;

      setProgressMap((p) => ({ ...p, [videoId]: pct }));
      if (r.is_completed || pct >= 95) setWatchedSet((s) => new Set(s).add(videoId));
      lastPositionRef.current = { ...lastPositionRef.current, [videoId]: r.last_position };
      setLastPositionMap((p) => ({ ...p, [videoId]: r.last_position }));

      return r.last_position;
    },
    [isLoggedIn]
  );

  /* ── Tab-hide / page-unload ──────────────────────────────── */
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushPending();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flushPending);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flushPending);
    };
  }, [flushPending]);

  /* ── Cleanup on unmount ──────────────────────────────────── */
  useEffect(
    () => () => {
      flushPending();
      if (throttleRef.current) clearTimeout(throttleRef.current);
    },
    [flushPending]
  );

  /* ── onTimeUpdate (called every ~250 ms by the <video>) ──── */
  const handleTimeUpdate = useCallback(
    (videoId: number, currentTime: number, duration: number) => {
      const dur = safeDuration(duration);
      if (!dur) return;

      const pct = Math.min(100, Math.round((currentTime / dur) * 100));
      setProgressMap((p) => ({ ...p, [videoId]: pct }));
      setPosition(videoId, Math.round(currentTime));

      if (!isLoggedIn) return;

      pendingRef.current = {
        video_id:        videoId,
        watched_seconds: Math.round(currentTime),
        last_position:   Math.round(currentTime),
        total_duration:  dur,
      };

      if (!throttleRef.current) {
        throttleRef.current = setTimeout(() => {
          throttleRef.current = null;
          if (!pendingRef.current) return;
          postProgress(pendingRef.current);
        }, THROTTLE_MS);
      }
    },
    [isLoggedIn, setPosition]
  );

  /* ── onEnded ─────────────────────────────────────────────── */
  const handleEnded = useCallback(
    (videoId: number, duration: number) => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
      pendingRef.current = null;

      const dur = safeDuration(duration);
      setProgressMap((p) => ({ ...p, [videoId]: 100 }));
      setPosition(videoId, dur);
      setWatchedSet((s) => new Set(s).add(videoId));

      if (!isLoggedIn || !dur) return;
      postProgress({
        video_id:        videoId,
        watched_seconds: dur,
        last_position:   dur,
        total_duration:  dur,
      });
    },
    [isLoggedIn, setPosition]
  );

  /* ── View tracking ───────────────────────────────────────── */
  const handleView = useCallback(
    (videoId: number) => {
      if (!isLoggedIn) return;
      postView(videoId);
    },
    [isLoggedIn]
  );

  const flushBeforeSwitch = flushPending;

  return {
    progressMap,
    watchedSet,
    lastPositionMap,
    lastPositionRef,
    fetchJourneyForVideo,
    handleTimeUpdate,
    handleEnded,
    handleView,
    flushBeforeSwitch,
  };
}