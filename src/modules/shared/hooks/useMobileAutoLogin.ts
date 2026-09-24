/**
 * useMobileAutoLogin.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads ?userId=XXXX from the URL query string. If found, fetches the user's
 * setup status from the backend and writes a zaheen_auth session into
 * localStorage — giving the user a silent login without showing any login UI.
 *
 * This is ONLY for mobile app deep-links (mdcat-mobile, vocab-mobile,
 * origami-mobile). It must not affect normal Zaheen web auth flow.
 *
 * Usage:
 *   const { ready } = useMobileAutoLogin();
 *   if (!ready) return <LoadingSpinner />;
 */

import { useState, useEffect } from "react";
import { getSetupStatus } from "@/modules/shared/services/lmsService";
import { useAuth } from "@/modules/shared/context/AuthContext";

const STORAGE_KEY = "zaheen_auth";

export function useMobileAutoLogin() {
  const [ready, setReady] = useState(false);
  const { loginWithUser, isLoggedIn, userId: currentUserId } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userIdParam = params.get("userId") || params.get("userid");

    // No userId in URL — nothing to do, render immediately
    if (!userIdParam) {
      setReady(true);
      return;
    }

    const userId = parseInt(userIdParam, 10);
    if (isNaN(userId)) {
      setReady(true);
      return;
    }

    // Already logged in as this same user in React state — skip re-login
    if (isLoggedIn && currentUserId === userId) {
      setReady(true);
      return;
    }

    // Fetch profile and call loginWithUser() so React state is updated
    (async () => {
      try {
        const status = await getSetupStatus(userId);

        // This updates BOTH React state AND localStorage — same as normal login
        loginWithUser({
          msisdn:           "",
          userId:           userId,
          isKid:            false,
          role:             status.role ?? null,
          selectedClassId:  status.selected_class_id ?? null,
          selectedCourseId: status.selected_course_id ?? null,
          displayName:      null,
          token:            null,
        });

        localStorage.setItem("user_id", String(userId));

      } catch (err) {
        console.warn("[useMobileAutoLogin] Could not auto-login userId:", userId, err);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  return { ready };
}