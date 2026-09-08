/**
 * ProfilePage.tsx — Updated for setup flow
 *
 * Normal usage (/profile):       save → navigate("/")
 * Setup flow  (/profile?setup=true): save → navigate("/setup/role")
 *
 * The only change from the original is:
 *  1. Read `?setup=true` from the URL
 *  2. After successful save, redirect to /setup/role instead of /
 *  3. Show a setup-mode banner and adjusted heading/button copy
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/modules/shared/services/profileService";
import { getDashboard } from "@/modules/shared/services/lmsService";
import { notifyNameChanged } from "@/modules/shared/hooks/useUserDisplayName";

/* ── Helpers ── */
const initials = (name: string) =>
  name.trim().split(" ").filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join("");

const isMsisdn = (value: string, msisdn: string | null) =>
  !!msisdn && (value === msisdn || value === msisdn.replace(/^92/, "0"));

const sparks = [
  { top: "10%", left: "6%",  delay: "0s",   dur: "2.6s" },
  { top: "20%", left: "90%", delay: "0.7s", dur: "2.1s" },
  { top: "74%", left: "12%", delay: "1.2s", dur: "2.8s" },
  { top: "82%", left: "88%", delay: "0.4s", dur: "2.3s" },
  { top: "8%",  left: "55%", delay: "1.5s", dur: "2.0s" },
  { top: "60%", left: "46%", delay: "0.9s", dur: "2.5s" },
];

/* ── Component ── */
const ProfilePage: React.FC = () => {
const { msisdn, userId: authUserId, isKid, isLoggedIn, loginWithUser, role, selectedClassId, selectedCourseId } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* Are we in the first-time setup flow? */
const isSetupMode = searchParams.get("setup"); // "true" | "subscribe" | null

  /* Redirect guests */
  useEffect(() => { if (!isLoggedIn) navigate("/login"); }, [isLoggedIn]);

  /* Font */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  /* ── State ── */
  const [userId, setUserId]   = useState<number | null>(null);
  const [form, setForm]       = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  /* ── Populate form from profile ── */
  const populateForm = (profile: UserProfile) => {
    const rawUsername = profile.username ?? "";
    setUserId(profile.id);
    setHasProfile(true);
    setForm({
      name:     profile.name  ?? "",
      username: isMsisdn(rawUsername, profile.msisdn) ? "" : rawUsername,
      email:    profile.email ?? "",
      password: "",
    });
  };

  /* ── Fetch profile on mount ── */
  /* ── Fetch profile on mount ── */
  useEffect(() => {
    const hasValidMsisdn = msisdn && msisdn.trim().length > 0;
    // authUserId from context may not be set yet due to React state batching
    // fall back to localStorage which is written synchronously by loginWithUser
    const localStorageUserId = (() => {
      try {
        const raw = localStorage.getItem("zaheen_auth");
        if (raw) {
          const parsed = JSON.parse(raw);
          return parsed.userId && parsed.userId > 0 ? parsed.userId : null;
        }
        return null;
      } catch { return null; }
    })();
    const resolvedUserId = (authUserId && authUserId > 0) ? authUserId : localStorageUserId;
    const hasValidUserId = resolvedUserId && resolvedUserId > 0;
    if (!hasValidMsisdn && !hasValidUserId) return;
    setLoading(true);
    setError("");
    const fetchPromise = hasValidMsisdn
      ? getUserProfile(msisdn)
      : getDashboard(resolvedUserId!)
          .then((data) => data?.user ?? null);
    fetchPromise
      .then((profile) => {
        if (profile) {
          populateForm(profile);
        } else {
          // New Google user — no profile yet, show empty form
          setHasProfile(false);
          // Set userId from resolvedUserId so Save button works
          if (resolvedUserId) setUserId(resolvedUserId);
        }
      })
      .catch(() => {
        // 404 = new Google user with no LMS profile yet — show empty form
        setHasProfile(false);
        setError(""); // clear error, empty form is correct for new users
        // Set userId so Save button works even when profile doesn't exist yet
        if (resolvedUserId) setUserId(resolvedUserId);
      })
      .finally(() => setLoading(false));
  }, [msisdn, authUserId]);

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setError("");
      setSuccess(false);
    };

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email address"); return;
    }
    if (!userId) {
      setError("Profile ID not found. Please refresh and try again."); return;
    }

    try {
      setSaving(true);
      setError("");

      const saved = await updateUserProfile(userId, {
        name:  form.name.trim(),
        email: form.email.trim(),
        ...(form.username.trim() ? { username: form.username.trim() } : {}),
        ...(form.password        ? { password: form.password }        : {}),
      });

      populateForm(saved);
      setSuccess(true);

   if (msisdn) {
        notifyNameChanged(msisdn, saved.name?.trim() || form.name.trim());
      } else if (authUserId) {
        // Update displayName in context — preserve isKid correctly from context
        loginWithUser({
          msisdn:          "",
          userId:          authUserId,
          isKid:           isKid,  // ✅ use actual isKid from context, not hardcoded true
          role:            role ?? "learner",
          selectedClassId,
          selectedCourseId,
          displayName:     saved.name?.trim() || form.name.trim(),
        });
      }

    // Route depends on which setup flow triggered this page
// Route depends on which setup flow triggered this page
    if (isSetupMode === "subscribe") {
      navigate("/");
    } else if (isSetupMode) {
      try {
        const { setGradeAndCourse } = await import("@/modules/shared/services/lmsService");
        await setGradeAndCourse(userId, null, null);
      } catch {
        // Non-fatal
      }
      navigate("/setup/role");
    } else {
      navigate("/dashboard");
    }
    } catch (err: any) {
      setError(err?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="relative min-h-screen bg-slate-900 overflow-hidden flex items-center justify-center px-4 py-16">

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }} />
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "rgba(15,23,42,0.88)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
        }}>

        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

        <div className="p-8">

          {/* Setup mode progress bar */}
          {isSetupMode && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="text-amber-400 font-semibold">Step 1 of 3</span>
                <span>Profile → Role → Grade</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-amber-400" style={{ width: "33%" }} />
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 w-20 rounded-full bg-white/10 mx-auto" />
              <div className="h-4 bg-white/10 rounded w-3/4 mx-auto" />
              <div className="h-12 bg-white/10 rounded-xl" />
              <div className="h-12 bg-white/10 rounded-xl" />
              <div className="h-12 bg-white/10 rounded-xl" />
            </div>
          ) : (
            <>
              {/* Avatar + heading */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold"
                  style={{
                    background: form.name ? "linear-gradient(135deg,#F0B429,#f59e0b)" : "rgba(255,255,255,0.07)",
                    color: form.name ? "#0f172a" : "#475569",
                    border: "2px solid rgba(240,180,41,0.3)",
                    boxShadow: form.name ? "0 0 24px rgba(240,180,41,0.25)" : "none",
                  }}>
                  {form.name ? initials(form.name) : "?"}
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-1">
                  {isSetupMode ? "Set Up Your Profile" : (hasProfile ? "My Profile" : "Complete Your Profile")}
                </p>
                <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                  {isSetupMode ? "First, tell us about yourself" : (form.name || "Your Account")}
                </h1>
               {msisdn && (
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs"
                    style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", color: "#5eead4" }}>
                    📱 {msisdn}
                  </div>
                )}
              </div>

              {/* Setup mode notice */}
              {isSetupMode && (
                <div className="mb-5 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)", color: "#fcd34d" }}>
                  ℹ Fill in your details to continue. After this you'll choose your role and select your grade.
                </div>
              )}

              {/* Fields */}
              <div className="space-y-4 mb-6">
                {[
                  { field: "name",     label: "Full Name",     placeholder: "e.g. Ali Hassan",               type: "text",  icon: "👤", required: true  },
                  { field: "username", label: "Username",      placeholder: "Choose a username (for login)",  type: "text",  icon: "🏷️", required: false },
                  { field: "email",    label: "Gmail / Email", placeholder: "you@gmail.com",                 type: "email", icon: "✉️", required: true  },
                ].map(({ field, label, placeholder, type, icon, required }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      {label} {required && <span className="text-amber-400">*</span>}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">{icon}</span>
                      <input
                        type={type}
                        value={form[field as keyof typeof form]}
                        onChange={handleChange(field as keyof typeof form)}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }}
                        onFocus={(e) => (e.target.style.borderColor = "#F0B429")}
                        onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                      />
                    </div>
                  </div>
                ))}

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                    Password{" "}
                    {!isSetupMode && (
                      <span className="text-slate-600 normal-case tracking-normal font-normal">
                        (leave blank to keep unchanged)
                      </span>
                    )}
                    {isSetupMode && <span className="text-amber-400">*</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      placeholder={isSetupMode ? "Set a password for future logins" : "Set a password for username login"}
                      className="w-full pl-10 pr-16 py-3 rounded-xl text-white placeholder-slate-500 text-sm transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", outline: "none" }}
                      onFocus={(e) => (e.target.style.borderColor = "#F0B429")}
                      onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                    />
                    <button onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-medium">
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1.5 pl-1">
                    {isSetupMode
                      ? "This lets you log in with username + password instead of OTP."
                      : "Setting a username + password lets you log in without OTP next time."}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                  ⚠ {error}
                </div>
              )}

              {/* Success */}
              {success && !isSetupMode && (
                <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", color: "#5eead4" }}>
                  ✓ Profile updated successfully!
                </div>
              )}

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving || !userId}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: (saving || !userId) ? "rgba(240,180,41,0.4)" : "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: (saving || !userId) ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                  cursor: !userId ? "not-allowed" : "pointer",
                }}>
                {saving
                  ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" /> Saving…</>
                  : isSetupMode ? "Save & Continue →" : "Save Changes →"}
              </button>

              {!userId && !loading && (
                <p className="text-center text-xs text-red-400 mt-3">
                  Could not load your profile ID. Please refresh the page.
                </p>
              )}
{msisdn && (
                <p className="text-center text-xs text-slate-600 mt-4">
                  Mobile number <span className="text-teal-500">{msisdn}</span> cannot be changed.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;