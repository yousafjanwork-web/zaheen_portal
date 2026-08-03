import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/modules/shared/services/profileService";
import { notifyNameChanged } from "@/modules/shared/hooks/useUserDisplayName";
 
/* ── Helpers ── */
const initials = (name: string) =>
  name.trim().split(" ").filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join("");
 
const isMsisdn = (value: string, msisdn: string) =>
  value === msisdn || value === msisdn.replace(/^92/, "0");
 
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
  const { msisdn, isLoggedIn } = useAuth();
  const navigate = useNavigate();
 
  /* Redirect guests */
  useEffect(() => { if (!isLoggedIn) navigate("/"); }, [isLoggedIn]);
 
  /* Font */
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
 
  /* ── State ── */
  const [userId, setUserId] = useState<number | null>(null); // id needed for PUT
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hasProfile, setHasProfile] = useState(false); // false = no DB record yet
 
  /* ── Populate form from profile ── */
  const populateForm = (profile: UserProfile) => {
    const rawUsername = profile.username ?? "";
    setUserId(profile.id);
    setHasProfile(true);
    setForm({
      name:     profile.name     ?? "",
      username: isMsisdn(rawUsername, profile.msisdn) ? "" : rawUsername,
      email:    profile.email    ?? "",
      password: "",
    });
  };
 
  /* ── Fetch from API on mount — no localStorage involved ── */
  useEffect(() => {
    if (!msisdn) return;
    setLoading(true);
    setError("");
    getUserProfile(msisdn)
      .then((profile) => {
        if (profile) {
          populateForm(profile);
        } else {
          // New user — no profile record exists yet
          setHasProfile(false);
          setUserId(null);
        }
      })
      .catch(() => setError("Could not load your profile. Please try again."))
      .finally(() => setLoading(false));
  }, [msisdn]);
 
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
 
      /* PUT /api/users/:id — only send fields that have values */
      const saved = await updateUserProfile(userId, {
        name:  form.name.trim(),
        email: form.email.trim(),
        ...(form.username.trim() ? { username: form.username.trim() } : {}),
        ...(form.password        ? { password: form.password }        : {}),
      });
 
      /* Re-populate from the API response — this is the DB truth */
      populateForm(saved);
      setSuccess(true);
 
      /* Notify navbar instantly (no localStorage) */
      notifyNameChanged(msisdn!, saved.name?.trim() || form.name.trim());
      navigate("/");
 
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
          <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
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
                  {hasProfile ? "My Profile" : "Complete Your Profile"}
                </p>
                <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                  {form.name || "Your Account"}
                </h1>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs"
                  style={{ background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.2)", color: "#5eead4" }}>
                  📱 {msisdn}
                </div>
 
 
              </div>
 
              {/* Notice for new users with no profile yet */}
              {!hasProfile && (
                <div className="mb-5 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.2)", color: "#fcd34d" }}>
                  ℹ Your profile details are not set yet. You can fill them in and save — this will allow you to log in with a username and password in the future.
                </div>
              )}
 
              {/* Fields */}
              <div className="space-y-4 mb-6">
                {[
                  { field: "name",     label: "Full Name",     placeholder: "e.g. Ali Hassan",              type: "text",  icon: "👤" },
                  { field: "username", label: "Username",      placeholder: "Choose a username (for login)", type: "text",  icon: "🏷️" },
                  { field: "email",    label: "Gmail / Email", placeholder: "you@gmail.com",                type: "email", icon: "✉️" },
                ].map(({ field, label, placeholder, type, icon }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      {label}
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
                    <span className="text-slate-600 normal-case tracking-normal font-normal">
                      (leave blank to keep unchanged)
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      placeholder="Set a password for username login"
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
                    Setting a username + password lets you log in without OTP next time.
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
              {success && (
                <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                  style={{ background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.25)", color: "#5eead4" }}>
                  ✓ Profile updated in database successfully!
                </div>
              )}
 
              {/* Save */}
              <button onClick={handleSave} disabled={saving || !userId}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: (saving || !userId) ? "rgba(240,180,41,0.4)" : "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: (saving || !userId) ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                  cursor: !userId ? "not-allowed" : "pointer",
                }}>
                {saving
                  ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />Saving…</>
                  : "Save Changes →"}
              </button>
 
              {!userId && !loading && (
                <p className="text-center text-xs text-red-400 mt-3">
                  Could not load your profile ID. Please refresh the page.
                </p>
              )}
 
              <p className="text-center text-xs text-slate-600 mt-4">
                Mobile number <span className="text-teal-500">{msisdn}</span> cannot be changed.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default ProfilePage;