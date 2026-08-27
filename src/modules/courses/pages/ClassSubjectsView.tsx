import React, { useState, useEffect, useMemo } from "react";
import physicsSection from "../../../assets/images/physics.png";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { classIdFromSlug } from "../../../config/classSlugs";
import { gradeNumberFromSlug } from "../../../config/classSlugs";
import { fetchSeniorPastPapers } from "../../shared/services/seniorService";
import { slugifySubject } from "../../../config/subjectSlug";
import {
  BookOpen, FlaskConical, Atom, Leaf, Languages, Sigma, Landmark, Globe,
  Calculator, Cpu, Download, GraduationCap, Sparkles, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─────────────────────────────────────────────────────────────
   Quiz API helper
──────────────────────────────────────────────────────────────── */
const BASE = "https://api.zaheen.com.pk/v2";

async function fetchQuizCountForSubject(subjectId: number): Promise<number> {
  try {
    const res = await fetch(
      `${BASE}/api/quiz/adaptive/skills-by-subject?subjectId=${subjectId}`
    );
    const json = await res.json();
    const skills: { has_questions: 0 | 1 }[] = Array.isArray(json?.data)
      ? json.data
      : [];
    return skills.filter((s) => s.has_questions === 1).length;
  } catch {
    return 0;
  }
}

/* ─────────────────────────────────────────────────────────────
   Subjects with no quizzes yet — intercept click and show modal.
   Add or remove keywords here as quizzes go live in the future.
──────────────────────────────────────────────────────────────── */
const COMING_SOON_SUBJECTS = ["computer science", "biology"];

function isComingSoonSubject(name: string): boolean {
  const n = name.toLowerCase();
  return COMING_SOON_SUBJECTS.some((keyword) => n.includes(keyword));
}

/* ─────────────────────────────────────────────────────────────
   Coming Soon Modal
──────────────────────────────────────────────────────────────── */
const ComingSoonModal = ({
  subjectName,
  onClose,
}: {
  subjectName: string;
  onClose: () => void;
}) => (
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

      {/* Icon */}
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
          {subjectName} Quizzes
        </h2>
        <p className="text-slate-500 text-[14px] leading-relaxed">
          We're working hard to bring you interactive quizzes for{" "}
          <span className="font-semibold text-slate-700">{subjectName}</span>.
          Check back soon — they'll be worth the wait!
        </p>
      </div>

      <div className="w-full border-t border-slate-100" />

      {/* CTA */}
      <button
        onClick={onClose}
        className="w-full bg-[#1E3A8A] hover:bg-[#1E293B] text-white font-bold text-[14px] py-3 rounded-xl transition-colors duration-200"
      >
        Got it, I'll check back later
      </button>
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────────────────────
   useTranslation — REACTIVE
──────────────────────────────────────────────────────────────── */
type TranslationFile = typeof enTranslations;

const translations: Record<string, TranslationFile> = {
  en: enTranslations,
  ur: urTranslations,
};

const useTranslation = () => {
  const [lang, setLang] = useState<string>(() => getLanguage());

  useEffect(() => {
    const sync = () => setLang(getLanguage());
    window.addEventListener("storage", sync);
    window.addEventListener("languageChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("languageChange", sync);
    };
  }, []);

  const locale = (translations[lang] ?? translations["en"]) as TranslationFile;

  const t = (key: string): string => {
    const parts = ["classSubjectsView", ...key.split(".")];
    let node: unknown = locale;
    for (const part of parts) {
      if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
        node = (node as Record<string, unknown>)[part];
      } else {
        let fallback: unknown = enTranslations;
        for (const p of parts) {
          if (fallback && typeof fallback === "object" && p in (fallback as Record<string, unknown>)) {
            fallback = (fallback as Record<string, unknown>)[p];
          } else {
            return key;
          }
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    return typeof node === "string" ? node : key;
  };

  return { t, lang };
};

/* ─────────────────────────────────────────────────────────────
   getMeta
──────────────────────────────────────────────────────────────── */
const getMeta = (name: string, t: (key: string) => string) => {
  const n = name.toLowerCase();
  if (n.includes("physic"))  return { icon: Atom,         description: t("subjects.physics.description"),   iconColor: "text-blue-700",   iconBg: "bg-blue-50"   };
  if (n.includes("math"))    return { icon: Sigma,        description: t("subjects.math.description"),       iconColor: "text-violet-700", iconBg: "bg-violet-50" };
  if (n.includes("chem"))    return { icon: FlaskConical, description: t("subjects.chemistry.description"),  iconColor: "text-emerald-700",iconBg: "bg-emerald-50"};
  if (n.includes("bio"))     return { icon: Leaf,         description: t("subjects.biology.description"),    iconColor: "text-green-700",  iconBg: "bg-green-50"  };
  if (n.includes("english")) return { icon: BookOpen,     description: t("subjects.english.description"),    iconColor: "text-sky-700",    iconBg: "bg-sky-50"    };
  if (n.includes("urdu"))    return { icon: Languages,    description: t("subjects.urdu.description"),       iconColor: "text-rose-700",   iconBg: "bg-rose-50"   };
  if (n.includes("islamic")) return { icon: Landmark,     description: t("subjects.islamic.description"),    iconColor: "text-teal-700",   iconBg: "bg-teal-50"   };
  if (n.includes("pakistan"))return { icon: Globe,        description: t("subjects.pakistan.description"),   iconColor: "text-orange-700", iconBg: "bg-orange-50" };
  if (n.includes("computer") || n.includes("cs"))
                             return { icon: Cpu,           description: t("subjects.computer.description"),   iconColor: "text-indigo-700", iconBg: "bg-indigo-50" };
  return                            { icon: Calculator,   description: t("subjects.default.description"),    iconColor: "text-slate-600",  iconBg: "bg-slate-100" };
};

/* ─────────────────────────────────────────────────────────────
   Sort subjects
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
   StatValue
──────────────────────────────────────────────────────────────── */
const StatValue = ({
  count, loading, iconColor, comingSoonLabel,
}: {
  count: number; loading?: boolean; iconColor: string; comingSoonLabel: string;
}) => {
  if (loading) return <div className="h-7 w-8 bg-slate-200 rounded animate-pulse mb-2" />;
  if (count === 0) {
    const lines = comingSoonLabel.split("\n");
    return (
      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide leading-tight">
        {lines.map((line, i) => (
          <React.Fragment key={i}>{line}{i < lines.length - 1 && <br />}</React.Fragment>
        ))}
      </p>
    );
  }
  return <p className={`text-[22px] font-black leading-none ${iconColor}`}>{count}</p>;
};

/* ─────────────────────────────────────────────────────────────
   StatsRow
──────────────────────────────────────────────────────────────── */
const StatsRow = ({
  lectures, quizzes, pastPapers,
  lecturesLoading, pastPapersLoading, quizzesLoading,
  iconColor,
  onLecturesClick, onQuizzesClick, onPastPapersClick,
  t,
}: {
  lectures: number; quizzes: number; pastPapers: number;
  lecturesLoading: boolean; pastPapersLoading: boolean; quizzesLoading: boolean;
  iconColor: string;
  onLecturesClick: (e: React.MouseEvent) => void;
  onQuizzesClick: (e: React.MouseEvent) => void;
  onPastPapersClick: (e: React.MouseEvent) => void;
  t: (k: string) => string;
}) => (
  <div className="flex items-start gap-7">
    <button onClick={onLecturesClick} className="text-left group/lec hover:opacity-70 transition-opacity focus:outline-none">
      <StatValue count={lectures} loading={lecturesLoading} iconColor={iconColor} comingSoonLabel={t("stats.comingSoon")} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 underline underline-offset-2 decoration-dotted group-hover/lec:text-slate-600 transition-colors">{t("stats.lectures")}</p>
    </button>
    <button onClick={onQuizzesClick} className="text-left group/quiz hover:opacity-70 transition-opacity focus:outline-none">
      <StatValue count={quizzes} loading={quizzesLoading} iconColor={iconColor} comingSoonLabel={t("stats.comingSoon")} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 underline underline-offset-2 decoration-dotted group-hover/quiz:text-slate-600 transition-colors">{t("stats.quizzes")}</p>
    </button>
    <button onClick={onPastPapersClick} className="text-left group/pp hover:opacity-70 transition-opacity focus:outline-none">
      <StatValue count={pastPapers} loading={pastPapersLoading} iconColor={iconColor} comingSoonLabel={t("stats.comingSoon")} />
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-tight underline underline-offset-2 decoration-dotted group-hover/pp:text-slate-600 transition-colors">{t("stats.pastPapers")}</p>
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   FEATURED Physics card
═══════════════════════════════════════════════════════════ */
const FeaturedPhysicsCard = ({
  subject, classInfo, classSlug, gradeType, navigate, isUrdu,
  lectures, quizzes, pastPapers, lecturesLoading, pastPapersLoading, quizzesLoading,
  onQuizzesClick, t,
}: {
  subject: any; classInfo: any; classSlug: string; gradeType: string;
  navigate: ReturnType<typeof useNavigate>; isUrdu: boolean;
  lectures: number; quizzes: number; pastPapers: number;
  lecturesLoading: boolean; pastPapersLoading: boolean; quizzesLoading: boolean;
  onQuizzesClick: () => void; t: (k: string) => string;
}) => {
  const meta  = getMeta(subject.name, t);
  const Icon  = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const goToLectures = () =>
    navigate(`/${classSlug}/${slugifySubject(subject.name)}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      onClick={goToLectures}
      className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col sm:flex-row cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className="relative w-full sm:w-[260px] min-h-[180px] sm:min-h-0 shrink-0 overflow-hidden bg-slate-900">
        <img src={physicsSection} alt="Physics"
          className="absolute inset-0 w-full h-full object-contain object-center opacity-90"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent sm:from-white/100 sm:via-white/70 sm:to-transparent" />
      </div>
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex items-start gap-3">
          <div className={`${meta.iconBg} p-3 rounded-xl`}>
            <Icon size={22} className={meta.iconColor} strokeWidth={1.7} />
          </div>
          <h3 className={`text-[24px] font-bold text-[#0F172A] leading-none mt-1 ${isUrdu ? "font-urdu" : ""}`}>{title}</h3>
        </div>
        <p className={`text-[14px] text-slate-500 leading-relaxed ${isUrdu ? "text-right" : ""}`}>
          {isUrdu ? (subject.urdu_desc || meta.description) : (subject.desc || meta.description)}
        </p>
        <div className="border-t border-slate-100 mt-auto" />
        <StatsRow
          lectures={lectures} quizzes={quizzes} pastPapers={pastPapers}
          lecturesLoading={lecturesLoading} pastPapersLoading={pastPapersLoading}
          quizzesLoading={quizzesLoading}
          iconColor={meta.iconColor}
          onLecturesClick={(e) => { e.stopPropagation(); goToLectures(); }}
          onQuizzesClick={(e) => { e.stopPropagation(); onQuizzesClick(); }}
          onPastPapersClick={(e) => {
            e.stopPropagation();
            navigate(`/${classSlug}/${slugifySubject(subject.name)}/past-papers`, {
              state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name, subjectName: subject.name },
            });
          }}
          t={t}
        />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════
   Regular Subject Card
═══════════════════════════════════════════════════════════ */
const SubjectCard = ({
  subject, classInfo, classSlug, gradeType, navigate, isUrdu, index,
  lectures, quizzes, pastPapers, lecturesLoading, pastPapersLoading, quizzesLoading,
  onQuizzesClick, t,
}: {
  subject: any; classInfo: any; classSlug: string; gradeType: string;
  navigate: ReturnType<typeof useNavigate>; isUrdu: boolean; index: number;
  lectures: number; quizzes: number; pastPapers: number;
  lecturesLoading: boolean; pastPapersLoading: boolean; quizzesLoading: boolean;
  onQuizzesClick: () => void; t: (k: string) => string;
}) => {
  const meta  = getMeta(subject.name, t);
  const Icon  = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const goToLectures = () =>
    navigate(`/${classSlug}/${slugifySubject(subject.name)}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={goToLectures}
      className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col gap-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className={`${meta.iconBg} p-3.5 rounded-xl w-fit`}>
        <Icon size={24} className={meta.iconColor} strokeWidth={1.7} />
      </div>
      <div>
        <h3 className={`text-[21px] font-bold text-[#0F172A] leading-tight mb-1.5 ${isUrdu ? "text-right" : ""}`}>{title}</h3>
        <p className={`text-[14px] text-slate-500 leading-relaxed ${isUrdu ? "text-right" : ""}`}>
          {isUrdu ? (subject.urdu_desc || meta.description) : (subject.desc || meta.description)}
        </p>
      </div>
      <div className="border-t border-slate-100" />
      <StatsRow
        lectures={lectures} quizzes={quizzes} pastPapers={pastPapers}
        lecturesLoading={lecturesLoading} pastPapersLoading={pastPapersLoading}
        quizzesLoading={quizzesLoading}
        iconColor={meta.iconColor}
        onLecturesClick={(e) => { e.stopPropagation(); goToLectures(); }}
        onQuizzesClick={(e) => { e.stopPropagation(); onQuizzesClick(); }}
        onPastPapersClick={(e) => {
          e.stopPropagation();
          navigate(`/${classSlug}/${slugifySubject(subject.name)}/past-papers`, {
            state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name, subjectName: subject.name },
          });
        }}
        t={t}
      />
    </motion.div>
  );
};

/* ─── Skeletons ─── */
const CardSkeleton = ({ wide = false }: { wide?: boolean }) => (
  <div className={`bg-white rounded-2xl border border-slate-200 animate-pulse overflow-hidden ${
    wide ? "col-span-1 sm:col-span-2 flex sm:flex-row flex-col" : "flex flex-col p-6 gap-5"
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
  const { classSlug } = useParams<{ classSlug: string }>();
  const classId = classIdFromSlug(classSlug ?? "");
  const navigate  = useNavigate();
  const location  = useLocation();
  const gradeType = location.state?.gradeType;

  const { t, lang } = useTranslation();
  const isUrdu      = lang === "ur";

  const { classInfo, subjects, chapterVideos, chapters, loading } =
    useClassSubjects(classId ?? 0);

  /* ── Reactive grade display name ── */
  const gradeName = useMemo(() => {
    if (!classInfo) return `Grade ${gradeNumberFromSlug(classSlug ?? "") ?? classId}`;
    if (!isUrdu) return classInfo.name || `Grade ${classId}`;
    const apiUrdu = classInfo.urdu_name?.trim();
    if (apiUrdu) return apiUrdu;
    const numMatch = (classInfo.name || "").match(/\d+/);
    if (numMatch) return `جماعت ${numMatch[0]}`;
    return classInfo.name || `Grade ${classId}`;
  }, [classInfo, isUrdu, classId]);

  /* ── Past papers state ── */
  const [pastPaperCounts, setPastPaperCounts] = useState<Record<number, number>>({});
  const [ppLoading, setPpLoading]             = useState(true);
  const [ppFetched, setPpFetched]             = useState(false);

  /* ── Quiz counts state ── */
  const [quizCounts, setQuizCounts]               = useState<Record<number, number>>({});
  const [quizCountsLoading, setQuizCountsLoading] = useState(true);
  const [quizCountsFetched, setQuizCountsFetched] = useState(false);

  const [activeSidebarId, setActiveSidebarId] = useState<number | null>(null);

  /* ── Coming Soon modal: stores the subject name to display, or null ── */
  const [comingSoonSubject, setComingSoonSubject] = useState<string | null>(null);

  /* ─────────────────────────────────────────────────────────────
     makeQuizHandler
     Returns the correct onClick for any subject's quiz button:
     - Coming Soon subjects  → open the modal (no navigation)
     - All other subjects    → navigate to the quiz flow
  ──────────────────────────────────────────────────────────────── */
  const makeQuizHandler = (subject: any) => () => {
    if (isComingSoonSubject(subject.name)) {
      setComingSoonSubject(subject.name);
    } else {
      navigate(`/${classSlug}/quiz`, { state: { subjectId: subject.id } });
    }
  };

  /* ── Fetch past paper counts ── */
  useEffect(() => {
    if (!classId || subjects.length === 0) return;
    let cancelled = false;
    const fetchAllCounts = async () => {
      setPpLoading(true);
      try {
        const results = await Promise.allSettled(
          subjects.map(async (subject: any) => {
            const json = await fetchSeniorPastPapers(classId, subject.id);
            const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
            return { subjectId: subject.id as number, count: list.length };
          })
        );
        if (!cancelled) {
          const counts: Record<number, number> = {};
          results.forEach((r) => {
            if (r.status === "fulfilled") counts[r.value.subjectId] = r.value.count;
          });
          setPastPaperCounts(counts);
        }
      } catch (err) {
        console.error("Failed to fetch past paper counts:", err);
      } finally {
        if (!cancelled) { setPpLoading(false); setPpFetched(true); }
      }
    };
    fetchAllCounts();
    return () => { cancelled = true; };
  }, [classId, subjects]);

  /* ── Fetch quiz counts ── */
  useEffect(() => {
    if (!classId || subjects.length === 0) return;
    let cancelled = false;
    const fetchAllQuizCounts = async () => {
      setQuizCountsLoading(true);
      try {
        const results = await Promise.allSettled(
          subjects.map(async (subject: any) => {
            const count = await fetchQuizCountForSubject(subject.id);
            return { subjectId: subject.id as number, count };
          })
        );
        if (!cancelled) {
          const counts: Record<number, number> = {};
          results.forEach((r) => {
            if (r.status === "fulfilled") counts[r.value.subjectId] = r.value.count;
          });
          setQuizCounts(counts);
        }
      } catch (err) {
        console.error("Failed to fetch quiz counts:", err);
      } finally {
        if (!cancelled) { setQuizCountsLoading(false); setQuizCountsFetched(true); }
      }
    };
    fetchAllQuizCounts();
    return () => { cancelled = true; };
  }, [classId, subjects]);

  /* ── Per-subject stats ── */
  const getSubjectStats = (subjectId: number) => {
    const subjectChapters = chapters.filter((c: any) => c.subject_id === subjectId);
    const chaptersExist   = subjectChapters.length > 0;
    const videosInFlight  = chaptersExist && subjectChapters.every((c: any) => !(c.id in chapterVideos));
    const lecturesLoading = loading || videosInFlight;
    let lectures = 0;
    if (!lecturesLoading) {
      subjectChapters.forEach((c: any) => {
        lectures += (chapterVideos[c.id] || []).length;
      });
    }
    const pastPapersLoading = !ppFetched || ppLoading;
    const pastPapers        = pastPapersLoading ? 0 : (pastPaperCounts[subjectId] ?? 0);
    const quizzesLoading    = !quizCountsFetched || quizCountsLoading;
    const quizzes           = quizzesLoading ? 0 : (quizCounts[subjectId] ?? 0);
    return { lectures, quizzes, pastPapers, lecturesLoading, pastPapersLoading, quizzesLoading };
  };

  const sortedSubjects  = sortSubjects(subjects);
  const visibleSubjects = activeSidebarId !== null
    ? sortedSubjects.filter((s: any) => s.id === activeSidebarId)
    : sortedSubjects;

  const physicsSubject = visibleSubjects.find((s: any) => s.name.toLowerCase().includes("physic"));
  const mathsSubject   = visibleSubjects.find((s: any) => s.name.toLowerCase().includes("math"));
  const restSubjects   = visibleSubjects.filter(
    (s: any) => !s.name.toLowerCase().includes("physic") && !s.name.toLowerCase().includes("math")
  );

  const renderMathCard = (index: number) => {
    if (!mathsSubject) return null;
    const stats = getSubjectStats(mathsSubject.id);
    return (
      <SubjectCard key={mathsSubject.id} subject={mathsSubject} classInfo={classInfo}
        classSlug={classSlug ?? ""} gradeType={gradeType} navigate={navigate} isUrdu={isUrdu} index={index}
        {...stats}
        onQuizzesClick={makeQuizHandler(mathsSubject)}
        t={t}
      />
    );
  };

  return (
    <section className="bg-[#F8FAFC] min-h-screen flex">

      {/* ══════ SIDEBAR ══════ */}
      <aside className="hidden lg:flex w-[272px] shrink-0 h-screen sticky top-0 border-r border-slate-200 flex-col bg-white">
        <div className="px-6 pt-8 pb-6 border-b border-slate-100">
          <p className="text-[#1E3A8A] font-extrabold text-[15px] leading-tight">
            {gradeName} {t("curriculumLabel")}
          </p>
          <p className="text-slate-400 text-xs mt-0.5">{t("academicYear")}</p>
          <button className="mt-5 w-full bg-[#1E3A8A] text-white text-[13px] font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1E293B] transition-colors">
            <Download size={15} /> {t("downloadSyllabus")}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-11 bg-slate-100 rounded-xl animate-pulse" />
              ))
            : sortedSubjects.map((sub: any) => {
                const meta     = getMeta(sub.name, t);
                const Icon     = meta.icon;
                const isActive = activeSidebarId === sub.id;
                const label    = isUrdu ? sub.urdu_name || sub.name : sub.name;
                return (
                  <button key={sub.id} onClick={() => setActiveSidebarId(isActive ? null : sub.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 ${
                      isActive ? "bg-blue-50 text-[#1E3A8A]" : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} className={isActive ? "text-[#1E3A8A]" : "text-slate-400"} />
                    <span>{label}</span>
                  </button>
                );
              })}
        </nav>
      </aside>

      {/* ══════ MAIN ══════ */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10">

          {/* Mobile subject chips */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-3 pb-2">
              {sortedSubjects.map((sub: any) => {
                const isActive = activeSidebarId === sub.id;
                const label    = isUrdu ? sub.urdu_name || sub.name : sub.name;
                return (
                  <button key={sub.id} onClick={() => setActiveSidebarId(isActive ? null : sub.id)}
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
          <div className="text-sm text-slate-400 flex items-center gap-2 mb-7 flex-wrap">
            <Link to="/" className="hover:text-slate-600 transition-colors">{t("home")}</Link>
            <span>/</span>
            <Link to="/grade-view/9-12" className="hover:text-slate-600 transition-colors">
              Grades 9-12
            </Link>
            <span>/</span>
            <span className="text-slate-700 font-semibold">{gradeName}</span>
          </div>

          {/* Heading */}
          <div className="mb-9">
            <h1 className="text-[34px] font-black text-[#0F172A] tracking-tight leading-none mb-2">
              {gradeName} {t("subjectOverview")}
            </h1>
            <p className="text-slate-500 text-[15px]">
              {t("pageSubtitle")}{" "}
              <span className="font-semibold text-slate-700">{t("pastPapersHighlight")}</span>{" "}
              {t("pageSubtitleSuffix")}
            </p>
          </div>

          {/* ── GRID ── */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeletons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <CardSkeleton wide /><CardSkeleton />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              </motion.div>

            ) : visibleSubjects.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-28 text-slate-400"
              >
                <GraduationCap size={52} strokeWidth={1} className="mb-4" />
                <p className="text-lg font-semibold">{t("noSubjectsFound")}</p>
              </motion.div>

            ) : (
              <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                {physicsSubject && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {(() => {
                      const stats = getSubjectStats(physicsSubject.id);
                      return (
                        <FeaturedPhysicsCard key={physicsSubject.id} subject={physicsSubject}
                          classInfo={classInfo} classSlug={classSlug ?? ""} gradeType={gradeType} navigate={navigate}
                          isUrdu={isUrdu} {...stats}
                          onQuizzesClick={makeQuizHandler(physicsSubject)}
                          t={t}
                        />
                      );
                    })()}
                    {mathsSubject && renderMathCard(0)}
                  </div>
                )}

                {(restSubjects.length > 0 || (!physicsSubject && mathsSubject)) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {!physicsSubject && mathsSubject && renderMathCard(0)}
                    {restSubjects.map((subject: any, i: number) => {
                      const stats = getSubjectStats(subject.id);
                      return (
                        <SubjectCard key={subject.id} subject={subject} classInfo={classInfo}
                          classSlug={classSlug ?? ""} gradeType={gradeType} navigate={navigate} isUrdu={isUrdu} index={i}
                          {...stats}
                          onQuizzesClick={makeQuizHandler(subject)}
                          t={t}
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

      {/* ══════ Coming Soon Modal ══════ */}
      <AnimatePresence>
        {comingSoonSubject && (
          <ComingSoonModal
            subjectName={comingSoonSubject}
            onClose={() => setComingSoonSubject(null)}
          />
        )}
      </AnimatePresence>

    </section>
  );
};

export default ClassSubjectsView;