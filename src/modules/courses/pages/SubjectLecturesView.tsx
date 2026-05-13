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
  LayoutDashboard,
  FileText,
  ClipboardList,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";
import { useClassSubjects } from "@/modules/shared/hooks/useClassSubjects";
import thumbnail from "../../../assets/images/physics.png";

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
    return { icon: Atom,         color: "text-blue-700",   bg: "bg-blue-50",   accent: "#1d4ed8", desc: "Explore the fundamental principles governing the physical world." };
  if (n.includes("math"))
    return { icon: Sigma,        color: "text-violet-700", bg: "bg-violet-50", accent: "#7c3aed", desc: "Master algebra, geometry, trigonometry, and advanced problem-solving techniques." };
  if (n.includes("chem"))
    return { icon: FlaskConical, color: "text-emerald-700",bg: "bg-emerald-50",accent: "#059669", desc: "Chemical reactions, atomic structure, and laboratory techniques." };
  if (n.includes("bio"))
    return { icon: Leaf,         color: "text-green-700",  bg: "bg-green-50",  accent: "#16a34a", desc: "Cellular processes, genetics, and the study of living organisms." };
  if (n.includes("english"))
    return { icon: BookOpen,     color: "text-sky-700",    bg: "bg-sky-50",    accent: "#0284c7", desc: "Literature analysis, advanced grammar, and composition." };
  if (n.includes("urdu"))
    return { icon: Languages,    color: "text-rose-700",   bg: "bg-rose-50",   accent: "#e11d48", desc: "Classical literature, poetry, and advanced linguistics." };
  if (n.includes("islamic"))
    return { icon: Landmark,     color: "text-teal-700",   bg: "bg-teal-50",   accent: "#0d9488", desc: "Quranic studies, Hadith, Islamic history and ethics." };
  if (n.includes("pakistan"))
    return { icon: Globe,        color: "text-orange-700", bg: "bg-orange-50", accent: "#ea580c", desc: "History, geography, and civics of Pakistan." };
  if (n.includes("computer") || n.includes("cs"))
    return { icon: Cpu,          color: "text-indigo-700", bg: "bg-indigo-50", accent: "#4338ca", desc: "Programming, algorithms, and computational thinking." };
  return   { icon: Calculator,   color: "text-slate-600",  bg: "bg-slate-100", accent: "#475569", desc: "Course materials and lectures." };
};

/* ══════════════════════════════════════════
   SIDEBAR
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
  isUrdu: boolean;
  exitWatchMode: () => void;
  scrollToChapter: (idx: number) => void;
}

const NewSidebar = ({
  classId, subjectId, gradeType, selectedSubject,
  activeChapterId, subjectChapters, watchedSet,
  isWatchMode, meta, isUrdu, exitWatchMode, scrollToChapter,
}: NewSidebarProps) => {
  const navigate = useNavigate();

  const navState = { gradeType, selectedSubject };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: null,
      isStatic: true,
      isActive: false,
    },
    {
      id: "my-courses",
      label: "My Courses",
      icon: BookOpen,
      path: `/class/${classId}/subject/${subjectId}`,
      isStatic: false,
      isActive: true,
    },
    {
      id: "assessments",
      label: "Assessments",
      icon: ClipboardList,
      path: `/assessment/1`,
      isStatic: false,
      isActive: false,
    },
    {
      id: "past-papers",
      label: "Past Papers",
      icon: FileText,
      path: `/class/${classId}/subject/${subjectId}/past-papers`,
      isStatic: false,
      isActive: false,
    },
  ];

  return (
    <aside className="hidden lg:flex w-[272px] shrink-0 h-screen sticky top-0 border-r border-slate-200 flex-col bg-white">

      {/* Header */}
      <div className="px-6 pt-7 pb-5 border-b border-slate-100">
        <p className="text-[#1E3A8A] font-extrabold text-[16px] leading-tight">Course Manager</p>
        <p className="text-slate-400 text-[12px] mt-0.5">Academic Session 2024</p>
      </div>

      {/* Nav */}
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
                  item.isActive ? "text-[#1E3A8A]"
                  : item.isStatic ? "text-slate-300"
                  : "text-slate-400"
                }
              />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Chapter list indented under My Courses */}
        {subjectChapters.length > 0 && (
          <div className="mt-3 ml-2 border-l-2 border-slate-100 pl-4 space-y-0.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Chapters</p>
            {subjectChapters.map((ch, i) => {
              const isActive = activeChapterId === ch.id;
              const chLabel  = isUrdu ? ch.urdu_name || ch.name : ch.name;
              const watched  = ch.videos.filter((v) => watchedSet.has(v.id)).length;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    if (isWatchMode) exitWatchMode();
                    setTimeout(() => scrollToChapter(i), 50);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150 text-left ${
                    isActive ? "" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                  style={isActive ? { color: meta.accent } : {}}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-black"
                    style={{ backgroundColor: isActive ? meta.accent : "#cbd5e1" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate flex-1 text-[12px]">{chLabel}</span>
                  {watched > 0 && watched === ch.videos.length && (
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  )}
                  {watched > 0 && watched < ch.videos.length && (
                    <span className="text-[10px] font-bold shrink-0" style={{ color: meta.accent }}>
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
   SUBJECT HEADER BANNER
══════════════════════════════════════════ */
interface SubjectHeaderProps {
  gradeName: string;
  subjectName: string;
  meta: ReturnType<typeof getMeta>;
  isUrdu: boolean;
  gradeType: string;
  totalWatched: number;
  totalLectures: number;
  progressPercent: number;
}

// Extracts just the number from a grade name like "Grade 9" → "9"
// Falls back to gradeType if no number found
const getGradeBadgeLabel = (gradeName: string, gradeType: string): string => {
  if (gradeName) {
    const match = gradeName.match(/\d+/);
    if (match) return match[0];
  }
  return gradeType || "SSC";
};

const SubjectHeader = ({
  gradeName, subjectName, meta, isUrdu, gradeType,
  totalWatched, totalLectures, progressPercent,
}: SubjectHeaderProps) => {
  const Icon = meta.icon;
  const gradeBadge = getGradeBadgeLabel(gradeName, gradeType);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
      <div className="flex-1 min-w-0">

        {/* Badge row */}
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

        {/* Subject name — large, bold */}
        <h1 className={`text-[32px] font-black text-[#0F172A] leading-tight mb-1 ${isUrdu ? "text-right" : ""}`}>
          {subjectName}
        </h1>

        {/* Grade name — small, muted */}
        {gradeName && (
          <p className="text-[13px] font-semibold text-slate-400 mb-2">{gradeName}</p>
        )}

        {/* Description */}
        <p className={`text-[14px] text-slate-500 leading-relaxed max-w-xl ${isUrdu ? "text-right" : ""}`}>
          {meta.desc}
        </p>
      </div>

      {/* Progress box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shrink-0 w-full sm:w-[220px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold text-slate-500">Course Progress</span>
          <span className="text-[24px] font-black text-[#1E3A8A]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full"
            style={{ backgroundColor: meta.accent }}
          />
        </div>
        <p className="text-[12px] text-slate-400 text-center font-medium">
          {totalWatched} / {totalLectures} Lectures Completed
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   LECTURE CARD — fixed uniform height
══════════════════════════════════════════ */
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
  const title     = isUrdu ? video.urdu_name || video.name : video.name;
  const descRaw   = isUrdu ? video.urdu_desc || video.desc : video.desc;
  const shortDesc = descRaw?.split("|")[0]?.trim() || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 bg-white flex flex-col h-[280px] ${
        isSelected ? "border-2 shadow-lg" : "border-slate-100 hover:shadow-md hover:border-slate-200"
      }`}
      style={isSelected ? { borderColor: accentColor, boxShadow: `0 4px 20px ${accentColor}22` } : {}}
    >
      <div className="relative h-[155px] shrink-0 overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {isUpNext && !isSelected && (
          <div
            className="absolute top-3 left-3 z-20 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg"
            style={{ backgroundColor: accentColor }}
          >Up Next</div>
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

      <div className="p-4 flex flex-col flex-1 overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          {isWatched ? (
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 size={11} /> Watched
            </span>
          ) : progress > 0 && progress < 100 ? (
            <span className="text-[11px] font-semibold" style={{ color: accentColor }}>
              {Math.round(100 - progress)}% left
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Not started</span>
          )}
        </div>
        <h4 className={`text-[13px] font-bold text-slate-900 leading-snug line-clamp-2 ${isUrdu ? "text-right" : ""}`}>
          {title}
        </h4>
        {shortDesc && (
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{shortDesc}</p>
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
  onClick: () => void;
  isUrdu: boolean;
  accentColor: string;
}

const SidebarRow = ({
  video, lectureNumber, isSelected, isWatched, progress, onClick, isUrdu, accentColor,
}: SidebarRowProps) => {
  const title = isUrdu ? video.urdu_name || video.name : video.name;
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
        isSelected ? "border" : "hover:bg-slate-50 border border-transparent"
      }`}
      style={isSelected ? { backgroundColor: `${accentColor}11`, borderColor: `${accentColor}44` } : {}}
    >
      <div className="relative w-[110px] h-[62px] shrink-0 rounded-lg overflow-hidden">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
          </div>
        )}
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <PlayCircle size={20} className="text-white" />
          </div>
        )}
        {isWatched && !isSelected && (
          <div className="absolute top-1 right-1">
            <CheckCircle2 size={13} className="text-emerald-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Lecture {lectureNumber}</p>
        <h4
          className={`text-[12px] font-bold leading-snug line-clamp-2 ${isUrdu ? "text-right" : ""}`}
          style={isSelected ? { color: accentColor } : { color: "#1e293b" }}
        >
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

/* ══════════════════════════════════════════
   CHAPTER SECTION — 4 per page (2×2 grid)
══════════════════════════════════════════ */
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

const CARDS_PER_PAGE = 4;

const ChapterSection = ({
  chapter, chapterIndex, globalLectureOffset,
  selectedVideo, watchedSet, progressMap,
  currentGlobalIdx, onSelect, isUrdu, accentColor, sidebarRef,
}: ChapterSectionProps) => {
  const [page, setPage]      = useState(0);
  const totalPages            = Math.ceil(chapter.videos.length / CARDS_PER_PAGE);
  const visible               = chapter.videos.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);
  const watchedInChapter      = chapter.videos.filter((v) => watchedSet.has(v.id)).length;
  const chapterLabel          = isUrdu ? chapter.urdu_name || chapter.name : chapter.name;
  const chapterNum            = String(chapterIndex + 1).padStart(2, "0");

  return (
    <div id={`chapter-${chapter.id}`} ref={sidebarRef} className="mb-12 scroll-mt-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white text-[12px] font-black"
            style={{ backgroundColor: accentColor }}
          >{chapterNum}</div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Chapter {chapterNum}</span>
            <h3 className={`text-[16px] font-black text-slate-900 leading-tight mt-0.5 ${isUrdu ? "text-right" : ""}`}>
              {chapterLabel}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[12px] text-slate-400 font-medium hidden sm:block">
            {chapter.videos.length} lecture{chapter.videos.length !== 1 ? "s" : ""}
            {watchedInChapter > 0 && (
              <span className="ml-1.5 text-emerald-500">· {watchedInChapter} watched</span>
            )}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">{page + 1}/{totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={15} />
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
            const globalIdx = globalLectureOffset + page * CARDS_PER_PAGE + localIdx;
            return (
              <LectureCard
                key={video.id}
                video={video}
                lectureNumber={globalIdx + 1}
                isSelected={selectedVideo?.id === video.id}
                isWatched={watchedSet.has(video.id)}
                progress={watchedSet.has(video.id) ? 100 : progressMap[video.id] || 0}
                isUpNext={
                  selectedVideo?.id !== video.id &&
                  !watchedSet.has(video.id) &&
                  globalIdx === currentGlobalIdx + 1
                }
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
   MAIN PAGE
══════════════════════════════════════════ */
const SubjectLecturesView = () => {
  const { classId, subjectId } = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();
  const lang      = getLanguage();
  const isUrdu    = lang === "ur";

  const gradeType              = location.state?.gradeType;
  const selectedSubjectFromState = location.state?.selectedSubject;

  const { classInfo, chapters, chapterVideos, subjects, loading } =
    useClassSubjects(Number(classId));

  const gradeName  = classInfo?.name || "";
  const classTitle = gradeName;

  const selectedSubject = useMemo(() => {
    if (selectedSubjectFromState) return selectedSubjectFromState;
    return subjects?.find((s: any) => String(s.id) === String(subjectId)) ?? null;
  }, [selectedSubjectFromState, subjects, subjectId]);

  const subjectRawName = selectedSubject?.name || "";
  const meta           = getMeta(subjectRawName);

  const subjectName = isUrdu
    ? selectedSubject?.urdu_name || subjectRawName
    : subjectRawName;

  const subjectChapters: ChapterWithVideos[] = useMemo(() =>
    chapters
      .filter((c: any) => String(c.subject_id) === String(subjectId))
      .map((c: any) => ({ ...c, videos: chapterVideos[c.id] || [] })),
    [chapters, chapterVideos, subjectId]
  );

  const allVideos: Video[] = useMemo(
    () => subjectChapters.flatMap((c) => c.videos),
    [subjectChapters]
  );

  const chapterOffsets: number[] = useMemo(() => {
    const offsets: number[] = [];
    let acc = 0;
    subjectChapters.forEach((c) => { offsets.push(acc); acc += c.videos.length; });
    return offsets;
  }, [subjectChapters]);

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
    window.gtag("event", eventName, {
      video_id:   selectedVideo.id,
      video_name: selectedVideo.name,
      page_path:  window.location.pathname,
    });
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
      const next    = allVideos[currentGlobalIdx + 1];
      const chapIdx = subjectChapters.findIndex((c) => c.videos.some((v) => v.id === next.id));
      selectVideo(next, subjectChapters[chapIdx]?.id ?? 0);
    }
  }, [currentGlobalIdx, allVideos, subjectChapters, selectVideo]);

  const goPrev = useCallback(() => {
    if (currentGlobalIdx > 0) {
      const prev    = allVideos[currentGlobalIdx - 1];
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

  const chapterRefs     = useRef<(HTMLDivElement | null)[]>([]);
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

      {/* SIDEBAR */}
      <NewSidebar
        classId={classId}
        subjectId={subjectId}
        gradeType={gradeType}
        selectedSubject={selectedSubject}
        activeChapterId={activeChapterId}
        subjectChapters={subjectChapters}
        watchedSet={watchedSet}
        isWatchMode={isWatchMode}
        meta={meta}
        isUrdu={isUrdu}
        exitWatchMode={exitWatchMode}
        scrollToChapter={scrollToChapter}
      />

      {/* MAIN */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-10 overflow-x-hidden">

        {/* ── Mobile back button ── */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-[13px] font-semibold hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
            {isUrdu ? "واپس" : "Back"}
          </button>
        </div>

        {/* Mobile chapter pills */}
        <div className="lg:hidden mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {subjectChapters.map((ch, i) => (
              <button
                key={ch.id}
                onClick={() => {
                  if (isWatchMode) exitWatchMode();
                  setTimeout(() => scrollToChapter(i), 50);
                }}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl text-[12px] font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                Ch {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-slate-400 flex items-center gap-2 mb-6 flex-wrap">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            {isUrdu ? "ہوم" : "Home"}
          </Link>
          <span>/</span>
          <Link
            to={`/class/${classId}`}
            state={{ gradeType, selectedSubject }}
            className="hover:text-slate-600 transition-colors"
          >
            {classTitle}
          </Link>
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

        {/* Subject header banner */}
        {!loading && (
          <SubjectHeader
            gradeName={gradeName}
            subjectName={subjectName}
            meta={meta}
            isUrdu={isUrdu}
            gradeType={gradeType}
            totalWatched={totalWatched}
            totalLectures={totalLectures}
            progressPercent={progressPercent}
          />
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-10">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between gap-5 animate-pulse">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-8 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
              </div>
              <div className="w-[220px] h-[110px] bg-slate-200 rounded-xl shrink-0" />
            </div>
            {Array.from({ length: 2 }).map((_, ci) => (
              <div key={ci}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse" />
                  <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 bg-white animate-pulse h-[280px]">
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
              {isUrdu ? "جلد آرہا ہے" : "Coming Soon"}
            </h2>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              {isUrdu
                ? `${subjectName} کے لیے مواد تیار کیا جا رہا ہے۔`
                : `Content for ${subjectName} is being prepared. Check back soon!`}
            </p>
          </div>

        ) : isWatchMode && selectedVideo ? (

          /* WATCH MODE */
          <AnimatePresence mode="wait">
            <motion.div
              key="watch"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col xl:flex-row gap-6"
            >
              <div className="flex-1 min-w-0">
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <video
                      ref={videoRef} key={videoUrl} controls autoPlay className="w-full h-full"
                      src={videoUrl}
                      onLoadedData={handleLoaded} onPlay={handlePlay}
                      onEnded={handleEnded} onTimeUpdate={handleTimeUpdate}
                      onError={(e) => console.error("VIDEO ERROR", e)}
                    />
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
                      <button
                        onClick={exitWatchMode}
                        className="px-3 py-2 rounded-xl border border-slate-200 text-slate-500 text-[13px] font-semibold hover:bg-slate-50 transition-all"
                      >
                        All Lectures
                      </button>
                      <button
                        onClick={goPrev} disabled={currentGlobalIdx === 0}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={goNext} disabled={currentGlobalIdx >= allVideos.length - 1}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
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
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: meta.accent }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{totalWatched} / {totalLectures} completed</p>
                  </div>
                </div>
              </div>

              {/* Right panel — all lectures */}
              <div className="w-full xl:w-[320px] shrink-0">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden sticky top-6">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-[14px] font-black text-slate-900">
                      {isUrdu ? "تمام لیکچرز" : "All Lectures"}
                    </h3>
                    <span className="text-[12px] text-slate-400 font-medium">{totalLectures} total</span>
                  </div>
                  <div className="overflow-y-auto max-h-[75vh] p-2 space-y-1">
                    {subjectChapters.map((chapter, chIdx) => (
                      <div key={chapter.id}>
                        <div className="px-2 pt-3 pb-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded flex items-center justify-center text-white text-[8px] font-black"
                              style={{ backgroundColor: meta.accent }}
                            >{chIdx + 1}</span>
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

          /* GRID VIEW */
          <div>
            <h2 className="text-[20px] font-black text-slate-900 mb-7">
              {isUrdu ? "ویڈیو لیکچرز" : "Video Lectures"}
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