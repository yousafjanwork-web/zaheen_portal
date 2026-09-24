/**
 * MdcatLoginPage.tsx
 * 
 * MDCAT-only login page. Completely separate from Zaheen's LoginPage.
 * Normal Zaheen users never see this page.
 * 
 * Routes:
 *   /mdcat-login  → this page
 * 
 * After login:
 *   OTP/Credentials → has msisdn → back to original MDCAT page
 *   Google          → /mdcat-social-callback → MdcatProfileSetup if needed
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginPin, verifyLoginPin } from "@/modules/shared/services/loginService";
import { loginWithCredentials, getUserProfile } from "@/modules/shared/services/profileService";
import { useAuth } from "@/modules/shared/context/AuthContext";

type LoginMode = "OTP" | "CREDENTIALS";
type OtpStep   = "MSISDN" | "OTP";

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
);

const ErrorBox: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
    ⚠ {msg}
  </div>
);

const MdcatLoginPage: React.FC = () => {
  const navigate = useNavigate();
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
  const [socialLoading, setSocialLoading] = useState(false);
  const [error,         setError]         = useState("");

  // Read where the user came from
  const getReturnPath = () => {
    try {
      const stored = localStorage.getItem("mdcat_return");
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed?.from ?? "/mdcat";
    } catch { return "/mdcat"; }
  };

  // OTP countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleGoogleLogin = () => {
    setSocialLoading(true);
    // Use the same /social-callback that backend already accepts.
    // Pass MDCAT context in state param so SocialCallbackPage knows
    // to route back into MDCAT instead of the LMS dashboard.
    const returnPath = (() => {
      try {
        const stored = localStorage.getItem("mdcat_return");
        const parsed = stored ? JSON.parse(stored) : null;
        return parsed?.from ?? "/mdcat";
      } catch { return "/mdcat"; }
    })();
    const mdcatState = encodeURIComponent(JSON.stringify({
      from: returnPath,
      mdcat: true,
    }));
    const redirectUri = `${window.location.origin}/social-callback`;
    window.location.href = `https://api.zaheen.com.pk/v2/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&state=${mdcatState}`;
  };

  // After successful OTP/credentials login → go back to MDCAT page directly
  const routeAfterMdcatLogin = async (resolvedMsisdn: string, userId: number, token: string | null) => {
    loginWithUser({
      msisdn:           resolvedMsisdn,
      userId,
      isKid:            false,
      role:             "learner",
      selectedClassId:  null,
      selectedCourseId: null,
      token,
    });
    const returnPath = getReturnPath();
    localStorage.removeItem("mdcat_return");
    navigate(returnPath, { replace: true });
  };

  // OTP flow
  const sendOtp = async (number: string) => {
    try {
      const res = await loginPin(number);
      if (res.status === "PIN_SENT") {
        setOtpStep("OTP");
        setTimer(30);
      } else {
        setError("Failed to send PIN. Please check your number.");
      }
    } catch {
      setError("Failed to send PIN. Please try again.");
    }
  };

  const handleSendOtp = async () => {
    if (!msisdn.trim()) { setError("Please enter your mobile number"); return; }
    setLoading(true); setError("");
    await sendOtp(msisdn.trim());
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!pin.trim()) { setError("Please enter the PIN"); return; }
    setLoading(true); setError("");
    try {
      const verify = await verifyLoginPin(msisdn, pin);
      if (verify.status !== "SUCCESS") {
        setError("Invalid PIN. Please try again.");
        setLoading(false);
        return;
      }
      const profile = await getUserProfile(msisdn);
      if (!profile) {
        setError("Could not load your account. Please try again.");
        setLoading(false);
        return;
      }
      await routeAfterMdcatLogin(msisdn, profile.id, verify.token ?? null);
    } catch {
      setError("Verification failed. Please try again.");
    }
    setLoading(false);
  };

  // Credentials flow
  const handleCredentialsLogin = async () => {
    if (!credUsername.trim()) { setError("Please enter your username"); return; }
    if (!credPassword.trim()) { setError("Please enter your password"); return; }
    setLoading(true); setError("");
    try {
      const { user, token } = await loginWithCredentials({
        username: credUsername.trim(),
        password: credPassword,
      });
      await routeAfterMdcatLogin(user.msisdn ?? "", user.id, token);
    } catch {
      setError("Incorrect username or password. Please try again.");
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#38bdf8");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55)",
        }}>
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#38bdf8,#0ea5e9)" }} />

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
              style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
              <span className="text-sky-400 text-sm">🩺</span>
              <span className="text-sky-300 text-xs font-bold uppercase tracking-wider">MDCAT Prep</span>
            </div>
            <h1 className="text-3xl text-white font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
              Sign in to MDCAT
            </h1>
            <p className="text-slate-400 text-sm mt-2">Access past papers, AI quizzes & more</p>
          </div>

          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={socialLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold mb-6 transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#e2e8f0",
              opacity: (socialLoading || loading) ? 0.6 : 1,
            }}>
            {socialLoading
              ? <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-400/30 border-t-slate-300 animate-spin" />
              : <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                  <path d="M43.611 20.083H42V20H24v8h11.303C33.973 32.28 29.418 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                  <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                  <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 35c-5.399 0-9.944-3.647-11.298-8.56l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                  <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                </svg>
            }
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs text-slate-500">or sign in with mobile</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Mode toggle */}
          <div className="flex mb-6 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {([{ key: "CREDENTIALS", label: "Username & Password" }, { key: "OTP", label: "OTP / Mobile" }] as { key: LoginMode; label: string }[]).map(({ key, label }) => (
              <button key={key} onClick={() => { setMode(key); setError(""); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={mode === key
                  ? { background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#0f172a" }
                  : { color: "#94a3b8" }}>
                {label}
              </button>
            ))}
          </div>

          {/* OTP flow */}
          {mode === "OTP" && (
            <>
              {otpStep === "MSISDN" && (
                <>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Mobile Number</label>
                  <div className="relative mb-4">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">📱</span>
                    <input type="text" value={msisdn} onChange={e => { setMsisdn(e.target.value); setError(""); }}
                      placeholder="923XXXXXXXXX"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  {error && <ErrorBox msg={error} />}
                  <button onClick={handleSendOtp} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#0f172a" }}>
                    {loading ? <><Spinner /> Sending…</> : "Send OTP →"}
                  </button>
                </>
              )}
              {otpStep === "OTP" && (
                <>
                  <p className="text-slate-400 text-sm text-center mb-4">OTP sent to <span className="text-sky-400">{msisdn}</span></p>
                  <input type="text" value={pin} onChange={e => { setPin(e.target.value); setError(""); }}
                    placeholder="· · · ·"
                    className="w-full text-center text-3xl font-bold py-4 rounded-xl tracking-[0.5em] text-white mb-4"
                    style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  {error && <ErrorBox msg={error} />}
                  <button onClick={handleVerifyOtp} disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#0f172a" }}>
                    {loading ? <><Spinner /> Verifying…</> : "Verify & Continue →"}
                  </button>
                  <div className="text-center mt-3">
                    {timer > 0
                      ? <p className="text-slate-500 text-sm">Resend in <span className="text-sky-400">{timer}s</span></p>
                      : <button onClick={() => { setError(""); setTimer(30); sendOtp(msisdn); }} className="text-sky-400 text-sm hover:underline">Resend OTP</button>
                    }
                  </div>
                  <button onClick={() => { setOtpStep("MSISDN"); setPin(""); setError(""); }}
                    className="block w-full text-center text-slate-500 text-xs mt-2 hover:text-slate-400">
                    ← Change number
                  </button>
                </>
              )}
            </>
          )}

          {/* Credentials flow */}
          {mode === "CREDENTIALS" && (
            <>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Username</label>
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🏷️</span>
                <input type="text" value={credUsername} onChange={e => { setCredUsername(e.target.value); setError(""); }}
                  placeholder="your_username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Password</label>
              <div className="relative mb-5">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">🔒</span>
                <input type={showPassword ? "text" : "password"} value={credPassword}
                  onChange={e => { setCredPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-16 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                <button onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {error && <ErrorBox msg={error} />}
              <button onClick={handleCredentialsLogin} disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#0f172a" }}>
                {loading ? <><Spinner /> Signing in…</> : "Sign In →"}
              </button>
            </>
          )}

          <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => navigate("/mdcat", { replace: true })}
              className="text-slate-500 text-xs hover:text-slate-400">
              ← Back to MDCAT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MdcatLoginPage;