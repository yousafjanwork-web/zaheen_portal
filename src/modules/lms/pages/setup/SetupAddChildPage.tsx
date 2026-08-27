/**
 * SetupAddChildPage.tsx
 *
 * For role = parent: required step (must add at least 1 child)
 * For role = both:   optional step (can skip)
 *
 * POST /lms/parent/add-child for each child
 * After adding (or skipping for 'both'), navigate to /dashboard
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { getGrades, addChild, Grade } from "@/modules/shared/services/lmsService";

const amber    = "#F0B429";
const amberDim = "rgba(240,180,41,0.12)";
const amberBdr = "rgba(240,180,41,0.28)";
const blue     = "#3B82F6";
const blueDim  = "rgba(59,130,246,0.12)";
const blueBdr  = "rgba(59,130,246,0.28)";

const SetupSidebar: React.FC<{ active: string }> = ({ active }) => {
  const navigate = useNavigate();
  const { logout, role } = useAuth();

  const items = [
    { id: "dashboard",    label: "Dashboard",     icon: "⚡", path: "/dashboard" },
    { id: "setup-role",   label: "Change Role",   icon: "🎭", path: "/setup/role" },
    { id: "setup-grade",  label: "Change Grade",  icon: "🎓", path: "/setup/grade-course" },
    { id: "setup-course", label: "Change Course", icon: "🎯", path: "/setup/grade-course" },
    { id: "add-child",    label: "Add Child",     icon: "➕", path: "/setup/add-child" },
    { id: "profile",      label: "Profile",       icon: "👤", path: "/profile" },
  ].filter(item => {
    if (item.id === "add-child" && role !== "parent" && role !== "both") return false;
    if ((item.id === "setup-grade" || item.id === "setup-course") && role !== "learner" && role !== "both") return false;
    return true;
  });

  return (
    <aside style={{
      width: 220, minHeight: "100vh", flexShrink: 0,
      background: "rgba(10,18,36,0.97)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      position: "sticky", top: 0,
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${amber},#f59e0b)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 15 }}>Z</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 18, fontFamily: "'Fraunces', serif" }}>Zaheen</span>
        </div>
      </div>
      <div style={{ height: 1, margin: "0 16px 16px", background: "rgba(255,255,255,0.06)" }} />
      <nav style={{ flex: 1, padding: "0 12px" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#475569", padding: "4px 12px 8px", marginTop: 4 }}>Menu</p>
        {items.filter(i => i.id === "dashboard").map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500, textAlign: "left", cursor: "pointer", marginBottom: 2, background: "transparent", color: "#64748b", border: "1px solid transparent" }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
        <div style={{ height: 1, margin: "8px 8px", background: "rgba(255,255,255,0.06)" }} />
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#475569", padding: "4px 12px 8px" }}>Setup</p>
        {items.filter(i => i.id !== "dashboard" && i.id !== "profile").map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500, textAlign: "left", cursor: "pointer", marginBottom: 2, background: active === item.id ? amberDim : "transparent", color: active === item.id ? amber : "#64748b", border: active === item.id ? `1px solid ${amberBdr}` : "1px solid transparent" }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "0 12px 24px" }}>
        <div style={{ height: 1, margin: "0 8px 12px", background: "rgba(255,255,255,0.06)" }} />
        {items.filter(i => i.id === "profile").map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500, textAlign: "left", cursor: "pointer", marginBottom: 2, background: "transparent", color: "#64748b", border: "1px solid transparent" }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
        <button onClick={logout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, fontSize: 14, textAlign: "left", cursor: "pointer", background: "transparent", color: "#f87171", border: "1px solid transparent" }}>
          <span style={{ fontSize: 16 }}>🚪</span>Log out
        </button>
      </div>
    </aside>
  );
};

interface ChildForm {
  name:      string;
  username:  string;
  password:  string;
  class_id:  number | null;
  course_id: number | null;  // not shown in setup, parent can set later
}

const emptyChild = (): ChildForm => ({
  name:      "",
  username:  "",
  password:  "",
  class_id:  null,
  course_id: null,
});

const sparks = [
  { top: "8%",  left: "5%",  delay: "0s",   dur: "2.6s" },
  { top: "18%", left: "92%", delay: "0.7s", dur: "2.1s" },
  { top: "76%", left: "10%", delay: "1.2s", dur: "2.8s" },
  { top: "85%", left: "87%", delay: "0.4s", dur: "2.3s" },
];

const SetupAddChildPage: React.FC = () => {
  const { userId, role } = useAuth();
  const navigate = useNavigate();

  const [grades,         setGrades]         = useState<Grade[]>([]);
  const [loadingGrades,  setLoadingGrades]  = useState(true);
  const [children,       setChildren]       = useState<ChildForm[]>([emptyChild()]);
 // addedChildren state removed — navigating immediately after save
  const [saving,         setSaving]         = useState(false);
  const [error,          setError]          = useState("");
  const [showPassword,   setShowPassword]   = useState<Record<number, boolean>>({});

  const isBoth   = role === "both";
  const isParent = role === "parent";

  useEffect(() => {
    getGrades()
      .then(setGrades)
      .catch(() => setError("Could not load grades."))
      .finally(() => setLoadingGrades(false));
  }, []);

  const updateChild = (index: number, field: keyof ChildForm, value: string | number | null) => {
    setChildren((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setError("");
  };

  const addAnotherChild = () => {
    setChildren((prev) => [...prev, emptyChild()]);
  };

  const removeChild = (index: number) => {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  };

  const validateChild = (c: ChildForm, index: number): string | null => {
    if (!c.name.trim())     return `Child ${index + 1}: Name is required.`;
    if (!c.username.trim()) return `Child ${index + 1}: Username is required.`;
    if (!c.password.trim()) return `Child ${index + 1}: Password is required.`;
    if (!c.class_id)        return `Child ${index + 1}: Please select a grade.`;
    return null;
  };

  const handleSaveChildren = async () => {
    if (!userId) { setError("Session error — please log in again."); return; }

    // Validate all children
    for (let i = 0; i < children.length; i++) {
      const err = validateChild(children[i], i);
      if (err) { setError(err); return; }
    }

    setSaving(true);
    setError("");

    for (const child of children) {
      try {
        await addChild({
          parent_id: userId,
          name:      child.name.trim(),
          username:  child.username.trim(),
          password:  child.password,
          class_id:  child.class_id!,
          course_id: child.course_id ?? undefined,
        });
      } catch (err: any) {
        setError(`Failed to add "${child.name}": ${err?.message || "Please try again."}`);
        setSaving(false);
        return;
      }
    }

setSaving(false);
    // Mark profile complete for parent before navigating
    try {
      const { setGradeAndCourse } = await import("@/modules/shared/services/lmsService");
      await setGradeAndCourse(userId, null, null);
    } catch {
      // Non-fatal — still proceed to dashboard
    }
    window.location.href = "/dashboard";
  };

const handleSkip = async () => {
    if (userId) {
      try {
        const { setGradeAndCourse } = await import("@/modules/shared/services/lmsService");
        await setGradeAndCourse(userId, null, null);
      } catch {
        // Non-fatal
      }
    }
    window.location.href = "/dashboard";
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

{/* Success screen removed — navigating immediately to dashboard */}

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    outline: "none",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "#F0B429");
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
    (e.target.style.borderColor = "rgba(255,255,255,0.1)");

  return (
    <div className="min-h-screen bg-slate-900 flex">
      <div className="hidden md:flex">
        <SetupSidebar active="add-child" />
      </div>
      <div className="relative flex-1 overflow-hidden flex items-center justify-center px-4 py-16">

      {/* Sparks */}
      <div className="pointer-events-none absolute inset-0">
        {sparks.map((s, i) => (
          <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/60 animate-pulse"
            style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }} />
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)" }} />
      </div>

     <div className="relative z-10 w-full" style={{ maxWidth: 700 }}>

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
            {isBoth ? "Optional Step" : "Add Your Children"}
          </p>
          <h1 className="text-3xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
            Add Kids to Your Account
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {isBoth
              ? "You can add children now or later from your parent dashboard."
              : "Add your children so they can log in and start learning."}
          </p>
        </div>

        {/* Child forms */}
        <div className="space-y-4">
          {children.map((child, index) => (
            <div key={index} className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(15,23,42,0.88)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(18px)",
              }}>
              <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-white font-semibold text-sm">
                    👦 Child {index + 1}
                    {child.name && <span className="text-amber-400 ml-1">— {child.name}</span>}
                  </h3>
                  {children.length > 1 && (
                    <button onClick={() => removeChild(index)}
                      className="text-red-400 text-xs hover:text-red-300">
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(index, "name", e.target.value)}
                      placeholder="Child's name"
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      Username <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={child.username}
                      onChange={(e) => updateChild(index, "username", e.target.value)}
                      placeholder="login_username"
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      Password <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type={showPassword[index] ? "text" : "password"}
                      value={child.password}
                      onChange={(e) => updateChild(index, "password", e.target.value)}
                      placeholder="Set a password"
                      className="w-full pl-4 pr-14 py-3 rounded-xl text-white placeholder-slate-500 text-sm"
                      style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                    />
                    <button
                      onClick={() => setShowPassword((p) => ({ ...p, [index]: !p[index] }))}
                      className="absolute right-3 bottom-3 text-slate-500 hover:text-slate-300 text-xs font-medium">
                      {showPassword[index] ? "Hide" : "Show"}
                    </button>
                  </div>

                  {/* Grade */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                      Grade <span className="text-amber-400">*</span>
                    </label>
                    {loadingGrades ? (
                      <div className="h-12 rounded-xl bg-white/10 animate-pulse" />
                    ) : (
                      <select
                        value={child.class_id ?? ""}
                        onChange={(e) =>
                          updateChild(index, "class_id", e.target.value ? Number(e.target.value) : null)
                        }
                        className="w-full px-4 py-3 rounded-xl text-sm"
                        style={{
                          ...inputStyle,
                          color: child.class_id ? "#fff" : "#64748b",
                          appearance: "none",
                        }}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      >
                        <option value="">Select grade…</option>
                        {grades.map((g) => (
                          <option key={g.id} value={g.id} style={{ background: "#0f172a" }}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add another */}
        <button
          onClick={addAnotherChild}
          className="w-full mt-4 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px dashed rgba(255,255,255,0.15)",
            color: "#94a3b8",
          }}
        >
          + Add Another Child
        </button>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm mt-4 px-4 py-3 rounded-xl"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
            ⚠ {error}
          </div>
        )}

        {/* Actions */}
        <div className={`mt-6 flex gap-3 ${!isBoth ? "" : ""}`}>
          {isBoth && (
            <button
              onClick={handleSkip}
              className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8",
              }}
            >
              Skip for now
            </button>
          )}

          <button
            onClick={handleSaveChildren}
            disabled={saving}
            className={`${isBoth ? "flex-1" : "w-full"} py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all`}
            style={{
              background: saving
                ? "rgba(240,180,41,0.4)"
                : "linear-gradient(135deg,#F0B429,#f59e0b)",
              color: "#0f172a",
              boxShadow: saving ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving
              ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" /> Adding kids…</>
              : `Add ${children.length > 1 ? `${children.length} Children` : "Child"} & Continue →`}
          </button>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          You can add more children anytime from your parent dashboard.
        </p>
      </div>
   </div>
    </div>
  );
};

export default SetupAddChildPage;