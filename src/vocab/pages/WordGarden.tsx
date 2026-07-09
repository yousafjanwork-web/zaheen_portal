import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLessonsData } from '../context/LessonsContext';
import { VocabularyWord, WordCollection } from '../types';
import { Search, Sparkles, Star, Volume2, X, Plus } from 'lucide-react';
import { speech, SpeechManager } from '../utils/speech';
import { useNavigate } from 'react-router-dom';

const masteryColors: Record<WordCollection['mastery'], { bg: string; text: string; ring: string; label: string; emoji: string }> = {
  new: { bg: 'from-slate-100 to-slate-50', text: 'text-slate-700', ring: 'ring-slate-200', label: 'New', emoji: '🌱' },
  learning: { bg: 'from-amber-100 to-yellow-50', text: 'text-amber-700', ring: 'ring-amber-300', label: 'Learning', emoji: '🌿' },
  familiar: { bg: 'from-blue-100 to-cyan-50', text: 'text-blue-700', ring: 'ring-blue-300', label: 'Familiar', emoji: '🌳' },
  mastered: { bg: 'from-lime-100 to-green-50', text: 'text-lime-700', ring: 'ring-lime-400', label: 'Mastered', emoji: '🌟' },
};

export default function WordGarden() {
  const { user, wordCollection, addToCollection, addXP, addCoins, updateQuestProgress, updateChallengeProgress } = useAuth();
  const { lessons, isLoading, error } = useLessonsData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | WordCollection['mastery']>('all');
  const [detailWord, setDetailWord] = useState<VocabularyWord | null>(null);

  const allWords = useMemo(() => lessons.flatMap(l => l.words.map(w => ({ ...w, theme: l.theme, lessonId: l.id }))), [lessons]);

  if (!user) return null;

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading your word garden…</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500">{error}</div>;
  }
  const collectedIds = new Set(wordCollection.map(w => w.wordId));
  const uncollected = allWords.filter(w => !collectedIds.has(w.id));

  const stats = {
    total: allWords.length,
    collected: wordCollection.length,
    new: wordCollection.filter(w => w.mastery === 'new').length,
    learning: wordCollection.filter(w => w.mastery === 'learning').length,
    familiar: wordCollection.filter(w => w.mastery === 'familiar').length,
    mastered: wordCollection.filter(w => w.mastery === 'mastered').length,
  };

  const display = filter === 'all' ? wordCollection : wordCollection.filter(w => w.mastery === filter);
  const filtered = display.filter(w => !search || w.word.toLowerCase().includes(search.toLowerCase()));

  const handleCollect = (w: VocabularyWord & { theme: string }) => {
    addToCollection({ id: w.id, word: w.word, theme: w.theme, emoji: w.imageUrl, definition: w.definition });
    addXP(5, 'Word collected');
    addCoins(2);
    updateQuestProgress('q-daily-2', 1);
    updateChallengeProgress(`dc-${new Date().toISOString().split('T')[0]}-1`, 1);
  };

  const speakWord = (w: VocabularyWord) => {
    if (!SpeechManager.isAvailable()) return;
    speech.speakWord(w.word, w.pronunciation);
  };

  const progressToCollectAll = Math.round((stats.collected / Math.max(stats.total, 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 p-6 md:p-8 text-white shadow-xl shadow-green-200/40"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-lime-200/30 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-yellow-200/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 mb-2">
              🌱 Word Garden
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Grow your vocabulary forest!
            </h1>
            <p className="text-white/85 mt-1">
              Every word you collect sprouts a new plant. Tend them daily to grow into mighty trees!
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 min-w-[200px]">
            <p className="text-xs text-white/80 uppercase tracking-wider font-bold">Garden Progress</p>
            <p className="text-2xl font-black">{stats.collected} / {stats.total} words</p>
            <div className="h-2 mt-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToCollectAll}%` }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mastery stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'new', label: 'New', emoji: '🌱', count: stats.new },
          { key: 'learning', label: 'Learning', emoji: '🌿', count: stats.learning },
          { key: 'familiar', label: 'Familiar', emoji: '🌳', count: stats.familiar },
          { key: 'mastered', label: 'Mastered', emoji: '🌟', count: stats.mastered },
        ].map(s => {
          const color = masteryColors[s.key as WordCollection['mastery']];
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key as WordCollection['mastery'])}
              className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 text-left bg-gradient-to-br ${color.bg} ${color.ring} ring-2`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-2xl font-black text-slate-700">{s.count}</span>
              </div>
              <p className={`text-sm font-bold mt-1 ${color.text}`}>{s.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your words..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {(['all', 'new', 'learning', 'familiar', 'mastered'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Word Garden Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((w, i) => {
            const c = masteryColors[w.mastery];
            return (
              <motion.button
                key={w.wordId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => {
                  const lessonWord = allWords.find(aw => aw.id === w.wordId);
                  if (lessonWord) {
                    setDetailWord(lessonWord);
                    addToCollection({ id: w.wordId, word: w.word, theme: w.theme, emoji: w.emoji, definition: w.definition });
                  }
                }}
                className={`group relative p-4 rounded-2xl border-2 bg-gradient-to-br ${c.bg} ${c.ring} ring-2 transition-all text-left overflow-hidden`}
              >
                <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all">
                  {c.emoji}
                </div>
                <div className="relative">
                  <div className="text-3xl mb-2">{w.emoji}</div>
                  <h3 className={`font-black text-lg ${c.text}`}>{w.word}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">
                    {c.label} · {w.timesReviewed}× reviews
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/60 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 font-bold">No words in this filter yet.</p>
          <p className="text-slate-400 text-sm">Start a lesson to grow your garden!</p>
        </div>
      )}

      {/* Uncollected words to discover */}
      {uncollected.length > 0 && (
        <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-700/50">
          <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-1">
            <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-lime-500" />
            Discover New Words
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Tap to plant these seeds in your garden! +5 XP and +2 coins each 🌱
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {uncollected.slice(0, 8).map((w, i) => (
              <motion.button
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                onClick={() => handleCollect(w)}
                className="group relative p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:border-lime-400 hover:bg-lime-50 dark:hover:bg-lime-900/20 transition-all text-left"
              >
                <div className="text-2xl mb-1 grayscale group-hover:grayscale-0 transition-all">{w.imageUrl}</div>
                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">{w.word}</h3>
                <p className="text-[10px] text-slate-400 line-clamp-1">{w.theme}</p>
                <Plus className="absolute top-2 right-2 w-4 h-4 text-slate-400 group-hover:text-lime-600 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Word detail modal */}
      <AnimatePresence>
        {detailWord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetailWord(null)}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setDetailWord(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-red-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-7xl text-center mb-3">{detailWord.imageUrl}</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white text-center">{detailWord.word}</h2>
                <button
                  onClick={() => speakWord(detailWord)}
                  className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-500 italic text-center">/{detailWord.pronunciation}/</p>
              <p className="text-xs text-slate-400 text-center uppercase tracking-wider mt-1">{detailWord.partOfSpeech}</p>
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300 mb-1">Definition</p>
                <p className="text-slate-700 dark:text-slate-300">{detailWord.definition}</p>
              </div>
              <div className="mt-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Example</p>
                <p className="text-slate-600 dark:text-slate-400 italic text-sm">"{detailWord.exampleSentence}"</p>
              </div>
              {detailWord.funFact && (
                <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-1">💡 Fun Fact</p>
                  <p className="text-amber-700 dark:text-amber-400 text-sm">{detailWord.funFact}</p>
                </div>
              )}
              <button
                onClick={() => {
                  navigate(`/vocab/lesson/${detailWord.id && allWords.find(w => w.id === detailWord.id)?.lessonId || 'lesson-1'}`);
                }}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-white" /> Practice in Lesson
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
