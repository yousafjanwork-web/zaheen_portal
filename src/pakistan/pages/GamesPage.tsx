import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePakistanBase } from "../hooks/usePakistanBase";
import { gamesList } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { useGameStore } from "../store/useGameStore";
import { useEffect } from "react";
import { CaptainZaheen } from "../components/character/CaptainZaheen";

export function GamesPage() {
  const base = usePakistanBase();
  const completed = useGameStore((s) => s.completedGames);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);

  useEffect(() => {
    setZaheen("Pick a game and earn XP! Learning is the best adventure!", "excited");
  }, [setZaheen]);

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="game" />
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-shadow-soft">
              Game Arena 🎮
            </h1>
            <p className="font-bold text-emerald-700 mt-1">
              {completed.length}/{gamesList.length} games played · Earn XP & coins!
            </p>
          </div>
          <CaptainZaheen size="md" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesList.map((game, i) => {
            const done = completed.includes(game.id);
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
              <Link to={`${base}/games/${game.id}`}>
                  <Card className="h-full relative overflow-hidden group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-15 transition`}
                    />
                    {done && (
                      <span className="absolute top-3 right-3 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                        PLAYED ✓
                      </span>
                    )}
                    <div
                      className={`mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${game.color} text-3xl shadow-lg`}
                    >
                      {game.emoji}
                    </div>
                    <h3 className="text-lg font-black text-emerald-900">{game.title}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">{game.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold">
                      <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">
                        +{game.xpReward} XP
                      </span>
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">
                        +{game.coinReward} 🪙
                      </span>
                      <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700">
                        {game.difficulty}
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
