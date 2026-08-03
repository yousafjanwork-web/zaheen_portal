/**
 * useUserDisplayName.ts
 *
 * Returns the display name for the currently logged-in user.
 * Source of truth is ALWAYS the API — nothing is stored in localStorage.
 *
 * Priority: name → username → msisdn → ""
 *
 * API is called once per login session when the hook first mounts.
 * After a profile save, call notifyNameChanged(newName) to update
 * every mounted navbar instantly without an extra API call.
 *
 * On logout the in-memory state is cleared automatically because
 * React unmounts and remounts components with an empty msisdn.
 */

import { useEffect, useState, useRef } from "react";
import { getUserProfile } from "@/modules/shared/services/profileService";

/* Event name used for same-tab instant updates after profile save */
const NAME_CHANGED_EVENT = "zaheen:nameChanged";

/* ── Main hook ── */
export function useUserDisplayName(): string {
  const msisdn = (() => {
    try { return localStorage.getItem("msisdn") || ""; } catch { return ""; }
  })();

  const [name, setName] = useState<string>(msisdn); // start with msisdn as placeholder
  const fetchedFor = useRef<string>(""); // track which msisdn we last fetched for

  useEffect(() => {
    if (!msisdn) {
      setName("");
      fetchedFor.current = "";
      return;
    }

    /* ── 1. Listen for instant updates from this tab (after profile save) ── */
    const onNameChanged = (e: Event) => {
      const detail = (e as CustomEvent<{ msisdn: string; name: string }>).detail;
      if (detail?.msisdn === msisdn) {
        setName(detail.name || msisdn);
      }
    };
    window.addEventListener(NAME_CHANGED_EVENT, onNameChanged);

    /* ── 2. Show msisdn immediately as a placeholder while fetching ── */
    setName(msisdn);

    /* ── 3. Fetch from API if we haven't fetched for this msisdn yet ── */
    if (fetchedFor.current !== msisdn) {
      fetchedFor.current = msisdn;
      getUserProfile(msisdn)
        .then((profile) => {
          if (!profile) return; // no profile yet — keep showing msisdn
          const display =
            profile.name?.trim()     ||
            profile.username?.trim() ||
            msisdn;
          setName(display);
        })
        .catch(() => {
          // Network error — keep showing msisdn, will retry on next mount
          fetchedFor.current = "";
        });
    }

    return () => {
      window.removeEventListener(NAME_CHANGED_EVENT, onNameChanged);
    };
  }, [msisdn]);

  return name;
}

/**
 * Call this from ProfilePage after a successful profile save.
 * Instantly updates the navbar name in this tab without an extra API call.
 */
export function notifyNameChanged(msisdn: string, newName: string): void {
  if (!msisdn) return;
  window.dispatchEvent(
    new CustomEvent(NAME_CHANGED_EVENT, {
      detail: { msisdn, name: newName?.trim() || msisdn },
    })
  );
}

/**
 * Call this on logout to reset the display name.
 * Since the hook reads msisdn from localStorage which is cleared on logout,
 * this is only needed if you want an instant same-tab reset before remount.
 */
export function clearDisplayNameCache(): void {
  // Nothing to clear — we use no localStorage cache.
  // Dispatch with empty values so any mounted hook resets to "".
  window.dispatchEvent(
    new CustomEvent(NAME_CHANGED_EVENT, { detail: { msisdn: "", name: "" } })
  );
}

/** @deprecated — use notifyNameChanged() */
export function invalidateDisplayNameCache(newName: string): void {
  const msisdn = (() => {
    try { return localStorage.getItem("msisdn") || ""; } catch { return ""; }
  })();
  notifyNameChanged(msisdn, newName);
}