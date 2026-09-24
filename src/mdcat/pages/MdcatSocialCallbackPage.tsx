/**
 * MdcatSocialCallbackPage.tsx
 * 
 * Handles Google OAuth redirect for MDCAT users ONLY.
 * Normal Zaheen users use /social-callback instead.
 * 
 * Route: /mdcat-social-callback
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";

const MdcatSocialCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithUser } = useAuth();
  const [status, setStatus] = useState("Completing sign-in…");

  const getReturnPath = () => {
    try {
      const stored = localStorage.getItem("mdcat_return");
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed?.from ?? "/mdcat";
    } catch { return "/mdcat"; }
  };

  useEffect(() => {
    const run = async () => {
      const token  = searchParams.get("token");
      const userId = searchParams.get("user_id");
      const name   = searchParams.get("name")  ?? "";
      const email  = searchParams.get("email") ?? "";

      if (!token || !userId) {
        navigate("/mdcat-login", { replace: true });
        return;
      }

      const userIdNum = Number(userId);

      // Log user in immediately
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

      setStatus("Checking your profile…");

      try {
        const { getDashboard } = await import("@/modules/shared/services/lmsService");
        const dashboard = await getDashboard(userIdNum);
        const userMsisdn = dashboard?.user?.msisdn ?? null;
        const returnPath = getReturnPath();

        if (userMsisdn) {
          // Already has mobile — go straight to the MDCAT page
          localStorage.removeItem("mdcat_return");
          navigate(returnPath, { replace: true });
        } else {
          // No mobile — needs MDCAT profile setup page
          // Keep mdcat_return so MdcatProfilePage knows where to go after
          navigate("/mdcat-profile", { replace: true });
        }
      } catch {
        // On error — send to profile setup to be safe
        navigate("/mdcat-profile", { replace: true });
      }
    };

    run();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 rounded-full border-2 border-sky-400/30 border-t-sky-400 animate-spin" />
      <p className="text-slate-400 text-sm">{status}</p>
    </div>
  );
};

export default MdcatSocialCallbackPage;