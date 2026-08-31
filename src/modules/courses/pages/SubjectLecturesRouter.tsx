import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import { classIdFromSlug } from "@/config/classSlugs";
import SubjectLecturesView from "./SubjectLecturesView";
import PrimarySubjectDetailView from "./PrimarySubjectDetailView";
import MiddleSubjectDetailView from "./MiddleSubjectDetailView";

const KGLectureView = React.lazy(() =>
  import("./KGLectureView").catch(() => ({
    default: () => (
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-black text-blue-800 mb-2">KGLectureView</h2>
          <p className="text-slate-500">Create KGLectureView.tsx in the same folder.</p>
        </div>
      </div>
    ),
  }))
);

/* ─── Neutral full-screen skeleton shown while we determine which view to render ─── */
const RouterSkeleton = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}
  >
    {/* Fake hero bar */}
    <div
      style={{
        background: "linear-gradient(120deg,#0F172A 0%,#1E3A5F 55%,#134E4A 100%)",
        height: 160,
        width: "100%",
        flexShrink: 0,
      }}
    />
    {/* Fake content area */}
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        width: "100%",
        padding: "32px 24px",
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: 22,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 14,
              height: 96,
              border: "1px solid #E5E9F0",
              animation: "routerPulse 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 14,
              height: 140,
              border: "1px solid #E5E9F0",
              animation: "routerPulse 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
    <style>{`
      @keyframes routerPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
      @media(max-width:768px) {
        /* collapse to single column on mobile */
      }
    `}</style>
  </div>
);

/* ── helpers ── */
const isKindergartenClass = (gradeType?: string, className?: string): boolean => {
  const check = (s?: string) =>
    !!s && (
      s.toLowerCase().includes("kg") ||
      s.toLowerCase().includes("kindergarten") ||
      s.toLowerCase().includes("kinder")
    );
  return check(gradeType) || check(className);
};

const isPrimaryClass = (gradeType?: string, className?: string): boolean => {
  const test = (s?: string) => {
    if (!s) return false;
    const lower = s.toLowerCase();
    if (lower === "1-5" || lower === "primary") return true;
    const m = lower.match(/(?:grade|class)[- ]?(\d+)/);
    if (m) { const n = parseInt(m[1], 10); return n >= 1 && n <= 5; }
    return false;
  };
  return test(gradeType) || test(className);
};

const isMiddleClass = (gradeType?: string, className?: string): boolean => {
  const test = (s?: string) => {
    if (!s) return false;
    const lower = s.toLowerCase();
    if (lower === "6-8" || lower === "middle") return true;
    const m = lower.match(/(?:grade|class|جماعت)[- ]?(\d+)/);
    if (m) { const n = parseInt(m[1], 10); return n >= 6 && n <= 8; }
    return false;
  };
  return test(gradeType) || test(className);
};

/* ─── resolve which component to show from a string ─── */
type RouteTarget = "kg" | "primary" | "middle" | "legacy" | null;

const resolveTarget = (gradeType?: string, className?: string): RouteTarget => {
  if (isKindergartenClass(gradeType, className)) return "kg";
  if (isPrimaryClass(gradeType, className))      return "primary";
  if (isMiddleClass(gradeType, className))        return "middle";
  // Only return "legacy" when we actually have a string to evaluate
  if (gradeType || className)                     return "legacy";
  return null; // unknown — need more info
};
const SubjectLecturesRouter = () => {
  const { classSlug } = useParams<{ classSlug: string }>();
  const classId = classIdFromSlug(classSlug ?? "");

  // SPECIFIC CHANGE 1: Purani fastTarget aur skipFetch wali saari lines hata kar sirf yeh call rakhein
  const { classInfo, loading } = useClassSubjects(classId ?? 0);

  // SPECIFIC CHANGE 2: Jab tak loading chal rahi hai YA classInfo ka data sahi se nahi aaya, skeleton dikha kar block rakhein
  if (loading || !classInfo || !classInfo.name) {
    return <RouterSkeleton />;
  }

  // SPECIFIC CHANGE 3: Ab data pakka aa chuka hai, ab direct check chalayein
  const target = resolveTarget(undefined, classInfo.name);

  if (target === "kg") {
    return (
      <React.Suspense fallback={<RouterSkeleton />}>
        <KGLectureView />
      </React.Suspense>
    );
  }
  if (target === "primary") return <PrimarySubjectDetailView />;
  if (target === "middle")  return <MiddleSubjectDetailView />;

  /* Genuine fallback — Agar upar koi match na ho */
  return <SubjectLecturesView />;
};

export default SubjectLecturesRouter;