import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { allAnimals } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { getProvince } from "../data/provinces";

export function AnimalsPage() {
  const [active, setActive] = useState<string | null>(null);
  const viewAnimal = useGameStore((s) => s.viewAnimal);
  const viewed = useGameStore((s) => s.viewedAnimals);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);
  const addCollectible = useGameStore((s) => s.addCollectible);

  const animal = allAnimals.find((a) => a.id === active);

  const open = (id: string) => {
    setActive(id);
    viewAnimal(id);
    if (sound) sfx.pop();
    const a = allAnimals.find((x) => x.id === id);
    setZaheen(`Say hello to the ${a?.name}!`, "excited");
    if (id === "markhor") addCollectible("col-markhor");
    if (id === "snow-leopard") addCollectible("col-snow-leopard");
    if (id === "indus-dolphin") addCollectible("col-dolphin");
    if (id === "camel") addCollectible("col-camel");
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="map" />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-center text-shadow-soft mb-2">
          Wildlife of Pakistan 🐆
        </h1>
        <p className="text-center font-bold text-emerald-700 mb-2">
          {viewed.length}/{allAnimals.length} animals met
        </p>
        <p className="text-center text-sm font-semibold text-slate-500 mb-8">
          Tap an animal to watch it move and learn fun facts!
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAnimals.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="text-center cursor-pointer h-full"
                onClick={() => open(a.id)}
                glow={viewed.includes(a.id)}
              >
                <motion.div
                  className="mx-auto mb-2 h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-400 bg-emerald-50 shadow-inner"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
                >
                  <img
                    src={a.image}
                    alt={a.name}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
                <h3 className="mt-3 font-black text-emerald-900 text-sm sm:text-base leading-tight">
                  {a.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
                  {a.habitat}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {animal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mx-auto mt-2 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-emerald-50 ring-8 ring-emerald-400/70 shadow-lg">
                  <motion.img
                    src={animal.image}
                    alt={animal.name}
                    className="h-full w-full object-cover"
                    animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <h2 className="text-2xl font-black text-emerald-900 mt-3">
                  {animal.name}
                </h2>
                <p className="font-bold text-emerald-600">
                  🏠 {animal.habitat}
                </p>
                {animal.provinceId && (
                  <p className="text-sm font-semibold text-slate-500 mt-1">
                    Found in {getProvince(animal.provinceId)?.name}
                  </p>
                )}
                <div className="mt-4 rounded-2xl bg-lime-50 p-4">
                  <p className="font-bold text-emerald-900">
                    💡 {animal.funFact}
                  </p>
                </div>
                <p className="mt-3 text-sm font-bold text-amber-600">
                  🔊 Sound: {animal.sound}
                </p>
                <Button className="w-full mt-5" onClick={() => setActive(null)}>
                  Meet More Animals
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
