import { motion } from "framer-motion";
import { badges } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { useGameStore } from "../store/useGameStore";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { useEffect } from "react";

export function BadgesPage() {
  const earned = useGameStore((s) => s.earnedBadges);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);

  useEffect(() => {
    setZaheen(
      earned.length === 0
        ? "Complete adventures to earn shiny badges!"
        : `Wow! ${earned.length} badges already!`,
      "celebrate"
    );
  }, [earned.length, setZaheen]);

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="game" />
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-shadow-soft">
              Badge Gallery 🏅
            </h1>
            <p className="font-bold text-emerald-700 mt-1">
              {earned.length}/{badges.length} badges earned
            </p>
          </div>
          <CaptainZaheen size="md" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, i) => {
            const has = earned.includes(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card
                  className={`text-center h-full relative overflow-hidden ${
                    has ? "ring-2 ring-amber-300" : "opacity-80"
                  }`}
                  glow={has}
                >
                  {has && (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 to-transparent pointer-events-none" />
                  )}
                  <motion.div
                    className={`mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${badge.color} text-4xl shadow-xl ${
                      has ? "" : "grayscale"
                    }`}
                    animate={has ? { rotate: [0, -8, 8, 0], scale: [1, 1.05, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.2 }}
                  >
                    {badge.emoji}
                  </motion.div>
                  <h3 className="font-black text-emerald-900 text-lg">{badge.name}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">{badge.description}</p>
                  <p className="mt-2 text-xs font-extrabold text-amber-600">
                    {has ? "✨ EARNED" : `🔒 ${badge.requirement}`}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
