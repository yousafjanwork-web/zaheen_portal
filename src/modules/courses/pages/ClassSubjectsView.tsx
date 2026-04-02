import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import SubjectsSidebar from "@/modules/shared//components/SubjectsSidebar";
import ChapterCard from "@/modules/shared/components/ChapterCard";
import Loader from "@/modules/shared/components/Loader";
import GradeCardSkeleton from "@/modules/shared/components/GradeView/GradeCardSkeleton";
import ClassWelcomeCard from "@/modules/shared/components/ClassWelcomeCard";

const ClassSubjectsView = () => {
  const { classId }: any = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const gradeType = location.state?.gradeType;
  const selectedSubjectId = location.state?.selectedSubjectId;

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  const {
    classInfo,
    subjects,
    selectedSubject,
    setSelectedSubject,
    chapters,
    chapterVideos,
    loading,
  } = useClassSubjects(Number(classId), selectedSubjectId);

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm flex gap-2">
          <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
          <span>/</span>
          <Link to={`/grade-view/${gradeType}`}>
            {isUrdu ? classInfo?.urdu_name : classInfo?.name}
          </Link>
        </div>

        {/* Welcome */}
        <ClassWelcomeCard
          isUrdu={isUrdu}
          classInfo={classInfo}
          subjects={subjects}
        />

<div className="flex flex-col lg:flex-row gap-8">
            <SubjectsSidebar
            subjects={subjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            isUrdu={isUrdu}
          />

          <div className="flex-1">
            {loading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <GradeCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chapters.map((c, i) => (
                  <ChapterCard
                    key={c.id}
                    chapter={c}
                    index={i}
                    videos={chapterVideos[c.id]}
                    navigate={navigate}
                    classInfo={classInfo}
                    isUrdu={isUrdu}
                    gradeType={gradeType}
                    classId={classId}
                    selectedSubject={selectedSubject}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassSubjectsView;