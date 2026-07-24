import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { classIdFromSlug } from "../../../config/classSlugs";
import { findSubjectBySlug } from "../../../config/subjectSlug";
import { gradeNumberFromSlug } from "../../../config/classSlugs";
import {
  ChevronDown, ChevronUp, Lock, CheckCircle2, PlayCircle,
  Clock, BookOpen, Gamepad2,
  ChevronRight, Target, Play, Edit3, Save, FileText,
  ClipboardList, GraduationCap, Zap, X, Menu,
  Sigma, Atom, Leaf, FlaskConical, Languages, Globe, Cpu, Landmark,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects, fetchVideoDetail } from "@/modules/shared/hooks/useClassSubjects";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useVideoProgress } from "../../shared/hooks/Usevideoprogress";   // ← same hook as KG / Primary

import heroDefault from "../../../assets/images/owls.png";

/* ─── Language hook ─── */
const useLang = () => {
  const [lang, setLang] = useState(() => getLanguage());
  useEffect(() => {
    const sync = () => setLang(getLanguage());
    window.addEventListener("storage", sync);
    window.addEventListener("languageChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("languageChange", sync);
    };
  }, []);
  return lang;
};

/* ─── Daily-goal constants & helpers ───
   There is no "minutes learned today" field coming from the API yet,
   so we track it locally: each newly-completed lesson adds a fixed
   chunk of minutes, capped at the goal, and it resets automatically
   on a new calendar day (via the date-stamped storage key). ─── */
const DAILY_GOAL_MINUTES = 20;
const MINUTES_PER_LESSON = 15;
const todayKey = () => `msv-daily-progress:${new Date().toISOString().slice(0, 10)}`;

/* ─── Subject theme ─── */
const getSubjectTheme = (name: string) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("physic"))
    return { color: "#1D4ED8", light: "#EFF6FF", pill: "#BFDBFE", heroTitle: { en: "Physics in Action", ur: "فزکس عمل میں" }, tagline: { en: "Explore forces, energy, and the laws that govern our universe through experiments and real-world examples.", ur: "تجربات اور حقیقی مثالوں کے ذریعے قوتوں، توانائی اور کائنات کے قوانین دریافت کریں۔" }, icon: Atom };
  if (n.includes("math"))
    return { color: "#7C3AED", light: "#F5F3FF", pill: "#DDD6FE", heroTitle: { en: "Math Mastery", ur: "ریاضی میں مہارت" }, tagline: { en: "Build problem-solving superpowers with algebra, geometry, and beyond. Logic meets creativity!", ur: "الجبرا، جیومیٹری اور مزید کے ساتھ مسئلہ حل کرنے کی مہارت بنائیں!" }, icon: Sigma };
  if (n.includes("chem"))
    return { color: "#059669", light: "#ECFDF5", pill: "#A7F3D0", heroTitle: { en: "Chemistry Lab", ur: "کیمسٹری لیب" }, tagline: { en: "Dive into atoms, molecules, and reactions. Science that you can see, smell, and feel!", ur: "ایٹموں، مالیکیولوں اور کیمیائی تعاملات میں غوطہ لگائیں۔" }, icon: FlaskConical };
  if (n.includes("bio"))
    return { color: "#16A34A", light: "#F0FDF4", pill: "#BBF7D0", heroTitle: { en: "Biology Explorer", ur: "بائیولوجی مہم جو" }, tagline: { en: "Journey through the living world — from cells to ecosystems. Life is amazing!", ur: "خلیوں سے ماحولیاتی نظام تک — زندگی کی حیرت انگیز دنیا دریافت کریں۔" }, icon: Leaf };
  if (n.includes("english"))
    return { color: "#0284C7", light: "#EFF6FF", pill: "#BAE6FD", heroTitle: { en: "English Excellence", ur: "انگریزی میں مہارت" }, tagline: { en: "Master grammar, literature, and writing skills that open doors to the world!", ur: "گرامر، ادب اور تحریری مہارت جو دنیا کے دروازے کھولیں!" }, icon: BookOpen };
  if (n.includes("urdu"))
    return { color: "#E11D48", light: "#FFF1F2", pill: "#FECDD3", heroTitle: { en: "Urdu Literature", ur: "اردو ادب" }, tagline: { en: "Explore the rich heritage of Urdu poetry, prose, and language.", ur: "اردو شاعری، نثر اور زبان کی بھرپور وراثت دریافت کریں۔" }, icon: Languages };
  if (n.includes("islamic"))
    return { color: "#0D9488", light: "#F0FDFA", pill: "#99F6E4", heroTitle: { en: "Islamic Studies", ur: "اسلامی تعلیمات" }, tagline: { en: "Strengthen faith, values, and moral character through guided learning.", ur: "رہنمائی شدہ تعلیم کے ذریعے ایمان، اقدار اور اخلاقی کردار مضبوط کریں۔" }, icon: Landmark };
  if (n.includes("pak") || n.includes("social"))
    return { color: "#EA580C", light: "#FFF7ED", pill: "#FED7AA", heroTitle: { en: "Pakistan Studies", ur: "پاکستان کا مطالعہ" }, tagline: { en: "Discover the history, geography, and culture of our beloved homeland.", ur: "ہمارے پیارے وطن کی تاریخ، جغرافیہ اور ثقافت دریافت کریں۔" }, icon: Globe };
  if (n.includes("computer") || n.includes("cs"))
    return { color: "#4338CA", light: "#EEF2FF", pill: "#C7D2FE", heroTitle: { en: "Computer Science", ur: "کمپیوٹر سائنس" }, tagline: { en: "Code, create, and innovate! Learn the language of the future.", ur: "کوڈ کریں، بنائیں اور جدت لائیں! مستقبل کی زبان سیکھیں۔" }, icon: Cpu };
  return { color: "#1E40AF", light: "#EFF6FF", pill: "#BFDBFE", heroTitle: { en: "Let's Learn!", ur: "آؤ سیکھیں!" }, tagline: { en: "Explore this subject and build your knowledge step by step.", ur: "اس مضمون کو دریافت کریں اور قدم بہ قدم اپنی معلومات بڑھائیں۔" }, icon: BookOpen };
};

/* ─── Types ─── */
interface Video {
  id: number; name: string; urdu_name?: string; path: string;
  desc?: string; urdu_desc?: string;
  thumbnailUrl?: string; thumbnail?: string; thumb?: string;
  image?: string; cover?: string; poster?: string;
  [key: string]: any;
}
interface Chapter { id: number; name: string; urdu_name?: string; subject_id: number; videos: Video[]; }

/* ─── CDN helpers ─── */
const CDN       = "https://cdn.zaheen.com.pk/videos/";
const CDN_THUMB = "https://cdn.zaheen.com.pk";

const buildThumbUrl = (raw?: string): string | null => {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${CDN_THUMB}/${raw.replace(/^\/+/, "")}`;
};
const getThumbUrl = (video: Video): string | null => {
  const raw = video.thumbnailUrl || video.thumbnail || video.thumb || video.image || video.cover || video.poster || null;
  return buildThumbUrl(raw);
};

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
const MiddleSubjectDetailView = () => {
const { classSlug, subjectSlug } = useParams<{ classSlug: string; subjectSlug: string }>();
  const classId = classIdFromSlug(classSlug ?? "");
  const navigate = useNavigate();
  const location = useLocation();
  const lang     = useLang();
  const isUrdu   = lang === "ur";

  const { isLoggedIn } = useAuth();

  const gradeType    = location.state?.gradeType as string | undefined;
  const stateSubject = location.state?.selectedSubject;

 const { classInfo, subjects, chapters, chapterVideos, loading } = useClassSubjects(classId ?? 0);

  const subject     = useMemo(() => findSubjectBySlug(subjects, subjectSlug ?? "") ?? stateSubject ?? null, [subjects, subjectSlug, stateSubject]);
  const subjectName = isUrdu ? subject?.urdu_name?.trim() || subject?.name || "" : subject?.name || "";
  const theme       = getSubjectTheme(subject?.name || "");
  const ThemeIcon   = theme.icon;

  const heroTitle = isUrdu ? theme.heroTitle.ur : theme.heroTitle.en;
  const tagline = isUrdu ? (subject?.urdu_desc || theme.tagline.ur) : (subject?.desc || theme.tagline.en);

 const subjectChapters: Chapter[] = useMemo(() =>
    chapters
      .filter((c: any) => String(c.subject_id) === String(subject?.id))
      .map((c: any) => ({ ...c, videos: chapterVideos[c.id] || [] })),
    [chapters, chapterVideos, subject]
  );
  const allVideos: Video[] = useMemo(() => subjectChapters.flatMap((c) => c.videos), [subjectChapters]);
  const allVideoIds        = useMemo(() => allVideos.map((v) => v.id), [allVideos]);
  const totalLessons       = allVideos.length;
  const totalChapters      = subjectChapters.length;
  const hasLessons         = totalLessons > 0;

  /* ── v2 progress hook (same as KG / Primary) ────────────── */
  const {
    progressMap,
    watchedSet,
    fetchJourneyForVideo,
    handleTimeUpdate: progressTimeUpdate,
    handleEnded: progressEnded,
    handleView,
    flushBeforeSwitch,
  } = useVideoProgress(allVideoIds, isLoggedIn);

  /* ── All hooks must be declared before any early return ── */
  const [openChapterId,     setOpenChapterId]     = useState<number | null>(null);
  const [activeVideo,       setActiveVideo]       = useState<Video | null>(null);
  const [activeChapter,     setActiveChapter]     = useState<Chapter | null>(null);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>("");
  const [notes,             setNotes]             = useState("");
  const [filter,            setFilter]            = useState<"all" | "inprogress">("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── Daily-goal minutes state (persisted per calendar day) ── */
  const [todayMinutes, setTodayMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(todayKey());
      return saved ? Math.min(parseInt(saved, 10) || 0, DAILY_GOAL_MINUTES) : 0;
    } catch {
      return 0;
    }
  });

  const recordLessonCompleted = useCallback(() => {
    setTodayMinutes((prev) => {
      const next = Math.min(prev + MINUTES_PER_LESSON, DAILY_GOAL_MINUTES);
      try { localStorage.setItem(todayKey(), String(next)); } catch {}
      return next;
    });
  }, []);

  /**
   * resumePositionRef holds the position fetched BEFORE the player mounts.
   * Read directly in onCanPlay — no stale-state risk.
   */
  const resumePositionRef = useRef<number>(0);
  const hasSeekRef        = useRef(false);
  const viewFiredRef      = useRef(false);

  useEffect(() => {
    if (subjectChapters.length > 0 && openChapterId === null)
      setOpenChapterId(subjectChapters[0].id);
  }, [subjectChapters]);

  useEffect(() => { setMobileSidebarOpen(false); }, [activeVideo]);

  // Reset seek + view-tracking guards whenever the active video changes
  useEffect(() => {
    hasSeekRef.current = false;
    viewFiredRef.current = false;
  }, [activeVideo?.id]);

  const watchedCount = watchedSet.size;
  const progressPct  = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;
  const isChapterUnlocked = (idx: number) => idx === 0 || isLoggedIn;

  const chapterOffsets = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    subjectChapters.forEach((c) => { offsets.push(acc); acc += c.videos.length; });
    return offsets;
  }, [subjectChapters]);

 const gradeName = useMemo(() => {
    if (!classInfo) return `Class ${gradeNumberFromSlug(classSlug ?? "") ?? classId}`;
    if (!isUrdu) return classInfo.name || `Class ${classId}`;
    const u = classInfo.urdu_name?.trim();
    if (u) return u;
    const m = (classInfo.name || "").match(/\d+/);
    return m ? `جماعت ${m[0]}` : classInfo.name || `Class ${classId}`;
  }, [classInfo, isUrdu, classId]);

  const playVideo = useCallback(async (video: Video, chapter: Chapter) => {
    const chapterIdx = subjectChapters.findIndex((c) => c.id === chapter.id);
    if (!isChapterUnlocked(chapterIdx)) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    flushBeforeSwitch();
    const position = await fetchJourneyForVideo(video.id);
    resumePositionRef.current = position;

    setActiveVideo(video);
    setActiveChapter(chapter);

    try {
    const detail = await fetchVideoDetail(video.id);
      setResolvedVideoUrl(detail.video_url || `${CDN}${video.path}`);
    } catch {
      setResolvedVideoUrl(`${CDN}${video.path}`);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [flushBeforeSwitch, fetchJourneyForVideo, subjectChapters, isChapterUnlocked, navigate, location.pathname]);

  const exitPlayer = useCallback(() => {
    flushBeforeSwitch();
    setActiveVideo(null);
    setActiveChapter(null);
    setMobileSidebarOpen(false);
    resumePositionRef.current = 0;
  }, [flushBeforeSwitch]);

  /* ── onCanPlay: seek to saved position ──────────────────── */
  const handleCanPlay = useCallback(() => {
    if (hasSeekRef.current) return;
    hasSeekRef.current = true;
    const pos = resumePositionRef.current;
    if (pos > 2 && videoRef.current) {
      videoRef.current.currentTime = pos;
    }
  }, []);

  /* ── onPlay: fire view endpoint once per video open ─────── */
  const handlePlay = useCallback(() => {
    if (!viewFiredRef.current && activeVideo) {
      viewFiredRef.current = true;
      handleView(activeVideo.id);
    }
  }, [activeVideo, handleView]);

  /* ── onEnded: delegate to progress hook + auto-advance ──── */
  const handleVideoEnded = useCallback(() => {
    if (!activeVideo || !activeChapter || !videoRef.current) return;
    const alreadyWatched = watchedSet.has(activeVideo.id);
    progressEnded(activeVideo.id, videoRef.current.duration || 0);
    if (!alreadyWatched) recordLessonCompleted();

    const idx = activeChapter.videos.findIndex((v) => v.id === activeVideo.id);
    if (idx < activeChapter.videos.length - 1) {
      playVideo(activeChapter.videos[idx + 1], activeChapter);
    }
  }, [activeVideo, activeChapter, progressEnded, playVideo, watchedSet, recordLessonCompleted]);

  /* ── onTimeUpdate: delegate to progress hook ────────────── */
  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!activeVideo) return;
    const v = e.target as HTMLVideoElement;
    progressTimeUpdate(activeVideo.id, v.currentTime, v.duration);
  }, [activeVideo, progressTimeUpdate]);

  /* ── Manual "Mark as Complete" toggle ───────────────────── */
  const handleMarkComplete = useCallback(() => {
    if (!activeVideo || !videoRef.current) return;
    if (watchedSet.has(activeVideo.id)) {
      // Already watched — v2 has no "unwatch" endpoint, so this is a no-op
      // once marked complete (button is also disabled in that state).
      return;
    }
    const duration = videoRef.current.duration || 0;
    progressEnded(activeVideo.id, duration);
    recordLessonCompleted();
  }, [activeVideo, watchedSet, progressEnded, recordLessonCompleted]);

  /* ── Resources data ── */
  const RESOURCES = useMemo(() => [
    { icon: <FileText size={18} style={{ color: "#3B82F6" }} />,     bg: "#EFF6FF", name: isUrdu ? "مشق شیٹس"   : "Practice Sheets",   sub: isUrdu ? "پی ڈی ایف • ۱.۲ MB" : "PDF • 1.2 MB"     },
    { icon: <ClipboardList size={18} style={{ color: "#7C3AED" }} />, bg: "#F5F3FF", name: isUrdu ? "یونٹ تشخیص" : "Unit Assessment",   sub: isUrdu ? "انٹرایکٹو کوئز"    : "Interactive Quiz" },
    { icon: <GraduationCap size={18} style={{ color: "#0891B2" }} />, bg: "#ECFEFF", name: isUrdu ? "ویژوالائزر"  : "Topic Visualizer",  sub: isUrdu ? "ویب ٹول"           : "Web Tool"         },
  ], [isUrdu]);

  /* ── Lecture sidebar render function ── */
  const renderLectureSidebar = () => (
    <div style={{ flex: "1 1 0%", overflowY: "auto", padding: "10px" }}>
      {subjectChapters.map((chapter, chIdx) => {
        const unlocked      = isChapterUnlocked(chIdx);
        const chLbl         = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
        const isCurrentChap = activeChapter ? chapter.id === activeChapter.id : false;
        return (
          <div key={chapter.id} style={{ marginBottom: 8 }}>
            <div style={{ padding: "6px 12px", fontSize: ".72rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: .8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 20, height: 20, borderRadius: 5, background: isCurrentChap ? theme.color : "#E2E8F0", color: isCurrentChap ? "#fff" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", fontWeight: 900, flexShrink: 0 }}>
                {chIdx + 1}
              </span>
              {chLbl}
            </div>
            {chapter.videos.map((video, vidIdx) => {
              const globalIdx = chapterOffsets[chIdx] + vidIdx;
              const locked    = !unlocked;
              const watched   = watchedSet.has(video.id);
              const isActive  = activeVideo?.id === video.id;
              const vt        = isUrdu ? video.urdu_name || video.name : video.name;
              const vidPct    = watched ? 100 : progressMap[video.id] || 0;
              return (
                <div
                  key={video.id}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer", background: isActive ? theme.light : locked ? "#F8FAFC" : "transparent", border: `1.5px solid ${isActive ? theme.color + "33" : "transparent"}`, marginBottom: 2, transition: "background .14s" }}
                  onClick={() => {
                    if (locked) {
                      navigate("/login", { state: { from: location.pathname } });
                      return;
                    }
                    playVideo(video, chapter);
                    setMobileSidebarOpen(false);
                  }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: isActive ? theme.color : locked ? "#CBD5E1" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {locked
                      ? <Lock size={14} style={{ color: "#334155" }} />
                      : watched
                        ? <CheckCircle2 size={14} style={{ color: "#22C55E" }} />
                        : isActive
                          ? <Play size={13} style={{ color: "#fff" }} fill="#fff" />
                          : <ThemeIcon size={14} style={{ color: theme.color }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: ".82rem", fontWeight: isActive ? 800 : 600, color: isActive ? theme.color : locked ? "#475569" : "#0F172A", margin: "0 0 2px", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {globalIdx + 1}.{vidIdx + 1} {vt}
                    </p>
                    <p style={{ fontSize: ".7rem", color: "#94A3B8", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                     {locked
                        ? <span style={{ color: "#475569", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><Lock size={9} /> {isUrdu ? "مقفل" : "Locked"}</span>
                        : isActive
                          ? <span style={{ color: theme.color, fontWeight: 700 }}>{isUrdu ? "موجودہ" : "Current"}</span>
                          : watched
                            ? <span style={{ color: "#22C55E", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={9} /> {isUrdu ? "مکمل" : "Done"}</span>
                            : vidPct > 0
                              ? <span style={{ color: theme.color, fontWeight: 700 }}>{vidPct}% {isUrdu ? "دیکھا" : "watched"}</span>
                              : <><Clock size={9} /> 15–20 {isUrdu ? "منٹ" : "mins"}</>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  /* ════════════════════════════════════════════
     GLOBAL STYLES
  ════════════════════════════════════════════ */
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; }
    @keyframes msvPulse { 0%,100%{opacity:1} 50%{opacity:.4} }

    /* ── PLAYER styles ── */
    .msv-notes-area {
      width: 100%; border: none; outline: none; resize: none;
      font-family: 'Nunito', sans-serif; font-size: .88rem;
      color: #374151; line-height: 1.65; background: transparent; min-height: 130px;
    }
    .msv-player-grid {
      max-width: 1400px; margin: 0 auto;
      display: grid; grid-template-columns: 1fr 320px;
      min-height: 100vh;
    }
    .msv-desktop-sidebar {
      background: #fff; border-left: 1px solid #E5E9F0;
      display: flex; flex-direction: column;
      height: 100vh; position: sticky; top: 0; overflow-y: auto;
    }
    .msv-mobile-fab { display: none; }
    .msv-drawer-overlay { display: none; }

    /* ── CHAPTER / HERO styles ── */
    .msv-hero {
      border-radius: 24px; overflow: hidden;
      display: grid; grid-template-columns: 1fr 1.1fr;
      min-height: 360px; margin-bottom: 28px;
      box-shadow: 0 6px 28px rgba(0,0,0,.1);
    }
    .msv-hero-left {
      padding: 44px 40px; display: flex; flex-direction: column;
      justify-content: center; gap: 16px;
    }
    .msv-hero-right {
      position: relative; overflow: hidden;
      display: flex; align-items: stretch; justify-content: center;
    }
    .msv-hero-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover; object-position: center;
      display: block;
    }
    .msv-bc { display:flex; align-items:center; gap:6px; font-size:.78rem; font-weight:700; flex-wrap:wrap; }
    .msv-bc a { text-decoration:none; transition:opacity .15s; }
    .msv-bc a:hover { opacity:.7; }
    .msv-hero-title { font-size:clamp(1.5rem,3.2vw,2.4rem); font-weight:900; line-height:1.1; margin:0; }
    .msv-hero-sub { font-size:.92rem; line-height:1.7; margin:0; max-width:460px; color:#374151; }
    .msv-pill { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:100px; font-size:.82rem; font-weight:800; background:#fff; box-shadow:0 1px 6px rgba(0,0,0,.09); }
    .msv-layout { display:grid; grid-template-columns:320px 1fr; gap:20px; align-items:flex-start; width:100%; min-width:0; }
    .msv-sidebar { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.08); position:sticky; top:20px; max-height:calc(100vh - 40px); overflow-y:auto; min-width:0; }
    .msv-prog-box { padding:20px 18px 16px; border-bottom:1.5px solid #F1F5F9; }
    .msv-prog-label { display:flex; justify-content:space-between; align-items:center; margin-bottom:9px; }
    .msv-prog-bg { background:#E5E7EB; border-radius:100px; height:10px; overflow:hidden; margin-bottom:6px; }
    .msv-prog-fill { height:100%; border-radius:100px; transition:width .5s ease; }
    .msv-ch-label { padding:14px 18px 5px; font-size:.72rem; font-weight:900; color:#9CA3AF; text-transform:uppercase; letter-spacing:1.2px; }
    .msv-ch-row { border-top:1px solid #F1F5F9; }
    .msv-ch-btn { width:100%; display:flex; align-items:center; gap:11px; padding:14px 18px; background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; transition:background .14s; text-align:left; }
    .msv-ch-btn:hover { background:#F8FAFF; }
    .msv-ch-btn.active { background:#EFF6FF; }
    .msv-ch-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .msv-ch-info { flex:1; min-width:0; }
    .msv-ch-num  { font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.8px; margin:0 0 2px; }
    .msv-ch-name { font-size:.9rem; font-weight:700; color:#111827; margin:0; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .msv-lec-sub { padding:8px 18px 8px 52px; display:flex; align-items:center; gap:9px; width:100%; background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; transition:background .12s; text-align:left; }
    .msv-lec-sub:hover { background:#F8FAFF; }
    .msv-lec-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
    .msv-lec-card { background:#fff; border-radius:18px; overflow:hidden; cursor:pointer; border:2px solid transparent; box-shadow:0 2px 12px rgba(0,0,0,.07); transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,border-color .15s; }
    .msv-lec-card:hover { transform:translateY(-5px); box-shadow:0 12px 32px rgba(0,0,0,.12); }
    .msv-lec-thumb { aspect-ratio:16/9; position:relative; overflow:hidden; background:#E5E7EB; }
    .msv-lec-thumb img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; z-index:1; filter:grayscale(1) brightness(.92); transition:filter .35s ease; }
    .msv-lec-card:hover .msv-lec-thumb img { filter:grayscale(0) brightness(1); }
    .msv-lec-thumb-placeholder { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:0; }
    .msv-play-ov { position:absolute; inset:0; z-index:4; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.28); opacity:0; transition:opacity .2s; }
    .msv-lec-card:hover .msv-play-ov { opacity:1; }
    .msv-lec-body { padding:14px 16px 16px; }
    .msv-lec-chapter-tag { font-size:.68rem; font-weight:900; text-transform:uppercase; letter-spacing:.8px; margin:0 0 5px; }
    .msv-lec-title { font-size:1rem; font-weight:800; color:#111827; margin:0 0 5px; line-height:1.35; }
    .msv-lec-desc { font-size:.8rem; color:#6B7280; margin:0; line-height:1.5; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }

    /* ════════════════════════════
       RESPONSIVE BREAKPOINTS
    ════════════════════════════ */

    /* Tablet: 1024px and below */
    @media (max-width: 1024px) {
      .msv-layout { grid-template-columns: 260px 1fr; gap: 16px; }
      .msv-hero { grid-template-columns: 1fr 1fr; min-height: 280px; }
      .msv-hero-left { padding: 28px 24px; gap: 12px; }
      .msv-player-grid { grid-template-columns: 1fr 300px; }
    }

    /* Small tablet / large mobile: 900px and below */
    @media (max-width: 900px) {
      /* Player mode */
      .msv-player-grid { grid-template-columns: 1fr; }
      .msv-desktop-sidebar { display: none !important; }
      .msv-mobile-fab {
        display: flex !important;
        align-items: center; gap: 7px;
        position: fixed; bottom: 20px; right: 20px; z-index: 900;
        color: #fff; border: none; border-radius: 50px;
        padding: 13px 20px; font-size: .85rem; font-weight: 800;
        cursor: pointer; box-shadow: 0 4px 18px rgba(0,0,0,.25);
        font-family: 'Nunito', sans-serif;
      }
      .msv-drawer-overlay {
        display: flex !important;
        position: fixed; inset: 0; z-index: 1000;
        background: rgba(0,0,0,0.5);
        align-items: stretch; justify-content: flex-end;
      }
      .msv-drawer-overlay.hidden { display: none !important; }
      .msv-drawer-panel {
        width: min(320px, 88vw); background: #fff;
        display: flex; flex-direction: column; height: 100%;
        box-shadow: -6px 0 24px rgba(0,0,0,.15);
      }

      /* Chapter view: stack sidebar above content */
      .msv-layout { grid-template-columns: 1fr; gap: 16px; }
      .msv-sidebar { position: static; max-height: none; overflow-y: visible; }

      /* Hero: stack vertically — image panel becomes fixed height below text */
      .msv-hero { grid-template-columns: 1fr; min-height: auto; }
      .msv-hero-right { height: 220px; min-height: 220px; }
      .msv-hero-left { padding: 24px 20px; gap: 10px; }
    }

    /* Mobile: 600px and below */
    @media (max-width: 600px) {
      .msv-player-left { padding: 12px 12px 100px !important; }
      .msv-notes-grid  { grid-template-columns: 1fr !important; }
      .msv-lec-grid { grid-template-columns: 1fr !important; }
      .msv-hero-right { height: 180px; min-height: 180px; }
      .msv-hero-left { padding: 18px 16px; gap: 8px; }
      .msv-hero-sub { font-size: .84rem; }
      .msv-pill { padding: 7px 14px; font-size: .76rem; }
      .msv-prog-box { padding: 16px 14px 12px; }
      .msv-ch-btn { padding: 12px 14px; }
      .msv-lec-sub { padding: 8px 14px 8px 42px; }
      .msv-bc { font-size: .72rem; }
    }

    /* Extra small: 400px and below */
    @media (max-width: 400px) {
      .msv-hero-left { padding: 14px; }
      .msv-hero-right { height: 150px; min-height: 150px; }
      .msv-pill { padding: 6px 10px; font-size: .72rem; gap: 4px; }
      .msv-ch-name { font-size: .82rem; }
    }
  `;

  /* ════════════════════════════════════════════
     VIDEO PLAYER MODE
  ════════════════════════════════════════════ */
  if (activeVideo && activeChapter) {
    const vid      = activeVideo;
    const chap     = activeChapter;
    const vTitle   = isUrdu ? vid.urdu_name || vid.name : vid.name;
    const vUrl = resolvedVideoUrl;
    const chLabel  = isUrdu ? chap.urdu_name || chap.name : chap.name;
    const isWatched = watchedSet.has(vid.id);
    const pctActive = isWatched ? 100 : progressMap[vid.id] || 0;

    return (
      <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "'Nunito','Segoe UI',sans-serif", direction: isUrdu ? "rtl" : "ltr" }}>
        <style>{globalStyles}</style>

        {/* Mobile FAB */}
        <button
          className="msv-mobile-fab"
          style={{ background: theme.color }}
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu size={16} /> {isUrdu ? "اسباق" : "Lectures"}
        </button>

        {/* Mobile drawer */}
        <div
          className={`msv-drawer-overlay${mobileSidebarOpen ? "" : " hidden"}`}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="msv-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ThemeIcon size={16} style={{ color: theme.color }} />
                <span style={{ fontSize: ".92rem", fontWeight: 800, color: "#0F172A" }}>{subjectName}</span>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#64748B" }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: ".72rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: .5, margin: 0, padding: "8px 16px 0", flexShrink: 0 }}>
              {chLabel}
            </p>
            {renderLectureSidebar()}
          </div>
        </div>

        {/* Main grid */}
        <div className="msv-player-grid">

          {/* ── LEFT: video + title + notes + resources ── */}
          <div className="msv-player-left" style={{ padding: "20px 24px 40px" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: ".78rem", color: "#64748B", marginBottom: 16, flexWrap: "wrap" }}>
             <button onClick={() => navigate(`/${classSlug}`, { state: { gradeType } })} style={{ background: "none", border: "none", color: theme.color, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", padding: 0, fontSize: ".78rem" }}>
                {gradeName}
              </button>
              <ChevronRight size={12} />
              <button onClick={exitPlayer} style={{ background: "none", border: "none", color: theme.color, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", padding: 0, fontSize: ".78rem" }}>
                {chLabel}
              </button>
              <ChevronRight size={12} />
              <span style={{ color: theme.color, fontWeight: 700 }}>{vTitle}</span>
            </div>

            {/* Video player */}
            <div style={{ background: "#000", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,.22)", marginBottom: 6 }}>
              <div style={{ aspectRatio: "16/9" }}>
                <video
                  ref={videoRef}
                  key={vUrl}
                  src={vUrl}
                  controls
                  autoPlay
                  style={{ width: "100%", height: "100%", display: "block" }}
                  onCanPlay={handleCanPlay}
                  onPlay={handlePlay}
                  onEnded={handleVideoEnded}
                  onTimeUpdate={handleTimeUpdate}
                  onError={(e) => console.error("Video error", e)}
                />
              </div>
            </div>

            {/* In-progress bar below the player */}
            {pctActive > 0 && pctActive < 100 && (
              <div style={{ height: 4, background: "#E5E7EB", borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pctActive}%`, background: theme.color, borderRadius: 4, transition: "width .4s ease" }} />
              </div>
            )}

            {/* Video title + description */}
            <div style={{ marginTop: pctActive > 0 && pctActive < 100 ? 0 : 14, marginBottom: 20 }}>
              <p style={{ fontSize: ".72rem", fontWeight: 800, color: theme.color, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{chLabel}</p>
              <h2 style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)", fontWeight: 900, color: "#0F172A", margin: "0 0 6px", lineHeight: 1.25 }}>{vTitle}</h2>
              {vid.desc && (
                <p style={{ fontSize: ".85rem", color: "#64748B", lineHeight: 1.6, margin: 0 }}>
                  {isUrdu ? vid.urdu_desc || vid.desc : vid.desc}
                </p>
              )}
            </div>

            {/* Notes + Resources grid */}
            <div className="msv-notes-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

              {/* Lecture Notes */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E9F0", padding: "16px 16px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderBottom: "1px solid #F1F5F9", paddingBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Edit3 size={15} style={{ color: theme.color }} />
                    <span style={{ fontWeight: 800, fontSize: ".9rem", color: "#0F172A" }}>{isUrdu ? "لیکچر نوٹس" : "Lecture Notes"}</span>
                  </div>
                  <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#0F172A", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: ".74rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>
                    <Save size={12} /> {isUrdu ? "محفوظ" : "Save Notes"}
                  </button>
                </div>
                <textarea
                  className="msv-notes-area"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isUrdu ? "یہاں اپنے نوٹس لکھیں..." : "Start typing your notes here..."}
                />
              </div>

              {/* Resources + Mark Complete */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Resources card */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E9F0", padding: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12, borderBottom: "1px solid #F1F5F9", paddingBottom: 10 }}>
                    <BookOpen size={15} style={{ color: "#22C55E" }} />
                    <span style={{ fontWeight: 800, fontSize: ".9rem", color: "#0F172A" }}>{isUrdu ? "وسائل" : "Resources"}</span>
                  </div>
                  {RESOURCES.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: i < RESOURCES.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
                      <div>
                        <p style={{ fontSize: ".82rem", fontWeight: 700, color: "#0F172A", margin: 0 }}>{r.name}</p>
                        <p style={{ fontSize: ".7rem", color: "#94A3B8", margin: 0 }}>{r.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mark as Complete — now backed by the v2 progress endpoint */}
                <button
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#fff", border: `2px solid ${isWatched ? "#22C55E" : "#E2E8F0"}`, borderRadius: 12, padding: "12px 16px", fontWeight: 800, fontSize: ".88rem", color: isWatched ? "#22C55E" : "#374151", cursor: isWatched ? "default" : "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .15s" }}
                  onClick={handleMarkComplete}
                  disabled={isWatched}
                >
                  <CheckCircle2 size={17} style={{ color: isWatched ? "#22C55E" : "#94A3B8" }} />
                  {isWatched
                    ? (isUrdu ? "مکمل!" : "Completed!")
                    : (isUrdu ? "مکمل کے طور پر نشان لگائیں" : "Mark as Complete")}
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Desktop lecture sidebar ── */}
          <div className="msv-desktop-sidebar">
            <div style={{ padding: "16px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <ThemeIcon size={15} style={{ color: theme.color }} />
                <span style={{ fontSize: ".92rem", fontWeight: 800, color: "#0F172A" }}>{subjectName}</span>
              </div>
              <p style={{ fontSize: ".74rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: .5, margin: 0 }}>
                {chLabel} · {isUrdu ? "باب" : "CH"} {String(subjectChapters.findIndex((c) => c.id === chap.id) + 1).padStart(2, "0")}
              </p>
            </div>
            {renderLectureSidebar()}
          </div>

        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════
     CHAPTER / LECTURES VIEW
  ════════════════════════════════════════════ */
  const activeChapterData = subjectChapters.find((c) => c.id === openChapterId) ?? subjectChapters[0] ?? null;
  const activeChapterIdx  = subjectChapters.findIndex((c) => c.id === activeChapterData?.id);

  const filteredVideos = (() => {
    if (!activeChapterData) return [];
    if (filter === "inprogress")
      return activeChapterData.videos.filter((v) => {
        const pct = watchedSet.has(v.id) ? 100 : progressMap[v.id] || 0;
        return pct > 0 && pct < 100;
      });
    return activeChapterData.videos;
  })();

  // Lessons remaining for this subject — drives the "keep going" banner
  const remainingLessons = Math.max(0, totalLessons - watchedCount);

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FA", fontFamily: "'Nunito','Segoe UI',sans-serif", direction: isUrdu ? "rtl" : "ltr", overflowX: "hidden" }}>
      <style>{globalStyles}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "clamp(16px,3vw,36px) clamp(12px,3vw,24px) 60px", width: "100%" }}>

        {/* ══ HERO ══ */}
        {loading ? (
          <div style={{ borderRadius: 24, background: "#E5E7EB", height: 300, marginBottom: 28, animation: "msvPulse 1.4s ease-in-out infinite" }} />
        ) : (
          <div className="msv-hero" style={{ background: theme.light }}>
            <div className="msv-hero-left">
              <div className="msv-bc" style={{ color: theme.color }}>
                <Link to="/" style={{ color: theme.color }}>{isUrdu ? "ہوم" : "Home"}</Link>
                <ChevronRight size={13} />
           <Link to={`/${classSlug}`} state={{ gradeType }} style={{ color: theme.color }}>{gradeName}</Link>
                <ChevronRight size={13} />
                <span style={{ color: "#374151" }}>{subjectName}</span>
              </div>
              <h1 className="msv-hero-title" style={{ color: theme.color }}>{heroTitle}</h1>
              <p className="msv-hero-sub">{tagline}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="msv-pill" style={{ color: theme.color }}>
                  <BookOpen size={14} style={{ color: theme.color }} />
                  {totalChapters} {isUrdu ? "ابواب" : "Chapters"} • {totalLessons} {isUrdu ? "اسباق" : "Lessons"}
                </span>
                <span className="msv-pill" style={{ color: "#065F46" }}>
                  <Gamepad2 size={14} style={{ color: "#065F46" }} />
                  {isUrdu ? "۸ کھیل" : "8 Games"}
                </span>
                {watchedCount > 0 && (
                  <span className="msv-pill" style={{ color: "#16A34A" }}>
                    <CheckCircle2 size={14} style={{ color: "#16A34A" }} />
                    {progressPct}% {isUrdu ? "مکمل" : "Done"}
                  </span>
                )}
              </div>
            </div>

            {/* Hero image — fills the entire right panel */}
            <div className="msv-hero-right" style={{ background: theme.pill }}>
              <img
                src={heroDefault}
                alt=""
                className="msv-hero-img"
              />
            </div>
          </div>
        )}

        {/* ══ CHAPTER LAYOUT ══ */}
        <div className="msv-layout">

          {/* ── SIDEBAR ── */}
          <aside className="msv-sidebar">

            {!loading && !hasLessons ? (
              /* Nothing to teach yet for this subject — keep the sidebar
                 simple instead of showing 0% progress / 0 of 0 lessons */
              <div style={{ padding: "36px 22px", textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", background: theme.light,
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                }}>
                  <Clock size={24} style={{ color: theme.color }} />
                </div>
                <p style={{ fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>
                  {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
                </p>
                <p style={{ fontSize: ".8rem", color: "#94A3B8", margin: 0 }}>
                  {isUrdu ? "کوئی باب دستیاب نہیں" : "No chapters available yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="msv-prog-box">
                  <div className="msv-prog-label">
                    <span style={{ fontWeight: 900, fontSize: ".95rem", color: "#111827" }}>{isUrdu ? "میری پیشرفت" : "My Progress"}</span>
                    <span style={{ fontWeight: 900, fontSize: ".95rem", color: theme.color }}>{progressPct}%</span>
                  </div>
                  <div className="msv-prog-bg">
                    <div className="msv-prog-fill" style={{ width: `${progressPct}%`, background: theme.color }} />
                  </div>
                  <p style={{ fontSize: ".78rem", color: "#6B7280", margin: 0, fontWeight: 700 }}>
                    {watchedCount} {isUrdu ? "میں سے" : "of"} {totalLessons} {isUrdu ? "اسباق مکمل!" : "lessons finished!"}
                  </p>
                </div>

                {/* "Keep going" banner — only shown when there are actually
                    lessons left to watch for this subject */}
                {remainingLessons > 0 && (
                  <div style={{ padding: "12px 18px", borderBottom: "1.5px solid #F1F5F9", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: theme.pill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={15} style={{ color: theme.color }} />
                    </div>
                    <p style={{ fontSize: ".78rem", fontWeight: 800, color: theme.color, margin: 0 }}>
                      {isUrdu
                        ? `${remainingLessons} اسباق باقی ہیں۔ جاری رہو!`
                        : `${remainingLessons} lesson${remainingLessons !== 1 ? "s" : ""} left. Keep going!`}
                    </p>
                  </div>
                )}

                <p className="msv-ch-label">{isUrdu ? "تمام ابواب" : "All Chapters"}</p>

                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ height: 60, background: "#F1F5F9", margin: "2px 14px", borderRadius: 12, animation: "msvPulse 1.4s ease-in-out infinite" }} />
                    ))
                  : subjectChapters.map((chapter, idx) => {
                      const unlocked  = isChapterUnlocked(idx);
                      const isOpen    = openChapterId === chapter.id;
                      const chWatched = chapter.videos.filter((v) => watchedSet.has(v.id)).length;
                      const chDone    = chapter.videos.length > 0 && chWatched === chapter.videos.length;
                      const chLabel   = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
                      return (
                        <div key={chapter.id} className="msv-ch-row">
                         <button
                            className={`msv-ch-btn${isOpen ? " active" : ""}`}
                            onClick={() => {
                              if (!unlocked) {
                                navigate("/login", { state: { from: location.pathname } });
                                return;
                              }
                              setOpenChapterId(isOpen ? null : chapter.id);
                            }}
                            style={{ cursor: "pointer", opacity: unlocked ? 1 : 0.7 }}
                          >
                            <div className="msv-ch-icon" style={{ background: chDone ? "#DCFCE7" : isOpen ? theme.pill : "#F1F5F9", color: chDone ? "#16A34A" : isOpen ? theme.color : "#6B7280" }}>
                              {chDone ? <CheckCircle2 size={16} /> : unlocked ? (isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />) : <Lock size={14} />}
                            </div>
                            <div className="msv-ch-info">
                              <p className="msv-ch-num" style={{ color: isOpen ? theme.color : "#9CA3AF" }}>
                                {isUrdu ? `باب ${idx + 1}` : `CHAPTER ${idx + 1}`}
                              </p>
                              <p className="msv-ch-name">{chLabel}</p>
                            </div>
                            {/* per-chapter progress badge */}
                            {unlocked && chapter.videos.length > 0 && (
                              <span style={{ fontSize: ".72rem", fontWeight: 800, color: chDone ? "#16A34A" : isOpen ? "#fff" : "#9CA3AF", background: chDone ? "#DCFCE7" : isOpen ? theme.color : "#F1F5F9", padding: "2px 8px", borderRadius: 100, flexShrink: 0 }}>
                                {chDone ? "✓" : `${chWatched}/${chapter.videos.length}`}
                              </span>
                            )}
                          </button>
                          <AnimatePresence>
                            {isOpen && unlocked && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .2 }} style={{ overflow: "hidden" }}>
                                {chapter.videos.map((video) => {
                                  const watched = watchedSet.has(video.id);
                                  const vTitle  = isUrdu ? video.urdu_name || video.name : video.name;
                                  const isCur   = activeVideo?.id === video.id;
                                  return (
                                    <button key={video.id} className="msv-lec-sub" onClick={() => playVideo(video, chapter)} style={{ background: isCur ? theme.light : "none", borderLeft: `3px solid ${isCur ? theme.color : "transparent"}` }}>
                                      <span style={{ color: watched ? "#22C55E" : theme.color, flexShrink: 0 }}>
                                        {watched ? <CheckCircle2 size={13} /> : <span style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${theme.color}`, display: "inline-block" }} />}
                                      </span>
                                      <span style={{ fontSize: ".82rem", fontWeight: 600, color: isCur ? theme.color : "#374151", lineHeight: 1.3, textAlign: "left" }}>{vTitle}</span>
                                      {isCur && (
                                        <span style={{ marginLeft: "auto", fontSize: ".62rem", fontWeight: 800, color: theme.color, background: theme.pill, padding: "2px 7px", borderRadius: 100, flexShrink: 0 }}>
                                          {isUrdu ? "اب" : "NOW"}
                                        </span>
                                      )}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}

                <div style={{ padding: "14px 18px", borderTop: "1px solid #F1F5F9" }}>
             <button onClick={() => navigate(`/${classSlug}`, { state: { gradeType } })} style={{ color: theme.color, fontWeight: 700, fontSize: ".84rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", padding: 0 }}>
                    {isUrdu ? "→" : "←"} {isUrdu ? "مضامین پر واپس" : "Back to Subjects"}
                  </button>
                </div>

                <div style={{ margin: "0 14px 14px", background: theme.light, borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: theme.pill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Target size={15} style={{ color: theme.color }} />
                    </div>
                    <span style={{ fontWeight: 900, fontSize: ".9rem", color: "#111827" }}>{isUrdu ? "روزانہ ہدف" : "Daily Goal"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: "#6B7280", marginBottom: 5 }}>
                    <span>{isUrdu ? "سیکھنے کا وقت" : "Learning Time"}</span>
                    <span style={{ fontWeight: 800, color: theme.color }}>{todayMinutes}/{DAILY_GOAL_MINUTES} min</span>
                  </div>
                  <div style={{ background: "#E5E7EB", borderRadius: 100, height: 7, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (todayMinutes / DAILY_GOAL_MINUTES) * 100)}%`, background: theme.color, borderRadius: 100, transition: "width .4s ease" }} />
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main style={{ minWidth: 0 }}>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: 18, background: "#fff", height: 220, animation: "msvPulse 1.4s ease-in-out infinite" }} />
                ))}
              </div>
            ) : !hasLessons ? (
              <div style={{
                background: "#fff", borderRadius: 20, border: "2px dashed #E2E8F0",
                padding: "72px 24px", textAlign: "center",
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", background: theme.light,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <BookOpen size={32} style={{ color: theme.color }} />
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#111827", margin: "0 0 8px" }}>
                  {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
                </h3>
                <p style={{ fontSize: ".88rem", color: "#6B7280", margin: "0 auto", maxWidth: 380, lineHeight: 1.6 }}>
                  {isUrdu
                    ? `${subjectName} کے اسباق ابھی تیار کیے جا رہے ہیں۔ جلد ہی دستیاب ہوں گے!`
                    : `Lessons for ${subjectName} are being prepared and will be available soon!`}
                </p>
                <button
            onClick={() => navigate(`/${classSlug}`, { state: { gradeType } })}
                  style={{
                    marginTop: 22, background: theme.color, color: "#fff", border: "none",
                    borderRadius: 10, padding: "10px 22px", fontWeight: 800, fontSize: ".85rem",
                    cursor: "pointer", fontFamily: "'Nunito',sans-serif",
                  }}
                >
                  {isUrdu ? "مضامین پر واپس" : "Back to Subjects"}
                </button>
              </div>
            ) : activeChapterData ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: ".72rem", fontWeight: 900, color: theme.color, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 4px" }}>
                      {isUrdu ? "ابھی سیکھ رہے ہیں" : "CURRENTLY LEARNING"}
                    </p>
                    <h2 style={{ fontSize: "clamp(1.1rem, 3vw, 1.5rem)", fontWeight: 900, color: "#111827", margin: "0 0 4px", lineHeight: 1.2 }}>
                      {isUrdu ? `باب ${activeChapterIdx + 1}: ${activeChapterData.urdu_name || activeChapterData.name}` : `Chapter ${activeChapterIdx + 1}: ${activeChapterData.name}`}
                    </h2>
                    <p style={{ fontSize: ".85rem", color: "#6B7280", margin: 0 }}>
                      {isUrdu ? "اس باب کے اسباق مکمل کریں اور مہارت حاصل کریں!" : "Complete the lessons in this chapter to master the topic!"}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
                    {(["all", "inprogress"] as const).map((f) => (
                      <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 16px", borderRadius: 100, border: "1.5px solid #E2E8F0", background: filter === f ? theme.color : "#fff", color: filter === f ? "#fff" : "#374151", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .14s" }}>
                        {f === "all" ? (isUrdu ? "تمام اسباق" : "All Lessons") : (isUrdu ? "جاری" : "In Progress")}
                      </button>
                    ))}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F1F5F9", borderRadius: 100, padding: "7px 16px", flexShrink: 0 }}>
                      <Clock size={14} style={{ color: "#6B7280" }} />
                      <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151" }}>
                        {activeChapterData.videos.length * 15} {isUrdu ? "منٹ کل" : "min Total"}
                      </span>
                    </div>
                  </div>
                </div>

                {filteredVideos.length === 0 && filter === "inprogress" ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#9CA3AF" }}>
                    <BookOpen size={40} strokeWidth={1} style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 700 }}>{isUrdu ? "کوئی جاری سبق نہیں۔" : "No in-progress lessons."}</p>
                  </div>
                ) : activeChapterData.videos.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#9CA3AF" }}>
                    <BookOpen size={40} strokeWidth={1} style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 700 }}>{isUrdu ? "اسباق جلد آئیں گے!" : "Lessons coming soon!"}</p>
                  </div>
                ) : (
                  <div className="msv-lec-grid">
                    {filteredVideos.map((video, idx) => {
                      const watched = watchedSet.has(video.id);
                      const pct     = watched ? 100 : progressMap[video.id] || 0;
                      const vTitle  = isUrdu ? video.urdu_name || video.name : video.name;
                      const vDesc   = isUrdu ? video.urdu_desc || video.desc : video.desc;
                      const isCur   = activeVideo?.id === video.id;
                      const thumb   = getThumbUrl(video);
                      const chapterLabel = isUrdu ? `باب ${activeChapterIdx + 1}` : `Chapter ${activeChapterIdx + 1}`;
                      return (
                        <div key={video.id} className="msv-lec-card" style={{ borderColor: isCur ? theme.color : watched ? "#22C55E" : "transparent" }} onClick={() => playVideo(video, activeChapterData)}>
                          <div className="msv-lec-thumb">
                            <div className="msv-lec-thumb-placeholder" style={{ background: theme.light }}>
                              <PlayCircle size={40} style={{ color: theme.color, opacity: 0.3 }} />
                            </div>
                            {thumb && <img src={thumb} alt={vTitle} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />}
                            {pct > 0 && pct < 100 && (
                              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,.2)", zIndex: 3 }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: theme.color }} />
                              </div>
                            )}
                            {isCur && <div style={{ position: "absolute", top: 8, left: 8, background: theme.color, color: "#fff", fontSize: ".68rem", fontWeight: 900, padding: "3px 10px", borderRadius: 6, letterSpacing: .4, zIndex: 3 }}>{isUrdu ? "ابھی" : "ACTIVE NOW"}</div>}
                            {watched && !isCur && (
                              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 3 }}>
                                <div style={{ background: "#22C55E", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <CheckCircle2 size={16} style={{ color: "#fff" }} />
                                </div>
                              </div>
                            )}
                            <div className="msv-play-ov">
                              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,.25)" }}>
                                <PlayCircle size={28} style={{ color: theme.color }} />
                              </div>
                            </div>
                          </div>
                          <div className="msv-lec-body">
                            <p className="msv-lec-chapter-tag" style={{ color: theme.color }}>{chapterLabel}</p>
                            <h4 className="msv-lec-title">{idx + 1}. {vTitle}</h4>
                            {vDesc && <p className="msv-lec-desc">{vDesc}</p>}
                          </div>
                        </div>
                      );
                    })}

                    {/* Quiz Game card */}
                    <div style={{ borderRadius: 18, border: "2px dashed #D1FAE5", background: "#F0FDF4", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", textAlign: "center" }} onClick={() => navigate(`/assessment/1`)}>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Gamepad2 size={26} style={{ color: "#fff" }} />
                      </div>
                     <div onClick={() => navigate(`/assessment/1`)} style={{ cursor: "pointer" }}>
  <h4 style={{ fontSize: "1rem", fontWeight: 900, color: "#111827", margin: "0 0 5px" }}>
    {isUrdu ? "باب کا کوئز گیم" : "Chapter Quiz Game"}
  </h4>

  <p style={{ fontSize: ".8rem", color: "#6B7280", margin: "0 0 12px" }}>
    {isUrdu ? "اپنی معلومات جانچیں اور بیج جیتیں!" : "Test your knowledge and win a badge!"}
  </p>

  <button style={{ background: "#065F46", color: "#fff", border: "none", borderRadius: 11, padding: "10px 22px", fontWeight: 800, fontSize: ".88rem", cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}>
    {isUrdu ? "کھیلنا شروع کریں" : "Start Playing"} <ChevronRight size={15} />
  </button>
</div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MiddleSubjectDetailView;