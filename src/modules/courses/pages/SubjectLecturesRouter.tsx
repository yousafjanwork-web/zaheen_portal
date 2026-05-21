/**
 * SubjectLecturesRouter.tsx
 *
 * Sits at: /class/:classId/subject/:subjectId
 *
 * Checks if the class is Kindergarten → renders KGLectureView
 * Otherwise → renders SubjectLecturesView (the standard Grade 9/10/etc. view)
 *
 * Detection uses (in priority order):
 *   1. gradeType from router state (fastest, no API needed)
 *   2. classInfo.name from useClassSubjects hook (API fallback)
 */

import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import SubjectLecturesView from "./SubjectLecturesView";

// ✅ Import your KG lecture page here once you create it
// import KGLectureView from "./KGLectureView";

// Temporary placeholder — replace with your real KGLectureView import above
// and remove this block once the file exists
const KGLectureView = React.lazy(() =>
  import("./KGLectureView").catch(() => ({
    default: () => (
      <div className="min-h-screen bg-[#EFF6FF] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-black text-blue-800 mb-2">KGLectureView</h2>
          <p className="text-slate-500">
            Create <code className="bg-slate-100 px-2 py-0.5 rounded">KGLectureView.tsx</code> in the same folder.
          </p>
        </div>
      </div>
    ),
  }))
);

/* ─── Helper ─── */
const isKindergartenClass = (
  gradeType?: string,
  className?: string
): boolean => {
  const check = (s?: string) =>
    !!s &&
    (s.toLowerCase().includes("kg") ||
      s.toLowerCase().includes("kindergarten") ||
      s.toLowerCase().includes("kinder"));

  return check(gradeType) || check(className);
};

/* ─── Router ─── */
const SubjectLecturesRouter = () => {
  const { classId } = useParams<{ classId: string }>();
  const location    = useLocation();

  const gradeType = location.state?.gradeType as string | undefined;

  // Only fetch if we can't determine from gradeType alone
  const needsApiCheck = !gradeType;
  const { classInfo, loading } = useClassSubjects(
    needsApiCheck ? Number(classId) : 0
  );

  // If we already know from gradeType, decide immediately
  if (gradeType) {
    if (isKindergartenClass(gradeType)) {
      return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#EFF6FF]" />}>
          <KGLectureView />
        </React.Suspense>
      );
    }
    return <SubjectLecturesView />;
  }

  // Wait for API to determine class type
  if (loading) return null;

  if (isKindergartenClass(undefined, classInfo?.name)) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-[#EFF6FF]" />}>
        <KGLectureView />
      </React.Suspense>
    );
  }

  return <SubjectLecturesView />;
};

export default SubjectLecturesRouter;