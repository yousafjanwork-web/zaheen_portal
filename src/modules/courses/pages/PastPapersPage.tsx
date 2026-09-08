import React, {
  useEffect, useState, useMemo, useRef, useCallback,
} from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
  BookOpen, FlaskConical, Atom, Leaf, Languages,
  Sigma, Landmark, Globe, Calculator, Cpu,
  PlayCircle, Download, ChevronDown, SlidersHorizontal,
  ChevronRight, Clock, Home, MonitorPlay, Settings,
  BookMarked, X, AlertCircle, Menu, Clipboard,
  ChevronLeft, ExternalLink, CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
const physicsBanner = "https://cdn.zaheen.com.pk/zaheen-web-img/physics.png";

import { classIdFromSlug } from "../../../config/classSlugs";
import { findSubjectBySlug } from "../../../config/subjectSlug";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";

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
  const value = key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);
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
  const isRtl = lang === "ur";
  const t = (key: string, vars?: Record<string, string | number>) => {
    let str = getNestedValue(dict, key);
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(`{{${k}}}`, String(v));
      });
    }
    return str;
  };
  return { t, lang, isRtl };
};

/* ─── API & CDN roots ──────────────────────────────────── */
const BASE      = "https://api.zaheen.com.pk/api";
const CDN_ROOT  = "https://cdn.zaheen.com.pk";
const CDN_VIDEO = "https://cdn.zaheen.com.pk/videos";

function buildPdfUrl(filePath: string): string {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;
  return `${CDN_ROOT}/${filePath.replace(/^\/+/, "")}`;
}
function buildVideoUrl(filePath: string): string {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;
  return `${CDN_VIDEO}/${filePath.replace(/^\/+/, "")}`;
}

/* ─── Urdu paper-type fallback map ──────────────────────
   If the API doesn't return urdu_paper_type, we translate
   the most common English values ourselves.
──────────────────────────────────────────────────────── */
const PAPER_TYPE_UR: Record<string, string> = {
  "Past Paper":    "پرانی پرچی",
  "Annual Exam":   "سالانہ امتحان",
  "Midterm":       "وسط مدتی",
  "Final Exam":    "حتمی امتحان",
  "Mock Exam":     "مشقی امتحان",
  "Supplementary": "ضمنی",
};

/* ─── Urdu grade/class fallback map ─────────────────────
   Covers the most common class numbers (1-12).
──────────────────────────────────────────────────────── */
const CLASS_TITLE_UR: Record<string, string> = {
  "1":  "جماعت اول",
  "2":  "جماعت دوم",
  "3":  "جماعت سوم",
  "4":  "جماعت چہارم",
  "5":  "جماعت پنجم",
  "6":  "جماعت ششم",
  "7":  "جماعت ہفتم",
  "8":  "جماعت ہشتم",
  "9":  "جماعت نہم",
  "10": "جماعت دہم",
  "11": "جماعت یازدہم",
  "12": "جماعت دوازدہم",
};

/* ═══ Types ════════════════════════════════════════════ */
interface PastPaperRaw {
  id                : number;
  year              : number | string;
  file_path        ?: string;
  title            ?: string;
  urdu_title       ?: string;
  name             ?: string;
  urdu_name        ?: string;
  paper_type       ?: string;
  urdu_paper_type  ?: string;
  type             ?: string;
  description      ?: string;
  urdu_description ?: string;
  subject_name     ?: string;
  urdu_subject_name?: string;
  [key: string]: any;
}

interface Paper {
  id                : number;
  year              : string;
  title             : string;
  urduTitle         : string;
  subjectName       : string;
  urduSubjectName   : string;
  paperType         : string;
  urduPaperType     : string;
  description       : string;
  urduDescription   : string;
  pdfUrl            : string | null;
  videoUrl          : string | null;
}

function normalisePaper(raw: PastPaperRaw, fallbackSubject: string, fallbackUrduSubject?: string): Paper {
  const year             = String(raw.year ?? "");
  const subjectName      = raw.subject_name      || fallbackSubject;
  const urduSubjectName  = raw.urdu_subject_name || fallbackUrduSubject || subjectName;
  const paperType        = raw.paper_type || raw.type || "Past Paper";
  // Use API urdu_paper_type first, then our local map, then fall back to English
  const urduPaperType    = raw.urdu_paper_type || PAPER_TYPE_UR[paperType] || paperType;
  const title            = raw.title || raw.name || `${year} ${subjectName} ${paperType}`;
  const urduTitle        = raw.urdu_title || raw.urdu_name || `${year} ${urduSubjectName} ${urduPaperType}`;
  const description      = raw.description      || "";
  const urduDescription  = raw.urdu_description || description;
  const pdfUrl           = raw.file_path ? buildPdfUrl(raw.file_path)   : null;
  const videoUrl         = raw.file_path ? buildVideoUrl(raw.file_path) : null;
  return {
    id: raw.id,
    year,
    title,
    urduTitle,
    subjectName,
    urduSubjectName,
    paperType,
    urduPaperType,
    description,
    urduDescription,
    pdfUrl,
    videoUrl,
  };
}

/* ─── Helper: pick the right field based on language ── */
function pick(enVal: string, urVal: string, isUrdu: boolean): string {
  return isUrdu && urVal ? urVal : enVal;
}

/* ═══ Subject helpers ══════════════════════════════════ */
const getSubjectMeta = (name: string) => {
  const n = (name || "").toLowerCase();
  if (n.includes("physic") || n.includes("طبیعیات") || n.includes("فزکس"))
    return { icon: Atom,         color: "text-[#1E3A8A]" };
  if (n.includes("math") || n.includes("ریاضی"))
    return { icon: Sigma,        color: "text-[#1E3A8A]" };
  if (n.includes("chem") || n.includes("کیمیا"))
    return { icon: FlaskConical, color: "text-[#1E3A8A]" };
  if (n.includes("bio") || n.includes("حیاتیات"))
    return { icon: Leaf,         color: "text-[#1E3A8A]" };
  if (n.includes("english") || n.includes("انگریزی"))
    return { icon: BookOpen,     color: "text-[#1E3A8A]" };
  if (n.includes("urdu") || n.includes("اردو"))
    return { icon: Languages,    color: "text-[#1E3A8A]" };
  if (n.includes("islamic") || n.includes("اسلامیات"))
    return { icon: Landmark,     color: "text-[#1E3A8A]" };
  if (n.includes("pakistan") || n.includes("پاکستان"))
    return { icon: Globe,        color: "text-[#1E3A8A]" };
  if (n.includes("computer") || n.includes("cs") || n.includes("کمپیوٹر"))
    return { icon: Cpu,          color: "text-[#1E3A8A]" };
  return { icon: Calculator, color: "text-[#1E3A8A]" };
};

const TYPE_COLOR: Record<string, string> = {
  "Annual Exam":   "bg-blue-100   text-blue-800",
  "Midterm":       "bg-amber-100  text-amber-800",
  "Final Exam":    "bg-orange-100 text-orange-800",
  "Mock Exam":     "bg-slate-100  text-slate-600",
  "Supplementary": "bg-purple-100 text-purple-800",
};
const typeColor = (t: string) => TYPE_COLOR[t] ?? "bg-slate-100 text-slate-600";

/* ═══════════════════════════════════════════════════════
   INLINE VIDEO PLAYER
   FIX: removed xl:flex-row-reverse — instead we only
   mirror text/icon alignment inside each panel.
   The video always stays LEFT and related list always
   stays RIGHT regardless of RTL.
═══════════════════════════════════════════════════════ */
interface InlineVideoPlayerProps {
  paper        : Paper;
  allPapers    : Paper[];
  onClose      : () => void;
  onSelectPaper: (p: Paper) => void;
  onDownload   : (p: Paper) => void;
  t            : (key: string, vars?: Record<string, string | number>) => string;
  isRtl        : boolean;
}

const InlineVideoPlayer = ({ paper, allPapers, onClose, onSelectPaper, t, isRtl }: InlineVideoPlayerProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const displayTitle       = pick(paper.title,       paper.urduTitle,       isRtl);
  const displaySubject     = pick(paper.subjectName, paper.urduSubjectName, isRtl);
  const displayPaperType   = pick(paper.paperType,   paper.urduPaperType,   isRtl);
  const displayDescription = pick(paper.description, paper.urduDescription, isRtl);

  useEffect(() => {
    setError(null);
    setVideoSrc(null);
    if (paper.videoUrl) setVideoSrc(paper.videoUrl);
    else setError(t("pastPapersPage.player.noVideo"));
  }, [paper.id, paper.videoUrl]);

  const related = allPapers.filter((p) => p.id !== paper.id);
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.2 }}
      className="w-full"
    >
      {/* Back button */}
      <button
        onClick={onClose}
        className="flex items-center gap-1.5 text-slate-500 hover:text-[#1E3A8A] text-[13px] font-semibold mb-4 transition-colors"
      >
        {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {t("pastPapersPage.player.backToPapers")}
      </button>

      {/* ── YouTube-style layout ──
          IMPORTANT: always row (video left, sidebar right).
          We do NOT reverse the flex direction for RTL —
          only internal text alignment changes per panel. */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* ── Left: Video + info ── */}
        <div className="flex-1 min-w-0">
          <div className="w-full bg-black rounded-2xl overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60 px-6 text-center">
                <AlertCircle size={40} />
                <p className="text-sm font-semibold max-w-md leading-relaxed">{error}</p>
                {paper.videoUrl && (
                  <button
                    onClick={() => window.open(paper.videoUrl!, "_blank", "noopener,noreferrer")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-[#1e40af] rounded-xl text-white text-sm font-bold transition-colors"
                  >
                    <ExternalLink size={15} /> {t("pastPapersPage.player.openInTab")}
                  </button>
                )}
                <button
                  onClick={() => { setError(null); setVideoSrc(paper.videoUrl); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-semibold transition-colors"
                >{t("pastPapersPage.player.retry")}</button>
              </div>
            )}
            {videoSrc && !error && (
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                controls
                autoPlay
                playsInline
                className="w-full h-full"
                onError={(e) => {
                  const ve = e.target as HTMLVideoElement;
                  setError(`${t("pastPapersPage.player.videoError")} ${ve.error?.code ?? 0}: ${ve.error?.message ?? "Unknown"}.`);
                }}
              />
            )}
          </div>

          {/* Paper info below video */}
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`flex items-center gap-2 mb-3 flex-wrap ${isRtl ? "flex-row-reverse" : ""}`}>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{paper.year}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${typeColor(paper.paperType)}`}>
                {displayPaperType}
              </span>
            </div>
            <h1 className={`text-[20px] font-black text-[#0F172A] leading-tight mb-2 ${isRtl ? "text-right" : ""}`}>
              {displayTitle}
            </h1>
            <div className={`flex items-center gap-1.5 mb-3 ${meta.color} ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
              <Icon size={13} strokeWidth={2} />
              <span className="text-[12px] font-bold">{displaySubject}</span>
            </div>
            {displayDescription && (
              <p className={`text-slate-500 text-[13px] leading-relaxed mb-4 ${isRtl ? "text-right" : ""}`}>
                {displayDescription}
              </p>
            )}
            <div className={`flex flex-wrap gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
              {paper.videoUrl && (
                <button
                  onClick={() => window.open(paper.videoUrl!, "_blank", "noopener,noreferrer")}
                  className="flex items-center gap-2 border border-slate-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-slate-600 text-[13px] font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <ExternalLink size={14} /> {t("pastPapersPage.player.openInTab")}
                </button>
              )}
              <div className="flex items-center gap-2 border border-slate-200 text-slate-400 text-[13px] font-bold py-2.5 px-4 rounded-xl bg-white pointer-events-none select-none cursor-default">
                <Download size={14} /> {t("pastPapersPage.card.downloadPdf")}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Scrollable related papers ──
            Always on the right. Text alignment is RTL-aware internally. */}
        <div className="xl:w-[340px] shrink-0 flex flex-col gap-3 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto xl:pr-1">
          <h2 className={`text-[14px] font-black text-[#0F172A] px-1 ${isRtl ? "text-right" : ""}`}>
            {t("pastPapersPage.player.morePapers")} <span className="text-slate-400 font-semibold">({related.length})</span>
          </h2>
          {related.map((rp) => {
            const rm = getSubjectMeta(rp.subjectName);
            const RI = rm.icon;
            const rpTitle   = pick(rp.title,       rp.urduTitle,       isRtl);
            const rpSubject = pick(rp.subjectName, rp.urduSubjectName, isRtl);
            const rpType    = pick(rp.paperType,   rp.urduPaperType,   isRtl);
            return (
              <button
                key={rp.id}
                onClick={() => onSelectPaper(rp)}
                className={`flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-3 hover:border-[#1E3A8A] hover:shadow-sm transition-all w-full ${isRtl ? "flex-row-reverse text-right" : "text-left"}`}
              >
                <div className="w-[110px] shrink-0 rounded-lg bg-slate-200 overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
                  <img src={physicsBanner} alt="" className="w-full h-full object-cover opacity-70"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle size={20} className="text-white drop-shadow" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-black text-[#0F172A] leading-snug line-clamp-2 mb-1 ${isRtl ? "text-right" : ""}`}>
                    {rpTitle}
                  </p>
                  <div className={`flex items-center gap-1 ${rm.color} ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
                    <RI size={10} strokeWidth={2} />
                    <span className="text-[11px] font-semibold truncate">{rpSubject}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 ${isRtl ? "flex-row-reverse" : ""}`}>
                    <span className="text-[10px] font-bold text-slate-400">{rp.year}</span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${typeColor(rp.paperType)}`}>
                      {rpType}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          {related.length === 0 && (
            <p className={`text-slate-400 text-[13px] px-1 ${isRtl ? "text-right" : ""}`}>
              {t("pastPapersPage.player.noPapers")}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════ */
interface SidebarContentProps {
  activePath: string;
  onNavClick?: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  classSlug?: string;
  subjectSlug?: string;
}

const SidebarContent = ({ activePath, onNavClick, t, classSlug, subjectSlug }: SidebarContentProps) => {
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { labelKey: "pastPapersPage.sidebar.home",          icon: Home,        path: "/" },
    {
      labelKey: "pastPapersPage.sidebar.videoLectures",
      icon: MonitorPlay,
      path: classSlug && subjectSlug ? `/${classSlug}/${subjectSlug}` : "/",
    },
    { labelKey: "pastPapersPage.sidebar.assessments",   icon: Clipboard,   path: "/assessment/1" },
    {
      labelKey: "pastPapersPage.sidebar.pastPapers",
      icon: BookMarked,
      path: classSlug && subjectSlug ? `/${classSlug}/${subjectSlug}/past-papers` : "/",
    },
  ];

  const nav = (path: string) => {
  navigate(path, { state: { classSlug, subjectSlug, gradeType } });
  onNavClick?.();
};

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-7 pb-5 pr-14 border-b border-slate-100">
        <p className="text-[#1E3A8A] font-extrabold text-[16px] leading-tight">{t("pastPapersPage.sidebar.title")}</p>
        <p className="text-slate-400 text-[12px] mt-0.5">{t("pastPapersPage.sidebar.subtitle")}</p>
      </div>

      <nav className="flex-1 px-3 pt-4 pb-2 space-y-1">
        {NAV_ITEMS.map(({ labelKey, icon: Icon, path }) => {
          const active = path.includes("past-papers") ? activePath.includes("past-papers") : activePath === path;
          return (
            <button key={labelKey} onClick={() => nav(path)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-150 text-left ${
                active ? "bg-[#E8EEF8] text-[#1E3A8A]" : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.7} className={active ? "text-[#1E3A8A]" : "text-slate-400"} />
              <span>{t(labelKey)}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6 pt-4 border-t border-slate-200/60">
        <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-slate-500 hover:bg-white/60 hover:text-slate-700 transition-all">
          <Settings size={20} strokeWidth={1.7} className="text-slate-400" />
          <span>{t("pastPapersPage.sidebar.settings")}</span>
        </button>
      </div>
    </div>
  );
};

interface DesktopSidebarProps {
  activePath: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  classSlug?: string;
  subjectSlug?: string;
}
const DesktopSidebar = ({ activePath, t, classSlug, subjectSlug }: DesktopSidebarProps) => (
  <aside className="hidden lg:flex w-[280px] shrink-0 h-screen sticky top-0 bg-[#EEF2F7] border-r border-slate-200/80 flex-col">
    <SidebarContent activePath={activePath} t={t} classSlug={classSlug} subjectSlug={subjectSlug} />
  </aside>
);

interface MobileNavProps {
  activePath: string;
  t: (key: string, vars?: Record<string, string | number>) => string;
  classSlug?: string;
  subjectSlug?: string;
}
const MobileNav = ({ activePath, t, classSlug, subjectSlug }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-[#EEF2F7] border-b border-slate-200 flex items-center gap-3 px-4 py-3.5">
        <button onClick={() => setOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          <Menu size={20} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] flex items-center justify-center shrink-0">
          <span className="text-white text-[13px] font-black">EP</span>
        </div>
        <p className="text-[#1E3A8A] font-black text-[14px]">{t("pastPapersPage.sidebar.title")}</p>
      </header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div key="drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-[#EEF2F7] border-r border-slate-200 shadow-2xl flex flex-col">
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors z-10"><X size={18} /></button>
              <SidebarContent activePath={activePath} onNavClick={() => setOpen(false)} t={t} classSlug={classSlug} subjectSlug={subjectSlug} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   DROPDOWN
═══════════════════════════════════════════════════════ */
const Dropdown = ({ label, value, options, onChange, isRtl }: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  isRtl?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find((o) => o.value === value);
  return (
    <div className="flex flex-col gap-1.5 min-w-[160px] flex-1" ref={ref}>
      <label className={`text-[11px] font-bold text-slate-500 uppercase tracking-widest ${isRtl ? "text-right" : ""}`}>{label}</label>
      <div className="relative">
        <button onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white text-[14px] font-medium transition-all ${open ? "border-[#1E3A8A] shadow-sm" : "border-slate-200 hover:border-slate-300"} text-slate-800 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <span className="truncate">{selected?.label || "Select"}</span>
          <ChevronDown size={15} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
              className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
            >
              {options.map((opt) => (
                <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full px-4 py-2.5 text-[14px] font-medium transition-colors ${isRtl ? "text-right" : "text-left"} ${opt.value === value ? "bg-[#1E3A8A] text-white" : "text-slate-700 hover:bg-slate-50"}`}
                >{opt.label}</button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   FEATURED CARD
═══════════════════════════════════════════════════════ */
interface FeaturedCardProps {
  paper  : Paper;
  onWatch: (p: Paper) => void;
  t      : (key: string, vars?: Record<string, string | number>) => string;
  isRtl  : boolean;
}
const FeaturedCard = ({ paper, onWatch, t, isRtl }: FeaturedCardProps) => {
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;
  const tc   = typeColor(paper.paperType);

  const displayTitle       = pick(paper.title,       paper.urduTitle,       isRtl);
  const displaySubject     = pick(paper.subjectName, paper.urduSubjectName, isRtl);
  const displayPaperType   = pick(paper.paperType,   paper.urduPaperType,   isRtl);
  const displayDescription = pick(paper.description, paper.urduDescription, isRtl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      <div className="relative w-full overflow-hidden bg-[#050a14]" style={{ aspectRatio: "16/6" }}>
        <img src={physicsBanner} alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
        <div className={`absolute top-4 flex items-center gap-2 z-10 ${isRtl ? "right-4" : "left-4"}`}>
          <span className="bg-black/30 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">{paper.year}</span>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tc}`}>{displayPaperType}</span>
        </div>
        <div className={`absolute bottom-4 z-10 ${isRtl ? "right-4 left-4" : "left-4 right-4"}`}>
          <p className={`text-[#0F172A] text-[18px] sm:text-[20px] font-black leading-snug drop-shadow-sm line-clamp-2 ${isRtl ? "text-right" : ""}`}>
            {displayTitle}
          </p>
        </div>
      </div>
      <div className="flex flex-col p-5 gap-4">
        <div className={`flex items-center gap-2 ${meta.color} ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
          <Icon size={13} strokeWidth={2} />
          <span className="text-[13px] font-bold">{displaySubject}</span>
        </div>
        {displayDescription && (
          <p className={`text-[13px] text-slate-500 leading-relaxed line-clamp-2 ${isRtl ? "text-right" : ""}`}>
            {displayDescription}
          </p>
        )}
        <div className={`flex flex-col sm:flex-row gap-2.5 ${isRtl ? "sm:flex-row-reverse" : ""}`}>
          <button
            onClick={() => onWatch(paper)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[13px] font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <PlayCircle size={15} /> {t("pastPapersPage.card.watchVideo")}
          </button>
          <div className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-400 text-[13px] font-bold py-3 px-4 rounded-xl bg-white pointer-events-none select-none cursor-default">
            <Download size={14} /> {t("pastPapersPage.card.downloadPdf")}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   COMPACT CARD
═══════════════════════════════════════════════════════ */
interface CompactCardProps {
  paper  : Paper;
  onWatch: (p: Paper) => void;
  delay ?: number;
  t      : (key: string, vars?: Record<string, string | number>) => string;
  isRtl  : boolean;
}
const CompactCard = ({ paper, onWatch, delay = 0, t, isRtl }: CompactCardProps) => {
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;
  const tc   = typeColor(paper.paperType);

  const displayTitle       = pick(paper.title,       paper.urduTitle,       isRtl);
  const displaySubject     = pick(paper.subjectName, paper.urduSubjectName, isRtl);
  const displayPaperType   = pick(paper.paperType,   paper.urduPaperType,   isRtl);
  const displayDescription = pick(paper.description, paper.urduDescription, isRtl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className="relative w-full overflow-hidden bg-[#050a14]" style={{ aspectRatio: "16/9" }}>
        <img src={physicsBanner} alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className={`absolute top-3 flex items-center gap-1.5 z-10 ${isRtl ? "right-3" : "left-3"}`}>
          <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">{paper.year}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tc}`}>{displayPaperType}</span>
        </div>
        <div className={`absolute bottom-3 z-10 ${isRtl ? "right-3 left-3" : "left-3 right-3"}`}>
          <p className={`text-[#0F172A] text-[13px] font-black leading-snug line-clamp-2 ${isRtl ? "text-right" : ""}`}>
            {displayTitle}
          </p>
        </div>
      </div>
      <div className="flex flex-col p-5 gap-4 flex-1">
        <div className={`flex items-center gap-1.5 ${meta.color} ${isRtl ? "flex-row-reverse justify-end" : ""}`}>
          <Icon size={12} strokeWidth={2} />
          <span className="text-[11px] font-bold">{displaySubject}</span>
        </div>
        {displayDescription && (
          <p className={`text-[12px] text-slate-500 leading-relaxed line-clamp-2 flex-1 ${isRtl ? "text-right" : ""}`}>
            {displayDescription}
          </p>
        )}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => onWatch(paper)}
            className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[12px] font-bold py-2.5 px-4 rounded-xl transition-colors"
          >
            <PlayCircle size={13} /> {t("pastPapersPage.card.watchVideoShort")}
          </button>
          <div className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-400 text-[12px] font-bold py-2.5 px-4 rounded-xl bg-white pointer-events-none select-none cursor-default">
            <Download size={12} /> {t("pastPapersPage.card.downloadPdf")}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   YEAR SECTION HEADING
═══════════════════════════════════════════════════════ */
interface YearHeadingProps {
  year : string;
  count: number;
  t    : (key: string, vars?: Record<string, string | number>) => string;
  isRtl: boolean;
}
const YearHeading = ({ year, count, t, isRtl }: YearHeadingProps) => (
  <div className={`flex items-center gap-4 mb-6 mt-2 ${isRtl ? "flex-row-reverse" : ""}`}>
    <div className={`flex items-center gap-2.5 ${isRtl ? "flex-row-reverse" : ""}`}>
      <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center shrink-0">
        <CalendarDays size={15} className="text-white" strokeWidth={2} />
      </div>
      <h2 className={`text-[22px] font-black text-[#0F172A] tracking-tight ${isRtl ? "text-right" : ""}`}>
        {year} {t("pastPapersPage.yearHeading.pastPapers")}
      </h2>
    </div>
    <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
      {count} {count === 1 ? t("pastPapersPage.yearHeading.paper") : t("pastPapersPage.yearHeading.papers")}
    </span>
    <div className="flex-1 h-px bg-slate-200" />
  </div>
);

/* Skeletons */
const FeaturedSkeleton = () => (
  <div className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="w-full bg-slate-200" style={{ aspectRatio: "16/6" }} />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-200 rounded" />
      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-slate-200 rounded-xl" />
        <div className="h-10 flex-1 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
);
const CompactSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="w-full bg-slate-200" style={{ aspectRatio: "16/9" }} />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-slate-200 rounded" />
      <div className="h-3 w-full bg-slate-200 rounded" />
      <div className="space-y-2">
        <div className="h-9 bg-slate-200 rounded-xl" />
        <div className="h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ROUTE FIX: This page now reads SLUGS from the URL
   (:classSlug / :subjectSlug), matching the pattern used
   everywhere else in the app (ClassSubjectsView,
   SubjectLecturesView). Previously it expected numeric
   :classId / :subjectId params, which never matched the
   actual route (`/${classSlug}/${slug}/past-papers`) that
   the rest of the app navigates to — so classId/subjectId
   were always undefined and the fetch effect silently
   bailed out, leaving the page stuck on the loading state.
═══════════════════════════════════════════════════════ */
const PastPapersPage = () => {
  const { classSlug, subjectSlug } = useParams<{ classSlug: string; subjectSlug: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { t, lang, isRtl } = useT();

  const gradeType = location.state?.gradeType;

  // Resolve the numeric classId from the slug (same helper used elsewhere)
  const classId = classIdFromSlug(classSlug ?? "");

  // Pull subjects for this class so we can resolve subjectSlug -> real subject/id
  const { classInfo, subjects } = useClassSubjects(classId ?? 0);

  const selectedSubject = useMemo(() => {
    const fromApi = findSubjectBySlug(subjects, subjectSlug ?? "");
    if (fromApi) return fromApi;
    if (location.state?.selectedSubject) return location.state.selectedSubject;
    return null;
  }, [subjects, subjectSlug, location.state]);

  const subjectId = selectedSubject?.id;

  // ── Class title ──────────────────────────────────────────────────────
  // Prefer classInfo from the API (now that we can actually resolve it),
  // then router state, then a numeric fallback derived from classId.
  const classTitle =
    classInfo?.name
    || location.state?.classTitle
    || location.state?.selectedSubject?.class_name
    || `Grade ${classId ?? ""}`;

  // ── Urdu class title ─────────────────────────────────────────────────
  // Priority: API urdu_name → extracted number from classTitle → classId
  // lookup → state fields → English fallback.
  const _gradeNumFromTitle = classTitle.match(/\d+/)?.[0] ?? "";
  const urduClassTitle =
    classInfo?.urdu_name?.trim()
    || (_gradeNumFromTitle && CLASS_TITLE_UR[_gradeNumFromTitle])
    || (classId != null && CLASS_TITLE_UR[String(classId)])
    || location.state?.urduClassTitle
    || location.state?.selectedSubject?.urdu_class_name
    || classTitle;

  // ── Subject title ────────────────────────────────────────────────────
  const subjectName =
    selectedSubject?.name
    || location.state?.subjectName
    || location.state?.selectedSubject?.name
    || "Subject";
  const urduSubjectName =
    selectedSubject?.urdu_name
    || location.state?.urduSubjectName
    || location.state?.selectedSubject?.urdu_name
    || subjectName;

  const displayClassTitle   = pick(classTitle,   urduClassTitle,   isRtl);
  const displaySubjectLabel = pick(subjectName,  urduSubjectName,  isRtl);

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter,    setYearFilter]    = useState("all");
  const [typeFilter,    setTypeFilter]    = useState("all");
  const [applied,       setApplied]       = useState({ subject: "all", year: "all", type: "all" });

  const [papers,     setPapers]     = useState<Paper[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const [activeVideo, setActiveVideo] = useState<Paper | null>(null);

  useEffect(() => {
    // Wait until both the class and subject have resolved to real IDs.
    if (!classId || !subjectId) return;
    let cancelled = false;
    (async () => {
      setLoading(true); setFetchError(false);
      try {
        const res = await fetch(`${BASE}/pastpapers?class_id=${classId}&subject_id=${subjectId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rawList: PastPaperRaw[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setPapers(rawList.map((r) => normalisePaper(r, subjectName, urduSubjectName)));
      } catch (err) {
        console.error("PastPapers fetch error:", err);
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [classId, subjectId, subjectName, urduSubjectName]);

  /* ── Filter options ── */
  const subjectOptions = useMemo(() => {
    const map = new Map<string, string>();
    papers.forEach((p) => {
      if (!map.has(p.subjectName)) {
        map.set(p.subjectName, pick(p.subjectName, p.urduSubjectName, isRtl));
      }
    });
    const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return [
      { value: "all", label: t("pastPapersPage.filters.allSubjects") },
      ...entries.map(([en, label]) => ({ value: en, label })),
    ];
  }, [papers, isRtl, t]);

  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(papers.map((p) => p.year))).sort((a, b) => Number(b) - Number(a));
    return [{ value: "all", label: t("pastPapersPage.filters.allYears") }, ...years.map((y) => ({ value: y, label: y }))];
  }, [papers, t]);

  const typeOptions = useMemo(() => {
    const map = new Map<string, string>();
    papers.forEach((p) => {
      if (!map.has(p.paperType)) {
        map.set(p.paperType, pick(p.paperType, p.urduPaperType, isRtl));
      }
    });
    const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return [
      { value: "all", label: t("pastPapersPage.filters.allTypes") },
      ...entries.map(([en, label]) => ({ value: en, label })),
    ];
  }, [papers, isRtl, t]);

  const filteredPapers = useMemo(() => papers.filter((p) => {
    if (applied.subject !== "all" && p.subjectName !== applied.subject) return false;
    if (applied.year    !== "all" && p.year        !== applied.year)    return false;
    if (applied.type    !== "all" && p.paperType   !== applied.type)    return false;
    return true;
  }), [papers, applied]);

  const yearGroups = useMemo(() => {
    const map = new Map<string, Paper[]>();
    filteredPapers.forEach((p) => {
      if (!map.has(p.year)) map.set(p.year, []);
      map.get(p.year)!.push(p);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, papers]) => ({ year, papers }));
  }, [filteredPapers]);

  const applyFilters = () => setApplied({ subject: subjectFilter, year: yearFilter, type: typeFilter });
  const clearAll = () => {
    setSubjectFilter("all"); setYearFilter("all"); setTypeFilter("all");
    setApplied({ subject: "all", year: "all", type: "all" });
  };
  const hasActive = applied.subject !== "all" || applied.year !== "all" || applied.type !== "all";

  const activeSubjectLabel = subjectOptions.find((o) => o.value === applied.subject)?.label || applied.subject;
  const activeTypeLabel    = typeOptions.find((o) => o.value === applied.type)?.label       || applied.type;

  const handleWatch = useCallback((paper: Paper) => {
    setActiveVideo(paper);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const papersFoundText = filteredPapers.length === 0
    ? t("pastPapersPage.results.noPapersFound")
    : t("pastPapersPage.results.papersFound", { count: filteredPapers.length });

  const chevronSep = isRtl
    ? <ChevronLeft size={13} className="text-slate-300" />
    : <ChevronRight size={13} className="text-slate-300" />;

  return (
    <section className={`bg-[#EEF2F7] min-h-screen flex flex-col lg:flex-row ${isRtl ? "dir-rtl" : ""}`} dir={isRtl ? "rtl" : "ltr"}>
      <DesktopSidebar activePath={location.pathname} t={t} classSlug={classSlug} subjectSlug={subjectSlug} />
      <MobileNav activePath={location.pathname} t={t} classSlug={classSlug} subjectSlug={subjectSlug} />

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-8">

          {/* Breadcrumb */}
       <div className={`text-sm text-slate-400 flex items-center gap-1.5 mb-6 flex-wrap w-full ${isRtl ? "justify-end flex-row-reverse" : ""}`}>
            <Link to="/" className="hover:text-slate-600 transition-colors">
              {t("pastPapersPage.breadcrumb.home")}
            </Link>
            {chevronSep}
            <Link
              to={`/${classSlug}`}
              state={{ gradeType }}
              className="hover:text-slate-600 transition-colors"
            >
              {displayClassTitle}
            </Link>
            {chevronSep}
            <Link
              to={`/${classSlug}/${subjectSlug}`}
              state={{ gradeType, selectedSubject, classTitle }}
              className="hover:text-slate-600 transition-colors"
            >
              {displaySubjectLabel}
            </Link>
            {chevronSep}
            <span className="text-slate-700 font-semibold">
              {t("pastPapersPage.breadcrumb.pastPapers")}
            </span>
          </div>

          {/* Inline video player OR papers list */}
          <AnimatePresence mode="wait">
            {activeVideo ? (
              <InlineVideoPlayer
                key="video"
                paper={activeVideo}
                allPapers={papers}
                onClose={() => setActiveVideo(null)}
                onSelectPaper={(p) => { setActiveVideo(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onDownload={() => {}}
                t={t}
                isRtl={isRtl}
              />
            ) : (
              <motion.div
                key="papers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pt-10"
              >
                {/* Header */}
                <div className={`mb-7 ${isRtl ? "text-right" : ""}`}>
                  <h1 className="text-[28px] sm:text-[34px] font-black text-[#0F172A] tracking-tight leading-none mb-2">
                    {t("pastPapersPage.header.title")}
                  </h1>
                  <p className="text-slate-500 text-[14px] leading-relaxed max-w-2xl">
                    {t("pastPapersPage.header.subtitle")}
                  </p>
                </div>

                {/* Filter bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-7 shadow-sm">
                  <div className={`flex flex-wrap gap-4 items-end ${isRtl ? "flex-row-reverse" : ""}`}>
                    <Dropdown
                      label={t("pastPapersPage.filters.subjectLabel")}
                      value={subjectFilter}
                      options={subjectOptions}
                      onChange={setSubjectFilter}
                      isRtl={isRtl}
                    />
                    <Dropdown
                      label={t("pastPapersPage.filters.yearLabel")}
                      value={yearFilter}
                      options={yearOptions}
                      onChange={setYearFilter}
                      isRtl={isRtl}
                    />
                    <Dropdown
                      label={t("pastPapersPage.filters.typeLabel")}
                      value={typeFilter}
                      options={typeOptions}
                      onChange={setTypeFilter}
                      isRtl={isRtl}
                    />
                    <button
                      onClick={applyFilters}
                      className={`flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[14px] font-bold px-6 py-3 rounded-xl transition-colors shrink-0 self-end ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      <SlidersHorizontal size={16} /> {t("pastPapersPage.filters.applyBtn")}
                    </button>
                  </div>

                  {hasActive && (
                    <div className={`flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap ${isRtl ? "flex-row-reverse" : ""}`}>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {t("pastPapersPage.filters.active")}
                      </span>
                      {applied.subject !== "all" && (
                        <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                          {activeSubjectLabel}
                          <button
                            onClick={() => { setSubjectFilter("all"); setApplied((p) => ({ ...p, subject: "all" })); }}
                            className="hover:text-red-500 font-black"
                          >×</button>
                        </span>
                      )}
                      {applied.year !== "all" && (
                        <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                          {applied.year}
                          <button
                            onClick={() => { setYearFilter("all"); setApplied((p) => ({ ...p, year: "all" })); }}
                            className="hover:text-red-500 font-black"
                          >×</button>
                        </span>
                      )}
                      {applied.type !== "all" && (
                        <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                          {activeTypeLabel}
                          <button
                            onClick={() => { setTypeFilter("all"); setApplied((p) => ({ ...p, type: "all" })); }}
                            className="hover:text-red-500 font-black"
                          >×</button>
                        </span>
                      )}
                      <button
                        onClick={clearAll}
                        className="text-[12px] font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1"
                      >
                        {t("pastPapersPage.filters.clearAll")}
                      </button>
                    </div>
                  )}
                </div>

                {!loading && !fetchError && (
                  <p className={`text-[13px] text-slate-400 font-medium mb-5 ${isRtl ? "text-right" : ""}`}>
                    {papersFoundText}
                  </p>
                )}

                {fetchError && !loading && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle size={40} className="text-red-400 mb-4" strokeWidth={1.5} />
                    <h2 className="text-xl font-black text-slate-900 mb-2">{t("pastPapersPage.error.title")}</h2>
                    <p className="text-slate-500 text-[14px] mb-5">{t("pastPapersPage.error.desc")}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-5 py-2.5 bg-[#1E3A8A] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e40af] transition-colors"
                    >
                      {t("pastPapersPage.error.retry")}
                    </button>
                  </div>
                )}

                {!fetchError && (
                  loading ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <FeaturedSkeleton /><CompactSkeleton />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => <CompactSkeleton key={i} />)}
                      </div>
                    </div>
                  ) : filteredPapers.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-28 text-center">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                        <Clock size={36} className="text-slate-400" strokeWidth={1.5} />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-3">{t("pastPapersPage.empty.title")}</h2>
                      <p className="text-slate-500 max-w-sm leading-relaxed text-[15px]">{t("pastPapersPage.empty.desc")}</p>
                      <button
                        onClick={clearAll}
                        className="mt-6 px-5 py-2.5 bg-[#1E3A8A] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e40af] transition-colors"
                      >
                        {t("pastPapersPage.filters.clearFilters")}
                      </button>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={JSON.stringify(applied)}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-12"
                      >
                        {yearGroups.map((group, groupIdx) => {
                          const isFirstGroup = groupIdx === 0;
                          return (
                            <section key={group.year}>
                              <YearHeading year={group.year} count={group.papers.length} t={t} isRtl={isRtl} />
                              {isFirstGroup ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <FeaturedCard paper={group.papers[0]} onWatch={handleWatch} t={t} isRtl={isRtl} />
                                    {group.papers[1] && (
                                      <CompactCard paper={group.papers[1]} onWatch={handleWatch} delay={0.05} t={t} isRtl={isRtl} />
                                    )}
                                  </div>
                                  {group.papers.slice(2).length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                      {group.papers.slice(2).map((paper, i) => (
                                        <CompactCard key={paper.id} paper={paper} onWatch={handleWatch} delay={i * 0.04} t={t} isRtl={isRtl} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {group.papers.map((paper, i) => (
                                    <CompactCard key={paper.id} paper={paper} onWatch={handleWatch} delay={i * 0.04} t={t} isRtl={isRtl} />
                                  ))}
                                </div>
                              )}
                            </section>
                          );
                        })}
                      </motion.div>
                    </AnimatePresence>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </section>
  );
};

export default PastPapersPage;