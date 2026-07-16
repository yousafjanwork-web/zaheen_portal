/**
 * useUserDisplayName.ts
 *
 * Returns the best display label for the logged-in user:
 *   1. name   (e.g. "Fits Testing")   — from GET /api/users?msisdn=…
 *   2. username (e.g. "ali123")        — fallback if name is empty
 *   3. msisdn  (e.g. "923111185557")  — shown while name loads / if no name exists
 *
 * WHY THE NAME WASN'T SHOWING BEFORE:
 *   resolveUserId() was only called when useVideoProgress mounted (video pages).
 *   If the user stayed on the home page, it never ran, so user_name was never
 *   saved to localStorage, and the navbar kept showing the phone number.
 *
 * THE FIX:
 *   This hook now calls resolveUserId() itself the moment the navbar mounts.
 *   resolveUserId() is cached — the second call costs nothing (returns instantly).
 *   When it completes it saves "user_name" to localStorage AND fires the
 *   "userResolved" CustomEvent, which updates the navbar state immediately.
 *
 * USAGE in your Navbar component:
 *
 *   import { useUserDisplayName } from "@/modules/shared/hooks/useUserDisplayName";
 *
 *   const Navbar = () => {
 *     const displayName = useUserDisplayName();
 *     return <span>{displayName}</span>;   // replaces the raw msisdn
 *   };
 */

import { useEffect, useState } from "react";
import { resolveUserId } from "@/modules/shared/hooks/Usevideoprogress";

/* ─── Read the best available name from localStorage ─── */
function readName(): string {
  return (
    localStorage.getItem("user_name") ||  // real name ("Fits Testing")
    localStorage.getItem("msisdn")    ||  // phone number fallback
    ""
  );
}

export function useUserDisplayName(): string {
  const [name, setName] = useState<string>(readName);

  useEffect(() => {
    // ── Set up listeners FIRST (synchronous) ─────────────────

    // Fires when resolveUserId() completes in the SAME tab
    const onResolved = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.name) setName(detail.name);
    };

    // Fires when another tab writes to localStorage (cross-tab sync)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user_name" || e.key === "msisdn") setName(readName());
    };

    window.addEventListener("userResolved", onResolved);
    window.addEventListener("storage",      onStorage);

    // ── Read current value immediately ───────────────────────
    // This shows the name straight away if it was already saved
    // in a previous session or earlier in this session.
    setName(readName());

    // ── THE KEY FIX: trigger the lookup right now ─────────────
    // resolveUserId() is cached after the first call, so this is
    // free on subsequent renders. On first run it calls the API,
    // saves user_name to localStorage, and dispatches "userResolved"
    // which the listener above catches → setName() → navbar updates.
    const msisdn = localStorage.getItem("msisdn");
    if (msisdn && !localStorage.getItem("user_name")) {
      // Only call if we don't already have the name
      resolveUserId().then(() => {
        // resolveUserId already dispatches "userResolved" which
        // triggers onResolved above. But read again as a safety net.
        setName(readName());
      });
    }

    return () => {
      window.removeEventListener("userResolved", onResolved);
      window.removeEventListener("storage",      onStorage);
    };
  }, []);

  return name;
}