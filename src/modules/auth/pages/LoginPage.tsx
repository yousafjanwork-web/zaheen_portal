/**
 * LoginPage.tsx — Updated for Zaheen setup flow
 *
 * After successful login (OTP or credentials):
 *   1. getUserProfile(msisdn)    → get userId   [OTP only]
 *   2. getSetupStatus(userId)    → check is_profile_complete, is_kid
 *   3. Route:
 *        is_kid = true            → /dashboard
 *        is_profile_complete = 0  → /profile?setup=true
 *        is_profile_complete = 1  → check has_role
 *          has_role = false       → /setup/role
 *          has_role = true        → /dashboard
 */

import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useSearchParams, useNavigate } from "react-router-dom";
import { loginPin, verifyLoginPin } from "@/modules/shared/services/loginService";

=======
import { useSearchParams, useNavigate, useLocation, Link } from "react-router-dom";
import { loginPin, verifyLoginPin } from "@/modules/shared/services/loginService";
import {
  loginWithCredentials,
  getUserProfile,
  UserProfile,
} from "@/modules/shared/services/profileService";
import { getSetupStatus } from "@/modules/shared/services/lmsService";
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
import { useAuth } from "@/modules/shared/context/AuthContext";

/* ── Shared spark positions ── */
const sparks = [
  { top: "12%", left: "8%",  delay: "0s",   dur: "2.6s" },
  { top: "22%", left: "88%", delay: "0.7s", dur: "2.1s" },
  { top: "72%", left: "14%", delay: "1.2s", dur: "2.8s" },
  { top: "80%", left: "90%", delay: "0.4s", dur: "2.3s" },
  { top: "10%", left: "55%", delay: "1.5s", dur: "2.0s" },
  { top: "62%", left: "47%", delay: "0.9s", dur: "2.5s" },
];

type LoginMode = "OTP" | "CREDENTIALS";
type OtpStep  = "MSISDN" | "OTP";

// ─── Small reusable components ───────────────────────────────────────────────

const ErrorBox: React.FC<{ msg: string }> = ({ msg }) => (
  <div
    className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
    style={{
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.25)",
      color: "#fca5a5",
    }}
  >
    ⚠ {msg}
  </div>
);

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
);

// ─── LoginPage ──────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const location       = useLocation();
  const { loginWithUser } = useAuth();

  const [mode,    setMode]    = useState<LoginMode>("CREDENTIALS");
  const [msisdn,  setMsisdn]  = useState("");
  const [pin,     setPin]     = useState("");
  const [otpStep, setOtpStep] = useState<OtpStep>("MSISDN");
  const [timer,   setTimer]   = useState(0);

  const [credUsername, setCredUsername] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const [loading,       setLoading]       = useState(false);
  const [routingStatus, setRoutingStatus] = useState("");
  const [error,         setError]         = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  const handleGoogleLogin = () => {
    setSocialLoading(true);
    const redirectUri = `${window.location.origin}/social-callback`;
    window.location.href = `https://api.zaheen.com.pk/v2/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  /* OTP countdown */
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  /* Auto-send OTP when msisdn arrives from HE header */
  useEffect(() => {
    const heMsisdn = searchParams.get("msisdn");
    if (heMsisdn) {
      setMsisdn(heMsisdn);
      sendOtp(heMsisdn);
    }
  }, []);

  // ─── Core routing logic ───────────────────────────────────────────────────

  /**
   * Shared routing logic — takes an already-resolved UserProfile.
   * Called by both OTP and credentials paths once we have the profile.
   */
const routeAfterLogin = async (profile: UserProfile, resolvedMsisdn: string, token?: string | null) => {
    try {
      const userId = profile.id;
      console.log("[routeAfterLogin] userId =", userId, "msisdn =", resolvedMsisdn);
      const status = await getSetupStatus(userId);
      console.log("[routeAfterLogin] setup status =", status);

<<<<<<< HEAD
      const res = await loginPin(number);
=======
         loginWithUser({
        msisdn:           resolvedMsisdn,
        userId,
        isKid:            false,
        role:             status.role ?? null,
        selectedClassId:  status.selected_class_id ?? null,
        selectedCourseId: status.selected_course_id ?? null,
        token:            token ?? null,
      });
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

      setRoutingStatus("Opening your account…");

      if (!status.is_profile_complete) {
        navigate("/profile?setup=true", { replace: true });
        return;
      }
      if (!status.has_role) {
        navigate("/setup/role", { replace: true });
        return;
      }
      if ((status.role === "learner" || status.role === "both") && !status.has_grade) {
        navigate("/setup/grade-course", { replace: true });
        return;
      }
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Post-login routing error:", err);
      setError("Login succeeded but we couldn't load your account. Please try again.");
      setRoutingStatus("");
    }
  };

  /**
   * OTP login path — msisdn is always available, so getUserProfile is safe.
   */
  const handlePostLoginOtp = async (resolvedMsisdn: string) => {
    setRoutingStatus("Checking your account…");
    try {
<<<<<<< HEAD

      setLoading(true);
      setError("");

      const res = await loginPin(msisdn);

      if (res.status === "PIN_SENT") {
        setStep("OTP");
=======
      const profile = await getUserProfile(resolvedMsisdn);
      if (!profile) {
        setError("Could not load your account. Please try again.");
        setRoutingStatus("");
        return;
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      }
      await routeAfterLogin(profile, resolvedMsisdn);
    } catch (err) {
      console.error("Post-login routing error:", err);
      setError("Login succeeded but we couldn't load your account. Please try again.");
      setRoutingStatus("");
    }
  };

  // ─── OTP helpers ────────────────────────────────────────────────────

  const normaliseStatus = (status: string | undefined | null): string | null => {
    if (!status) return "Failed to send PIN";
    const s = status.trim().toLowerCase();
    if (s === "pin_sent" || s === "active") return null;
    if (s === "not active") return "You are not subscribed. Please subscribe first.";
    return "Something went wrong. Please try again.";
  };

  const sendOtp = async (number: string) => {
    try {
      const res = await loginPin(number);
      if (res.status === "PIN_SENT") {
        setOtpStep("OTP");
        setTimer(30);
      } else {
        setError(normaliseStatus(res.status) ?? "Failed to send PIN");
      }
    } catch {
      setError("Failed to send PIN. Please try again.");
    }
  };

<<<<<<< HEAD
      setLoading(true);
      setError("");

      const verify = await verifyLoginPin(msisdn, pin);
=======
  const handleSendOtp = async () => {
    if (!msisdn.trim()) { setError("Please enter your mobile number"); return; }
    setLoading(true); setError("");
    await sendOtp(msisdn.trim());
    setLoading(false);
  };
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

  const handleVerifyOtp = async () => {
    if (!pin.trim()) { setError("Please enter the PIN"); return; }
    setLoading(true); setError("");
    try {
      const verify = await verifyLoginPin(msisdn, pin);
      if (verify.status !== "SUCCESS") {
        setError("Invalid PIN");
        setLoading(false);
        return;
      }

<<<<<<< HEAD
      /* CHECK SUBSCRIBER STATUS */

      const status = await loginPin(msisdn);

      if (status.status === "ACTIVE") {

        login(msisdn);
        navigate("/");

      } else {

        setError("You are not subscribed. Please subscribe first.");

=======
      /* Confirm still subscribed */
      const statusCheck = await loginPin(msisdn);
      const statusErr   = normaliseStatus(statusCheck.status);
      if (statusErr !== null) {
        setError(statusErr);
        setLoading(false);
        return;
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      }

      /* OTP verified — msisdn is available, safe to call getUserProfile */
      await handlePostLoginOtp(msisdn);
    } catch {
      setError("Verification failed. Please try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError(""); setTimer(30);
    await sendOtp(msisdn);
  };

  // ─── Credentials login ───────────────────────────────────────────────────────

  const handleCredentialsLogin = async () => {
    if (!credUsername.trim()) { setError("Please enter your username"); return; }
    if (!credPassword.trim()) { setError("Please enter your password"); return; }
    setLoading(true); setError("");
    try {
      // loginWithCredentials already returns the full user object —
      // DO NOT call getUserProfile after this; kids have no msisdn.
        const { user, token } = await loginWithCredentials({
        username: credUsername.trim(),
        password: credPassword,
      });

      // ✅ Handle both boolean true and number 1 from backend
      const isKidUser = user.is_kid === 1 || (user as any).is_kid === true;

      if (isKidUser) {
        setRoutingStatus("Opening your account…");
        try {
          const status = await getSetupStatus(user.id);
          loginWithUser({
            msisdn:           user.msisdn ?? "",
            userId:           user.id,
            isKid:            true,
            role:             "learner",
            selectedClassId:  status.selected_class_id ?? null,
            selectedCourseId: status.selected_course_id ?? null,
            displayName:      user.name?.trim() || user.username?.trim() || "",
            token,
          });
        } catch {
          loginWithUser({
            msisdn:           user.msisdn ?? "",
            userId:           user.id,
            isKid:            true,
            role:             "learner",
            selectedClassId:  null,
            selectedCourseId: null,
            displayName:      user.name?.trim() || user.username?.trim() || "",
            token,
          });
        }
        navigate("/dashboard", { replace: true });
        return;
      }

      setRoutingStatus("Checking your account…");
      await routeAfterLogin(user, user.msisdn ?? "", token);

    } catch {
      setError("Incorrect username or password. Please try again.");
      setRoutingStatus("");
    }
    setLoading(false);
  };

  // ─── Styles ──────────────────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "#F0B429");
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  const PrimaryBtn: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  }> = ({ onClick, disabled, children }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
      style={{
        background: disabled
          ? "rgba(240,180,41,0.4)"
          : "linear-gradient(135deg,#F0B429,#f59e0b)",
        color: "#0f172a",
        boxShadow: disabled ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );

  // ─── Routing overlay ─────────────────────────────────────────────────────────

  if (routingStatus) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6">
        <div className="w-10 h-10 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
        <p className="text-slate-400 text-sm">{routingStatus}</p>
      </div>
    );
  }

  // ─── Main render ─────────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
        }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

        <div className="p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
              Welcome back
            </p>
            <h1
              className="text-3xl text-white"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Sign in to Zaheen
            </h1>
            <p className="text-slate-400 text-sm mt-2">Choose how you want to log in</p>
          </div>

       {/* Google sign-in */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={socialLoading || loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#e2e8f0",
                opacity: (socialLoading || loading) ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!socialLoading && !loading)
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              {socialLoading ? (
                <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-400/30 border-t-slate-300 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M43.611 20.083H42V20H24v8h11.303C33.973 32.28 29.418 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                  <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                  <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 35c-5.399 0-9.944-3.647-11.298-8.56l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                  <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs text-slate-500 font-medium">or sign in with mobile</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Mode toggle */}
          <div
            className="flex mb-8 rounded-xl p-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {(
              [
                { key: "CREDENTIALS", label: "Username & Password" }, 
                { key: "OTP",         label: "OTP / Mobile" },  
              ] as { key: LoginMode; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={
                  mode === key
                    ? {
                        background: "linear-gradient(135deg,#F0B429,#f59e0b)",
                        color: "#0f172a",
                        boxShadow: "0 2px 8px rgba(240,180,41,0.35)",
                      }
                    : { color: "#94a3b8" }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* ══ OTP FLOW ══ */}
          {mode === "OTP" && (
            <>
              {otpStep === "MSISDN" && (
                <>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="relative mb-5">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">📱</span>
                    <input
                      type="text"
                      value={msisdn}
                      onChange={(e) => { setMsisdn(e.target.value); setError(""); }}
                      placeholder="923XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  {error && <ErrorBox msg={error} />}
                  <PrimaryBtn onClick={handleSendOtp} disabled={loading}>
                    {loading ? <><Spinner /> Sending…</> : "Send OTP →"}
                  </PrimaryBtn>
                </>
              )}

              {otpStep === "OTP" && (
                <>
                  <p className="text-slate-400 text-sm text-center mb-4">
                    OTP sent to <span className="text-amber-400 font-medium">{msisdn}</span>
                  </p>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                    Enter PIN
                  </label>
                  <div className="relative mb-5">
                    <input
                      type="text"
                      value={pin}
                      onChange={(e) => { setPin(e.target.value); setError(""); }}
                      placeholder="· · · ·"
                      className="w-full text-center text-3xl font-bold py-4 rounded-xl tracking-[0.5em] text-white"
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  {error && <ErrorBox msg={error} />}
                  <PrimaryBtn onClick={handleVerifyOtp} disabled={loading}>
                    {loading ? <><Spinner /> Verifying…</> : "Verify & Login →"}
                  </PrimaryBtn>
                  <div className="text-center mt-4">
                    {timer > 0 ? (
                      <p className="text-slate-500 text-sm">
                        Resend OTP in <span className="text-amber-400 font-semibold">{timer}s</span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOtp}
                        className="text-teal-400 text-sm hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setOtpStep("MSISDN"); setPin(""); setError(""); }}
                    className="block w-full text-center text-slate-500 text-xs mt-3 hover:text-slate-400"
                  >
                    ← Change number
                  </button>
                </>
              )}
            </>
          )}

          {/* ══ CREDENTIALS FLOW ══ */}
          {mode === "CREDENTIALS" && (
            <>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Username
              </label>
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">🏷️</span>
                <input
                  type="text"
                  value={credUsername}
                  onChange={(e) => { setCredUsername(e.target.value); setError(""); }}
                  placeholder="your_username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative mb-6">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={credPassword}
                  onChange={(e) => { setCredPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-16 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                <button
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {error && <ErrorBox msg={error} />}

              <PrimaryBtn onClick={handleCredentialsLogin} disabled={loading}>
                {loading ? <><Spinner /> Signing in…</> : "Sign In →"}
              </PrimaryBtn>

              <p className="text-center text-xs text-slate-600 mt-4">
                Don't have a username yet?{" "}
                <span
                  className="text-amber-400 cursor-pointer hover:underline"
                  onClick={() => { setMode("OTP"); setError(""); }}
                >
                  Log in with OTP first
                </span>
                , then set one in your profile.
              </p>
            </>
          )}

          {/* Footer */}
          <div
            className="mt-8 pt-6 text-center"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-slate-500 text-xs">
              Don't have an account?{" "}
              <Link to="/subscribe" className="text-teal-400 hover:underline">
                Subscribe now
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;