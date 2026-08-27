import { useEffect, useState, useRef } from "react";
import { getUserProfile } from "@/modules/shared/services/profileService";
import { getDashboard } from "@/modules/shared/services/lmsService";
import { useAuth } from "@/modules/shared/context/AuthContext";

const NAME_CHANGED_EVENT = "zaheen:nameChanged";

export function useUserDisplayName(): string {
  const { msisdn, userId, isKid, displayName: contextDisplayName } = useAuth();

  const [name, setName] = useState<string>("");
  const fetchedFor = useRef<string>("");

  useEffect(() => {
    if (!msisdn && !userId) {
      setName("");
      fetchedFor.current = "";
      return;
    }

    const key = msisdn || String(userId);

    /* ── Listen for instant updates after profile save (parents) ── */
    const onNameChanged = (e: Event) => {
      const detail = (e as CustomEvent<{ msisdn: string; name: string }>).detail;
      if (detail?.msisdn === msisdn) {
        setName(detail.name || msisdn || "");
      }
    };
    window.addEventListener(NAME_CHANGED_EVENT, onNameChanged);

    if (fetchedFor.current !== key) {
      fetchedFor.current = key;

      if (msisdn && !isKid) {
        /* ── Parent: fetch by msisdn from API (source of truth) ── */
        getUserProfile(msisdn)
          .then((profile) => {
            if (!profile) return;
            setName(profile.name?.trim() || profile.username?.trim() || msisdn);
          })
          .catch(() => { fetchedFor.current = ""; });

      } else if (userId) {
        /* ── Child: fetch from dashboard API (no msisdn needed) ── */
        getDashboard(userId)
          .then((data) => {
            if (!data?.user) return;
            const n = data.user.name?.trim() || data.user.username?.trim() || "";
            setName(n);
          })
          .catch(() => {
            /* API failed — fall back to what came in the login response */
            if (contextDisplayName) setName(contextDisplayName);
            fetchedFor.current = "";
          });
      }
    }

    return () => {
      window.removeEventListener(NAME_CHANGED_EVENT, onNameChanged);
    };
  }, [msisdn, userId, isKid]);

  /* ── Sync when context changes (after profile save without re-login) ── */
  useEffect(() => {
    if (contextDisplayName) {
      setName(contextDisplayName);
    }
  }, [contextDisplayName]);

  return name;
}

export function notifyNameChanged(msisdn: string, newName: string): void {
  if (!msisdn) return;
  window.dispatchEvent(
    new CustomEvent(NAME_CHANGED_EVENT, {
      detail: { msisdn, name: newName?.trim() || msisdn },
    })
  );
}

export function clearDisplayNameCache(): void {
  window.dispatchEvent(
    new CustomEvent(NAME_CHANGED_EVENT, { detail: { msisdn: "", name: "" } })
  );
}

export function invalidateDisplayNameCache(newName: string): void {
  const msisdn = (() => {
    try { return localStorage.getItem("msisdn") || ""; } catch { return ""; }
  })();
  notifyNameChanged(msisdn, newName);
}