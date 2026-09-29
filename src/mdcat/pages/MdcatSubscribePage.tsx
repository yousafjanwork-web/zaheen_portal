/**
 * MdcatSubscribePage.tsx
 *
 * MDCAT-only Subscribe page.
 * Reached from MDCAT Enroll Now page after HE redirect.
 * Google sign-up sends portal=mdcat so user returns to MDCAT after auth.
 */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendPin, verifyPin, subscribeUser } from "@/modules/shared/services/subscriptionService";
import { getUserProfile } from "@/modules/shared/services/profileService";
import { useAuth } from "@/modules/shared/context/AuthContext";

const SERVICE_ID = "205";

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
);

const ErrorBox: React.FC<{ msg: string }> = ({ msg }) => (
  <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
    ⚠ {msg}
  </div>
);

const MdcatSubscribePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithUser } = useAuth();

  const [msisdn,       setMsisdn]       = useState("");
  const [isAuto,       setIsAuto]       = useState(false);
  const [pin,          setPin]          = useState("");
  const [step,         setStep]         = useState<"MSISDN" | "OTP">("MSISDN");
  const [timer,        setTimer]        = useState(30);
  const [loading,      setLoading]      = useState(false);
  const [socialLoading,setSocialLoading]= useState(false);
  const [error,        setError]        = useState("");

  // Read HE-injected msisdn
  useEffect(() => {
    const he  = searchParams.get("msisdn");
    const mza = sessionStorage.getItem("mzaMsisdn");
    if (he || mza) {
      setMsisdn(he || mza || "");
      setIsAuto(true);
    }
  }, []);

  // OTP countdown
  useEffect(() => {
    if (step !== "OTP" || timer <= 0) return;
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [step, timer]);

  const subscribed = (sub: any) =>
    String(sub?.status) === "1" ||
    String(sub?.desc || "").toLowerCase().includes("already active");

  const finish = async (number: string) => {
    const profile = await getUserProfile(number);
    if (!profile) throw new Error("Subscribed but could not load account.");
    loginWithUser({
      msisdn:           number,
      userId:           profile.id,
      isKid:            false,
      role:             null,
      selectedClassId:  null,
      selectedCourseId: null,
      token:            null,
    });
    localStorage.setItem("activeServiceId", SERVICE_ID);
    navigate("/mdcat", { replace: true });
  };

  const handleSubscribe = async () => {
    if (!msisdn.trim()) { setError("Please enter your mobile number"); return; }
    setLoading(true); setError("");
    try {
      if (isAuto) {
        const sub = await subscribeUser(msisdn, SERVICE_ID);
        if (subscribed(sub)) await finish(msisdn);
        else setError(sub?.desc || "Subscription failed");
      } else {
        const res = await sendPin(msisdn, SERVICE_ID);
        if (res?.status === "PIN_SENT") { setStep("OTP"); setTimer(30); }
        else setError(res?.desc || "Failed to send PIN");
      }
    } catch (e: any) {
      setError(e?.message || "Operation failed");
    }
    setLoading(false);
  };

  const handleVerifyPin = async () => {
    if (!pin.trim()) { setError("Please enter the PIN"); return; }
    setLoading(true); setError("");
    try {
      const verify = await verifyPin(msisdn, pin.trim(), SERVICE_ID);
      if (verify?.status === "SUCCESS") {
        const sub = await subscribeUser(msisdn, SERVICE_ID);
        if (subscribed(sub)) await finish(msisdn);
        else setError(sub?.desc || "Subscription failed");
      } else {
        setError(verify?.message || "Invalid PIN. Please try again.");
      }
    } catch (e: any) {
      setError(e?.message || "Verification failed");
    }
    setLoading(false);
  };

  const handleGoogleSignUp = () => {
    setSocialLoading(true);
    const redirectUri = `${window.location.origin}/social-callback`;
    window.location.href = `https://api.zaheen.com.pk/v2/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&portal=mdcat`;
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
              {step === "OTP" ? "Verify PIN" : "Subscribe to MDCAT"}
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              {step === "OTP"
                ? `PIN sent to ${msisdn}`
                : "Unlock AI quizzes, past papers & more"}
            </p>
          </div>

          {/* Google */}
          {step === "MSISDN" && (
            <>
              <button onClick={handleGoogleSignUp} disabled={socialLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold mb-4 transition-all"
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
                Sign up with Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-xs text-slate-500">or subscribe with mobile</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Mobile Number (Zong)
              </label>
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">📱</span>
                <input type="text" value={msisdn} disabled={isAuto}
                  onChange={e => { setMsisdn(e.target.value); setError(""); }}
                  placeholder="923XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              {error && <ErrorBox msg={error} />}
              <button onClick={handleSubscribe} disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#0f172a" }}>
                {loading ? <><Spinner /> Processing…</> : isAuto ? "Subscribe Now →" : "Send PIN →"}
              </button>
            </>
          )}

          {/* OTP */}
          {step === "OTP" && (
            <>
              <input type="text" value={pin}
                onChange={e => { setPin(e.target.value); setError(""); }}
                placeholder="· · · ·"
                className="w-full text-center text-3xl font-bold py-4 rounded-xl tracking-[0.5em] text-white mb-4"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              {error && <ErrorBox msg={error} />}
              <button onClick={handleVerifyPin} disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg,#38bdf8,#0ea5e9)", color: "#0f172a" }}>
                {loading ? <><Spinner /> Verifying…</> : "Verify & Subscribe →"}
              </button>
              <div className="text-center mt-3">
                {timer > 0
                  ? <p className="text-slate-500 text-sm">Resend in <span className="text-sky-400">{timer}s</span></p>
                  : <button onClick={() => { setError(""); setTimer(30); sendPin(msisdn, SERVICE_ID); }}
                      className="text-sky-400 text-sm hover:underline">Resend PIN</button>
                }
              </div>
              <button onClick={() => { setStep("MSISDN"); setPin(""); setError(""); }}
                className="block w-full text-center text-slate-500 text-xs mt-2 hover:text-slate-400">
                ← Change number
              </button>
            </>
          )}

          <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-slate-600 text-xs">Zong users only · Rs. 5 + Tax per day</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MdcatSubscribePage;