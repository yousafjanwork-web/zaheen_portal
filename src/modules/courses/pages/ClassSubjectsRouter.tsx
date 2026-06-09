import { useLocation, useParams } from "react-router-dom";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import KGClassView from "./KGClassView";
import ClassSubjectsView from "./ClassSubjectsView";
import PrimarySubjectsView from "./PrimarySubjectsView";
import React from "react";

// MiddleSubjectsView — lazy import with fallback so missing file never crashes the app
const MiddleSubjectsView = React.lazy(() =>
  import("./MiddleSubjectsView").catch(() => ({
    default: () => <ClassSubjectsView />, 
  }))
);

const isKindergartenClass = (gradeType?: string, className?: string): boolean => {
  const check = (s?: string) =>
    !!s && (s.toLowerCase().includes("kg") || s.toLowerCase().includes("kindergarten") || s.toLowerCase().includes("kinder"));
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
    const m = lower.match(/(?:grade|class)[- ]?(\d+)/);
    if (m) { const n = parseInt(m[1], 10); return n >= 6 && n <= 8; }
    return false;
  };
  return test(gradeType) || test(className);
};

const ClassSubjectsRouter = () => {
  const { classId } = useParams<{ classId: string }>();
  const location = useLocation();
  const gradeType = location.state?.gradeType as string | undefined;

  const needsApiCheck = !gradeType;
  const { classInfo, loading } = useClassSubjects(needsApiCheck ? Number(classId) : 0);

  // 1. Fast path — Agar gradeType pehle se state mai majood hai
  if (gradeType) {
    if (isKindergartenClass(gradeType)) return <KGClassView />;
    if (isPrimaryClass(gradeType))      return <PrimarySubjectsView />; // Sahi primary view!
    if (isMiddleClass(gradeType)) {
      return (
        <React.Suspense fallback={<div className="h-screen bg-white" />}>
          <MiddleSubjectsView />
        </React.Suspense>
      );
    }
    return <ClassSubjectsView />;
  }

  // 2. Refresh YA View All Path — Jab hamen API response ka wait karna ho
  if (needsApiCheck && (loading || !classInfo)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // 3. API Response aane ke baad sahi Layout ka faisla:
  const className = classInfo?.name;

  if (isKindergartenClass(undefined, className)) return <KGClassView />;
  
  // 🔥 Yahan pakrenge Primary Classes ko! 
  // Agar API ne bataya ke yeh Class 1, 2, 3, 4, 5 mai se koi hai, to PrimarySubjectsView load hoga!
  if (isPrimaryClass(undefined, className)) return <PrimarySubjectsView />;
  
  if (isMiddleClass(undefined, className)) {
    return (
      <React.Suspense fallback={<div className="h-screen bg-white" />}>
        <MiddleSubjectsView />
      </React.Suspense>
    );
  }

  // Fallback default (Sirf tab chalega jab saari conditions check ho chuki hon)
  return <ClassSubjectsView />;
};

export default ClassSubjectsRouter;