import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroes } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { NarrationBar } from "../components/layout/NarrationBar";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";

export function HeroesPage() {
  const [active, setActive] = useState<string | null>(null);
  const [scene, setScene] = useState(0);
  const viewHero = useGameStore((s) => s.viewHero);
  const viewed = useGameStore((s) => s.viewedHeroes);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);
  const addCollectible = useGameStore((s) => s.addCollectible);

  const hero = heroes.find((h) => h.id === active);

  const open = (id: string) => {
    setActive(id);
    setScene(0);
    viewHero(id);
    if (id === "jinnah") addCollectible("col-jinnah");
    if (sound) sfx.click();
    const h = heroes.find((x) => x.id === id);
    setZaheen(`${h?.name} is happy to meet you!`, "excited");
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="province" />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-center text-shadow-soft mb-2">
          National Heroes ⭐
        </h1>
        <p className="text-center font-bold text-emerald-700 mb-8">
          Meet the brave people who shaped Pakistan!
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {heroes.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className="text-center cursor-pointer h-full"
                onClick={() => open(h.id)}
                glow={viewed.includes(h.id)}
              >
                {h.award && (
                  <span className="absolute -top-3 right-3 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-950 shadow-md">
                    ⭐ {h.award}
                  </span>
                )}
                <motion.div
                  className="mx-auto mb-2 h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-400 bg-emerald-50 shadow-inner"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
                >
                  <img
                    src={h.image}
                    alt={h.name}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <h3 className="font-black text-emerald-900 text-lg">
                  {h.name}
                </h3>
                <p className="text-xs font-bold text-emerald-600 mt-1">
                  {h.title}
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {h.years}
                </p>
                {viewed.includes(h.id) && (
                  <span className="inline-block mt-2 text-xs font-black text-amber-600">
                    MET ⭐
                  </span>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {hero && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-500 shadow-lg"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 3.1 }}
                  >
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                  {hero.award && (
                    <span className="mt-3 inline-block rounded-full bg-amber-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-950 shadow">
                      ⭐ {hero.award}
                    </span>
                  )}
                  <h2 className="text-2xl font-black text-emerald-900 mt-2">
                    {hero.name}
                  </h2>
                  <p className="font-bold text-emerald-600 text-sm">
                    {hero.title}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {hero.years}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 min-h-[100px]">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={scene}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-bold text-emerald-900 text-center text-lg"
                    >
                      {hero.story[scene]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <NarrationBar text={hero.story[scene]} className="mt-3" />

                <div className="mt-3 flex justify-center gap-2">
                  {hero.story.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full ${i === scene ? "bg-emerald-500" : "bg-emerald-200"}`}
                    />
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    disabled={scene === 0}
                    onClick={() => setScene((s) => Math.max(0, s - 1))}
                  >
                    Back
                  </Button>
                  {scene < hero.story.length - 1 ? (
                    <Button
                      className="flex-1"
                      onClick={() => setScene((s) => s + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      className="flex-1"
                      variant="gold"
                      onClick={() => setActive(null)}
                    >
                      Meet Others
                    </Button>
                  )}
                </div>

                <div className="mt-4 rounded-xl bg-violet-50 p-3">
                  <p className="text-xs font-bold text-violet-600 mb-1">
                    Famous words
                  </p>
                  <p className="text-sm font-semibold text-violet-900 italic">
                    "{hero.quote}"
                  </p>
                </div>
                <p className="mt-2 text-center text-xs font-bold text-amber-600">
                  💡 {hero.funFact}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
