import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { provinces } from "../data/provinces";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";

export function FoodsPage() {
  const foods = useMemo(
    () =>
      provinces.flatMap((p) =>
        p.famousFoods.map((f) => ({
          ...f,
          provinceName: p.name,
          provinceEmoji: p.emoji,
        })),
      ),
    [],
  );
  const [active, setActive] = useState<string | null>(null);
  const viewFood = useGameStore((s) => s.viewFood);
  const viewed = useGameStore((s) => s.viewedFoods);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);
  const addCollectible = useGameStore((s) => s.addCollectible);

  const food = foods.find((f) => f.id === active);

  const open = (id: string) => {
    setActive(id);
    viewFood(id);
    if (sound) sfx.click();
    const f = foods.find((x) => x.id === id);
    setZaheen(`Mmm... ${f?.name} smells amazing!`, "happy");
    if (id === "food-biryani") addCollectible("col-biryani");
    if (id === "food-chapli") addCollectible("col-chapli");
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="desert" />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-center text-shadow-soft mb-2">
          Yummy Pakistan 🍛
        </h1>
        <p className="text-center font-bold text-emerald-700 mb-8">
          Foods from every province — tap a plate to learn!
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((f, i) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card
                className="text-center cursor-pointer h-full"
                onClick={() => open(f.id)}
                glow={viewed.includes(f.id)}
              >
                <div className="relative inline-block">
                  {[0, 1].map((s) => (
                    <motion.span
                      key={s}
                      className="absolute left-1/2 text-slate-300 text-[15px] pointer-events-none"
                      style={{ marginLeft: (s - 0.5) * 8 }}
                      animate={{ y: [0, -18], opacity: [0.9, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.4,
                        delay: s * 0.4,
                      }}
                    >
                      ☁
                    </motion.span>
                  ))}
                  <motion.div
                    className="mx-auto mb-2 h-28 w-28 overflow-hidden rounded-full border-4 border-emerald-400 bg-emerald-50 shadow-inner"
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      delay: i * 0.2,
                    }}
                  >
                    <img
                      src={f.image}
                      alt={f.name}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </div>
                <h3 className="mt-3 font-black text-emerald-900 text-sm sm:text-base leading-tight">
                  {f.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
                  {f.provinceEmoji} {f.provinceName}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {food && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mx-auto my-3 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-emerald-50 ring-8 ring-emerald-400/70 shadow-lg">
                  <motion.img
                    src={food.image}
                    alt={food.name}
                    className="h-full w-full object-cover"
                    animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <h2 className="text-2xl font-black text-emerald-900">
                  {food.name}
                </h2>
                <p className="font-bold text-orange-600 text-sm">
                  {food.provinceEmoji} {food.provinceName}
                </p>
                <p className="mt-3 font-semibold text-slate-600">
                  {food.description}
                </p>
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-400 mb-2">
                    INGREDIENTS
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {food.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-amber-50 p-3">
                  <p className="text-sm font-bold text-amber-800">
                    👨‍🍳 Mini chef tip: Ask a grown-up to cook this with you
                    someday!
                  </p>
                </div>
                <Button className="w-full mt-4" onClick={() => setActive(null)}>
                  More Yums
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
