import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nationalSymbols } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { NarrationBar } from "../components/layout/NarrationBar";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import flag from "../assets/images/symbols/flag.png";

export function SymbolsPage() {
  const [active, setActive] = useState<string | null>(null);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);
  const addCollectible = useGameStore((s) => s.addCollectible);
  const addXp = useGameStore((s) => s.addXp);

  const symbol = nationalSymbols.find((s) => s.id === active);

  const open = (id: string) => {
    setActive(id);
    if (sound) sfx.click();
    addXp(5);
    if (id === "flag") addCollectible("col-flag");
    if (id === "jasmine") addCollectible("col-jasmine");
    if (id === "markhor-symbol") addCollectible("col-markhor");
    setZaheen("Our national symbols make Pakistan unique!", "happy");
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="home" />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-center text-shadow-soft mb-2">
          National Symbols 🇵🇰
        </h1>
        <p className="text-center font-bold text-emerald-700 mb-8">
          Flag, flower, animal, anthem — and more!
        </p>

        {/* Animated flag showcase */}
        <Card className="mb-8 text-center overflow-hidden">
          <motion.div
            className="mx-auto h-32 w-52 rounded-xl overflow-hidden border-4 border-white shadow-xl flex relative"
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ transformOrigin: "left center" }}
          >
            <div className="flex-[3] relative flex items-center justify-center">
              <motion.span
                className="text-white text-4xl absolute"
                animate={{ scaleX: [1, 0.95, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <img
                  src={flag}
                  alt="Flag of Pakistan"
                  className="h-full w-full object-cover"
                />
              </motion.span>
            </div>
          </motion.div>
          <p className="mt-4 font-black text-emerald-900">Flag of Pakistan</p>
          <p className="text-sm font-semibold text-slate-500">
            Waving with pride!
          </p>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nationalSymbols.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card
                className="text-center cursor-pointer h-full"
                onClick={() => open(s.id)}
              >
                <div className="mx-auto mt-2 flex h-22 w-22 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 ring-emerald-400/70">
                  <motion.img
                    src={s.image}
                    alt={s.name}
                    className="h-full w-full object-cover"
                    animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                </div>
                <h3 className="mt-2 font-black text-emerald-900">{s.name}</h3>
                <p className="text-xs font-bold text-emerald-600">{s.type}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {symbol && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            >
              <motion.div
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  className="mx-auto h-36 w-36 rounded-2xl overflow-hidden bg-emerald-50 flex items-center justify-center"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <img
                    src={symbol.image}
                    alt={symbol.name}
                    className="h-full w-full object-contain drop-shadow-lg"
                  />
                </motion.div>
                <h2 className="text-2xl font-black text-emerald-900 mt-2">
                  {symbol.name}
                </h2>
                <p className="font-bold text-emerald-600 text-sm">
                  {symbol.type}
                </p>
                <p className="mt-3 font-semibold text-slate-600">
                  {symbol.description}
                </p>
                <p className="mt-3 text-sm font-bold text-amber-600">
                  💡 {symbol.funFact}
                </p>
                <NarrationBar
                  text={symbol.description}
                  className="mt-4 text-left"
                />
                <Button className="w-full mt-4" onClick={() => setActive(null)}>
                  Explore More
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
