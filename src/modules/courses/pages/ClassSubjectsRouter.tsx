import { useLocation, useParams } from "react-router-dom";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import KGClassView from "./KGClassView";
import ClassSubjectsView from "./ClassSubjectsView";

const ClassSubjectsRouter = () => {
  const { classId } = useParams();
  const location    = useLocation();
  const gradeType   = location.state?.gradeType as string | undefined;

  const { classInfo, loading } = useClassSubjects(Number(classId));

  // Check gradeType from navigation state OR class name from API
  // Covers: "KG", "kg", "Kindergarten", "kindergarten", "KG 1", "KG 2" etc.
  const isKG =
    gradeType?.toLowerCase().includes("kg") ||
    gradeType?.toLowerCase().includes("kindergarten") ||
    classInfo?.name?.toLowerCase().includes("kg") ||
    classInfo?.name?.toLowerCase().includes("kindergarten");

  // Show nothing while API loads to avoid flashing the wrong view
  if (loading && !gradeType) return null;

  if (isKG) return <KGClassView />;
  return <ClassSubjectsView />;
};

export default ClassSubjectsRouter;