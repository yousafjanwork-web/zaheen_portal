/**
 * useVideoProgress.ts  — v6
 *
 * What changed from v5:
 *
 *  FIX — resolveUserId() now also saves the user's display name.
 *    After calling GET /api/users?msisdn=… we read data.name and
 *    data.username from the response.  If either exists we write it
 *    to localStorage as "user_name" and dispatch a "userResolved"
 *    CustomEvent on window so the navbar can update immediately
 *    without a page reload.
 *
 *    Priority:  data.name  →  data.username  →  nothing saved
 *    Fallback in the navbar: if "user_name" is empty, show msisdn
 *    (handled by useUserDisplayName hook — see that file).
 *
 *  Everything else (throttle, beacon, safeDuration, bulk pre-load,
 *  per-video fetch, flush-on-unload) is UNCHANGED from v5.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const BASE         = "https://api.zaheen.com.pk/v2";
const THROTTLE_MS  = 10_000;

/* ─────────────────────────────────────────────────────────────
   User ID helper
   Step 1: read msisdn from localStorage (saved at login).
   Step 2: if we already resolved user_id once, return it instantly.
   Step 3: otherwise call GET /api/users?msisdn=… and cache the result.
──────────────────────────────────────────────────────────────── */
let _cachedUserId: number | null = null;

// ↓ exported so useUserDisplayName can call it directly from the navbar
export async function resolveUserId(): Promise<number | null> {
  // Already resolved this session
  if (_cachedUserId !== null) return _cachedUserId;

  const stored      = localStorage.getItem("user_id");
  const nameIsSaved = !!localStorage.getItem("user_name");

  // If we already have BOTH the id AND the name cached, return instantly.
  // Bug fix: previously we returned as soon as user_id was found, which
  // skipped the name fetch entirely on sessions after the first login.
  if (stored && nameIsSaved) {
    _cachedUserId = Number(stored);
    return _cachedUserId;
  }

  // We need the API — either to get the id for the first time,
  // or because we have the id but the name was never fetched yet.
  const msisdn = localStorage.getItem("msisdn");
  if (!msisdn) {
    if (stored) { _cachedUserId = Number(stored); return _cachedUserId; }
    return null;
  }

  try {
    const res = await fetch(
      `${BASE}/api/users?msisdn=${encodeURIComponent(msisdn)}`,
      { headers: { "Content-Type": "application/json" } }
    );
    if (!res.ok) {
      if (stored) { _cachedUserId = Number(stored); return _cachedUserId; }
      return null;
    }
    const json = await res.json();

    // ── v5 had: const id = json?.data?.id
    // ── v6 reads the whole data object so we can also grab the name
    const data = json?.data;
    const id: number | undefined = data?.id;
    if (!id) return null;

    _cachedUserId = id;
    localStorage.setItem("user_id", String(id));

    // ── NEW in v6: save display name ──────────────────────────
    // Priority: real name ("Fits Testing") → username → nothing
    // If nothing, navbar falls back to msisdn via useUserDisplayName
    const displayName: string =
      data?.name?.trim() ||
      data?.username?.trim() ||
      "";
    if (displayName) {
      localStorage.setItem("user_name", displayName);
    }

    // ── NEW in v6: notify the navbar in the same browser tab ──
    // window "storage" event only fires in OTHER tabs, so we
    // dispatch a custom event that useUserDisplayName listens for.
    window.dispatchEvent(
      new CustomEvent("userResolved", {
        detail: { id, name: displayName || msisdn },
      })
    );

    return id;
  } catch {
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
   Auth headers — Content-Type only (no token in this app)
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
   Safe duration helper — avoids sending NaN / Infinity
──────────────────────────────────────────────────────────────── */
function safeDuration(d: number): number {
  if (!d || !isFinite(d) || isNaN(d)) return 0;
  return Math.round(d);
}

/* ─────────────────────────────────────────────────────────────
   API — POST /api/videos/progress
   Body: { user_id, video_id, watched_seconds, last_position, total_duration }
──────────────────────────────────────────────────────────────── */
async function postProgress(payload: {
  video_id:        number;
  watched_seconds: number;
  last_position:   number;
  total_duration:  number;
}) {
  if (payload.total_duration <= 0) return;

  const user_id = getUserIdSync();
  if (!user_id) return; // not logged in / not resolved yet

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
   API — beacon on tab-close / unload (sync XHR)
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
    xhr.open("POST", `${BASE}/api/videos/progress`, false); // sync on unload
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ user_id, ...payload }));
  } catch { /* page is unloading — ignore */ }
}

/* ─────────────────────────────────────────────────────────────
   API — POST /api/videos/view
   Body: { user_id, video_id, watched_seconds }
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
   Response shape (v2):
   {
     data: {
       current_video: {
         duration_seconds: number,
         progress: {
           watched_seconds: number,
           last_position:   number,
           percentage_watched: number,
           completed: 0 | 1
         }
       }
     }
   }
──────────────────────────────────────────────────────────────── */
async function fetchJourney(videoId: number): Promise<VideoProgress | null> {
  const user_id = getUserIdSync();
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
    resolveUserId(); // fire-and-forget; caches result for all subsequent calls
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
      // Make sure user_id is resolved before firing 20+ requests
      await resolveUserId();
      if (cancelled) return;

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
      await resolveUserId(); // ensure id is ready
      const r = await fetchJourney(videoId);
      if (!r) return 0;

      const pct =
        r.total_duration > 0
          ? Math.min(100, Math.round((r.watched_seconds / r.total_duration) * 100))
          : 0;

      setProgressMap((p) => ({ ...p, [videoId]: pct }));
      if (r.is_completed || pct >= 95) setWatchedSet((s) => new Set(s).add(videoId));
      lastPositionRef.current = { ...lastPositionRef.current, [videoId]: r.last_position };
      setLastPositionMap((p) => ({ ...p, [videoId]: r.last_position }));

      return r.last_position; // ← used by selectVideo to seek the <video>
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
      if (!dur) return; // metadata not loaded yet

      const pct = Math.min(100, Math.round((currentTime / dur) * 100));
      setProgressMap((p) => ({ ...p, [videoId]: pct }));
      setPosition(videoId, Math.round(currentTime));

      if (!isLoggedIn) return;

      // Accumulate the latest state; the throttle will flush it
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

  /* ── View tracking (fires once per video on first play) ──── */
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