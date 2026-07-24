import { motion } from "framer-motion";
import { collectiblesCatalog } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useGameStore } from "../store/useGameStore";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { useEffect } from "react";

const rarityColors = {
  common: "from-slate-200 to-slate-300",
  rare: "from-sky-300 to-blue-400",
  epic: "from-violet-300 to-purple-500",
  legendary: "from-amber-300 to-orange-500",
};

const rarityBorder = {
  common: "border-slate-300",
  rare: "border-sky-400",
  epic: "border-violet-400",
  legendary: "border-amber-400",
};

export function CollectionPage() {
  const owned = useGameStore((s) => s.collectibles);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);

  useEffect(() => {
    setZaheen(
      owned.length === 0
        ? "Explore Pakistan to fill your collection shelf!"
        : `You have ${owned.length} treasures! Keep collecting!`,
      "excited"
    );
  }, [owned.length, setZaheen]);

  const types = ["flag", "animal", "food", "monument", "hero", "symbol"] as const;

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="night" />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white text-shadow-strong">
              My Pakistan Collection 💎
            </h1>
            <p className="font-bold text-amber-200 mt-1">
              {owned.length}/{collectiblesCatalog.length} treasures on your shelf
            </p>
          </div>
          <CaptainZaheen size="md" />
        </div>

        <Card className="mb-6 bg-white/95">
          <ProgressBar
            value={owned.length}
            max={collectiblesCatalog.length}
            label="Collection progress"
            showLabel
            color="from-amber-400 to-yellow-500"
          />
        </Card>

        {/* 3D-ish shelf */}
        {types.map((type) => {
          const items = collectiblesCatalog.filter((c) => c.type === type);
          return (
            <div key={type} className="mb-8">
              <h2 className="text-lg font-black text-amber-100 capitalize mb-3 text-shadow-soft">
                {type === "flag"
                  ? "🚩 Flags"
                  : type === "animal"
                    ? "🐾 Animals"
                    : type === "food"
                      ? "🍽️ Foods"
                      : type === "monument"
                        ? "🏛️ Monuments"
                        : type === "hero"
                          ? "⭐ Heroes"
                          : "✨ Symbols"}
              </h2>
              <div className="relative">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-1">
                  {items.map((item, i) => {
                    const has = owned.includes(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={has ? { y: -8, scale: 1.05 } : undefined}
                        className={`relative rounded-2xl border-2 p-3 text-center shadow-lg min-h-[110px] flex flex-col items-center justify-center ${
                          has
                            ? `bg-gradient-to-br ${rarityColors[item.rarity]} ${rarityBorder[item.rarity]}`
                            : "bg-white/10 border-white/20 backdrop-blur"
                        }`}
                      >
                        <span className={`text-3xl ${has ? "" : "grayscale opacity-30 blur-[1px]"}`}>
                          {has ? item.emoji : "❓"}
                        </span>
                        <p
                          className={`mt-1 text-[10px] font-extrabold leading-tight ${
                            has ? "text-emerald-950" : "text-white/40"
                          }`}
                        >
                          {has ? item.name : "Locked"}
                        </p>
                        {has && (
                          <span className="absolute -top-1 -right-1 text-[9px] font-black uppercase rounded-full bg-white/80 px-1.5 text-emerald-800">
                            {item.rarity}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                {/* Shelf plank */}
                <div className="h-3 rounded-full bg-gradient-to-b from-amber-700 to-amber-900 shadow-lg mx-1" />
                <div className="h-2 mx-4 rounded-b-xl bg-amber-950/40" />
              </div>
            </div>
          );
        })}

        <Card className="bg-white/95 text-center">
          <p className="font-bold text-emerald-800">
            💡 Explore provinces, finish stories, and play games to unlock more collectibles!
          </p>
        </Card>
      </div>
    </div>
  );
}
