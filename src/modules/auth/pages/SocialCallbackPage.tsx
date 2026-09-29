/**
 * SocialCallbackPage.tsx — Thin pass-through
 * Reads query params from backend, passes everything to SocialAuthPage via Router state.
 * Token never stays in URL — moved to Router state immediately.
 */
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SocialCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token                = searchParams.get("token")                 ?? "";
    const userId               = searchParams.get("user_id")               ?? "";
    const name                 = searchParams.get("name")                  ?? "";
    const email                = searchParams.get("email")                 ?? "";
    const isNewAccount         = searchParams.get("is_new_account")        === "true";
      const portal        = searchParams.get("portal")         ?? "web";
    const googleIdExists       = searchParams.get("google_id_exists")      === "true";
    const subscriptionPlanCode = searchParams.get("subscription_plan_code") ?? "";
    const subscriptionStatus   = searchParams.get("subscription_status")   ?? "";

    // Pass everything via Router state — token never sits in URL
    const msisdn = searchParams.get("msisdn") ?? "";
    navigate("/social-auth", {
      replace: true,
      state: {
        token, userId, name, email, msisdn, isNewAccount, portal,
        googleIdExists, subscriptionPlanCode, subscriptionStatus,
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
      <p className="text-slate-400 text-sm">Connecting your account…</p>
    </div>
  );
};

export default SocialCallbackPage;