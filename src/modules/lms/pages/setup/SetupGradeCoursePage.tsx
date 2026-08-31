/**
 * SetupGradeCoursePage.tsx — Step 3 of setup (for role = learner)
 *
 * Screen A: Select Grade (optional — user can skip)
 * Screen B: Select Course (optional — user can skip)
 * Save:     PUT /lms/users/:id/grade-course → sets is_profile_complete = 1
 *
 * For role = "learner": go directly to /dashboard
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  getGrades,
  getCourses,
  setGradeAndCourse,
  Grade,
  Course,
} from "@/modules/shared/services/lmsService";

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

type SubStep = "GRADE" | "COURSE";

const sparks = [
  { top: "8%",  left: "5%",  delay: "0s",   dur: "2.6s" },
  { top: "18%", left: "92%", delay: "0.7s", dur: "2.1s" },
  { top: "76%", left: "10%", delay: "1.2s", dur: "2.8s" },
  { top: "85%", left: "87%", delay: "0.4s", dur: "2.3s" },
];

const SetupGradeCoursePage: React.FC = () => {
  const { userId, role, setSelectedGrade } = useAuth();
  const navigate = useNavigate();

  const [subStep,          setSubStep]          = useState<SubStep>("GRADE");
  const [grades,           setGrades]           = useState<Grade[]>([]);
  const [courses,          setCourses]          = useState<Course[]>([]);
  const [selectedGradeId,  setSelectedGradeId]  = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [loadingGrades,    setLoadingGrades]    = useState(true);
  const [loadingCourses,   setLoadingCourses]   = useState(false);
  const [saving,           setSaving]           = useState(false);
  const [error,            setError]            = useState("");

  /* ── Fetch grades on mount ── */
  useEffect(() => {
    getGrades()
      .then(setGrades)
      .catch(() => setError("Could not load grades. Please refresh."))
      .finally(() => setLoadingGrades(false));
  }, []);

  /* ── Skip grade entirely — go straight to dashboard ── */
/* ── Skip grade entirely — still mark profile complete, then go to dashboard ── */
  const handleSkipAll = async () => {
    if (!userId) { navigate("/dashboard"); return; }
    try {
      // Must call setGradeAndCourse even with no grade/course
      // because this is what sets is_profile_complete = 1 on the backend
      await setGradeAndCourse(userId, null as any, null);
    } catch {
      // If it fails, still proceed — don't block the user
    }
    navigate("/dashboard");
  };

  /* ── Fetch courses when moving to course step ── */
  const goToCourseStep = async () => {
    setLoadingCourses(true);
    try {
      const data = await getCourses();
      setCourses(data);
      setSubStep("COURSE");
    } catch {
      setError("Could not load courses. Please try again.");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleGradeNext = () => {
    if (!selectedGradeId) { setError("Please select a grade to continue."); return; }
    setError("");
    goToCourseStep();
  };

  /* ── Save grade + optional course ── */
  const handleSave = async (courseId: number | null) => {
    if (!userId || !selectedGradeId) return;
    try {
      setSaving(true);
      setError("");
      await setGradeAndCourse(userId, selectedGradeId, courseId);
      setSelectedGrade(selectedGradeId, courseId);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Could not save your selection. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedGrade = grades.find((g) => g.id === selectedGradeId);

  /* ── Shared card wrapper ── */
  const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(15,23,42,0.88)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(251,191,36,0.07)",
      }}>
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#F0B429,#2DD4BF)" }} />
      <div className="p-8">{children}</div>
    </div>
  );

 return (
    <div className="min-h-screen bg-slate-900 flex">
      <div className="hidden md:flex">
        <SetupSidebar active={subStep === "GRADE" ? "setup-grade" : "setup-course"} />
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
            <span className="text-amber-400 font-semibold">Step 3 of 3</span>
            <span>Profile → Role → {subStep === "GRADE" ? "Grade" : "Course"}</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div className="h-1 rounded-full bg-amber-400 transition-all"
              style={{ width: subStep === "GRADE" ? "88%" : "100%" }} />
          </div>
        </div>

        {/* ══ GRADE STEP ══ */}
        {subStep === "GRADE" && (
          <Card>
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                Select Grade{" "}
                <span className="text-slate-500 normal-case tracking-normal">(optional)</span>
              </p>
              <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                Which grade are you in?
              </h1>
              <p className="text-slate-400 text-sm mt-2">
                This helps us show you relevant content. You can skip and set this later.
              </p>
            </div>

            {loadingGrades ? (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 max-h-72 overflow-y-auto pr-1"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(240,180,41,0.3) transparent" }}>
                {grades.map((g) => {
                  const isActive = selectedGradeId === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => { setSelectedGradeId(g.id); setError(""); }}
                      className="py-3 px-3 rounded-xl text-sm font-semibold transition-all duration-150 flex flex-col items-center gap-1"
                      style={{
                        background: isActive ? "rgba(240,180,41,0.15)" : "rgba(255,255,255,0.04)",
                        border: isActive ? "1px solid rgba(240,180,41,0.6)" : "1px solid rgba(255,255,255,0.08)",
                        color: isActive ? "#F0B429" : "#94a3b8",
                        boxShadow: isActive ? "0 0 0 1px rgba(240,180,41,0.15)" : "none",
                      }}
                    >
                      <span className="text-base">{isActive ? "✓" : "📚"}</span>
                      <span className="text-xs text-center leading-tight">{g.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                ⚠ {error}
              </div>
            )}

            {/* Skip + Next row */}
            <div className="flex gap-3">
              {/* Skip — goes directly to dashboard without saving anything */}
              <button
                onClick={handleSkipAll}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                }}
              >
                Skip for now
              </button>

              {/* Next: only active when a grade is selected */}
              <button
                onClick={handleGradeNext}
                disabled={!selectedGradeId || loadingCourses}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: (!selectedGradeId || loadingCourses)
                    ? "rgba(240,180,41,0.4)"
                    : "linear-gradient(135deg,#F0B429,#f59e0b)",
                  color: "#0f172a",
                  boxShadow: (!selectedGradeId || loadingCourses) ? "none" : "0 4px 16px rgba(240,180,41,0.35)",
                  cursor: !selectedGradeId ? "not-allowed" : "pointer",
                }}
              >
                {loadingCourses
                  ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" /> Loading…</>
                  : "Next →"}
              </button>
            </div>
          </Card>
        )}

        {/* ══ COURSE STEP ══ */}
        {subStep === "COURSE" && (
          <Card>
            <div className="text-center mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-400 mb-2">
                Select Course <span className="text-slate-500 normal-case tracking-normal">(optional)</span>
              </p>
              <h1 className="text-2xl text-white" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                Any specific course?
              </h1>
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(240,180,41,0.1)", border: "1px solid rgba(240,180,41,0.2)" }}>
                <span className="text-xs text-amber-400 font-medium">📚 {selectedGrade?.name}</span>
              </div>
            </div>

            <div className="space-y-2 mb-5 max-h-72 overflow-y-auto pr-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(240,180,41,0.3) transparent" }}>
              {courses.map((c) => {
                const isActive = selectedCourseId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourseId(isActive ? null : c.id)}
                    className="w-full text-left px-4 py-3.5 rounded-xl flex items-center gap-3 transition-all duration-150"
                    style={{
                      background: isActive ? "rgba(240,180,41,0.12)" : "rgba(255,255,255,0.04)",
                      border: isActive ? "1px solid rgba(240,180,41,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="text-xl flex-shrink-0">{isActive ? "✓" : "🎯"}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{c.title_en}</p>
                      {c.category_name && (
                        <p className="text-slate-500 text-xs mt-0.5">{c.category_name}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-slate-600 text-xs text-center mb-5">
              Tap a course to select it, or skip if you don't need one.
            </p>

            {error && (
              <div className="flex items-center gap-2 text-sm mb-4 px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
                ⚠ {error}
              </div>
            )}

            <div className="flex gap-3">
              {/* Skip course */}
              <button
                onClick={() => handleSave(null)}
                disabled={saving}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                Skip for now
              </button>

              {/* Save & continue */}
              <button
                onClick={() => handleSave(selectedCourseId)}
                disabled={saving}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
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
                  ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" /> Saving…</>
                  : selectedCourseId ? "Save & Continue →" : "Finish Setup →"}
              </button>
            </div>

            <button
              onClick={() => { setSubStep("GRADE"); setError(""); }}
              className="block w-full text-center text-slate-500 text-xs mt-3 hover:text-slate-400"
            >
              ← Back to grade selection
            </button>
          </Card>
        )}
      </div>
   </div>
    </div>
  );
};

export default SetupGradeCoursePage;