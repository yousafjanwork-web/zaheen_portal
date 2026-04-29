import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
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
  Loader2,
  Download,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import thumbnail from "../../../assets/images/9-banner.png";

interface Video {
  id: number;
  name: string;
  urdu_name?: string;
  path: string;
  desc?: string;
  urdu_desc?: string;
}

interface ChapterWithVideos {
  id: number;
  name: string;
  urdu_name?: string;
  subject_id: number;
  videos: Video[];
}

const getMeta = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("physic"))
    return { icon: Atom,         color: "text-blue-700",    bg: "bg-blue-50",    accent: "#1d4ed8", label: "SSC", desc: "Explore the fundamental principles governing the physical world." };
  if (n.includes("math"))
    return { icon: Sigma,        color: "text-blue-700",  bg: "bg-blue-50",  accent: "#3273dc", label: "SSC", desc: "Master algebra, geometry, trigonometry, and advanced problem-solving techniques." };
  if (n.includes("chem"))
    return { icon: FlaskConical, color: "text-blue-700", bg: "bg-blue-50", accent: "#3273dc", label: "SSC", desc: "Chemical reactions, atomic structure, and laboratory techniques." };
  if (n.includes("bio"))
    return { icon: Leaf,         color: "text-blue-700",   bg: "bg-blue-50",   accent: "#3273dc", label: "SSC", desc: "Cellular processes, genetics, and the study of living organisms." };
  if (n.includes("english"))
    return { icon: BookOpen,     color: "text-blue-700",     bg: "bg-blue-50",     accent: "#3273dc", label: "SSC", desc: "Literature analysis, advanced grammar, and composition." };
  if (n.includes("urdu"))
    return { icon: Languages,    color: "text-blue-700",    bg: "bg-blue-50",    accent: "#3273dc", label: "SSC", desc: "Classical literature, poetry, and advanced linguistics." };
  if (n.includes("islamic"))
    return { icon: Landmark,     color: "text-blue-700",    bg: "bg-blue-50",    accent: "#3273dc", label: "SSC", desc: "Quranic studies, Hadith, Islamic history and ethics." };
  if (n.includes("pakistan"))
    return { icon: Globe,        color: "text-blue-700",  bg: "bg-blue-50",  accent: "#3273dc", label: "SSC", desc: "History, geography, and civics of Pakistan." };
  if (n.includes("computer") || n.includes("cs"))
    return { icon: Cpu,          color: "text-blue-700",  bg: "bg-blue-50",  accent: "#3273dc", label: "SSC", desc: "Programming, algorithms, and computational thinking." };
  return   { icon: Calculator,   color: "text-blue-600",   bg: "bg-blue-100",  accent: "#3273dc", label: "Course", desc: "Course materials and lectures." };
};

/* ── Lecture Card (grid view) ── */
interface LectureCardProps {
  video: Video;
  lectureNumber: number;
  isSelected: boolean;
  isWatched: boolean;
  progress: number;
  isUpNext: boolean;
  onClick: () => void;
  isUrdu: boolean;
  accentColor: string;
}

const LectureCard = ({
  video, lectureNumber, isSelected, isWatched,
  progress, isUpNext, onClick, isUrdu, accentColor,
}: LectureCardProps) => {
  const title = isUrdu ? video.urdu_name || video.name : video.name;
  const descRaw = isUrdu ? video.urdu_desc || video.desc : video.desc;
  const shortDesc = descRaw?.split("|")[0]?.trim() || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 bg-white ${
        isSelected ? "border-2 shadow-lg" : "border-slate-100 hover:shadow-md hover:border-slate-200"
      }`}
      style={isSelected ? { borderColor: accentColor, boxShadow: `0 4px 20px ${accentColor}22` } : {}}
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {isUpNext && !isSelected && (
          <div className="absolute top-3 left-3 z-20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: accentColor }}>Up Next</div>
        )}
        {isWatched && !isSelected && (
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
        ) : (
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle size={30} className="text-white drop-shadow-lg" />
          </div>
        )}
        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
            <div className="h-full transition-all" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
          </div>
        )}
        <div className="absolute bottom-2.5 left-3 z-20">
          <span className="text-white/70 text-[10px] font-bold tracking-widest uppercase">Lecture {lectureNumber}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          {isWatched ? (
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1"><CheckCircle2 size={11} /> Watched</span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-[11px] font-semibold" style={{ color: accentColor }}>{Math.round(100 - progress)}% left</span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Not started</span>
          )}
        </div>
        <h4 className={`text-[14px] font-bold text-slate-900 leading-snug line-clamp-2 ${isUrdu ? "text-right" : ""}`}>{title}</h4>
        {shortDesc && <p className="text-[12px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{shortDesc}</p>}
      </div>
    </motion.div>
  );
};

/* ── Sidebar Row (YouTube right panel) ── */
interface SidebarRowProps {
  video: Video;
  lectureNumber: number;
  isSelected: boolean;
  isWatched: boolean;
  progress: number;
  onClick: () => void;
  isUrdu: boolean;
  accentColor: string;
}

const SidebarRow = ({ video, lectureNumber, isSelected, isWatched, progress, onClick, isUrdu, accentColor }: SidebarRowProps) => {
  const title = isUrdu ? video.urdu_name || video.name : video.name;
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
        isSelected ? "border" : "hover:bg-slate-50 border border-transparent"
      }`}
      style={isSelected ? { backgroundColor: `${accentColor}11`, borderColor: `${accentColor}44` } : {}}
    >
      <div className="relative w-[130px] shrink-0 rounded-lg overflow-hidden aspect-video">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
          </div>
        )}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircle size={22} className="text-white" />
          </div>
        )}
        {isWatched && !isSelected && (
          <div className="absolute top-1 right-1"><CheckCircle2 size={14} className="text-emerald-400" /></div>
        )}
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Lecture {lectureNumber}</p>
        <h4 className={`text-[13px] font-bold leading-snug line-clamp-2 ${isUrdu ? "text-right" : ""}`}
          style={isSelected ? { color: accentColor } : { color: "#1e293b" }}>
          {title}
        </h4>
        {isWatched && (
          <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 flex items-center gap-1">
            <CheckCircle2 size={10} /> Watched
          </span>
        )}
        {!isWatched && progress > 0 && (
          <span className="text-[10px] font-semibold mt-0.5 block" style={{ color: accentColor }}>
            {Math.round(100 - progress)}% left
          </span>
        )}
      </div>
    </div>
  );
};

/* ── Chapter Section (grid view) ── */
interface ChapterSectionProps {
  chapter: ChapterWithVideos;
  chapterIndex: number;
  globalLectureOffset: number;
  selectedVideo: Video | null;
  watchedSet: Set<number>;
  progressMap: Record<number, number>;
  currentGlobalIdx: number;
  onSelect: (video: Video, chapterId: number) => void;
  isUrdu: boolean;
  accentColor: string;
  sidebarRef?: (el: HTMLDivElement | null) => void;
}

const CARDS_PER_PAGE = 3;

const ChapterSection = ({
  chapter, chapterIndex, globalLectureOffset,
  selectedVideo, watchedSet, progressMap,
  currentGlobalIdx, onSelect, isUrdu, accentColor, sidebarRef,
}: ChapterSectionProps) => {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(chapter.videos.length / CARDS_PER_PAGE);
  const visible = chapter.videos.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);
  const watchedInChapter = chapter.videos.filter((v) => watchedSet.has(v.id)).length;
  const chapterLabel = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
  const chapterNum = String(chapterIndex + 1).padStart(2, "0");
  const gridCols =
    visible.length === 1 ? "grid-cols-1 max-w-xs" :
    visible.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-2xl" :
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div id={`chapter-${chapter.id}`} ref={sidebarRef} className="mb-12 scroll-mt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[12px] font-black"
            style={{ backgroundColor: accentColor }}>{chapterNum}</div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chapter {chapterNum}</span>
            <h3 className={`text-[16px] font-black text-slate-900 leading-tight mt-0.5 ${isUrdu ? "text-right" : ""}`}>{chapterLabel}</h3>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-slate-400 font-medium hidden sm:block">
            {chapter.videos.length} lecture{chapter.videos.length !== 1 ? "s" : ""}
            {watchedInChapter > 0 && <span className="ml-1.5 text-emerald-500">· {watchedInChapter} watched</span>}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">{page + 1}/{totalPages}</span>
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.18 }} className={`grid gap-5 ${gridCols}`}>
          {visible.map((video, localIdx) => {
            const globalIdx = globalLectureOffset + page * CARDS_PER_PAGE + localIdx;
            return (
              <LectureCard
                key={video.id}
                video={video}
                lectureNumber={globalIdx + 1}
                isSelected={selectedVideo?.id === video.id}
                isWatched={watchedSet.has(video.id)}
                progress={watchedSet.has(video.id) ? 100 : progressMap[video.id] || 0}
                isUpNext={selectedVideo?.id !== video.id && !watchedSet.has(video.id) && globalIdx === currentGlobalIdx + 1}
                onClick={() => onSelect(video, chapter.id)}
                isUrdu={isUrdu}
                accentColor={accentColor}
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
   Main Page
══════════════════════════════════════════ */
const SubjectLecturesView = () => {
  const { classId, subjectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const lang = getLanguage();
  const isUrdu = lang === "ur";

  const gradeType = location.state?.gradeType;
  const selectedSubjectFromState = location.state?.selectedSubject;
  const classTitle = location.state?.classTitle || `Grade ${classId}`;

  const { classInfo, chapters, chapterVideos, loading } = useClassSubjects(Number(classId));

  const subjectChapters: ChapterWithVideos[] = useMemo(() => {
    return chapters
      .filter((c: any) => String(c.subject_id) === String(subjectId))
      .map((c: any) => ({ ...c, videos: chapterVideos[c.id] || [] }));
  }, [chapters, chapterVideos, subjectId]);

  const allVideos: Video[] = useMemo(() => subjectChapters.flatMap((c) => c.videos), [subjectChapters]);

  const chapterOffsets: number[] = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    subjectChapters.forEach((c) => { offsets.push(acc); acc += c.videos.length; });
    return offsets;
  }, [subjectChapters]);

  const subjectRawName = selectedSubjectFromState?.name || "Subject";
  const meta = getMeta(subjectRawName);
  const Icon = meta.icon;
  const subjectName = isUrdu ? selectedSubjectFromState?.urdu_name || subjectRawName : subjectRawName;

  const [selectedVideo, setSelectedVideo]     = useState<Video | null>(null);
  const [videoUrl, setVideoUrl]               = useState("");
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [progressMap, setProgressMap]         = useState<Record<number, number>>({});
  const [watchedSet, setWatchedSet]           = useState<Set<number>>(new Set());
  const [isWatchMode, setIsWatchMode]         = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentGlobalIdx = useMemo(
    () => allVideos.findIndex((v) => v.id === selectedVideo?.id),
    [allVideos, selectedVideo]
  );

  const totalWatched    = watchedSet.size;
  const totalLectures   = allVideos.length;
  const progressPercent = totalLectures > 0 ? Math.round((totalWatched / totalLectures) * 100) : 0;

  const trackEvent = useCallback((eventName: string) => {
    if (!window.gtag || !selectedVideo) return;
    window.gtag("event", eventName, { video_id: selectedVideo.id, video_name: selectedVideo.name, page_path: window.location.pathname });
  }, [selectedVideo]);

  const selectVideo = useCallback((video: Video, chapterId: number) => {
    setSelectedVideo(video);
    setActiveChapterId(chapterId);
    setIsWatchMode(true);
    if (videoRef.current) {
      (videoRef.current as any)._tracked50 = false;
      (videoRef.current as any)._started   = false;
    }
    setVideoUrl(`https://cdn.zaheen.com.pk/videos/${video.path}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goNext = useCallback(() => {
    if (currentGlobalIdx < allVideos.length - 1) {
      const next = allVideos[currentGlobalIdx + 1];
      const chapIdx = subjectChapters.findIndex((c) => c.videos.some((v) => v.id === next.id));
      selectVideo(next, subjectChapters[chapIdx]?.id ?? 0);
    }
  }, [currentGlobalIdx, allVideos, subjectChapters, selectVideo]);

  const goPrev = useCallback(() => {
    if (currentGlobalIdx > 0) {
      const prev = allVideos[currentGlobalIdx - 1];
      const chapIdx = subjectChapters.findIndex((c) => c.videos.some((v) => v.id === prev.id));
      selectVideo(prev, subjectChapters[chapIdx]?.id ?? 0);
    }
  }, [currentGlobalIdx, allVideos, subjectChapters, selectVideo]);

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
      setWatchedSet((prev) => new Set(prev).add(selectedVideo.id));
      setProgressMap((prev) => ({ ...prev, [selectedVideo.id]: 100 }));
      trackEvent("video_complete");
    }
    goNext();
  };
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.target as HTMLVideoElement;
    if (!v.duration || !selectedVideo) return;
    const pct = (v.currentTime / v.duration) * 100;
    setProgressMap((prev) => ({ ...prev, [selectedVideo.id]: Math.round(pct) }));
    if (pct > 50 && !(v as any)._tracked50) {
      (v as any)._tracked50 = true;
      trackEvent("video_50_percent");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft")  goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollToChapter = (idx: number) =>
    chapterRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const exitWatchMode = () => {
    setIsWatchMode(false);
    setSelectedVideo(null);
    setVideoUrl("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderDesc = (video: Video | null) => {
    if (!video) return null;
    const fullText = isUrdu ? video.urdu_desc || video.desc : video.desc;
    if (!fullText) return null;
    const parts = fullText.split("|").map((p) => p.trim()).filter(Boolean);
    return (
      <>
        <p className="text-sm font-semibold text-slate-800">{parts[0]}</p>
        {parts.slice(1).map((line, i) =>
          line.startsWith("-") ? (
            <p key={i} className="text-sm text-slate-700 mt-1">{line.replace("-", "").trim()}</p>
          ) : (
            <ul key={i} className="text-sm text-slate-500 mt-1 list-disc pl-4"><li>{line}</li></ul>
          )
        )}
      </>
    );
  };

  return (
    <section className="bg-[#F8FAFC] min-h-screen flex">

      {/* ══ SIDEBAR — hidden when watching ══ */}
      <aside className={`hidden w-[272px] shrink-0 h-screen sticky top-0 bg-grey-100 border-r border-slate-200 flex-col ${
        isWatchMode ? "lg:hidden" : "lg:flex"  // 👈 THE ONLY CHANGE
      }`}>
        <div className="px-6 pt-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-1">
            <div className={`${meta.bg} p-2 rounded-lg`}>
              <Icon size={16} className={meta.color} strokeWidth={1.8} />
            </div>
            <p className="font-extrabold text-[14px] text-slate-900 leading-tight truncate">{subjectName}</p>
          </div>
          <p className="text-slate-400 text-[12px] mt-1">Academic Session 2024-2026</p>
          <button className="mt-5 w-full text-white text-[13px] font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            style={{ backgroundColor: meta.accent }}>
            <Download size={14} /> Download Syllabus
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Chapters</p>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse mb-1" />
              ))
            : subjectChapters.map((ch, i) => {
                const isActive = activeChapterId === ch.id;
                const chLabel  = isUrdu ? ch.urdu_name || ch.name : ch.name;
                const watched  = ch.videos.filter((v) => watchedSet.has(v.id)).length;
                return (
                  <button key={ch.id}
                    onClick={() => { if (isWatchMode) exitWatchMode(); setTimeout(() => scrollToChapter(i), 50); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left ${
                      isActive ? "bg-slate-50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                    style={isActive ? { color: meta.accent } : {}}>
                    <span className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: isActive ? meta.accent : "#cbd5e1" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="truncate flex-1">{chLabel}</span>
                    {watched > 0 && watched === ch.videos.length && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                    {watched > 0 && watched < ch.videos.length && (
                      <span className="text-[10px] font-bold shrink-0" style={{ color: meta.accent }}>{watched}/{ch.videos.length}</span>
                    )}
                  </button>
                );
              })}
        </nav>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-10 overflow-x-hidden">

        {/* Mobile chapter pills */}
        <div className="lg:hidden mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {subjectChapters.map((ch, i) => (
              <button key={ch.id}
                onClick={() => { if (isWatchMode) exitWatchMode(); setTimeout(() => scrollToChapter(i), 50); }}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl text-[12px] font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
                Ch {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-slate-400 flex items-center gap-2 mb-7 flex-wrap">
          <Link to="/" className="hover:text-slate-600 transition-colors">{isUrdu ? "ہوم" : "Home"}</Link>
          <span>/</span>
          <Link to={`/class/${classId}`} state={{ gradeType }} className="hover:text-slate-600 transition-colors">{classTitle}</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{subjectName}</span>
          {isWatchMode && selectedVideo && (
            <>
              <span>/</span>
              <span className="text-slate-500 truncate max-w-[200px]">
                {isUrdu ? selectedVideo.urdu_name || selectedVideo.name : selectedVideo.name}
              </span>
            </>
          )}
        </div>

        {/* Subject header card */}
        {/* <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-9 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white text-[12px] font-bold px-3 py-1 rounded-lg tracking-wide"
                style={{ backgroundColor: meta.accent }}>{meta.label}</span>
              {selectedSubjectFromState?.teacher && (
                <span className="text-slate-500 text-sm">{selectedSubjectFromState.teacher}</span>
              )}
            </div>
            <h1 className="text-[36px] font-black text-[#0F172A] tracking-tight leading-none mb-2">{subjectName}</h1>
            <p className="text-slate-500 text-[15px] leading-relaxed max-w-xl">{meta.desc}</p>
          </div>
          {!loading && totalLectures > 0 && (
            <div className="bg-slate-50 rounded-2xl border border-slate-100 px-6 py-5 min-w-[200px] shrink-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500 font-medium">Course Progress</span>
                <span className="text-[22px] font-black" style={{ color: meta.accent }}>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.6 }}
                  className="h-full rounded-full" style={{ backgroundColor: meta.accent }} />
              </div>
              <p className="text-xs text-slate-400 font-medium">{totalWatched} / {totalLectures} Lectures Completed</p>
            </div>
          )}
        </div> */}

        {/* Loading */}
        {loading ? (
          <div className="space-y-10">
            {Array.from({ length: 3 }).map((_, ci) => (
              <div key={ci}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 bg-white animate-pulse">
                      <div className="aspect-video bg-slate-200" />
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
            <h2 className="text-2xl font-black text-slate-900 mb-3">{isUrdu ? "جلد آرہا ہے" : "Coming Soon"}</h2>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              {isUrdu ? `${subjectName} کے لیے مواد تیار کیا جا رہا ہے۔` : `Content for ${subjectName} is being prepared. Check back soon!`}
            </p>
          </div>

        ) : isWatchMode && selectedVideo ? (

          /* ══ YOUTUBE WATCH MODE ══ */
          <AnimatePresence mode="wait">
            <motion.div key="watch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }} className="flex flex-col xl:flex-row gap-6">

              {/* Left: player + info */}
              <div className="flex-1 min-w-0">
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <video ref={videoRef} key={videoUrl} controls autoPlay className="w-full h-full"
                      src={videoUrl} onLoadedData={handleLoaded} onPlay={handlePlay}
                      onEnded={handleEnded} onTimeUpdate={handleTimeUpdate}
                      onError={(e) => console.error("VIDEO ERROR", e)} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5 mt-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Lecture {currentGlobalIdx + 1} of {totalLectures}
                      </p>
                      <h2 className={`text-lg font-black text-slate-900 leading-snug ${isUrdu ? "text-right" : ""}`}>
                        {isUrdu ? selectedVideo.urdu_name || selectedVideo.name : selectedVideo.name}
                      </h2>
                      <div className="mt-2 space-y-1">{renderDesc(selectedVideo)}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={exitWatchMode}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-[13px] font-semibold hover:bg-slate-50 transition-all">
                        All Lectures
                      </button>
                      <button onClick={goPrev} disabled={currentGlobalIdx === 0}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={goNext} disabled={currentGlobalIdx >= allVideos.length - 1}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400 font-medium">Course Progress</span>
                      <span className="text-xs font-black" style={{ color: meta.accent }}>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }}
                        className="h-full rounded-full" style={{ backgroundColor: meta.accent }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{totalWatched} / {totalLectures} completed</p>
                  </div>
                </div>
              </div>

              {/* Right: all lectures */}
              <div className="w-full xl:w-[340px] shrink-0">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-6">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[14px] font-black text-slate-900">{isUrdu ? "تمام لیکچرز" : "All Lectures"}</h3>
                    <span className="text-[12px] text-slate-400 font-medium">{totalLectures} total</span>
                  </div>
                  <div className="overflow-y-auto max-h-[75vh] p-2 space-y-1">
                    {subjectChapters.map((chapter, chIdx) => (
                      <div key={chapter.id}>
                        <div className="px-2 pt-3 pb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-black"
                              style={{ backgroundColor: meta.accent }}>{chIdx + 1}</span>
                            {isUrdu ? chapter.urdu_name || chapter.name : chapter.name}
                          </p>
                        </div>
                        {chapter.videos.map((video, vidIdx) => {
                          const globalIdx = chapterOffsets[chIdx] + vidIdx;
                          return (
                            <SidebarRow
                              key={video.id}
                              video={video}
                              lectureNumber={globalIdx + 1}
                              isSelected={selectedVideo?.id === video.id}
                              isWatched={watchedSet.has(video.id)}
                              progress={progressMap[video.id] || 0}
                              onClick={() => selectVideo(video, chapter.id)}
                              isUrdu={isUrdu}
                              accentColor={meta.accent}
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

          /* ══ GRID VIEW ══ */
          <div>
            <h2 className="text-[22px] font-black text-slate-900 mb-7">{isUrdu ? "ویڈیو لیکچرز" : "Video Lectures"}</h2>
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
                onSelect={selectVideo}
                isUrdu={isUrdu}
                accentColor={meta.accent}
                sidebarRef={(el) => { chapterRefs.current[chIdx] = el; }}
              />
            ))}
          </div>
        )}
      </main>
    </section>
  );
};

export default SubjectLecturesView;