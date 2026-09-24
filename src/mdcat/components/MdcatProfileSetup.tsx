import React, { useState } from "react";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { setMdcatProfile } from "@/modules/shared/services/lmsService";

interface MdcatProfileSetupProps {
  onComplete: () => void;
  userIdOverride?: number | null;
}

const Spinner = () => (
  <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
);

export default function MdcatProfileSetup({ onComplete, userIdOverride }: MdcatProfileSetupProps) {
  const { userId: ctxUserId, msisdn, isKid, role, selectedClassId, selectedCourseId, token, loginWithUser } = useAuth();
  const userId = userIdOverride ?? ctxUserId;

  const isGoogleUser = !msisdn || msisdn.trim().length === 0;

  const [form, setForm] = useState({ mobile: "", username: "", password: "", name: "", email: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setError("");
    };

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "#38bdf8");
  const onBlur  = (e: React.FocusEvent<HTMLInputElement>) => (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  const handleSave = async () => {
    if (isGoogleUser && !form.mobile.trim()) {
      setError("Mobile number is required to access MDCAT"); return;
    }
    if (!userId) {
      setError("Session error — please close and try again"); return;
    }

    try {
      setSaving(true);
      setError("");

      if (isGoogleUser) {
        await setMdcatProfile(userId, {
          msisdn: form.mobile.trim(),
          ...(form.username.trim() ? { username: form.username.trim() } : {}),
          ...(form.password        ? { password: form.password }        : {}),
        });
        loginWithUser({
          msisdn:          form.mobile.trim(),
          userId,
          isKid,
          role:            role ?? "learner",
          selectedClassId,
          selectedCourseId,
          token,
        });
      } else {
        await setMdcatProfile(userId, {
          msisdn:            msisdn ?? "",
          ...(form.name.trim()     ? { name: form.name.trim() }         : {}),
          ...(form.email.trim()    ? { email: form.email.trim() }       : {}),
          ...(form.username.trim() ? { username: form.username.trim() } : {}),
          ...(form.password        ? { password: form.password }        : {}),
        });
      }

      onComplete();
    } catch (err: any) {
      setError(err?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ background: "rgba(15,23,42,0.97)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(18px)" }}
    >
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#38bdf8,#0ea5e9)" }} />
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
            style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)" }}>
            <span className="text-sky-400 text-sm">🩺</span>
            <span className="text-sky-300 text-xs font-bold uppercase tracking-wider">MDCAT Profile</span>
          </div>
          <h2 className="text-2xl text-white font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
            One last step
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {isGoogleUser ? "Enter your mobile number to complete MDCAT access" : "Optionally add your details for a better experience"}
          </p>
        </div>

        <div className="mb-5 px-4 py-3 rounded-xl text-sm"
          style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", color: "#7dd3fc" }}>
          {isGoogleUser
            ? "📱 Your mobile number is required for MDCAT verification."
            : "✏️ Your profile is set. You can optionally add a username or password for easier login next time."}
        </div>

        <div className="space-y-4">
          {isGoogleUser && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Mobile Number <span className="text-sky-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">📱</span>
                <input type="text" value={form.mobile} onChange={handleChange("mobile")} placeholder="923XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          )}

          {!isGoogleUser && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Full Name <span className="text-slate-600">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">👤</span>
                <input type="text" value={form.name} onChange={handleChange("name")} placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          )}

          {!isGoogleUser && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                Email <span className="text-slate-600">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">✉️</span>
                <input type="email" value={form.email} onChange={handleChange("email")} placeholder="you@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                  style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Username <span className="text-slate-600">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">🏷️</span>
              <input type="text" value={form.username} onChange={handleChange("username")} placeholder="Choose a username"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Password <span className="text-slate-600">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm select-none">🔒</span>
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange("password")}
                placeholder="Set a password for future logins"
                className="w-full pl-10 pr-16 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              <button onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-medium">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-slate-600 text-[11px] mt-1.5 pl-1">
              This lets you log in with username + password instead of OTP next time.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm mt-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            ⚠ {error}
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="w-full mt-5 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: saving ? "rgba(56,189,248,0.4)" : "linear-gradient(135deg,#38bdf8,#0ea5e9)",
            color: "#0f172a",
            boxShadow: saving ? "none" : "0 4px 16px rgba(56,189,248,0.35)",
            cursor: saving ? "not-allowed" : "pointer",
          }}>
          {saving ? <><Spinner /> Saving…</> : "Complete & Access MDCAT →"}
        </button>

        {!isGoogleUser && (
          <button onClick={onComplete} className="block w-full text-center text-slate-500 text-xs mt-3 hover:text-slate-400">
            Skip for now →
          </button>
        )}
      </div>
    </div>
  );
}