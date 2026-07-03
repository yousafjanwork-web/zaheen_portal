import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useAuth as useZaheenAuth } from '@/modules/shared/context/AuthContext';
import { lessons } from '../data/lessons';
import { BookOpen, Play, Star, Clock, Sparkles, CheckCircle } from 'lucide-react';
import Mascot from '../components/Mascot';

export default function Courses() {
  const { user, completedLessons } = useAuth();
  if (!user) return null;
  const { isLoggedIn } = useZaheenAuth();
  const navigate = useNavigate();

  const availableLessons = lessons.filter(l => l.ageGroup === user.ageGroup || l.ageGroup === 'both');

  return (
    <div className="space-y-8">
      {/* Mascot */}
      <Mascot
        message={`Welcome to the Course Library! 📚 I see ${availableLessons.length} lessons waiting for you. ${completedLessons.length > 0 ? `You've completed ${completedLessons.length} already — amazing!` : "Let's start your first one!"}`}
        emotion="happy"
        autoSpeak={false}
        position="bottom-right"
        size="md"
        showDismiss
      />

      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-xl shadow-blue-200/40">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-lime-300/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="relative flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold border border-white/20 mb-2">
              <BookOpen className="w-3 h-3" /> Course Library
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Vocabulary Adventures
            </h1>
            <p className="text-white/85 mt-1">
              Curated for {user.ageGroup === 'junior' ? 'Junior (7–9)' : 'Senior (10–12)'} learners
            </p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[180px]">
            <p className="text-xs text-white/70 uppercase tracking-wider font-bold">Progress</p>
            <p className="text-2xl font-black">{completedLessons.length}/{availableLessons.length}</p>
            <div className="h-1.5 mt-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-lime-300 to-green-400 rounded-full transition-all"
                style={{ width: `${(completedLessons.length / Math.max(availableLessons.length, 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Themes */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Amazing Animals', 'Space Adventure', 'Ocean Wonders', 'Superheroes', 'Friendship'].map((theme, i) => (
          <button
            key={theme}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 ${
              i === 0
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 shadow-sm'
            }`}
          >
            {theme}
          </button>
        ))}
      </div>

      {/* Lesson Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableLessons.map((lesson, i) => {
          const isCompleted = completedLessons.includes(lesson.id);
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`relative bg-white dark:bg-slate-800/60 rounded-3xl overflow-hidden border-2 transition-all group shadow-sm ${
                isCompleted
                  ? 'border-lime-300 dark:border-lime-700/40 hover:shadow-lime-200/40 hover:shadow-xl'
                  : 'border-slate-200/70 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-2xl hover:shadow-blue-200/40'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-9 h-9 bg-gradient-to-br from-lime-400 to-green-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-slate-800">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-6 text-white overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-lime-300/30 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-cyan-300/30 blur-2xl" />
                {/* Grid pattern */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl mb-3 inline-block drop-shadow-lg"
                  >
                    {lesson.words[0].imageUrl}
                  </motion.div>
                  <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-bold border border-white/20">
                    {lesson.theme}
                  </span>
                  <h3 className="text-xl font-black mt-2">{lesson.title}</h3>
                  <p className="text-white/75 text-sm mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {lesson.words.length} vocabulary words
                  </p>
                </div>
              </div>

              {/* Words Preview */}
              <div className="p-5 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {lesson.words.map(w => (
                    <span
                      key={w.id}
                      className="px-2.5 py-1 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-700/30"
                    >
                      {w.word}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-semibold">
                    <Clock className="w-3 h-3" /> ~10 min
                  </span>
                  <span className="flex items-center gap-1 text-lime-600 dark:text-lime-400 font-bold">
                    <Star className="w-3 h-3 fill-lime-500 text-lime-500" />
                    {lesson.xpRewards.video + lesson.xpRewards.activity + lesson.xpRewards.quiz + lesson.xpRewards.challenge} XP
                  </span>
                </div>

                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate(`/login`, { state: { from: `/vocab/lesson/${lesson.id}` } });
                      return;
                    }
                    navigate(`/vocab/lesson/${lesson.id}`);
                  }}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                    isCompleted
                      ? 'bg-gradient-to-r from-lime-100 to-green-100 text-lime-700 hover:from-lime-200 hover:to-green-200 dark:from-lime-900/30 dark:to-green-900/30 dark:text-lime-300'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30'
                  }`}
                >
                  {isCompleted ? (
                    <>✅ Completed — Replay?</>
                  ) : (
                    <><Play className="w-4 h-4 fill-white" /> Start Lesson</>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700"
      >
        <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">More Lessons Coming Soon!</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          New vocabulary adventures are being created. Check back soon!
        </p>
      </motion.div>
    </div>
  );
}