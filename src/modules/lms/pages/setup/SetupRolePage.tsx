/**
 * SetupRolePage.tsx — Step 2 of setup
 * User selects: Learner / Parent
 * PUT /lms/users/:id/role → navigate to /setup/grade-course or /setup/add-child
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { setUserRole } from "@/modules/shared/services/lmsService";

const amber    = "#F0B429";
const amberDim = "rgba(240,180,41,0.12)";
const amberBdr = "rgba(240,180,41,0.28)";
const blue     = "#3B82F6";
const blueDim  = "rgba(59,130,246,0.12)";
const blueBdr  = "rgba(59,130,246,0.28)";

const SetupSidebar: React.FC<{ active: string }> = ({ active }) => {
  const navigate = useNavigate();
  const { logout, role, isKid } = useAuth();

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
      {/* Logo */}
      <div style={{ padding: "28px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(135deg,${amber},#f59e0b)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#0f172a", fontWeight: 700, fontSize: 15 }}>Z</span>
          </div>
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 18, fontFamily: "'Fraunces', serif" }}>Zaheen</span>
        </div>
      </div>

      <div style={{ height: 1, margin: "0 16px 16px", background: "rgba(255,255,255,0.06)" }} />

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#475569", padding: "4px 12px 8px", marginTop: 4 }}>Menu</p>
        {items.filter(i => i.id === "dashboard").map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500,
              textAlign: "left", cursor: "pointer", marginBottom: 2,
              background: active === item.id ? blueDim : "transparent",
              color: active === item.id ? blue : "#64748b",
              border: active === item.id ? `1px solid ${blueBdr}` : "1px solid transparent",
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}

        <div style={{ height: 1, margin: "8px 8px", background: "rgba(255,255,255,0.06)" }} />
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "#475569", padding: "4px 12px 8px" }}>Setup</p>
        {items.filter(i => i.id !== "dashboard" && i.id !== "profile").map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500,
              textAlign: "left", cursor: "pointer", marginBottom: 2,
              background: active === item.id ? amberDim : "transparent",
              color: active === item.id ? amber : "#64748b",
              border: active === item.id ? `1px solid ${amberBdr}` : "1px solid transparent",
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "0 12px 24px" }}>
        <div style={{ height: 1, margin: "0 8px 12px", background: "rgba(255,255,255,0.06)" }} />
        {items.filter(i => i.id === "profile").map(item => (
          <button key={item.id} onClick={() => navigate(item.path)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12, fontSize: 14, fontWeight: 500,
              textAlign: "left", cursor: "pointer", marginBottom: 2,
              background: "transparent", color: "#64748b", border: "1px solid transparent",
            }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
        <button onClick={logout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 12, fontSize: 14,
            textAlign: "left", cursor: "pointer",
            background: "transparent", color: "#f87171", border: "1px solid transparent",
          }}>
          <span style={{ fontSize: 16 }}>🚪</span>Log out
        </button>
      </div>
    </aside>
  );
};

type Role = "learner" | "parent";

interface RoleOption {
  key:   Role;
  emoji: string;
  title: string;
  desc:  string;
}

const ROLES: RoleOption[] = [
  {
    key:   "learner",
    emoji: "🎓",
    title: "I am a Learner",
    desc:  "I want to study and track my own progress.",
  },
  {
    key:   "parent",
    emoji: "👨‍👧",
    title: "I am a Parent",
    desc:  "I want to manage and monitor my children's learning.",
  },
];

const sparks = [
  { top: "8%",  left: "5%",  delay: "0s",   dur: "2.6s" },
  { top: "18%", left: "92%", delay: "0.7s", dur: "2.1s" },
  { top: "76%", left: "10%", delay: "1.2s", dur: "2.8s" },
  { top: "85%", left: "87%", delay: "0.4s", dur: "2.3s" },
];

const SetupRolePage: React.FC = () => {
  const { userId, setRole } = useAuth();
  const navigate = useNavigate();

  const [selected, setSelected] = useState<Role | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");

  const handleContinue = async () => {
    if (!selected) { setError("Please select a role to continue."); return; }
    if (!userId)   { setError("Session error — please log in again."); return; }

    try {
      setSaving(true);
      setError("");
      await setUserRole(userId, selected);
      setRole(selected);
if (selected === "learner") {
        navigate("/setup/grade-course");
      } else {
        navigate("/setup/add-child");
      }
    } catch (err: any) {
      setError(err?.message || "Could not save your role. Please try again.");
    } finally {
      setSaving(false);
    }
  };

 return (
    <div className="min-h-screen bg-slate-900 flex">
      <div className="hidden md:flex">
        <SetupSidebar active="setup-role" />
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

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="text-amber-400 font-semibold">Step 2 of 3</span>
            <span>Profile → Role → Grade</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div className="h-1 rounded-full bg-amber-400 transition-all" style={{ width: "66%" }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(15,23,42,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
          }}>

          <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />

          <div className="p-8">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                Select Your Role
              </p>
              <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                How will you use Zaheen?
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                You can change this later in your profile settings.
              </p>
            </div>

            {/* Role cards */}
            <div className="space-y-3 mb-8">
              {ROLES.map((role) => {
                const isActive = selected === role.key;
                return (
                  <button
                    key={role.key}
                    onClick={() => { setSelected(role.key); setError(""); }}
                    className="w-full text-left px-5 py-4 rounded-xl flex items-center gap-4 transition-all duration-200"
                    style={{
                      background: isActive
                        ? "rgba(240,180,41,0.12)"
                        : "rgba(255,255,255,0.04)",
                      border: isActive
                        ? "1px solid rgba(240,180,41,0.5)"
                        : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive ? "0 0 0 1px rgba(240,180,41,0.2)" : "none",
                    }}
                  >
                    <span className="text-3xl flex-shrink-0">{role.emoji}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{role.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{role.desc}</p>
                    </div>
                    {isActive && (
                      <span className="ml-auto text-amber-400 text-lg flex-shrink-0">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                ⚠ {error}
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={saving || !selected}
              className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: (!selected || saving)
                  ? "rgba(240,180,41,0.4)"
                  : "linear-gradient(135deg,#F0B429,#f59e0b)",
                color: "#0f172a",
                boxShadow: (!selected || saving) ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                cursor: !selected ? "not-allowed" : "pointer",
              }}
            >
              {saving
                ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" /> Saving…</>
                : "Continue →"}
            </button>
          </div>
        </div>
      </div>
   </div>
    </div>
  );
};

export default SetupRolePage;