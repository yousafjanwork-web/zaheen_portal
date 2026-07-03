/**
 * useVideoProgress.ts  — v4
 *
 * Fixes vs v3:
 *
 *  BUG 1 — POST /view → 400
 *    The backend JWT middleware expects an "Authorization: Bearer <token>"
 *    header.  credentials:"include" only sends cookies; if your backend
 *    uses token-based auth the cookie alone is ignored and the request
 *    arrives unauthenticated → 400/401.
 *    Fix: getAuthHeaders() reads the token from localStorage (adjust the
 *    key name to match wherever YOUR app stores the JWT) and merges it
 *    into every POST and GET header.
 *
 *  BUG 2 — POST /progress → 400
 *    Two sub-causes:
 *    a) content_type:"video" — the v2 backend does NOT have this field in
 *       its validated schema.  Sending an unexpected required-field-style
 *       value can trip strict validation.  Removed.
 *    b) total_duration was sometimes 0 (sent before <video> metadata
 *       loaded, or when handleEnded fires on a stream whose duration is
 *       Infinity/NaN).  Now guarded: we skip the POST when duration is
 *       unknown, and clamp NaN/Infinity to 0.
 *
 *  BUG 3 — empty src="" warning
 *    Not fixed here (it lives in the page components) — see the note in
 *    each page's selectVideo: setVideoUrl must only be called AFTER
 *    fetchJourneyForVideo resolves, and the <video> element must not
 *    render until videoUrl is non-empty.  This hook adds no new state
 *    for that; the guard belongs in the component.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const BASE = "https://api.zaheen.com.pk/v2";
const THROTTLE_MS = 10_000;

/* ─────────────────────────────────────────────────────────────
   Auth helper
   Reads the JWT from localStorage.  Change "token" to whatever
   key your app uses (e.g. "authToken", "access_token", "jwt").
   If your app stores it in a cookie instead, remove the
   Authorization header — credentials:"include" will handle it.
──────────────────────────────────────────────────────────────── */
function getAuthHeaders(): Record<string, string> {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("access_token") ||
    "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/* ─────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
export interface VideoProgress {
  video_id: number;
  watched_seconds: number;
  last_position: number;
  total_duration: number;
  is_completed: boolean;
}

interface JourneyResponse {
  data?: {
    watched_seconds?: number;
    last_position?: number;
    total_duration?: number;
    is_completed?: boolean;
  };
}

/* ─────────────────────────────────────────────────────────────
   Safe duration helper — avoids sending NaN / Infinity
──────────────────────────────────────────────────────────────── */
function safeDuration(d: number): number {
  if (!d || !isFinite(d) || isNaN(d)) return 0;
  return Math.round(d);
}

/* ─────────────────────────────────────────────────────────────
   API helpers
──────────────────────────────────────────────────────────────── */

/**
 * POST /api/videos/progress
 * Payload: { video_id, watched_seconds, last_position, total_duration }
 * NOTE: content_type removed — not part of the v2 schema.
 */
async function postProgress(payload: {
  video_id: number;
  watched_seconds: number;
  last_position: number;
  total_duration: number;
}) {
  // Skip if duration is unknown — a 0-second POST is meaningless and
  // may fail backend validation.
  if (payload.total_duration <= 0) return;
  try {
    const res = await fetch(`${BASE}/api/videos/progress`, {
      method: "POST",
      headers: getAuthHeaders(),
      // credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[progress] ${res.status}`, text);
    }
  } catch (err) {
    // network hiccup — next tick will retry via throttle
    console.warn("[progress] network error", err);
  }
}

/**
 * Beacon version for tab-close / page-unload.
 * sendBeacon cannot set custom headers, so we fall back to a
 * synchronous XHR that CAN carry the Authorization header.
 */
function beaconProgress(payload: {
  video_id: number;
  watched_seconds: number;
  last_position: number;
  total_duration: number;
}) {
  if (payload.total_duration <= 0) return;
  const body = JSON.stringify(payload);
  const url  = `${BASE}/api/videos/progress`;

  // sendBeacon cannot set Authorization — use sync XHR as the only
  // reliable unload-safe mechanism when a token is required.
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // synchronous on unload
    const headers = getAuthHeaders();
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    // xhr.withCredentials = true;
    xhr.send(body);
  } catch { /* ignore — page is unloading */ }
}

/**
 * POST /api/videos/view
 * Payload: { video_id }
 */
async function postView(videoId: number) {
  try {
    const res = await fetch(`${BASE}/api/videos/view`, {
      method: "POST",
      headers: getAuthHeaders(),
      // credentials: "include",
      body: JSON.stringify({ video_id: videoId }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[view] ${res.status}`, text);
    }
  } catch (err) {
    console.warn("[view] network error", err);
  }
}

/**
 * GET /api/videos/learning-journey/:videoId
 */
async function fetchJourney(videoId: number): Promise<VideoProgress | null> {
  try {
    const res = await fetch(
      `${BASE}/api/videos/learning-journey/${videoId}`,
      { headers: getAuthHeaders() }
    );
    if (!res.ok) return null;
    const json: JourneyResponse = await res.json();
    const d = json.data;
    if (!d) return null;
    return {
      video_id: videoId,
      watched_seconds: d.watched_seconds ?? 0,
      last_position:   d.last_position   ?? 0,
      total_duration:  d.total_duration  ?? 0,
      is_completed:    d.is_completed    ?? false,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   Hook
──────────────────────────────────────────────────────────────── */
export function useVideoProgress(allVideoIds: number[], isLoggedIn: boolean) {
  const [progressMap,    setProgressMap]    = useState<Record<number, number>>({});
  const [watchedSet,     setWatchedSet]     = useState<Set<number>>(new Set());
  const [lastPositionMap,setLastPositionMap]= useState<Record<number, number>>({});

  const lastPositionRef = useRef<Record<number, number>>({});

  const pendingRef  = useRef<{
    video_id: number;
    watched_seconds: number;
    last_position: number;
    total_duration: number;
  } | null>(null);

  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  /* ── Bulk pre-load ───────────────────────────────────────── */
  useEffect(() => {
    if (!isLoggedIn || allVideoIds.length === 0) return;
    let cancelled = false;

    async function load() {
      const results = await Promise.all(allVideoIds.map(fetchJourney));
      if (cancelled) return;

      const newProgress:  Record<number, number> = {};
      const newWatched  = new Set<number>();
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

  /* ── Per-video fetch at selection time ───────────────────── */
  const fetchJourneyForVideo = useCallback(
    async (videoId: number): Promise<number> => {
      if (!isLoggedIn) return 0;
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

  /* ── onTimeUpdate ────────────────────────────────────────── */
  const handleTimeUpdate = useCallback(
    (videoId: number, currentTime: number, duration: number) => {
      const dur = safeDuration(duration);
      if (!dur) return; // no duration yet — skip

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

      if (!isLoggedIn || !dur) return; // skip POST if duration unknown
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