import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAuth as useZaheenAuth } from "@/modules/shared/context/AuthContext";
import {
  BookOpen,
  Play,
  Star,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useLessonsData } from "../context/LessonsContext";
import Mascot from "../components/Mascot";

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

export default function Home() {
  const { user } = useAuth();
  const { isLoggedIn } = useZaheenAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lessons, isLoading, error } = useLessonsData();
  if (!user) return null;

  if (isLoading) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        Loading your lessons…
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500">{error}</div>;
  }

  const goToLesson = (lessonId: string) => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    navigate(`/vocab/lesson/${lessonId}`);
  };
  const levels = user.ageGroup === "junior" ? juniorLevels : seniorLevels;
  // ... rest of component stays the same
  const currentLevel = levels[Math.min(user.level - 1, levels.length - 1)];
  const nextLevel = user.level < levels.length ? levels[user.level] : null;
  const xpForNextLevel = user.level * 500;
  const progressToNext = Math.min((user.xp / xpForNextLevel) * 100, 100);

  const availableLessons = lessons.filter(
    (l) => l.ageGroup === user.ageGroup || l.ageGroup === "both",
  );
  const nextLesson = availableLessons[0];

  return (
    <div className="space-y-8">
      {/* Mascot Welcome */}
      <Mascot
        message={`Hi there! 👋 Welcome back! You have a ${user.streak}-day learning streak! ${lessons.length > 0 ? "Ready for your next vocabulary adventure?" : ""} 🚀`}
        emotion={user.streak >= 3 ? "excited" : "happy"}
        autoSpeak={false}
        position="bottom-right"
        size="md"
        showDismiss
      />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 md:p-12 text-white shadow-2xl shadow-blue-300/40 dark:shadow-blue-900/30"
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-lime-300 rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-300 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Floating sparkles */}
        {["✨", "⭐", "🌟", "💫"].map((s, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-60"
            style={{ top: `${15 + i * 18}%`, right: `${5 + i * 12}%` }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 20, -20, 0],
              opacity: [0.4, 0.9, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {s}
          </motion.div>
        ))}

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                🔥 {user.streak} Day Streak
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-lime-400/25 backdrop-blur-md rounded-full text-sm font-bold border border-lime-300/30">
                ⭐ {user.xp.toLocaleString()} XP
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-sm font-bold border border-white/20">
                🏆 Lv {user.level}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
              Welcome to Your
              <br />
              <span className="bg-gradient-to-r from-lime-300 via-yellow-200 to-lime-300 bg-clip-text text-transparent">
                Learning Adventure!
              </span>
            </h1>
            <p className="text-white/85 text-lg max-w-md leading-relaxed">
              Ready to learn new words and become a vocabulary champion? Your
              next adventure awaits! 🚀
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => goToLesson(nextLesson?.id || "lesson-1")}
                className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-blue-700 rounded-2xl font-bold hover:bg-lime-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Play className="w-5 h-5 fill-blue-700" /> Continue Learning
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-lime-200/60 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
              </button>
              <Link
                to="/vocab/courses"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-md rounded-2xl font-bold hover:bg-white/25 transition-all border border-white/30 hover:scale-105"
              >
                <BookOpen className="w-5 h-5" /> All Courses
              </Link>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl md:text-9xl drop-shadow-2xl"
          >
            🚀
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Current Level",
            value: currentLevel,
            icon: Trophy,
            color: "from-amber-400 to-orange-500",
          },
          {
            label: "Total XP",
            value: `${user.xp.toLocaleString()}`,
            icon: Star,
            color: "from-blue-500 to-indigo-600",
          },
          {
            label: "Lessons Done",
            value: `${user.lessonsCompleted}`,
            icon: Target,
            color: "from-lime-400 to-green-500",
          },
          {
            label: "Words Learned",
            value: `${user.wordsLearned}`,
            icon: Zap,
            color: "from-rose-400 to-pink-500",
          },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-700/50 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-700/50 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all overflow-hidden"
          >
            {/* Gradient accent line at top */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-80`}
            />
            {/* Decorative blur */}
            <div
              className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
            />

            <div
              className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
              {label}
            </p>
            <p className="text-xl font-black text-slate-800 dark:text-white mt-1 truncate">
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-700/50 backdrop-blur-sm shadow-sm overflow-hidden"
      >
        {/* Decorative accent */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-blue-300/20 to-lime-300/20 blur-3xl" />
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-500 to-lime-500" />
              Level Progress
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {nextLevel
                ? `${user.xp.toLocaleString()} / ${xpForNextLevel.toLocaleString()} XP to "${nextLevel}"`
                : "Maximum level reached! 🎉"}
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
          </motion.div>
        </div>
        <div className="relative h-4 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-lime-500 rounded-full relative shadow-lg shadow-blue-300/30"
          >
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-[3px] border-blue-500 flex items-center justify-center">
              <span className="text-[8px]">⭐</span>
            </div>
          </motion.div>
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>{levels[0]}</span>
          <span>{levels[levels.length - 1]}</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/10 rounded-3xl p-6 border border-lime-200/70 dark:border-lime-700/40 hover:border-lime-400 dark:hover:border-lime-600 transition-all shadow-sm hover:shadow-xl hover:shadow-lime-200/40"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-lime-300/30 blur-2xl group-hover:bg-lime-300/50 transition-colors" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-lime-700 dark:text-lime-400">
                Today's Lesson
              </span>
              <h3 className="font-black text-lg text-slate-800 dark:text-white mt-0.5">
                {nextLesson?.title || "No lessons available"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn {nextLesson?.words.length || 0} new vocabulary words
                today!
              </p>
              <button
                onClick={() => goToLesson(nextLesson?.id || "lesson-1")}
                className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-bold text-lime-700 dark:text-lime-300 shadow-sm hover:gap-2 hover:shadow-md transition-all"
              >
                Start Lesson <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 rounded-3xl p-6 border border-amber-200/70 dark:border-amber-700/40 hover:border-amber-400 dark:hover:border-amber-600 transition-all shadow-sm hover:shadow-xl hover:shadow-amber-200/40"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-amber-300/30 blur-2xl group-hover:bg-amber-300/50 transition-colors" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Weekly Stats
              </span>
              <h3 className="font-black text-lg text-slate-800 dark:text-white mt-0.5">
                {user.streak}-Day Streak 🔥
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Keep it going to earn the 7-Day Streak badge!
              </p>
              <Link
                to="/vocab/dashboard"
                className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-sm font-bold text-amber-700 dark:text-amber-300 shadow-sm hover:gap-2 hover:shadow-md transition-all"
              >
                View Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Adventures */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-amber-500 to-rose-500" />
            Quick Adventures
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              to: "/vocab/flashcards",
              label: "Flashcards",
              sub: "Quick review",
              icon: "🃏",
              color: "from-cyan-500 to-blue-500",
            },
            {
              to: "/vocab/story-studio",
              label: "Story Studio",
              sub: "Write & publish",
              icon: "✍️",
              color: "from-pink-500 to-rose-500",
            },
            {
              to: "/vocab/word-garden",
              label: "Word Garden",
              sub: "Grow words",
              icon: "🌱",
              color: "from-lime-500 to-green-500",
            },
            {
              to: "/vocab/leaderboard",
              label: "Leaderboard",
              sub: "Compete!",
              icon: "🏆",
              color: "from-amber-500 to-orange-500",
            },
            {
              to: "/vocab/quests",
              label: "Daily Quests",
              sub: "Bonus XP",
              icon: "🎯",
              color: "from-purple-500 to-fuchsia-500",
            },
          ].map((a, i) => (
            <motion.div
              key={a.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={a.to}
                className="block relative overflow-hidden rounded-2xl p-4 bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/50 hover:shadow-lg transition-all group"
              >
                <div
                  className={`absolute -top-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br ${a.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`}
                />
                <div className="relative">
                  <div className="text-3xl mb-2">{a.icon}</div>
                  <p className="font-black text-sm text-slate-800 dark:text-white">
                    {a.label}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                    {a.sub}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Available Lessons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
            Your Lessons
          </h2>
          <Link
            to="/vocab/courses"
            className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-lime-600 transition-colors inline-flex items-center gap-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableLessons.slice(0, 3).map((lesson, i) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white dark:bg-slate-800/60 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-700/50 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-700/60 hover:shadow-2xl hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all overflow-hidden"
            >
              {/* Decorative gradient blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/20 to-lime-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl mb-3 inline-block"
                >
                  {lesson.words[0].imageUrl}
                </motion.div>
                <h3 className="font-black text-lg text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                  {lesson.words.length} new words •{" "}
                  {lesson.words
                    .slice(0, 3)
                    .map((w) => w.word)
                    .join(", ")}
                  {lesson.words.length > 3 ? "…" : ""}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold uppercase tracking-wide">
                    {lesson.theme}
                  </span>
                  <span className="text-[10px] font-bold text-lime-600 dark:text-lime-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-lime-500 text-lime-500" />
                    {lesson.xpRewards.video +
                      lesson.xpRewards.activity +
                      lesson.xpRewards.quiz +
                      lesson.xpRewards.challenge}{" "}
                    XP
                  </span>
                </div>
                <button
                  onClick={() => goToLesson(lesson.id)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all group-hover:shadow-lg group-hover:shadow-blue-300/50 text-sm relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Play className="w-4 h-4 fill-white" /> Start Lesson
                  </span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
