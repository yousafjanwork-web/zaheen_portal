import React, { useState } from "react";
import physicsSection from "../../../assets/images/physics.png"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Atom,
  Leaf,
  Languages,
  Sigma,
  Landmark,
  Globe,
  Calculator,
  Cpu,
  Download,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";

const getMeta = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("physic"))
    return {
      icon: Atom,
      description: "Explore the fundamental principles governing the physical world.",
      stat3Label: "PAST PAPERS",
      iconColor: "text-blue-700",
      iconBg: "bg-blue-50",
      isPhysics: true,
    };
  if (n.includes("math"))
    return {
      icon: Sigma,
      description: "Algebra, geometry, trigonometry, and problem solving.",
      stat3Label: "PAST PAPERS",
      iconColor: "text-violet-700",
      iconBg: "bg-violet-50",
      isPhysics: false,
    };
  if (n.includes("chem"))
    return {
      icon: FlaskConical,
      description: "Chemical reactions, atomic structure, and laboratory.",
      stat3Label: "LABS",
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-50",
      isPhysics: false,
    };
  if (n.includes("bio"))
    return {
      icon: Leaf,
      description: "Cellular processes, genetics, and study of living organisms.",
      stat3Label: "PAST PAPERS",
      iconColor: "text-green-700",
      iconBg: "bg-green-50",
      isPhysics: false,
    };
  if (n.includes("english"))
    return {
      icon: BookOpen,
      description: "Literature analysis, advanced grammar, and composition.",
      stat3Label: "ESSAYS",
      iconColor: "text-sky-700",
      iconBg: "bg-sky-50",
      isPhysics: false,
    };
  if (n.includes("urdu"))
    return {
      icon: Languages,
      description: "Classical literature, poetry, and advanced linguistics.",
      stat3Label: "PAST PAPERS",
      iconColor: "text-rose-700",
      iconBg: "bg-rose-50",
      isPhysics: false,
    };
  if (n.includes("islamic"))
    return {
      icon: Landmark,
      description: "Quranic studies, Hadith, Islamic history and ethics.",
      stat3Label: "PAST PAPERS",
      iconColor: "text-teal-700",
      iconBg: "bg-teal-50",
      isPhysics: false,
    };
  if (n.includes("pakistan"))
    return {
      icon: Globe,
      description: "History, geography, and civics of Pakistan.",
      stat3Label: "PAST PAPERS",
      iconColor: "text-orange-700",
      iconBg: "bg-orange-50",
      isPhysics: false,
    };
  if (n.includes("computer") || n.includes("cs"))
    return {
      icon: Cpu,
      description: "Master programming, algorithms, and computational thinking.",
      stat3Label: "PROJECTS",
      iconColor: "text-indigo-700",
      iconBg: "bg-indigo-50",
      isPhysics: false,
    };

  return {
    icon: Calculator,
    description: "Course materials and lectures.",
    stat3Label: "PAST PAPERS",
    iconColor: "text-slate-600",
    iconBg: "bg-slate-100",
    isPhysics: false,
  };
};

const sortSubjects = (subjects: any[]) =>
  [...subjects].sort((a, b) => {
    const aIsPhysics = a.name.toLowerCase().includes("physic");
    const bIsPhysics = b.name.toLowerCase().includes("physic");
    if (aIsPhysics) return -1;
    if (bIsPhysics) return 1;
    return a.name.localeCompare(b.name);
  });

/* ═══════════════════════════════════════════════════════════
   Stats Row — only LECTURES stat is clickable
═══════════════════════════════════════════════════════════ */
interface StatsRowProps {
  lectures: number;
  quizzes: number;
  pastPapers: number;
  stat3Label: string;
  iconColor: string;
  onLecturesClick: (e: React.MouseEvent) => void;
}

const StatsRow = ({ lectures, quizzes, pastPapers, stat3Label, iconColor, onLecturesClick }: StatsRowProps) => (
  <div className="flex items-start gap-7">
    {/* LECTURES — clickable */}
    <button
      onClick={onLecturesClick}
      className={`text-left group/lec hover:opacity-70 transition-opacity focus:outline-none`}
    >
      <p className={`text-[22px] font-black leading-none ${iconColor}`}>{lectures}</p>
      <p className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 underline underline-offset-2 decoration-dotted group-hover/lec:text-slate-600 transition-colors`}>
        LECTURES
      </p>
    </button>

    {/* QUIZZES — not clickable */}
    <div>
      <p className={`text-[22px] font-black leading-none ${iconColor}`}>{quizzes}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">QUIZZES</p>
    </div>

    {/* PAST PAPERS — not clickable */}
    <div className="max-w-[70px]">
      <p className={`text-[22px] font-black leading-none ${iconColor}`}>{pastPapers}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-tight">
        {stat3Label}
      </p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   FEATURED Physics card — NOT fully clickable
═══════════════════════════════════════════════════════════ */
interface FeaturedCardProps {
  subject: any;
  classInfo: any;
  gradeType: string;
  navigate: ReturnType<typeof useNavigate>;
  isUrdu: boolean;
  lectures: number;
  quizzes: number;
  pastPapers: number;
}

const FeaturedPhysicsCard = ({
  subject,
  classInfo,
  gradeType,
  navigate,
  isUrdu,
  lectures,
  quizzes,
  pastPapers,
}: FeaturedCardProps) => {
  const meta = getMeta(subject.name);
  const Icon = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const handleLecturesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/class/${classInfo?.id}/subject/${subject.id}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="col-span-full sm:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Banner image */}
      <div className="relative w-full sm:w-[280px] min-h-[180px] sm:min-h-0 shrink-0 overflow-hidden bg-slate-900">
        <img
          src={physicsSection}
          alt="Physics"
          className="absolute inset-0 w-full h-full object-contain object-center opacity-90"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent sm:from-white/100 sm:via-white/70 sm:to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`${meta.iconBg} p-3 rounded-xl`}>
              <Icon size={22} className={meta.iconColor} strokeWidth={1.7} />
            </div>
            <h3 className={`text-[24px] font-bold text-[#0F172A] leading-none ${isUrdu ? "font-urdu" : ""}`}>
              {title}
            </h3>
          </div>
        </div>

        <p className={`text-[14px] text-slate-500 leading-relaxed ${isUrdu ? "text-right" : ""}`}>
          {meta.description}
        </p>

        <div className="border-t border-slate-100 mt-auto" />

        <StatsRow
          lectures={lectures}
          quizzes={quizzes}
          pastPapers={pastPapers}
          stat3Label={meta.stat3Label}
          iconColor={meta.iconColor}
          onLecturesClick={handleLecturesClick}
        />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Regular Subject Card — NOT fully clickable
═══════════════════════════════════════════════════════════ */
interface SubjectCardProps {
  subject: any;
  classInfo: any;
  gradeType: string;
  navigate: ReturnType<typeof useNavigate>;
  isUrdu: boolean;
  index: number;
  lectures: number;
  quizzes: number;
  pastPapers: number;
}

const SubjectCard = ({
  subject,
  classInfo,
  gradeType,
  navigate,
  isUrdu,
  index,
  lectures,
  quizzes,
  pastPapers,
}: SubjectCardProps) => {
  const meta = getMeta(subject.name);
  const Icon = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const handleLecturesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/class/${classInfo?.id}/subject/${subject.id}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col gap-5"
    >
      {/* Icon — no arrow since card itself isn't clickable */}
      <div className="flex items-start justify-between">
        <div className={`${meta.iconBg} p-3.5 rounded-xl`}>
          <Icon size={24} className={meta.iconColor} strokeWidth={1.7} />
        </div>
      </div>

      {/* Name + desc */}
      <div>
        <h3 className={`text-[21px] font-bold text-[#0F172A] leading-tight mb-1.5 ${isUrdu ? "text-right" : ""}`}>
          {title}
        </h3>
        <p className={`text-[14px] text-slate-500 leading-relaxed line-clamp-2 ${isUrdu ? "text-right" : ""}`}>
          {meta.description}
        </p>
      </div>

      <div className="border-t border-slate-100" />

      <StatsRow
        lectures={lectures}
        quizzes={quizzes}
        pastPapers={pastPapers}
        stat3Label={meta.stat3Label}
        iconColor={meta.iconColor}
        onLecturesClick={handleLecturesClick}
      />
    </motion.div>
  );
};

/* ─── Skeletons ─── */
const CardSkeleton = ({ wide = false }: { wide?: boolean }) => (
  <div
    className={`bg-white rounded-2xl border border-slate-200 animate-pulse overflow-hidden ${
      wide
        ? "col-span-full sm:col-span-2 flex sm:flex-row flex-col"
        : "flex flex-col p-6 gap-5"
    }`}
  >
    {wide && <div className="w-full sm:w-[280px] min-h-[160px] bg-slate-100 shrink-0" />}
    <div className={`flex flex-col gap-4 ${wide ? "flex-1 p-6" : ""}`}>
      <div className="flex justify-between">
        <div className="w-12 h-12 bg-slate-100 rounded-xl" />
        <div className="w-5 h-5 bg-slate-100 rounded" />
      </div>
      <div>
        <div className="h-6 bg-slate-100 rounded w-1/2 mb-2" />
        <div className="h-4 bg-slate-100 rounded w-full mb-1" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
      </div>
      <div className="border-t border-slate-100" />
      <div className="flex gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-7 w-9 bg-slate-100 rounded mb-1.5" />
            <div className="h-3 w-14 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════ */
const ClassSubjectsView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const gradeType = location.state?.gradeType;

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  const { classInfo, subjects, chapterVideos, chapters, loading } =
    useClassSubjects(Number(classId));

  const [activeSidebarId, setActiveSidebarId] = useState<number | null>(null);

  const gradeName = classInfo?.name || `Grade ${classId}`;

  const getSubjectStats = (subjectId: number) => {
    const subjectChapters = chapters.filter((c: any) => c.subject_id === subjectId);
    let lectures = 0, quizzes = 0, pastPapers = 0;
    subjectChapters.forEach((c: any) => {
      lectures += (chapterVideos[c.id] || []).length;
      quizzes  += (c.quizzes      || []).length;
      pastPapers += (c.past_papers || []).length;
    });
    return { lectures, quizzes, pastPapers };
  };

  const sortedSubjects = sortSubjects(subjects);
  const visibleSubjects =
    activeSidebarId !== null
      ? sortedSubjects.filter((s: any) => s.id === activeSidebarId)
      : sortedSubjects;

  const physicsSubject = visibleSubjects.find((s: any) =>
    s.name.toLowerCase().includes("physic")
  );
  const otherSubjects = visibleSubjects.filter((s: any) =>
    !s.name.toLowerCase().includes("physic")
  );

  return (
    <section className="bg-[#F8FAFC] min-h-screen flex">

      {/* ══════ SIDEBAR ══════ */}
      <aside className="hidden lg:flex w-[272px] shrink-0 h-screen sticky top-0 bg-grey-100 border-r border-slate-200 flex-col">

        <div className="px-6 pt-8 pb-6 border-b border-slate-100">
          <p className="text-[#1E3A8A] font-extrabold text-[15px] leading-tight">
            {gradeName} Curriculum
          </p>
          <p className="text-slate-400 text-xs mt-0.5">Academic Year 2024-25</p>
          <button className="mt-5 w-full bg-[#1E3A8A] text-white text-[13px] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors">
            <Download size={15} />
            Download Syllabus
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-0.5">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-11 bg-slate-100 rounded-xl animate-pulse mb-1" />
              ))
            : sortedSubjects.map((sub: any) => {
                const meta = getMeta(sub.name);
                const Icon = meta.icon;
                const isActive = activeSidebarId === sub.id;
                const label = isUrdu ? sub.urdu_name || sub.name : sub.name;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSidebarId(isActive ? null : sub.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14.5px] font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-blue-50 text-[#1E3A8A]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.8}
                      className={isActive ? "text-[#1E3A8A]" : "text-slate-400"}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
        </nav>
      </aside>

      {/* ══════ MAIN ══════ */}
      <main className="flex-1 min-w-0 px-10 py-10 overflow-x-hidden">
        {/* 📱 Mobile Subjects Bar */}
        <div className="lg:hidden mb-6 overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {sortedSubjects.map((sub: any) => {
              const isActive = activeSidebarId === sub.id;
              const label = isUrdu ? sub.urdu_name || sub.name : sub.name;

              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSidebarId(isActive ? null : sub.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                    isActive
                      ? "bg-[#1E3A8A] text-white"
                      : "bg-white text-slate-600 border-slate-200"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-slate-400 flex items-center gap-2 mb-7">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            {isUrdu ? "ہوم" : "Home"}
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{gradeName}</span>
        </div>

        {/* Heading */}
        <div className="mb-9">
          <h1 className="text-[34px] font-black text-[#0F172A] tracking-tight leading-none mb-2">
            {gradeName} Subject Overview
          </h1>
          <p className="text-slate-500 text-[15px]">
            Click on <span className="font-semibold text-slate-700">LECTURES</span> under any subject to start watching.
          </p>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeletons"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              <CardSkeleton wide />
              {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
            </motion.div>

          ) : visibleSubjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-28 text-slate-400"
            >
              <GraduationCap size={52} strokeWidth={1} className="mb-4" />
              <p className="text-lg font-semibold">No subjects found</p>
            </motion.div>

          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {physicsSubject && (() => {
                const { lectures, quizzes, pastPapers } = getSubjectStats(physicsSubject.id);
                return (
                  <FeaturedPhysicsCard
                    key={physicsSubject.id}
                    subject={physicsSubject}
                    classInfo={classInfo}
                    gradeType={gradeType}
                    navigate={navigate}
                    isUrdu={isUrdu}
                    lectures={lectures}
                    quizzes={quizzes}
                    pastPapers={pastPapers}
                  />
                );
              })()}

              {otherSubjects.map((subject: any, i: number) => {
                const { lectures, quizzes, pastPapers } = getSubjectStats(subject.id);
                return (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    classInfo={classInfo}
                    gradeType={gradeType}
                    navigate={navigate}
                    isUrdu={isUrdu}
                    index={i}
                    lectures={lectures}
                    quizzes={quizzes}
                    pastPapers={pastPapers}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </section>
  );
};

export default ClassSubjectsView;

// const ClassSubjectsView = () => {
//   const { classId }: any = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { isLoggedIn } = useAuth(); // ✅ REQUIRED for Sidebar

//   const gradeType = location.state?.gradeType;
//   const selectedSubjectId = location.state?.selectedSubjectId;

//   const lang = getLanguage();
//   const isUrdu = lang === "ur";

//   const {
//     classInfo,
//     subjects,
//     selectedSubject,
//     setSelectedSubject,
//     chapters,
//     loading,
//   } = useClassSubjects(Number(classId), selectedSubjectId);

//   return (
//     <section className="py-20 bg-slate-50">

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* ✅ Breadcrumb */}
//         <div className="mb-6 text-sm text-slate-500 flex gap-2">
//           <Link to="/">{isUrdu ? "ہوم" : "Home"}</Link>
//           <span>/</span>
//           <Link to={`/grade-view/${gradeType}`}>
//             {isUrdu ? classInfo?.urdu_name : classInfo?.name}
//           </Link>
//         </div>

//         {/* ✅ Header */}
//         {classInfo && (
//           <ClassWelcomeCard
//             isUrdu={isUrdu}
//             classInfo={classInfo}
//             subjects={subjects}
//           />
//         )}

//         {/* ✅ Layout SAME as GradesView */}

//         {/* ✅ Sidebar (ONLY when needed like GradesView) */}


//         {/* ✅ MAIN CONTENT */}
//         <div className="flex-1">

//           {/* ================= SUBJECTS ================= */}
//           <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
//             {subjects.map((subject: any) => (
//               <div
//                 key={subject.id}
//                 onClick={() => setSelectedSubject(subject)}
//                 className={`bg-surface-container-low p-6 rounded-xl border border-white/50
//                     ${selectedSubject?.id === subject.id
//                     ? "bg-blue-600 text-white shadow-lg"
//                     : "bg-[#f1efff] hover:shadow-md"
//                   }`}
//               >
//                 <div class="flex items-center justify-between mb-4">

//                   <p className="text-lg font-bold">
//                     {isUrdu ? subject.urdu_name : subject.name}
//                   </p>

//                   <p className="text-xs opacity-70">
//                     {isUrdu ? "مضمون" : "Subject"}
//                   </p>
//                 </div>

//               </div>



//             ))}
//           </div>

//           <div className="flex flex-col lg:flex-row gap-10">


//             {gradeType != "kg" && (
//               <Sidebar
//                 isLoggedIn={isLoggedIn}
//                 isUrdu={isUrdu}
//                 type={gradeType}
//                 navigate={navigate}
//               />
//             )}

//             {/* ================= CHAPTERS ================= */}
//             {loading ? (
//               <Loader />
//             ) : chapters.length === 0 ? (
//               <div className="text-center py-20 text-slate-500">
//                 {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
//               </div>
//             ) : (
//               <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
//                 {chapters.map((c: any, i) => (
//                   <div
//                     key={c.id}
//                     className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition flex flex-col"
//                   >
//                     <div className="text-3xl mb-4">📖 Chapter {i + 1}</div>

//                     <h3 className="text-lg font-bold mb-2">
//                       {isUrdu ? c.urdu_name || c.name : c.name}
//                     </h3>

//                     <p className="text-sm text-slate-500 mb-6 flex-grow">
//                       {isUrdu
//                         ? "اس باب کے اسباق دیکھیں"
//                         : "Explore lessons, videos and quizzes for this chapter."}
//                     </p>

//                     <button
//                       onClick={() =>
//                         navigate(`/chapter/${c.id}`, {
//                           state: { chapter: c ,  classId: classId, },
//                         })
//                       }
//                       className="mt-auto py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
//                     >
//                       {isUrdu ? "شروع کریں" : "Start Learning"}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//           </div>
//         </div>
//        </div>
//     </section>
//   );
// }; 