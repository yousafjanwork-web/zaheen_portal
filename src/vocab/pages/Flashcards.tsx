import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLessonsData } from '../context/LessonsContext';
import { speech, SpeechManager } from '../utils/speech';
import { Volume2, RotateCcw, Check, X, Shuffle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVocabBase } from '../hooks/useVocabBase';

type Difficulty = 'new' | 'hard' | 'good' | 'easy';

interface Card {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  emoji: string;
  partOfSpeech: string;
  theme: string;
}
export default function Flashcards() {
  const base = useVocabBase();
  const { user, addXP, addCoins, updateQuestProgress, updateChallengeProgress } = useAuth();
  const { lessons, isLoading, error } = useLessonsData();
  const [deck, setDeck] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ known: 0, learning: 0, total: 0 });
  const [showComplete, setShowComplete] = useState(false);
  const [reviewHistory, setReviewHistory] = useState<Difficulty[]>([]);

  const cards = useMemo(() => {
    const all = lessons.flatMap(l => l.words.map(w => ({
      id: w.id,
      word: w.word,
      pronunciation: w.pronunciation,
      definition: w.definition,
      example: w.exampleSentence,
      emoji: w.imageUrl,
      partOfSpeech: w.partOfSpeech,
      theme: l.theme,
    })));
    return all;
  }, [lessons]);

  useEffect(() => {
    if (cards.length === 0) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 12);
    setDeck(shuffled);
  }, [cards]);

  if (!user) return null;

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Shuffling your flashcard deck…</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500">{error}</div>;
  }
  if (deck.length === 0) return null;

  const current = deck[index];

  const handleDifficulty = (d: Difficulty) => {
    setReviewHistory([...reviewHistory, d]);

    if (d === 'easy' || d === 'good') {
      setSessionStats(s => ({ ...s, known: s.known + 1, total: s.total + 1 }));
    } else {
      setSessionStats(s => ({ ...s, learning: s.learning + 1, total: s.total + 1 }));
    }

    if (index + 1 < deck.length) {
      setIndex(index + 1);
      setFlipped(false);
    } else {
      addXP(30, 'Flashcard session complete');
      addCoins(15);
      updateQuestProgress('q-daily-2', sessionStats.known + 1);
      updateChallengeProgress(`dc-${new Date().toISOString().split('T')[0]}-1`, 3);
      setShowComplete(true);
    }
  };

  const speak = () => {
    if (!SpeechManager.isAvailable() || !current) return;
    speech.speakWord(current.word, current.pronunciation);
  };

  const reset = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5).slice(0, 12);
    setDeck(shuffled);
    setIndex(0);
    setFlipped(false);
    setSessionStats({ known: 0, learning: 0, total: 0 });
    setReviewHistory([]);
    setShowComplete(false);
  };

  if (showComplete) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl shadow-emerald-200/40"
        >
          <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-8xl mb-4">
            🎉
          </motion.div>
          <h1 className="text-4xl font-black mb-2">Session Complete!</h1>
          <p className="text-white/90 text-lg mb-6">
            You studied {sessionStats.total} words and knew {sessionStats.known} of them!
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <p className="text-3xl font-black">{sessionStats.known}</p>
              <p className="text-xs uppercase tracking-wider">Knew</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <p className="text-3xl font-black">{sessionStats.learning}</p>
              <p className="text-xs uppercase tracking-wider">Learning</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30">
              <p className="text-3xl font-black">
                {Math.round((sessionStats.known / Math.max(sessionStats.total, 1)) * 100)}%
              </p>
              <p className="text-xs uppercase tracking-wider">Accuracy</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5" /> +30 XP
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-bold inline-flex items-center gap-1">
              🪙 +15
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={reset}
              className="px-6 py-3 bg-white text-emerald-700 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> New Session
            </button>
        <Link
              to={base}
              className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-2xl font-bold hover:bg-white/30 transition-all border border-white/30"
            >
              Back Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 p-6 md:p-8 text-white shadow-xl shadow-blue-200/40"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-200/30 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-blue-200/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 mb-2">
              🃏 Flashcard Sprint
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Quick vocabulary review!
            </h1>
            <p className="text-white/85 mt-1">
              Flip a card, recall the meaning, then rate how well you knew it.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center min-w-[140px]">
            <p className="text-xs text-white/80 uppercase tracking-wider font-bold">Progress</p>
            <p className="text-3xl font-black">{index + 1} / {deck.length}</p>
          </div>
        </div>
      </motion.div>

      {/* Progress dots */}
      <div className="flex justify-center gap-1.5">
        {deck.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i < index
                ? reviewHistory[i] === 'hard' || reviewHistory[i] === 'new'
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
                : i === index
                ? 'bg-blue-500 w-8'
                : 'bg-slate-200 dark:bg-slate-700 w-2'
            }`}
          />
        ))}
      </div>

      {/* Flashcard */}
      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id + (flipped ? '-back' : '-front')}
            initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: 90, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            style={{ perspective: 1000 }}
            onClick={() => setFlipped(!flipped)}
            className="relative w-full max-w-md aspect-[3/4] cursor-pointer"
          >
            <div className={`absolute inset-0 rounded-3xl shadow-2xl transition-all ${
              flipped
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700'
                : 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border-2 border-slate-200 dark:border-slate-600'
            }`}>
              {!flipped ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-9xl mb-6"
                  >
                    {current.emoji}
                  </motion.div>
                  <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{current.word}</h2>
                  <p className="text-sm text-slate-500 italic mb-3">/{current.pronunciation}/</p>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    {current.partOfSpeech} · {current.theme}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); speak(); }}
                    className="mt-6 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <p className="mt-4 text-xs text-slate-400">Tap to reveal definition</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-2">Definition</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-white mb-4 leading-relaxed">
                    {current.definition}
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-3 mb-4 max-w-xs">
                    <p className="text-[10px] uppercase tracking-wider text-amber-600 font-bold mb-1">Example</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{current.example}"</p>
                  </div>
                  <p className="text-xs text-slate-400">How well did you know this?</p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Difficulty buttons (shown when flipped) */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2 max-w-md mx-auto"
        >
          {[
            { d: 'new' as Difficulty, label: 'New', icon: '🆕', color: 'from-red-400 to-rose-500' },
            { d: 'hard' as Difficulty, label: 'Hard', icon: '😣', color: 'from-orange-400 to-amber-500' },
            { d: 'good' as Difficulty, label: 'Good', icon: '😊', color: 'from-blue-400 to-cyan-500' },
            { d: 'easy' as Difficulty, label: 'Easy', icon: '😎', color: 'from-emerald-400 to-lime-500' },
          ].map(btn => (
            <button
              key={btn.d}
              onClick={() => handleDifficulty(btn.d)}
              className={`p-3 rounded-2xl bg-gradient-to-br ${btn.color} text-white font-bold hover:scale-105 transition-all shadow-lg`}
            >
              <div className="text-2xl">{btn.icon}</div>
              <div className="text-xs mt-1">{btn.label}</div>
            </button>
          ))}
        </motion.div>
      )}

      {/* Quick flip reminder */}
      {!flipped && (
        <div className="text-center text-sm text-slate-500">
          Tap the card or press <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs">Space</kbd> to flip
        </div>
      )}

      {/* Session stats footer */}
      <div className="flex justify-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-500" /> {sessionStats.known} known</span>
        <span>·</span>
        <span className="flex items-center gap-1"><X className="w-3 h-3 text-amber-500" /> {sessionStats.learning} learning</span>
        <span>·</span>
        <button
          onClick={reset}
          className="flex items-center gap-1 text-blue-600 hover:underline"
        >
          <Shuffle className="w-3 h-3" /> Reshuffle
        </button>
      </div>
    </div>
  );
}
