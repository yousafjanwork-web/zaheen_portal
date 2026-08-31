import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Map,
  Gamepad2,
  Award,
  Film,
  HelpCircle,
  Compass,
  BookOpen,
  PawPrint,
  Utensils,
  Flag,
  Users,
  Sparkles,
} from "lucide-react";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useGameStore } from "../store/useGameStore";
import { useEffect, useMemo } from "react";
import { welcomeMessages } from "../data/content";
import { sfx } from "../utils/audio";
import { usePakistanBase } from "../hooks/usePakistanBase";

export function HomePage() {
  const base = usePakistanBase();

  const menuItems = [
    { to: `${base}/map`, label: "Start Adventure", desc: "Explore the map of Pakistan", icon: Compass, color: "from-green-400 to-emerald-600", emoji: "🚀" },
    { to: `${base}/map`, label: "Explore Provinces", desc: "Visit every region", icon: Map, color: "from-sky-400 to-blue-600", emoji: "🗺️" },
    { to: `${base}/games`, label: "Play Games", desc: "Fun learning mini-games", icon: Gamepad2, color: "from-pink-400 to-rose-500", emoji: "🎮" },
    { to: `${base}/badges`, label: "Earn Badges", desc: "Collect shiny rewards", icon: Award, color: "from-amber-300 to-orange-500", emoji: "🏅" },
    { to: `${base}/videos`, label: "Watch Videos", desc: "Animated learning clips", icon: Film, color: "from-violet-400 to-purple-600", emoji: "🎬" },
    { to: `${base}/quizz`, label: "Take Quiz", desc: "Test your Pakistan smarts", icon: HelpCircle, color: "from-cyan-400 to-teal-500", emoji: "❓" },
  ];

  const quickLinks = [
    { to: `${base}/story`, label: "Story Mode", emoji: "📖", icon: BookOpen },
    { to: `${base}/heroes`, label: "Heroes", emoji: "⭐", icon: Users },
    { to: `${base}/animals`, label: "Animals", emoji: "🐆", icon: PawPrint },
    { to: `${base}/foods`, label: "Foods", emoji: "🍛", icon: Utensils },
    { to: `${base}/symbols`, label: "Symbols", emoji: "🇵🇰", icon: Flag },
    { to: `${base}/collection`, label: "My Shelf", emoji: "💎", icon: Sparkles },
  ];

  const checkStreak = useGameStore((s) => s.checkStreak);
  const claimDaily = useGameStore((s) => s.claimDailyReward);
  const dailyClaimed = useGameStore((s) => s.dailyRewardClaimed);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const level = useGameStore((s) => s.level);
  const streak = useGameStore((s) => s.streak);
  const sound = useGameStore((s) => s.soundEnabled);

  const welcome = useMemo(
    () => welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
    []
  );

  useEffect(() => {
    checkStreak();
    setZaheen(welcome, "wave");
  }, [checkStreak, setZaheen, welcome]);

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="home" />

      <div className="mx-auto max-w-6xl px-4 pt-6">
        {/* Hero */}
        <section className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-extrabold text-emerald-700 shadow border border-white">
              🇵🇰 Interactive Learning Adventure
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-black text-emerald-900 text-shadow-soft mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            Discover{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              Pakistan
            </span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg font-bold text-emerald-800/80 max-w-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            An animated adventure of stories, games, maps & magic for curious kids!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CaptainZaheen
              size="lg"
              message={welcome}
              mood="wave"
              onClick={() =>
                setZaheen("Let's go exploring together! Pick an adventure below!", "excited")
              }
            />
          </motion.div>

          {/* Daily reward */}
          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="rounded-2xl bg-white/80 px-4 py-2 font-bold text-emerald-800 shadow border border-white text-sm">
              Level {level} · Streak {streak}🔥
            </div>
            <Button
              variant="gold"
              size="md"
              disabled={dailyClaimed}
              onClick={() => {
                claimDaily();
                if (sound) sfx.coin();
              }}
            >
              {dailyClaimed ? "Reward Claimed ✓" : "🎁 Daily Treasure"}
            </Button>
          </motion.div>
        </section>

        {/* Main menu grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {menuItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <Link to={item.to} className="block h-full">
                <Card className="h-full group cursor-pointer overflow-hidden relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition`}
                  />
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-2xl shadow-lg`}
                    >
                      {item.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-emerald-900 group-hover:text-emerald-700">
                        {item.label}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </section>

        {/* Quick links */}
        <section className="mb-10">
          <h2 className="text-xl font-black text-emerald-900 mb-4 text-center">
            More Adventures ✨
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {quickLinks.map((q, i) => (
              <motion.div
                key={q.to}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
              >
                <Link to={q.to}>
                  <Card
                    className="flex flex-col items-center text-center py-4 hover:bg-emerald-50"
                    padding="sm"
                  >
                    <span className="text-3xl mb-1">{q.emoji}</span>
                    <span className="text-xs font-extrabold text-emerald-800">{q.label}</span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Age banner */}
        <motion.div
          className="rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6 text-white text-center shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-2xl font-black mb-1">Made for ages 5–12 🌈</p>
          <p className="font-semibold text-emerald-50">
            Safe · Fun · Educational · Parents & Teachers welcome!
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
         <Link to={`${base}/map`}>
              <Button variant="gold" size="lg" glow>
                Begin Exploring →
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
