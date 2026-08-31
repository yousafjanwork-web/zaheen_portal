import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import { classIdFromSlug, classSlugFromId } from "@/config/classSlugs";
import { useAuth } from "@/modules/shared/context/AuthContext";
import KGClassView from "./KGClassView";
import ClassSubjectsView from "./ClassSubjectsView";
import PrimarySubjectsView from "./PrimarySubjectsView";

const MiddleSubjectsView = React.lazy(() =>
  import("./MiddleSubjectsView").catch(() => ({
    default: () => <ClassSubjectsView />,
  }))
);

const isKindergartenClass = (name?: string) =>
  !!name && /kg|kindergarten|kinder/i.test(name);

const isPrimaryClass = (name?: string) => {
  if (!name) return false;
  if (/^(1-5|primary)$/i.test(name)) return true;
  const m = name.match(/(?:grade|class)[- ]?(\d+)/i);
  return m ? parseInt(m[1]) >= 1 && parseInt(m[1]) <= 5 : false;
};

const isMiddleClass = (name?: string) => {
  if (!name) return false;
  if (/^(6-8|middle)$/i.test(name)) return true;
  const m = name.match(/(?:grade|class|جماعت)[- ]?(\d+)/i);
  return m ? parseInt(m[1]) >= 6 && parseInt(m[1]) <= 8 : false;
};

const ClassSubjectsRouter = () => {
  const { classSlug } = useParams<{ classSlug: string }>();
  const location = useLocation();
  const { isLoggedIn, selectedClassId, isKid, role } = useAuth();

  const requestedClassId = classIdFromSlug(classSlug ?? "");



  const gradeType = location.state?.gradeType as string | undefined;
  const needsApiCheck = !gradeType;
  const { classInfo, loading } = useClassSubjects(needsApiCheck ? (requestedClassId ?? 0) : 0);

  if (gradeType) {
    if (isKindergartenClass(gradeType)) return <KGClassView />;
    if (isPrimaryClass(gradeType))      return <PrimarySubjectsView />;
    if (isMiddleClass(gradeType)) {
      return (
        <React.Suspense fallback={<div className="h-screen bg-white" />}>
          <MiddleSubjectsView />
        </React.Suspense>
      );
    }
    return <ClassSubjectsView />;
  }

  if (needsApiCheck && (loading || !classInfo)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const className = classInfo?.name;
  if (isKindergartenClass(className)) return <KGClassView />;
  if (isPrimaryClass(className))      return <PrimarySubjectsView />;
  if (isMiddleClass(className)) {
    return (
      <React.Suspense fallback={<div className="h-screen bg-white" />}>
        <MiddleSubjectsView />
      </React.Suspense>
    );
  }
  return <ClassSubjectsView />;
};

export default ClassSubjectsRouter;