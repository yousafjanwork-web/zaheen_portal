/**
 * PastPapersPage.tsx  ·  Revised
 * ================================
 * Fixes:
 *  1. Video  — exhaustive response-shape handling + smart CDN URL builder
 *  2. PDF    — smart URL builder (no double-slash, handles absolute URLs)
 *  3. UI     — YouTube-style full video player: sidebar hidden, related papers right panel
 *
 * Route: /class/:classId/subject/:subjectId/past-papers
 *
 * API:
 *  Papers list : GET /api/pastpapers?class_id={classId}&subject_id={subjectId}
 *                → { data: PastPaperRaw[] }  OR  PastPaperRaw[]
 *  Video       : GET /api/playwsvideo/{id}
 *                → many possible shapes — we walk all keys recursively
 *  PDF         : https://cdn.zaheen.com.pk/{file_path}  (no double-slash)
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
  BookMarked, X, Loader2, AlertCircle, Menu, Clipboard,
  ArrowLeft, ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import physicsBanner from "../../../assets/images/physics.png";

/* ─── API ──────────────────────────────────────────────── */
const BASE = "https://api.zaheen.com.pk/api";
const CDN  = "https://cdn.zaheen.com.pk";

/* ─── Build a safe media URL ───────────────────────────── */
function buildMediaUrl(raw: string): string {
  if (!raw) return "";
  // Already absolute
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  // Relative — join with CDN, avoid double-slash
  return `${CDN}/${raw.replace(/^\/+/, "")}`;
}

/* ─── Walk an unknown object for the first video URL ───── */
const VIDEO_KEYS = [
  "url", "video_url", "path", "file_path", "stream_url",
  "hls_url", "mp4_url", "link", "src", "source",
];

function extractVideoUrl(obj: any, depth = 0): string | null {
  if (!obj || typeof obj !== "object" || depth > 6) return null;
  for (const key of VIDEO_KEYS) {
    const val = obj[key];
    if (typeof val === "string" && val.length > 4) return val;
  }
  for (const val of Object.values(obj)) {
    if (typeof val === "object") {
      const found = extractVideoUrl(val, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

/* ═══ Raw + Normalised types ════════════════════════════ */
interface PastPaperRaw {
  id          : number;
  year        : number | string;
  file_path  ?: string;
  title      ?: string;
  name       ?: string;
  paper_type ?: string;
  type       ?: string;
  description?: string;
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
}

function normalisePaper(raw: PastPaperRaw, fallbackSubject: string): Paper {
  const year        = String(raw.year ?? "");
  const subjectName = raw.subject_name || fallbackSubject;
  const paperType   = raw.paper_type || raw.type || "Past Paper";
  const title       = raw.title || raw.name || `${year} ${subjectName} ${paperType}`;
  const description = raw.description || "";
  const pdfUrl      = raw.file_path ? buildMediaUrl(raw.file_path) : null;
  return { id: raw.id, year, title, subjectName, paperType, description, pdfUrl };
}

/* ═══ Subject helpers ═══════════════════════════════════ */
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
   YOUTUBE-STYLE VIDEO PLAYER PAGE
   Replaces the entire layout (sidebar hidden, full-width player)
   "Related" papers shown in a right sidebar
═══════════════════════════════════════════════════════ */
interface VideoPlayerPageProps {
  paper        : Paper;
  allPapers    : Paper[];
  onClose      : () => void;
  onSelectPaper: (p: Paper) => void;
  onDownload   : (p: Paper) => void;
}

const VideoPlayerPage = ({
  paper, allPapers, onClose, onSelectPaper, onDownload,
}: VideoPlayerPageProps) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── Fetch video URL ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setVideoSrc(null);

    (async () => {
      try {
        const res = await fetch(`${BASE}/playwsvideo/${paper.id}`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status} ${res.statusText}`);
        }

        let data: any;
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          data = await res.json();
        } else {
          // Some APIs return plain text URL
          const text = await res.text();
          if (text.startsWith("http") || text.includes("/")) {
            data = { url: text.trim() };
          } else {
            data = JSON.parse(text);
          }
        }

        if (cancelled) return;

        // Walk the response object for any video-like URL
        const raw = extractVideoUrl(data);

        if (raw) {
          const src = buildMediaUrl(raw);
          setVideoSrc(src);
        } else {
          // Log full response so developer can see what the API actually returns
          console.error("[PastPapers] Could not find video URL in response:", JSON.stringify(data, null, 2));
          setError("Video URL not found in server response. Check console for details.");
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("[PastPapers] Video fetch error:", err);
          setError(err?.message || "Failed to load video.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [paper.id]);

  /* ── Escape key ── */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const related = allPapers.filter((p) => p.id !== paper.id);
  const meta    = getSubjectMeta(paper.subjectName);
  const Icon    = meta.icon;

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0f1a] flex flex-col overflow-hidden">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-semibold"
        >
          <ChevronLeft size={18} />
          Back to Papers
        </button>
        <div className="w-px h-5 bg-white/20 mx-1" />
        <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-black">EP</span>
        </div>
        <span className="text-white font-bold text-sm truncate">{paper.title}</span>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: video + info ── */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">

          {/* Video player */}
          <div className="w-full bg-black" style={{ aspectRatio: "16/9" }}>
            {loading && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/50">
                <Loader2 size={44} className="animate-spin" />
                <p className="text-sm font-medium">Loading video…</p>
              </div>
            )}

            {error && !loading && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/60 px-6 text-center">
                <AlertCircle size={44} />
                <p className="text-sm font-semibold max-w-md leading-relaxed">{error}</p>
                <p className="text-xs text-white/30">Paper ID: {paper.id}</p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => { setLoading(true); setError(null); }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {videoSrc && !loading && !error && (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full"
                onError={(e) => {
                  const ve = e.target as HTMLVideoElement;
                  const msg = ve.error
                    ? `Video error ${ve.error.code}: ${ve.error.message}`
                    : "Video failed to play.";
                  console.error("[PastPapers] Video playback error:", msg, "src:", videoSrc);
                  setError(`${msg}\nURL tried: ${videoSrc}`);
                }}
              />
            )}
          </div>

          {/* Paper info below player */}
          <div className="px-5 py-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-white/70">
                {paper.year}
              </span>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${typeColor(paper.paperType)}`}>
                {paper.paperType}
              </span>
            </div>

            <h1 className="text-[20px] sm:text-[24px] font-black leading-tight mb-2 text-white">
              {paper.title}
            </h1>

            <div className={`flex items-center gap-1.5 mb-4 ${meta.color}`}>
              <Icon size={14} strokeWidth={2} />
              <span className="text-[13px] font-bold">{paper.subjectName}</span>
            </div>

            {paper.description && (
              <p className="text-white/55 text-[14px] leading-relaxed mb-5 max-w-3xl">
                {paper.description}
              </p>
            )}

            <button
              onClick={() => onDownload(paper)}
              disabled={!paper.pdfUrl}
              className="flex items-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold py-2.5 px-5 rounded-xl transition-colors"
            >
              <Download size={15} />
              Download PDF
            </button>
          </div>
        </div>

        {/* ── Right: related papers ── */}
        <aside className="w-[360px] shrink-0 border-l border-white/10 overflow-y-auto hidden lg:flex flex-col">
          <div className="px-4 py-4 border-b border-white/10">
            <h2 className="text-white font-bold text-[14px]">More Papers</h2>
            <p className="text-white/40 text-[12px] mt-0.5">{related.length} papers available</p>
          </div>

          <div className="flex flex-col divide-y divide-white/5">
            {related.map((rp) => {
              const rm = getSubjectMeta(rp.subjectName);
              const RI = rm.icon;
              return (
                <button
                  key={rp.id}
                  onClick={() => onSelectPaper(rp)}
                  className="flex items-start gap-3 px-4 py-4 hover:bg-white/5 transition-colors text-left w-full"
                >
                  {/* Thumbnail placeholder */}
                  <div className="w-[120px] shrink-0 rounded-lg bg-[#1a2540] overflow-hidden relative"
                    style={{ aspectRatio: "16/9" }}>
                    <img
                      src={physicsBanner}
                      alt=""
                      className="w-full h-full object-cover opacity-60"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle size={22} className="text-white/80" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-bold leading-snug line-clamp-2 mb-1.5">
                      {rp.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-white/50">
                      <RI size={11} strokeWidth={2} />
                      <span className="text-[11px] font-semibold truncate">{rp.subjectName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-bold text-white/40">{rp.year}</span>
                      <span className="text-white/20">·</span>
                      <span className="text-[10px] font-bold text-white/40">{rp.paperType}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {related.length === 0 && (
              <div className="px-4 py-8 text-center text-white/30 text-sm">
                No other papers available.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
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

interface SidebarContentProps {
  activePath: string;
  onNavClick?: () => void;
}

const SidebarContent = ({ activePath, onNavClick }: SidebarContentProps) => {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); onNavClick?.(); };

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1E3A8A] flex items-center justify-center shrink-0">
            <span className="text-white text-[15px] font-black">EP</span>
          </div>
          <div>
            <p className="text-[#1E3A8A] font-black text-[15px] leading-tight">Learning Center</p>
            <p className="text-[#1E3A8A]/55 text-[12px] font-semibold mt-0.5">Academic Excellence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active =
            path.includes("past-papers")
              ? activePath.includes("past-papers")
              : activePath === path;
          return (
            <button key={label} onClick={() => nav(path)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-150 text-left ${
                active
                  ? "bg-[#E8EEF8] text-[#1E3A8A]"
                  : "text-slate-500 hover:bg-white/60 hover:text-slate-700"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.7}
                className={active ? "text-[#1E3A8A]" : "text-slate-400"} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6 pt-4 border-t border-slate-200/60">
        <button className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-[15px] font-semibold text-slate-500 hover:bg-white/60 hover:text-slate-700 transition-all">
          <Settings size={20} strokeWidth={1.7} className="text-slate-400" />
          <span>Settings</span>
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
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="lg:hidden sticky top-0 z-40 bg-[#EEF2F7] border-b border-slate-200 flex items-center gap-3 px-4 py-3.5">
        <button onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
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
            <motion.div key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div key="drawer"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] bg-[#EEF2F7] border-r border-slate-200 shadow-2xl flex flex-col"
            >
              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors z-10">
                <X size={18} />
              </button>
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
interface DropdownProps {
  label   : string;
  value   : string;
  options : { value: string; label: string }[];
  onChange: (v: string) => void;
}

const Dropdown = ({ label, value, options, onChange }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5 min-w-[160px] flex-1" ref={ref}>
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white text-[14px] font-medium transition-all ${
            open ? "border-[#1E3A8A] shadow-sm" : "border-slate-200 hover:border-slate-300"
          } text-slate-800`}
        >
          <span className="truncate">{selected?.label || "Select"}</span>
          <ChevronDown size={15} className={`text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto"
            >
              {options.map((opt) => (
                <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-colors ${
                    opt.value === value ? "bg-[#1E3A8A] text-white" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
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
  paper     : Paper;
  onWatch   : (p: Paper) => void;
  onDownload: (p: Paper) => void;
}

const FeaturedCard = ({ paper, onWatch, onDownload }: FeaturedCardProps) => {
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;
  const tc   = typeColor(paper.paperType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="col-span-full bg-white rounded-2xl border border-slate-200 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Banner */}
        <div className="relative lg:w-[480px] shrink-0 min-h-[240px] lg:min-h-[300px] overflow-hidden bg-[#050a14]">
          <img src={physicsBanner} alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-85"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white via-white/25 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-[72px] left-5 flex items-center gap-2 z-10">
            <span className="bg-white/15 backdrop-blur-sm text-white text-[12px] font-bold px-3 py-1 rounded-full border border-white/20">
              {paper.year}
            </span>
            <span className={`text-[12px] font-bold px-3 py-1.5 rounded-full ${tc}`}>{paper.paperType}</span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 z-10">
            <p className="text-white text-[18px] sm:text-[20px] font-black leading-tight drop-shadow-lg">
              {paper.title}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-7 lg:p-9 justify-between gap-5">
          <div className={`flex items-center gap-2 ${meta.color}`}>
            <Icon size={16} strokeWidth={2} />
            <span className="text-[14px] font-bold">{paper.subjectName}</span>
          </div>
          <div>
            <h2 className="text-[22px] lg:text-[26px] font-black text-[#0F172A] leading-tight mb-3">
              {paper.title}
            </h2>
            {paper.description && (
              <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-4">{paper.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button onClick={() => onWatch(paper)}
              className="flex-1 flex items-center justify-center gap-2.5 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[14px] font-bold py-3.5 px-5 rounded-xl transition-colors">
              <PlayCircle size={18} />
              Watch Video Explanation
            </button>
            <button onClick={() => onDownload(paper)} disabled={!paper.pdfUrl}
              className="flex-1 flex items-center justify-center gap-2.5 border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed text-[14px] font-bold py-3.5 px-5 rounded-xl transition-colors bg-white">
              <Download size={17} />
              Download PDF
            </button>
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
  paper     : Paper;
  onWatch   : (p: Paper) => void;
  onDownload: (p: Paper) => void;
  delay?    : number;
}

const CompactCard = ({ paper, onWatch, onDownload, delay = 0 }: CompactCardProps) => {
  const meta = getSubjectMeta(paper.subjectName);
  const Icon = meta.icon;
  const tc   = typeColor(paper.paperType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{paper.year}</span>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${tc}`}>{paper.paperType}</span>
      </div>
      <div className={`flex items-center gap-1.5 ${meta.color}`}>
        <Icon size={14} strokeWidth={2} />
        <span className="text-[13px] font-bold">{paper.subjectName}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-[17px] font-black text-[#0F172A] leading-snug mb-2">{paper.title}</h3>
        {paper.description && (
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">{paper.description}</p>
        )}
      </div>
      <div className="flex flex-col gap-2.5 pt-1 mt-auto">
        <button onClick={() => onWatch(paper)}
          className="w-full flex items-center justify-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[13px] font-bold py-3 px-4 rounded-xl transition-colors">
          <PlayCircle size={16} />
          Watch Video
        </button>
        <button onClick={() => onDownload(paper)} disabled={!paper.pdfUrl}
          className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 text-[13px] font-bold py-3 px-4 rounded-xl transition-colors bg-white">
          <Download size={15} />
          Download PDF
        </button>
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════
   SKELETONS
═══════════════════════════════════════════════════════ */
const FeaturedSkeleton = () => (
  <div className="col-span-full bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col lg:flex-row">
    <div className="lg:w-[480px] min-h-[240px] lg:min-h-[300px] bg-slate-200 shrink-0" />
    <div className="flex-1 p-9 space-y-4">
      <div className="h-4 w-24 bg-slate-200 rounded" />
      <div className="h-8 w-3/4 bg-slate-200 rounded" />
      <div className="h-4 w-full bg-slate-200 rounded" />
      <div className="h-4 w-4/5 bg-slate-200 rounded" />
      <div className="flex gap-3 pt-4">
        <div className="h-12 flex-1 bg-slate-200 rounded-xl" />
        <div className="h-12 flex-1 bg-slate-200 rounded-xl" />
      </div>
    </div>
  </div>
);

const CompactSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse space-y-3">
    <div className="flex gap-2">
      <div className="h-6 w-14 bg-slate-200 rounded-full" />
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </div>
    <div className="h-3 w-24 bg-slate-200 rounded" />
    <div className="h-5 w-3/4 bg-slate-200 rounded" />
    <div className="h-4 w-full bg-slate-200 rounded" />
    <div className="h-4 w-4/5 bg-slate-200 rounded" />
    <div className="space-y-2 pt-2">
      <div className="h-11 bg-slate-200 rounded-xl" />
      <div className="h-11 bg-slate-200 rounded-xl" />
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

  /* ── Filters ── */
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [yearFilter,    setYearFilter]    = useState("all");
  const [typeFilter,    setTypeFilter]    = useState("all");
  const [applied,       setApplied]       = useState({ subject: "all", year: "all", type: "all" });

  /* ── Data ── */
  const [papers,     setPapers]     = useState<Paper[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(false);

  /* ── Video player ── */
  const [activeVideo, setActiveVideo] = useState<Paper | null>(null);

  /* ── Fetch papers ── */
  useEffect(() => {
    if (!classId || !subjectId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const res = await fetch(
          `${BASE}/pastpapers?class_id=${classId}&subject_id=${subjectId}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rawList: PastPaperRaw[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];
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

  /* ── Filter options ── */
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

  /* ── Filtered papers ── */
  const filteredPapers = useMemo(() => papers.filter((p) => {
    if (applied.subject !== "all" && p.subjectName !== applied.subject) return false;
    if (applied.year    !== "all" && p.year        !== applied.year)    return false;
    if (applied.type    !== "all" && p.paperType   !== applied.type)    return false;
    return true;
  }), [papers, applied]);

  const applyFilters = () => setApplied({ subject: subjectFilter, year: yearFilter, type: typeFilter });
  const clearAll = () => {
    setSubjectFilter("all"); setYearFilter("all"); setTypeFilter("all");
    setApplied({ subject: "all", year: "all", type: "all" });
  };
  const hasActive = applied.subject !== "all" || applied.year !== "all" || applied.type !== "all";

  /* ── Handlers ── */
  const handleWatch    = useCallback((paper: Paper) => { setActiveVideo(paper); }, []);
  const handleDownload = useCallback((paper: Paper) => {
    if (paper.pdfUrl) {
      window.open(paper.pdfUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("PDF not available yet for this paper.");
    }
  }, []);

  const featuredPaper = filteredPapers[0] ?? null;
  const restPapers    = filteredPapers.slice(1);

  /* ════════════ RENDER ════════════ */
  return (
    <>
      {/* YouTube-style full video player — overlays everything */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            key={activeVideo.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <VideoPlayerPage
              paper={activeVideo}
              allPapers={papers}
              onClose={() => setActiveVideo(null)}
              onSelectPaper={(p) => setActiveVideo(p)}
              onDownload={handleDownload}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-[#EEF2F7] min-h-screen flex flex-col lg:flex-row">
        <DesktopSidebar activePath={location.pathname} />
        <MobileNav activePath={location.pathname} />

        <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-10 py-10 overflow-x-hidden">

          {/* Breadcrumb */}
          <div className="text-sm text-slate-400 flex items-center gap-1.5 mb-7 flex-wrap">
            <Link to="/" className="hover:text-slate-600 transition-colors">
              {isUrdu ? "ہوم" : "Home"}
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <Link to={`/class/${classId}`} state={{ gradeType }}
              className="hover:text-slate-600 transition-colors">
              {classTitle}
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <Link to={`/class/${classId}/subject/${subjectId}`}
              state={{ gradeType, selectedSubject: location.state?.selectedSubject, classTitle }}
              className="hover:text-slate-600 transition-colors">
              {subjectName}
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-slate-700 font-semibold">Past Papers</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[34px] sm:text-[40px] font-black text-[#0F172A] tracking-tight leading-none mb-3">
              Past Paper Solutions
            </h1>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-2xl">
              Access our comprehensive repository of past examination papers. Watch detailed
              video explanations from top educators or download full PDF solutions for offline study.
            </p>
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 shadow-sm">
            <div className="flex flex-wrap gap-4 items-end">
              <Dropdown label="Subject Area"  value={subjectFilter} options={subjectOptions} onChange={setSubjectFilter} />
              <Dropdown label="Academic Year" value={yearFilter}    options={yearOptions}    onChange={setYearFilter}    />
              <Dropdown label="Paper Type"    value={typeFilter}    options={typeOptions}    onChange={setTypeFilter}    />
              <button onClick={applyFilters}
                className="flex items-center gap-2 bg-[#1E3A8A] hover:bg-[#1e40af] text-white text-[14px] font-bold px-6 py-3 rounded-xl transition-colors shrink-0 self-end">
                <SlidersHorizontal size={16} />
                Apply Filters
              </button>
            </div>

            {hasActive && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active:</span>
                {applied.subject !== "all" && (
                  <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                    {applied.subject}
                    <button onClick={() => { setSubjectFilter("all"); setApplied((p) => ({ ...p, subject: "all" })); }}
                      className="hover:text-red-500 font-black">×</button>
                  </span>
                )}
                {applied.year !== "all" && (
                  <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                    {applied.year}
                    <button onClick={() => { setYearFilter("all"); setApplied((p) => ({ ...p, year: "all" })); }}
                      className="hover:text-red-500 font-black">×</button>
                  </span>
                )}
                {applied.type !== "all" && (
                  <span className="text-[12px] font-semibold bg-blue-50 text-[#1E3A8A] px-3 py-1 rounded-full flex items-center gap-1.5">
                    {applied.type}
                    <button onClick={() => { setTypeFilter("all"); setApplied((p) => ({ ...p, type: "all" })); }}
                      className="hover:text-red-500 font-black">×</button>
                  </span>
                )}
                <button onClick={clearAll}
                  className="text-[12px] font-semibold text-slate-400 hover:text-red-500 transition-colors ml-1">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          {!loading && !fetchError && (
            <p className="text-[13px] text-slate-400 font-medium mb-6">
              {filteredPapers.length === 0
                ? "No papers found"
                : `${filteredPapers.length} paper${filteredPapers.length !== 1 ? "s" : ""} found`}
            </p>
          )}

          {/* API error */}
          {fetchError && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle size={40} className="text-red-400 mb-4" strokeWidth={1.5} />
              <h2 className="text-xl font-black text-slate-900 mb-2">Failed to load papers</h2>
              <p className="text-slate-500 text-[14px] mb-5">
                Could not connect to the server. Please check your connection and try again.
              </p>
              <button onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#1E3A8A] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e40af] transition-colors">
                Retry
              </button>
            </div>
          )}

          {/* Papers grid */}
          {!fetchError && (
            loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <FeaturedSkeleton />
                {Array.from({ length: 5 }).map((_, i) => <CompactSkeleton key={i} />)}
              </div>

            ) : filteredPapers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-28 text-center"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                  <Clock size={36} className="text-slate-400" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-3">No papers found</h2>
                <p className="text-slate-500 max-w-sm leading-relaxed text-[15px]">
                  Try adjusting your filters or check back soon.
                </p>
                <button onClick={clearAll}
                  className="mt-6 px-5 py-2.5 bg-[#1E3A8A] text-white text-[13px] font-bold rounded-xl hover:bg-[#1e40af] transition-colors">
                  Clear Filters
                </button>
              </motion.div>

            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={JSON.stringify(applied)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {featuredPaper && (
                    <FeaturedCard paper={featuredPaper} onWatch={handleWatch} onDownload={handleDownload} />
                  )}
                  {restPapers.map((paper, i) => (
                    <CompactCard key={paper.id} paper={paper} onWatch={handleWatch} onDownload={handleDownload} delay={i * 0.04} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )
          )}
        </main>
      </section>
    </>
  );
};

export default PastPapersPage;