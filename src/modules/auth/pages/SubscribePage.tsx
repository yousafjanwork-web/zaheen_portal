import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  sendPin,
  verifyPin,
  subscribeUser,
} from "@/modules/shared/services/subscriptionService";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { getUserProfile } from "@/modules/shared/services/profileService";
import { getSetupStatus } from "@/modules/shared/services/lmsService";
import { trackPinSent, trackSubscription } from "../../../../src/modules/shared/utils/metaPixel";


const SubscribePage = () => {
  const { login, loginWithUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const page   = searchParams.get("page")   ?? "";
    const source = searchParams.get("source") ?? "";

    if (source) localStorage.setItem("source", source);
    if (page)   localStorage.setItem("page_name", page);

    if (page.includes("issb")) {
      sessionStorage.setItem("subscribe_return_portal", "issb");
    } else if (page.includes("mdcat")) {
      sessionStorage.setItem("subscribe_return_portal", "mdcat");
    } else if (page.includes("trading")) {
      sessionStorage.setItem("subscribe_return_portal", "trading");
    } else if (page.includes("nat")) {
      sessionStorage.setItem("subscribe_return_portal", "nat");
    } else if (page.includes("uniprep")) {
      sessionStorage.setItem("subscribe_return_portal", "uniprep");
    }
  }, []);
  const [msisdn, setMsisdn] = useState("");

  const [serviceId, setServiceId] = useState<string>(
    searchParams.get("plan") ?? "205"
  );
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"MSISDN" | "OTP" | "SUCCESS">("MSISDN");
  const [isAutoMsisdn, setIsAutoMsisdn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | null>(null);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    const heMsisdn = searchParams.get("msisdn");
    const mzaMsisdn = sessionStorage.getItem("mzaMsisdn");
    if (heMsisdn) {
      setMsisdn(heMsisdn);
      setIsAutoMsisdn(true);
    } else if (mzaMsisdn) {
      setMsisdn(mzaMsisdn);
      setIsAutoMsisdn(true);
    }
  }, []);


  // ── Shared routing logic after any successful sign-up (mobile OR Google) ──
  // Same flow: profile → role → grade → dashboard
  const routeAfterSubscribe = async (resolvedMsisdn: string) => {
    // Check if user came from ISSB or MDCAT Enroll Now
    const returnPortal = sessionStorage.getItem("subscribe_return_portal");
    if (returnPortal === "issb") {
      sessionStorage.removeItem("subscribe_return_portal");
      login(resolvedMsisdn);
      // Sync with ISSB backend so user is logged into ISSB on arrival
      try {
        const profile = await getUserProfile(resolvedMsisdn);
        if (profile) {
          const syncRes = await fetch(
            "https://api.zaheen.com.pk/testprep/api/auth/zaheen-sync",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                zaheen_id: String(profile.id),
                name:      profile.name  || "",
                email:     profile.email || "",
                phone:     resolvedMsisdn,
              }),
            }
          );
          const syncJson = await syncRes.json();
          if (syncJson?.success) {
            // Write issb_auth so ISSB project reads it on load
            const issbAuth = {
              issbUserId: String(syncJson.data.issb_user_id),
              zaheenId:   String(profile.id),
              msisdn:     resolvedMsisdn,
              name:       syncJson.data.name || profile.name || "",
            };
            localStorage.setItem("issb_auth",    JSON.stringify(issbAuth));
            localStorage.setItem("issb_user_id", String(syncJson.data.issb_user_id));
          }
        }
      } catch {
        // Non-critical — redirect anyway, user can log in manually if sync fails
      }
      window.location.href = "https://zaheen.com.pk/issb/";
      return;
    }
    if (returnPortal === "nat") {
      sessionStorage.removeItem("subscribe_return_portal");
      login(resolvedMsisdn);
      try {
        const profile = await getUserProfile(resolvedMsisdn);
        if (profile) {
          localStorage.setItem("nat_auth", JSON.stringify({
            userId: profile.id,
            msisdn: resolvedMsisdn,
            name:   profile.name || "",
          }));
          localStorage.setItem("zaheen_user_id",   String(profile.id));
          localStorage.setItem("user_id",          String(profile.id));
          localStorage.setItem("zaheen_user_name", profile.name || "");
        }
      } catch { /* non-critical */ }
      window.location.replace("/nat/");
      return;
    }
    if (returnPortal === "mdcat") {
      sessionStorage.removeItem("subscribe_return_portal");
      login(resolvedMsisdn);
      window.location.href = "https://zaheen.com.pk/mdcat";
      return;
    }
    if (returnPortal === "uniprep") {
      sessionStorage.removeItem("subscribe_return_portal");
      login(resolvedMsisdn);
      window.location.href = "https://zaheen.com.pk/uniprep/";
      return;
    }
    if (returnPortal === "trading") {
      sessionStorage.removeItem("subscribe_return_portal");
      try {
        const profile = await getUserProfile(resolvedMsisdn);
        if (profile) {
          const status = await getSetupStatus(profile.id);
          loginWithUser({
            msisdn:           resolvedMsisdn,
            userId:           profile.id,
            isKid:            false,
            role:             status.role              ?? null,
            selectedClassId:  status.selected_class_id  ?? null,
            selectedCourseId: status.selected_course_id ?? null,
          });
        } else {
          login(resolvedMsisdn);
        }
      } catch {
        login(resolvedMsisdn);
      }
      // Trading lives inside Zaheen (Professional Skills), so use the router, not a full reload
      navigate("/skills/how-to-become-a-professional-trader", { replace: true });
      return;
    }

    try {
      // ── Normal Zaheen LMS flow ────────────────────────────────────────────
      const profile = await getUserProfile(resolvedMsisdn);

      if (!profile) {
        login(resolvedMsisdn);
        navigate("/profile?setup=true", { replace: true });
        return;
      }

      const status = await getSetupStatus(profile.id);

      loginWithUser({
        msisdn:           resolvedMsisdn,
        userId:           profile.id,
        isKid:            false,
        role:             status.role              ?? null,
        selectedClassId:  status.selected_class_id  ?? null,
        selectedCourseId: status.selected_course_id ?? null,
      });

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

    } catch {
      login(resolvedMsisdn);
      navigate("/profile?setup=true", { replace: true });
    }
  };

  const handleZongSubscribe = async () => {
    if (!msisdn) { setError("Please enter your mobile number"); return; }
    try {
      setLoading(true); setError("");
      if (isAutoMsisdn) {
        const sub = await subscribeUser(msisdn, serviceId);
        if (sub.status === "1" || sub.desc?.toLowerCase().includes("already active")) {
          localStorage.setItem("activeServiceId", serviceId);
          await routeAfterSubscribe(msisdn);
        } else {
          setError(sub.desc || "Subscription failed");
        }
      } else {
        const res = await sendPin(msisdn, serviceId);
        if (res.status === "PIN_SENT") { setStep("OTP"); setTimer(30); trackPinSent(); }
        else setError("Failed to send PIN");
      }
    } catch { setError("Operation failed"); }
    setLoading(false);
  };

  const handleSubscribe = () => {
    handleZongSubscribe();
  };

  // ── Social sign-up handlers ──
  const handleGoogleSignUp = () => {
    setSocialLoading("google");
    const redirectUri = `${window.location.origin}/social-callback`;
    const page   = new URLSearchParams(window.location.search).get("page")   ?? "";
    const source = new URLSearchParams(window.location.search).get("source") ?? "";
    const portal = page.includes("mdcat")    ? "mdcat"
                 : page.includes("issb")     ? "issb"
                 : page.includes("nat")      ? "nat"
                 : page.includes("trading")  ? "trading"
                 : page.includes("uniprep")  ? "uniprep"
                 : "web";
    sessionStorage.setItem("social_portal", JSON.stringify({ portal, ts: Date.now() }));
    window.location.href = `https://api.zaheen.com.pk/v2/api/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}&portal=${portal}&page=${encodeURIComponent(page)}&source=${encodeURIComponent(source)}`;
  };


  const handleVerifyPin = async () => {
    try {
      setLoading(true); setError("");
      const verify = await verifyPin(msisdn, pin, serviceId);
      if (verify.status === "SUCCESS") {
        const sub = await subscribeUser(msisdn, serviceId);
        if (sub.status === "1" || sub.desc?.toLowerCase().includes("already active")) {
          localStorage.setItem("activeServiceId", serviceId);
          trackSubscription(5);
          await routeAfterSubscribe(msisdn);
        } else {
          setError(sub.desc || "Subscription failed");
        }
      } else {
        setError(verify.message || "Invalid PIN. Please try again.");
      }
    } catch { setError("Verification failed"); }
    setLoading(false);
  };

  useEffect(() => {
    if (step !== "OTP" || timer === 0) return;
    const interval = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleResend = async () => { setTimer(30); await sendPin(msisdn, serviceId); };

  const sparks = [
    { top: "12%", left: "8%",  delay: "0s",    dur: "2.6s" },
    { top: "22%", left: "88%", delay: "0.7s",  dur: "2.1s" },
    { top: "72%", left: "14%", delay: "1.2s",  dur: "2.8s" },
    { top: "80%", left: "90%", delay: "0.4s",  dur: "2.3s" },
    { top: "10%", left: "55%", delay: "1.5s",  dur: "2.0s" },
    { top: "62%", left: "47%", delay: "0.9s",  dur: "2.5s" },
  ];

  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4 py-12">

      {/* Ambient sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "600px", height: "600px",
            background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(251,191,36,0.08)",
        }}
      >
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #F0B429, #2DD4BF)" }} />

        <div className="p-8">

          {/* ── STEP: MSISDN ── */}
          {step === "MSISDN" && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                  Get started
                </p>
                <h1
                  className="text-3xl text-white leading-tight"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                >
                  Sign Up
                </h1>
                <p className="text-slate-400 text-sm mt-2">
                  Unlock lessons, practice sets, and progress tracking.
                </p>
              </div>

              {/* ── Social sign-up buttons ── */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleGoogleSignUp}
                  disabled={!!socialLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#e2e8f0",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                >
                  {socialLoading === "google" ? (
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-400/30 border-t-slate-300 animate-spin" />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <path d="M43.611 20.083H42V20H24v8h11.303C33.973 32.28 29.418 35 24 35c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                      <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                      <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 35c-5.399 0-9.944-3.647-11.298-8.56l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                      <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                    </svg>
                  )}
                  Sign up with Google
                </button>

              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-xs text-slate-500 font-medium">or sign up with mobile</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>


              {/* Mobile input */}
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                Mobile Number
              </label>
              <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm select-none">📱</span>
                <input
                  type="text"
                  value={msisdn}
                  onChange={(e) => setMsisdn(e.target.value)}
                  disabled={isAutoMsisdn}
                  placeholder="923XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#F0B429")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
              {error && (
                <div
                  className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#fca5a5",
                  }}
                >
                  <span>⚠</span> {error}
                </div>
              )}

              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="group w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading ? "rgba(240,180,41,0.4)" : "linear-gradient(135deg, #F0B429, #f59e0b)",
                  color: "#0f172a",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                }}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full" />
                    Processing…
                  </>
                ) : isAutoMsisdn ? (
                  "Subscribe Now →"
                ) : (
                  "Send PIN →"
                )}
              </button>

              <p className="text-center text-xs text-slate-600 mt-4">
                By signing up you agree to our{" "}
                <span onClick={() => navigate("/terms")} className="text-teal-500 cursor-pointer hover:underline">
                  Terms & Conditions
                </span>
              </p>
            </>
          )}

          {/* ── STEP: OTP ── */}
          {step === "OTP" && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
                  style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)" }}>
                  <span className="text-2xl">📩</span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                  Verification
                </p>
                <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                  Enter your PIN
                </h1>
                <p className="text-slate-400 text-sm mt-2">
                  We sent a PIN to <span className="text-amber-400 font-medium">{msisdn}</span>
                </p>
              </div>

              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="· · · ·"
                className="w-full text-center text-3xl font-bold py-4 rounded-xl tracking-[0.5em] mb-5 text-white"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                  letterSpacing: "0.5em",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#F0B429")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />

              {error && (
                <div
                  className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    color: "#fca5a5",
                  }}
                >
                  <span>⚠</span> {error}
                </div>
              )}

              <button
                onClick={handleVerifyPin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: loading ? "rgba(240,180,41,0.4)" : "linear-gradient(135deg, #F0B429, #f59e0b)",
                  color: "#0f172a",
                  boxShadow: loading ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                }}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full" />
                    Verifying…
                  </>
                ) : (
                  "Verify & Subscribe →"
                )}
              </button>

              <div className="text-center mt-5">
                {timer > 0 ? (
                  <p className="text-slate-500 text-sm">
                    Resend PIN in <span className="text-amber-400 font-semibold">{timer}s</span>
                  </p>
                ) : (
                  <button onClick={handleResend} className="text-teal-400 text-sm hover:underline transition-colors">
                    Resend PIN
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── STEP: SUCCESS ── */}
          {step === "SUCCESS" && (
            <div className="text-center py-4">
              <div className="relative mx-auto mb-8 h-28 w-28">
                <svg viewBox="0 0 120 120" className="h-full w-full">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#F0B429" strokeOpacity="0.2" strokeWidth="2" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" stroke="#F0B429" strokeWidth="2.5"
                    strokeDasharray="327" strokeDashoffset="327" strokeLinecap="round"
                    style={{
                      animation: "seal-draw 1.1s ease-out forwards",
                      transform: "rotate(-90deg)",
                      transformOrigin: "60px 60px",
                    }}
                  />
                  <circle cx="60" cy="60" r="40" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
                  <path
                    d="M42 61 L54 73 L79 46"
                    fill="none" stroke="#2DD4BF" strokeWidth="6"
                    strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="60" strokeDashoffset="60"
                    style={{ animation: "seal-check 0.5s ease-out 0.9s forwards" }}
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-3">
                Subscription confirmed
              </p>
              <h1 className="text-3xl text-white mb-3" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                You're all set!
              </h1>
              <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
                Welcome to Zaheen. Your lessons, practice sets, and progress tracking are ready.
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #F0B429, #f59e0b)",
                  color: "#0f172a",
                  boxShadow: "0 4px 20px rgba(240,180,41,0.4)",
                }}
              >
                Start Learning →
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes seal-draw { to { stroke-dashoffset: 0; } }
        @keyframes seal-check { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
};

export default SubscribePage;