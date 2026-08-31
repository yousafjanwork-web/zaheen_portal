import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions, encouragements, hints } from "../data/content";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Confetti } from "../components/ui/Confetti";
import { NarrationBar } from "../components/layout/NarrationBar";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { Link } from "react-router-dom";
import { usePakistanBase } from "../hooks/usePakistanBase";

const TOTAL = 5;

export function QuizPage() {
  const base = usePakistanBase();
  const ageGroup = useGameStore((s) => s.ageGroup);
  const completeQuiz = useGameStore((s) => s.completeQuiz);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);

  const questions = useMemo(() => {
    let pool = [...quizQuestions];
    if (ageGroup === "5-7") pool = pool.filter((q) => q.difficulty === "easy");
    else if (ageGroup === "8-10")
      pool = pool.filter((q) => q.difficulty !== "hard");
    return pool.sort(() => Math.random() - 0.5).slice(0, TOTAL);
  }, [ageGroup]);

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);

  const q = questions[idx];

  const start = () => {
    setStarted(true);
    setZaheen("You got this! Read carefully!", "excited");
  };

  const choose = (i: number) => {
    if (selected !== null || !q) return;
    setSelected(i);
    const ok = i === q.correctIndex;
    if (ok) {
      setScore((s) => s + 1);
      if (sound) sfx.success();
      setZaheen(encouragements[Math.floor(Math.random() * encouragements.length)], "celebrate");
    } else {
      if (sound) sfx.wrong();
      setZaheen(hints[Math.floor(Math.random() * hints.length)], "thinking");
    }

    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        const finalScore = score + (ok ? 1 : 0);
        setFinished(true);
        setStarsEarned(finalScore === TOTAL ? 3 : finalScore >= 3 ? 2 : 1);
        completeQuiz(finalScore, TOTAL);
        if (sound) sfx.celebrate();
      } else {
        setIdx((x) => x + 1);
        setSelected(null);
        setShowHint(false);
      }
    }, 1200);
  };

  const restart = () => {
    setStarted(false);
    setIdx(0);
    setScore(0);
    setSelected(null);
    setShowHint(false);
    setFinished(false);
  };

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="game" />
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-center text-shadow-soft mb-2">
          Pakistan Quiz ❓
        </h1>
        <p className="text-center font-bold text-emerald-700 mb-6">
          5 questions · Hints available · Stars for every try!
        </p>

        {!started && !finished && (
          <Card className="text-center">
            <div className="flex justify-center mb-4">
              <CaptainZaheen
                size="lg"
                message="Ready for a fun quiz about Pakistan?"
                mood="wave"
              />
            </div>
            <p className="font-semibold text-slate-600 mb-4">
              Questions adapt to your age group ({ageGroup}). Never worry about wrong answers —
              we cheer you on!
            </p>
            <Button size="xl" glow onClick={start}>
              Start Quiz 🚀
            </Button>
          </Card>
        )}

        {started && !finished && q && (
          <Card>
            <ProgressBar
              value={idx}
              max={TOTAL}
              label={`Question ${idx + 1} of ${TOTAL}`}
              showLabel
              className="mb-4"
              color="from-violet-400 to-purple-600"
            />
            <div className="text-center text-5xl mb-3">{q.emoji}</div>
            <h2 className="text-xl font-black text-emerald-900 text-center mb-2">{q.question}</h2>
            <NarrationBar text={q.question} className="mb-4" />
            <div className="grid gap-2">
              {q.options.map((opt, i) => {
                let style = "bg-white border-emerald-50 hover:border-emerald-300";
                if (selected !== null) {
                  if (i === q.correctIndex) style = "bg-emerald-100 border-emerald-400";
                  else if (i === selected) style = "bg-rose-50 border-rose-300";
                }
                return (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.98 }}
                    animate={
                      selected === i && i !== q.correctIndex ? { x: [-6, 6, -6, 6, 0] } : {}
                    }
                    onClick={() => choose(i)}
                    className={`rounded-2xl border-2 px-4 py-3.5 text-left font-bold text-emerald-900 transition ${style}`}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs mr-2">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {selected !== null && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-sm font-bold text-emerald-700"
                >
                  {q.explanation}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-4 text-center">
              <Button size="sm" variant="ghost" onClick={() => setShowHint(true)}>
                💡 Hint
              </Button>
              {showHint && (
                <p className="mt-2 text-sm font-bold text-amber-600">{q.hint}</p>
              )}
            </div>
          </Card>
        )}

        {finished && (
          <Card className="text-center relative overflow-hidden">
            {score === TOTAL && <Confetti count={45} />}
            <motion.div
              className="text-7xl mb-3"
              animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.8 }}
            >
              {score === TOTAL ? "🏆" : score >= 3 ? "⭐" : "💪"}
            </motion.div>
            <h2 className="text-3xl font-black text-emerald-900">
              {score === TOTAL ? "Perfect Score!" : score >= 3 ? "Well Done!" : "Good Effort!"}
            </h2>
            <p className="font-bold text-emerald-700 mt-2 text-xl">
              {score}/{TOTAL} correct
            </p>
            <div className="flex justify-center gap-1 mt-2 text-3xl">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < starsEarned ? "" : "opacity-20"}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="mt-3 font-semibold text-slate-600">
              {encouragements[Math.floor(Math.random() * encouragements.length)]}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={restart}>
                Try Again
              </Button>
         <Link to={`${base}/games`}>
                <Button size="lg" variant="secondary">
                  Play Games
                </Button>
              </Link>
              <Link to={`${base}/badges`}>
                <Button size="lg" variant="gold">
                  See Badges
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
