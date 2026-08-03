import { useParams } from "react-router-dom";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import { classIdFromSlug } from "@/config/classSlugs";
import PrimaryQuizFlow from "@/modules/assessments/pages/PrimaryQuizFlow";
import SecondaryQuizFlow from "@/modules/assessments/pages/SecondaryQuizFlow";

const isKGorPrimary = (name?: string): boolean => {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (lower.includes("kg") || lower.includes("kindergarten")) return true;
  const m = lower.match(/(?:grade|class)[- ]?(\d+)/);
  if (m) return parseInt(m[1], 10) <= 5;
  return false;
};

const QuizRouter = () => {
  const { classSlug } = useParams<{ classSlug: string }>();
  const classId = classIdFromSlug(classSlug ?? "");
  const { classInfo, loading } = useClassSubjects(classId ?? 0);

  if (loading || !classInfo?.name) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isKGorPrimary(classInfo.name)) {
    return <PrimaryQuizFlow />;
  }

  return <SecondaryQuizFlow />;
};

export default QuizRouter;