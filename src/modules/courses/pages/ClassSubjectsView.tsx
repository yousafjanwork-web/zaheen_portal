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
            ) : chapters.length === 0 ? (
              // 🚀 BEAUTIFUL COMING SOON UI
              <div className="flex items-center justify-center h-[300px]">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full border border-slate-100">

                  {/* Icon */}
                  <div className="text-4xl mb-4">📚</div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-sm">
                    {isUrdu
                      ? "اس مضمون کے ابواب جلد شامل کیے جائیں گے۔"
                      : "Chapters for this subject will be available soon."}
                  </p>

                  {/* Optional subtle animation */}
                  <div className="mt-6 flex justify-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce delay-300"></span>
                  </div>

                </div>
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


// const ClassSubjectsView = () => {
//   const { classId }: any = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { isLoggedIn } = useAuth(); // ✅ REQUIRED for Sidebar

//   const gradeType = location.state?.gradeType;
//   const selectedSubjectId = location.state?.selectedSubjectId;

//   const lang = getLanguage();
//   const isUrdu = lang === "ur";

//   const {
//     classInfo,
//     subjects,
//     selectedSubject,
//     setSelectedSubject,
//     chapters,
//     loading,
//   } = useClassSubjects(Number(classId), selectedSubjectId);

//   return (
//     <section className="py-20 bg-slate-50">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* ✅ Breadcrumb */}
//         <div className="mb-6 text-sm text-slate-500 flex gap-2">
//           <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
//           <span>/</span>
//           <Link to={`/grade-view/${gradeType}`}>
//             {isUrdu ? classInfo?.urdu_name : classInfo?.name}
//           </Link>
//         </div>

//         {/* ✅ Header */}
//         {classInfo && (
//           <ClassWelcomeCard
//             isUrdu={isUrdu}
//             classInfo={classInfo}
//             subjects={subjects}
//           />
//         )}

//         {/* ✅ Layout SAME as GradesView */}

//         {/* ✅ Sidebar (ONLY when needed like GradesView) */}


//         {/* ✅ MAIN CONTENT */}
//         <div className="flex-1">

//           {/* ================= SUBJECTS ================= */}
//           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
//             {subjects.map((subject: any) => (
//               <div
//                 key={subject.id}
//                 onClick={() => setSelectedSubject(subject)}
//                 className={`bg-surface-container-low p-6 rounded-xl border border-white/50
//                     ${selectedSubject?.id === subject.id
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-[#f1efff] hover:shadow-md"
//                   }`}
//               >
//                 <div class="flex items-center justify-between mb-4">

//                   <p className="text-lg font-bold">
//                     {isUrdu ? subject.urdu_name : subject.name}
//                   </p>

//                   <p className="text-xs opacity-70">
//                     {isUrdu ? "مضمون" : "Subject"}
//                   </p>
//                 </div>

//               </div>



//             ))}
//           </div>

//           <div className="flex flex-col lg:flex-row gap-10">


//             {gradeType != "kg" && (
//               <Sidebar
//                 isLoggedIn={isLoggedIn}
//                 isUrdu={isUrdu}
//                 type={gradeType}
//                 navigate={navigate}
//               />
//             )}

//             {/* ================= CHAPTERS ================= */}
//             {loading ? (
//               <Loader />
//             ) : chapters.length === 0 ? (
//               <div className="text-center py-20 text-slate-500">
//                 {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {chapters.map((c: any, i) => (
//                   <div
//                     key={c.id}
//                     className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col"
//                   >
//                     <div className="text-3xl mb-4">📖 Chapter {i + 1}</div>

//                     <h3 className="text-lg font-bold mb-2">
//                       {isUrdu ? c.urdu_name || c.name : c.name}
//                     </h3>

//                     <p className="text-sm text-slate-500 mb-6 flex-grow">
//                       {isUrdu
//                         ? "اس باب کے اسباق دیکھیں"
//                         : "Explore lessons, videos and quizzes for this chapter."}
//                     </p>

//                     <button
//                       onClick={() =>
//                         navigate(`/chapter/${c.id}`, {
//                           state: { chapter: c },
//                         })
//                       }
//                       className="mt-auto py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
//                     >
//                       {isUrdu ? "شروع کریں" : "Start Learning"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };