import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

import {
  TrendingUp, BookOpen, Star, Target, Calendar,
  Users, Download, Eye
} from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'parent') {
    return null;
  }

  // Simulated child data
  const childData = {
    name: 'Alex',
    ageGroup: 'junior',
    xp: 150,
    level: 2,
    streak: 3,
    lessonsCompleted: 2,
    wordsLearned: 15,
    quizAvg: 78,
    totalTime: '2.5 hours',
    recentLessons: [
      { title: 'Amazing Animals', date: '2024-01-15', score: 85, words: 5 },
      { title: 'Friendship', date: '2024-01-13', score: 72, words: 3 },
    ],
    weeklyActivity: [1, 1, 0, 1, 0, 1, 0],
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-indigo-500" /> Parent Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track your child's vocabulary learning progress
        </p>
      </div>

      {/* Child Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm">Your Child</p>
            <h2 className="text-2xl font-bold">{childData.name}</h2>
            <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
              <span>{childData.ageGroup === 'junior' ? 'Junior (7-9)' : 'Senior (10-12)'}</span>
              <span>•</span>
              <span>Level {childData.level}</span>
              <span>•</span>
              <span>🔥 {childData.streak}-day streak</span>
            </div>
          </div>
          <div className="text-6xl">👦</div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: childData.xp, icon: Star, color: 'from-amber-400 to-orange-500' },
          { label: 'Lessons Done', value: childData.lessonsCompleted, icon: BookOpen, color: 'from-violet-400 to-purple-500' },
          { label: 'Words Learned', value: childData.wordsLearned, icon: Target, color: 'from-emerald-400 to-teal-500' },
          { label: 'Avg Quiz Score', value: `${childData.quizAvg}%`, icon: TrendingUp, color: 'from-rose-400 to-pink-500' },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
        >
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-500" /> Weekly Activity
          </h3>
          <div className="flex items-end gap-3 h-36">
            {childData.weeklyActivity.map((active, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    active
                      ? 'bg-gradient-to-t from-indigo-500 to-violet-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  style={{ height: active ? `${60 + Math.random() * 30}%` : '20%' }}
                />
                <span className="text-xs text-slate-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Lessons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
        >
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-500" /> Recent Lessons
          </h3>
          <div className="space-y-3">
            {childData.recentLessons.map((lesson, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="text-2xl">📚</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">{lesson.title}</p>
                  <p className="text-xs text-slate-400">{lesson.date} • {lesson.words} words</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{lesson.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Weekly Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" /> Weekly Report
          </h3>
          <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
            Download PDF <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Time Spent</p>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{childData.totalTime}</p>
            <p className="text-xs text-indigo-500 dark:text-indigo-500">This week</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Quiz Performance</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{childData.quizAvg}%</p>
            <p className="text-xs text-emerald-500 dark:text-emerald-500">Average score</p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Learning Streak</p>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{childData.streak} Days</p>
            <p className="text-xs text-amber-500 dark:text-amber-500">Keep it up!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
