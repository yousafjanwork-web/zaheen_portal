import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { classIdFromSlug } from "../../../config/classSlugs";
import { findSubjectBySlug } from "../../../config/subjectSlug";

import { useParams, useNavigate, useLocation, Link, } from "react-router-dom";
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
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutDashboard,
  FileText,
  ClipboardList,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects, fetchVideoDetail } from "@/modules/shared/hooks/useClassSubjects";
import thumbnail from "../../../assets/images/physics.png";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useVideoProgress } from "../../shared/hooks/Usevideoprogress";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─────────────────────────────────────────────────────────────
   TRANSLATION HELPER
──────────────────────────────────────────────────────────────── */
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
   Types
──────────────────────────────────────────────────────────────── */
interface Video {
  id: number;
  name: string;
  urdu_name?: string;
  path: string;
  desc?: string;
  urdu_desc?: string;
  thumbnail_url?: string;
  thumbnailUrl?: string;
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

/* ─────────────────────────────────────────────────────────────
   CDN thumbnail helper
──────────────────────────────────────────────────────────────── */
const CDN_BASE = "https://cdn.zaheen.com.pk";
const API_BASE = "https://api.zaheen.com.pk";

const buildThumbUrl = (raw?: string): string | null => {
  if (!raw) return null;
  // Swap API domain to CDN domain (thumbnails are served from CDN)
  if (raw.startsWith(API_BASE)) return raw.replace(API_BASE, CDN_BASE);
  // Already a full URL (CDN or other) — return as-is
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // Relative path — prepend CDN base
  return `${CDN_BASE}/${raw.replace(/^\/+/, "")}`;
};

const getThumbUrl = (video: Video): string | null => {
  const raw =
    video.thumbnail_url ||
    video.thumbnailUrl ||
    video.thumbnail ||
    video.thumb ||
    video.image ||
    video.cover ||
    video.poster ||
    null;
  return buildThumbUrl(raw ?? undefined);
};

/* ─────────────────────────────────────────────────────────────
   Subject meta — visual/style only, no text
──────────────────────────────────────────────────────────────── */
const getMeta = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("physic"))
    return {
      icon: Atom,
      color: "text-blue-700",
      bg: "bg-blue-50",
      accent: "#1d4ed8",
      descKey: "subjectLecturesView.subjects.physics",
    };
  if (n.includes("math"))
    return {
      icon: Sigma,
      color: "text-violet-700",
      bg: "bg-violet-50",
      accent: "#7c3aed",
      descKey: "subjectLecturesView.subjects.math",
    };
  if (n.includes("chem"))
    return {
      icon: FlaskConical,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      accent: "#059669",
      descKey: "subjectLecturesView.subjects.chemistry",
    };
  if (n.includes("bio"))
    return {
      icon: Leaf,
      color: "text-green-700",
      bg: "bg-green-50",
      accent: "#16a34a",
      descKey: "subjectLecturesView.subjects.biology",
    };
  if (n.includes("english"))
    return {
      icon: BookOpen,
      color: "text-sky-700",
      bg: "bg-sky-50",
      accent: "#0284c7",
      descKey: "subjectLecturesView.subjects.english",
    };
  if (n.includes("urdu"))
    return {
      icon: Languages,
      color: "text-rose-700",
      bg: "bg-rose-50",
      accent: "#e11d48",
      descKey: "subjectLecturesView.subjects.urdu",
    };
  if (n.includes("islamic"))
    return {
      icon: Landmark,
      color: "text-teal-700",
      bg: "bg-teal-50",
      accent: "#0d9488",
      descKey: "subjectLecturesView.subjects.islamic",
    };
  if (n.includes("pakistan"))
    return {
      icon: Globe,
      color: "text-orange-700",
      bg: "bg-orange-50",
      accent: "#ea580c",
      descKey: "subjectLecturesView.subjects.pakistan",
    };
  if (n.includes("computer") || n.includes("cs"))
    return {
      icon: Cpu,
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      accent: "#4338ca",
      descKey: "subjectLecturesView.subjects.computer",
    };
  return {
    icon: Calculator,
    color: "text-slate-600",
    bg: "bg-slate-100",
    accent: "#475569",
    descKey: "subjectLecturesView.subjects.default",
  };
};

/* ══════════════════════════════════════════
   DESKTOP SIDEBAR
══════════════════════════════════════════ */
interface NewSidebarProps {
  classId: string | undefined;
  subjectId: string | undefined;
  gradeType: string;
  selectedSubject: any;
  activeChapterId: number | null;
  subjectChapters: ChapterWithVideos[];
  watchedSet: Set<number>;
  isWatchMode: boolean;
  meta: ReturnType<typeof getMeta>;
  isRtl: boolean;
  exitWatchMode: () => void;
  scrollToChapter: (idx: number) => void;
  t: ReturnType<typeof useT>;
}

const NewSidebar = ({
  classId,
  subjectId,
  gradeType,
  selectedSubject,
  activeChapterId,
  subjectChapters,
  watchedSet,
  isWatchMode,
  meta,
  isRtl,
  exitWatchMode,
  scrollToChapter,
  t,
}: NewSidebarProps) => {
  const navigate = useNavigate();
  const navState = { gradeType, selectedSubject };

  const navItems = [
    {
      id: "dashboard",
      labelKey: "subjectLecturesView.sidebar.dashboard",
      icon: LayoutDashboard,
      path: null,
      isStatic: true,
      isActive: false,
    },
   {
      id: "my-courses",
      labelKey: "subjectLecturesView.sidebar.myCourses",
      icon: BookOpen,
      path: `/${classId}/${subjectId}`,
      isStatic: false,
      isActive: true,
    },
    // {
    //   id: "assessments",
    //   labelKey: "subjectLecturesView.sidebar.assessments",
    //   icon: ClipboardList,
    //   path: `/assessment/1`,
    //   isStatic: false,
    //   isActive: false,
    // },
   {
      id: "past-papers",
      labelKey: "subjectLecturesView.sidebar.pastPapers",
      icon: FileText,
      path: `/${classId}/${subjectId}/past-papers`,
      isStatic: false,
      isActive: false,
    },
  ];

  return (
    <aside className="hidden lg:flex w-[272px] shrink-0 h-screen sticky top-0 border-r border-slate-200 flex-col bg-white">
      <div className="px-6 pt-7 pb-5 border-b border-slate-100">
        <p className="text-[#1E3A8A] font-extrabold text-[16px] leading-tight">
          {t("subjectLecturesView.sidebar.title")}
        </p>
        <p className="text-slate-400 text-[12px] mt-0.5">
          {t("subjectLecturesView.sidebar.subtitle")}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              disabled={item.isStatic}
              onClick={() => {
                if (item.isStatic || !item.path) return;
                navigate(item.path, { state: navState });
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 text-left ${
                item.isActive
                  ? "bg-blue-50 text-[#1E3A8A]"
                  : item.isStatic
                    ? "text-slate-400 cursor-default"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={1.8}
                className={
                  item.isActive
                    ? "text-[#1E3A8A]"
                    : item.isStatic
                      ? "text-slate-300"
                      : "text-slate-400"
                }
              />
              <span>{t(item.labelKey)}</span>
            </button>
          );
        })}

        {subjectChapters.length > 0 && (
          <div className="mt-3 ml-2 border-l-2 border-slate-100 pl-4 space-y-0.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              {t("subjectLecturesView.sidebar.chaptersLabel")}
            </p>
            {subjectChapters.map((ch, i) => {
              const isActive = activeChapterId === ch.id;
              const chLabel = isRtl ? ch.urdu_name || ch.name : ch.name;
              const watched = ch.videos.filter((v) =>
                watchedSet.has(v.id),
              ).length;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    if (isWatchMode) exitWatchMode();
                    setTimeout(() => scrollToChapter(i), 50);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left ${
                    isActive
                      ? ""
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  style={isActive ? { color: meta.accent } : {}}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-black"
                    style={{
                      backgroundColor: isActive ? meta.accent : "#cbd5e1",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[12px] whitespace-normal break-words leading-snug">
                    {chLabel}
                  </span>
                  {watched > 0 && watched === ch.videos.length && (
                    <CheckCircle2
                      size={13}
                      className="text-emerald-500 shrink-0"
                    />
                  )}
                  {watched > 0 && watched < ch.videos.length && (
                    <span
                      className="text-[10px] font-bold shrink-0"
                      style={{ color: meta.accent }}
                    >
                      {watched}/{ch.videos.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </nav>
    </aside>
  );
};

/* ══════════════════════════════════════════
   MOBILE TOP NAV
══════════════════════════════════════════ */
interface MobileTopNavProps {
  classId: string | undefined;
  subjectId: string | undefined;
  gradeType: string;
  selectedSubject: any;
  subjectChapters: ChapterWithVideos[];
  isWatchMode: boolean;
  exitWatchMode: () => void;
  scrollToChapter: (idx: number) => void;
  isRtl: boolean;
  t: ReturnType<typeof useT>;
}

const MobileTopNav = ({
  classId,
  subjectId,
  gradeType,
  selectedSubject,
  subjectChapters,
  isWatchMode,
  exitWatchMode,
  scrollToChapter,
  isRtl,
  t,
}: MobileTopNavProps) => {
  const navigate = useNavigate();
  const navState = { gradeType, selectedSubject };

  const navItems = [
   {
      labelKey: "subjectLecturesView.mobileNav.myCourses",
      path: `/${classId}/${subjectId}`,
      isActive: true,
    },
    {
      labelKey: "subjectLecturesView.mobileNav.assessments",
      path: `/assessment/1`,
      isActive: false,
    },
    {
      labelKey: "subjectLecturesView.mobileNav.pastPapers",
      path: `/${classId}/${subjectId}/past-papers`,
      isActive: false,
    },
  ];

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 px-3 py-3 overflow-x-auto scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.labelKey}
            onClick={() => navigate(item.path, { state: navState })}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[13px] font-bold border transition-all shrink-0 ${
              item.isActive
                ? "bg-[#1E3A8A] text-white border-[#1E3A8A]"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>

      {subjectChapters.length > 0 && (
        <div className="flex items-center gap-2 px-3 pb-3 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
            {t("subjectLecturesView.mobileNav.chapters")}
          </span>
          {subjectChapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => {
                if (isWatchMode) exitWatchMode();
                setTimeout(() => scrollToChapter(i), 50);
              }}
              className="whitespace-nowrap px-3 py-1.5 rounded-xl text-[12px] font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shrink-0 transition-all"
            >
              {t("subjectLecturesView.chapter.label")} {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   SUBJECT HEADER BANNER
══════════════════════════════════════════ */
interface SubjectHeaderProps {
  gradeName: string;
  subjectName: string;
  subject: any;
  meta: ReturnType<typeof getMeta>;
  isRtl: boolean;
  gradeType: string;
  t: ReturnType<typeof useT>;
}

const getGradeBadgeLabel = (gradeName: string, gradeType: string): string => {
  if (gradeName) {
    const m = gradeName.match(/\d+/);
    if (m) return m[0];
  }
  return gradeType || "SSC";
};

const SubjectHeader = ({
  gradeName,
  subjectName,
  subject,
  meta,
  isRtl,
  gradeType,
  t,
}: SubjectHeaderProps) => {
  const Icon = meta.icon;
  const gradeBadge = getGradeBadgeLabel(gradeName, gradeType);
  const desc = isRtl
    ? (subject?.urdu_desc || t(meta.descKey))
    : (subject?.desc || t(meta.descKey));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className="text-[11px] font-black tracking-widest uppercase text-white px-2.5 py-1 rounded-lg"
          style={{ backgroundColor: meta.accent }}
        >
          {gradeBadge}
        </span>
        <div className={`${meta.bg} p-1.5 rounded-lg`}>
          <Icon size={14} className={meta.color} strokeWidth={2} />
        </div>
      </div>
      <h1
        className={`text-[28px] sm:text-[32px] font-black text-[#0F172A] leading-tight mb-1 ${isRtl ? "text-right" : ""}`}
      >
        {subjectName}
      </h1>
      {gradeName && (
        <p className="text-[13px] font-semibold text-slate-400 mb-2">
          {gradeName}
        </p>
      )}
      <p
        className={`text-[14px] text-slate-500 leading-relaxed max-w-xl ${isRtl ? "text-right" : ""}`}
      >
        {desc}
      </p>
    </div>
  );
};

/* ══════════════════════════════════════════
   LECTURE CARD
══════════════════════════════════════════ */
interface LectureCardProps {
  video: Video;
  lectureNumber: number;
  isSelected: boolean;
  isWatched: boolean;
  progress: number;
  isUpNext: boolean;
  isLocked: boolean;
  onClick: () => void;
  isRtl: boolean;
  accentColor: string;
  t: ReturnType<typeof useT>;
}

const LectureCard = ({
  video,
  lectureNumber,
  isSelected,
  isWatched,
  progress,
  isUpNext,
  isLocked,
  onClick,
  isRtl,
  accentColor,
  t,
}: LectureCardProps) => {
  const title = isRtl ? video.urdu_name || video.name : video.name;
  const descRaw = isRtl ? video.urdu_desc || video.desc : video.desc;
  const shortDesc = descRaw?.split("|")[0]?.trim() || "";
  const thumbSrc = getThumbUrl(video) ?? thumbnail;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 bg-white flex flex-col h-[280px] ${
        isSelected
          ? "border-2 shadow-lg"
          : "border-slate-100 hover:shadow-md hover:border-slate-200"
      }`}
      style={
        isSelected
          ? {
              borderColor: accentColor,
              boxShadow: `0 4px 20px ${accentColor}22`,
            }
          : {}
      }
    >
      <div className="relative h-[155px] shrink-0 overflow-hidden">
        <img
          src={thumbSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = thumbnail;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {isLocked && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
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
            Login to watch
          </div>
        )}

        {!isLocked && isUpNext && !isSelected && (
          <div
            className="absolute top-3 left-3 z-20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: accentColor }}
          >
            {t("subjectLecturesView.card.upNext")}
          </div>
        )}
        {!isLocked && isWatched && !isSelected && (
          <div className="absolute top-3 right-3 z-20">
            <CheckCircle2 size={20} className="text-emerald-400" />
          </div>
        )}
        {isSelected ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2.5">
              <PlayCircle size={34} className="text-white" />
            </div>
          </div>
        ) : isLocked ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
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
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle size={30} className="text-white drop-shadow-lg" />
          </div>
        )}

        {!isLocked && progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
            <div
              className="h-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        )}
        <div className="absolute bottom-2.5 left-3 z-20">
          <span className="text-white/70 text-[10px] font-bold tracking-widest uppercase">
            {t("subjectLecturesView.card.lecture")} {lectureNumber}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          {isLocked ? (
            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              🔒 Login required
            </span>
          ) : isWatched ? (
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 size={11} /> {t("subjectLecturesView.card.watched")}
            </span>
          ) : progress > 0 && progress < 100 ? (
            <span
              className="text-[11px] font-semibold"
              style={{ color: accentColor }}
            >
              {Math.round(100 - progress)}% {t("subjectLecturesView.card.left")}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              {t("subjectLecturesView.card.notStarted")}
            </span>
          )}
        </div>
        <h4
          className={`text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 ${isRtl ? "text-right" : ""}`}
        >
          {title}
        </h4>
        {shortDesc && (
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   SIDEBAR ROW (watch mode right panel)
══════════════════════════════════════════ */
interface SidebarRowProps {
  video: Video;
  lectureNumber: number;
  isSelected: boolean;
  isWatched: boolean;
  progress: number;
  isLocked: boolean;
  onClick: () => void;
  isRtl: boolean;
  accentColor: string;
  t: ReturnType<typeof useT>;
}

const SidebarRow = ({
  video,
  lectureNumber,
  isSelected,
  isWatched,
  progress,
  isLocked,
  onClick,
  isRtl,
  accentColor,
  t,
}: SidebarRowProps) => {
  const title = isRtl ? video.urdu_name || video.name : video.name;
  const thumbSrc = getThumbUrl(video) ?? thumbnail;
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
        isSelected ? "border" : "hover:bg-slate-50 border border-transparent"
      }`}
      style={
        isSelected
          ? {
              backgroundColor: `${accentColor}11`,
              borderColor: `${accentColor}44`,
            }
          : {}
      }
    >
      <div className="relative w-[110px] h-[62px] shrink-0 rounded-lg overflow-hidden">
        <img
          src={thumbSrc}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = thumbnail;
          }}
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          </div>
        )}
        {!isLocked && progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full"
              style={{ width: `${progress}%`, backgroundColor: accentColor }}
            />
          </div>
        )}
        {!isLocked && isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircle size={20} className="text-white" />
          </div>
        )}
        {!isLocked && isWatched && !isSelected && (
          <div className="absolute top-1 right-1">
            <CheckCircle2 size={13} className="text-emerald-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
          {t("subjectLecturesView.card.lecture")} {lectureNumber}
        </p>
        <h4
          className={`text-[12px] font-bold leading-snug line-clamp-2 ${isRtl ? "text-right" : ""}`}
          style={isSelected ? { color: accentColor } : { color: "#1e293b" }}
        >
          {title}
        </h4>
        {isLocked ? (
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
            🔒 Login required
          </span>
        ) : isWatched ? (
          <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 flex items-center gap-1">
            <CheckCircle2 size={10} /> {t("subjectLecturesView.card.watched")}
          </span>
        ) : progress > 0 ? (
          <span
            className="text-[10px] font-semibold mt-0.5 block"
            style={{ color: accentColor }}
          >
            {Math.round(100 - progress)}% {t("subjectLecturesView.card.left")}
          </span>
        ) : null}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   CHAPTER SECTION
══════════════════════════════════════════ */
interface ChapterSectionProps {
  chapter: ChapterWithVideos;
  chapterIndex: number;
  globalLectureOffset: number;
  selectedVideo: Video | null;
  watchedSet: Set<number>;
  progressMap: Record<number, number>;
  currentGlobalIdx: number;
  isLoggedIn: boolean;
  onSelect: (video: Video, chapterId: number, globalIdx: number) => void;
  isRtl: boolean;
  accentColor: string;
  sidebarRef?: (el: HTMLDivElement | null) => void;
  t: ReturnType<typeof useT>;
}

const CARDS_PER_PAGE = 4;

const ChapterSection = ({
  chapter,
  chapterIndex,
  globalLectureOffset,
  selectedVideo,
  watchedSet,
  progressMap,
  currentGlobalIdx,
  isLoggedIn,
  onSelect,
  isRtl,
  accentColor,
  sidebarRef,
  t,
}: ChapterSectionProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(chapter.videos.length / CARDS_PER_PAGE);
  const visible = chapter.videos.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );
  const watchedInChapter = chapter.videos.filter((v) =>
    watchedSet.has(v.id),
  ).length;
  const chapterLabel = isRtl ? chapter.urdu_name || chapter.name : chapter.name;
  const chapterNum = String(chapterIndex + 1).padStart(2, "0");

  const lectureWord =
    chapter.videos.length === 1
      ? t("subjectLecturesView.chapter.lectures")
      : t("subjectLecturesView.chapter.lecturesPlural");

  return (
    <div
      id={`chapter-${chapter.id}`}
      ref={sidebarRef}
      className="mb-12 scroll-mt-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[12px] font-black"
            style={{ backgroundColor: accentColor }}
          >
            {chapterNum}
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t("subjectLecturesView.chapter.label")} {chapterNum}
            </span>
            <h3
              className={`text-[16px] font-black text-slate-900 leading-tight mt-0.5 ${isRtl ? "text-right" : ""}`}
            >
              {chapterLabel}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-slate-400 font-medium hidden sm:block">
            {chapter.videos.length} {lectureWord}
            {watchedInChapter > 0 && (
              <span className="ml-1.5 text-emerald-500">
                · {watchedInChapter} {t("subjectLecturesView.chapter.watched")}
              </span>
            )}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">
                {page + 1}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {visible.map((video, localIdx) => {
            const globalIdx =
              globalLectureOffset + page * CARDS_PER_PAGE + localIdx;
            const isLocked = globalIdx > 0 && !isLoggedIn;
            return (
              <LectureCard
                key={video.id}
                video={video}
                lectureNumber={globalIdx + 1}
                isSelected={selectedVideo?.id === video.id}
                isWatched={watchedSet.has(video.id)}
                progress={
                  watchedSet.has(video.id) ? 100 : progressMap[video.id] || 0
                }
                isUpNext={
                  selectedVideo?.id !== video.id &&
                  !watchedSet.has(video.id) &&
                  globalIdx === currentGlobalIdx + 1
                }
                isLocked={isLocked}
                onClick={() => onSelect(video, chapter.id, globalIdx)}
                isRtl={isRtl}
                accentColor={accentColor}
                t={t}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 border-t border-slate-100" />
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const SubjectLecturesView = () => {
  const { classSlug, subjectSlug } = useParams<{ classSlug: string; subjectSlug: string }>();
  const classId = classIdFromSlug(classSlug ?? "");
  const navigate = useNavigate();
  const location = useLocation();

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
    useClassSubjects(classId ?? 0);

  const selectedSubject = useMemo(() => {
    const fromApi = findSubjectBySlug(subjects, subjectSlug ?? "");
    if (fromApi) return fromApi;
    if (selectedSubjectFromState) return selectedSubjectFromState;
    return null;
  }, [subjects, subjectSlug, selectedSubjectFromState]);

  const gradeName = (isRtl ? classInfo?.urdu_name : classInfo?.name) || classInfo?.name || "";
  const subjectRawName = selectedSubject?.name || "";
  const meta = getMeta(subjectRawName);

  const subjectName = useMemo(() => {
    if (!selectedSubject) return "";
    return isRtl
      ? selectedSubject.urdu_name?.trim() || selectedSubject.name || ""
      : selectedSubject.name || "";
  }, [selectedSubject, isRtl]);

  const gradeDisplayName = useMemo(() => {
    if (!classInfo) return "";
    return isRtl
      ? classInfo.urdu_name?.trim() || classInfo.name || ""
      : classInfo.name || "";
  }, [classInfo, isRtl]);

const subjectChapters: ChapterWithVideos[] = useMemo(
    () =>
      chapters
        .filter((c: any) => String(c.subject_id) === String(selectedSubject?.id))
        .map((c: any) => ({ ...c, videos: chapterVideos[c.id] || [] })),
    [chapters, chapterVideos, selectedSubject],
  );

  const allVideos: Video[] = useMemo(
    () => subjectChapters.flatMap((c) => c.videos),
    [subjectChapters],
  );

  const allVideoIds = useMemo(() => allVideos.map((v) => v.id), [allVideos]);

  const chapterOffsets: number[] = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    subjectChapters.forEach((c) => {
      offsets.push(acc);
      acc += c.videos.length;
    });
    return offsets;
  }, [subjectChapters]);

  const {
    progressMap,
    watchedSet,
    fetchJourneyForVideo,
    handleTimeUpdate: progressTimeUpdate,
    handleEnded: progressEnded,
    handleView,
    flushBeforeSwitch,
  } = useVideoProgress(allVideoIds, isLoggedIn);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [isWatchMode, setIsWatchMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const resumePositionRef = useRef<number>(0);
  const hasSeekRef = useRef(false);
  const viewFiredRef = useRef(false);

  useEffect(() => {
    hasSeekRef.current = false;
    viewFiredRef.current = false;
  }, [selectedVideo?.id]);

  const currentGlobalIdx = useMemo(
    () => allVideos.findIndex((v) => v.id === selectedVideo?.id),
    [allVideos, selectedVideo],
  );
  const totalLectures = allVideos.length;

  const trackEvent = useCallback(
    (eventName: string) => {
      if (!window.gtag || !selectedVideo) return;
      window.gtag("event", eventName, {
        video_id: selectedVideo.id,
        video_name: selectedVideo.name,
        page_path: window.location.pathname,
      });
    },
    [selectedVideo],
  );

 const selectVideo = useCallback(
  async (video: Video, chapterId: number, globalIdx: number) => {
    if (globalIdx > 0 && !isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    flushBeforeSwitch();
    const position = await fetchJourneyForVideo(video.id);
    resumePositionRef.current = position;

    setSelectedVideo(video);
    setActiveChapterId(chapterId);
    setIsWatchMode(true);

    try {
      const detail = await fetchVideoDetail(video.id);
      // ✅ Save thumbnail_url back so getThumbUrl works on the selected video
      video.thumbnail_url = detail.thumbnail_url || video.thumbnail_url;
      setVideoUrl(detail.video_url || `https://cdn.zaheen.com.pk/videos/${video.path}`);
    } catch {
      setVideoUrl(`https://cdn.zaheen.com.pk/videos/${video.path}`);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  },
  [isLoggedIn, navigate, location.pathname, flushBeforeSwitch, fetchJourneyForVideo],
);

  const goNext = useCallback(() => {
    if (currentGlobalIdx < allVideos.length - 1) {
      const next = allVideos[currentGlobalIdx + 1];
      const chapIdx = subjectChapters.findIndex((c) =>
        c.videos.some((v) => v.id === next.id),
      );
      selectVideo(next, subjectChapters[chapIdx]?.id ?? 0, currentGlobalIdx + 1);
    }
  }, [currentGlobalIdx, allVideos, subjectChapters, selectVideo]);

  const goPrev = useCallback(() => {
    if (currentGlobalIdx > 0) {
      const prev = allVideos[currentGlobalIdx - 1];
      const chapIdx = subjectChapters.findIndex((c) =>
        c.videos.some((v) => v.id === prev.id),
      );
      selectVideo(prev, subjectChapters[chapIdx]?.id ?? 0, currentGlobalIdx - 1);
    }
  }, [currentGlobalIdx, allVideos, subjectChapters, selectVideo]);

  const handleCanPlay = useCallback(() => {
    if (hasSeekRef.current) return;
    hasSeekRef.current = true;
    const pos = resumePositionRef.current;
    if (pos > 2 && videoRef.current) {
      videoRef.current.currentTime = pos;
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (!viewFiredRef.current && selectedVideo) {
      viewFiredRef.current = true;
      handleView(selectedVideo.id);
      trackEvent("video_start");
    }
  }, [selectedVideo, handleView, trackEvent]);

  const handleEnded = useCallback(() => {
    if (selectedVideo && videoRef.current) {
      progressEnded(selectedVideo.id, videoRef.current.duration || 0);
      trackEvent("video_complete");
    }
    goNext();
  }, [selectedVideo, progressEnded, trackEvent, goNext]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.target as HTMLVideoElement;
    if (!v.duration || !selectedVideo) return;
    progressTimeUpdate(selectedVideo.id, v.currentTime, v.duration);
    const pct = (v.currentTime / v.duration) * 100;
    if (pct > 50 && !(v as any)._tracked50) {
      (v as any)._tracked50 = true;
      trackEvent("video_50_percent");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollToChapter = (idx: number) =>
    chapterRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const exitWatchMode = useCallback(() => {
    flushBeforeSwitch();
    setIsWatchMode(false);
    setSelectedVideo(null);
    setVideoUrl("");
    resumePositionRef.current = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [flushBeforeSwitch]);

  const renderDesc = (video: Video | null) => {
    if (!video) return null;
    const fullText = isRtl ? video.urdu_desc || video.desc : video.desc;
    if (!fullText) return null;
    const parts = fullText.split("|").map((p) => p.trim()).filter(Boolean);
    return (
      <>
        <p className="text-sm font-semibold text-slate-800">{parts[0]}</p>
        {parts.slice(1).map((line, i) =>
          line.startsWith("-") ? (
            <p key={i} className="text-sm text-slate-700 mt-1">
              {line.replace("-", "").trim()}
            </p>
          ) : (
            <ul key={i} className="text-sm text-slate-500 mt-1 list-disc pl-4">
              <li>{line}</li>
            </ul>
          ),
        )}
      </>
    );
  };

  const renderBreadcrumb = () => {
    const videoTitle = selectedVideo
      ? isRtl
        ? selectedVideo.urdu_name || selectedVideo.name
        : selectedVideo.name
      : null;

    return (
      <div className="text-sm text-slate-400 flex items-center gap-1.5 mb-6 flex-wrap min-w-0">
        <Link to="/" className="hover:text-slate-600 transition-colors shrink-0">
          {t("subjectLecturesView.breadcrumb.home")}
        </Link>
        <span className="text-slate-300 shrink-0">/</span>
       <Link
          to={`/${classSlug}`}
          state={{ gradeType, selectedSubject }}
          className="hover:text-slate-600 transition-colors shrink-0"
        >
          {gradeDisplayName || `Grade ${classId}`}
        </Link>
        <span className="text-slate-300 shrink-0">/</span>
        {isWatchMode && videoTitle ? (
          <>
            <button
              onClick={exitWatchMode}
              className="hover:text-[#1E3A8A] text-slate-500 font-semibold transition-colors shrink-0 decoration-dotted"
            >
              {subjectName}
            </button>
            <span className="text-slate-300 shrink-0">/</span>
            <span className="text-slate-700 font-semibold break-words">{videoTitle}</span>
          </>
        ) : (
          <span className="text-slate-700 font-semibold">{subjectName}</span>
        )}
      </div>
    );
  };

  return (
    <section className="bg-[#F8FAFC] min-h-screen flex flex-col lg:flex-row">
      <NewSidebar
        classId={classSlug}
        subjectId={subjectSlug}
        gradeType={gradeType}
        selectedSubject={selectedSubject}
        activeChapterId={activeChapterId}
        subjectChapters={subjectChapters}
        watchedSet={watchedSet}
        isWatchMode={isWatchMode}
        meta={meta}
        isRtl={isRtl}
        exitWatchMode={exitWatchMode}
        scrollToChapter={scrollToChapter}
        t={t}
      />

      <MobileTopNav
        classId={classSlug}
        subjectId={subjectSlug}
        gradeType={gradeType}
        selectedSubject={selectedSubject}
        subjectChapters={subjectChapters}
        isWatchMode={isWatchMode}
        exitWatchMode={exitWatchMode}
        scrollToChapter={scrollToChapter}
        isRtl={isRtl}
        t={t}
      />

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-6 overflow-x-hidden">
        {renderBreadcrumb()}

        {!loading && (
          <SubjectHeader
            gradeName={gradeDisplayName}
            subjectName={subjectName}
            subject={selectedSubject}
            meta={meta}
            isRtl={isRtl}
            gradeType={gradeType}
            t={t}
          />
        )}

        {loading ? (
          <div className="space-y-10">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-8 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
              </div>
            </div>
            {Array.from({ length: 2 }).map((_, ci) => (
              <div key={ci}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl overflow-hidden border border-slate-100 bg-white animate-pulse h-[280px]"
                    >
                      <div className="h-[155px] bg-slate-200" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 w-16 bg-slate-200 rounded" />
                        <div className="h-4 w-3/4 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : subjectChapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
              <Clock size={38} className="text-slate-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              {t("subjectLecturesView.empty.title")}
            </h2>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              {t("subjectLecturesView.empty.desc", { subject: subjectName })}
            </p>
          </div>
        ) : isWatchMode && selectedVideo ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="watch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col xl:flex-row gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <video
                      ref={videoRef}
                      key={videoUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                      src={videoUrl}
                      onCanPlay={handleCanPlay}
                      onPlay={handlePlay}
                      onEnded={handleEnded}
                      onTimeUpdate={handleTimeUpdate}
                      onError={(e) => console.error("VIDEO ERROR", e)}
                    />
                  </div>
                </div>

                {(() => {
                  const pctActive = watchedSet.has(selectedVideo.id)
                    ? 100
                    : progressMap[selectedVideo.id] || 0;
                  return pctActive > 0 && pctActive < 100 ? (
                    <div className="h-1 bg-slate-200 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pctActive}%`, backgroundColor: meta.accent }}
                      />
                    </div>
                  ) : null;
                })()}

                <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {t("subjectLecturesView.player.lectureOf", {
                          current: currentGlobalIdx + 1,
                          total: totalLectures,
                        })}
                      </p>
                      <h2
                        className={`text-lg font-black text-slate-900 leading-snug ${isRtl ? "text-right" : ""}`}
                      >
                        {isRtl
                          ? selectedVideo.urdu_name || selectedVideo.name
                          : selectedVideo.name}
                      </h2>
                      <div className="mt-2 space-y-1">{renderDesc(selectedVideo)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={exitWatchMode}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-[13px] font-semibold hover:bg-slate-50 transition-all"
                      >
                        {t("subjectLecturesView.player.allLectures")}
                      </button>
                      <button
                        onClick={goPrev}
                        disabled={currentGlobalIdx === 0}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                      </button>
                      <button
                        onClick={goNext}
                        disabled={currentGlobalIdx >= allVideos.length - 1}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-[320px] shrink-0">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-6">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[14px] font-black text-slate-900">
                      {t("subjectLecturesView.player.allLecturesTitle")}
                    </h3>
                    <span className="text-[12px] text-slate-400 font-medium">
                      {totalLectures} {t("subjectLecturesView.player.total")}
                    </span>
                  </div>
                  <div className="overflow-y-auto max-h-[75vh] p-2 space-y-1">
                    {subjectChapters.map((chapter, chIdx) => (
                      <div key={chapter.id}>
                        <div className="px-2 pt-3 pb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-black"
                              style={{ backgroundColor: meta.accent }}
                            >
                              {chIdx + 1}
                            </span>
                            {isRtl ? chapter.urdu_name || chapter.name : chapter.name}
                          </p>
                        </div>
                        {chapter.videos.map((video, vidIdx) => {
                          const globalIdx = chapterOffsets[chIdx] + vidIdx;
                          const isLocked = globalIdx > 0 && !isLoggedIn;
                          return (
                            <SidebarRow
                              key={video.id}
                              video={video}
                              lectureNumber={globalIdx + 1}
                              isSelected={selectedVideo?.id === video.id}
                              isWatched={watchedSet.has(video.id)}
                              progress={
                                watchedSet.has(video.id)
                                  ? 100
                                  : progressMap[video.id] || 0
                              }
                              isLocked={isLocked}
                              onClick={() => selectVideo(video, chapter.id, globalIdx)}
                              isRtl={isRtl}
                              accentColor={meta.accent}
                              t={t}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div>
            <h2 className="text-[20px] font-black text-slate-900 mb-7">
              {t("subjectLecturesView.grid.title")}
            </h2>
            {subjectChapters.map((chapter, chIdx) => (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                chapterIndex={chIdx}
                globalLectureOffset={chapterOffsets[chIdx]}
                selectedVideo={selectedVideo}
                watchedSet={watchedSet}
                progressMap={progressMap}
                currentGlobalIdx={currentGlobalIdx}
                isLoggedIn={isLoggedIn}
                onSelect={selectVideo}
                isRtl={isRtl}
                accentColor={meta.accent}
                sidebarRef={(el) => {
                  chapterRefs.current[chIdx] = el;
                }}
                t={t}
              />
            ))}
          </div>
        )}
      </main>
    </section>
  );
};

export default SubjectLecturesView;