import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { storyChapters } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { NarrationBar } from "../components/layout/NarrationBar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Confetti } from "../components/ui/Confetti";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { ArrowLeft } from "lucide-react";

export function StoryPage() {
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const completeStory = useGameStore((s) => s.completeStory);
  const completedStories = useGameStore((s) => s.completedStories);
  const addCollectible = useGameStore((s) => s.addCollectible);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);

  const chapter = storyChapters.find((c) => c.id === activeChapter);
  const scene = chapter?.scenes[sceneIdx];

  const openChapter = (id: string) => {
    setActiveChapter(id);
    setSceneIdx(0);
    setFinished(false);
    setZaheen("Story time! Tap next when you're ready!", "happy");
    if (sound) sfx.whoosh();
  };

  const next = () => {
    if (!chapter || !scene) return;
    if (scene.collectibleId) addCollectible(scene.collectibleId);
    if (sound) sfx.click();

    if (sceneIdx + 1 >= chapter.scenes.length) {
      setFinished(true);
      completeStory(chapter.id);
      if (sound) sfx.celebrate();
      setZaheen("What a wonderful story! You're a History Hero!", "celebrate");
    } else {
      setSceneIdx((i) => i + 1);
    }
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="province" />
      <div className="mx-auto max-w-3xl px-4 pt-6">
        {!activeChapter && (
          <>
            <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-center text-shadow-soft mb-2">
              Story Mode 📖
            </h1>
            <p className="text-center font-bold text-emerald-700 mb-8">
              Learn through animated stories — no boring paragraphs!
            </p>
            <div className="grid gap-4">
              {storyChapters.map((ch, i) => {
                const done = completedStories.includes(ch.id);
                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className="cursor-pointer flex items-center gap-4"
                      onClick={() => openChapter(ch.id)}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-500 text-3xl shadow-lg">
                        {ch.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-emerald-900 text-lg">{ch.title}</h3>
                        <p className="text-sm font-semibold text-slate-500">
                          {ch.scenes.length} scenes · Tap to begin
                        </p>
                      </div>
                      {done && (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700">
                          DONE ✓
                        </span>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {activeChapter && chapter && !finished && scene && (
          <div>
            <button
              onClick={() => setActiveChapter(null)}
              className="inline-flex items-center gap-1 font-bold text-emerald-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Stories
            </button>
            <ProgressBar
              value={sceneIdx}
              max={chapter.scenes.length}
              label={chapter.title}
              showLabel
              className="mb-4"
              color="from-amber-400 to-orange-500"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <div
                  className={`rounded-[2rem] bg-gradient-to-br ${scene.background} p-6 md:p-10 shadow-2xl mb-4 text-center min-h-[280px] flex flex-col items-center justify-center`}
                >
                  <motion.div
                    className="text-7xl md:text-8xl mb-4"
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    {scene.characterEmoji}
                  </motion.div>
                  <p className="font-extrabold text-white/90 text-sm mb-2 uppercase tracking-wide">
                    {scene.narrator}
                  </p>
                  <p className="text-xl md:text-2xl font-black text-white text-shadow-strong max-w-lg">
                    {scene.text}
                  </p>
                  {scene.interactiveHint && (
                    <motion.p
                      className="mt-4 rounded-full bg-white/30 px-4 py-1 text-sm font-bold text-white backdrop-blur"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      💡 {scene.interactiveHint}
                    </motion.p>
                  )}
                </div>
                <NarrationBar text={scene.text} className="mb-4" />
                <Button size="xl" className="w-full" onClick={next} glow>
                  {sceneIdx + 1 >= chapter.scenes.length ? "Finish Story ⭐" : "Next →"}
                </Button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {finished && chapter && (
          <Card className="text-center relative overflow-hidden">
            <Confetti count={35} />
            <div className="text-7xl mb-3">🎉</div>
            <h2 className="text-3xl font-black text-emerald-900">Story Complete!</h2>
            <p className="font-bold text-emerald-700 mt-2">{chapter.title}</p>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              XP & collectibles added to your adventure!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => {
                  setActiveChapter(null);
                  setFinished(false);
                }}
              >
                More Stories
              </Button>
              <Button
                variant="gold"
                onClick={() => {
                  setSceneIdx(0);
                  setFinished(false);
                }}
              >
                Replay
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
