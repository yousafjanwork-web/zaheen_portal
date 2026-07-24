import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { videoTopics } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { Play } from "lucide-react";

export function VideosPage() {
  const [active, setActive] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const addXp = useGameStore((s) => s.addXp);
  const addStars = useGameStore((s) => s.addStars);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);

  const video = videoTopics.find((v) => v.id === active);

  const watch = (id: string) => {
    setActive(id);
    setPlaying(false);
    setProgress(0);
    if (sound) sfx.click();
  };

  const startPlay = () => {
    setPlaying(true);
    setZaheen("Enjoy the show!", "happy");
    if (sound) sfx.whoosh();
    // Simulate video progress
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setPlaying(false);
        addXp(15);
        addStars(1);
        if (sound) sfx.success();
        setZaheen("Great watch! You earned XP!", "celebrate");
      }
    }, 80);
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
          {videoTopics.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card
                className="cursor-pointer h-full overflow-hidden p-0"
                padding="none"
                onClick={() => watch(v.id)}
              >
                <div
                  className={`relative h-36 bg-gradient-to-br ${v.color} flex items-center justify-center`}
                >
                  <span className="text-6xl">{v.emoji}</span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 hover:opacity-100 transition">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl">
                      <Play className="h-6 w-6 text-emerald-700 fill-emerald-700 ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                    {v.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-emerald-900">{v.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{v.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {video && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg rounded-[2rem] bg-white overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`relative h-56 bg-gradient-to-br ${video.color} flex flex-col items-center justify-center`}
                >
                  <motion.span
                    className="text-7xl"
                    animate={playing ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    {video.emoji}
                  </motion.span>
                  {playing && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                      <motion.div
                        className="h-full bg-white"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  {!playing && progress === 0 && (
                    <Button
                      className="mt-4"
                      variant="gold"
                      size="lg"
                      onClick={startPlay}
                    >
                      <Play className="h-5 w-5 mr-1 fill-current" /> Play
                    </Button>
                  )}
                  {!playing && progress >= 100 && (
                    <p className="mt-3 font-black text-white text-shadow-soft">Finished! ⭐ +XP</p>
                  )}
                  {playing && (
                    <p className="mt-3 font-bold text-white/90 animate-pulse">Playing...</p>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-black text-emerald-900">{video.title}</h2>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{video.description}</p>
                  <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                    <p className="text-sm font-bold text-emerald-800">
                      🎥 This is an interactive mini-video experience. Watch to the end for XP rewards!
                    </p>
                  </div>
                  <Button className="w-full mt-4" variant="ghost" onClick={() => setActive(null)}>
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
