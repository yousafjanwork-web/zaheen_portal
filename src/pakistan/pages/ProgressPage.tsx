import { motion } from "framer-motion";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Button } from "../components/ui/Button";
import { useGameStore } from "../store/useGameStore";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { provinces } from "../data/provinces";
import { badges, gamesList, storyChapters, collectiblesCatalog } from "../data/content";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePakistanBase } from "../hooks/usePakistanBase";
export function ProgressPage() {
  const base = usePakistanBase();
  const store = useGameStore();
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const claimDaily = useGameStore((s) => s.claimDailyReward);
  const sound = useGameStore((s) => s.soundEnabled);

  useEffect(() => {
    setZaheen(`You're Level ${store.level}! Keep the streak going!`, "happy");
  }, [store.level, setZaheen]);

  const xpInLevel = store.xp % 100;
  const nextLevelXp = 100;

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="map" />
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-shadow-soft">
              My Progress 📊
            </h1>
            <p className="font-bold text-emerald-700 mt-1">Your adventure passport</p>
          </div>
          <CaptainZaheen size="md" />
        </div>

        {/* Level card */}
        <Card className="mb-4 bg-gradient-to-br from-violet-50 to-purple-50">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 text-white text-2xl font-black shadow-lg">
              {store.level}
            </div>
            <div className="flex-1">
              <h2 className="font-black text-emerald-900 text-xl">Level {store.level} Explorer</h2>
              <p className="text-sm font-bold text-violet-600">{store.xp} total XP</p>
            </div>
          </div>
          <ProgressBar
            value={xpInLevel}
            max={nextLevelXp}
            label="XP to next level"
            showLabel
            color="from-violet-400 to-purple-600"
          />
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard emoji="🪙" label="Coins" value={store.coins} color="from-amber-300 to-orange-400" />
          <StatCard emoji="⭐" label="Stars" value={store.stars} color="from-yellow-300 to-amber-400" />
          <StatCard emoji="🔥" label="Streak" value={store.streak} color="from-orange-400 to-red-500" />
          <StatCard
            emoji="🏅"
            label="Badges"
            value={store.earnedBadges.length}
            color="from-emerald-400 to-green-600"
          />
        </div>

        {/* Daily reward */}
        <Card className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-emerald-900">🎁 Daily Treasure Chest</h3>
            <p className="text-sm font-semibold text-slate-500">
              Come back every day for coins & XP!
            </p>
          </div>
          <Button
            variant="gold"
            disabled={store.dailyRewardClaimed}
            onClick={() => {
              claimDaily();
            }}
          >
            {store.dailyRewardClaimed ? "Claimed Today ✓" : "Open Chest!"}
          </Button>
        </Card>

        {/* Adventure map progress */}
        <Card className="mb-4">
          <h3 className="font-black text-emerald-900 mb-3">🗺️ Regions Explored</h3>
          <ProgressBar
            value={store.visitedProvinces.length}
            max={provinces.length}
            showLabel
            label={`${store.visitedProvinces.length}/${provinces.length}`}
            className="mb-3"
          />
          <div className="flex flex-wrap gap-2">
            {provinces.map((p) => (
             <Link key={p.id} to={`${base}/province/${p.id}`}>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                    store.visitedProvinces.includes(p.id)
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {p.emoji} {p.name.split(" ")[0]}
                  {store.visitedProvinces.includes(p.id) && " ✓"}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <Card>
            <h3 className="font-black text-emerald-900 mb-2">🎮 Games</h3>
            <ProgressBar
              value={store.completedGames.length}
              max={gamesList.length}
              showLabel
              label={`${store.completedGames.length}/${gamesList.length}`}
              color="from-pink-400 to-rose-500"
            />
          </Card>
          <Card>
            <h3 className="font-black text-emerald-900 mb-2">📖 Stories</h3>
            <ProgressBar
              value={store.completedStories.length}
              max={storyChapters.length}
              showLabel
              label={`${store.completedStories.length}/${storyChapters.length}`}
              color="from-amber-400 to-orange-500"
            />
          </Card>
          <Card>
            <h3 className="font-black text-emerald-900 mb-2">💎 Collectibles</h3>
            <ProgressBar
              value={store.collectibles.length}
              max={collectiblesCatalog.length}
              showLabel
              label={`${store.collectibles.length}/${collectiblesCatalog.length}`}
              color="from-cyan-400 to-blue-500"
            />
          </Card>
          <Card>
            <h3 className="font-black text-emerald-900 mb-2">🏅 Badges</h3>
            <ProgressBar
              value={store.earnedBadges.length}
              max={badges.length}
              showLabel
              label={`${store.earnedBadges.length}/${badges.length}`}
              color="from-yellow-400 to-amber-500"
            />
          </Card>
        </div>

        {/* Weekly challenge */}
        <Card className="bg-gradient-to-br from-teal-50 to-cyan-50">
          <h3 className="font-black text-emerald-900 mb-1">🏆 Weekly Challenge</h3>
          <p className="text-sm font-semibold text-slate-600 mb-3">
            Visit 3 provinces and win 1 quiz this week!
          </p>
          <ProgressBar
            value={Math.min(3, store.visitedProvinces.length) + Math.min(1, store.perfectQuizzes > 0 || store.completedGames.length > 0 ? 1 : 0)}
            max={4}
            showLabel
            label="Challenge progress"
            color="from-teal-400 to-cyan-600"
          />
        </Card>

        {/* Settings mini */}
        <Card className="mt-4">
          <h3 className="font-black text-emerald-900 mb-3">⚙️ Explorer Settings</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={store.soundEnabled ? "primary" : "ghost"}
              onClick={() => store.toggleSound()}
            >
              Sound: {store.soundEnabled ? "On" : "Off"}
            </Button>
            <Button
              size="sm"
              variant={store.narrationEnabled ? "primary" : "ghost"}
              onClick={() => store.toggleNarration()}
            >
              Narration: {store.narrationEnabled ? "On" : "Off"}
            </Button>
            {(["5-7", "8-10", "11-12"] as const).map((age) => (
              <Button
                key={age}
                size="sm"
                variant={store.ageGroup === age ? "gold" : "ghost"}
                onClick={() => store.setAgeGroup(age)}
              >
                Ages {age}
              </Button>
            ))}
          </div>
          {/* silence unused */}
          {void sound}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="text-center" padding="sm">
        <div
          className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-xl shadow`}
        >
          {emoji}
        </div>
        <p className="text-2xl font-black text-emerald-900">{value}</p>
        <p className="text-xs font-bold text-slate-500">{label}</p>
      </Card>
    </motion.div>
  );
}
