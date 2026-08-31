/**
 * DashboardPage.tsx  — Sidebar layout redesign
 *
 * Smart dashboard that renders the right section(s) based on user role:
 *   role = learner  → LearnerSection only
 *   role = parent   → ParentSection only
 *   role = both     → LearnerSection + ParentSection
 *   is_kid = true   → LearnerSection (read-only, no grade change)
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  getDashboard,
  getChildren,
  getChildDashboard,
  removeChild,
  DashboardData,
  Child,
  ChildDashboardData,
} from "@/modules/shared/services/lmsService";

// ─── Design tokens ────────────────────────────────────────────────────────────

const amber   = "#F0B429";
const amberDim = "rgba(240,180,41,0.12)";
const amberBdr = "rgba(240,180,41,0.28)";
const blue    = "#3B82F6";
const blueDim  = "rgba(59,130,246,0.12)";
const blueBdr  = "rgba(59,130,246,0.28)";
const surface  = "rgba(15,23,42,0.92)";
const surfaceEl = "rgba(255,255,255,0.04)";
const surfaceBdr = "rgba(255,255,255,0.07)";

const gradeSlugMap: Record<number, string> = {
  1: "kg",
  2: "grade-1", 3: "grade-2", 4: "grade-3", 5: "grade-4", 6: "grade-5",
  7: "grade-6", 8: "grade-7", 9: "grade-8",
  10: "grade-9", 11: "grade-10", 12: "grade-11", 13: "grade-12",
};

const courseClassMap: Record<number, number> = {
  1: 305, 2: 300, 3: 301, 4: 302, 5: 303, 6: 304,
};

// ─── Reusable primitives ──────────────────────────────────────────────────────

const ProgressBar: React.FC<{ pct: number; color?: string }> = ({ pct, color = amber }) => (
  <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
    <div
      className="h-1.5 rounded-full transition-all duration-700"
      style={{ width: `${Math.min(pct, 100)}%`, background: color }}
    />
  </div>
);

const StatCard: React.FC<{ label: string; value: string | number; color?: string; icon: string }> = ({
  label, value, color = amber, icon,
}) => (
  <div
    className="rounded-2xl p-4 flex items-center gap-3"
    style={{ background: surfaceEl, border: `1px solid ${surfaceBdr}` }}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ background: color === amber ? amberDim : blueDim }}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold mt-0.5" style={{ color }}>{value}</p>
    </div>
  </div>
);

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">{children}</p>
);

// ─── Sidebar navigation items ─────────────────────────────────────────────────

type NavItem = {
  id: string;
  label: string;
  icon: string;
  roles: ("learner" | "parent" | "both" | "kid")[];
};

const NAV_ITEMS: NavItem[] = [
  { id: "overview",     label: "Overview",      icon: "⚡", roles: ["learner", "both", "kid"] },
  { id: "progress",     label: "Progress",      icon: "📈", roles: ["learner", "both", "kid"] },
  { id: "courses",      label: "Courses",       icon: "📚", roles: ["learner", "both", "kid"] },
  { id: "children",     label: "My Children",   icon: "👧", roles: ["parent", "both"] },
  { id: "addchild",     label: "Add Child",     icon: "➕", roles: ["parent", "both"] },
  { id: "profile",      label: "Profile",       icon: "👤", roles: ["learner", "parent", "both", "kid"] },
  { id: "setup-role",   label: "Change Role",   icon: "🎭", roles: ["learner", "parent", "both"] },
  { id: "setup-grade",  label: "Change Grade",  icon: "🎓", roles: ["learner", "both"] },
  { id: "setup-course", label: "Change Course", icon: "🎯", roles: ["learner", "both"] },
];
// ─── Learner: Overview panel ──────────────────────────────────────────────────

const LearnerOverview: React.FC<{ data: DashboardData; isKid: boolean }> = ({ data, isKid }) => {
  const navigate = useNavigate();
  const { grade, course, video_summary: vs, quiz_summary: qs } = data;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
        <div className="h-0.5 w-16 mb-5 rounded-full" style={{ background: `linear-gradient(90deg,${amber},${blue})` }} />
        <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-1" style={{ color: blue }}>
          {isKid ? "Learning Dashboard" : "Learner Dashboard"}
        </p>
        <h2 className="text-2xl text-white font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
          Welcome back, {data.user.name?.split(" ")[0] || "Learner"} 👋
        </h2>

        <div className="flex flex-wrap gap-2 mt-4">
          {grade && (
            <button
              onClick={() => navigate(`/${gradeSlugMap[grade.id] ?? "kg"}`)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all hover:opacity-80"
              style={{ background: amberDim, border: `1px solid ${amberBdr}`, color: amber }}
            >
              📚 {grade.name} →
            </button>
          )}
          {course && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: blueDim, border: `1px solid ${blueBdr}`, color: blue }}
            >
              🎯 {course.title_en}
            </span>
          )}
          {!grade && (
            <span className="px-3 py-1 rounded-full text-xs" style={{ background: surfaceEl, color: "#64748b" }}>
              No grade selected
            </span>
          )}
        </div>

        {!isKid && (
          <button
            onClick={() => navigate("/setup/grade-course")}
            className="mt-4 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: amberDim, border: `1px solid ${amberBdr}`, color: amber }}
          >
            ✏ Change Grade / Course
          </button>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Videos"    value={vs.total_videos}         icon="🎬" color={amber} />
        <StatCard label="Completed"       value={vs.completed_videos}      icon="✅" color={blue} />
        <StatCard label="Avg Watch"       value={`${parseFloat(String(vs.avg_percentage ?? 0)).toFixed(0)}%`} icon="👁" color={amber} />
        <StatCard label="Skills Mastered" value={qs.mastered_skills}       icon="🏆" color={blue} />
      </div>
    </div>
  );
};

// ─── Learner: Progress panel ───────────────────────────────────────────────────

const LearnerProgress: React.FC<{ data: DashboardData }> = ({ data }) => {
  const { video_summary: vs, quiz_summary: qs, recent_videos: rv } = data;
  const videoPct = vs.total_videos > 0 ? (vs.completed_videos / vs.total_videos) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6 space-y-5" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
        <div className="h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(90deg,${amber},${blue})` }} />
        <SectionHeading>Video Progress</SectionHeading>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-semibold">{videoPct.toFixed(0)}% complete</span>
          <span className="text-slate-500 text-xs">{vs.completed_videos}/{vs.total_videos} videos</span>
        </div>
        <ProgressBar pct={videoPct} color={amber} />

        <SectionHeading>Quiz Mastery</SectionHeading>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-semibold">
            {parseFloat(String(qs.avg_mastery ?? 0)).toFixed(0)}% avg mastery
          </span>
          <span className="text-slate-500 text-xs">{qs.mastered_skills}/{qs.total_skills} skills</span>
        </div>
        <ProgressBar pct={parseFloat(String(qs.avg_mastery ?? 0))} color={blue} />
      </div>

      {rv && rv.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
          <SectionHeading>Recently Watched</SectionHeading>
          <div className="space-y-4">
            {rv.map((v) => (
              <div key={v.video_id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: v.completed ? blueDim : amberDim }}
                >
                  {v.completed ? "✓" : "▶"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate mb-1.5">{v.title_en}</p>
                  <ProgressBar pct={parseFloat(String(v.percentage_watched))} color={v.completed ? blue : amber} />
                </div>
                <span className="text-slate-500 text-xs flex-shrink-0">
                  {parseFloat(String(v.percentage_watched ?? 0)).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Learner: Courses panel ────────────────────────────────────────────────────

const LearnerCourses: React.FC<{ data: DashboardData }> = ({ data }) => {
  const navigate = useNavigate();
  const { grade, course } = data;

  return (
    <div className="rounded-2xl p-6 space-y-4" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
      <div className="h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(90deg,${amber},${blue})` }} />
      <SectionHeading>Your Content</SectionHeading>

      {grade ? (
        <button
          onClick={() => navigate(`/${gradeSlugMap[grade.id] ?? "kg"}`)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:opacity-80"
          style={{ background: amberDim, border: `1px solid ${amberBdr}` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{grade.name} — Subjects</p>
              <p className="text-slate-400 text-xs mt-0.5">Browse all subjects and chapters</p>
            </div>
          </div>
          <span style={{ color: amber }}>→</span>
        </button>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm mb-3">No grade selected yet.</p>
          <button
            onClick={() => navigate("/setup/grade-course")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: `linear-gradient(135deg,${amber},#f59e0b)`, color: "#0f172a" }}
          >
            Pick your grade →
          </button>
        </div>
      )}

      {course && (
        <button
          onClick={() => navigate(`/skills/${courseClassMap[course.id] ?? ""}`)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all hover:opacity-80"
          style={{ background: blueDim, border: `1px solid ${blueBdr}` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">{course.title_en}</p>
              <p className="text-slate-400 text-xs mt-0.5">Continue your course</p>
            </div>
          </div>
          <span style={{ color: blue }}>→</span>
        </button>
      )}
    </div>
  );
};

// ─── Learner Section (panel router) ───────────────────────────────────────────

const LearnerSection: React.FC<{ userId: number; isKid: boolean; panel: string }> = ({ userId, isKid, panel }) => {
  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    setData(null);
    setLoading(true);
    setError("");
    getDashboard(userId)
      .then(setData)
      .catch(() => setError("Could not load dashboard. Please refresh."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 rounded-2xl bg-white/10" />
        <div className="grid grid-cols-2 gap-3">
          {[0,1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-white/10" />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-3 rounded-xl text-sm"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
        ⚠ {error || "No dashboard data available."}
      </div>
    );
  }

  if (panel === "progress") return <LearnerProgress data={data} />;
  if (panel === "courses")  return <LearnerCourses data={data} />;
  return <LearnerOverview data={data} isKid={isKid} />;
};

// ─── Parent: Child detail view ────────────────────────────────────────────────

const ChildDetail: React.FC<{ data: ChildDashboardData; name: string; onBack: () => void }> = ({ data, name, onBack }) => {
  const { grade, course, video_summary: vs, quiz_summary: qs } = data;
  const videoPct = vs.total_videos > 0 ? (vs.completed_videos / vs.total_videos) * 100 : 0;

  return (
    <div className="rounded-2xl p-6 space-y-5" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
      <div className="h-0.5 w-16 rounded-full" style={{ background: `linear-gradient(90deg,${amber},${blue})` }} />
      <button onClick={onBack} className="text-slate-500 text-xs hover:text-slate-300 flex items-center gap-1 transition-colors">
        ← Back to children
      </button>
      <h3 className="text-xl text-white font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>
        {name}'s Progress
      </h3>
      <div className="flex gap-2 flex-wrap">
        {grade && (
          <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: amberDim, color: amber }}>📚 {grade.name}</span>
        )}
        {course && (
          <span className="px-2.5 py-1 rounded-full text-xs" style={{ background: blueDim, color: blue }}>🎯 {course.title_en}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Videos" value={vs.total_videos}    icon="🎬" color={amber} />
        <StatCard label="Completed"    value={vs.completed_videos} icon="✅" color={blue} />
      </div>
      <SectionHeading>Video Progress</SectionHeading>
      <ProgressBar pct={videoPct} color={amber} />
      <SectionHeading>Quiz Mastery</SectionHeading>
      <ProgressBar pct={qs.avg_mastery ?? 0} color={blue} />
    </div>
  );
};

// ─── Parent Section ───────────────────────────────────────────────────────────

const ParentSection: React.FC<{ userId: number; panel: string; forceRefresh?: boolean }> = ({ userId, panel, forceRefresh = false }) => {
  const navigate = useNavigate();
  const [children,     setChildren]     = useState<Child[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [viewingChild, setViewingChild] = useState<ChildDashboardData | null>(null);
  const [viewingName,  setViewingName]  = useState("");
  const [loadingChild, setLoadingChild] = useState(false);
  const [removingId,   setRemovingId]   = useState<number | null>(null);

  const loadChildren = () => {
    setLoading(true);
    getChildren(userId)
      .then(setChildren)
      .catch(() => setError("Could not load children."))
      .finally(() => setLoading(false));
  };

useEffect(() => { loadChildren(); }, [userId, forceRefresh]);

  // If panel is "addchild", redirect immediately
  useEffect(() => {
    if (panel === "addchild") navigate("/setup/add-child");
  }, [panel]);

  const handleViewChild = async (child: Child) => {
    setLoadingChild(true);
    try {
      const data = await getChildDashboard(child.id);
      setViewingChild(data);
      setViewingName(child.name);
    } catch {
      setError("Could not load child's dashboard.");
    } finally {
      setLoadingChild(false);
    }
  };

  const handleRemoveChild = async (childId: number, childName: string) => {
    if (!window.confirm(`Remove ${childName} from your account? This cannot be undone.`)) return;
    setRemovingId(childId);
    try {
      await removeChild(childId, userId);
      loadChildren();
    } catch {
      setError("Could not remove child. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  if (viewingChild) {
    return <ChildDetail data={viewingChild} name={viewingName} onBack={() => setViewingChild(null)} />;
  }

  return (
    <div className="rounded-2xl p-6" style={{ background: surface, border: `1px solid ${surfaceBdr}` }}>
      <div className="h-0.5 w-16 rounded-full mb-5" style={{ background: `linear-gradient(90deg,${amber},${blue})` }} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold mb-1" style={{ color: blue }}>Parent Dashboard</p>
          <h2 className="text-2xl text-white font-semibold" style={{ fontFamily: "'Fraunces', serif" }}>My Children</h2>
        </div>
        <button
          onClick={() => navigate("/setup/add-child")}
          className="text-xs px-4 py-2 rounded-xl font-semibold transition-all"
          style={{ background: `linear-gradient(135deg,${amber},#f59e0b)`, color: "#0f172a", boxShadow: "0 4px 14px rgba(240,180,41,0.3)" }}
        >
          + Add Child
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm mb-4"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
          ⚠ {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0,1].map(i => <div key={i} className="h-20 rounded-xl bg-white/10 animate-pulse" />)}
        </div>
      ) : children.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">👨‍👧</p>
          <p className="text-slate-400 text-sm mb-4">No children added yet.</p>
          <button
            onClick={() => navigate("/setup/add-child")}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: `linear-gradient(135deg,${amber},#f59e0b)`, color: "#0f172a", boxShadow: "0 4px 16px rgba(240,180,41,0.35)" }}
          >
            Add Your First Child →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {children.map((child) => (
            <div
              key={child.id}
              className="rounded-2xl px-4 py-4 flex items-center gap-4"
              style={{ background: surfaceEl, border: `1px solid ${surfaceBdr}` }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${amber},#f59e0b)`, color: "#0f172a" }}
              >
                {child.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{child.name}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: amberDim, color: amber }}>
                    {child.class_name}
                  </span>
                  {child.course_name && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: blueDim, color: blue }}>
                      {child.course_name}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleViewChild(child)}
                  disabled={loadingChild}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: blueDim, border: `1px solid ${blueBdr}`, color: blue }}
                >
                  {loadingChild ? "…" : "View"}
                </button>
                <button
                  onClick={() => handleRemoveChild(child.id, child.name)}
                  disabled={removingId === child.id}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                >
                  {removingId === child.id ? "…" : "Remove"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC<{
  role: string;
  isKid: boolean;
  activePanel: string;
  onNavigate: (id: string) => void;
  onLogout: () => void;
}> = ({ role, isKid, activePanel, onNavigate, onLogout }) => {
  const visibleItems = NAV_ITEMS.filter(item => {
    if (isKid)                         return item.roles.includes("kid");
    if (role === "both")               return item.roles.includes("both") || item.roles.includes("learner") || item.roles.includes("parent");
    return item.roles.includes(role as any);
  });

  return (
    <aside
      className="flex flex-col"
      style={{
        width: 220,
        minHeight: "100vh",
        background: "rgba(10,18,36,0.97)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg,${amber},#f59e0b)` }}
          >
            <span className="text-slate-900 font-bold text-base">Z</span>
          </div>
          <span className="text-white font-semibold text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
            Zaheen
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-600 px-3 mb-2 mt-1">Menu</p>
        {visibleItems.filter(item => !["setup-role","setup-grade","setup-course"].includes(item.id)).map(item => {
          const active = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: active ? (item.id === "addchild" ? amberDim : blueDim) : "transparent",
                color: active ? (item.id === "addchild" ? amber : blue) : "#64748b",
                border: active ? `1px solid ${item.id === "addchild" ? amberBdr : blueBdr}` : "1px solid transparent",
              }}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          );
        })}
     </nav>

      {/* Setup section */}
      {visibleItems.some(item => ["setup-role","setup-grade","setup-course"].includes(item.id)) && (
        <div className="px-3 mt-2 mb-2">
          <div className="h-px mx-2 mb-3" style={{ background: "rgba(255,255,255,0.06)" }} />
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600 px-3 mb-2">Setup</p>
          {visibleItems.filter(item => ["setup-role","setup-grade","setup-course"].includes(item.id)).map(item => {
            const active = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{
                  background: active ? amberDim : "transparent",
                  color: active ? amber : "#64748b",
                  border: active ? `1px solid ${amberBdr}` : "1px solid transparent",
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom */}
      <div className="px-3 pb-6 mt-4 space-y-1">
        <div className="h-px mx-2 mb-3" style={{ background: "rgba(255,255,255,0.06)" }} />
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
          style={{ color: "#f87171" }}
        >
          <span className="text-base">🚪</span>
          Log out
        </button>
      </div>
    </aside>
  );
};

// ─── Mobile tab bar (small screens) ──────────────────────────────────────────

const MobileTabBar: React.FC<{
  role: string;
  isKid: boolean;
  activePanel: string;
  onNavigate: (id: string) => void;
}> = ({ role, isKid, activePanel, onNavigate }) => {
 const visibleItems = NAV_ITEMS.filter(item => {
    if (["setup-role","setup-grade","setup-course"].includes(item.id)) return false;
    if (isKid)           return item.roles.includes("kid");
    if (role === "both") return item.roles.includes("both") || item.roles.includes("learner") || item.roles.includes("parent");
    return item.roles.includes(role as any);
  });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 md:hidden"
      style={{
        background: "rgba(10,18,36,0.97)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        zIndex: 50,
      }}
    >
      {visibleItems.map(item => {
        const active = activePanel === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
            style={{
              color: active ? (item.id === "addchild" ? amber : blue) : "#475569",
              background: active ? (item.id === "addchild" ? amberDim : blueDim) : "transparent",
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─── Main DashboardPage ────────────────────────────────────────────────────────

const DashboardPage: React.FC = () => {
  const { userId, isKid, role, isLoggedIn, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cameFromAddChild = location.state?.refreshChildren === true;

  const [activePanel, setActivePanel] = useState<string>(() => {
    // If coming from add-child, land on children panel
    if (cameFromAddChild) return "children";
    if (role === "parent") return "children";
    return "overview";
  });
  const [childrenRefreshKey, setChildrenRefreshKey] = useState(0);

  // If coming back from add-child page, switch to children panel and trigger refresh
  useEffect(() => {
    if (location.state?.refreshChildren) {
      setActivePanel("children");
      setChildrenRefreshKey((k) => k + 1);
      // Clear the state so refresh doesn't re-trigger on panel switches
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);
  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate("/login");
  }, [isLoading, isLoggedIn]);

  if (isLoading || !userId) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div
          className="w-9 h-9 rounded-full border-2 animate-spin"
          style={{ borderColor: "rgba(240,180,41,0.2)", borderTopColor: amber }}
        />
      </div>
    );
  }

  const showLearner = isKid || role === "learner" || role === "both";
  const showParent  = !isKid && (role === "parent" || role === "both");

const handleNavigate = (panelId: string) => {
    if (panelId === "profile")      { navigate("/profile");             return; }
    if (panelId === "setup-role")   { navigate("/setup/role");          return; }
    if (panelId === "setup-grade")  { navigate("/setup/grade-course");  return; }
    if (panelId === "setup-course") { navigate("/setup/grade-course");  return; }
    setActivePanel(panelId);
  };
  const renderContent = () => {
    // Learner panels
    if (["overview", "progress", "courses"].includes(activePanel) && showLearner) {
      return <LearnerSection userId={userId} isKid={isKid} panel={activePanel} />;
    }

 // Parent panels
    if (["children", "addchild"].includes(activePanel) && showParent) {
      return <ParentSection userId={userId} panel={activePanel} forceRefresh={cameFromAddChild} />;
    }
    // Fallback
    if (showLearner) return <LearnerSection userId={userId} isKid={isKid} panel="overview" />;
    if (showParent)  return <ParentSection userId={userId} panel="children" forceRefresh={cameFromAddChild} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex">

      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar
          role={role ?? "learner"}
          isKid={isKid}
          activePanel={activePanel}
          onNavigate={handleNavigate}
          onLogout={logout}
        />
      </div>

      {/* Main content */}
     <main className="flex-1 px-8 py-8 pb-24 md:pb-8 overflow-y-auto" style={{ maxWidth: 1000 }}>
        {/* Mobile topbar */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${amber},#f59e0b)` }}
            >
              <span className="text-slate-900 font-bold text-sm">Z</span>
            </div>
            <span className="text-white font-semibold text-lg" style={{ fontFamily: "'Fraunces', serif" }}>
              Zaheen
            </span>
          </div>
          <button
            onClick={logout}
            className="text-xs px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            Log out
          </button>
        </div>

        {/* Panel content */}
        {renderContent()}
      </main>

      {/* Mobile bottom nav */}
      <MobileTabBar
        role={role ?? "learner"}
        isKid={isKid}
        activePanel={activePanel}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default DashboardPage;