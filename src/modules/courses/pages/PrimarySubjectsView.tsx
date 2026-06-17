import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, Languages, Calculator, Leaf, FlaskConical, Globe,
  Cpu, Landmark, GraduationCap, Gamepad2, HelpCircle, Sparkles,
  ArrowRight, X, Star,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

type TranslationFile = typeof enTranslations;
const translations: Record<string, TranslationFile> = { en: enTranslations, ur: urTranslations };

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
      if (node && typeof node === "object" && part in (node as Record<string, unknown>))
        node = (node as Record<string, unknown>)[part];
      else {
        let fallback: unknown = enTranslations;
        for (const p of parts) {
          if (fallback && typeof fallback === "object" && p in (fallback as Record<string, unknown>))
            fallback = (fallback as Record<string, unknown>)[p];
          else return key;
        }
        return typeof fallback === "string" ? fallback : key;
      }
    }
    return typeof node === "string" ? node : key;
  };
  return { t, lang };
};

interface SubjectMeta {
  icon: React.ElementType;
  description: string;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  lessonPillBg: string;
  tag: string;
}

const getPrimaryMeta = (name: string, isUrdu: boolean = false): SubjectMeta => {
  const n = name.toLowerCase();
  if (n.includes("english"))
    return {
      icon: BookOpen,
      description: isUrdu
        ? "بنیادی گرامر کی مہارتیں پیدا کریں، اپنی لغت کو وسعت دیں، اور تخلیقی کہانی سازی کی دنیا میں قدم رکھیں۔"
        : "Develop foundational grammar skills, expand your vocabulary, and dive into the world of creative storytelling.",
      cardBg: "linear-gradient(145deg,#EEF2FF 0%,#E0E7FF 100%)",
      iconBg: "#E0E7FF", iconColor: "#3730A3",
      accentColor: "#3730A3", lessonPillBg: "#C7D2FE", tag: "CURRICULUM",
    };
  if (n.includes("urdu"))
    return {
      icon: Languages,
      description: isUrdu
        ? "درست جملہ بندی سیکھیں، اردو ادب سے لطف اٹھائیں، اور اپنی پڑھنے لکھنے کی مہارت کو بہتر بنائیں۔"
        : "Learn proper sentence building, appreciate Urdu literature, and improve your reading and writing skills.",
      cardBg: "linear-gradient(145deg,#FFF7ED 0%,#FFEDD5 100%)",
      iconBg: "#FFEDD5", iconColor: "#92400E",
      accentColor: "#92400E", lessonPillBg: "#FDE68A", tag: "CURRICULUM",
    };
  if (n.includes("math"))
    return {
      icon: Calculator,
      description: isUrdu
        ? "جمع اور تفریق میں مہارت حاصل کریں، ہندسی اشکال دریافت کریں، اور اپنی منطقی سوچ کو مضبوط بنائیں۔"
        : "Master addition and subtraction, explore geometric shapes, and strengthen your logical reasoning.",
      cardBg: "linear-gradient(145deg,#ECFDF5 0%,#D1FAE5 100%)",
      iconBg: "#D1FAE5", iconColor: "#065F46",
      accentColor: "#065F46", lessonPillBg: "#A7F3D0", tag: "CURRICULUM",
    };
  if (n.includes("science") || n.includes("bio") || n.includes("chem"))
    return {
      icon: FlaskConical,
      description: isUrdu
        ? "فطرت کے عجائبات دریافت کریں، سادہ تجربات کریں، اور جانیں کہ یہ دنیا کیسے کام کرتی ہے۔"
        : "Explore the wonders of nature, conduct simple experiments, and discover how the world works.",
      cardBg: "linear-gradient(145deg,#EFF6FF 0%,#DBEAFE 100%)",
      iconBg: "#DBEAFE", iconColor: "#1D4ED8",
      accentColor: "#1D4ED8", lessonPillBg: "#BFDBFE", tag: "CURRICULUM",
    };
  if (n.includes("social") || n.includes("pak") || n.includes("civics"))
    return {
      icon: Globe,
      description: isUrdu
        ? "ہمارے ارد گرد کی حیرت انگیز دنیا دریافت کریں — جانور، خلا، جغرافیہ، اور تاریخ۔"
        : "Discover the amazing world around us — animals, space, geography, and history.",
      cardBg: "linear-gradient(145deg,#EEF2FF 0%,#E0E7FF 100%)",
      iconBg: "#E0E7FF", iconColor: "#4338CA",
      accentColor: "#4338CA", lessonPillBg: "#C7D2FE", tag: "CURRICULUM",
    };
  if (n.includes("islamic") || n.includes("quran") || n.includes("din"))
    return {
      icon: Landmark,
      description: isUrdu
        ? "مضبوط اخلاقی اقدار پیدا کریں، اسلامی تعلیمات سیکھیں، اور ایمان اور کردار کے ساتھ پروان چڑھیں۔"
        : "Build strong moral values, learn Islamic teachings, and grow with faith and character.",
      cardBg: "linear-gradient(145deg,#F0FDF4 0%,#DCFCE7 100%)",
      iconBg: "#DCFCE7", iconColor: "#166534",
      accentColor: "#166534", lessonPillBg: "#BBF7D0", tag: "CURRICULUM",
    };
  if (n.includes("computer") || n.includes("ict") || n.includes("tech"))
    return {
      icon: Cpu,
      description: isUrdu
        ? "کمپیوٹر کی بنیادی باتیں، ٹائپنگ، اور ڈیجیٹل خواندگی ایک دلچسپ انداز میں سیکھیں۔"
        : "Learn the basics of computers, typing, and digital literacy in a fun interactive way.",
      cardBg: "linear-gradient(145deg,#F5F3FF 0%,#EDE9FE 100%)",
      iconBg: "#EDE9FE", iconColor: "#6D28D9",
      accentColor: "#6D28D9", lessonPillBg: "#DDD6FE", tag: "CURRICULUM",
    };
  if (n.includes("general") || n.includes("knowledge") || n.includes("gk"))
    return {
      icon: Globe,
      description: isUrdu
        ? "ہمارے ارد گرد کی حیرت انگیز دنیا دریافت کریں — جانور، خلا، اور سائنس۔"
        : "Discover the amazing world around us — animals, space, and science.",
      cardBg: "linear-gradient(145deg,#EEF2FF 0%,#E0E7FF 100%)",
      iconBg: "#E0E7FF", iconColor: "#3730A3",
      accentColor: "#3730A3", lessonPillBg: "#C7D2FE", tag: "CURRICULUM",
    };
  return {
    icon: BookOpen,
    description: isUrdu
      ? "پرائمری طلباء کے لیے اعلیٰ معیار کا تعلیمی مواد۔"
      : "High-quality educational content designed for primary students.",
    cardBg: "linear-gradient(145deg,#F8FAFC 0%,#F1F5F9 100%)",
    iconBg: "#E2E8F0", iconColor: "#475569",
    accentColor: "#475569", lessonPillBg: "#CBD5E1", tag: "CURRICULUM",
  };
};

const getLectureCount = (
  subjectId: number,
  chapters: any[],
  chapterVideos: Record<number, any[]>,
  loading: boolean
): { count: number; isLoading: boolean } => {
  const subjectChapters = chapters.filter((c: any) => c.subject_id === subjectId);
  const inFlight =
    subjectChapters.length > 0 &&
    subjectChapters.every((c: any) => !(c.id in chapterVideos));
  if (loading || inFlight) return { count: 0, isLoading: true };
  let count = 0;
  subjectChapters.forEach((c: any) => {
    count += (chapterVideos[c.id] || []).length;
  });
  return { count, isLoading: false };
};

/* ── Subject Card ── */
const PrimarySubjectCard = ({
  subject, classInfo, gradeType, navigate, isUrdu, index, lectureCount, lectureLoading,
}: {
  subject: any; classInfo: any; gradeType: string;
  navigate: ReturnType<typeof useNavigate>; isUrdu: boolean; index: number;
  lectureCount: number; lectureLoading: boolean;
}) => {
  const meta = getPrimaryMeta(subject.name, isUrdu);
  const Icon = meta.icon;
  const title = isUrdu ? subject.urdu_name || subject.name : subject.name;

  const goToSubject = () =>
    navigate(`/class/${classInfo?.id}/subject/${subject.id}`, {
      state: { gradeType, selectedSubject: subject, classTitle: classInfo?.name },
    });

  const lessonLabel = lectureLoading
    ? "Loading..."
    : lectureCount > 0
    ? `${lectureCount} Lessons`
    : "Coming Soon";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      onClick={goToSubject}
      className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col"
      style={{ background: meta.cardBg, border: "1.5px solid rgba(0,0,0,0.06)" }}
    >
      <div className="flex flex-col gap-4 p-6 flex-1">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: "#ffffff" }}
        >
          <Icon size={26} style={{ color: meta.iconColor }} strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <h3
            className={`text-[20px] font-black text-[#0F172A] leading-snug mb-2 ${isUrdu ? "text-right" : ""}`}
          >
            {title}
          </h3>
          <p
            className={`text-[13.5px] text-slate-500 leading-relaxed line-clamp-3 ${isUrdu ? "text-right" : ""}`}
          >
            {meta.description}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              {meta.tag}
            </span>
            <span
              className="text-[13px] font-bold px-3 py-1 rounded-full inline-block"
              style={{ background: meta.lessonPillBg, color: meta.iconColor }}
            >
              {lessonLabel}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); goToSubject(); }}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
            style={{ background: meta.accentColor }}
          >
            <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Fun Games Card ── */
const FunGamesCard = ({
  navigate, isUrdu, index,
}: {
  navigate: ReturnType<typeof useNavigate>; isUrdu: boolean; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.06 }}
    onClick={() => navigate("/games")}
    className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col"
    style={{
      background: "linear-gradient(145deg,#EEF2FF 0%,#E0E7FF 100%)",
      border: "1.5px solid rgba(0,0,0,0.06)",
    }}
  >
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ background: "#ffffff" }}
      >
        <Gamepad2 size={26} style={{ color: "#3730A3" }} strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <h3
          className={`text-[20px] font-black text-[#0F172A] leading-snug mb-2 ${isUrdu ? "text-right" : ""}`}
        >
          {isUrdu ? "تفریحی کھیل" : "Fun Games"}
        </h3>
        <p className={`text-[13.5px] text-slate-500 leading-relaxed ${isUrdu ? "text-right" : ""}`}>
          {isUrdu
            ? "دماغی کھیل جو یادداشت اور مسئلہ حل کرنے کی مہارت کو بہتر بناتے ہیں۔"
            : "Interactive brain games designed to improve memory and problem-solving skills."}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            INTERACTIVE
          </span>
          <span
            className="text-[13px] font-bold px-3 py-1 rounded-full inline-block"
            style={{ background: "#C7D2FE", color: "#3730A3" }}
          >
            {isUrdu ? "۱۵+ کھیل" : "15+ Games"}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); navigate("/games"); }}
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
          style={{ background: "#3730A3" }}
        >
          <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  </motion.div>
);

/* ── Daily Quizzes Card ── */
const DailyQuizzesCard = ({
  navigate, isUrdu, classId, gradeType, index,
}: {
  navigate: ReturnType<typeof useNavigate>; isUrdu: boolean;
  classId: string | undefined; gradeType: string | undefined; index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.06 }}
    onClick={() => navigate(`/class/${classId}/quiz`, { state: { gradeType } })}
    className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col"
    style={{
      background: "linear-gradient(145deg,#FFF1F2 0%,#FFE4E6 100%)",
      border: "1.5px solid rgba(0,0,0,0.06)",
    }}
  >
    <div className="flex flex-col gap-4 p-6 flex-1">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ background: "#ffffff" }}
      >
        <HelpCircle size={26} style={{ color: "#BE123C" }} strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <h3
          className={`text-[20px] font-black text-[#0F172A] leading-snug mb-2 ${isUrdu ? "text-right" : ""}`}
        >
          {isUrdu ? "روزانہ کوئز" : "Daily Quizzes"}
        </h3>
        <p className={`text-[13.5px] text-slate-500 leading-relaxed ${isUrdu ? "text-right" : ""}`}>
          {isUrdu
            ? "رنگین کوئز سے اپنی معلومات جانچیں اور ڈیجیٹل بیج حاصل کریں۔"
            : "Test your knowledge with colorful quizzes and earn exciting digital badges."}
        </p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            ASSESSMENT
          </span>
          <span
            className="text-[13px] font-bold px-3 py-1 rounded-full inline-block"
            style={{ background: "#FECDD3", color: "#BE123C" }}
          >
            {isUrdu ? "روزانہ نیا" : "New Daily"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/class/${classId}/quiz`, { state: { gradeType } });
          }}
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
          style={{ background: "#BE123C" }}
        >
          <Star size={18} color="#ffffff" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  </motion.div>
);

/* ── AI Tutor Card ── */
const AiTutorCard = ({
  navigate, isUrdu,
}: {
  navigate: ReturnType<typeof useNavigate>; isUrdu: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: 0.5 }}
    className="rounded-3xl overflow-hidden flex flex-col p-6 gap-4"
    style={{ background: "#1E293B", border: "1.5px solid rgba(255,255,255,0.08)" }}
  >
    <div className="w-14 h-14 rounded-2xl bg-[#334155] flex items-center justify-center">
      <Sparkles size={26} className="text-white" strokeWidth={1.8} />
    </div>
    <div className="flex-1">
      <h3
        className={`text-[20px] font-black text-white leading-snug mb-2 ${isUrdu ? "text-right" : ""}`}
      >
        {isUrdu ? "اے آئی ٹیوٹر" : "AI Tutor"}
      </h3>
      <p
        className={`text-[13.5px] text-slate-400 leading-relaxed ${isUrdu ? "text-right" : ""}`}
      >
        {isUrdu
          ? "اے آئی کی مدد سے ذاتی سیکھنے کے راستے جو بچوں کو اپنی رفتار سے مضامین میں مہارت حاصل کرنے میں مدد دیتے ہیں۔"
          : "Personalized learning paths powered by AI to help children master subjects at their own pace."}
      </p>
    </div>
    <button
      onClick={() => navigate("/ai")}
      className="mt-2 bg-white text-[#1E293B] font-bold text-[14px] py-2.5 px-6 rounded-xl hover:bg-slate-100 transition-colors w-fit"
    >
      {isUrdu ? "چیٹ شروع کریں" : "Start Chat"}
    </button>
  </motion.div>
);

/* ── Skeleton ── */
const CardSkeleton = ({ index }: { index: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, delay: index * 0.04 }}
    className="rounded-3xl bg-slate-100 animate-pulse overflow-hidden flex flex-col p-6 gap-4"
    style={{ minHeight: 260 }}
  >
    <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
    <div>
      <div className="h-5 bg-slate-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-slate-200 rounded w-full mb-1" />
      <div className="h-3 bg-slate-200 rounded w-3/4" />
    </div>
    <div className="mt-auto flex justify-between items-center">
      <div className="h-7 w-24 bg-slate-200 rounded-full" />
      <div className="w-11 h-11 bg-slate-200 rounded-full" />
    </div>
  </motion.div>
);

/* ── Full-page skeleton shown on first load to prevent flash ── */
const PageSkeleton = ({ isUrdu }: { isUrdu: boolean }) => (
  <div
    className="min-h-screen"
    style={{
      background: "#F8FAFC",
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      direction: isUrdu ? "rtl" : "ltr",
    }}
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-7">
        <div className="h-3 w-12 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-2 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-2 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
      </div>
      {/* Header skeleton */}
      <div className="mb-9">
        <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse mb-3" />
        <div className="h-4 w-80 bg-slate-200 rounded animate-pulse" />
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const PrimarySubjectsView = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const gradeType = location.state?.gradeType as string | undefined;

  const { t, lang } = useTranslation();
  const isUrdu = lang === "ur";

  const { classInfo, subjects, chapterVideos, chapters, loading } =
    useClassSubjects(Number(classId));

  // ✅ FIX 1: Track whether we've ever finished loading.
  // This prevents AnimatePresence from ever needing to swap between
  // skeleton and content — we render skeletons until ready, then
  // switch once and stay on the content view.
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Small delay so the data is fully settled before we swap views,
      // preventing any layout flash on slower devices.
      const t = setTimeout(() => setHasLoaded(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const gradeName = useMemo(() => {
    if (!classInfo) return `Class ${classId}`;
    if (!isUrdu) return classInfo.name || `Class ${classId}`;
    const apiUrdu = classInfo.urdu_name?.trim();
    if (apiUrdu) return apiUrdu;
    const numMatch = (classInfo.name || "").match(/\d+/);
    if (numMatch) return `جماعت ${numMatch[0]}`;
    return classInfo.name || `Class ${classId}`;
  }, [classInfo, isUrdu, classId]);

  const sortedSubjects = useMemo(() => {
    return [...subjects].sort((a: any, b: any) => {
      const rank = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes("english")) return 0;
        if (n.includes("urdu")) return 1;
        if (n.includes("math")) return 2;
        return 3;
      };
      return rank(a.name) - rank(b.name);
    });
  }, [subjects]);

  // ✅ FIX 2: Show a static full-page skeleton on first load.
  // No AnimatePresence, no overlapping motion divs, no glitch.
  if (!hasLoaded) {
    return <PageSkeleton isUrdu={isUrdu} />;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F8FAFC",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        direction: isUrdu ? "rtl" : "ltr",
      }}
    >
      {/* ✅ FIX 3: Single fade-in on the whole page after load — no
          competing animations, no overlapping motion divs. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10"
      >
        {/* Breadcrumb */}
        <div className="text-sm text-slate-400 flex items-center gap-2 mb-7">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            {isUrdu ? "ہوم" : "Home"}
          </Link>
          <span>›</span>
          <Link
            to="/grade-view/1-5"
            className="hover:text-slate-600 transition-colors"
          >
            {isUrdu ? "گریڈ ۱-۵" : "Grades 1–5"}
          </Link>
          <span>›</span>
          <span className="text-slate-700 font-semibold">{gradeName}</span>
        </div>

        {/* Header */}
        <div className="mb-9">
          <h1 className="text-[36px] font-black text-[#0F172A] tracking-tight leading-none mb-3">
            {gradeName}
          </h1>
          <p className="text-slate-500 text-[15px] max-w-xl">
            {isUrdu
              ? `${gradeName} کے مضامین دریافت کریں اور اپنی سیکھنے کی مہم جوئی شروع کریں۔`
              : `Explore your subjects and start your learning adventure for ${gradeName}. Interactive lessons designed to help you excel.`}
          </p>
        </div>

        {/* ✅ FIX 4: No AnimatePresence at all — just a plain conditional.
            Each card has its own staggered entrance animation.
            Nothing unmounts/remounts during the session. */}
        {sortedSubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-slate-400">
            <GraduationCap size={52} strokeWidth={1} className="mb-4" />
            <p className="text-lg font-semibold">
              {isUrdu ? "کوئی مضمون نہیں ملا" : "No subjects found"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {sortedSubjects.map((subject: any, i: number) => {
              const { count, isLoading } = getLectureCount(
                subject.id,
                chapters,
                chapterVideos,
                loading
              );
              return (
                <PrimarySubjectCard
                  key={subject.id}
                  subject={subject}
                  classInfo={classInfo}
                  gradeType={gradeType || "1-5"}
                  navigate={navigate}
                  isUrdu={isUrdu}
                  index={i}
                  lectureCount={count}
                  lectureLoading={isLoading}
                />
              );
            })}

            <FunGamesCard
              navigate={navigate}
              isUrdu={isUrdu}
              index={sortedSubjects.length}
            />
            <DailyQuizzesCard
              navigate={navigate}
              isUrdu={isUrdu}
              classId={classId}
              gradeType={gradeType}
              index={sortedSubjects.length + 1}
            />
            <AiTutorCard navigate={navigate} isUrdu={isUrdu} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PrimarySubjectsView;