import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { videoTopics } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { Play, Lock } from "lucide-react";
import { usePakistanBase } from "../hooks/usePakistanBase"; 

// CDN map — add v4/v5/v6 URLs here when Sir sends them
export const VIDEO_URLS: Record<string, string> = {
  v1: "https://cdn.zaheen.com.pk/videos/discover-pakistan/pak-history.mp4",
  v2: "https://cdn.zaheen.com.pk/videos/discover-pakistan/k-2.mp4",
  v3: "https://cdn.zaheen.com.pk/videos/discover-pakistan/pakistani-dishes.mp4",
  v4: "https://cdn.zaheen.com.pk/videos/discover-pakistan/pakistani-animals.mp4",
  v5: "https://cdn.zaheen.com.pk/videos/discover-pakistan/national-flag.mp4",
  v6: "https://cdn.zaheen.com.pk/videos/discover-pakistan/cities-adventure.mp4",
};

export function VideosPage() {
  const navigate = useNavigate();
    const base = usePakistanBase(); // add this

  const sound = useGameStore((s) => s.soundEnabled);

  const isLive = (id: string) => !!VIDEO_URLS[id];

  const handleClick = (id: string) => {
    if (!isLive(id)) return;
    if (sound) sfx.click();
  navigate(`${base}/videos/${id}`);
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="night" />

      <div className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="text-3xl md:text-5xl font-black text-white text-center text-shadow-strong mb-2">
          Learning Videos 🎬
        </h1>
        <p className="text-center font-bold text-amber-200 mb-8">
          Short animated adventures about Pakistan
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videoTopics.map((v, i) => {
            const live = isLive(v.id);
            return (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card
                  className={`h-full overflow-hidden p-0 ${live ? "cursor-pointer group" : "cursor-not-allowed opacity-70"}`}
                  padding="none"
                  onClick={() => handleClick(v.id)}
                >
                  {/* Thumbnail */}
                  <div
                    className={`relative h-36 bg-gradient-to-br ${v.color} flex items-center justify-center`}
                  >
                    <span className="text-6xl">{v.emoji}</span>

                    {/* Hover play overlay — live videos only */}
                    {live && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl">
                          <Play className="h-6 w-6 text-emerald-700 fill-emerald-700 ml-1" />
                        </div>
                      </div>
                    )}

                    {/* Lock overlay — coming-soon videos */}
                    {!live && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex flex-col items-center gap-1">
                          <Lock className="h-7 w-7 text-white/80" />
                          <span className="text-[10px] font-black text-white/70 uppercase tracking-wider">
                            Coming Soon
                          </span>
                        </div>
                      </div>
                    )}

                    <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                      {v.duration}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <h3 className="font-black text-emerald-900">{v.title}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{v.description}</p>
                    {live && (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                        <Play className="h-3 w-3 fill-emerald-600" /> Watch now
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}