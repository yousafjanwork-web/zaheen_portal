import { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { videoTopics } from "../data/content";
import { VIDEO_URLS } from "./VideosPage";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { ArrowLeft, Play, Lock, Star } from "lucide-react";
import { usePakistanBase } from "../hooks/usePakistanBase";

export function VideoPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const base = usePakistanBase();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasEarned, setHasEarned] = useState(false);
  const [showReward, setShowReward] = useState(false);

  const addXp = useGameStore((s) => s.addXp);
  const addStars = useGameStore((s) => s.addStars);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);

  const current = videoTopics.find((v) => v.id === id);
  const currentUrl = id ? VIDEO_URLS[id] : null;

  // All other videos shown in sidebar
  const sidebarVideos = videoTopics.filter((v) => v.id !== id);

  const isLive = (vid: string) => !!VIDEO_URLS[vid];

  // Auto-play on mount / when id changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
    setHasEarned(false);
    setShowReward(false);
  }, [id]);

  // Redirect if video not found or not live
  useEffect(() => {
    if (!current || !currentUrl) {
       navigate(`${base}/videos`, { replace: true });
    }
  }, [current, currentUrl, navigate]);

  const handleEnded = () => {
    if (hasEarned) return;
    setHasEarned(true);
    setShowReward(true);
    addXp(15);
    addStars(1);
    if (sound) sfx.success();
    setZaheen("Great watch! You earned XP!", "celebrate");
    setTimeout(() => setShowReward(false), 4000);
  };

  const switchVideo = (vid: string) => {
    if (!isLive(vid)) return;
    if (sound) sfx.click();
      navigate(`${base}/videos/${vid}`);
  };

  if (!current || !currentUrl) return null;

  return (
    <div className="relative min-h-screen pb-10">
      <AnimatedBackground variant="night" />

      {/* XP reward toast */}
      {showReward && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 shadow-xl"
        >
          <Star className="h-5 w-5 text-amber-900 fill-amber-900" />
          <span className="font-black text-amber-900 text-sm">+15 XP &amp; 1 Star earned!</span>
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-4 pt-5">

        {/* Back button */}
        <button
           onClick={() => navigate(`${base}/videos`)} 
          className="mb-4 flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Videos
        </button>

        {/* Main layout: player + sidebar */}
        <div className="flex gap-5 items-start">

          {/* ── Left: Video player ── */}
          <div className="flex-1 min-w-0">
            {/* Player */}
            <div className="w-full rounded-2xl overflow-hidden bg-black shadow-2xl">
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                playsInline
                preload="auto"
                onEnded={handleEnded}
              >
                <source src={currentUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video info below player */}
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white leading-tight">
                    {current.emoji} {current.title}
                  </h1>
                  <p className="text-sm font-semibold text-white/60 mt-1">{current.description}</p>
                </div>
                <span className="flex-shrink-0 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">
                  {current.duration}
                </span>
              </div>

              {hasEarned ? (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-amber-400/20 border border-amber-400/30 px-4 py-3">
                  <Star className="h-4 w-4 text-amber-300 fill-amber-300 flex-shrink-0" />
                  <p className="text-sm font-bold text-amber-200">
                    You watched this video and earned +15 XP &amp; 1 Star!
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-900/40 border border-emerald-700/30 px-4 py-3">
                  <Play className="h-4 w-4 text-emerald-300 fill-emerald-300 flex-shrink-0" />
                  <p className="text-sm font-bold text-emerald-300">
                    Watch to the end to earn +15 XP and 1 Star!
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Right: Sidebar (YouTube-style) ── */}
          <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-3">
            <h2 className="text-xs font-black text-white/50 uppercase tracking-widest mb-1 px-1">
              More Videos
            </h2>

            {sidebarVideos.map((v) => {
              const live = isLive(v.id);
              const isActive = v.id === id;
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={live ? { scale: 1.02 } : {}}
                  onClick={() => switchVideo(v.id)}
                  className={`flex gap-3 rounded-2xl p-3 border transition-all duration-150
                    ${live
                      ? "cursor-pointer bg-white/10 hover:bg-white/20 border-white/10 hover:border-white/25"
                      : "cursor-not-allowed bg-white/5 border-white/5 opacity-60"
                    }
                    ${isActive ? "ring-2 ring-emerald-400" : ""}
                  `}
                >
                  {/* Thumbnail */}
                  <div
                    className={`relative flex-shrink-0 w-28 h-[68px] rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center overflow-hidden`}
                  >
                    <span className="text-3xl">{v.emoji}</span>

                    {live && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Play className="h-6 w-6 text-white fill-white drop-shadow" />
                      </div>
                    )}

                    {!live && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white/70" />
                      </div>
                    )}

                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] font-bold text-white">
                      {v.duration}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{v.description}</p>
                    {!live && (
                      <span className="mt-1.5 text-[10px] font-bold text-amber-400">
                        Coming soon
                      </span>
                    )}
                    {live && (
                      <span className="mt-1.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <Play className="h-2.5 w-2.5 fill-emerald-400" /> Watch
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </aside>
        </div>

        {/* Mobile sidebar — horizontal scroll strip */}
        <div className="lg:hidden mt-5">
          <h2 className="text-xs font-black text-white/50 uppercase tracking-widest mb-3 px-1">
            More Videos
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-3 snap-x -mx-4 px-4">
            {sidebarVideos.map((v) => {
              const live = isLive(v.id);
              return (
                <div
                  key={v.id}
                  onClick={() => switchVideo(v.id)}
                  className={`snap-start flex-shrink-0 w-44 rounded-2xl border p-3 transition-all
                    ${live
                      ? "cursor-pointer bg-white/10 border-white/10 active:scale-95"
                      : "cursor-not-allowed bg-white/5 border-white/5 opacity-60"
                    }`}
                >
                  <div
                    className={`relative h-24 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mb-2 overflow-hidden`}
                  >
                    <span className="text-4xl">{v.emoji}</span>
                    {!live && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-white/70" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 text-[9px] font-bold text-white">
                      {v.duration}
                    </span>
                  </div>
                  <p className="text-xs font-black text-white leading-snug line-clamp-2">{v.title}</p>
                  {!live
                    ? <p className="text-[10px] text-amber-400 mt-1 font-bold">Coming soon</p>
                    : <p className="text-[10px] text-emerald-400 mt-1 font-bold">▶ Watch</p>
                  }
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}