/**
 * SocialAuthPage.tsx
 *
 * Receives auth data from SocialCallbackPage via Router state.
 * Handles:
 *   - Existing accounts → setup routing → portal redirect
 *   - New accounts → mobile number → Zong OTP or skip → portal redirect
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import axios from "axios";
import { getSetupStatus } from "@/modules/shared/services/lmsService";

// ── Types ──────────────────────────────────────────────────────────────────

type Portal = "web" | "mdcat" | "issb" | "nat" | "trading" | "uniprep";
type Step   = "LOADING" | "MOBILE" | "OTP" | "SAVING" | "DONE" | "ERROR";

interface SocialAuthState {
  token:                string;
  userId:               string;
  name:                 string;
  email:                string;
  msisdn:               string;
  isNewAccount:         boolean;
  portal:               Portal;
  googleIdExists:       boolean;
  subscriptionPlanCode: string;
  subscriptionStatus:   string;
}

// ── Portal redirect map ────────────────────────────────────────────────────

const PORTAL_REDIRECT: Record<Portal, string> = {
  web:      "/dashboard",
  mdcat:    "/mdcat",
  issb:     "/issb/",
  nat:      "/nat/",
  trading:  "/skills/how-to-become-a-professional-trader",
  uniprep:  "/uniprep/",
};

import { syncIssbSession } from "@/modules/shared/services/issbService";
import { goToPortal } from "@/modules/shared/utils/portalRedirect";

// ── Shared styles ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background:  "rgba(255,255,255,0.05)",
  border:      "1px solid rgba(255,255,255,0.1)",
  outline:     "none",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "#F0B429");
const onBlur  = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.target.style.borderColor = "rgba(255,255,255,0.1)");

const ErrorBox: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
    ⚠ {msg}
  </div>
);

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
);

// ── Defined outside SocialAuthPage to prevent remount on state change ──

const PrimaryBtn: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode }> =
  ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
      style={{
        background: disabled ? "rgba(240,180,41,0.4)" : "linear-gradient(135deg,#F0B429,#f59e0b)",
        color: "#0f172a",
        boxShadow: disabled ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
      {children}
    </button>
  );

// ── Card shell — defined outside SocialAuthPage to prevent remount on state change ──
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
    <div className="w-full max-w-md rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,23,42,0.88)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.55)",
      }}>
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />
      <div className="p-8">{children}</div>
    </div>
  </div>
);

// ── SocialAuthPage ─────────────────────────────────────────────────────────

const SocialAuthPage: React.FC = () => {
  const navigate        = useNavigate();
  const location        = useLocation();
  const { loginWithUser } = useAuth();

  const state = location.state as SocialAuthState | null;

  const [step,    setStep]    = useState<Step>("LOADING");
  const [status,  setStatus]  = useState("Completing sign-in…");
  const [error,   setError]   = useState("");
  const [mobile,  setMobile]  = useState("");
  const [otp,     setOtp]     = useState("");
  const [timer,   setTimer]   = useState(0);
  const [loading, setLoading] = useState(false);

  // OTP countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // ── Guard: no state means someone landed here directly ──
  useEffect(() => {
    if (!state?.token || !state?.userId) {
      navigate("/login", { replace: true });
      return;
    }
    if (state.isNewAccount) {
      const portal = state.portal as Portal;
      if (portal === "mdcat" || portal === "issb" || portal === "nat" || portal === "trading" || portal === "uniprep") {
        // New account from these portals → profile setup page
        // Pass all state through so profile page has name/email/token
        const profileSetupRoutes: Record<string, string> = {
          mdcat:    "/mdcat-profile-setup",
          issb:     "/issb-profile-setup",
          nat:      "/nat-profile-setup",
          trading:  "/trading-profile-setup",
          uniprep:  "/uniprep-profile-setup",
        };
        navigate(profileSetupRoutes[portal], {
          replace: true,
          state: { ...state },
        });
      } else {
        // web portal → log in, then Zaheen profile setup (phone is collected there)
        handleNewWebAccount();
      }
    } else {
      handleExistingAccount();
    }
  }, []);

  // ── Portal redirect helper ──────────────────────────────────────────────

  const redirectToPortal = async (portal: Portal, setupStatus?: any) => {
    const destination = PORTAL_REDIRECT[portal] ?? "/dashboard";

    if (portal === "uniprep") {
      localStorage.setItem("uniprep_auth", JSON.stringify({
        userId: Number(state!.userId),
        msisdn: state!.msisdn ?? "",
        name:   state!.name || state!.email,
      }));
      localStorage.setItem("zaheen_user_id",   state!.userId);
      localStorage.setItem("zaheen_user_name", state!.name || state!.email);
      window.location.href = "https://zaheen.com.pk/uniprep/";
      return;
    }

    if (portal === "nat") {
      // Write nat_auth so NAT project reads it on load
      const natAuth = {
        userId: Number(state!.userId),
        msisdn: state!.msisdn ?? "",
        name:   state!.name || state!.email,
      };
      localStorage.setItem("nat_auth",        JSON.stringify(natAuth));
      localStorage.setItem("zaheen_user_id",  state!.userId);
      localStorage.setItem("user_id",         state!.userId);
      localStorage.setItem("zaheen_user_name", state!.name || state!.email);
      goToPortal("/nat/", navigate);
      return;
    }

    if (portal === "issb") {
      try {
        await syncIssbSession({
          id:     state!.userId,
          name:   state!.name,
          email:  state!.email,
          msisdn: state!.msisdn ?? "",
        });
      } catch {
        // Non-critical — redirect anyway, ISSB will show login if sync failed
      }
      goToPortal(destination, navigate);
      return;
    }

    if (portal === "web" && setupStatus) {
      // Zaheen needs setup-flow routing
      if (!setupStatus.is_profile_complete) {
        navigate("/profile?setup=true", { replace: true });
      } else if (!setupStatus.has_role) {
        navigate("/setup/role", { replace: true });
      } else if ((setupStatus.role === "learner" || setupStatus.role === "both") && !setupStatus.has_grade) {
        navigate("/setup/grade-course", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      goToPortal(destination, navigate);
    }
  };

  // ── Existing account flow ──────────────────────────────────────────────

  const handleNewWebAccount = () => {
    loginWithUser({
      msisdn:           "",
      userId:           Number(state!.userId),
      isKid:            false,
      role:             null,
      selectedClassId:  null,
      selectedCourseId: null,
      displayName:      state!.name || state!.email,
      token:            state!.token,
    });
    navigate("/profile?setup=true", { replace: true });
  };

  const handleExistingAccount = async () => {
    setStep("LOADING");
    setStatus("Checking your account…");
    try {
      const userIdNum  = Number(state!.userId);
      const setupStatus = await getSetupStatus(userIdNum);

      loginWithUser({
        msisdn:           "",
        userId:           userIdNum,
        isKid:            false,
        role:             setupStatus.role              ?? null,
        selectedClassId:  setupStatus.selected_class_id  ?? null,
        selectedCourseId: setupStatus.selected_course_id ?? null,
        displayName:      state!.name || state!.email,
        token:            state!.token,
      });

      setStatus("Opening your account…");
      await redirectToPortal(state!.portal as Portal, setupStatus);
    } catch {
      setError("Sign-in succeeded but we couldn't load your account. Please try again.");
      setStep("ERROR");
    }
  };

  // ── Mobile number submission ────────────────────────────────────────────

  const handleMobileSubmit = async () => {
    if (!mobile.trim()) { setError("Please enter your mobile number"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "https://subgateway.fitsworld.com.pk/zongcharging/api/login-pin",
        { params: { msisdn: mobile.trim() } }
      );
      const data = res.data;

      if (data.status === "PIN_SENT") {
        // Zong number — needs OTP
        setStep("OTP");
        setTimer(30);
      } else if (data.status === "not-found" || data.status === "NOT_FOUND") {
        // Non-Zong number — save directly, no OTP
        await saveMobileAndComplete(mobile.trim(), null);
      } else {
        setError("Could not verify your number. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  // ── OTP verification ────────────────────────────────────────────────────

  const handleOtpVerify = async () => {
    if (!otp.trim()) { setError("Please enter the OTP"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        "https://subgateway.fitsworld.com.pk/zongcharging/api/verify-login-pin",
        { params: { msisdn: mobile.trim(), pin: otp.trim() } }
      );
      const data = res.data;

      if (data.status === "SUCCESS") {
        await saveMobileAndComplete(mobile.trim(), data.token ?? null);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError(""); setTimer(30);
    await axios.get(
      "https://subgateway.fitsworld.com.pk/zongcharging/api/login-pin",
      { params: { msisdn: mobile.trim() } }
    );
  };

  // ── Save mobile + complete auth ─────────────────────────────────────────

  const saveMobileAndComplete = async (msisdn: string, otpToken: string | null) => {
    setStep("SAVING");
    setStatus("Saving your details…");
    const finalToken  = otpToken ?? state!.token;
    const userIdNum   = Number(state!.userId);

    try {
      const setupStatus = await getSetupStatus(userIdNum);
      loginWithUser({
        msisdn:           msisdn,
        userId:           userIdNum,
        isKid:            false,
        role:             setupStatus.role              ?? null,
        selectedClassId:  setupStatus.selected_class_id  ?? null,
        selectedCourseId: setupStatus.selected_course_id ?? null,
        displayName:      state!.name || state!.email,
        token:            finalToken,
      });
      setStatus("Opening your account…");
      await redirectToPortal(state!.portal as Portal, setupStatus);
    } catch {
      // Fallback — login with minimal data
      loginWithUser({
        msisdn,
        userId:           userIdNum,
        isKid:            false,
        role:             null,
        selectedClassId:  null,
        selectedCourseId: null,
        displayName:      state!.name || state!.email,
        token:            finalToken,
      });
      await redirectToPortal(state!.portal as Portal);
    }
  };

  // ── Render: Loading / Error ─────────────────────────────────────────────

  if (step === "LOADING" || step === "SAVING" || step === "DONE") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
        <p className="text-slate-400 text-sm">{status}</p>
      </div>
    );
  }

  if (step === "ERROR") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 px-4">
        <ErrorBox msg={error} />
        <button onClick={() => navigate("/login", { replace: true })}
          className="px-6 py-3 rounded-xl font-semibold text-sm"
          style={{ background: "linear-gradient(135deg,#F0B429,#f59e0b)", color: "#0f172a" }}>
          ← Back to Login
        </button>
      </div>
    );
  }

 

  // ── Render: MOBILE step ─────────────────────────────────────────────────

  if (step === "MOBILE") {
    return (
      <Card>
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
            One more step
          </p>
          <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Add your mobile number
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Welcome, <span className="text-amber-400">{state?.name || state?.email}</span>! Please enter your Pakistani mobile number.
          </p>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
          Mobile Number
        </label>
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">📱</span>
          <input
            type="text"
            value={mobile}
            onChange={(e) => { setMobile(e.target.value); setError(""); }}
            placeholder="923XXXXXXXXX"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {error && <ErrorBox msg={error} />}
        <PrimaryBtn onClick={handleMobileSubmit} disabled={loading}>
          {loading ? <><Spinner /> Checking…</> : "Continue →"}
        </PrimaryBtn>
      </Card>
    );
  }

  // ── Render: OTP step ────────────────────────────────────────────────────

  if (step === "OTP") {
    return (
      <Card>
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
            Verify number
          </p>
          <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Enter your OTP
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Code sent to <span className="text-amber-400 font-medium">{mobile}</span>
          </p>
        </div>

        <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
          Enter OTP
        </label>
        <div className="relative mb-5">
          <input
            type="text"
            value={otp}
            onChange={(e) => { setOtp(e.target.value); setError(""); }}
            placeholder="· · · ·"
            className="w-full text-center text-3xl font-bold py-4 rounded-xl tracking-[0.5em] text-white"
            style={inputStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {error && <ErrorBox msg={error} />}
        <PrimaryBtn onClick={handleOtpVerify} disabled={loading}>
          {loading ? <><Spinner /> Verifying…</> : "Verify →"}
        </PrimaryBtn>

        <div className="text-center mt-4">
          {timer > 0 ? (
            <p className="text-slate-500 text-sm">
              Resend in <span className="text-amber-400 font-semibold">{timer}s</span>
            </p>
          ) : (
            <button onClick={handleResendOtp} className="text-teal-400 text-sm hover:underline">
              Resend OTP
            </button>
          )}
        </div>
        <button
          onClick={() => { setStep("MOBILE"); setOtp(""); setError(""); }}
          className="block w-full text-center text-slate-500 text-xs mt-3 hover:text-slate-400"
        >
          ← Change number
        </button>
      </Card>
    );
  }

  return null;
};

export default SocialAuthPage;