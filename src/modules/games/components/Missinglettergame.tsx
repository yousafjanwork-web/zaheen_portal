import { useState, useEffect, useCallback } from "react";
import correctSoundFile from "@/assets/sounds/correct.mp3";
import wrongSoundFile from "@/assets/sounds/wrong.mp3";

// ─── Audio ─────────────────────────────────────────────────────
const correctAudio = new Audio(correctSoundFile);
const wrongAudio = new Audio(wrongSoundFile);
const playCorrect = () => {
  correctAudio.currentTime = 0;
  correctAudio.play().catch(() => {});
};
const playWrong = () => {
  wrongAudio.currentTime = 0;
  wrongAudio.play().catch(() => {});
};

const speak = (word: string) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.rate = 0.85;
  u.pitch = 1.1;
  u.lang = "en-US";
  window.speechSynthesis.speak(u);
};

// ─── Types ─────────────────────────────────────────────────────
interface MLQuestion {
  id: number;
  emoji: string;
  item: string;
  template: string;
  answer: string;
  options: string[];
  image: string;
}

// ─── 30 Questions ──────────────────────────────────────────────
const ALL_QUESTIONS: MLQuestion[] = [
  {
    id: 1,
    emoji: "🐱",
    item: "cat",
    template: "c_t",
    answer: "a",
    options: ["a", "e", "i", "o", "u", "b"],
    image: "/src/assets/images/games/class1/cat.png",
  },
  {
    id: 2,
    emoji: "🐶",
    item: "dog",
    template: "d_g",
    answer: "o",
    options: ["a", "e", "i", "o", "u", "g"],
    image: "/src/assets/images/games/class1/dog.png",
  },
  {
    id: 3,
    emoji: "🦇",
    item: "bat",
    template: "b_t",
    answer: "a",
    options: ["a", "e", "i", "o", "u", "n"],
    image: "/src/assets/images/games/class1/bat.png",
  },
  {
    id: 4,
    emoji: "☀️",
    item: "sun",
    template: "s_n",
    answer: "u",
    options: ["a", "e", "i", "o", "u", "s"],
    image: "/src/assets/images/games/class1/sun.png",
  },
  {
    id: 5,
    emoji: "🍵",
    item: "cup",
    template: "c_p",
    answer: "u",
    options: ["a", "e", "i", "o", "u", "c"],
    image: "/src/assets/images/games/class1/cup.png",
  },
  {
    id: 6,
    emoji: "🚌",
    item: "bus",
    template: "b_s",
    answer: "u",
    options: ["a", "e", "i", "o", "u", "t"],
    image: "/src/assets/images/games/class1/bus.png",
  },
  {
    id: 7,
    emoji: "🎩",
    item: "hat",
    template: "h_t",
    answer: "a",
    options: ["a", "e", "i", "o", "u", "h"],
    image: "/src/assets/images/games/class1/hat.png",
  },
  {
    id: 8,
    emoji: "🛏️",
    item: "bed",
    template: "b_d",
    answer: "e",
    options: ["a", "e", "i", "o", "u", "d"],
    image: "/src/assets/images/games/class1/bed.png",
  },
  {
    id: 9,
    emoji: "🐞",
    item: "bug",
    template: "b_g",
    answer: "u",
    options: ["a", "e", "i", "o", "u", "g"],
    image: "/src/assets/images/games/class1/bug.png",
  },
  {
    id: 10,
    emoji: "🐔",
    item: "hen",
    template: "h_n",
    answer: "e",
    options: ["a", "e", "i", "o", "u", "n"],
    image: "/src/assets/images/games/class1/hen.png",
  },
  {
    id: 11,
    emoji: "🐷",
    item: "pig",
    template: "p_g",
    answer: "i",
    options: ["a", "e", "i", "o", "u", "p"],
    image: "/src/assets/images/games/class1/pig.png",
  },
  {
    id: 12,
    emoji: "📦",
    item: "box",
    template: "b_x",
    answer: "o",
    options: ["a", "e", "i", "o", "u", "x"],
    image: "/src/assets/images/games/class1/box.png",
  },
  {
    id: 13,
    emoji: "🦊",
    item: "fox",
    template: "f_x",
    answer: "o",
    options: ["a", "e", "i", "o", "u", "f"],
    image: "/src/assets/images/games/class1/fox.png",
  },
  {
    id: 14,
    emoji: "🧴",
    item: "jug",
    template: "j_g",
    answer: "u",
    options: ["a", "e", "i", "o", "u", "j"],
    image: "/src/assets/images/games/class1/jug.png",
  },
  {
    id: 15,
    emoji: "🥅",
    item: "net",
    template: "n_t",
    answer: "e",
    options: ["a", "e", "i", "o", "u", "t"],
    image: "/src/assets/images/games/class1/net.png",
  },
  {
    id: 16,
    emoji: "🫕",
    item: "pot",
    template: "p_t",
    answer: "o",
    options: ["a", "e", "i", "o", "u", "p"],
    image: "/src/assets/images/games/class1/pot.png",
  },
  {
    id: 17,
    emoji: "🐟",
    item: "fish",
    template: "f_sh",
    answer: "i",
    options: ["a", "e", "i", "o", "u", "f"],
    image: "/src/assets/images/games/class1/fish.png",
  },
  {
    id: 18,
    emoji: "🐸",
    item: "frog",
    template: "fr_g",
    answer: "o",
    options: ["a", "e", "i", "o", "u", "r"],
    image: "/src/assets/images/games/class1/frog.png",
  },
  {
    id: 19,
    emoji: "🌹",
    item: "rose",
    template: "r_se",
    answer: "o",
    options: ["a", "e", "i", "o", "u", "r"],
    image: "/src/assets/images/games/class1/rose.png",
  },
  {
    id: 20,
    emoji: "🥛",
    item: "milk",
    template: "m_lk",
    answer: "i",
    options: ["a", "e", "i", "o", "u", "m"],
    image: "/src/assets/images/games/class1/milk.png",
  },
  {
    id: 21,
    emoji: "☁️",
    item: "cloud",
    template: "cl__d",
    answer: "ou",
    options: ["o", "u", "a", "e", "i", "y"],
    image: "/src/assets/images/games/class1/cloud.png",
  },
  {
    id: 22,
    emoji: "🌧️",
    item: "rain",
    template: "r__n",
    answer: "ai",
    options: ["a", "i", "o", "e", "u", "y"],
    image: "/src/assets/images/games/class1/rain.png",
  },
  {
    id: 23,
    emoji: "⛵",
    item: "boat",
    template: "b__t",
    answer: "oa",
    options: ["o", "a", "e", "i", "u", "y"],
    image: "/src/assets/images/games/class1/boat.png",
  },
  {
    id: 24,
    emoji: "🚂",
    item: "train",
    template: "tr__n",
    answer: "ai",
    options: ["a", "i", "o", "e", "u", "y"],
    image: "/src/assets/images/games/class1/train.png",
  },
  {
    id: 25,
    emoji: "🌿",
    item: "green",
    template: "gr__n",
    answer: "ee",
    options: ["e", "a", "i", "o", "u", "y"],
    image: "/src/assets/images/games/class1/green.png",
  },
  {
    id: 26,
    emoji: "🍞",
    item: "bread",
    template: "br__d",
    answer: "ea",
    options: ["e", "a", "i", "o", "u", "y"],
    image: "/src/assets/images/games/class1/bread.png",
  },
  {
    id: 27,
    emoji: "🌕",
    item: "moon",
    template: "m__n",
    answer: "oo",
    options: ["o", "a", "e", "i", "u", "y"],
    image: "/src/assets/images/games/class1/moon.png",
  },
  {
    id: 28,
    emoji: "🐑",
    item: "sheep",
    template: "sh__p",
    answer: "ee",
    options: ["e", "a", "i", "o", "u", "y"],
    image: "/src/assets/images/games/class1/sheep.png",
  },
  {
    id: 29,
    emoji: "🪑",
    item: "chair",
    template: "ch__r",
    answer: "ai",
    options: ["a", "i", "o", "e", "u", "y"],
    image: "/src/assets/images/games/class1/chair.png",
  },
  {
    id: 30,
    emoji: "🦷",
    item: "tooth",
    template: "t__th",
    answer: "oo",
    options: ["o", "a", "e", "i", "u", "y"],
    image: "/src/assets/images/games/class1/tooth.png",
  },
];

// ─── Helpers ───────────────────────────────────────────────────
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const TOTAL = 10;
const NAVY = "#2c3585";

// Toggle flag to switch rendering engine between Emojis and Images
const USE_CUSTOM_IMAGES = true;

// ─── Word display with blanks ──────────────────────────────────
function WordDisplay({
  template,
  filled,
  status,
}: {
  template: string;
  filled: string[];
  status: "playing" | "correct" | "wrong";
}) {
  let blankIdx = 0;

  return (
    <div className="flex items-end justify-center gap-0.5 flex-wrap">
      {template.split("").map((char, i) => {
        if (char === "_") {
          const letter = filled[blankIdx] ?? "";
          blankIdx++;
          return (
            <span
              key={`b${i}`}
              className="inline-flex items-end justify-center font-black"
              style={{
                fontSize: "clamp(2rem, 9vw, 3rem)",
                minWidth: "clamp(1.6rem, 7vw, 2.6rem)",
                lineHeight: 1,
                color:
                  status === "correct"
                    ? "#16a34a"
                    : status === "wrong"
                      ? "#ef4444"
                      : letter
                        ? NAVY
                        : "#ef4444",
              }}
            >
              {letter || "_"}
            </span>
          );
        }
        return (
          <span
            key={`c${i}`}
            className="inline-flex items-end justify-center font-black text-gray-900"
            style={{
              fontSize: "clamp(2rem, 9vw, 3rem)",
              minWidth: "clamp(1.2rem, 5vw, 1.8rem)",
              lineHeight: 1,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

// ─── Letter Circle ─────────────────────────────────────────────
function LetterCircle({
  letter,
  onClick,
  isSelected,
  disabled,
}: {
  letter: string;
  onClick: () => void;
  isSelected: boolean;
  disabled: boolean;
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`
        rounded-full flex items-center justify-center font-black
        transition-all duration-150 select-none text-xl
        ${
          isSelected
            ? "text-white scale-105"
            : disabled
              ? "bg-gray-50 text-gray-300 cursor-default"
              : "bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 active:scale-90 cursor-pointer"
        }
      `}
      style={{
        width: "clamp(44px, 11vw, 54px)",
        height: "clamp(44px, 11vw, 54px)",
        border: isSelected ? `2.5px solid ${NAVY}` : "2px dashed #9ca3af",
        background: isSelected ? NAVY : undefined,
      }}
    >
      {letter}
    </button>
  );
}

// ─── Result Card ───────────────────────────────────────────────
function ResultCard({
  results,
  score,
  onRestart,
}: {
  results: boolean[];
  score: number;
  onRestart: () => void;
}) {
  const correct = results.filter(Boolean).length;
  const wrong = results.length - correct;
  const accuracy = Math.round((correct / TOTAL) * 100);

  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-[0px_8px_0px_rgba(0,0,0,0.12)] overflow-hidden">
        <div className="py-6 text-center" style={{ background: NAVY }}>
          <div className="text-5xl mb-2">
            {accuracy === 100 ? "🏆" : accuracy >= 70 ? "🌟" : "📚"}
          </div>
          <h2 className="text-xl font-black text-white">
            {accuracy === 100
              ? "Perfect Score!"
              : accuracy >= 70
                ? "Well Done!"
                : "Keep Practicing!"}
          </h2>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-green-600">
                {correct}
              </div>
              <div className="text-xs font-bold text-green-400">Correct</div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-red-500">{wrong}</div>
              <div className="text-xs font-bold text-red-400">Wrong</div>
            </div>
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-indigo-600">{score}</div>
              <div className="text-xs font-bold text-indigo-400">Score</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
              <span>Accuracy</span>
              <span>{accuracy}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${accuracy}%`,
                  background: accuracy >= 70 ? "#4ade80" : "#f87171",
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {results.map((r, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${r ? "bg-green-400" : "bg-red-400"}`}
              >
                {r ? "✓" : "✗"}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-2xl text-sm"
            >
              ← Back
            </button>
            <button
              onClick={onRestart}
              className="flex-1 py-3 text-white font-black rounded-2xl text-sm active:translate-y-0.5 transition-all"
              style={{ background: NAVY, boxShadow: "0px 4px 0px #1a2460" }}
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Game ─────────────────────────────────────────────────
export default function MissingLetterGame() {
  const [questions] = useState(() => shuffle(ALL_QUESTIONS).slice(0, TOTAL));
  const [qIdx, setQIdx] = useState(0);
  const [filled, setFilled] = useState<string[]>([]); // letters tapped so far
  const [status, setStatus] = useState<"playing" | "correct" | "wrong">(
    "playing",
  );
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const q = questions[qIdx];
  const blanks = (q.template.match(/_/g) || []).length; // how many blanks
  const pct = Math.round((qIdx / TOTAL) * 100);

  // ── Move to next question ─────────────────────────────────
  const goNext = useCallback(
    (wasCorrect: boolean) => {
      setResults((r) => [...r, wasCorrect]);
      if (qIdx + 1 >= TOTAL) {
        setGameOver(true);
      } else {
        setQIdx((i) => i + 1);
        setFilled([]);
        setStatus("playing");
      }
    },
    [qIdx],
  );

  // ── Handle letter circle tap ──────────────────────────────
  const handleLetter = useCallback(
    (letter: string) => {
      if (status !== "playing") return;
      if (filled.length >= blanks) return; // all blanks already filled
      setFilled((prev) => [...prev, letter]);
    },
    [status, filled, blanks],
  );

  // ── Remove last filled letter (backspace) ─────────────────
  const handleClear = () => {
    if (status !== "playing") return;
    setFilled((prev) => prev.slice(0, -1));
  };

  // ── Check answer button ───────────────────────────
  const handleCheck = () => {
    if (filled.length < blanks) return; // not all blanks filled
    const attempt = filled.join("");
    if (attempt === q.answer) {
      setStatus("correct");
      setScore((s) => s + 10);
      playCorrect();
      speak(q.item);
      setTimeout(() => goNext(true), 1500);
    } else {
      setStatus("wrong");
      playWrong();
      setTimeout(() => {
        setFilled([]);
        setStatus("playing");
      }, 900);
    }
  };

  // ── Skip ───────────────────────────
  const handleSkip = () => {
    setResults((r) => [...r, false]);
    if (qIdx + 1 >= TOTAL) {
      setGameOver(true);
    } else {
      setQIdx((i) => i + 1);
      setFilled([]);
      setStatus("playing");
    }
  };

  // ── Keyboard support ─────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        handleClear();
        return;
      }
      if (e.key === "Enter") {
        handleCheck();
        return;
      }
      if (/^[a-zA-Z]$/.test(e.key)) handleLetter(e.key.toLowerCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleLetter, handleCheck]);

  const handleRestart = () => {
    setQIdx(0);
    setFilled([]);
    setStatus("playing");
    setScore(0);
    setResults([]);
    setGameOver(false);
  };

  if (gameOver)
    return (
      <ResultCard results={results} score={score} onRestart={handleRestart} />
    );

  const leftOptions = q.options.slice(0, 3);
  const rightOptions = q.options.slice(3, 6);

  return (
    <div
      className="w-full flex flex-col items-center px-3 sm:px-5 py-4 gap-4"
      style={{ fontFamily: "'Nunito','Quicksand',sans-serif" }}
    >
      {/* ── Progress + score row ── */}
      <div className="w-full max-w-lg flex items-center gap-3">
        <span className="text-sm font-black text-indigo-600 whitespace-nowrap">
          ⭐ {score}
        </span>
        <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden border border-gray-300">
          <div
            className="h-full rounded-r-full transition-all duration-500"
            style={{ width: `${pct}%`, background: NAVY }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
          {qIdx + 1}/{TOTAL}
        </span>
      </div>

      {/* ── Result dots ── */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {results.map((r, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${r ? "bg-green-400" : "bg-red-400"}`}
          />
        ))}
        {qIdx < TOTAL && (
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
        )}
      </div>

      {/* ══════════ MAIN CARD ══════════ */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-[0px_6px_0px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        {/* Card header */}
        <div
          className="py-3 px-5 text-center font-black text-sm tracking-widest uppercase text-white"
          style={{ background: NAVY }}
        >
          Add Missed Letters
        </div>

        {/* 3-column: left letters | image | right letters */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 px-4 py-6">
          {/* Left 3 circles */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            {leftOptions.map((letter, i) => (
              <LetterCircle
                key={`L${i}`}
                letter={letter}
                onClick={() => handleLetter(letter)}
                isSelected={
                  filled.includes(letter) && filled.indexOf(letter) < blanks
                }
                disabled={status !== "playing"}
              />
            ))}
          </div>

          {/* Centre image — tap to hear word */}
          <div className="flex-1 flex items-center justify-center">
            <button
              onClick={() => speak(q.item)}
              className="flex items-center justify-center rounded-2xl overflow-hidden
                         active:scale-95 hover:scale-105 transition-transform bg-indigo-50"
              style={{
                border: `4px solid ${NAVY}`,
                width: "clamp(130px, 38vw, 200px)",
                height: "clamp(130px, 38vw, 200px)",
              }}
              title={`Tap to hear: ${q.item}`}
            >
              {USE_CUSTOM_IMAGES ? (
                <img
                  src={q.image}
                  alt={q.item}
                  className="w-full h-full object-contain p-3 pointer-events-none"
                  onError={(e) => {
                    // Fallback to emoji if file isn't found
                    e.currentTarget.style.display = "none";
                    const nextSib = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (nextSib) nextSib.style.display = "block";
                  }}
                />
              ) : null}

              <span
                className="pointer-events-none select-none"
                style={{
                  fontSize: "clamp(4rem, 15vw, 6rem)",
                  display: USE_CUSTOM_IMAGES ? "none" : "block",
                }}
              >
                {q.emoji}
              </span>
            </button>
          </div>

          {/* Right 3 circles */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            {rightOptions.map((letter, i) => (
              <LetterCircle
                key={`R${i}`}
                letter={letter}
                onClick={() => handleLetter(letter)}
                isSelected={
                  filled.includes(letter) && filled.indexOf(letter) < blanks
                }
                disabled={status !== "playing"}
              />
            ))}
          </div>
        </div>

        {/* Word display */}
        <div className="px-4 pb-4 flex flex-col items-center gap-1">
          <WordDisplay template={q.template} filled={filled} status={status} />

          {/* Filled count hint */}
          <p className="text-xs text-gray-400 font-bold mt-1">
            {filled.length}/{blanks} letter{blanks > 1 ? "s" : ""} filled
          </p>
        </div>

        {/* Feedback message */}
        <div className="h-7 flex items-center justify-center px-4">
          {status === "correct" && (
            <span className="text-green-600 font-black text-sm animate-bounce">
              ✅ Correct! Well done!
            </span>
          )}
          {status === "wrong" && (
            <span className="text-red-500 font-black text-sm">
              ❌ Not quite — try again!
            </span>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="px-4 pb-5 flex gap-3">
          {/* Clear last letter */}
          <button
            onClick={handleClear}
            disabled={filled.length === 0 || status !== "playing"}
            className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl text-sm
                       disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
          >
            ⌫ Clear
          </button>

          {/* Check Answer */}
          <button
            onClick={handleCheck}
            disabled={filled.length < blanks || status !== "playing"}
            className="flex-1 py-2.5 text-white font-black rounded-xl text-sm transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-0.5"
            style={{
              background: NAVY,
              boxShadow:
                filled.length < blanks ? "none" : "0px 4px 0px #1a2460",
            }}
          >
            ✓ Check Answer
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            disabled={status !== "playing"}
            className="px-4 py-2.5 bg-rose-50 text-rose-500 font-bold rounded-xl text-sm border border-rose-100
                       hover:bg-rose-100 transition-all disabled:opacity-40"
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}
