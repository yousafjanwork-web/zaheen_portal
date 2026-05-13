import JuniorSubjectsView from "./JuniorSubjectView";
import SeniorSubjectsView from "./SeniorSubjectView";
import { useParams } from "react-router-dom";

const ClassSubjectsView = () => {
  const { classId }: any = useParams();

  const classNumber = Number(classId);

  // KG → 8
  const isJuniorGrade = classNumber <= 9;

  // 9 → 12
  const isSeniorGrade = classNumber >= 10;

  if (isJuniorGrade) {
    return <JuniorSubjectsView />;
  }

  if (isSeniorGrade) {
    return <SeniorSubjectsView />;
  }

  return null;
};

export default ClassSubjectsView;