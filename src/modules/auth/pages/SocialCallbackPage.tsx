/**
 * SocialCallbackPage.tsx
 *
 * Handles the redirect back from Google / Facebook OAuth.
 * Backend redirects to:
 *   https://z.zaheen.com.pk/social-callback?token=JWT&user_id=123&name=John&email=john@gmail.com
 *
 * This page:
 *   1. Reads token, user_id, name, email from URL params
 *   2. Calls getSetupStatus(user_id) to check profile completion
 *   3. Logs user in via loginWithUser() — same as normal login flow
 *   4. Routes to /profile?setup=subscribe  (no profile yet)
 *         or  /packages                    (profile complete)
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { getSetupStatus } from "@/modules/shared/services/lmsService";

const SocialCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithUser } = useAuth();

  const [status, setStatus] = useState("Completing sign-in…");
  const [error, setError]   = useState("");

  useEffect(() => {
    const run = async () => {
      const token  = searchParams.get("token");
      const userId = searchParams.get("user_id");
      const name   = searchParams.get("name")  ?? "";
      const email  = searchParams.get("email") ?? "";
      // Read MDCAT state from URL param (passed through OAuth, survives domain change)
      const stateParam = searchParams.get("state");
      const parsedState = stateParam ? JSON.parse(decodeURIComponent(stateParam)) : null;
      if (parsedState?.mdcat === true) {
        localStorage.setItem("mdcat_return", JSON.stringify(parsedState));
      }

      // ── Guard: missing params ──
      if (!token || !userId) {
        setError("Sign-in failed — missing session data. Please try again.");
        return;
      }

      const userIdNum = Number(userId);

      // ── Check setup status ──
      setStatus("Checking your account…");
      try {
        const setupStatus = await getSetupStatus(userIdNum);

        setStatus("Opening your account…");

        // ── MDCAT fast-track — check FIRST before any loginWithUser call ──
        const storedMdcat = localStorage.getItem("mdcat_return");
        const parsedMdcat = storedMdcat ? JSON.parse(storedMdcat) : null;
        localStorage.removeItem("mdcat_return");

        if (parsedMdcat?.mdcat === true) {
          // User came from MDCAT — set as learner, skip ALL LMS setup
          // regardless of whether profile exists or not
          loginWithUser({
            msisdn:           "",
            userId:           userIdNum,
            isKid:            false,
            role:             "learner",
            selectedClassId:  setupStatus.selected_class_id  ?? null,
            selectedCourseId: setupStatus.selected_course_id ?? null,
            displayName:      name.trim() || email.trim(),
            token,
          });
          navigate(parsedMdcat.from ?? "/mdcat", { replace: true });
          return;
        }
        // ── end MDCAT fast-track ──────────────────────────────────────────

        // ── Normal flow: log in then route based on profile completion ──
        loginWithUser({
          msisdn:           "",
          userId:           userIdNum,
          isKid:            false,
          role:             setupStatus.role              ?? null,
          selectedClassId:  setupStatus.selected_class_id  ?? null,
          selectedCourseId: setupStatus.selected_course_id ?? null,
          displayName:      name.trim() || email.trim(),
          token,
        });

        if (!setupStatus.is_profile_complete) {
          navigate("/profile?setup=true", { replace: true });
        } else if (!setupStatus.has_role) {
          navigate("/setup/role", { replace: true });
        } else if ((setupStatus.role === "learner" || setupStatus.role === "both") && !setupStatus.has_grade) {
          navigate("/setup/grade-course", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }

      } catch {
        setError("Sign-in succeeded but we couldn't load your account. Please try again.");
      }
    };

    run();
  }, []);

  // ── Error screen ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 px-4">
        <div
          className="w-full max-w-sm px-6 py-5 rounded-2xl text-sm flex items-start gap-3"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "#fca5a5",
          }}
        >
          <span className="mt-0.5">⚠</span>
          <div>
            <p className="font-semibold mb-1">Sign-in failed</p>
            <p>{error}</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/subscribe", { replace: true })}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{
            background: "linear-gradient(135deg,#F0B429,#f59e0b)",
            color: "#0f172a",
          }}
        >
          ← Back to Sign Up
        </button>
      </div>
    );
  }

  // ── Loading screen ──
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
      <p className="text-slate-400 text-sm">{status}</p>
    </div>
  );
};

export default SocialCallbackPage;