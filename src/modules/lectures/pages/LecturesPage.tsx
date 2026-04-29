import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLanguage } from "@/modules/shared/i18n";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Video {
  id: number;
  name: string;
  urdu_name?: string;
  path: string;
  desc?: string;
  urdu_desc?: string;
  chapter_name?: string;
  chapter_index?: number;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

/* ─────────────────────────────────────────────
   VideoCard (in the grid / playlist row)
───────────────────────────────────────────── */
interface VideoCardProps {
  video: Video;
  index: number;
  isSelected: boolean;
  isWatched: boolean;
  progress: number; // 0–100
  isUpNext: boolean;
  onClick: () => void;
  isUrdu: boolean;
  moduleLabel?: string;
}

const VideoCard = ({
  video,
  index,
  isSelected,
  isWatched,
  progress,
  isUpNext,
  onClick,
  isUrdu,
  moduleLabel,
}: VideoCardProps) => {
  const title = isUrdu ? video.urdu_name || video.name : video.name;
  const descRaw = isUrdu ? video.urdu_desc || video.desc : video.desc;
  const shortDesc = descRaw?.split("|")[0]?.trim() || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 ${
        isSelected
          ? "border-indigo-300 shadow-md shadow-indigo-100"
          : "border-slate-100 bg-white hover:shadow-md hover:border-slate-200"
      } bg-white`}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden">
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />

        {/* Placeholder visual (no real thumbnail from API) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
            <BookOpen size={40} className="text-slate-600" strokeWidth={1} />
          </div>
        </div>

        {/* Up Next badge */}
        {isUpNext && !isSelected && (
          <div className="absolute top-3 left-3 z-20 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
            Up Next
          </div>
        )}

        {/* Watched badge */}
        {isWatched && !isSelected && (
          <div className="absolute top-3 right-3 z-20">
            <CheckCircle2 size={22} className="text-emerald-400 drop-shadow" />
          </div>
        )}

        {/* Play icon overlay */}
        {isSelected ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <PlayCircle size={40} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle size={36} className="text-white drop-shadow" />
          </div>
        )}

        {/* Progress bar at bottom of thumbnail */}
        {progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/20">
            <div
              className="h-full bg-indigo-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info below thumbnail */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {moduleLabel || `Lecture ${index + 1}`}
          </span>
          {progress > 0 && progress < 100 && (
            <span className="text-[11px] text-indigo-500 font-semibold">
              {Math.round(100 - progress)}% Left
            </span>
          )}
          {isWatched && (
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
              <CheckCircle2 size={12} /> Watched
            </span>
          )}
          {!isWatched && progress === 0 && (
            <span className="text-[11px] text-slate-400 font-medium">Not Started</span>
          )}
        </div>

        <h4
          className={`text-[15px] font-bold text-slate-900 leading-snug line-clamp-2 ${
            isUrdu ? "text-right font-urdu" : ""
          }`}
        >
          {title}
        </h4>

        {shortDesc && (
          <p className="text-[13px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
        )}
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   Coming Soon Screen
───────────────────────────────────────────── */
const ComingSoonScreen = ({
  subjectName,
  isUrdu,
}: {
  subjectName: string;
  isUrdu: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
  >
    <div className="w-24 h-24 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6">
      <Clock size={44} className="text-indigo-400" strokeWidth={1.5} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 mb-3">
      {isUrdu ? "جلد آرہا ہے" : "Lectures Coming Soon"}
    </h2>
    <p className="text-slate-500 text-base max-w-sm leading-relaxed">
      {isUrdu
        ? `${subjectName} کے لیے لیکچرز تیار کیے جا رہے ہیں۔ جلد دستیاب ہوں گے۔`
        : `We're preparing lectures for ${subjectName}. Check back soon — they'll be available shortly.`}
    </p>
    <div className="mt-8 flex items-center gap-2 text-indigo-500 font-semibold text-sm">
      <Loader2 size={16} className="animate-spin" />
      In production
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   Main LecturesPage
───────────────────────────────────────────── */
const LecturesPage = () => {
  const { chapterId, chapterName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryVideoId = searchParams.get("videoId");

  const lang = getLanguage();
  const isUrdu = lang === "ur";

  const classTitle = location.state?.classTitle || "Course";
  const gradeType = location.state?.gradeType;
  const subjectName = location.state?.selectedSubject?.name || chapterName || "this subject";

  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loadingVideos, setLoadingVideos] = useState(true);

  // Track watch progress per video id
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [watchedSet, setWatchedSet] = useState<Set<number>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── Tracking ── */
  const trackEvent = (eventName: string, extra: Record<string, any> = {}) => {
    if (!window.gtag || !selectedVideo) return;
    window.gtag("event", eventName, {
      video_id: selectedVideo.id,
      video_name: selectedVideo.name,
      chapter_id: chapterId,
      page_path: window.location.pathname,
      ...extra,
    });
  };

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
    const index = videos.findIndex((v) => v.id === selectedVideo?.id);
    if (index < videos.length - 1) changeVideo(videos[index + 1]);
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (!video.duration || !selectedVideo) return;
    const percent = (video.currentTime / video.duration) * 100;
    setProgressMap((prev) => ({ ...prev, [selectedVideo.id]: Math.round(percent) }));
    if (percent > 50 && !(video as any)._tracked50) {
      (video as any)._tracked50 = true;
      trackEvent("video_50_percent");
    }
  };

  /* ── Fetch ── */
  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideos(true);
      try {
        const res = await fetch(
          `https://api.zaheen.com.pk/api/chapter/${chapterId}/videos?ts=${Date.now()}`
        );
        const data: Video[] = await res.json();
        setVideos(data);

        const stateVideo = location.state?.selectedVideo || location.state?.activeVideo;
        const stateVideoId = location.state?.activeVideoId || location.state?.videoId;
        const initialVideoId = queryVideoId || stateVideoId;

        let initialVideo: Video | null = null;
        if (stateVideo) initialVideo = stateVideo;
        else if (initialVideoId) initialVideo = data.find((v) => String(v.id) === String(initialVideoId)) || null;
        else if (data.length > 0) initialVideo = data[0];

        if (initialVideo) {
          setSelectedVideo(initialVideo);
          setVideoUrl(`https://cdn.zaheen.com.pk/videos/${initialVideo.path}`);
        }
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
      setLoadingVideos(false);
    };

    fetchVideos();
  }, [chapterId]);

  /* ── Change Video ── */
  const changeVideo = (video: Video) => {
    setSelectedVideo(video);
    if (videoRef.current) {
      (videoRef.current as any)._tracked50 = false;
      (videoRef.current as any)._started = false;
    }
    setVideoUrl(`https://cdn.zaheen.com.pk/videos/${video.path}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ── Keyboard nav ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const index = videos.findIndex((v) => v.id === selectedVideo?.id);
      if (e.key === "ArrowRight" && index < videos.length - 1) changeVideo(videos[index + 1]);
      if (e.key === "ArrowLeft" && index > 0) changeVideo(videos[index - 1]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedVideo, videos]);

  const currentIndex = videos.findIndex((v) => v.id === selectedVideo?.id);
  const hasVideos = videos.length > 0;

  /* ── Render description with pipe formatting ── */
  const renderDesc = (video: Video | null) => {
    if (!video) return null;
    const fullText = isUrdu ? video.urdu_desc || video.desc : video.desc;
    if (!fullText) return null;
    const parts = fullText.split("|").map((p) => p.trim()).filter(Boolean);
    return (
      <>
        <p className="text-base font-semibold text-slate-800">{parts[0]}</p>
        {parts.slice(1).map((line, i) =>
          line.startsWith("-") ? (
            <p key={i} className="text-sm font-semibold text-slate-700 mt-1">
              {line.replace("-", "").trim()}
            </p>
          ) : (
            <ul key={i} className="text-sm text-slate-500 mt-1 list-disc pl-4 space-y-0.5">
              <li>{line}</li>
            </ul>
          )
        )}
      </>
    );
  };

  return (
    <section className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-400 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-slate-600 transition-colors">
            {isUrdu ? "ہوم" : "Home"}
          </Link>
          <span>/</span>
          {gradeType === "Skills" ? (
            <Link to={`/skills/${location.state?.classId}`} className="hover:text-slate-600 transition-colors">
              {classTitle} — Skills
            </Link>
          ) : (
            <Link to={`/class/${location.state?.classId}`} className="hover:text-slate-600 transition-colors">
              {classTitle}
            </Link>
          )}
          <span>/</span>
          <span className="text-slate-700 font-semibold">{chapterName}</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">
            {classTitle} &mdash; {chapterName}
          </h1>
          {!loadingVideos && hasVideos && (
            <p className="text-slate-500 mt-2 text-base">
              {videos.length} lecture{videos.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* ── Loading ── */}
        {loadingVideos ? (
          <div className="space-y-10">
            {/* Video player skeleton */}
            <div className="aspect-video bg-slate-200 rounded-2xl animate-pulse" />
            {/* Cards skeleton */}
            <div>
              <div className="h-7 w-44 bg-slate-200 rounded animate-pulse mb-6" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-slate-100 bg-white animate-pulse">
                    <div className="aspect-video bg-slate-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 w-20 bg-slate-200 rounded" />
                      <div className="h-5 w-3/4 bg-slate-200 rounded" />
                      <div className="h-4 w-full bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !hasVideos ? (
          /* ── Coming Soon ── */
          <ComingSoonScreen subjectName={subjectName} isUrdu={isUrdu} />
        ) : (
          /* ── Main content ── */
          <div className="space-y-10">
            {/* Video Player */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl">
              <div className="aspect-video">
                {videoUrl ? (
                  <video
                    ref={videoRef}
                    key={videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full"
                    src={videoUrl}
                    onLoadedData={handleLoaded}
                    onPlay={handlePlay}
                    onEnded={handleEnded}
                    onTimeUpdate={handleTimeUpdate}
                    onError={(e) => console.error("VIDEO ERROR", e)}
                    onLoadedMetadata={(e) => {
                      const v = e.target as HTMLVideoElement;
                      console.log("Resolution:", v.videoWidth, v.videoHeight);
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-lg font-medium">
                    {isUrdu ? "ویڈیو دستیاب نہیں" : "No video available"}
                  </div>
                )}
              </div>
            </div>

            {/* Current video info + nav */}
            {selectedVideo && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Lecture {currentIndex + 1} of {videos.length}
                    </p>
                    <h2 className={`text-xl font-black text-slate-900 leading-snug ${isUrdu ? "text-right font-urdu" : ""}`}>
                      {isUrdu ? selectedVideo.urdu_name || selectedVideo.name : selectedVideo.name}
                    </h2>
                    <div className="mt-3 space-y-1">{renderDesc(selectedVideo)}</div>
                  </div>

                  {/* Prev / Next */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => currentIndex > 0 && changeVideo(videos[currentIndex - 1])}
                      disabled={currentIndex === 0}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => currentIndex < videos.length - 1 && changeVideo(videos[currentIndex + 1])}
                      disabled={currentIndex === videos.length - 1}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Video Lectures grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                  {isUrdu ? "ویڈیو لیکچرز" : "Video Lectures"}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, idx) => {
                  const progress = progressMap[video.id] || 0;
                  const isWatched = watchedSet.has(video.id);
                  const isSelected = selectedVideo?.id === video.id;
                  // "Up Next" = the first unwatched video after the current one
                  const isUpNext =
                    !isSelected &&
                    !isWatched &&
                    idx === (currentIndex + 1) &&
                    idx < videos.length;

                  return (
                    <VideoCard
                      key={video.id}
                      video={video}
                      index={idx}
                      isSelected={isSelected}
                      isWatched={isWatched}
                      progress={isWatched ? 100 : progress}
                      isUpNext={isUpNext}
                      onClick={() => changeVideo(video)}
                      isUrdu={isUrdu}
                      moduleLabel={`Lecture ${idx + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LecturesPage;