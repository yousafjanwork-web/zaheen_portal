import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import owl from "../../../assets/images/owl.png";
import orange from "../../../assets/images/orange.png";
import one from "../../../assets/images/123.png";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Play,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import fallbackThumbnail from "../../../assets/images/physics.png";
// ── AUTH ──────────────────────────────────────────────────────
import { useAuth } from "@/modules/shared/context/AuthContext";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─────────────────────────────────────────────────────────────
   FONT — "cursive" removed so mobile never shows joined glyphs
──────────────────────────────────────────────────────────────── */
const FONT = "'Nunito', 'Fredoka One', sans-serif";

const translations: Record<string, any> = {
  en: enTranslations,
  ur: urTranslations,
};

const getNestedValue = (obj: any, key: string): string => {
  const value = key
    .split(".")
    .reduce((acc: any, part: string) => acc?.[part], obj);
  return typeof value === "string" ? value : key;
};

const useT = () => {
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

  const dict = translations[lang] ?? translations.en;
  return (key: string, vars?: Record<string, string | number>) => {
    let str = getNestedValue(dict, key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{{${k}}}`, String(v));
      });
    }
    return str;
  };
};

/* ─────────────────────────────────────────────────────────────
   CDN helpers
──────────────────────────────────────────────────────────────── */
const CDN_VIDEO = "https://cdn.zaheen.com.pk/videos";
const CDN_THUMB = "https://cdn.zaheen.com.pk";
const VIDEO_THUMB_FIELD = "thumbnailUrl";

const buildVideoUrl = (path: string) => `${CDN_VIDEO}/${path}`;
const buildThumbUrl = (raw?: string): string | null => {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${CDN_THUMB}/${raw.replace(/^\/+/, "")}`;
};

/* ─────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
interface Video {
  id: number;
  name: string;
  urdu_name?: string;
  path: string;
  desc?: string;
  urdu_desc?: string;
  thumbnail?: string;
  thumb?: string;
  image?: string;
  cover?: string;
  poster?: string;
  [key: string]: any;
}
interface ChapterWithVideos {
  id: number;
  name: string;
  urdu_name?: string;
  subject_id: number;
  videos: Video[];
}

type HeroVariant = "english" | "urdu" | "math" | "default";

interface SubjectTheme {
  variant: HeroVariant;
  heroBg: string;
  heroBgHex: string;
  heroTextColor: string;
  heroBreadcrumb: string;
  heroImage?: string;
  mascotFallback: string;
  progressAccent: string;
  cardBorderColor: string;
  taglineKey: string;
  accentHex: string;
  lectureColors: string[];
  badgeKey?: string;
  badgeColor?: string;
}

const getTheme = (name: string): SubjectTheme => {
  const n = name.toLowerCase();

  if (n.includes("english"))
    return {
      variant: "english",
      heroBg: "#C7D2FE",
      heroBgHex: "#C7D2FE",
      heroTextColor: "text-slate-900",
      heroBreadcrumb: "text-slate-600",
      heroImage: owl,
      mascotFallback: "🦉",
      progressAccent: "#4F46E5",
      cardBorderColor: "#10B981",
      taglineKey: "kgLectureView.taglines.english",
      accentHex: "#4F46E5",
      badgeKey: "kgLectureView.hero.kgBadge",
      badgeColor: "#10B981",
      lectureColors: [
        "bg-[#6EE7B7] text-green-900",
        "bg-[#BFDBFE] text-blue-900",
        "bg-[#FED7AA] text-orange-900",
        "bg-[#DDD6FE] text-purple-900",
      ],
    };

  if (n.includes("urdu"))
    return {
      variant: "urdu",
      heroBg: "#F97316",
      heroBgHex: "#F97316",
      heroTextColor: "text-white",
      heroBreadcrumb: "text-orange-100",
      heroImage: orange,
      mascotFallback: "✍️",
      progressAccent: "#16A34A",
      cardBorderColor: "#F97316",
      taglineKey: "kgLectureView.taglines.urdu",
      accentHex: "#EA580C",
      lectureColors: [
        "bg-[#FED7AA] text-orange-900",
        "bg-[#FEF3C7] text-yellow-900",
        "bg-[#FCE7F3] text-pink-900",
        "bg-[#FFEDD5] text-orange-900",
      ],
    };

  if (n.includes("math"))
    return {
      variant: "math",
      heroBg: "#BBF7D0",
      heroBgHex: "#BBF7D0",
      heroTextColor: "text-slate-900",
      heroBreadcrumb: "text-green-700",
      heroImage: one,
      mascotFallback: "🔢",
      progressAccent: "#16A34A",
      cardBorderColor: "#10B981",
      taglineKey: "kgLectureView.taglines.math",
      accentHex: "#059669",
      lectureColors: [
        "bg-[#BBF7D0] text-green-900",
        "bg-[#A7F3D0] text-emerald-900",
        "bg-[#D1FAE5] text-green-900",
        "bg-[#ECFDF5] text-green-900",
      ],
    };

  if (n.includes("islamic"))
    return {
      variant: "default",
      heroBg: "#0D9488",
      heroBgHex: "#0D9488",
      heroTextColor: "text-white",
      heroBreadcrumb: "text-teal-100",
      mascotFallback: "🌙",
      progressAccent: "#0D9488",
      cardBorderColor: "#0D9488",
      taglineKey: "kgLectureView.taglines.islamic",
      accentHex: "#0D9488",
      lectureColors: [
        "bg-[#CCFBF1] text-teal-900",
        "bg-[#99F6E4] text-teal-900",
        "bg-[#A7F3D0] text-green-900",
        "bg-[#BAE6FD] text-sky-900",
      ],
    };

  if (n.includes("pakistan"))
    return {
      variant: "default",
      heroBg: "#FDE68A",
      heroBgHex: "#FDE68A",
      heroTextColor: "text-slate-900",
      heroBreadcrumb: "text-yellow-700",
      mascotFallback: "🌍",
      progressAccent: "#D97706",
      cardBorderColor: "#D97706",
      taglineKey: "kgLectureView.taglines.pakistan",
      accentHex: "#D97706",
      lectureColors: [
        "bg-[#FDE68A] text-yellow-900",
        "bg-[#FED7AA] text-orange-900",
        "bg-[#FEF3C7] text-yellow-900",
        "bg-[#FFEDD5] text-orange-900",
      ],
    };

  if (n.includes("computer") || n.includes("cs"))
    return {
      variant: "default",
      heroBg: "#4338CA",
      heroBgHex: "#4338CA",
      heroTextColor: "text-white",
      heroBreadcrumb: "text-indigo-200",
      mascotFallback: "🤖",
      progressAccent: "#4338CA",
      cardBorderColor: "#4338CA",
      taglineKey: "kgLectureView.taglines.computer",
      accentHex: "#4338CA",
      lectureColors: [
        "bg-[#E0E7FF] text-indigo-900",
        "bg-[#C7D2FE] text-indigo-900",
        "bg-[#DDD6FE] text-purple-900",
        "bg-[#EDE9FE] text-violet-900",
      ],
    };

  return {
    variant: "default",
    heroBg: "#4F46E5",
    heroBgHex: "#4F46E5",
    heroTextColor: "text-white",
    heroBreadcrumb: "text-indigo-200",
    mascotFallback: "📚",
    progressAccent: "#4F46E5",
    cardBorderColor: "#4F46E5",
    taglineKey: "kgLectureView.taglines.default",
    accentHex: "#4F46E5",
    lectureColors: [
      "bg-[#E0E7FF] text-indigo-900",
      "bg-[#C7D2FE] text-indigo-900",
      "bg-[#DDD6FE] text-purple-900",
      "bg-[#EDE9FE] text-violet-900",
    ],
  };
};

const ProgressBar = ({
  pct,
  progressAccent,
}: {
  pct: number;
  progressAccent: string;
  variant?: "full" | "compact" | "embedded";
}) => (
  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
      className="h-full rounded-full"
      style={{ backgroundColor: progressAccent }}
    />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   HERO — ENGLISH
═══════════════════════════════════════════════════════════ */
const HeroEnglish = ({
  subjectName,
  gradeName,
  theme,
  totalVideos,
  watchedCount,
  isRtl,
  onBack,
  onBreadcrumbGradeClick,
  t,
}: {
  subjectName: string;
  gradeName: string;
  theme: SubjectTheme;
  totalVideos: number;
  watchedCount: number;
  isRtl: boolean;
  onBack: () => void;
  onBreadcrumbGradeClick: () => void;
  t: ReturnType<typeof useT>;
}) => {
  const pct =
    totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const completedTxt = `${watchedCount} ${t("kgLectureView.progress.lessonsCompleted")}`;
  const tagline = t(theme.taglineKey);
  const badgeLabel = theme.badgeKey ? t(theme.badgeKey) : undefined;

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8 pt-6 max-w-[1070px] mx-auto">
      <p className="text-[13px] font-semibold mb-6 text-slate-500">
        <span
          className="cursor-pointer hover:underline hover:text-slate-800 transition-colors"
          onClick={onBack}
        >
          {t("kgLectureView.home")}
        </span>
        &nbsp;›&nbsp;
        <span
          className="cursor-pointer hover:underline hover:text-slate-800 transition-colors"
          onClick={onBreadcrumbGradeClick}
        >
          {gradeName || t("kgClassView.defaultGrade")}
        </span>
      </p>

      <div
        className="relative rounded-[32px] overflow-hidden px-8 sm:px-12 py-12 md:py-16 flex flex-col sm:flex-row items-center justify-between gap-8"
        style={{ backgroundColor: theme.heroBgHex, minHeight: 340 }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {badgeLabel && (
            <span
              className="inline-flex items-center self-start px-4 py-1.5 rounded-full text-[12px] font-black text-white mb-5 shadow-sm"
              style={{
                backgroundColor: theme.badgeColor || theme.accentHex,
                fontFamily: FONT,
              }}
            >
              {badgeLabel}
            </span>
          )}
          <h1
            className="text-[36px] sm:text-[46px] md:text-[54px] font-black leading-tight text-slate-900 mb-4"
            style={{ fontFamily: FONT }}
          >
            {subjectName}
          </h1>
          <p
            className={`text-[15px] sm:text-[17px] text-slate-700 leading-relaxed max-w-xl mb-8 ${isRtl ? "text-right" : ""}`}
          >
            {tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[14px] font-bold text-slate-700 shadow-sm border border-slate-100"
              style={{ fontFamily: FONT }}
            >
              <BookOpen size={15} className="text-indigo-500" />
              {totalVideos} {t("kgLectureView.hero.lessons")}
            </span>
            <span
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[14px] font-bold text-slate-700 shadow-sm border border-slate-100"
              style={{ fontFamily: FONT }}
            >
              <Clock size={15} className="text-indigo-500" />
              {t("kgLectureView.hero.hoursVideo")}
            </span>
          </div>
        </div>

        <div className="relative z-10 shrink-0 flex items-center justify-center">
          {theme.heroImage ? (
            <div
              className="w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] rounded-[28px] overflow-hidden shadow-xl bg-white"
              style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
            >
              <img
                src={theme.heroImage}
                alt={subjectName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="text-[130px] leading-none select-none"
              style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
            >
              {theme.mascotFallback}
            </div>
          )}
        </div>
      </div>

      {totalVideos > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-100 px-8 py-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="text-[16px] font-black text-slate-800"
              style={{ fontFamily: FONT }}
            >
              {t("kgLectureView.progress.journeyTitle")}
            </p>
            <p
              className="text-[15px] font-black"
              style={{ color: theme.progressAccent, fontFamily: FONT }}
            >
              {pct}% {t("kgLectureView.progress.completed")}
            </p>
          </div>
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.5 }}
              className="h-full rounded-full"
              style={{ backgroundColor: theme.progressAccent }}
            />
          </div>
          <p className="text-[13px] text-slate-400 font-medium mt-2">
            {completedTxt}
          </p>
        </motion.div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HERO — URDU
═══════════════════════════════════════════════════════════ */
const HeroUrdu = ({
  subjectName,
  gradeName,
  theme,
  totalVideos,
  watchedCount,
  isRtl,
  onBack,
  onBreadcrumbGradeClick,
  t,
}: {
  subjectName: string;
  gradeName: string;
  theme: SubjectTheme;
  totalVideos: number;
  watchedCount: number;
  isRtl: boolean;
  onBack: () => void;
  onBreadcrumbGradeClick: () => void;
  t: ReturnType<typeof useT>;
}) => {
  const pct =
    totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const completedTxt = `${watchedCount} ${t("kgLectureView.progress.lessonsCompleted")}`;
  const tagline = t(theme.taglineKey);

  return (
    <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: theme.heroBgHex }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 pt-10 pb-28">
          <p className="text-[13px] font-semibold mb-6 text-orange-100">
            <span
              className="cursor-pointer hover:underline hover:text-white transition-colors"
              onClick={onBack}
            >
              {t("kgLectureView.home")}
            </span>
            &nbsp;›&nbsp;
            <span
              className="cursor-pointer hover:underline hover:text-white transition-colors"
              onClick={onBreadcrumbGradeClick}
            >
              {gradeName || t("kgClassView.defaultGrade")}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex-1 min-w-0">
              <h1
                className="text-[38px] sm:text-[52px] font-black leading-none tracking-tight mb-4 text-white"
                style={{ fontFamily: FONT }}
              >
                {subjectName}
              </h1>
              <p
                className={`text-[15px] leading-relaxed max-w-md text-white opacity-90 ${isRtl ? "text-right" : ""}`}
              >
                {tagline}
              </p>
            </div>
            <div className="shrink-0">
              {theme.heroImage ? (
                <div
                  className="w-[220px] sm:w-[280px] lg:w-[310px] rounded-[20px] overflow-hidden shadow-2xl"
                  style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
                >
                  <img
                    src={theme.heroImage}
                    alt={subjectName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="text-[110px] leading-none select-none"
                  style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
                >
                  {theme.mascotFallback}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 70"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-[70px] sm:h-[90px]"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,70 L0,70 Z"
              fill="#F1F5F9"
            />
          </svg>
        </div>
      </div>

      {totalVideos > 0 && (
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 -mt-1">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 px-6 py-5"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${theme.progressAccent}18` }}
                >
                  <BookOpen size={18} style={{ color: theme.progressAccent }} />
                </div>
                <div>
                  <p
                    className="text-[15px] font-black text-slate-800 leading-tight"
                    style={{ fontFamily: FONT }}
                  >
                    {t("kgLectureView.progress.journeyTitle")}
                  </p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                    {completedTxt}
                  </p>
                </div>
              </div>
              <p
                className="text-[14px] font-black shrink-0"
                style={{ color: theme.progressAccent, fontFamily: FONT }}
              >
                {pct}% {t("kgLectureView.progress.done")}
              </p>
            </div>
            <ProgressBar pct={pct} progressAccent={theme.progressAccent} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HERO — MATH
═══════════════════════════════════════════════════════════ */
const HeroMath = ({
  subjectName,
  gradeName,
  theme,
  totalVideos,
  watchedCount,
  isRtl,
  onBack,
  onBreadcrumbGradeClick,
  t,
}: {
  subjectName: string;
  gradeName: string;
  theme: SubjectTheme;
  totalVideos: number;
  watchedCount: number;
  isRtl: boolean;
  onBack: () => void;
  onBreadcrumbGradeClick: () => void;
  t: ReturnType<typeof useT>;
}) => {
  const pct =
    totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const completedTxt = `${watchedCount} ${t("kgLectureView.progress.activitiesCompleted")}`;
  const tagline = t(theme.taglineKey);

  return (
    <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: theme.heroBgHex, minHeight: 420 }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.6) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 pt-10 pb-12">
          <p className="text-[13px] font-semibold mb-8 text-green-700">
            <span
              className="cursor-pointer hover:underline hover:text-green-900 transition-colors"
              onClick={onBack}
            >
              {t("kgLectureView.home")}
            </span>
            &nbsp;›&nbsp;
            <span
              className="cursor-pointer hover:underline hover:text-green-900 transition-colors"
              onClick={onBreadcrumbGradeClick}
            >
              {gradeName || t("kgClassView.defaultGrade")}
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-10 sm:gap-6">
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid
                  size={16}
                  style={{ color: theme.accentHex }}
                  strokeWidth={2.5}
                />
                <p
                  className="text-[11px] font-black uppercase tracking-[0.18em]"
                  style={{ color: theme.accentHex, fontFamily: FONT }}
                >
                  {t("kgLectureView.hero.mathematics")}
                </p>
              </div>
              <h1
                className="text-[36px] sm:text-[48px] font-black leading-tight text-slate-900 mb-4"
                style={{ fontFamily: FONT }}
              >
                {subjectName}
              </h1>
              <p
                className={`text-[15px] text-slate-700 leading-relaxed max-w-sm mb-7 ${isRtl ? "text-right" : ""}`}
              >
                {tagline}
              </p>

              {totalVideos > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-md border border-slate-100 px-6 py-5 max-w-[380px]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[15px] font-black text-slate-800"
                      style={{ fontFamily: FONT }}
                    >
                      {t("kgLectureView.progress.journeyTitle")}
                    </p>
                    <p
                      className="text-[14px] font-black"
                      style={{ color: theme.progressAccent, fontFamily: FONT }}
                    >
                      {pct}%
                    </p>
                  </div>
                  <ProgressBar
                    pct={pct}
                    progressAccent={theme.progressAccent}
                  />
                  <p className="text-[12px] text-slate-500 flex items-center gap-1.5 mt-3">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    {completedTxt}
                  </p>
                </motion.div>
              )}
            </div>

            <div className="shrink-0 flex items-center justify-center">
              {theme.heroImage ? (
                <div
                  className="w-[260px] sm:w-[340px] lg:w-[380px] rounded-[24px] overflow-hidden shadow-2xl bg-white/40"
                  style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
                >
                  <img
                    src={theme.heroImage}
                    alt={subjectName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="text-[120px] leading-none select-none"
                  style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
                >
                  {theme.mascotFallback}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-6"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(0,0,0,0.04))",
          }}
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   HERO — DEFAULT
═══════════════════════════════════════════════════════════ */
const HeroDefault = ({
  subjectName,
  gradeName,
  theme,
  totalVideos,
  watchedCount,
  isRtl,
  onBack,
  t,
}: {
  subjectName: string;
  gradeName: string;
  theme: SubjectTheme;
  totalVideos: number;
  watchedCount: number;
  isRtl: boolean;
  onBack: () => void;
  t: ReturnType<typeof useT>;
}) => {
  const pct =
    totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;
  const completedTxt = `${watchedCount} ${t("kgLectureView.progress.lessonsCompleted")}`;
  const tagline = t(theme.taglineKey);

  return (
    <div className="mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: theme.heroBgHex }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 pt-10 pb-28 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex-1 min-w-0">
            <button
              onClick={onBack}
              className={`flex items-center gap-1.5 text-[13px] font-bold mb-5 transition-opacity hover:opacity-70 ${theme.heroBreadcrumb}`}
            >
              <ArrowLeft size={15} strokeWidth={2.5} />
              {t("kgLectureView.back.toSubjects")}
            </button>
            <p
              className={`text-[13px] font-semibold mb-5 ${theme.heroBreadcrumb}`}
            >
              {t("kgLectureView.home")} &nbsp;›&nbsp;{" "}
              {gradeName || t("kgClassView.defaultGrade")}
            </p>
            <h1
              className={`text-[38px] sm:text-[52px] font-black leading-none tracking-tight mb-5 ${theme.heroTextColor}`}
              style={{ fontFamily: FONT }}
            >
              {subjectName}
            </h1>
            <p
              className={`text-[16px] leading-relaxed max-w-md ${theme.heroTextColor} opacity-90 ${isRtl ? "text-right" : ""}`}
            >
              {tagline}
            </p>
          </div>
          <div className="shrink-0">
            {theme.heroImage ? (
              <div
                className="w-[240px] sm:w-[300px] lg:w-[320px] rounded-[20px] overflow-hidden shadow-2xl"
                style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
              >
                <img
                  src={theme.heroImage}
                  alt={subjectName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="text-[120px] leading-none select-none"
                style={{ animation: "kgHeroFloat 3.5s ease-in-out infinite" }}
              >
                {theme.mascotFallback}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="w-full h-[60px] sm:h-[80px]"
          >
            <path
              d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"
              fill="#F1F5F9"
            />
          </svg>
        </div>
      </div>

      {totalVideos > 0 && (
        <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 -mt-1">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 px-6 py-5"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${theme.progressAccent}18` }}
                >
                  <BookOpen size={18} style={{ color: theme.progressAccent }} />
                </div>
                <div>
                  <p
                    className="text-[15px] font-black text-slate-800 leading-tight"
                    style={{ fontFamily: FONT }}
                  >
                    {t("kgLectureView.progress.journeyTitle")}
                  </p>
                  <p className="text-[12px] text-slate-400 font-medium mt-0.5">
                    {completedTxt}
                  </p>
                </div>
              </div>
              <p
                className="text-[14px] font-black shrink-0"
                style={{ color: theme.progressAccent, fontFamily: FONT }}
              >
                {pct}% {t("kgLectureView.progress.done")}
              </p>
            </div>
            <ProgressBar pct={pct} progressAccent={theme.progressAccent} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Video Card
──────────────────────────────────────────────────────────────── */
const VideoCard = ({
  video,
  index,
  isWatched,
  progress,
  isPlaying,
  theme,
  isRtl,
  onClick,
  t,
}: {
  video: Video;
  index: number;
  isWatched: boolean;
  progress: number;
  isPlaying: boolean;
  theme: SubjectTheme;
  isRtl: boolean;
  onClick: () => void;
  t: ReturnType<typeof useT>;
}) => {
  const title = isRtl ? video.urdu_name || video.name : video.name;
  const descRaw = isRtl ? video.urdu_desc || video.desc : video.desc;
  const shortDesc = descRaw?.split("|")[0]?.trim() || "";
  const pillColor =
    theme.lectureColors[(index - 1) % theme.lectureColors.length];

  const rawThumb =
    video[VIDEO_THUMB_FIELD] ||
    video.thumb ||
    video.image ||
    video.cover ||
    video.poster ||
    null;
  const thumbSrc = buildThumbUrl(rawThumb) ?? fallbackThumbnail;

  // index is 1-based; first video = index 1 = free
  const isLocked = index > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index - 1) * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.18 } }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-200"
      style={{
        borderTop: `4px solid ${theme.cardBorderColor}`,
        outline: isPlaying ? `2px solid ${theme.accentHex}` : undefined,
        outlineOffset: isPlaying ? "2px" : undefined,
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-slate-200"
        style={{ aspectRatio: "16/9" }}
      >
        <img
          src={thumbSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackThumbnail;
          }}
        />

        {/* Lock overlay for non-free videos when not logged in */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke={theme.accentHex}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
        )}

        {!isLocked && (
          <>
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110">
                {isWatched ? (
                  <CheckCircle2 size={32} style={{ color: theme.accentHex }} />
                ) : (
                  <Play
                    size={26}
                    style={{ color: theme.accentHex }}
                    fill={theme.accentHex}
                    strokeWidth={0}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {progress > 0 && progress < 100 && !isLocked && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/30">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: theme.accentHex,
              }}
            />
          </div>
        )}
      </div>

      <div className="p-5">
        <h4
          className={`text-[18px] font-black text-slate-900 leading-snug mb-2 ${isRtl ? "text-right" : ""}`}
          style={{ fontFamily: FONT }}
        >
          {title}
        </h4>
        {shortDesc && (
          <p
            className={`text-[14px] text-slate-500 leading-relaxed line-clamp-3 mb-4 ${isRtl ? "text-right" : ""}`}
          >
            {shortDesc}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span
            className={`text-[13px] font-black px-4 py-1.5 rounded-full ${pillColor}`}
            style={{ fontFamily: FONT }}
          >
            {t("kgLectureView.videoCard.lecture")} {index}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-110"
            style={{ backgroundColor: theme.accentHex }}
          >
            {isLocked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            ) : (
              <Play size={15} fill="white" strokeWidth={0} />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Video Player
──────────────────────────────────────────────────────────────── */
const VideoPlayer = ({
  video,
  videoUrl,
  lectureIndex,
  totalLectures,
  theme,
  isRtl,
  gradeName,
  onBack,
  onBreadcrumbGradeClick,
  onEnded,
  onTimeUpdate,
  onLoaded,
  onPlay,
  onClose,
  onNext,
  onPrev,
  videoRef,
  t,
}: {
  video: Video;
  videoUrl: string;
  lectureIndex: number;
  totalLectures: number;
  theme: SubjectTheme;
  isRtl: boolean;
  gradeName: string;
  onBack: () => void;
  onBreadcrumbGradeClick: () => void;
  onEnded: () => void;
  onTimeUpdate: (e: React.SyntheticEvent<HTMLVideoElement>) => void;
  onLoaded: () => void;
  onPlay: () => void;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  t: ReturnType<typeof useT>;
}) => {
  const title = isRtl ? video.urdu_name || video.name : video.name;
  const descRaw = isRtl ? video.urdu_desc || video.desc : video.desc;
  const parts =
    descRaw
      ?.split("|")
      .map((p) => p.trim())
      .filter(Boolean) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="mb-10 px-0"
    >
      <p className="text-[13px] font-semibold mb-4 text-slate-500">
        <span
          className="cursor-pointer hover:underline hover:text-slate-800 transition-colors"
          onClick={onBack}
        >
          {t("kgLectureView.home")}
        </span>
        &nbsp;›&nbsp;
        <span
          className="cursor-pointer hover:underline hover:text-slate-800 transition-colors"
          onClick={onBreadcrumbGradeClick}
        >
          {gradeName || t("kgClassView.defaultGrade")}
        </span>
      </p>

      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
        <div className="aspect-video">
          <video
            ref={videoRef}
            key={videoUrl}
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full"
            onLoadedData={onLoaded}
            onPlay={onPlay}
            onEnded={onEnded}
            onTimeUpdate={onTimeUpdate}
            onError={(e) => console.error("VIDEO ERROR", e)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-4 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-black uppercase tracking-widest mb-1"
              style={{ color: theme.accentHex, fontFamily: FONT }}
            >
              {t("kgLectureView.player.lectureOf", {
                current: lectureIndex,
                total: totalLectures,
              })}
            </p>
            <h2
              className={`text-[20px] font-black text-slate-900 leading-snug mb-2 ${isRtl ? "text-right" : ""}`}
              style={{ fontFamily: FONT }}
            >
              {title}
            </h2>
            {parts[0] && (
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {parts[0]}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3" style={{ direction: "ltr" }}>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-[14px] font-bold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              style={{ fontFamily: FONT }}
            >
              {t("kgLectureView.player.allLessons") || "تمام اسباق"}
            </button>
            <button
              onClick={onPrev}
              disabled={lectureIndex <= 1}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onNext}
              disabled={lectureIndex >= totalLectures}
              className="w-11 h-11 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Chapter Section
──────────────────────────────────────────────────────────────── */
const ChapterSection = ({
  chapter,
  chapterIndex,
  globalOffset,
  selectedVideo,
  watchedSet,
  progressMap,
  theme,
  isRtl,
  onSelect,
  sectionRef,
  t,
}: {
  chapter: ChapterWithVideos;
  chapterIndex: number;
  globalOffset: number;
  selectedVideo: Video | null;
  watchedSet: Set<number>;
  progressMap: Record<number, number>;
  theme: SubjectTheme;
  isRtl: boolean;
  onSelect: (v: Video, globalIdx: number) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  t: ReturnType<typeof useT>;
}) => {
  const chLabel = isRtl ? chapter.urdu_name || chapter.name : chapter.name;
  const watched = chapter.videos.filter((v) => watchedSet.has(v.id)).length;

  return (
    <div
      ref={sectionRef}
      id={`chapter-${chapter.id}`}
      className="mb-12 scroll-mt-4"
    >
      {chapter.name && (
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[12px] font-black shrink-0"
            style={{ backgroundColor: theme.accentHex, fontFamily: FONT }}
          >
            {String(chapterIndex + 1).padStart(2, "0")}
          </div>
          <div>
            <p
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              style={{ fontFamily: FONT }}
            >
              {t("kgLectureView.chapter.label")} {chapterIndex + 1}
            </p>
            <h3
              className={`text-[17px] font-black text-slate-900 leading-tight ${isRtl ? "text-right" : ""}`}
              style={{ fontFamily: FONT }}
            >
              {chLabel}
            </h3>
          </div>
          {watched > 0 && (
            <span className="ml-auto text-[12px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> {watched}/{chapter.videos.length}
            </span>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapter.videos.map((video, localIdx) => {
          const globalIdx = globalOffset + localIdx;
          return (
            <VideoCard
              key={video.id}
              video={video}
              index={globalIdx + 1}
              isWatched={watchedSet.has(video.id)}
              progress={
                watchedSet.has(video.id) ? 100 : progressMap[video.id] || 0
              }
              isPlaying={selectedVideo?.id === video.id}
              theme={theme}
              isRtl={isRtl}
              // ── pass globalIdx so the gate knows if it's the first video ──
              onClick={() => onSelect(video, globalIdx)}
              t={t}
            />
          );
        })}
      </div>
      <div className="mt-10 border-t border-slate-100" />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Skeleton
──────────────────────────────────────────────────────────────── */
const KGLectureSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="h-[320px] bg-slate-200 rounded-none" />
    <div className="max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14">
      <div className="h-20 bg-white rounded-2xl shadow-sm" />
      <div className="h-7 w-40 bg-slate-200 rounded-full mt-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden border-t-4 border-slate-300 bg-white shadow-sm"
          >
            <div className="bg-slate-200" style={{ aspectRatio: "16/9" }} />
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="flex items-center justify-between mt-2">
                <div className="h-7 w-20 bg-slate-200 rounded-full" />
                <div className="w-10 h-10 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const KGLectureView = () => {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // ── AUTH GATE ─────────────────────────────────────────────
  const { isLoggedIn } = useAuth();

  const t = useT();

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
  const isRtl = lang === "ur";

  const gradeType = location.state?.gradeType;
  const selectedSubjectFromState = location.state?.selectedSubject;

  const { classInfo, chapters, chapterVideos, subjects, loading } =
    useClassSubjects(Number(classId));

  const selectedSubject = useMemo(() => {
    if (selectedSubjectFromState) return selectedSubjectFromState;
    return (
      subjects?.find((s: any) => String(s.id) === String(subjectId)) ?? null
    );
  }, [selectedSubjectFromState, subjects, subjectId]);

  const subjectRawName = selectedSubject?.name || "";
  const subjectName = isRtl
    ? selectedSubject?.urdu_name || subjectRawName
    : subjectRawName;
  const theme = getTheme(subjectRawName);
  const gradeName =
    (isRtl ? classInfo?.urdu_name : classInfo?.name) || classInfo?.name || "";

  const subjectChapters: ChapterWithVideos[] = useMemo(
    () =>
      chapters
        .filter((c: any) => String(c.subject_id) === String(subjectId))
        .map((c: any) => ({ ...c, videos: chapterVideos[c.id] || [] })),
    [chapters, chapterVideos, subjectId],
  );

  const allVideos: Video[] = useMemo(
    () => subjectChapters.flatMap((c) => c.videos),
    [subjectChapters],
  );

  const chapterOffsets: number[] = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    subjectChapters.forEach((c) => {
      offsets.push(acc);
      acc += c.videos.length;
    });
    return offsets;
  }, [subjectChapters]);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [watchedSet, setWatchedSet] = useState<Set<number>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentGlobalIdx = useMemo(
    () => allVideos.findIndex((v) => v.id === selectedVideo?.id),
    [allVideos, selectedVideo],
  );

  const trackEvent = useCallback(
    (eventName: string) => {
      if (!window.gtag || !selectedVideo) return;
      window.gtag("event", eventName, {
        video_id: selectedVideo.id,
        video_name: selectedVideo.name,
      });
    },
    [selectedVideo],
  );

  // ── CENTRAL AUTH GATE ─────────────────────────────────────
  // globalIdx is 0-based. Index 0 = first video = free for everyone.
  // Any other video requires login.
  const selectVideo = useCallback(
    (video: Video, globalIdx: number) => {
      if (globalIdx > 0 && !isLoggedIn) {
        navigate("/login", { state: { from: location.pathname } });
        return;
      }
      setSelectedVideo(video);
      if (videoRef.current) {
        (videoRef.current as any)._tracked50 = false;
        (videoRef.current as any)._started = false;
      }
      setVideoUrl(buildVideoUrl(video.path));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [isLoggedIn, navigate, location.pathname],
  );

  const goNext = useCallback(() => {
    if (currentGlobalIdx < allVideos.length - 1) {
      selectVideo(allVideos[currentGlobalIdx + 1], currentGlobalIdx + 1);
    }
  }, [currentGlobalIdx, allVideos, selectVideo]);

  const goPrev = useCallback(() => {
    if (currentGlobalIdx > 0) {
      selectVideo(allVideos[currentGlobalIdx - 1], currentGlobalIdx - 1);
    }
  }, [currentGlobalIdx, allVideos, selectVideo]);

  const handleLoaded = () => {
    if (!videoRef.current || (videoRef.current as any)._started) return;
    (videoRef.current as any)._started = true;
    trackEvent("video_start");
  };
  const handlePlay = () => {
    if (!(videoRef.current as any)?._started) {
      (videoRef.current as any)._started = true;
      trackEvent("video_start");
    }
  };
  const handleEnded = () => {
    if (selectedVideo) {
      setWatchedSet((p) => new Set(p).add(selectedVideo.id));
      setProgressMap((p) => ({ ...p, [selectedVideo.id]: 100 }));
      trackEvent("video_complete");
    }
    goNext();
  };
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.target as HTMLVideoElement;
    if (!v.duration || !selectedVideo) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgressMap((p) => ({ ...p, [selectedVideo.id]: Math.round(pct) }));
    if (pct > 50 && !(v as any)._tracked50) {
      (v as any)._tracked50 = true;
      trackEvent("video_50_percent");
    }
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev]);

  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  const closePlayer = useCallback(() => {
    setSelectedVideo(null);
    setVideoUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);
  const handleBackToGrade = useCallback(() => {
    navigate(`/class/${classId}`, { state: { gradeType } });
  }, [navigate, classId, gradeType]);

  const renderHero = () => {
    if (loading) return null;
    const commonProps = {
      subjectName,
      gradeName,
      theme,
      totalVideos: allVideos.length,
      watchedCount: watchedSet.size,
      isRtl,
      t,
      onBack: handleBackToHome,
      onBreadcrumbGradeClick: handleBackToGrade,
    };
    switch (theme.variant) {
      case "english":
        return <HeroEnglish {...commonProps} />;
      case "urdu":
        return <HeroUrdu {...commonProps} />;
      case "math":
        return <HeroMath {...commonProps} />;
      default:
        return <HeroDefault {...commonProps} onBack={handleBackToGrade} />;
    }
  };

  const renderVideoLessonsHeading = () => {
    if (loading || subjectChapters.length === 0) return null;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7 mt-2"
      >
        <h2
          className="text-[28px] font-black text-slate-900"
          style={{ fontFamily: FONT }}
        >
          {t("kgLectureView.videoLessons.title")}
          {theme.variant === "math" && (
            <div
              className="h-1 w-16 rounded-full mt-1"
              style={{ backgroundColor: theme.accentHex }}
            />
          )}
        </h2>
        {theme.variant === "math" && (
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold text-white shadow-sm"
              style={{ backgroundColor: theme.accentHex, fontFamily: FONT }}
            >
              <Play size={13} fill="white" strokeWidth={0} />
              {allVideos.length} {t("kgLectureView.videoLessons.lessonsCount")}
            </span>
            <span
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold border border-slate-200 text-slate-600 bg-white shadow-sm"
              style={{ fontFamily: FONT }}
            >
              <Clock size={13} />
              {t("kgLectureView.videoLessons.videoLessonsLabel")}
            </span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section className="bg-[#F1F5F9] min-h-screen overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes kgHeroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }
      `}</style>

      {!selectedVideo && renderHero()}
      {loading && <KGLectureSkeleton />}

      <div
        className={`max-w-[1100px] mx-auto px-6 sm:px-10 lg:px-14 pb-12 ${selectedVideo ? "pt-8" : ""}`}
      >
        {!loading && subjectChapters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">⏳</span>
            <h2
              className="text-2xl font-black text-slate-800 mb-2"
              style={{ fontFamily: FONT }}
            >
              {t("kgLectureView.empty.title")}
            </h2>
            <p className="text-slate-500 text-[14px] max-w-sm">
              {t("kgLectureView.empty.desc", { subject: subjectName })}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedVideo && (
            <VideoPlayer
              key={selectedVideo.id}
              video={selectedVideo}
              videoUrl={videoUrl}
              lectureIndex={currentGlobalIdx + 1}
              totalLectures={allVideos.length}
              theme={theme}
              isRtl={isRtl}
              gradeName={gradeName}
              onBack={handleBackToHome}
              onBreadcrumbGradeClick={handleBackToGrade}
              onEnded={handleEnded}
              onTimeUpdate={handleTimeUpdate}
              onLoaded={handleLoaded}
              onPlay={handlePlay}
              onClose={closePlayer}
              onNext={goNext}
              onPrev={goPrev}
              videoRef={videoRef}
              t={t}
            />
          )}
        </AnimatePresence>

        {!selectedVideo && renderVideoLessonsHeading()}

        {!loading &&
          subjectChapters.map((chapter, chIdx) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              chapterIndex={chIdx}
              globalOffset={chapterOffsets[chIdx]}
              selectedVideo={selectedVideo}
              watchedSet={watchedSet}
              progressMap={progressMap}
              theme={theme}
              isRtl={isRtl}
              onSelect={selectVideo}
              t={t}
              sectionRef={(el) => {
                chapterRefs.current[chIdx] = el;
              }}
            />
          ))}
      </div>
    </section>
  );
};

export default KGLectureView;
