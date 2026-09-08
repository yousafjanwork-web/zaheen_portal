import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen, FileText, FolderOpen, Settings, LayoutDashboard,
  GraduationCap, PlayCircle, ChevronLeft, ChevronRight, ChevronDown,
  CheckCircle2, Check, Clock, Star, Users, ArrowLeft, Lock,
} from "lucide-react";
import { getLanguage } from "@/modules/shared/i18n";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { resolveClassIdFromParam, getSlugByClassId } from "@/modules/shared/utils/skillsCourseSlugs";
import { useVideoProgress } from "../../shared/hooks/Usevideoprogress";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";
const heroImg300 = "https://cdn.zaheen.com.pk/zaheen-web-img/web-development.png";
const heroImg301 = "https://cdn.zaheen.com.pk/zaheen-web-img/auto-cad.png";
const heroImg302 = "https://cdn.zaheen.com.pk/zaheen-web-img/excel.png";
const heroImg303 = "https://cdn.zaheen.com.pk/zaheen-web-img/video-editing.png";
const heroImg304 = "https://cdn.zaheen.com.pk/zaheen-web-img/makeup.png";
const heroImg305 = "https://cdn.zaheen.com.pk/zaheen-web-img/trading-professional-skill-banner.jpeg";

const heroImages: Record<number, string> = {
  300: heroImg300,
  301: heroImg301,
  302: heroImg302,
  303: heroImg303,
  304: heroImg304,
  305: heroImg305,
};

const translations: Record<string, any> = {
  en: enTranslations,
  ur: urTranslations,
};

const getNestedValue = (obj: any, key: string): any =>
  key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);

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

  const dict = translations[lang] ?? translations.en;

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let val = getNestedValue(dict, key);
      if (typeof val !== "string") val = getNestedValue(translations.en, key);
      if (typeof val !== "string") return key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          val = val.replace(`{{${k}}}`, String(v));
        });
      }
      return val;
    },
    [dict]
  );

  const tArr = useCallback(
    (key: string): string[] => {
      const val = getNestedValue(dict, key);
      if (Array.isArray(val)) return val as string[];
      const fallback = getNestedValue(translations.en, key);
      return Array.isArray(fallback) ? (fallback as string[]) : [];
    },
    [dict]
  );

  return { t, tArr, lang };
};

/* ─────────────────────────────────────────────────────────────
   v2 Courses API — flat model.
   Each course = one parent_id (1-6). No subjects, no chapters.
   List:   GET /v2/api/videos?content_type=COURSE&parent_id=N
   Detail: GET /v2/api/videos/{id}   (adds video_url, used lazily on click)
──────────────────────────────────────────────────────────────── */
const V2_BASE = "https://api.zaheen.com.pk/v2/api";

interface V2VideoListItem {
  id: number;
  content_type: string;
  parent_id: number;
  title_en: string;
  title_ur?: string;
  description_html_en?: string;
  description_html_ur?: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  is_preview?: number;
  sort_order?: number;
}

interface V2VideoDetail extends V2VideoListItem {
  video_url?: string;
  notes_en?: string | null;
  notes_ur?: string | null;
  resources?: any[];
}

const fetchCourseVideos = async (parentId: number): Promise<V2VideoListItem[]> => {
  const res = await fetch(`${V2_BASE}/videos?content_type=COURSE&parent_id=${parentId}`);
  if (!res.ok) throw new Error("Course videos fetch failed");
  const json = await res.json();
  const list: V2VideoListItem[] = Array.isArray(json?.data) ? json.data : [];
  // Always trust sort_order, never raw list order
  return [...list].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
};

const fetchVideoDetail = async (videoId: number): Promise<V2VideoDetail> => {
  const res = await fetch(`${V2_BASE}/videos/${videoId}`);
  if (!res.ok) throw new Error("Video detail fetch failed");
  const json = await res.json();
  return json?.data;
};

/* ─────────────────────────────────────────────────────────────
   v2 Courses API
   GET /v2/api/courses  → returns all 6 courses at once.
   CONFIRMED (backend team, 2026-07-15): course.id is guaranteed to
   equal the parent_id used in /v2/api/videos?content_type=COURSE.
   So we key directly off id — no separate classId translation needed.
──────────────────────────────────────────────────────────────── */
interface V2Course {
  id: number; // == parent_id used by the videos endpoint
  category_id: number;
  title_en: string;
  title_ur?: string;
  description_en?: string | null;
  description_ur?: string | null;
  thumbnail_url?: string;
  is_bestseller?: number;
  is_new?: number;
  is_featured?: number;
  level?: string;
  total_duration?: number;
  total_lectures?: number;
  category_name?: string;
}

const fetchAllCourses = async (): Promise<V2Course[]> => {
  const res = await fetch(`${V2_BASE}/courses`);
  if (!res.ok) throw new Error("Courses fetch failed");
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

/* ─────────────────────────────────────────────────────────────
   Lecture — mapped from the v2 video shape.
   No chapter_id: this module has no chapter concept.
──────────────────────────────────────────────────────────────── */
interface Lecture {
  id: number;
  name: string;
  urdu_name?: string;
  desc?: string;
  urdu_desc?: string;
  sort_order: number;
  thumbnail_url?: string;
  video_url?: string; // filled in lazily via fetchVideoDetail on click
}

interface ClassInfo {
  class_id: number;
  name: string;
  urdu_name?: string;
  thumbnailUrl?: string;
}

const subjectIcons = [BookOpen, FileText, FolderOpen, Settings, LayoutDashboard];

const localName = (en: string, ur?: string, isRtl?: boolean) =>
  isRtl ? ur || en : en;

const TRADING_MODULES = [
  { id: 1, labelEn: "Trading Course Module 1", labelUr: "ٹریڈنگ کورس ماڈیول 1", start: 1,  end: 11 },
  { id: 2, labelEn: "Trading Course Module 2", labelUr: "ٹریڈنگ کورس ماڈیول 2", start: 12, end: 20 },
  { id: 3, labelEn: "Trading Course Module 3", labelUr: "ٹریڈنگ کورس ماڈیول 3", start: 21, end: 35 },
];

// classId → v2 parent_id
// CONFIRMED by testing each parent_id live and matching video titles
// against the real classId list in skillsCourseSlugs.ts (classIds 300-305).
// Do NOT assume a formula here — this mapping is NOT classId - 299 or similar;
// it was verified endpoint-by-endpoint on 2026-07-15.
const CLASS_TO_PARENT_ID: Record<number, number> = {
  305: 1, // Trading            -> "How To Become A Professional Trader"
  300: 2, // Full Stack Web Dev -> "Software Installation", "What is HTML?", ...
  301: 3, // AutoCAD 2D         -> "Auto Cad 2D Lecture 1", "Software Interface & Features", ...
  302: 4, // Microsoft Excel    -> "Microsoft Excel Lecture 1-4"
  303: 5, // Video Editing      -> "Video Editing Lecture 1-6"
  304: 6, // Makeup/Beautify    -> "Barbi-Core Glam...", "Classic Black & Grey Smokey Eye", ...
};

// Override display names per course ID — aligned with skillsCourseSlugs.ts classIds
const COURSE_DISPLAY_NAMES: Record<number, { en: string; ur?: string }> = {
  300: { en: "Full Stack Web Development Course" },
  301: { en: "Professional 2D Drafting and Design Course" },
  302: { en: "Advanced Excel Training Course" },
  303: { en: "Professional Production Editing Course" },
  304: { en: "Professional Makeup Course" },
  305: { en: "How To Become A Professional Trader" },
};

const DescriptionBlock = ({ desc, isRtl }: { desc: string; isRtl: boolean }) => {
  if (!desc) return null;
  const lines   = desc.split("\n").filter(Boolean);
  const intro:   string[] = [];
  const bullets: string[] = [];
  lines.forEach((line) => {
    const stripped = line.replace(/^\*+\s*/, "").trim();
    if (line.trim().startsWith("*")) bullets.push(stripped);
    else intro.push(line.trim());
  });
  return (
    <div className="space-y-3">
      {intro.map((p, i) => (
        <p key={i} className={`text-slate-500 text-sm leading-relaxed ${isRtl ? "text-right" : ""}`}>{p}</p>
      ))}
      {bullets.length > 0 && (
        <ul className="space-y-2 mt-1">
          {bullets.map((b, i) => (
            <li key={i} className={`flex items-start gap-2.5 ${isRtl ? "flex-row-reverse" : ""}`}>
              <span className="mt-[5px] w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
              <span className={`text-slate-700 text-sm font-medium leading-relaxed ${isRtl ? "text-right" : ""}`}>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const SkillsChaptersPage = () => {
  const { classId: classIdParam } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { t, tArr, lang } = useTranslation();
  const isRtl = lang === "ur";

  const classId = resolveClassIdFromParam(classIdParam);

  useEffect(() => {
    if (!classIdParam) return;
    const isNumericParam = /^\d+$/.test(classIdParam);
    if (!isNumericParam || classId === null) return;
    const slug = getSlugByClassId(classId);
    if (slug && slug !== classIdParam) navigate(`/skills/${slug}`, { replace: true });
  }, [classIdParam, classId, navigate]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  // classInfo is now derived locally — no API call needed.
  // Thumbnail falls back to the first lecture's thumbnail_url once loaded.
  const [classInfo,       setClassInfo]       = useState<ClassInfo | null>(null);
  const [lectures,        setLectures]        = useState<Lecture[]>([]);
  const [loadingCourse,   setLoadingCourse]   = useState(true);
  const [isWatchMode,     setIsWatchMode]     = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [videoUrl,        setVideoUrl]        = useState("");
  const [openModules,     setOpenModules]     = useState<Set<number>>(new Set([1]));

  const videoRef          = useRef<HTMLVideoElement>(null);
  const resumePositionRef = useRef<number>(0);
  const hasSeekRef        = useRef(false);
  const viewFiredRef      = useRef(false);

  // IDs are v2-native now — no legacy→v2 translation needed.
  const allVideoIds = useMemo(() => lectures.map((l) => l.id), [lectures]);

  const {
    progressMap,
    watchedSet,
    fetchJourneyForVideo,
    handleTimeUpdate:  progressTimeUpdate,
    handleEnded:       progressEnded,
    handleView,
    flushBeforeSwitch,
  } = useVideoProgress(allVideoIds, isLoggedIn);

  const refreshAllProgress = useCallback(async () => {
    if (!isLoggedIn || allVideoIds.length === 0) return;
    await Promise.all(allVideoIds.map((id) => fetchJourneyForVideo(id)));
  }, [isLoggedIn, allVideoIds, fetchJourneyForVideo]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshAllProgress();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [refreshAllProgress]);

  const didInitialSyncRef = useRef(false);
  useEffect(() => {
    if (allVideoIds.length === 0) return;
    if (didInitialSyncRef.current) return;
    didInitialSyncRef.current = true;
    refreshAllProgress();
  }, [allVideoIds, refreshAllProgress]);

  const currentIdx      = lectures.findIndex((l) => l.id === selectedLecture?.id);
  const totalLectures   = lectures.length;
  const totalWatched    = watchedSet.size;
  const progressPercent = totalLectures > 0 ? Math.round((totalWatched / totalLectures) * 100) : 0;
  const courseOverride  = classId !== null ? COURSE_DISPLAY_NAMES[classId] : undefined;
  // Real v2 course name (classInfo) takes priority; hardcoded map is only
  // a fallback for the brief moment before the /v2/api/courses fetch resolves.
  const courseName      = classInfo?.name
    ? localName(classInfo.name, classInfo.urdu_name, isRtl)
    : courseOverride
    ? (isRtl ? courseOverride.ur || courseOverride.en : courseOverride.en)
    : "";

  const isTradingCourse = classId === 305;

  const getModuleStartingAt = (globalIdx: number) =>
    isTradingCourse ? TRADING_MODULES.find((m) => m.start - 1 === globalIdx) ?? null : null;

  const getModuleForIdx = (globalIdx: number) => {
    const position = globalIdx + 1;
    return TRADING_MODULES.find((m) => position >= m.start && position <= m.end) ?? null;
  };

  const toggleModule = (id: number) =>
    setOpenModules((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const isLectureLocked = (globalIdx: number) => globalIdx > 0 && !isLoggedIn;

  const lectureName = (l: Lecture) => localName(l.name, l.urdu_name, isRtl);

  const learnPoints     = tArr("skillsChaptersPage.learnSection.points");
  const requirements    = tArr("skillsChaptersPage.requirements.items");
  const descriptionText = t("skillsChaptersPage.description.text");

  /* ── Data fetching — course info + videos, both from v2 ──────
     course.id == parent_id (confirmed by backend team), so we key
     both calls off the same CLASS_TO_PARENT_ID value.
  ──────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (classId === null) { setLoadingCourse(false); return; }
    const parentId = CLASS_TO_PARENT_ID[classId];
    if (!parentId) { setLoadingCourse(false); return; }

    setLoadingCourse(true);
    setLectures([]);
    setIsWatchMode(false);
    setSelectedLecture(null);

    (async () => {
      try {
        const [list, courses] = await Promise.all([
          fetchCourseVideos(parentId),
          fetchAllCourses(),
        ]);

        const mapped: Lecture[] = list.map((v) => ({
          id: v.id,
          name: v.title_en,
          urdu_name: v.title_ur,
          desc: v.description_html_en,
          urdu_desc: v.description_html_ur,
          sort_order: v.sort_order ?? 0,
          thumbnail_url: v.thumbnail_url,
        }));

        setLectures(mapped);

        // Real course info from v2, matched by id === parent_id.
        const course = courses.find((c) => c.id === parentId);
        setClassInfo({
          class_id: classId,
          name: course?.title_en ?? courseOverride?.en ?? "",
          urdu_name: course?.title_ur ?? courseOverride?.ur,
          thumbnailUrl: course?.thumbnail_url ?? mapped[0]?.thumbnail_url,
        });
      } catch (e) {
        console.error(e);
      }
      setLoadingCourse(false);
    })();
  }, [classId]);

  /* ── Select lecture — fetch video_url lazily on click ── */
  const selectLecture = useCallback(async (lecture: Lecture) => {
    const globalIdx = lectures.findIndex((l) => l.id === lecture.id);
    if (globalIdx > 0 && !isLoggedIn) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    flushBeforeSwitch();

    const position = await fetchJourneyForVideo(lecture.id);
    resumePositionRef.current = position;

    hasSeekRef.current   = false;
    viewFiredRef.current = false;

    setSelectedLecture(lecture);
    setIsWatchMode(true);
    window.scrollTo({ top: 0, behavior: "auto" });

    try {
      const detail = await fetchVideoDetail(lecture.id);
      setVideoUrl(detail.video_url || "");
    } catch (e) {
      console.error("Failed to fetch video detail", e);
      setVideoUrl("");
    }
  }, [lectures, isLoggedIn, navigate, flushBeforeSwitch, fetchJourneyForVideo]);

  const handleCanPlay = useCallback(() => {
    if (hasSeekRef.current) return;
    hasSeekRef.current = true;
    if (resumePositionRef.current > 2 && videoRef.current) {
      videoRef.current.currentTime = resumePositionRef.current;
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (!selectedLecture || viewFiredRef.current) return;
    viewFiredRef.current = true;
    handleView(selectedLecture.id);
  }, [selectedLecture, handleView]);

  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!selectedLecture) return;
    const v = e.target as HTMLVideoElement;
    progressTimeUpdate(selectedLecture.id, v.currentTime, v.duration);
  }, [selectedLecture, progressTimeUpdate]);

  const handleEnded = useCallback(() => {
    if (!selectedLecture || !videoRef.current) return;
    progressEnded(selectedLecture.id, videoRef.current.duration || 0);
    const idx = lectures.findIndex((l) => l.id === selectedLecture.id);
    if (idx < lectures.length - 1) selectLecture(lectures[idx + 1]);
  }, [selectedLecture, progressEnded, lectures, selectLecture]);

  const exitWatchMode = useCallback(() => {
    flushBeforeSwitch();
    setIsWatchMode(false);
    setSelectedLecture(null);
    setVideoUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => { refreshAllProgress(); }, 300);
  }, [flushBeforeSwitch, refreshAllProgress]);

  const goNext = useCallback(() => {
    if (currentIdx < lectures.length - 1) selectLecture(lectures[currentIdx + 1]);
  }, [currentIdx, lectures, selectLecture]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) selectLecture(lectures[currentIdx - 1]);
  }, [currentIdx, lectures, selectLecture]);

  /* ════════════════════════════════════════
     WATCH MODE
  ════════════════════════════════════════ */
  if (isWatchMode && selectedLecture) {
    return (
      <div className="min-h-screen bg-white flex flex-col">

        <div className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 md:px-6 h-14 flex items-center gap-4 shrink-0 shadow-sm">
          <button
            onClick={exitWatchMode}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors text-sm font-semibold group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
              <ArrowLeft size={16} className={isRtl ? "rotate-180" : ""} />
            </div>
            <span className="hidden sm:block">{t("skillsChaptersPage.watchMode.backBtn")}</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold text-sm truncate leading-tight">{courseName}</p>
            <p className="text-slate-400 text-[11px] font-medium truncate">
              {t("skillsChaptersPage.watchMode.lectureOf", { current: currentIdx + 1, total: totalLectures })}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" dir="ltr">
            <button
              onClick={goPrev}
              disabled={currentIdx === 0}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={goNext}
              disabled={currentIdx >= totalLectures - 1}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row flex-1 overflow-hidden">

          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-white">
            <div className="w-full bg-black">
              <div className="w-full aspect-video">
                {videoUrl ? (
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
                    onError={(e) => console.error("Video error", e)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900 relative">
                    <img
                   src={classId !== null ? (heroImages[classId] ?? "") : ""}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <PlayCircle size={40} className="text-white" />
                      </div>
                      <p className="text-white/60 text-sm text-center px-8">{lectureName(selectedLecture)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full px-5 md:px-7 pt-5 pb-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <h2 className={`text-xl md:text-2xl font-black text-slate-900 leading-snug mb-3 ${isRtl ? "text-right" : ""}`}>
                  {lectureName(selectedLecture)}
                </h2>
                {(isRtl ? selectedLecture.urdu_desc : selectedLecture.desc) && (
                  <DescriptionBlock
                    desc={isRtl ? selectedLecture.urdu_desc || selectedLecture.desc || "" : selectedLecture.desc || ""}
                    isRtl={isRtl}
                  />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar (flat lecture list, no chapters) */}
          <div className="w-full xl:w-[520px] shrink-0 bg-white border-t xl:border-t-0 xl:border-l border-slate-200 flex flex-col xl:sticky xl:top-1 xl:h-[calc(100vh-3.5rem)] overflow-hidden shadow-xl">

            <div className="px-6 py-5 border-b border-slate-200 shrink-0 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[12px] font-bold text-indigo-600 shrink-0">{progressPercent}%</span>
              </div>
              <p className="text-[12px] text-slate-400 mt-1.5">
                {totalWatched} / {totalLectures} {t("skillsChaptersPage.watchMode.completed")}
              </p>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <span className="text-[14px] font-black text-slate-900">{courseName}</span>
              </div>

              {lectures.map((lecture, globalIdx) => {
                const isSelected    = selectedLecture?.id === lecture.id;
                const isWatched     = watchedSet.has(lecture.id);
                const progress      = isWatched ? 100 : (progressMap[lecture.id] ?? 0);
                const locked        = isLectureLocked(globalIdx);
                const moduleStart   = getModuleStartingAt(globalIdx);
                const lectureModule = getModuleForIdx(globalIdx);
                const moduleIsOpen  = lectureModule ? openModules.has(lectureModule.id) : true;

                return (
                  <React.Fragment key={lecture.id}>
                    {moduleStart && (
                      <button
                        onClick={() => toggleModule(moduleStart.id)}
                        className="w-full flex items-center justify-between px-6 py-3 bg-slate-100/60 hover:bg-slate-100 border-b border-slate-200 transition-colors text-left"
                      >
                        <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                          {isRtl ? moduleStart.labelUr : moduleStart.labelEn}
                        </p>
                        <ChevronDown
                          size={15}
                          className={`text-indigo-500 shrink-0 transition-transform duration-200 ${moduleIsOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                    {(!lectureModule || moduleIsOpen) && (
                      <div
                        onClick={() => selectLecture(lecture)}
                        className={`flex items-start gap-4 px-6 py-4 cursor-pointer border-b border-slate-100 transition-all ${
                          isSelected ? "bg-indigo-50 border-l-4 border-l-indigo-500" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {locked ? (
                            <Lock size={18} className="text-slate-500" />
                          ) : isWatched ? (
                            <CheckCircle2 size={20} className="text-emerald-500" />
                          ) : isSelected ? (
                            <PlayCircle size={20} className="text-indigo-600" />
                          ) : (
                            <div className="w-[20px] h-[20px] rounded-full border-2 border-slate-300 flex items-center justify-center">
                              <span className="text-[8px] text-slate-400 font-bold">{globalIdx + 1}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold leading-snug ${
                            isSelected ? "text-indigo-700" : locked ? "text-slate-500" : isWatched ? "text-slate-400" : "text-slate-800"
                          } ${isRtl ? "text-right" : ""}`}>
                            {lectureName(lecture)}
                          </p>
                          {locked && (
                            <span className="text-[11px] text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                              <Lock size={10} /> {isRtl ? "مقفل" : "Locked"}
                            </span>
                          )}
                          {!locked && !isWatched && progress > 0 && progress < 100 && (
                            <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden w-full">
                              <div
                                className="h-full bg-indigo-400 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════
     COURSE PAGE (non-watch mode)
  ════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HERO BANNER */}
      <div className="relative w-full min-h-[400px] md:min-h-[590px] overflow-hidden">
        <img
       src={classId !== null ? (heroImages[classId] ?? "") : ""}
          alt={courseName}
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col justify-end h-full min-h-[400px] md:min-h-[480px] pb-14 pt-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-indigo-600 text-white text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
              {t("skillsChaptersPage.badges.bestseller")}
            </span>
            <span className="bg-white/15 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20">
              {t("skillsChaptersPage.badges.professional")}
            </span>
          </div>

          {loadingCourse ? (
            <div className="h-12 w-72 bg-white/20 rounded-xl animate-pulse mb-4" />
          ) : (
            <h1 className={`text-3xl md:text-5xl font-black text-white leading-tight mb-4 max-w-2xl drop-shadow-lg ${isRtl ? "text-right" : ""}`}>
              {courseName || t("skillsChaptersPage.badges.professional")}
            </h1>
          )}

          <p className={`text-white/80 text-[15px] leading-relaxed max-w-xl mb-6 ${isRtl ? "text-right" : ""}`}>
            {t("skillsChaptersPage.hero.subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-sm mb-7">
            <div className="flex items-center gap-1.5 text-white/80">
              <BookOpen size={14} />
              <span>{totalLectures} {t("skillsChaptersPage.hero.lectures")}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80">
              <Clock size={14} />
              <span>{t("skillsChaptersPage.hero.level")}</span>
            </div>
          </div>

          {isLoggedIn && totalLectures > 0 && totalWatched > 0 && (
            <div className="mb-6 max-w-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white/70 text-[12px] font-semibold">
                  {totalWatched} / {totalLectures} {t("skillsChaptersPage.watchMode.completed")}
                </span>
                <span className="text-indigo-300 text-[12px] font-bold">{progressPercent}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={() => document.getElementById("content-section")?.scrollIntoView({ behavior: "smooth" })}
            className="w-fit flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-[15px] px-7 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/40"
          >
            <PlayCircle size={20} />
            {totalWatched > 0 ? "Continue Learning" : t("skillsChaptersPage.hero.startBtn")}
          </button>
        </div>
      </div>

      {/* WHAT YOU'LL LEARN */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-black text-slate-900 mb-6">{t("skillsChaptersPage.learnSection.title")}</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {learnPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check size={16} className="text-indigo-600 shrink-0 mt-0.5" strokeWidth={2.5} />
              <span className={`text-[14px] text-slate-700 leading-relaxed ${isRtl ? "text-right" : ""}`}>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* COURSE CONTENT — flat list, no subject tabs, no chapters */}
      <div id="content-section" className="max-w-5xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-slate-900">{t("skillsChaptersPage.content.title")}</h2>
          {isLoggedIn && totalLectures > 0 && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-700">{progressPercent}% {t("skillsChaptersPage.watchMode.completed") || "Complete"}</p>
                <p className="text-[11px] text-slate-400">{totalWatched}/{totalLectures} lectures</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center">
                <span className="text-[11px] font-black text-indigo-600">{progressPercent}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="text-[15px] font-bold text-slate-900">{t("skillsChaptersPage.content.allLectures")}</h3>
            <span className="text-[13px] text-slate-400 font-medium">
              {totalLectures} {t("skillsChaptersPage.content.lectures")}
            </span>
          </div>

          {loadingCourse ? (
            <div className="space-y-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-5 border-b border-slate-100 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-200" />
                    <div>
                      <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
                      <div className="h-3 w-28 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : lectures.length > 0 ? (
            lectures.map((lecture, index) => {
              const locked        = isLectureLocked(index);
              const isWatched     = watchedSet.has(lecture.id);
              const progress      = isWatched ? 100 : (progressMap[lecture.id] ?? 0);
              const moduleStart   = getModuleStartingAt(index);
              const lectureModule = getModuleForIdx(index);
              const moduleIsOpen  = lectureModule ? openModules.has(lectureModule.id) : true;

              return (
                <React.Fragment key={lecture.id}>
                  {moduleStart && (
                    <button
                      onClick={() => toggleModule(moduleStart.id)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 border-b border-slate-100 transition-colors text-left"
                    >
                      <h4 className="text-[13px] font-black text-indigo-600 uppercase tracking-widest">
                        {isRtl ? moduleStart.labelUr : moduleStart.labelEn}
                      </h4>
                      <ChevronDown
                        size={16}
                        className={`text-indigo-500 shrink-0 transition-transform duration-200 ${moduleIsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                  {(!lectureModule || moduleIsOpen) && (
                    <div
                      onClick={() => selectLecture(lecture)}
                      className="flex items-center justify-between px-6 py-5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[14px] transition-all shrink-0 ${
                          locked
                            ? "bg-slate-200 text-slate-500"
                            : isWatched
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                        }`}>
                          {locked ? <Lock size={16} /> : isWatched ? <CheckCircle2 size={18} /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-[15px] ${locked ? "text-slate-500" : "text-slate-900"} ${isRtl ? "text-right" : ""}`}>
                            {lectureName(lecture)}
                          </p>
                          {locked && (
                            <p className={`text-xs mt-0.5 text-slate-400 flex items-center gap-1 ${isRtl ? "text-right justify-end" : ""}`}>
                              <Lock size={10} /> {isRtl ? "مقفل" : "Locked"}
                            </p>
                          )}
                          {!locked && !isWatched && progress > 0 && progress < 100 && (
                            <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden max-w-[200px]">
                              <div
                                className="h-full bg-indigo-400 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all shrink-0 ${locked ? "text-slate-400" : isWatched ? "text-emerald-500" : "text-indigo-600"}`}>
                        {locked ? <Lock size={18} /> : isWatched ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                        <span className="hidden sm:block">
                          {isWatched ? "Rewatch" : t("skillsChaptersPage.content.watch")}
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                <GraduationCap size={38} className="text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {t("skillsChaptersPage.content.comingSoonTitle")}
              </h3>
              <p className="text-slate-500 max-w-md text-[14px] leading-relaxed">
                {t("skillsChaptersPage.content.comingSoonDesc")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* REQUIREMENTS & DESCRIPTION */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">{t("skillsChaptersPage.requirements.title")}</h2>
            <ul className="space-y-3">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  <span className={`text-[14px] text-slate-600 leading-relaxed ${isRtl ? "text-right" : ""}`}>{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-5">{t("skillsChaptersPage.description.title")}</h2>
            <div className="space-y-3">
              {descriptionText.split("\n\n").filter(Boolean).map((para, i) => (
                <p key={i} className={`text-[14px] text-slate-600 leading-relaxed ${isRtl ? "text-right" : ""}`}>
                  {para.trim()}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsChaptersPage;