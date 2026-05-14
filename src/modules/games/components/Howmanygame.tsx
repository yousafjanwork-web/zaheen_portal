import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import correctSoundFile from "@/assets/sounds/correct.mp3";
import wrongSoundFile from "@/assets/sounds/wrong.mp3";

// ─── Sound setup ──────────────────────────────────────────────
const correctSound = new Audio(correctSoundFile);
const wrongSound = new Audio(wrongSoundFile);

const playCorrect = () => {
  correctSound.currentTime = 0;
  correctSound.play().catch(() => {});
};
const playWrong = () => {
  wrongSound.currentTime = 0;
  wrongSound.play().catch(() => {});
};

// ─── Types ────────────────────────────────────────────────────
interface Question {
  emoji: string; // the object to count
  count: number; // correct answer
  choices: number[]; // 4 options
}

// ─── Emoji pool ───────────────────────────────────────────────
const EMOJIS = [
  "🍎",
  "🍌",
  "🍊",
  "🍇",
  "🍓",
  "🥭",
  "🍋",
  "🍑",
  "🍒",
  "🥝",
  "🐱",
  "🐶",
  "🐸",
  "🐥",
  "🦁",
  "⭐",
  "🌸",
  "🎈",
  "🍭",
  "🚗",
];

// ─── Helpers ──────────────────────────────────────────────────
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

// Generate one question — random emoji, random count 1-10
function makeQuestion(usedEmojis: string[]): Question {
  // pick emoji not used recently
  const available = EMOJIS.filter((e) => !usedEmojis.includes(e));
  const pool = available.length > 0 ? available : EMOJIS;
  const emoji = pool[Math.floor(Math.random() * pool.length)];

  const count = Math.floor(Math.random() * 20) + 1; // 1 to 10

  // 3 wrong choices — different from correct, between 1-10
  const wrongSet = new Set<number>();
  while (wrongSet.size < 3) {
    const n = Math.floor(Math.random() * 20) + 1;
    if (n !== count) wrongSet.add(n);
  }

  return {
    emoji,
    count,
    choices: shuffle([count, ...Array.from(wrongSet)]),
  };
}

// Build 10 unique questions
function buildQuestions(): Question[] {
  const questions: Question[] = [];
  const usedEmojis: string[] = [];

  for (let i = 0; i < 10; i++) {
    const q = makeQuestion(usedEmojis);
    questions.push(q);
    usedEmojis.push(q.emoji);
    if (usedEmojis.length > 5) usedEmojis.shift(); // keep last 5
  }

  return questions;
}

// ─── Emoji Grid ───────────────────────────────────────────────
// Shows the objects kid needs to count in a nice grid
function EmojiGrid({ emoji, count }: { emoji: string; count: number }) {
  return (
    <div className="w-full bg-amber-50 border-4 border-amber-200 rounded-3xl p-4 flex flex-wrap justify-center gap-2 min-h-[120px] items-center shadow-[0px_6px_0px_#d97706]">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="text-4xl sm:text-5xl select-none leading-none"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

// ─── Choice Button ────────────────────────────────────────────
function ChoiceBtn({
  number,
  status,
  onTap,
  disabled,
}: {
  number: number;
  status: "idle" | "correct" | "wrong";
  onTap: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onTap}
      disabled={disabled}
      className={`
        w-full py-4 rounded-2xl text-3xl sm:text-4xl font-black
        border-4 transition-all duration-200
        ${
          disabled && status === "idle"
            ? "cursor-default opacity-50"
            : disabled
              ? "cursor-default"
              : "cursor-pointer active:translate-y-1"
        }
        ${
          status === "correct"
            ? "bg-green-100 border-green-400 text-green-700 shadow-[0px_5px_0px_#16a34a]"
            : status === "wrong"
              ? "bg-red-100 border-red-400 text-red-600 shadow-[0px_5px_0px_#dc2626]"
              : "bg-white border-blue-300 text-blue-700 shadow-[0px_5px_0px_#3b82f6]"
        }
      `}
    >
      {status === "correct" ? "✅" : status === "wrong" ? "❌" : number}
    </button>
  );
}

// ─── Main Game ────────────────────────────────────────────────
export default function HowManyGame() {
  const navigate = useNavigate();

  const [questions] = useState<Question[]>(() => buildQuestions());
  const [index, setIndex] = useState(0);
  const [choiceStates, setChoiceStates] = useState<
    ("idle" | "correct" | "wrong")[]
  >([]);
  const [score, setScore] = useState(0);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const current = questions[index];
  const TOTAL = questions.length;
  const pct = Math.round((index / TOTAL) * 100);

  // Reset states when question changes
  useEffect(() => {
    if (!current) return;
    setChoiceStates(current.choices.map(() => "idle"));
    setAnsweredCorrect(false);
  }, [index]);

  // ── Handle choice tap ───────────────────────────────────────
  const handleTap = (i: number) => {
    if (answeredCorrect) return;

    const tapped = current.choices[i];
    const isCorrect = tapped === current.count;

    if (isCorrect) {
      // Mark correct
      setChoiceStates((prev) =>
        prev.map((_, idx) =>
          current.choices[idx] === current.count ? "correct" : "idle",
        ),
      );
      setAnsweredCorrect(true);
      setScore((s) => s + 10);
      playCorrect();

      // Move to next after 1.8s
      setTimeout(() => {
        setResults((r) => [...r, true]);
        if (index + 1 >= TOTAL) setGameOver(true);
        else setIndex((prev) => prev + 1);
      }, 1800);
    } else {
      // Mark wrong — reset after 1.2s so kid can try again
      setChoiceStates((prev) =>
        prev.map((s, idx) => (idx === i ? "wrong" : s)),
      );
      playWrong();

      setTimeout(() => {
        setChoiceStates((prev) =>
          prev.map((s, idx) => (idx === i ? "idle" : s)),
        );
      }, 1200);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setResults([]);
    setGameOver(false);
    setAnsweredCorrect(false);
    setChoiceStates([]);
  };

  // ── GAME OVER ────────────────────────────────────────────────
  if (gameOver) {
    const correct = results.filter(Boolean).length;
    const incorrect = results.length - correct;
    const accuracy = Math.round((correct / TOTAL) * 100);

    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0px_8px_0px_rgba(0,0,0,0.12)] p-6 flex flex-col items-center gap-4 text-center">
          <div className="text-6xl animate-bounce">🏆</div>
          <h2 className="text-2xl font-black text-gray-800">
            {accuracy === 100
              ? "بہت خوب! 🎉"
              : accuracy >= 70
                ? "شاباش! 👍"
                : "کوشش جاری رکھو! 💪"}
          </h2>

          <div className="grid grid-cols-3 gap-3 w-full">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
              <div className="text-2xl font-black text-green-600">
                {correct}
              </div>
              <div className="text-xs font-bold text-green-400">Correct</div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3">
              <div className="text-2xl font-black text-red-500">
                {incorrect}
              </div>
              <div className="text-xs font-bold text-red-400">Wrong</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">
              <div className="text-2xl font-black text-blue-600">{score}</div>
              <div className="text-xs font-bold text-blue-400">Score</div>
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-bold text-gray-500">Accuracy</span>
              <span className="text-xs font-bold text-gray-700">
                {accuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
              <div
                className="h-full bg-green-400 rounded-full transition-all duration-700"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>

          <div className="flex gap-3 w-full mt-1">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm"
            >
              ← Back
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl text-sm shadow-[0px_4px_0px_#1d4ed8] active:translate-y-1 active:shadow-none transition-all"
            >
              🔄 دوبارہ کھیلو
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN GAME ─────────────────────────────────────────────────
  return (
    <div className="w-full flex flex-col items-center px-3 sm:px-6 py-4 gap-4 md:gap-5">
      {/* Progress bar */}
      <div className="w-full max-w-lg">
        <div className="bg-gray-200 h-4 w-full rounded-full border-2 border-gray-300 overflow-hidden">
          <div
            className="bg-green-400 h-full rounded-r-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 px-1">
          <span className="text-xs sm:text-sm font-bold text-blue-600">
            Question {index + 1} / {TOTAL}
          </span>
          <span className="text-xs sm:text-sm font-bold text-yellow-600">
            ⭐ {score}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-black text-gray-800">
          How Many? 🔢
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
          گنو اور صحیح نمبر چنو
        </p>
      </div>

      {/* Emoji grid — objects to count */}
      <div className="w-full max-w-sm">
        <EmojiGrid emoji={current.emoji} count={current.count} />
      </div>

      {/* 4 number choices */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs sm:max-w-sm">
        {current.choices.map((num, i) => (
          <ChoiceBtn
            key={`${index}-${num}`}
            number={num}
            status={choiceStates[i] ?? "idle"}
            onTap={() => handleTap(i)}
            disabled={answeredCorrect}
          />
        ))}
      </div>

      {/* Result dots */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mt-1">
        {results.map((r, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${r ? "bg-green-400" : "bg-red-400"}`}
          />
        ))}
        {index < TOTAL && (
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}
