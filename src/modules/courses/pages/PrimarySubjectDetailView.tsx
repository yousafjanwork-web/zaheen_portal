import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronUp, Lock, CheckCircle2, PlayCircle,
  ArrowLeft, ArrowRight, Clock, BookOpen, Gamepad2, HelpCircle,
  ChevronRight, Target, Play, Zap, FileText, BookMarked,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { usePrimarySubjects as useClassSubjects, fetchPrimaryVideoDetail } from "@/modules/shared/hooks/usePrimarySubjects"
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useVideoProgress } from "../../shared/hooks/Usevideoprogress";   // ← same hook as KG

import heroEnglish from "../../../assets/images/owls.png";
import heroDefault  from "../../../assets/images/owls.png";
import robotImg     from "../../../assets/images/rebort.png";

/* ─────────────────────────────────────────────────────────────
   Language hook
──────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   Subject theme
──────────────────────────────────────────────────────────────── */
const getSubjectTheme = (name: string) => {
  const n = name?.toLowerCase() || "";
  if (n.includes("english")) return {
    color: "#2563EB", light: "#EFF6FF", pill: "#DBEAFE", heroImg: heroEnglish,
    heroTitle: { en: "The Magic of Alphabets",   ur: "حروف تہجی کا جادو" },
    tagline:   { en: "Join our animal friends on a journey through the magical forest of letters. Master A to Z with songs, games, and stories!", ur: "جادوئی جنگل میں حروف تہجی سیکھیں۔ گانوں، کھیلوں اور کہانیوں کے ساتھ!" },
  };
  if (n.includes("urdu")) return {
    color: "#92400E", light: "#FFFBEB", pill: "#FDE68A", heroImg: heroDefault,
    heroTitle: { en: "World of Urdu",            ur: "اردو کی دنیا" },
    tagline:   { en: "Explore the beauty of Urdu literature, poetry, and language through fun stories and activities.", ur: "اردو ادب، شاعری اور زبان کی خوبصورتی کو تفریحی کہانیوں کے ذریعے دریافت کریں۔" },
  };
  if (n.includes("math")) return {
    color: "#065F46", light: "#ECFDF5", pill: "#A7F3D0", heroImg: heroDefault,
    heroTitle: { en: "Magic Math World",         ur: "جادوئی ریاضی کی دنیا" },
    tagline:   { en: "Discover the magic of numbers! Build strong math foundations with interactive lessons and games.", ur: "اعداد کا جادو دریافت کریں! انٹرایکٹو اسباق اور کھیلوں کے ساتھ مضبوط ریاضی کی بنیاد بنائیں۔" },
  };
  if (n.includes("science")) return {
    color: "#1D4ED8", light: "#EFF6FF", pill: "#BFDBFE", heroImg: heroDefault,
    heroTitle: { en: "Science Explorers",        ur: "سائنس کے مہم جو" },
    tagline:   { en: "Explore the wonders of science through simple experiments and exciting discoveries.", ur: "آسان تجربات اور دلچسپ دریافتوں کے ذریعے سائنس کے عجائبات دریافت کریں۔" },
  };
  if (n.includes("islamic")) return {
    color: "#065F46", light: "#F0FDF4", pill: "#BBF7D0", heroImg: heroDefault,
    heroTitle: { en: "Islamic Studies",          ur: "اسلامی تعلیمات" },
    tagline:   { en: "Build strong moral values and learn Islamic teachings in a fun, engaging way.", ur: "تفریحی انداز میں اسلامی تعلیمات سیکھیں اور مضبوط اخلاقی اقدار بنائیں۔" },
  };
  return {
    color: "#4338CA", light: "#EEF2FF", pill: "#C7D2FE", heroImg: heroDefault,
    heroTitle: { en: "Let's Learn!", ur: "آؤ سیکھیں!" },
    tagline:   { en: "Explore this subject and build your knowledge step by step.", ur: "اس مضمون کو دریافت کریں اور قدم بہ قدم اپنی معلومات بڑھائیں۔" },
  };
};

/* ─────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
interface Video {
  id: number; name: string; urdu_name?: string; path: string;
  desc?: string; urdu_desc?: string;
  thumbnailUrl?: string; thumbnail?: string; thumb?: string;
  image?: string; cover?: string; poster?: string;
  [key: string]: any;
}
interface Chapter { id: number; name: string; urdu_name?: string; subject_id: number; videos: Video[]; }

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

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
const PrimarySubjectDetailView = () => {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const navigate    = useNavigate();
  const location    = useLocation();
  const lang        = useLang();
  const isUrdu      = lang === "ur";

  const { isLoggedIn } = useAuth();

  const gradeType    = location.state?.gradeType as string | undefined;
  const stateSubject = location.state?.selectedSubject;

  const { classInfo, subjects, chapters, chapterVideos, loading } =
    useClassSubjects(Number(classId));

  const subject     = useMemo(() =>
    subjects?.find((s: any) => String(s.id) === String(subjectId)) ?? stateSubject ?? null,
    [subjects, subjectId, stateSubject]);

  const subjectName = isUrdu
    ? subject?.urdu_name?.trim() || subject?.name || ""
    : subject?.name || "";

  const theme     = getSubjectTheme(subject?.name || "");
  const heroTitle = isUrdu ? theme.heroTitle.ur : theme.heroTitle.en;
const tagline = isUrdu ? subject?.urdu_desc || "" : subject?.desc || "";

  const subjectChapters: Chapter[] = useMemo(() =>
    chapters
      .filter((c: any) => String(c.subject_id) === String(subjectId))
      .map((c: any) => ({ ...c, videos: chapterVideos[c.id] || [] })),
    [chapters, chapterVideos, subjectId]);

  const allVideos: Video[]  = useMemo(() => subjectChapters.flatMap((c) => c.videos), [subjectChapters]);
  const allVideoIds         = useMemo(() => allVideos.map((v) => v.id), [allVideos]);
  const totalLessons        = allVideos.length;
  const totalChapters       = subjectChapters.length;

  /* ── v2 progress hook (same as KGLectureView) ───────────── */
  const {
    progressMap,
    watchedSet,
    fetchJourneyForVideo,
    handleTimeUpdate: progressTimeUpdate,
    handleEnded: progressEnded,
    handleView,
    flushBeforeSwitch,
  } = useVideoProgress(allVideoIds, isLoggedIn);

  /* ── Video player state ──────────────────────────────────── */
  const [openChapterId,  setOpenChapterId]  = useState<number | null>(null);
  const [activeVideo,    setActiveVideo]    = useState<Video | null>(null);
  const [activeChapter,  setActiveChapter]  = useState<Chapter | null>(null);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>("");

  /**
   * resumePositionRef holds the position fetched BEFORE the player mounts.
   * Read directly in onCanPlay — no stale-state risk.
   */
  const resumePositionRef = useRef<number>(0);
  const videoRef          = useRef<HTMLVideoElement>(null);

  /* first-play view tracking */
  const viewFiredRef = useRef(false);

  useEffect(() => {
    if (subjectChapters.length > 0 && openChapterId === null) {
      setOpenChapterId(subjectChapters[0].id);
    }
  }, [subjectChapters]);

  const watchedCount = watchedSet.size;
  const progressPct  = totalLessons > 0 ? Math.round((watchedCount / totalLessons) * 100) : 0;

  const gradeName = useMemo(() => {
    if (!classInfo) return `Class ${classId}`;
    if (!isUrdu) return classInfo.name || `Class ${classId}`;
    const u = classInfo.urdu_name?.trim();
    if (u) return u;
    const m = (classInfo.name || "").match(/\d+/);
    return m ? `جماعت ${m[0]}` : classInfo.name || `Class ${classId}`;
  }, [classInfo, isUrdu, classId]);

  const isChapterUnlocked = (idx: number) => idx === 0 || isLoggedIn;

  /* ── Play a video: fetch journey FIRST, then mount player ── */
const playVideo = useCallback(async (video: Video, chapter: Chapter) => {
  const chapterIdx = subjectChapters.findIndex((c) => c.id === chapter.id);
  if (!isChapterUnlocked(chapterIdx)) {
    navigate("/login", { state: { from: location.pathname } });
    return;
  }
  flushBeforeSwitch();
  const position = await fetchJourneyForVideo(video.id);
  resumePositionRef.current = position;
  viewFiredRef.current = false;

  setActiveVideo(video);
  setActiveChapter(chapter);

  // NEW: fetch the real playable URL — the list endpoint doesn't include it.
  try {
    const detail = await fetchPrimaryVideoDetail(video.id);
    setResolvedVideoUrl(detail.video_url || `${CDN}${video.path}`);
  } catch {
    setResolvedVideoUrl(`${CDN}${video.path}`); // fallback
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}, [flushBeforeSwitch, fetchJourneyForVideo, subjectChapters, isChapterUnlocked, navigate, location.pathname]);
const exitPlayer = useCallback(() => {
  flushBeforeSwitch();
  setActiveVideo(null);
  setActiveChapter(null);
  setResolvedVideoUrl("");
}, [flushBeforeSwitch]);
  /* ── onCanPlay: seek to saved position ──────────────────── */
  const hasSeekRef = useRef(false);
  // Reset whenever the active video changes
  useEffect(() => { hasSeekRef.current = false; }, [activeVideo?.id]);

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

  /* ── onTimeUpdate ─────────────────────────────────────────── */
  const handleTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      if (!activeVideo) return;
      const v = e.target as HTMLVideoElement;
      progressTimeUpdate(activeVideo.id, v.currentTime, v.duration);
    },
    [activeVideo, progressTimeUpdate],
  );

  /* ── onEnded ──────────────────────────────────────────────── */
  const handleVideoEnded = useCallback(() => {
    if (!activeVideo || !videoRef.current) return;
    progressEnded(activeVideo.id, videoRef.current.duration || 0);
    // Auto-advance to next video in chapter
    if (activeChapter) {
      const idx = activeChapter.videos.findIndex((v) => v.id === activeVideo.id);
      if (idx < activeChapter.videos.length - 1) {
        playVideo(activeChapter.videos[idx + 1], activeChapter);
      }
    }
  }, [activeVideo, activeChapter, progressEnded, playVideo]);

  /* ── Upcoming videos list ─────────────────────────────────── */
  const upcomingVideos = useMemo(() => {
    if (!activeVideo) return [];
    const flat = subjectChapters.flatMap((c) => c.videos.map((v) => ({ video: v, chapter: c })));
    const cur  = flat.findIndex((x) => x.video.id === activeVideo.id);
    return flat.slice(cur + 1, cur + 6).map((x, i) => ({ ...x, globalIdx: cur + 1 + i }));
  }, [activeVideo, subjectChapters]);

  /* ══════════════════════════════════════════════════════════
     VIDEO PLAYER MODE
  ══════════════════════════════════════════════════════════ */
  if (activeVideo && activeChapter) {
    const videoTitle = isUrdu ? activeVideo.urdu_name || activeVideo.name : activeVideo.name;
   const videoUrl = resolvedVideoUrl;
    const pctActive  = watchedSet.has(activeVideo.id) ? 100 : progressMap[activeVideo.id] || 0;

    return (
      <div style={{
        minHeight: "100vh",
        background: "#F0F4FA",
        fontFamily: "'Nunito','Segoe UI',sans-serif",
        direction: isUrdu ? "rtl" : "ltr",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; }

          .psv-back { display:inline-flex; align-items:center; gap:6px; color:${theme.color}; font-weight:700; font-size:.9rem; background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; padding:0; transition:opacity .15s; }
          .psv-back:hover { opacity:.7; }

          .psv-player-outer { max-width:1300px; margin:0 auto; padding:24px 20px 48px; width:100%; }
          .psv-player-grid  { display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:flex-start; width:100%; min-width:0; }

          .psv-info-row { display:grid; grid-template-columns:1fr 210px 230px; gap:14px; margin-top:16px; align-items:stretch; width:100%; min-width:0; }
          .psv-info-box { background:#fff; border-radius:18px; box-shadow:0 2px 14px rgba(0,0,0,.07); border:1.5px solid #E9EEF6; display:flex; flex-direction:column; min-width:0; }
          .psv-box-desc  { padding:22px 22px 20px; justify-content:space-between; gap:16px; }
          .psv-box-robot { padding:20px 16px; align-items:center; justify-content:center; gap:12px; }
          .psv-box-goal  { padding:22px 20px; justify-content:center; gap:14px; }

          .psv-quiz-btn { display:inline-flex; align-items:center; justify-content:center; gap:9px; padding:13px 0; border-radius:13px; border:none; font-weight:900; font-size:.88rem; cursor:pointer; font-family:'Nunito',sans-serif; transition:transform .15s,filter .15s,box-shadow .15s; text-transform:uppercase; letter-spacing:.4px; white-space:nowrap; flex:1; min-width:0; }
          .psv-quiz-btn:hover { transform:translateY(-2px); filter:brightness(1.07); box-shadow:0 6px 18px rgba(0,0,0,.14); }

          .psv-next-item { display:flex; gap:12px; align-items:flex-start; padding:10px 12px; border-radius:14px; cursor:pointer; transition:background .15s; border:1.5px solid transparent; }
          .psv-next-item:hover { background:rgba(37,99,235,.06); border-color:rgba(37,99,235,.12); }
        .psv-next-item.locked { cursor:pointer; }
.psv-next-item.locked .psv-next-thumb { opacity:.5; }

          @media(max-width:1024px){ .psv-player-grid{ grid-template-columns:1fr; } }
          @media(max-width:860px) { .psv-info-row{ grid-template-columns:1fr 1fr; } .psv-box-goal{ grid-column:1/-1; } }
          @media(max-width:560px) { .psv-info-row{ grid-template-columns:1fr; } .psv-box-goal{ grid-column:auto; } .psv-player-outer{ padding:16px 14px 40px; } }
        `}</style>

        <div className="psv-player-outer">
          <button className="psv-back" onClick={exitPlayer} style={{ marginBottom: 20 }}>
            {isUrdu ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            {isUrdu ? "اسباق پر واپس" : "Back to Lessons"}
          </button>

          <div className="psv-player-grid">

            {/* ══ LEFT: video + meta + 3 boxes ══ */}
            <div style={{ minWidth: 0 }}>

              {/* Video element */}
              <div style={{ background: "#000", borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,.25)" }}>
                <div style={{ aspectRatio: "16/9" }}>
                  <video
                    ref={videoRef}
                    key={videoUrl}
                    src={videoUrl}
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
                <div style={{ height: 4, background: "#E5E7EB", borderRadius: 4, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pctActive}%`, background: theme.color, borderRadius: 4, transition: "width .4s ease" }} />
                </div>
              )}

              {/* Chapter label + title */}
              <div style={{ marginTop: 14, marginBottom: 2 }}>
                <p style={{ fontSize: ".72rem", fontWeight: 800, color: theme.color, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>
                  {isUrdu ? activeChapter.urdu_name || activeChapter.name : activeChapter.name}
                </p>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#111827", margin: "0 0 4px", lineHeight: 1.25 }}>{videoTitle}</h2>
                {activeVideo.desc && (
                  <p style={{ fontSize: ".85rem", color: "#5A6A8C", lineHeight: 1.6, margin: 0 }}>
                    {isUrdu ? activeVideo.urdu_desc || activeVideo.desc : activeVideo.desc}
                  </p>
                )}
              </div>

              {/* ══ 3 info boxes ══ */}
              <div className="psv-info-row">

                {/* BOX 1 — description + action buttons */}
                <div className="psv-info-box psv-box-desc">
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 900, color: theme.color, margin: "0 0 8px", lineHeight: 1.3 }}>
                      {subjectName}: {heroTitle}
                    </h3>
                   <p style={{ fontSize: ".82rem", color: "#6B7280", lineHeight: 1.65, margin: 0 }}>
  {isUrdu ? activeVideo.urdu_desc || "" : activeVideo.desc || ""}
</p>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="psv-quiz-btn" style={{ background: theme.color, color: "#fff" }}
                      onClick={() => navigate(`/class/${classId}/quiz`)}>
                      <HelpCircle size={16} /> {isUrdu ? "کوئز لیں" : "Take a Quiz"}
                    </button>
                    <button className="psv-quiz-btn" style={{ background: "#92400E", color: "#fff" }}
                      onClick={() => navigate("/games")}>
                      <Gamepad2 size={16} /> {isUrdu ? "گیم کھیلیں" : "Play a Game"}
                    </button>
                  </div>
                </div>

                {/* BOX 2 — AI Tutor robot */}
                <div className="psv-info-box psv-box-robot">
                  <div style={{ width: 100, height: 100, borderRadius: "50%", overflow: "hidden", border: `3px solid ${theme.pill}`, boxShadow: "0 4px 18px rgba(0,0,0,.12)", flexShrink: 0 }}>
                    <img src={robotImg} alt="AI Tutor" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ background: "#F8FAFC", borderRadius: 13, padding: "11px 14px", textAlign: "center", border: "1px solid #E5E7EB", width: "100%" }}>
                    <p style={{ fontSize: ".8rem", color: "#374151", fontStyle: "italic", margin: 0, lineHeight: 1.55 }}>
                      {isUrdu ? `"بہت اچھا، چھوٹے سیکھنے والے!"` : `"You're doing great, Little Learner!"`}
                    </p>
                  </div>
                </div>

                {/* BOX 3 — Daily goal / overall progress */}
                <div className="psv-info-box psv-box-goal" style={{ background: theme.light, borderColor: theme.pill }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.pill, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Target size={18} style={{ color: theme.color }} />
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: 900, color: "#111827", margin: 0 }}>
                      {isUrdu ? "روزانہ ہدف" : "Daily Goal"}
                    </h4>
                  </div>
                  <div>
                    <div style={{ background: "rgba(0,0,0,.1)", borderRadius: 100, height: 12, overflow: "hidden", marginBottom: 10 }}>
                      <div style={{ height: "100%", width: `${progressPct}%`, background: theme.color, borderRadius: 100, transition: "width .4s ease" }} />
                    </div>
                    <p style={{ fontSize: ".82rem", color: theme.color, fontWeight: 800, margin: "0 0 5px" }}>
                      {progressPct >= 100
                        ? (isUrdu ? "شاندار! تمام اسباق مکمل!" : "Amazing! All lessons done!")
                        : (isUrdu ? "بہت اچھا! جاری رکھیں!" : "Almost there! Keep going!")}
                    </p>
                    <p style={{ fontSize: ".74rem", color: "#6B7280", margin: 0, fontWeight: 600 }}>
                      {watchedCount} {isUrdu ? "میں سے" : "of"} {totalLessons} {isUrdu ? "اسباق مکمل" : "lessons done"}
                    </p>
                  </div>
                </div>

              </div>{/* end psv-info-row */}
            </div>

            {/* ══ RIGHT: What's Next ══ */}
            <div style={{ minWidth: 0 }}>
              <div style={{ background: "#fff", borderRadius: 18, padding: "18px 16px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", position: "sticky", top: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <ChevronRight size={18} style={{ color: theme.color }} />
                  <h3 style={{ fontSize: ".95rem", fontWeight: 900, color: "#111827", margin: 0 }}>
                    {isUrdu ? "آگے کیا ہے" : "What's Next"}
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {upcomingVideos.length === 0 && (
                    <p style={{ fontSize: ".82rem", color: "#9CA3AF", textAlign: "center", padding: "20px 0" }}>
                      {isUrdu ? "یہ آخری سبق ہے! 🎉" : "You're on the last lesson! 🎉"}
                    </p>
                  )}
                  {upcomingVideos.map(({ video, chapter, globalIdx }) => {
                    const locked = !isChapterUnlocked(subjectChapters.findIndex((c) => c.id === chapter.id));
                    const title  = isUrdu ? video.urdu_name || video.name : video.name;
                    const thumb  = getThumbUrl(video);
                    const vidPct = watchedSet.has(video.id) ? 100 : progressMap[video.id] || 0;
                    return (
                     <div key={video.id} className="psv-next-item"
  onClick={() => locked
    ? navigate("/login", { state: { from: location.pathname } })
    : playVideo(video, chapter)}>
                        <div className="psv-next-thumb" style={{ width: 82, height: 54, borderRadius: 10, overflow: "hidden", background: "#E9EEF6", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                          {locked
                            ? <Lock size={18} style={{ color: "#6B7280" }} />
                            : <>
                                {thumb && (
                                  <img src={thumb} alt={title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)", transition: "filter .25s", position: "absolute", inset: 0, zIndex: 1 }}
                                    onMouseEnter={(e) => (e.currentTarget.style.filter = "grayscale(0)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.filter = "grayscale(1)")}
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                  />
                                )}
                                {/* Small progress bar on thumbnail */}
                                {vidPct > 0 && vidPct < 100 && (
                                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,.2)", zIndex: 2 }}>
                                    <div style={{ height: "100%", width: `${vidPct}%`, background: theme.color }} />
                                  </div>
                                )}
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                                  {watchedSet.has(video.id)
                                    ? <CheckCircle2 size={16} style={{ color: "#22C55E", filter: "drop-shadow(0 1px 3px rgba(0,0,0,.5))" }} />
                                    : <Play size={14} style={{ color: "#fff", filter: "drop-shadow(0 1px 3px rgba(0,0,0,.7))" }} />}
                                </div>
                              </>
                          }
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: ".7rem", fontWeight: 800, color: locked ? "#6B7280" : theme.color, textTransform: "uppercase", letterSpacing: .4, margin: "0 0 2px" }}>
                            {isUrdu ? "مرحلہ" : "Step"} {globalIdx + 1}
                          </p>
                          <p style={{ fontSize: ".85rem", fontWeight: 700, color: locked ? "#374151" : "#111827", margin: "0 0 3px", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
                          <p style={{ fontSize: ".72rem", color: locked ? "#6B7280" : "#9CA3AF", margin: 0, display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                            {locked
                              ? <><Lock size={10} style={{ color: "#6B7280" }} /><span>{isUrdu ? "مقفل" : "Locked"}</span></>
                              : watchedSet.has(video.id)
                                ? <><CheckCircle2 size={10} style={{ color: "#22C55E" }} /><span style={{ color: "#22C55E" }}>{isUrdu ? "مکمل" : "Done"}</span></>
                                : <><Clock size={10} />3–5 {isUrdu ? "منٹ" : "mins"}</>}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     CHAPTER / LECTURES BROWSE VIEW
  ══════════════════════════════════════════════════════════ */
  const activeChapterData = subjectChapters.find((c) => c.id === openChapterId) ?? subjectChapters[0] ?? null;
  const activeChapterIdx  = subjectChapters.findIndex((c) => c.id === activeChapterData?.id);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F0F4FA",
      fontFamily: "'Nunito','Segoe UI',sans-serif",
      direction: isUrdu ? "rtl" : "ltr",
      overflowX: "hidden",
      boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes pgPulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        .psv-hero { border-radius:24px; overflow:hidden; display:grid; grid-template-columns:1fr 1.2fr; min-height:380px; margin-bottom:28px; box-shadow:0 6px 28px rgba(0,0,0,.1); }
        .psv-hero-left { padding:44px 40px; display:flex; flex-direction:column; justify-content:center; gap:16px; }
        .psv-hero-right { position:relative; overflow:hidden; align-self:stretch; }
        .psv-hero-right img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:center; display:block; }

        .psv-bc { display:flex; align-items:center; gap:6px; font-size:.78rem; font-weight:700; flex-wrap:wrap; }
        .psv-bc a { text-decoration:none; transition:opacity .15s; }
        .psv-bc a:hover { opacity:.7; }
        .psv-hero-title { font-size:clamp(1.7rem,3.2vw,2.5rem); font-weight:900; line-height:1.1; margin:0; }
        .psv-hero-sub   { font-size:.92rem; line-height:1.7; margin:0; max-width:460px; color:#374151; }
        .psv-pill { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:100px; font-size:.82rem; font-weight:800; background:#fff; box-shadow:0 1px 6px rgba(0,0,0,.09); }

        .psv-layout { display:grid; grid-template-columns:320px 1fr; gap:20px; align-items:flex-start; width:100%; min-width:0; }

        .psv-sidebar { background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 2px 16px rgba(0,0,0,.08); position:sticky; top:20px; max-height:calc(100vh - 40px); overflow-y:auto; min-width:0; }
        .psv-prog-box { padding:20px 18px 16px; border-bottom:1.5px solid #F1F5F9; }
        .psv-prog-label { display:flex; justify-content:space-between; align-items:center; margin-bottom:9px; }
        .psv-prog-bg { background:#E5E7EB; border-radius:100px; height:10px; overflow:hidden; margin-bottom:6px; }
        .psv-prog-fill { height:100%; border-radius:100px; transition:width .5s ease; }
        .psv-ch-label { padding:14px 18px 5px; font-size:.72rem; font-weight:900; color:#9CA3AF; text-transform:uppercase; letter-spacing:1.2px; }
        .psv-ch-row { border-top:1px solid #F1F5F9; }
        .psv-ch-btn { width:100%; display:flex; align-items:center; gap:11px; padding:14px 18px; background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; transition:background .14s; text-align:left; }
        .psv-ch-btn:hover { background:#F8FAFF; }
        .psv-ch-btn.active { background:#EFF6FF; }
        .psv-ch-icon { width:34px; height:34px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .psv-ch-info { flex:1; min-width:0; }
        .psv-ch-num  { font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.8px; margin:0 0 2px; }
        .psv-ch-name { font-size:.9rem; font-weight:700; color:#111827; margin:0; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .psv-lec-sub { padding:8px 18px 8px 52px; display:flex; align-items:center; gap:9px; width:100%; background:none; border:none; cursor:pointer; font-family:'Nunito',sans-serif; transition:background .12s; text-align:left; }
        .psv-lec-sub:hover { background:#F8FAFF; }

        .psv-lec-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
        .psv-lec-card { background:#fff; border-radius:18px; overflow:hidden; cursor:pointer; border:2px solid transparent; box-shadow:0 2px 12px rgba(0,0,0,.07); transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,border-color .15s; }
        .psv-lec-card:hover { transform:translateY(-5px); box-shadow:0 12px 32px rgba(0,0,0,.12); }
        .psv-lec-thumb { aspect-ratio:16/9; position:relative; overflow:hidden; background:#E5E7EB; }
        .psv-lec-thumb img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; z-index:1; filter:grayscale(1) brightness(.92); transition:filter .35s ease; }
        .psv-lec-card:hover .psv-lec-thumb img { filter:grayscale(0) brightness(1); }
        .psv-lec-thumb-placeholder { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; z-index:0; }
        .psv-play-ov { position:absolute; inset:0; z-index:4; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.28); opacity:0; transition:opacity .2s; }
        .psv-lec-card:hover .psv-play-ov { opacity:1; }
        .psv-lec-body { padding:14px 16px 16px; }
        .psv-lec-chapter-tag { font-size:.68rem; font-weight:900; text-transform:uppercase; letter-spacing:.8px; margin:0 0 5px; }
        .psv-lec-title { font-size:1rem; font-weight:800; color:#111827; margin:0 0 5px; line-height:1.35; }
        .psv-lec-desc  { font-size:.8rem; color:#6B7280; margin:0; line-height:1.5; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }

        @media(max-width:1200px){ .psv-hero{ grid-template-columns:1fr 1fr; min-height:320px; } }
        @media(max-width:1024px){ .psv-layout{ grid-template-columns:280px 1fr; } .psv-hero{ grid-template-columns:1fr 340px; min-height:280px; } .psv-hero-left{ padding:36px 30px; } }
        @media(max-width:860px) { .psv-layout{ grid-template-columns:1fr; } .psv-sidebar{ position:static; max-height:none; } .psv-hero{ grid-template-columns:1fr; min-height:auto; } .psv-hero-right{ height:220px; } .psv-hero-left{ padding:28px 24px; gap:12px; } }
        @media(max-width:600px) { .psv-lec-grid{ grid-template-columns:1fr; } .psv-hero-right{ height:180px; } }
      `}</style>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "clamp(16px,3vw,36px) clamp(12px,3vw,24px) 60px", width: "100%" }}>

        {/* ══ HERO ══ */}
        {loading ? (
          <div style={{ borderRadius: 24, background: "#E5E7EB", height: 300, marginBottom: 28, animation: "pgPulse 1.4s ease-in-out infinite" }} />
        ) : (
          <div className="psv-hero" style={{ background: theme.light }}>
            <div className="psv-hero-left">
              <div className="psv-bc" style={{ color: theme.color }}>
                <Link to="/" style={{ color: theme.color }}>{isUrdu ? "ہوم" : "Home"}</Link>
                <ChevronRight size={13} />
                <Link to={`/class/${classId}`} state={{ gradeType }} style={{ color: theme.color }}>{gradeName}</Link>
                <ChevronRight size={13} />
                <span style={{ color: "#374151" }}>{subjectName}</span>
              </div>
              <h1 className="psv-hero-title" style={{ color: theme.color }}>{heroTitle}</h1>
              <p className="psv-hero-sub">{tagline}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span className="psv-pill" style={{ color: theme.color }}>
                  <BookOpen size={14} style={{ color: theme.color }} />
                  {totalChapters} {isUrdu ? "ابواب" : "Chapters"} • {totalLessons} {isUrdu ? "اسباق" : "Lessons"}
                </span>
                <span className="psv-pill" style={{ color: "#065F46" }}>
                  <Gamepad2 size={14} style={{ color: "#065F46" }} />
                  {isUrdu ? "۸ کھیل" : "8 Games"}
                </span>
                {watchedCount > 0 && (
                  <span className="psv-pill" style={{ color: "#16A34A" }}>
                    <CheckCircle2 size={14} style={{ color: "#16A34A" }} />
                    {progressPct}% {isUrdu ? "مکمل" : "Done"}
                  </span>
                )}
              </div>
            </div>
            <div className="psv-hero-right">
              <img src={theme.heroImg} alt={subjectName} />
            </div>
          </div>
        )}

        {/* ══ QUICK RESOURCES ══ */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 24, marginBottom: 32, boxShadow: "0 4px 20px rgba(0,0,0,.05)", border: "1px solid #E9EEF6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ background: theme.light, padding: 10, borderRadius: 12, color: theme.color }}>
              <Zap size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 900, color: "#111827" }}>
                {isUrdu ? "فوری وسائل" : "Quick Resources"}
              </h3>
              <p style={{ margin: 0, fontSize: ".8rem", color: "#6B7280" }}>
                {isUrdu ? "اپنی پڑھائی کو مزید بہتر بنائیں" : "Enhance your learning with extra materials"}
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <button onClick={() => navigate("/worksheets/0")}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 14, border: "1.5px solid #E9EEF6", background: "#F8FAFC", cursor: "pointer", transition: "all 0.2s", fontWeight: 800, fontSize: ".9rem", color: "#374151", fontFamily: "'Nunito',sans-serif" }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = theme.color)}
              onMouseOut={(e)  => (e.currentTarget.style.borderColor = "#E9EEF6")}>
              <FileText size={20} style={{ color: theme.color }} />
              {isUrdu ? "ورک شیٹس" : "Worksheets"}
            </button>
            <button onClick={() => navigate(`/class/${classId}/quiz`)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 14, border: "1.5px solid #E9EEF6", background: "#F0FDF4", cursor: "pointer", transition: "all 0.2s", fontWeight: 800, fontSize: ".9rem", color: "#065F46", fontFamily: "'Nunito',sans-serif" }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
              onMouseOut={(e)  => (e.currentTarget.style.borderColor = "#E9EEF6")}>
              <BookMarked size={20} style={{ color: "#22C55E" }} />
              {isUrdu ? "باب کے کوئز" : "Chapter Quizzes"}
            </button>
          </div>
        </div>

        {/* ══ CHAPTER LAYOUT ══ */}
        <div className="psv-layout">

          {/* ── SIDEBAR ── */}
          <aside className="psv-sidebar">

            {/* Overall progress (now driven by v2 API) */}
            <div className="psv-prog-box">
              <div className="psv-prog-label">
                <span style={{ fontWeight: 900, fontSize: ".95rem", color: "#111827" }}>{isUrdu ? "میری پیشرفت" : "My Progress"}</span>
                <span style={{ fontWeight: 900, fontSize: ".95rem", color: theme.color }}>{progressPct}%</span>
              </div>
              <div className="psv-prog-bg">
                <div className="psv-prog-fill" style={{ width: `${progressPct}%`, background: theme.color }} />
              </div>
              <p style={{ fontSize: ".78rem", color: "#6B7280", margin: 0, fontWeight: 700 }}>
                {watchedCount} {isUrdu ? "میں سے" : "of"} {totalLessons} {isUrdu ? "اسباق مکمل!" : "lessons finished!"}
              </p>
            </div>

            <p className="psv-ch-label">{isUrdu ? "تمام ابواب" : "All Chapters"}</p>

            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ height: 60, background: "#F1F5F9", margin: "2px 14px", borderRadius: 12, animation: "pgPulse 1.4s ease-in-out infinite" }} />
                ))
              : subjectChapters.map((chapter, idx) => {
                  const unlocked  = isChapterUnlocked(idx);
                  const isOpen    = openChapterId === chapter.id;
                  const chWatched = chapter.videos.filter((v) => watchedSet.has(v.id)).length;
                  const chDone    = chapter.videos.length > 0 && chWatched === chapter.videos.length;
                  const chLabel   = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
                  return (
                    <div key={chapter.id} className="psv-ch-row">
                      <button
  className={`psv-ch-btn${isOpen ? " active" : ""}`}
  onClick={() => {
    if (!unlocked) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setOpenChapterId(isOpen ? null : chapter.id);
  }}
  style={{ cursor: "pointer", opacity: unlocked ? 1 : 0.55 }}
>
                        <div className="psv-ch-icon" style={{ background: chDone ? "#DCFCE7" : isOpen ? theme.pill : "#F1F5F9", color: chDone ? "#16A34A" : isOpen ? theme.color : "#6B7280" }}>
                          {chDone ? <CheckCircle2 size={16} /> : unlocked ? (isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />) : <Lock size={14} />}
                        </div>
                        <div className="psv-ch-info">
                          <p className="psv-ch-num" style={{ color: isOpen ? theme.color : "#9CA3AF" }}>
                            {isUrdu ? `باب ${idx + 1}` : `CHAPTER ${idx + 1}`}
                          </p>
                          <p className="psv-ch-name">{chLabel}</p>
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
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: .2 }}
                            style={{ overflow: "hidden" }}
                          >
                            {chapter.videos.map((video) => {
                              const watched = watchedSet.has(video.id);
                              const vTitle  = isUrdu ? video.urdu_name || video.name : video.name;
                              const isCur   = activeVideo?.id === video.id;
                              return (
                                <button key={video.id} className="psv-lec-sub"
                                  onClick={() => playVideo(video, chapter)}
                                  style={{ background: isCur ? theme.light : "none", borderLeft: `3px solid ${isCur ? theme.color : "transparent"}` }}
                                >
                                  <span style={{ color: watched ? "#22C55E" : theme.color, flexShrink: 0 }}>
                                    {watched
                                      ? <CheckCircle2 size={13} />
                                      : <span style={{ width: 8, height: 8, borderRadius: "50%", border: `2px solid ${theme.color}`, display: "inline-block" }} />}
                                  </span>
                                  <span style={{ fontSize: ".82rem", fontWeight: 600, color: isCur ? theme.color : "#374151", lineHeight: 1.3, textAlign: "left" }}>
                                    {vTitle}
                                  </span>
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
              <button onClick={() => navigate(`/class/${classId}`, { state: { gradeType } })}
                style={{ color: theme.color, fontWeight: 700, fontSize: ".84rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'Nunito',sans-serif", padding: 0 }}>
                {isUrdu ? "→" : "←"} {isUrdu ? "مضامین پر واپس" : "Back to Subjects"}
              </button>
            </div>

            {/* Sidebar daily goal */}
            <div style={{ margin: "0 14px 14px", background: theme.light, borderRadius: 14, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: theme.pill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target size={15} style={{ color: theme.color }} />
                </div>
                <span style={{ fontWeight: 900, fontSize: ".9rem", color: "#111827" }}>{isUrdu ? "روزانہ ہدف" : "Daily Goal"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".78rem", color: "#6B7280", marginBottom: 5 }}>
                <span>{isUrdu ? "سیکھنے کا وقت" : "Learning Time"}</span>
                <span style={{ fontWeight: 800, color: theme.color }}>15/20 min</span>
              </div>
              <div style={{ background: "#E5E7EB", borderRadius: 100, height: 7, overflow: "hidden" }}>
                <div style={{ height: "100%", width: "75%", background: theme.color, borderRadius: 100 }} />
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main style={{ minWidth: 0 }}>
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ borderRadius: 18, background: "#fff", height: 220, animation: "pgPulse 1.4s ease-in-out infinite" }} />
                ))}
              </div>
            ) : activeChapterData ? (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: ".72rem", fontWeight: 900, color: theme.color, textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 4px" }}>
                      {isUrdu ? "ابھی سیکھ رہے ہیں" : "CURRENTLY LEARNING"}
                    </p>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#111827", margin: "0 0 4px", lineHeight: 1.2 }}>
                      {isUrdu
                        ? `باب ${activeChapterIdx + 1}: ${activeChapterData.urdu_name || activeChapterData.name}`
                        : `Chapter ${activeChapterIdx + 1}: ${activeChapterData.name}`}
                    </h2>
                    <p style={{ fontSize: ".85rem", color: "#6B7280", margin: 0 }}>
                      {isUrdu ? "جادوئی آوازوں کے راز کھولیں!" : "Unlock the secrets that make every word sound right!"}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F1F5F9", borderRadius: 100, padding: "7px 16px", flexShrink: 0 }}>
                    <Clock size={14} style={{ color: "#6B7280" }} />
                    <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#374151" }}>
                      {activeChapterData.videos.length * 4}:00 {isUrdu ? "کل" : "Total"}
                    </span>
                  </div>
                </div>

                {activeChapterData.videos.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#9CA3AF" }}>
                    <BookOpen size={40} strokeWidth={1} style={{ marginBottom: 12 }} />
                    <p style={{ fontWeight: 700 }}>{isUrdu ? "اسباق جلد آئیں گے!" : "Lessons coming soon!"}</p>
                  </div>
                ) : (
                  <div className="psv-lec-grid">
                    {activeChapterData.videos.map((video, idx) => {
                      const watched = watchedSet.has(video.id);
                      const pct     = watched ? 100 : progressMap[video.id] || 0;
                      const vTitle  = isUrdu ? video.urdu_name || video.name : video.name;
                      const vDesc   = isUrdu ? video.urdu_desc || video.desc : video.desc;
                      const isCur   = activeVideo?.id === video.id;
                      const thumb   = getThumbUrl(video);
                      const chLabel = isUrdu ? `باب ${activeChapterIdx + 1}` : `Chapter ${activeChapterIdx + 1}`;

                      return (
                        <div key={video.id} className="psv-lec-card"
                          style={{ borderColor: isCur ? theme.color : watched ? "#22C55E" : "transparent" }}
                          onClick={() => playVideo(video, activeChapterData)}
                        >
                          <div className="psv-lec-thumb">
                            <div className="psv-lec-thumb-placeholder" style={{ background: theme.light }}>
                              <PlayCircle size={40} style={{ color: theme.color, opacity: 0.3 }} />
                            </div>
                            {thumb && (
                              <img src={thumb} alt={vTitle}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                            {/* In-progress bar on the card thumbnail */}
                            {pct > 0 && pct < 100 && (
                              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,.2)", zIndex: 3 }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: theme.color }} />
                              </div>
                            )}
                            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: ".72rem", fontWeight: 700, padding: "3px 8px", borderRadius: 6, zIndex: 3 }}>
                              4:15
                            </div>
                            {isCur && (
                              <div style={{ position: "absolute", top: 8, left: 8, background: theme.color, color: "#fff", fontSize: ".68rem", fontWeight: 900, padding: "3px 10px", borderRadius: 6, letterSpacing: .4, zIndex: 3 }}>
                                {isUrdu ? "ابھی" : "ACTIVE NOW"}
                              </div>
                            )}
                            {watched && !isCur && (
                              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 3 }}>
                                <div style={{ background: "#22C55E", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <CheckCircle2 size={16} style={{ color: "#fff" }} />
                                </div>
                              </div>
                            )}
                            <div className="psv-play-ov">
                              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,.25)" }}>
                                <PlayCircle size={28} style={{ color: theme.color }} />
                              </div>
                            </div>
                          </div>
                          <div className="psv-lec-body">
                            <p className="psv-lec-chapter-tag" style={{ color: theme.color }}>{chLabel}</p>
                            <h4 className="psv-lec-title">{idx + 1}. {vTitle}</h4>
                            {vDesc && <p className="psv-lec-desc">{vDesc}</p>}
                          </div>
                        </div>
                      );
                    })}

                    {/* Quiz game card */}
                    <div
                      style={{ borderRadius: 18, border: "2px dashed #D1FAE5", background: "#F0FDF4", padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", textAlign: "center" }}
                      onClick={() => navigate(`/class/${classId}/quiz`)}
                    >
                      <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#22C55E", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Gamepad2 size={26} style={{ color: "#fff" }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: 900, color: "#111827", margin: "0 0 5px" }}>
                          {isUrdu ? "باب کا کوئز گیم" : "Chapter Quiz Game"}
                        </h4>
                        <p style={{ fontSize: ".8rem", color: "#6B7280", margin: "0 0 12px" }}>
                          {isUrdu ? "اپنی معلومات جانچیں اور بیج جیتیں!" : "Test your knowledge and win a badge!"}
                        </p>
                        <button
                          style={{ background: "#065F46", color: "#fff", border: "none", borderRadius: 11, padding: "10px 22px", fontWeight: 800, fontSize: ".88rem", cursor: "pointer", fontFamily: "'Nunito',sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}
                          onClick={(e) => { e.stopPropagation(); navigate(`/class/${classId}/quiz`); }}
                        >
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

export default PrimarySubjectDetailView;