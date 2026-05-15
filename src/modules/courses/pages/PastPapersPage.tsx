/**
 * PastPapersPage.tsx  — Updated
 * Changes:
 *  1. Featured card image has paper title text overlaid + white gradient fade from bottom
 *  2. Reduced horizontal padding (px-3 sm:px-4)
 *  3. Download PDF button is always statically visible on cards (non-clickable/decorative)
 *  4. "Watch Video" opens a YouTube-style inline player:
 *       - Left/center: video player
 *       - Right: scrollable list of other papers
 *       - Left sidebar (nav) stays visible at all times
 *  5. VideoPlayerPage replaced with InlineVideoPlayer rendered inside main
 *  6. CompactCard thumbnail taller (16/9 ratio)
 *  7. Grid gaps increased (gap-6) and card content padding improved
 *  8. Download PDF buttons are purely static/decorative (no onClick, pointer-events-none)
 */

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
import physicsBanner from "../../../assets/images/physics.png";

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

/* ═══ Types ════════════════════════════════════════════ */
interface PastPaperRaw {
  id           : number;
  year         : number | string;
  file_path   ?: string;
  title       ?: string;
  name        ?: string;
  paper_type  ?: string;
  type        ?: string;
  description ?: string;
  subject_name?: string;
  [key: string]: any;
}
interface Paper {
  id          : number;
  year        : string;
  title       : string;
  subjectName : string;
  paperType   : string;
  description : string;
  pdfUrl      : string | null;
  videoUrl    : string | null;
}
function normalisePaper(raw: PastPaperRaw, fallbackSubject: string): Paper {
  const year        = String(raw.year ?? "");
  const subjectName = raw.subject_name || fallbackSubject;
  const paperType   = raw.paper_type || raw.type || "Past Paper";
  const title       = raw.title || raw.name || `${year} ${subjectName} ${paperType}`;
  const description = raw.description || "";
  const pdfUrl      = raw.file_path ? buildPdfUrl(raw.file_path)   : null;
  const videoUrl    = raw.file_path ? buildVideoUrl(raw.file_path) : null;
  return { id: raw.id, year, title, subjectName, paperType, description, pdfUrl, videoUrl };
}

/* ═══ Subject helpers ══════════════════════════════════ */
const getSubjectMeta = (name: string) => {
  const n = (name || "").toLowerCase();
  if (n.includes("physic"))   return { icon: Atom,         color: "text-[#1E3A8A]" };
  if (n.includes("math"))     return { icon: Sigma,        color: "text-[#1E3A8A]" };
  if (n.includes("chem"))     return { icon: FlaskConical, color: "text-[#1E3A8A]" };
  if (n.includes("bio"))      return { icon: Leaf,         color: "text-[#1E3A8A]" };
  if (n.includes("english"))  return { icon: BookOpen,     color: "text-[#1E3A8A]" };
  if (n.includes("urdu"))     return { icon: Languages,    color: "text-[#1E3A8A]" };
  if (n.includes("islamic"))  return { icon: Landmark,     color: "text-[#1E3A8A]" };
  if (n.includes("pakistan")) return { icon: Globe,        color: "text-[#1E3A8A]" };
  if (n.includes("computer") || n.includes("cs"))
                               return { icon: Cpu,         color: "text-[#1E3A8A]" };
  return                             { icon: Calculator,   color: "text-[#1E3A8A]" };
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
   INLINE VIDEO PLAYER  (YouTube-style, keeps sidebar)
   video on left | related papers list on right (scrollable)
═══════════════════════════════════════════════════════ */
interface InlineVideoPlayerProps {
  paper        : Paper;
  allPapers    : Paper[];
  onClose      : () => void;
  onSelectPaper: (p: Paper) => void;
  onDownload   : (p: Paper) => void;
}

const InlineVideoPlayer = ({ paper, allPapers, onClose, onSelectPaper }: InlineVideoPlayerProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setError(null);
    setVideoSrc(null);
    if (paper.videoUrl) setVideoSrc(paper.videoUrl);
    else setError("No video available for this paper.");
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
        <ChevronLeft size={16} /> Back to Papers
      </button>

      {/* YouTube-style layout */}
      <div className="flex flex-col xl:flex-row gap-5">

        {/* ── Left: Video + info ── */}
        <div className="flex-1 min-w-0">
          {/* Video player */}
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
                    <ExternalLink size={15} /> Open in New Tab
                  </button>
                )}
                <button
                  onClick={() => { setError(null); setVideoSrc(paper.videoUrl); }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-semibold transition-colors"
                >Retry</button>
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
                  setError(`Video error ${ve.error?.code ?? 0}: ${ve.error?.message ?? "Unknown"}.`);
                }}
              />
            )}
          </div>

          {/* Paper info below video */}
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{paper.year}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${typeColor(paper.paperType)}`}>{paper.paperType}</span>
            </div>
            <h1 className="text-[20px] font-black text-[#0F172A] leading-tight mb-2">{paper.title}</h1>
            <div className={`flex items-center gap-1.5 mb-3 ${meta.color}`}>
              <Icon size={13} strokeWidth={2} /><span className="text-[12px] font-bold">{paper.subjectName}</span>
            </div>
            {paper.description && (
              <p className="text-slate-500 text-[13px] leading-relaxed mb-4">{paper.description}</p>
            )}
            <div className="flex flex-wrap gap-3">
              {paper.videoUrl && (
                <button
                  onClick={() => window.open(paper.videoUrl!, "_blank", "noopener,noreferrer")}
                  className="flex items-center gap-2 border border-slate-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] text-slate-600 text-[13px] font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <ExternalLink size={14} /> Open in Tab
                </button>
              )}
              {/* ✅ Static non-clickable Download PDF in video player */}
              <div className="flex items-center gap-2 border border-slate-200 text-slate-400 text-[13px] font-bold py-2.5 px-4 rounded-xl bg-white pointer-events-none select-none cursor-default">
                <Download size={14} /> Download PDF
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Scrollable related papers ── */}
        <div className="xl:w-[340px] shrink-0 flex flex-col gap-3 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto xl:pr-1">
          <h2 className="text-[14px] font-black text-[#0F172A] px-1">
            More Papers <span className="text-slate-400 font-semibold">({related.length})</span>
          </h2>
          {related.map((rp) => {
            const rm = getSubjectMeta(rp.subjectName);
            const RI = rm.icon;
            return (
              <button
                key={rp.id}
                onClick={() => onSelectPaper(rp)}
                className="flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-3 hover:border-[#1E3A8A] hover:shadow-sm transition-all text-left w-full"
              >
                {/* Thumbnail */}
                <div className="w-[110px] shrink-0 rounded-lg bg-slate-200 overflow-hidden relative" style={{ aspectRatio: "16/9" }}>
                  <img src={physicsBanner} alt="" className="w-full h-full object-cover opacity-70"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle size={20} className="text-white drop-shadow" />
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-black text-[#0F172A] leading-snug line-clamp-2 mb-1">{rp.title}</p>
                  <div className={`flex items-center gap-1 ${rm.color}`}>
                    <RI size={10} strokeWidth={2} /><span className="text-[11px] font-semibold truncate">{rp.subjectName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold text-slate-400">{rp.year}</span>
                    <span className="text-slate-300">·</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${typeColor(rp.paperType)}`}>{rp.paperType}</span>
                  </div>
                </div>
              </button>
            );
          })}
          {related.length === 0 && (
            <p className="text-slate-400 text-[13px] px-1">No other papers available.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { label: "Home",           icon: Home,        path: "/"            },
  { label: "Video Lectures", icon: MonitorPlay, path: "/class/10/subject/27"    },
  { label: "Assessments",    icon: Clipboard,   path: "/assessment/1" },
  { label: "Past Papers",    icon: BookMarked,  path: "/class/10/subject/27/past-papers" },
];
const SidebarContent = ({ activePath, onNavClick }: { activePath: string; onNavClick?: () => void }) => {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); onNavClick?.(); };

  return (
    <div className="flex flex-col h-full">
      {/* ─── Added Course Manager Header ─── */}
      <div className="px-6 pt-7 pb-5 border-b border-slate-100">
        <p className="text-[#1E3A8A] font-extrabold text-[16px] leading-tight">Course Manager</p>
        <p className="text-slate-400 text-[12px] mt-0.5">Academic Session 2024</p>
      </div>

      <nav className="flex-1 px-3 pt-4 pb-2 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = path.includes("past-papers") ? activePath.includes("past-papers") : activePath === path;
          return (
            <button key={label} onClick={() => nav(path)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-150 text-left ${
                active ? "bg-[#E8EEF8] text-[#1E3A8A]" : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.7} className={active ? "text-[#1E3A8A]" : "text-slate-400"} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      
      <div className="px-3 pb-6 pt-4 border-t border-slate-200/60">
        <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-slate-500 hover:bg-white/60 hover:text-slate-700 transition-all">
          <Settings size={20} strokeWidth={1.7} className="text-slate-400" /><span>Settings</span>
        </button>
      </div>
    </div>
  );
};

const DesktopSidebar = ({ activePath }: { activePath: string }) => (
  <aside className="hidden lg:flex w-[280px] shrink-0 h-screen sticky top-0 bg-[#EEF2F7] border-r border-slate-200/80 flex-col">
    <SidebarContent activePath={activePath} />
  </aside>
);

const MobileNav = ({ activePath }: { activePath: string }) => {
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
        <p className="text-[#1E3A8A] font-black text-[14px]">Learning Center</p>
      </header>
      <AnimatePresence>
        {open && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div key="drawer" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 320, damping: 32 }} className="lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-[#EEF2F7] border-r border-slate-200 shadow-2xl flex flex-col">
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors z-10"><X size={18} /></button>
              <SidebarContent activePath={activePath} onNavClick={() => setOpen(false)} />
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
const Dropdown = ({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) => {
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
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <button onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white text-[14px] font-medium transition-all ${open ? "border-[#1E3A8A] shadow-sm" : "border-slate-200 hover:border-slate-300"} text-slate-800`}
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
                  className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors ${opt.value === value ? "bg-[#1E3A8A] text-white" : "text-slate-700 hover:bg-slate-50"}`}
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
   FEATURED CARD  (col-span-2)
   ✅ Image has paper title text + white fade from bottom
   ✅ Download PDF is purely static/decorative (non-clickable)
═══════════════════════════════════════════════════════ */
const FeaturedCard = ({ paper, onWatch }: { paper: Paper; onWatch: (p: Paper) => void }) => {
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;
  const tc   = typeColor(paper.paperType);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="col-span-1 sm:col-span-2 bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      {/* Image area with overlaid text + white shadow from bottom */}
      <div className="relative w-full overflow-hidden bg-[#050a14]" style={{ aspectRatio: "16/6" }}>
        <img
          src={physicsBanner} alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* Dark overlay top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        {/* White gradient fade from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />

        {/* Year + type badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <span className="bg-black/30 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">{paper.year}</span>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tc}`}>{paper.paperType}</span>
        </div>

        {/* Title text overlaid on image, near bottom */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <p className="text-[#0F172A] text-[18px] sm:text-[20px] font-black leading-snug drop-shadow-sm line-clamp-2">
            {paper.title}
          </p>
        </div>
      </div>

      {/* Content below image */}
      <div className="flex flex-col p-5 gap-4">
        <div className={`flex items-center gap-2 ${meta.color}`}>
          <Icon size={13} strokeWidth={2} />
          <span className="text-[13px] font-bold">{paper.subjectName}</span>
        </div>
        {paper.description && (
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">{paper.description}</p>
        )}
        {/* Watch Video clickable | Download PDF static/decorative */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => onWatch(paper)}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[13px] font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <PlayCircle size={15} /> Watch Video Explanation
          </button>
          {/* ✅ Static non-clickable Download PDF */}
          <div className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-400 text-[13px] font-bold py-3 px-4 rounded-xl bg-white pointer-events-none select-none cursor-default">
            <Download size={14} /> Download PDF
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   COMPACT CARD  (1 col)
   ✅ Taller thumbnail (16/9)
   ✅ More content padding (p-5 gap-4)
   ✅ Download PDF is purely static/decorative (non-clickable)
═══════════════════════════════════════════════════════ */
const CompactCard = ({ paper, onWatch, delay = 0 }: { paper: Paper; onWatch: (p: Paper) => void; delay?: number }) => {
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;
  const tc   = typeColor(paper.paperType);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      {/* Taller thumbnail: 16/9 */}
      <div className="relative w-full overflow-hidden bg-[#050a14]" style={{ aspectRatio: "16/9" }}>
        <img
          src={physicsBanner} alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        {/* White fade from bottom */}
        

        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">{paper.year}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tc}`}>{paper.paperType}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <p className="text-[#0F172A] text-[13px] font-black leading-snug line-clamp-2">{paper.title}</p>
        </div>
      </div>

      {/* More padding and gap for breathing room */}
      <div className="flex flex-col p-5 gap-4 flex-1">
        <div className={`flex items-center gap-1.5 ${meta.color}`}>
          <Icon size={12} strokeWidth={2} /><span className="text-[11px] font-bold">{paper.subjectName}</span>
        </div>
        {paper.description && (
          <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 flex-1">{paper.description}</p>
        )}
        {/* Watch Video clickable | Download PDF static/decorative */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => onWatch(paper)}
            className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[12px] font-bold py-2.5 px-4 rounded-xl transition-colors"
          >
            <PlayCircle size={13} /> Watch Video
          </button>
          {/* ✅ Static non-clickable Download PDF */}
          <div className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-400 text-[12px] font-bold py-2.5 px-4 rounded-xl bg-white pointer-events-none select-none cursor-default">
            <Download size={12} /> Download PDF
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   YEAR SECTION HEADING
═══════════════════════════════════════════════════════ */
const YearHeading = ({ year, count }: { year: string; count: number }) => (
  <div className="flex items-center gap-4 mb-6 mt-2">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center shrink-0">
        <CalendarDays size={15} className="text-white" strokeWidth={2} />
      </div>
      <h2 className="text-[22px] font-black text-[#0F172A] tracking-tight">{year} Past Papers</h2>
    </div>
    <span className="text-[12px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
      {count} {count === 1 ? "paper" : "papers"}
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
═══════════════════════════════════════════════════════ */
const PastPapersPage = () => {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const lang     = getLanguage();
  const isUrdu   = lang === "ur";

  const gradeType   = location.state?.gradeType;
  const classTitle  = location.state?.classTitle  || `Grade ${classId}`;
  const subjectName = location.state?.subjectName || location.state?.selectedSubject?.name || "Subject";

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter,    setYearFilter]    = useState("all");
  const [typeFilter,    setTypeFilter]    = useState("all");
  const [applied,       setApplied]       = useState({ subject: "all", year: "all", type: "all" });

  const [papers,     setPapers]     = useState<Paper[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(false);

  /* Video state — inline, not full-screen overlay */
  const [activeVideo, setActiveVideo] = useState<Paper | null>(null);

  useEffect(() => {
    if (!classId || !subjectId) return;
    let cancelled = false;
    (async () => {
      setLoading(true); setFetchError(false);
      try {
        const res = await fetch(`${BASE}/pastpapers?class_id=${classId}&subject_id=${subjectId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rawList: PastPaperRaw[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setPapers(rawList.map((r) => normalisePaper(r, subjectName)));
      } catch (err) {
        console.error("PastPapers fetch error:", err);
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [classId, subjectId, subjectName]);

  const subjectOptions = useMemo(() => {
    const names = Array.from(new Set(papers.map((p) => p.subjectName))).sort();
    return [{ value: "all", label: "All Subjects" }, ...names.map((n) => ({ value: n, label: n }))];
  }, [papers]);
  const yearOptions = useMemo(() => {
    const years = Array.from(new Set(papers.map((p) => p.year))).sort((a, b) => Number(b) - Number(a));
    return [{ value: "all", label: "All Years" }, ...years.map((y) => ({ value: y, label: y }))];
  }, [papers]);
  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(papers.map((p) => p.paperType))).sort();
    return [{ value: "all", label: "All Types" }, ...types.map((t) => ({ value: t, label: t }))];
  }, [papers]);

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

  /* When Watch Video clicked → show inline player, scroll to top */
  const handleWatch = useCallback((paper: Paper) => {
    setActiveVideo(paper);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* ════════════ RENDER ════════════ */
  return (
    <section className="bg-[#EEF2F7] min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar always visible */}
      <DesktopSidebar activePath={location.pathname} />
      <MobileNav activePath={location.pathname} />

      {/* Reduced horizontal padding: px-3 sm:px-4 */}
     <main className="flex-1 min-w-0 overflow-x-hidden">
  <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-10 py-8">
          

          {/* Breadcrumb */}
          <div className="text-sm text-slate-400 flex items-center gap-1.5 mb-6 flex-wrap">
            <Link to="/" className="hover:text-slate-600 transition-colors">{isUrdu ? "ہوم" : "Home"}</Link>
            <ChevronRight size={13} className="text-slate-300" />
            <Link to={`/class/${classId}`} state={{ gradeType }} className="hover:text-slate-600 transition-colors">{classTitle}</Link>
            <ChevronRight size={13} className="text-slate-300" />
            <Link to={`/class/${classId}/subject/${subjectId}`} state={{ gradeType, selectedSubject: location.state?.selectedSubject, classTitle }} className="hover:text-slate-600 transition-colors">{subjectName}</Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-slate-700 font-semibold">Past Papers</span>
          </div>
         

          {/* Show inline video player OR papers list */}
          <AnimatePresence mode="wait">
            {activeVideo ? (
              <InlineVideoPlayer
                key="video"
                paper={activeVideo}
                allPapers={papers}
                onClose={() => setActiveVideo(null)}
                onSelectPaper={(p) => { setActiveVideo(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onDownload={() => {}}
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
                <div className="mb-7">
                  <h1 className="text-[28px] sm:text-[34px] font-black text-[#0F172A] tracking-tight leading-none mb-2">
                    Past Paper Solutions
                  </h1>
                  <p className="text-slate-500 text-[14px] leading-relaxed max-w-2xl">
                    Watch detailed video explanations from top educators or download full PDF solutions for offline study.
                  </p>
                </div>

                {/* Filter bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-7 shadow-sm">
                  <div className="flex flex-wrap gap-4 items-end">
                    <Dropdown label="Subject Area"  value={subjectFilter} options={subjectOptions} onChange={setSubjectFilter} />
                    <Dropdown label="Academic Year" value={yearFilter}    options={yearOptions}    onChange={setYearFilter}    />
                    <Dropdown label="Paper Type"    value={typeFilter}    options={typeOptions}    onChange={setTypeFilter}    />
                    <button onClick={applyFilters} className="flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[14px] font-bold px-6 py-3 rounded-xl transition-colors shrink-0 self-end">
                      <SlidersHorizontal size={16} /> Apply Filters
                    </button>
                  </div>
                  {hasActive && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
                      {applied.subject !== "all" && (
                        <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                          {applied.subject}
                          <button onClick={() => { setSubjectFilter("all"); setApplied((p) => ({ ...p, subject: "all" })); }} className="hover:text-red-500 font-black">×</button>
                        </span>
                      )}
                      {applied.year !== "all" && (
                        <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                          {applied.year}
                          <button onClick={() => { setYearFilter("all"); setApplied((p) => ({ ...p, year: "all" })); }} className="hover:text-red-500 font-black">×</button>
                        </span>
                      )}
                      {applied.type !== "all" && (
                        <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                          {applied.type}
                          <button onClick={() => { setTypeFilter("all"); setApplied((p) => ({ ...p, type: "all" })); }} className="hover:text-red-500 font-black">×</button>
                        </span>
                      )}
                      <button onClick={clearAll} className="text-[12px] font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1">Clear all</button>
                    </div>
                  )}
                </div>

                {!loading && !fetchError && (
                  <p className="text-[13px] text-slate-400 font-medium mb-5">
                    {filteredPapers.length === 0 ? "No papers found" : `${filteredPapers.length} paper${filteredPapers.length !== 1 ? "s" : ""} found`}
                  </p>
                )}

                {fetchError && !loading && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle size={40} className="text-red-400 mb-4" strokeWidth={1.5} />
                    <h2 className="text-xl font-black text-slate-900 mb-2">Failed to load papers</h2>
                    <p className="text-slate-500 text-[14px] mb-5">Could not connect to the server. Please check your connection and try again.</p>
                    <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-[#1E3A8A] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e40af] transition-colors">Retry</button>
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
                      <h2 className="text-2xl font-black text-slate-900 mb-3">No papers found</h2>
                      <p className="text-slate-500 max-w-sm leading-relaxed text-[15px]">Try adjusting your filters or check back soon.</p>
                      <button onClick={clearAll} className="mt-6 px-5 py-2.5 bg-[#1E3A8A] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e40af] transition-colors">Clear Filters</button>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div key={JSON.stringify(applied)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-12">
                        {yearGroups.map((group, groupIdx) => {
                          const isFirstGroup = groupIdx === 0;
                          return (
                            <section key={group.year}>
                              <YearHeading year={group.year} count={group.papers.length} />
                              {isFirstGroup ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <FeaturedCard paper={group.papers[0]} onWatch={handleWatch} />
                                    {group.papers[1] && (
                                      <CompactCard paper={group.papers[1]} onWatch={handleWatch} delay={0.05} />
                                    )}
                                  </div>
                                  {group.papers.slice(2).length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                      {group.papers.slice(2).map((paper, i) => (
                                        <CompactCard key={paper.id} paper={paper} onWatch={handleWatch} delay={i * 0.04} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                  {group.papers.map((paper, i) => (
                                    <CompactCard key={paper.id} paper={paper} onWatch={handleWatch} delay={i * 0.04} />
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