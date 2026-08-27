import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAuth as useZaheenAuth } from '@/modules/shared/context/AuthContext';
import { useUserDisplayName } from '@/modules/shared/hooks/useUserDisplayName';
// ─────────────────────────────────────────────────────────────────────────────
import { useVocabDashboard } from "../hooks/useVocabDashboard";
import {
  Trophy,
  Star,
  BookOpen,
  Target,
  TrendingUp,
  Zap,
  Calendar,
  Award,
  Clock,
  ArrowUp,
  Coins,
} from "lucide-react";
// import Mascot from "../components/Mascot";

const juniorLevels = [
  "Beginner Explorer",
  "Word Adventurer",
  "Vocabulary Hero",
  "Story Builder",
  "Word Master",
];
const seniorLevels = [
  "Word Explorer",
  "Creative Communicator",
  "Language Champion",
  "Story Creator",
  "Vocabulary Expert",
];

export default function StudentDashboard() {
  const { user, xpTransactions, calendar, quizScores } = useAuth();
  const { token: zaheenToken, isLoggedIn: zaheenLoggedIn } = useZaheenAuth();
  const displayName = useUserDisplayName();
  // ─────────────────────────────────────────────────────────────────────────

  // Per sir's instructions: only hit /vocab/dashboard when someone is
  // actually logged in. When there's no token, `dash` is the zero
  // object ({ xp: 0, level: 1, streak: 0, wordsLearned: 0,
  // lessonsCompleted: 0, coins: 0 }) and we never call the API.
  const {
    data: dash,
    isLoading: dashLoading,
    isLoggedIn,
  } = useVocabDashboard(zaheenToken, zaheenLoggedIn);

  if (!user) return null;

  const levels = user.ageGroup === "junior" ? juniorLevels : seniorLevels;
  const currentLevel = levels[Math.min(dash.level - 1, levels.length - 1)];
  const xpForLevel = dash.level * 500;
  const progress = Math.min((dash.xp / xpForLevel) * 100, 100);

  // Weekly calendar
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - today.getDay() + i);
    const dateStr = d.toISOString().split("T")[0];
    const day = calendar.find((c) => c.date === dateStr);
    return {
      date: dateStr,
      label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      dayNum: d.getDate(),
      completed: !!day?.completed,
      xp: day?.xpEarned || 0,
      isToday: dateStr === today.toISOString().split("T")[0],
    };
  });

  return (
    <div className="space-y-8">
      {/* Mascot
      <Mascot
        message={`Great to see you, ${user.name}! 🌟 You've learned ${dash.wordsLearned} words and completed ${dash.lessonsCompleted} lessons. Keep up the amazing work!`}
        emotion={dash.streak >= 5 ? "celebrating" : "happy"}
        autoSpeak={false}
        position="bottom-right"
        size="md"
        showDismiss
      /> */}

      {/* {!isLoggedIn && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Log in to see your real XP, streak, and badges — showing placeholder
          numbers for now.
        </div>
      )} */}
      {isLoggedIn && dashLoading && (
        <div className="text-sm text-slate-400">Refreshing your dashboard…</div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-500" /> My Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your vocabulary learning journey
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-full flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {dash.streak} Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200/40 dark:shadow-blue-900/30"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-300 rounded-full blur-3xl animate-float" />
          <div
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-medium">Current Level</p>
            <h2 className="text-2xl md:text-3xl font-bold">{currentLevel}</h2>
            <p className="text-white/60 text-sm mt-1">
              {dash.level < levels.length
                ? `Next: ${levels[dash.level]}`
                : "Max level achieved!"}
            </p>
            <div className="mt-3 bg-white/20 rounded-full h-2 w-48 overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-white/60 text-xs mt-1">
              {dash.xp} / {xpForLevel} XP
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl md:text-7xl">{user.avatar}</div>
                             <p className="font-bold text-lg">{displayName || user.name}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total XP",
            value: dash.xp,
            icon: Star,
            color: "from-amber-400 to-orange-500",
          },
          {
            label: "Lessons",
            value: dash.lessonsCompleted,
            icon: BookOpen,
            color: "from-violet-400 to-purple-500",
          },
          {
            label: "Words",
            value: dash.wordsLearned,
            icon: Target,
            color: "from-emerald-400 to-teal-500",
          },
          {
            label: "Streak",
            value: `${dash.streak}d`,
            icon: Zap,
            color: "from-rose-400 to-pink-500",
          },
          {
            label: "Coins",
            value: dash.coins,
            icon: Coins,
            color: "from-yellow-400 to-amber-500",
          },
          {
            label: "Badges",
            value: dash.unlockedBadges.length,
            icon: Award,
            color: "from-cyan-400 to-blue-500",
          },
          {
            label: "Avg Quiz",
            value:
              Object.values(quizScores).length > 0
                ? `${Math.round(Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.values(quizScores).length)}%`
                : "N/A",
            icon: TrendingUp,
            color: "from-indigo-400 to-blue-600",
          },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50"
          >
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2 shadow-md`}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">
              {value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
      >
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-violet-500" /> This Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <div key={day.date} className="text-center">
              <span className="text-[10px] text-slate-400 font-medium block mb-1">
                {day.label}
              </span>
              <div
                className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                  day.completed
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                    : day.isToday
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-2 border-violet-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                {day.completed ? "✓" : day.dayNum}
              </div>
              {day.xp > 0 && (
                <span className="text-[10px] text-amber-500 font-semibold mt-1 block">
                  +{day.xp}
                </span>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
        >
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" /> Badges Earned
          </h3>
          {dash.unlockedBadges.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {dash.unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl"
                >
                  <div className="text-3xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Complete lessons to earn badges!
            </p>
          )}
        </motion.div>

        {/* Recent XP Transactions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
        >
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-violet-500" /> Recent Activity
          </h3>
          {xpTransactions.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[...xpTransactions]
                .reverse()
                .slice(0, 10)
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <ArrowUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                        {tx.reason}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{tx.amount} XP
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Start learning to see activity!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
