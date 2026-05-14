import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ FIX 1 — correct imports for both sound files
import correctSoundFile from "@/assets/sounds/correct.mp3";
import wrongSoundFile from "@/assets/sounds/wrong.mp3";

// ─── Types ───────────────────────────────────────────────────
interface LetterData {
  letter: string;
  correct: string;
  options: string[];
}

interface OptionState {
  name: string;
  status: "idle" | "correct" | "wrong";
}

// ─── Image path helper ────────────────────────────────────────
const getImage = (name: string) =>
  `/src/assets/images/games/kg/alphabet/${name}.png`;

// ─── Sound files ──────────────────────────────────────────────
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

// ─── Emoji fallback ───────────────────────────────────────────
const EMOJI_MAP: Record<string, string> = {
  apple: "🍎",
  ant: "🐜",
  arrow: "➡️",
  ball: "⚽",
  bat: "🏏",
  butterfly: "🦋",
  cat: "🐱",
  car: "🚗",
  cow: "🐄",
  dog: "🐶",
  duck: "🦆",
  drum: "🥁",
  egg: "🥚",
  elephant: "🐘",
  eye: "👁️",
  fish: "🐟",
  frog: "🐸",
  fan: "🌀",
  goat: "🐐",
  grapes: "🍇",
  gift: "🎁",
  hat: "🎩",
  horse: "🐴",
  hen: "🐔",
  igloo: "🏠",
  ink: "🖊️",
  island: "🏝️",
  jug: "🫙",
  jar: "🏺",
  jellyfish: "🪼",
  kite: "🪁",
  key: "🔑",
  kangaroo: "🦘",
  lion: "🦁",
  leaf: "🍃",
  lemon: "🍋",
  mango: "🥭",
  moon: "🌙",
  monkey: "🐒",
  nest: "🪺",
  net: "🕸️",
  nose: "👃",
  orange: "🍊",
  owl: "🦉",
  octopus: "🐙",
  pen: "✏️",
  pig: "🐷",
  parrot: "🦜",
  queen: "👑",
  quill: "🪶",
  question: "❓",
  rat: "🐀",
  rabbit: "🐰",
  rose: "🌹",
  sun: "☀️",
  star: "⭐",
  snake: "🐍",
  tree: "🌳",
  tiger: "🐯",
  train: "🚂",
  umbrella: "☂️",
  ufo: "🛸",
  unicorn: "🦄",
  van: "🚐",
  violin: "🎻",
  volcano: "🌋",
  web: "🕸️",
  wolf: "🐺",
  whale: "🐳",
  xray: "🩻",
  xbox: "🎮",
  xmas: "🎄",
  yak: "🐃",
  yarn: "🧶",
  yacht: "⛵",
  zebra: "🦓",
  zoo: "🦁",
  zip: "🤐",
};

// ─── 26 Letters ──────────────────────────────────────────────
const RAW_DATA = [
  { letter: "A", correct: "apple", wrong: ["ball", "cat"] },
  { letter: "B", correct: "ball", wrong: ["cat", "dog"] },
  { letter: "C", correct: "cat", wrong: ["ball", "fish"] },
  { letter: "D", correct: "dog", wrong: ["egg", "fan"] },
  { letter: "E", correct: "egg", wrong: ["dog", "hat"] },
  { letter: "F", correct: "fish", wrong: ["goat", "igloo"] },
  { letter: "G", correct: "goat", wrong: ["hat", "jug"] },
  { letter: "H", correct: "hat", wrong: ["igloo", "kite"] },
  { letter: "I", correct: "igloo", wrong: ["jug", "lion"] },
  { letter: "J", correct: "jug", wrong: ["kite", "mango"] },
  { letter: "K", correct: "kite", wrong: ["lion", "nest"] },
  { letter: "L", correct: "lion", wrong: ["mango", "orange"] },
  { letter: "M", correct: "mango", wrong: ["nest", "pen"] },
  { letter: "N", correct: "nest", wrong: ["orange", "queen"] },
  { letter: "O", correct: "orange", wrong: ["pen", "rat"] },
  { letter: "P", correct: "pen", wrong: ["queen", "sun"] },
  { letter: "Q", correct: "queen", wrong: ["rat", "tree"] },
  { letter: "R", correct: "rat", wrong: ["sun", "umbrella"] },
  { letter: "S", correct: "sun", wrong: ["tree", "van"] },
  { letter: "T", correct: "tree", wrong: ["umbrella", "web"] },
  { letter: "U", correct: "umbrella", wrong: ["van", "xray"] },
  { letter: "V", correct: "van", wrong: ["web", "yak"] },
  { letter: "W", correct: "web", wrong: ["xray", "zebra"] },
  { letter: "X", correct: "xray", wrong: ["yak", "apple"] },
  { letter: "Y", correct: "yak", wrong: ["zebra", "ball"] },
  { letter: "Z", correct: "zebra", wrong: ["apple", "cat"] },
];

// ─── Helpers ─────────────────────────────────────────────────
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const buildQueue = (): LetterData[] =>
  RAW_DATA.map((d) => ({
    letter: d.letter,
    correct: d.correct,
    options: shuffle([d.correct, ...d.wrong]),
  }));

// Speak letter in English
const speakEnglish = (text: string) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
};

// ─── Option Card ──────────────────────────────────────────────
function OptionCard({
  name,
  status,
  onTap,
  disabled,
}: {
  name: string;
  status: "idle" | "correct" | "wrong";
  onTap: () => void;
  disabled: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      onClick={onTap}
      disabled={disabled}
      className={`
        flex flex-col items-center gap-1.5 transition-all duration-150
        ${
          disabled && status === "idle"
            ? "cursor-default opacity-60"
            : disabled
              ? "cursor-default"
              : "cursor-pointer active:translate-y-1"
        }
      `}
    >
      <div
        className={`
        w-full aspect-square rounded-2xl flex items-center justify-center
        relative overflow-hidden border-4 transition-all duration-300
        ${
          status === "correct"
            ? "border-green-400 bg-green-50 shadow-[0px_5px_0px_#16a34a]"
            : status === "wrong"
              ? "border-red-400 bg-red-50 shadow-[0px_5px_0px_#dc2626]"
              : "border-yellow-300 bg-white shadow-[0px_5px_0px_#b45309]"
        }
      `}
      >
        {status === "correct" && (
          <div className="absolute inset-0 bg-green-300/30 flex items-center justify-center z-10">
            <span className="text-3xl">✅</span>
          </div>
        )}
        {status === "wrong" && (
          <div className="absolute inset-0 bg-red-300/30 flex items-center justify-center z-10">
            <span className="text-3xl">❌</span>
          </div>
        )}

        {!imgFailed ? (
          <img
            src={getImage(name)}
            alt={name}
            className="w-3/4 h-3/4 object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-4xl select-none">
            {EMOJI_MAP[name] ?? "❓"}
          </span>
        )}
      </div>

      <span
        className={`
        text-xs font-bold tracking-wide
        ${
          status === "correct"
            ? "text-green-600"
            : status === "wrong"
              ? "text-red-500"
              : "text-gray-500"
        }
      `}
      >
        {cap(name)}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function AlphabetMatch() {
  const navigate = useNavigate();

  const [queue] = useState<LetterData[]>(() => buildQueue());
  const [index, setIndex] = useState(0);
  const [optionStates, setOptionStates] = useState<OptionState[]>([]);
  const [score, setScore] = useState(0);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [answeredWrong, setAnsweredWrong] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const current = queue[index];
  const TOTAL = queue.length;
  const pct = Math.round((index / TOTAL) * 100);

  // Reset when question changes
  useEffect(() => {
    if (!current) return;
    setOptionStates(current.options.map((n) => ({ name: n, status: "idle" })));
    setAnsweredCorrect(false);
    setAnsweredWrong(false);
  }, [index]);

  // Speak letter when question loads
  useEffect(() => {
    if (current) speakEnglish(current.letter);
  }, [index]);

  // ── Handle tap ────────────────────────────────────────────
  const handleTap = (i: number) => {
    if (answeredCorrect) return;

    const tapped = optionStates[i].name;
    const isCorrect = tapped === current.correct;

    if (isCorrect) {
      // ── Correct ─────────────────────────────────────────
      setOptionStates((prev) =>
        prev.map((opt) =>
          opt.name === current.correct ? { ...opt, status: "correct" } : opt,
        ),
      );
      setAnsweredCorrect(true);
      setAnsweredWrong(false);
      setScore((s) => s + 10);

      // ✅ FIX 2 — play correct.mp3 on correct answer
      playCorrect();

      // Move to next after 1.8s
      setTimeout(() => {
        setResults((r) => [...r, true]);
        if (index + 1 >= TOTAL) setGameOver(true);
        else setIndex((prev) => prev + 1);
      }, 1800);
    } else {
      // ── Wrong ────────────────────────────────────────────
      setOptionStates((prev) =>
        prev.map((opt, idx) => (idx === i ? { ...opt, status: "wrong" } : opt)),
      );
      setAnsweredWrong(true);

      // ✅ FIX 2 — play wrong.mp3 on wrong answer
      playWrong();

      // Reset wrong card after 1.2s so kid can try again
      setTimeout(() => {
        setOptionStates((prev) =>
          prev.map((opt, idx) =>
            idx === i ? { ...opt, status: "idle" } : opt,
          ),
        );
        setAnsweredWrong(false);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setResults([]);
    setGameOver(false);
    setAnsweredCorrect(false);
    setAnsweredWrong(false);
  };

  // ── GAME OVER ────────────────────────────────────────────
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

  // ── MAIN GAME ────────────────────────────────────────────
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
            Letter {index + 1} / {TOTAL}
          </span>
          <span className="text-xs sm:text-sm font-bold text-yellow-600">
            ⭐ {score}
          </span>
        </div>
      </div>

      {/* Letter card */}
      <div className="relative">
        <div className="w-32 h-40 sm:w-40 sm:h-52 bg-white border-4 border-blue-500 rounded-[2rem] flex items-center justify-center shadow-[0px_8px_0px_rgba(0,0,0,0.15)] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent" />
          <span className="text-7xl sm:text-8xl font-black text-blue-600 select-none leading-none z-10">
            {current.letter}
          </span>
        </div>

        {/* Speaker button */}
        <button
          onClick={() => speakEnglish(current.letter)}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-base z-20 hover:bg-blue-600 active:scale-90 transition-all"
        >
          🔊
        </button>

        {/* Mascot */}
        <div className="absolute -bottom-2 -right-12 sm:-right-16 pointer-events-none">
          <span className="text-5xl sm:text-6xl animate-bounce select-none block">
            👧
          </span>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center mt-5 sm:mt-3 px-4">
        <h2 className="text-base sm:text-xl font-black text-gray-800 mb-1">
          Find the matching item!
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          وہ تصویر چُنو جو '{current.letter}' سے شروع ہو
        </p>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md px-2">
        {optionStates.map((opt, i) => (
          <OptionCard
            key={`${index}-${opt.name}`}
            name={opt.name}
            status={opt.status}
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
