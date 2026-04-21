import { useState, useEffect } from "react";

// ---------- Types ----------
interface Word {
  word: string;
  hint: string;
}

interface FeedbackState {
  msg: string;
  type: "success" | "error" | null;
}

interface ResultCardProps {
  score: number;
  correct: number;
  incorrect: number;
  total: number;
  onRestart: () => void;
  onBack: () => void;
}

// ---------- Data ----------
const wordBank: Word[] = [
  { word: "APPLE", hint: "🍎" },
  { word: "BALL", hint: "⚽" },
  { word: "CAT", hint: "🐱" },
  { word: "DOG", hint: "🐶" },
  { word: "FISH", hint: "🐟" },
  { word: "PIZZA", hint: "🍕" },
  { word: "ROCKET", hint: "🚀" },
  { word: "GUITAR", hint: "🎸" },
  { word: "BICYCLE", hint: "🚲" },
  { word: "DRAGON", hint: "🐉" },
  { word: "GHOST", hint: "👻" },
  { word: "CAKE", hint: "🍰" },
];

const TOTAL_QUESTIONS = 10;

// ---------- Helpers ----------
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickWords(count: number): Word[] {
  return shuffle(wordBank).slice(0, count);
}

// Web Speech API for Voice Effects
const speakWord = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

// ---------- Result Card ----------
function ResultCard({
  score,
  correct,
  incorrect,
  total,
  onRestart,
  onBack,
}: ResultCardProps) {
  const pct = Math.round((correct / total) * 100);

  return (
    <div className="min-h-500px w-full flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border-b-2 border-slate-200 px-5 py-6 flex flex-col items-center text-center gap-4">
        <div className="text-5xl animate-bounce">🏆</div>
        <div>
          <h2 className="text-xl font-black text-slate-700">Game Over!</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Here&apos;s how you did
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-2xl font-black text-green-600">{correct}</div>
            <div className="text-[10px] font-bold text-green-400 mt-0.5">
              Correct
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <div className="text-2xl font-black text-red-500">{incorrect}</div>
            <div className="text-[10px] font-bold text-red-400 mt-0.5">
              Incorrect
            </div>
          </div>
          <div className="bg-indigo-50 rounded-xl p-3">
            <div className="text-2xl font-black text-indigo-600">{score}</div>
            <div className="text-[10px] font-bold text-indigo-400 mt-0.5">
              Score
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full mt-2">
          <button
            onClick={onBack}
            className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-black rounded-lg uppercase"
          >
            ← Back
          </button>
          <button
            onClick={onRestart}
            className="flex-1 py-2 bg-indigo-600 text-white text-xs font-black rounded-lg shadow-[0_3px_0_0_#4338ca] active:shadow-none active:translate-y-0.5 uppercase transition-all"
          >
            🔄 Restart
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Game ----------
export default function WordBuilderGame() {
  const [queue, setQueue] = useState<Word[]>(() => pickWords(TOTAL_QUESTIONS));
  const [qIndex, setQIndex] = useState<number>(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    msg: "",
    type: null,
  });
  const [score, setScore] = useState<number>(0);
  const [tryCount, setTryCount] = useState<number>(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const current: Word = queue[qIndex];

  const loadNewWord = (): void => {
    setLetters([...current.word].sort(() => Math.random() - 0.5));
    setAnswer("");
    setFeedback({ msg: "", type: null });
    setTryCount(0);
    // Auto-speak the word when it loads
    speakWord(current.word);
  };

  useEffect(() => {
    if (current) loadNewWord();
  }, [qIndex, queue]);

  const nextQuestion = (wasCorrect: boolean): void => {
    setResults((r) => [...r, wasCorrect]);
    const next = qIndex + 1;
    if (next >= TOTAL_QUESTIONS) setGameOver(true);
    else setQIndex(next);
  };

  const checkAnswer = (): void => {
    if (answer === current.word) {
      setFeedback({ msg: "✨ Brilliant!", type: "success" });
      setScore((s) => s + 10);
      setTimeout(() => nextQuestion(true), 1500);
    } else {
      const newTry = tryCount + 1;
      setTryCount(newTry);
      if (newTry >= 2) {
        setFeedback({ msg: `❌ Answer: ${current.word}`, type: "error" });
        setTimeout(() => nextQuestion(false), 1800);
      } else {
        setFeedback({ msg: "❌ Try again!", type: "error" });
      }
    }
  };

  const handleRestart = (): void => {
    setQueue(pickWords(TOTAL_QUESTIONS));
    setQIndex(0);
    setScore(0);
    setResults([]);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <ResultCard
        score={score}
        correct={results.filter(Boolean).length}
        incorrect={results.filter((r) => !r).length}
        total={TOTAL_QUESTIONS}
        onRestart={handleRestart}
        onBack={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-500px w-full flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Main Game Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border-b-4 border-slate-200 px-4 py-5 flex flex-col gap-3 relative">
        {/* Header */}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span className="bg-indigo-50 text-indigo-500 px-2 py-1 rounded">
            Q {qIndex + 1}/{TOTAL_QUESTIONS}
          </span>
          <span>Score: {score}</span>
        </div>

        {/* Speaker Icon (Hidden if feedback is active to prevent overlapping sounds) */}
        <button
          onClick={() => speakWord(current.word)}
          className="absolute top-14 right-6 w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-lg hover:bg-indigo-100 active:scale-90 transition-all"
        >
          🔊
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < results.length ? (results[i] ? "bg-green-400" : "bg-red-400") : i === qIndex ? "bg-indigo-500" : "bg-slate-200"}`}
            />
          ))}
        </div>

        {/* Hint Emoji */}
        <div className="flex items-center justify-center text-6xl py-2">
          <span className="animate-bounce duration-3000">{current.hint}</span>
        </div>

        {/* Answer Slots */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-2">
          {current.word.split("").map((_, i) => (
            <div
              key={i}
              className={`w-8 h-10 border-b-4 flex items-center justify-center text-2xl font-black ${answer[i] ? "border-indigo-500 text-indigo-600" : "border-slate-100 text-slate-300"} ${feedback.type === "error" ? "border-red-500 text-red-500" : ""}`}
            >
              {answer[i] ?? ""}
            </div>
          ))}
        </div>

        {/* Letter Bank */}
        <div className="grid grid-cols-4 gap-2 mb-2">
          {letters.map((l, i) => (
            <button
              key={`${current.word}-${i}`}
              disabled={!!feedback.type}
              onClick={() =>
                answer.length < current.word.length &&
                setAnswer((prev) => prev + l)
              }
              className="aspect-square flex items-center justify-center bg-amber-400 text-white font-black text-xl rounded-xl shadow-[0_4px_0_0_#d97706] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50"
            >
              {l}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2">
          {feedback.type === "error" && tryCount < 2 ? (
            <button
              onClick={() => {
                setAnswer("");
                setFeedback({ msg: "", type: null });
              }}
              className="w-full py-3 bg-orange-500 text-white font-black rounded-xl shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none uppercase"
            >
              🔄 Try Again
            </button>
          ) : (
            <button
              onClick={checkAnswer}
              disabled={
                answer.length !== current.word.length || !!feedback.type
              }
              className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl shadow-[0_4px_0_0_#4338ca] active:translate-y-1 active:shadow-none disabled:bg-slate-200 disabled:shadow-none transition-all uppercase"
            >
              Check Answer
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setAnswer((prev) => prev.slice(0, -1))}
              disabled={!!feedback.type}
              className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase"
            >
              Clear
            </button>
            <button
              onClick={() => nextQuestion(false)}
              className="flex-1 py-2 bg-rose-50 text-rose-500 text-xs font-bold rounded-lg border border-rose-100 uppercase"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
