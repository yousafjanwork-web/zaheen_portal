
import React, { useState, useEffect } from "react";
import physicsSection from "../../../assets/images/physics.png";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
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
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";

const BASE_URL = "https://api.zaheen.com.pk/api";

/* ─────────────────────────────────────────────────────────────
   getMeta
──────────────────────────────────────────────────────────────── */
const getMeta = (name: string) => {
  const n = name.toLowerCase();

  if (n.includes("physic"))
    return { icon: Atom,         description: "Explore the fundamental principles governing the physical world.", iconColor: "text-blue-700",   iconBg: "bg-blue-50"   };
  if (n.includes("math"))
    return { icon: Sigma,        description: "Algebra, geometry, trigonometry, and problem solving.",            iconColor: "text-violet-700", iconBg: "bg-violet-50" };
  if (n.includes("chem"))
    return { icon: FlaskConical, description: "Chemical reactions, atomic structure, and laboratory.",            iconColor: "text-emerald-700",iconBg: "bg-emerald-50"};
  if (n.includes("bio"))
    return { icon: Leaf,         description: "Cellular processes, genetics, and study of living organisms.",     iconColor: "text-green-700",  iconBg: "bg-green-50"  };
  if (n.includes("english"))
    return { icon: BookOpen,     description: "Literature analysis, advanced grammar, and composition.",          iconColor: "text-sky-700",    iconBg: "bg-sky-50"    };
  if (n.includes("urdu"))
    return { icon: Languages,    description: "Classical literature, poetry, and advanced linguistics.",          iconColor: "text-rose-700",   iconBg: "bg-rose-50"   };
  if (n.includes("islamic"))
    return { icon: Landmark,     description: "Quranic studies, Hadith, Islamic history and ethics.",             iconColor: "text-teal-700",   iconBg: "bg-teal-50"   };
  if (n.includes("pakistan"))
    return { icon: Globe,        description: "History, geography, and civics of Pakistan.",                      iconColor: "text-orange-700", iconBg: "bg-orange-50" };
  if (n.includes("computer") || n.includes("cs"))
    return { icon: Cpu,          description: "Master programming, algorithms, and computational thinking.",      iconColor: "text-indigo-700", iconBg: "bg-indigo-50" };

  return   { icon: Calculator,   description: "Course materials and lectures.",                                   iconColor: "text-slate-600",  iconBg: "bg-slate-100" };
};

/* ─────────────────────────────────────────────────────────────
   Sort:
     1. Physics  (featured card, row 1 left)
     2. Maths    (row 1 right)
     3. Everything else alphabetically
     4. Biology  (always last)
──────────────────────────────────────────────────────────────── */
const sortSubjects = (subjects: any[]) =>
  [...subjects].sort((a, b) => {
    const rank = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes("physic")) return 0;
      if (n.includes("math"))   return 1;
      if (n.includes("bio"))    return 99;
      return 2;
    };
    const ra = rank(a.name);
    const rb = rank(b.name);
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });

/* ─────────────────────────────────────────────────────────────
   StatValue — shows skeleton while loading, "Coming Soon" only
   when data has fully loaded and count is still 0
──────────────────────────────────────────────────────────────── */
const StatValue = ({
  count,
  loading,
  iconColor,
}: {
  count: number;
  loading?: boolean;
  iconColor: string;
}) => {
  if (loading) {
    return <div className="h-7 w-8 bg-slate-200 rounded animate-pulse mb-2" />;
  }
  if (count === 0) {
    return (
      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide leading-tight">
        Coming<br />Soon
      </p>
    );
  }
  return <p className={`text-[22px] font-black leading-none ${iconColor}`}>{count}</p>;
};

/* ─────────────────────────────────────────────────────────────
   Quizzes Coming Soon Modal
──────────────────────────────────────────────────────────────── */
const QuizzesComingSoonModal = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: 20 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-8 flex flex-col items-center text-center gap-5 relative"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <X size={16} />
      </button>

      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0.6, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
        className="bg-amber-50 p-5 rounded-2xl border border-amber-100"
      >
        <Sparkles size={34} className="text-amber-400" strokeWidth={1.6} />
      </motion.div>

      {/* Badge */}
      <span className="text-[10px] font-black tracking-widest uppercase text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
        Coming Soon
      </span>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="text-[22px] font-black text-[#0F172A] leading-tight">
          Quizzes are on the way!
        </h2>
        <p className="text-slate-500 text-[14px] leading-relaxed">
          We're crafting interactive quizzes for every subject to help you test your knowledge. Stay tuned — they'll be live very soon.
        </p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-slate-100" />

      {/* CTA */}
      <button
        onClick={onClose}
        className="w-full bg-[#1E3A8A] hover:bg-[#1E293B] text-white font-bold text-[14px] py-3 rounded-xl transition-colors duration-200"
      >
        Got it, thanks!
      </button>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   StatsRow
──────────────────────────────────────────────────────────────── */
interface StatsRowProps {
  lectures: number;
  quizzes: number;
  pastPapers: number;
  // ✅ FIX: separate loading flags for lectures and past papers
  lecturesLoading: boolean;
  pastPapersLoading: boolean;
  iconColor: string;
  onLecturesClick: (e: React.MouseEvent) => void;
  onQuizzesClick: (e: React.MouseEvent) => void;
  onPastPapersClick: (e: React.MouseEvent) => void;
}

const StatsRow = ({
  lectures, quizzes, pastPapers, lecturesLoading, pastPapersLoading, iconColor,
  onLecturesClick, onQuizzesClick, onPastPapersClick,
}: StatsRowProps) => (
  <div className="flex items-start gap-7">

    {/* LECTURES — ✅ now respects lecturesLoading so it never shows "Coming Soon" while still fetching */}
    <button
      onClick={onLecturesClick}
      className="text-left group/lec hover:opacity-70 transition-opacity focus:outline-none"
    >
      <StatValue count={lectures} loading={lecturesLoading} iconColor={iconColor} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 underline underline-offset-2 decoration-dotted group-hover/lec:text-slate-600 transition-colors">
        LECTURES
      </p>
    </button>

    {/* QUIZZES — always "Coming Soon" (quizzes not implemented yet) */}
    <button
      onClick={onQuizzesClick}
      className="text-left group/quiz hover:opacity-70 transition-opacity focus:outline-none"
    >
      <StatValue count={quizzes} iconColor={iconColor} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 underline underline-offset-2 decoration-dotted group-hover/quiz:text-slate-600 transition-colors">
        QUIZZES
      </p>
    </button>

    {/* PAST PAPERS */}
    <button
      onClick={onPastPapersClick}
      className="text-left group/pp hover:opacity-70 transition-opacity focus:outline-none"
    >
      <StatValue count={pastPapers} loading={pastPapersLoading} iconColor={iconColor} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-tight underline underline-offset-2 decoration-dotted group-hover/pp:text-slate-600 transition-colors">
        PAST PAPERS
      </p>
    </button>

  </div>
);

/* ═══════════════════════════════════════════════════════════
   FEATURED Physics card — wide (col-span-2), with image banner
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
  // ✅ FIX: added lecturesLoading prop
  lecturesLoading: boolean;
  pastPapersLoading: boolean;
  onQuizzesClick: () => void;
}

const FeaturedPhysicsCard = ({
  subject, classInfo, gradeType, navigate, isUrdu,
  lectures, quizzes, pastPapers, lecturesLoading, pastPapersLoading, onQuizzesClick,
}: FeaturedCardProps) => {
  const meta  = getMeta(subject.name);
  const Icon  = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const goToLectures = () =>
    navigate(`/class/${classInfo?.id}/subject/${subject.id}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });

  const handleLecturesClick = (e: React.MouseEvent) => { e.stopPropagation(); goToLectures(); };

  const handleQuizzesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuizzesClick();
  };

  const handlePastPapersClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/class/${classInfo?.id}/subject/${subject.id}/past-papers`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name, subjectName: subject.name },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={goToLectures}
      className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      {/* Image banner */}
      <div className="relative w-full sm:w-[260px] min-h-[180px] sm:min-h-0 shrink-0 overflow-hidden bg-slate-900">
        <img
          src={physicsSection}
          alt="Physics"
          className="absolute inset-0 w-full h-full object-contain object-center opacity-90"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent sm:from-white/100 sm:via-white/70 sm:to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex items-start gap-3">
          <div className={`${meta.iconBg} p-3 rounded-xl`}>
            <Icon size={22} className={meta.iconColor} strokeWidth={1.7} />
          </div>
          <h3 className={`text-[24px] font-bold text-[#0F172A] leading-none mt-1 ${isUrdu ? "font-urdu" : ""}`}>
            {title}
          </h3>
        </div>

        <p className={`text-[14px] text-slate-500 leading-relaxed ${isUrdu ? "text-right" : ""}`}>
          {meta.description}
        </p>

        <div className="border-t border-slate-100 mt-auto" />

        <StatsRow
          lectures={lectures}
          quizzes={quizzes}
          pastPapers={pastPapers}
          lecturesLoading={lecturesLoading}
          pastPapersLoading={pastPapersLoading}
          iconColor={meta.iconColor}
          onLecturesClick={handleLecturesClick}
          onQuizzesClick={handleQuizzesClick}
          onPastPapersClick={handlePastPapersClick}
        />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Regular Subject Card — single column, full card clickable
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
  // ✅ FIX: added lecturesLoading prop
  lecturesLoading: boolean;
  pastPapersLoading: boolean;
  onQuizzesClick: () => void;
}

const SubjectCard = ({
  subject, classInfo, gradeType, navigate, isUrdu, index,
  lectures, quizzes, pastPapers, lecturesLoading, pastPapersLoading, onQuizzesClick,
}: SubjectCardProps) => {
  const meta  = getMeta(subject.name);
  const Icon  = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const goToLectures = () =>
    navigate(`/class/${classInfo?.id}/subject/${subject.id}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });

  const handleLecturesClick = (e: React.MouseEvent) => { e.stopPropagation(); goToLectures(); };

  const handleQuizzesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuizzesClick();
  };

  const handlePastPapersClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/class/${classInfo?.id}/subject/${subject.id}/past-papers`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name, subjectName: subject.name },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={goToLectures}
      className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col gap-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className={`${meta.iconBg} p-3.5 rounded-xl w-fit`}>
        <Icon size={24} className={meta.iconColor} strokeWidth={1.7} />
      </div>

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
        lecturesLoading={lecturesLoading}
        pastPapersLoading={pastPapersLoading}
        iconColor={meta.iconColor}
        onLecturesClick={handleLecturesClick}
        onQuizzesClick={handleQuizzesClick}
        onPastPapersClick={handlePastPapersClick}
      />
    </motion.div>
  );
};

/* ─── Skeletons ─── */
const CardSkeleton = ({ wide = false }: { wide?: boolean }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 animate-pulse overflow-hidden ${
    wide
      ? "col-span-1 sm:col-span-2 flex sm:flex-row flex-col"
      : "flex flex-col p-6 gap-5"
  }`}>
    {wide && <div className="w-full sm:w-[260px] min-h-[160px] bg-slate-100 shrink-0" />}
    <div className={`flex flex-col gap-4 ${wide ? "flex-1 p-6" : ""}`}>
      <div className="w-12 h-12 bg-slate-100 rounded-xl" />
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
  const navigate    = useNavigate();
  const location    = useLocation();
  const gradeType   = location.state?.gradeType;

  const lang   = getLanguage();
  const isUrdu = lang === "ur";

  const { classInfo, subjects, chapterVideos, chapters, loading } =
    useClassSubjects(Number(classId));

  const [activeSidebarId, setActiveSidebarId] = useState<number | null>(null);

  /* ── Quizzes Coming Soon modal ── */
  const [showQuizModal, setShowQuizModal] = useState(false);

  /* ── Past paper counts ── */
  const [pastPaperCounts, setPastPaperCounts] = useState<Record<number, number>>({});
  const [ppLoading, setPpLoading]             = useState(false);

  useEffect(() => {
    if (!classId || subjects.length === 0) return;
    let cancelled = false;

    const fetchAllCounts = async () => {
      setPpLoading(true);
      try {
        const results = await Promise.allSettled(
          subjects.map(async (subject: any) => {
            const res  = await fetch(`${BASE_URL}/pastpapers?class_id=${classId}&subject_id=${subject.id}`);
            const json = await res.json();
            const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
            return { subjectId: subject.id as number, count: list.length };
          })
        );
        if (!cancelled) {
          const counts: Record<number, number> = {};
          results.forEach((r) => { if (r.status === "fulfilled") counts[r.value.subjectId] = r.value.count; });
          setPastPaperCounts(counts);
        }
      } catch (err) {
        console.error("Failed to fetch past paper counts:", err);
      } finally {
        if (!cancelled) setPpLoading(false);
      }
    };

    fetchAllCounts();
    return () => { cancelled = true; };
  }, [classId, subjects]);

  const gradeName = classInfo?.name || `Grade ${classId}`;

  /*
   * ✅ KEY FIX: getSubjectStats now returns a `lecturesLoading` flag.
   *
   * The hook's `loading` flag covers the initial fetch of subjects +
   * chapters. But `chapterVideos` is often populated in a *second*
   * async pass inside the hook. We treat lectures as "still loading"
   * whenever the top-level `loading` is true OR when chapters exist
   * for this subject but chapterVideos hasn't populated any of them
   * yet — which means the video fetch is still in-flight.
   */
  const getSubjectStats = (subjectId: number) => {
    const subjectChapters = chapters.filter((c: any) => c.subject_id === subjectId);

    // If overall loading is still true, show skeleton for lectures too
    if (loading) {
      return { lectures: 0, quizzes: 0, pastPapers: 0, lecturesLoading: true };
    }

    let lectures = 0, quizzes = 0;
    subjectChapters.forEach((c: any) => {
      lectures += (chapterVideos[c.id] || []).length;
      quizzes  += (c.quizzes || []).length;
    });

    /*
     * Secondary guard: chapters exist but none have videos yet →
     * the video fetch is still in-flight inside the hook.
     * Show skeleton instead of "Coming Soon".
     */
    const chaptersExist      = subjectChapters.length > 0;
    const noVideosLoadedYet  = chaptersExist && lectures === 0 &&
      subjectChapters.every((c: any) => !(c.id in chapterVideos));

    return {
      lectures,
      quizzes,
      pastPapers: pastPaperCounts[subjectId] ?? 0,
      lecturesLoading: noVideosLoadedYet,
    };
  };

  const sortedSubjects  = sortSubjects(subjects);
  const visibleSubjects = activeSidebarId !== null
    ? sortedSubjects.filter((s: any) => s.id === activeSidebarId)
    : sortedSubjects;

  const physicsSubject = visibleSubjects.find((s: any) => s.name.toLowerCase().includes("physic"));
  const mathsSubject   = visibleSubjects.find((s: any) => s.name.toLowerCase().includes("math"));
  const restSubjects   = visibleSubjects.filter(
    (s: any) =>
      !s.name.toLowerCase().includes("physic") &&
      !s.name.toLowerCase().includes("math")
  );

  const showFeaturedRow = physicsSubject || mathsSubject;

  return (
    <section className="bg-[#F8FAFC] min-h-screen flex">

      {/* ══════ SIDEBAR ══════ */}
      <aside className="hidden lg:flex w-[272px] shrink-0 h-screen sticky top-0 border-r border-slate-200 flex-col bg-white">
        <div className="px-6 pt-8 pb-6 border-b border-slate-100">
          <p className="text-[#1E3A8A] font-extrabold text-[15px] leading-tight">{gradeName} Curriculum</p>
          <p className="text-slate-400 text-xs mt-0.5">Academic Year 2024-25</p>
          <button className="mt-5 w-full bg-[#1E3A8A] text-white text-[13px] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors">
            <Download size={15} /> Download Syllabus
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-11 bg-slate-100 rounded-xl animate-pulse" />
              ))
            : sortedSubjects.map((sub: any) => {
                const meta     = getMeta(sub.name);
                const Icon     = meta.icon;
                const isActive = activeSidebarId === sub.id;
                const label    = isUrdu ? sub.urdu_name || sub.name : sub.name;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSidebarId(isActive ? null : sub.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
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
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-8 xl:px-16 py-10">

          {/* Mobile subject chips */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {sortedSubjects.map((sub: any) => {
                const isActive = activeSidebarId === sub.id;
                const label    = isUrdu ? sub.urdu_name || sub.name : sub.name;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSidebarId(isActive ? null : sub.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                      isActive ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" : "bg-white text-slate-600 border-slate-200"
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
              Click any subject card to open lectures, or click{" "}
              <span className="font-semibold text-slate-700">PAST PAPERS</span> to jump directly to past papers.
            </p>
          </div>

          {/* ── GRID ── */}
          <AnimatePresence mode="wait">

            {loading ? (
              <motion.div
                key="skeletons"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <CardSkeleton wide />
                  <CardSkeleton />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
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
              <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                {/* ── ROW 1: Physics (featured, 2 cols) + Maths (1 col) ── */}
                {showFeaturedRow && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                    {physicsSubject ? (() => {
                      const { lectures, quizzes, pastPapers, lecturesLoading } = getSubjectStats(physicsSubject.id);
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
                          lecturesLoading={lecturesLoading}
                          pastPapersLoading={ppLoading}
                          onQuizzesClick={() => setShowQuizModal(true)}
                        />
                      );
                    })() : (
                      <div className="col-span-2" />
                    )}

                    {mathsSubject && (() => {
                      const { lectures, quizzes, pastPapers, lecturesLoading } = getSubjectStats(mathsSubject.id);
                      return (
                        <SubjectCard
                          key={mathsSubject.id}
                          subject={mathsSubject}
                          classInfo={classInfo}
                          gradeType={gradeType}
                          navigate={navigate}
                          isUrdu={isUrdu}
                          index={0}
                          lectures={lectures}
                          quizzes={quizzes}
                          pastPapers={pastPapers}
                          lecturesLoading={lecturesLoading}
                          pastPapersLoading={ppLoading}
                          onQuizzesClick={() => setShowQuizModal(true)}
                        />
                      );
                    })()}

                  </div>
                )}

                {/* ── ROW 2+: Remaining subjects ── */}
                {restSubjects.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {restSubjects.map((subject: any, i: number) => {
                      const { lectures, quizzes, pastPapers, lecturesLoading } = getSubjectStats(subject.id);
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
                          lecturesLoading={lecturesLoading}
                          pastPapersLoading={ppLoading}
                          onQuizzesClick={() => setShowQuizModal(true)}
                        />
                      );
                    })}
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* ══════ QUIZZES COMING SOON MODAL ══════ */}
      <AnimatePresence>
        {showQuizModal && (
          <QuizzesComingSoonModal onClose={() => setShowQuizModal(false)} />
        )}
      </AnimatePresence>

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