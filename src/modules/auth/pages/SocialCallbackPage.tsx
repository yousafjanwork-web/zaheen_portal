/**
 * SocialCallbackPage.tsx
 *
 * Handles the redirect back from Google / Facebook OAuth.
 * Works for BOTH normal Zaheen users AND MDCAT users.
 *
 * MDCAT users are identified by the `state` param passed through Google OAuth.
 * Normal Zaheen users have no `state` param — their flow is unchanged.
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

      // Check if this login came from MDCAT via state param
      const stateParam = searchParams.get("state");
      let mdcatReturn: { from: string; mdcat: true } | null = null;
      if (stateParam) {
        try {
          const parsed = JSON.parse(decodeURIComponent(stateParam));
          if (parsed?.mdcat === true) {
            mdcatReturn = parsed;
            localStorage.setItem("mdcat_return", JSON.stringify(parsed));
          }
        } catch { /* ignore */ }
      }

      // ── Guard: missing params ──
      if (!token || !userId) {
        setError("Sign-in failed — missing session data. Please try again.");
        return;
      }

      const userIdNum = Number(userId);

      setStatus("Checking your account…");
      try {
        const setupStatus = await getSetupStatus(userIdNum);
        setStatus("Opening your account…");

        // ── MDCAT fast-track ──────────────────────────────────────────────
        if (mdcatReturn?.mdcat === true) {
          loginWithUser({
            msisdn:           "",
            userId:           userIdNum,
            isKid:            false,
            role:             "learner",
            selectedClassId:  null,
            selectedCourseId: null,
            displayName:      name.trim() || email.trim(),
            token,
          });
          setStatus("Checking your MDCAT profile…");
          try {
            const { getDashboard } = await import("@/modules/shared/services/lmsService");
            const dashboard = await getDashboard(userIdNum);
            const userMsisdn = dashboard?.user?.msisdn ?? null;
            if (userMsisdn) {
              // Already has mobile — go straight to MDCAT page
              const returnPath = mdcatReturn.from ?? "/mdcat";
              localStorage.removeItem("mdcat_return");
              navigate(returnPath, { replace: true });
            } else {
              // No mobile — go to MDCAT profile page to collect it
              navigate("/mdcat-profile", { replace: true });
            }
          } catch {
            navigate("/mdcat-profile", { replace: true });
          }
          return;
        }
        // ── end MDCAT fast-track ──────────────────────────────────────────

        // ── Normal Zaheen flow ────────────────────────────────────────────
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-full max-w-sm px-6 py-5 rounded-2xl text-sm flex items-start gap-3"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
          <span className="mt-0.5">⚠</span>
          <div>
            <p className="font-semibold mb-1">Sign-in failed</p>
            <p>{error}</p>
          </div>
        </div>
        <button onClick={() => navigate("/subscribe", { replace: true })}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)", color: "#0f172a" }}>
          ← Back to Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
      <p className="text-slate-400 text-sm">{status}</p>
    </div>
  );
};

export default SocialCallbackPage;