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

<<<<<<< HEAD
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
=======
// ---------- Difficulty ----------
const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
type Difficulty = (typeof DIFFICULTY_LEVELS)[number];

const QUESTIONS_PER_LEVEL = 3; // show 3 questions per level
const CORRECT_TO_ADVANCE = 3; // must get 3 correct to advance

// ---------- Static Word Bank ----------
// 100 words split by difficulty
const WORD_BANK: Record<Difficulty, Word[]> = {
  easy: [
    { word: "CAT", hint: "🐱" },
    { word: "DOG", hint: "🐶" },
    { word: "SUN", hint: "☀️" },
    { word: "BUS", hint: "🚌" },
    { word: "CUP", hint: "☕" },
    { word: "HAT", hint: "🎩" },
    { word: "EGG", hint: "🥚" },
    { word: "BAG", hint: "👜" },
    { word: "BED", hint: "🛏️" },
    { word: "BOX", hint: "📦" },
    { word: "FAN", hint: "🌀" },
    { word: "JAR", hint: "🫙" },
    { word: "KEY", hint: "🔑" },
    { word: "LEG", hint: "🦵" },
    { word: "NET", hint: "🕸️" },
    { word: "OWL", hint: "🦉" },
    { word: "PIG", hint: "🐷" },
    { word: "RAT", hint: "🐀" },
    { word: "VAN", hint: "🚐" },
    { word: "BALL", hint: "⚽" },
    { word: "BIRD", hint: "🐦" },
    { word: "BOAT", hint: "⛵" },
    { word: "BOOK", hint: "📚" },
    { word: "CAKE", hint: "🍰" },
    { word: "CRAB", hint: "🦀" },
    { word: "DOOR", hint: "🚪" },
    { word: "DUCK", hint: "🦆" },
    { word: "FIRE", hint: "🔥" },
    { word: "FISH", hint: "🐟" },
    { word: "FROG", hint: "🐸" },
    { word: "LION", hint: "🦁" },
    { word: "MILK", hint: "🥛" },
    { word: "MOON", hint: "🌙" },
    { word: "RAIN", hint: "🌧️" },
    { word: "ROSE", hint: "🌹" },
    { word: "SHIP", hint: "🚢" },
    { word: "SHOE", hint: "👟" },
    { word: "STAR", hint: "⭐" },
    { word: "TREE", hint: "🌳" },
    { word: "MAP", hint: "🗺️" },
  ],
  medium: [
    { word: "APPLE", hint: "🍎" },
    { word: "BEACH", hint: "🏖️" },
    { word: "BREAD", hint: "🍞" },
    { word: "BRUSH", hint: "🪥" },
    { word: "CANDY", hint: "🍬" },
    { word: "CHAIR", hint: "🪑" },
    { word: "CHESS", hint: "♟️" },
    { word: "CLOCK", hint: "🕐" },
    { word: "CLOUD", hint: "☁️" },
    { word: "COMET", hint: "☄️" },
    { word: "CORAL", hint: "🪸" },
    { word: "CRANE", hint: "🏗️" },
    { word: "CROWN", hint: "👑" },
    { word: "EAGLE", hint: "🦅" },
    { word: "FLAME", hint: "🕯️" },
    { word: "GHOST", hint: "👻" },
    { word: "GLOBE", hint: "🌍" },
    { word: "GRAPE", hint: "🍇" },
    { word: "GRASS", hint: "🌿" },
    { word: "HEART", hint: "❤️" },
    { word: "HORSE", hint: "🐴" },
    { word: "HOUSE", hint: "🏠" },
    { word: "KNIFE", hint: "🔪" },
    { word: "LEMON", hint: "🍋" },
    { word: "LIGHT", hint: "💡" },
    { word: "MANGO", hint: "🥭" },
    { word: "MONEY", hint: "💰" },
    { word: "MOUSE", hint: "🖱️" },
    { word: "MUSIC", hint: "🎵" },
    { word: "OCEAN", hint: "🌊" },
    { word: "ONION", hint: "🧅" },
    { word: "PAINT", hint: "🎨" },
    { word: "PIZZA", hint: "🍕" },
    { word: "PLANT", hint: "🪴" },
    { word: "ROBOT", hint: "🤖" },
    { word: "SNAKE", hint: "🐍" },
    { word: "STORM", hint: "⛈️" },
    { word: "SWORD", hint: "⚔️" },
    { word: "TIGER", hint: "🐯" },
    { word: "PEARL", hint: "🫧" },
  ],
  hard: [
    { word: "BANANA", hint: "🍌" },
    { word: "BRIDGE", hint: "🌉" },
    { word: "BUTTER", hint: "🧈" },
    { word: "CAMERA", hint: "📷" },
    { word: "CASTLE", hint: "🏰" },
    { word: "CHERRY", hint: "🍒" },
    { word: "COFFEE", hint: "☕" },
    { word: "DESERT", hint: "🏜️" },
    { word: "DRAGON", hint: "🐉" },
    { word: "FLOWER", hint: "🌸" },
    { word: "FOREST", hint: "🌲" },
    { word: "GUITAR", hint: "🎸" },
    { word: "HELMET", hint: "⛑️" },
    { word: "ISLAND", hint: "🏝️" },
    { word: "JACKET", hint: "🧥" },
    { word: "MIRROR", hint: "🪞" },
    { word: "MONKEY", hint: "🐒" },
    { word: "NEEDLE", hint: "🪡" },
    { word: "ORANGE", hint: "🍊" },
    { word: "PARROT", hint: "🦜" },
    { word: "PENCIL", hint: "✏️" },
    { word: "PLANET", hint: "🪐" },
    { word: "POTATO", hint: "🥔" },
    { word: "RABBIT", hint: "🐰" },
    { word: "ROCKET", hint: "🚀" },
    { word: "SAFARI", hint: "🦒" },
    { word: "SCHOOL", hint: "🏫" },
    { word: "SHIELD", hint: "🛡️" },
    { word: "SPIDER", hint: "🕷️" },
    { word: "STATUE", hint: "🗽" },
    { word: "TOMATO", hint: "🍅" },
    { word: "TROPHY", hint: "🏆" },
    { word: "TURTLE", hint: "🐢" },
    { word: "VIOLIN", hint: "🎻" },
    { word: "WALLET", hint: "👛" },
    { word: "WINDOW", hint: "🪟" },
    { word: "WIZARD", hint: "🧙" },
    { word: "BUTTER", hint: "🧈" },
    { word: "CANDLE", hint: "🕯️" },
    { word: "PILLOW", hint: "🛏️" },
  ],
};

// ---------- Speech ----------
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
const speakWord = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

<<<<<<< HEAD
=======
// ---------- Helpers ----------
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Pick random words from a difficulty pool
function pickWords(difficulty: Difficulty, count: number): Word[] {
  return shuffle(WORD_BANK[difficulty]).slice(0, count);
}

>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD

=======
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD

=======
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD

=======
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
  const [queue, setQueue] = useState<Word[]>(() => pickWords(TOTAL_QUESTIONS));
=======
  const [currentDifficulty, setCurrentDifficulty] =
    useState<Difficulty>("easy");
  const [queue, setQueue] = useState<Word[]>(() =>
    pickWords("easy", QUESTIONS_PER_LEVEL),
  );
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  const [qIndex, setQIndex] = useState<number>(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [feedback, setFeedback] = useState<FeedbackState>({
    msg: "",
    type: null,
  });
  const [score, setScore] = useState<number>(0);
<<<<<<< HEAD
  const [tryCount, setTryCount] = useState<number>(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
=======
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [levelComplete, setLevelComplete] = useState<boolean>(false);
  const [correctInLevel, setCorrectInLevel] = useState<number>(0);

  // ✅ One retry tracking — false = first attempt, true = already retried once
  const [hasRetried, setHasRetried] = useState<boolean>(false);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0

  const current: Word = queue[qIndex];

  const loadNewWord = (): void => {
<<<<<<< HEAD
    setLetters([...current.word].sort(() => Math.random() - 0.5));
    setAnswer("");
    setFeedback({ msg: "", type: null });
    setTryCount(0);
    // Auto-speak the word when it loads
=======
    if (!current) return;
    setLetters([...current.word].sort(() => Math.random() - 0.5));
    setAnswer("");
    setFeedback({ msg: "", type: null });
    setHasRetried(false);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
    speakWord(current.word);
  };

  useEffect(() => {
    if (current) loadNewWord();
  }, [qIndex, queue]);

<<<<<<< HEAD
  const nextQuestion = (wasCorrect: boolean): void => {
    setResults((r) => [...r, wasCorrect]);
    const next = qIndex + 1;
    if (next >= TOTAL_QUESTIONS) setGameOver(true);
    else setQIndex(next);
  };

  const checkAnswer = (): void => {
    if (answer === current.word) {
=======
  // ── Advance difficulty or end game ───────────────────────
  const advanceDifficulty = (): void => {
    const currentIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty);
    const nextLevel = DIFFICULTY_LEVELS[currentIndex + 1];

    if (nextLevel) {
      setLevelComplete(true);
      setTimeout(() => {
        setLevelComplete(false);
        setCurrentDifficulty(nextLevel);
        // Load fresh words for the new difficulty
        setQueue(pickWords(nextLevel, QUESTIONS_PER_LEVEL));
        setQIndex(0);
        setCorrectInLevel(0);
      }, 2000);
    } else {
      setGameOver(true);
    }
  };

  // ── Move to next question ─────────────────────────────────
  const nextQuestion = (wasCorrect: boolean): void => {
    setResults((r) => [...r, wasCorrect]);
    const next = qIndex + 1;

    if (wasCorrect) {
      const newCorrectCount = correctInLevel + 1;
      setCorrectInLevel(newCorrectCount);

      // Advance if got CORRECT_TO_ADVANCE correct answers
      if (newCorrectCount >= CORRECT_TO_ADVANCE) {
        advanceDifficulty();
        return;
      }
    }

    if (next >= queue.length) {
      // ✅ Not enough correct — show 3 fresh words of same difficulty
      setQueue(pickWords(currentDifficulty, QUESTIONS_PER_LEVEL));
      setQIndex(0);
    } else {
      setQIndex(next);
    }
  };

  // ── Check answer ──────────────────────────────────────────
  const checkAnswer = (): void => {
    if (answer === current.word) {
      // ✅ Correct
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      setFeedback({ msg: "✨ Brilliant!", type: "success" });
      setScore((s) => s + 10);
      setTimeout(() => nextQuestion(true), 1500);
    } else {
<<<<<<< HEAD
      const newTry = tryCount + 1;
      setTryCount(newTry);
      if (newTry >= 2) {
        setFeedback({ msg: `❌ Answer: ${current.word}`, type: "error" });
        setTimeout(() => nextQuestion(false), 1800);
      } else {
        setFeedback({ msg: "❌ Try again!", type: "error" });
=======
      if (!hasRetried) {
        // ✅ First wrong attempt — allow ONE retry
        setFeedback({ msg: "❌ Try again!", type: "error" });
        setHasRetried(true);
      } else {
        // ✅ Second wrong attempt — mark incorrect and move on
        setFeedback({ msg: `❌ Answer: ${current.word}`, type: "error" });
        setTimeout(() => nextQuestion(false), 1800);
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      }
    }
  };

  const handleRestart = (): void => {
<<<<<<< HEAD
    setQueue(pickWords(TOTAL_QUESTIONS));
    setQIndex(0);
    setScore(0);
    setResults([]);
    setGameOver(false);
  };

=======
    setCurrentDifficulty("easy");
    setCorrectInLevel(0);
    setScore(0);
    setResults([]);
    setGameOver(false);
    setLevelComplete(false);
    setHasRetried(false);
    setQueue(pickWords("easy", QUESTIONS_PER_LEVEL));
    setQIndex(0);
  };

  // ── Level complete screen ─────────────────────────────────
  if (levelComplete) {
    const nextIndex = DIFFICULTY_LEVELS.indexOf(currentDifficulty) + 1;
    const nextLevel = DIFFICULTY_LEVELS[nextIndex];
    return (
      <div className="min-h-500px w-full flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl px-6 py-8 flex flex-col items-center text-center gap-4">
          <div className="text-6xl animate-bounce">🎉</div>
          <h2 className="text-xl font-black text-green-600">Level Complete!</h2>
          <p className="text-sm text-slate-500">
            You got {CORRECT_TO_ADVANCE} correct on{" "}
            <span className="font-black text-indigo-600 uppercase">
              {currentDifficulty}
            </span>
          </p>
          {nextLevel && (
            <div className="bg-indigo-50 rounded-xl px-4 py-3 w-full">
              <p className="text-xs font-black text-indigo-600 uppercase">
                Next Level → {nextLevel}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
  if (gameOver) {
    return (
      <ResultCard
        score={score}
        correct={results.filter(Boolean).length}
        incorrect={results.filter((r) => !r).length}
<<<<<<< HEAD
        total={TOTAL_QUESTIONS}
=======
        total={results.length}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        onRestart={handleRestart}
        onBack={handleRestart}
      />
    );
  }

<<<<<<< HEAD
  return (
    <div className="min-h-500px w-full flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
      {/* Main Game Card */}
=======
  const difficultyColor = {
    easy: "bg-green-100 text-green-600",
    medium: "bg-yellow-100 text-yellow-600",
    hard: "bg-red-100 text-red-600",
  };

  return (
    <div className="min-h-500px w-full flex flex-col items-center justify-center p-4 font-sans overflow-hidden">
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border-b-4 border-slate-200 px-4 py-5 flex flex-col gap-3 relative">
        {/* Header */}
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span className="bg-indigo-50 text-indigo-500 px-2 py-1 rounded">
<<<<<<< HEAD
            Q {qIndex + 1}/{TOTAL_QUESTIONS}
=======
            Q {qIndex + 1}/{queue.length}
          </span>
          <span
            className={`px-2 py-1 rounded text-[10px] font-black uppercase ${difficultyColor[currentDifficulty]}`}
          >
            {currentDifficulty}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
          </span>
          <span>Score: {score}</span>
        </div>

<<<<<<< HEAD
        {/* Speaker Icon (Hidden if feedback is active to prevent overlapping sounds) */}
=======
        {/* Level progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(correctInLevel / CORRECT_TO_ADVANCE) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-400 text-center font-bold">
          {correctInLevel}/{CORRECT_TO_ADVANCE} correct to advance
        </p>

        {/* Speaker button */}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
        <button
          onClick={() => speakWord(current.word)}
          className="absolute top-14 right-6 w-9 h-9 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-lg hover:bg-indigo-100 active:scale-90 transition-all"
        >
          🔊
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1">
<<<<<<< HEAD
          {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i < results.length ? (results[i] ? "bg-green-400" : "bg-red-400") : i === qIndex ? "bg-indigo-500" : "bg-slate-200"}`}
            />
          ))}
=======
          {results.map((r, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${r ? "bg-green-400" : "bg-red-400"}`}
            />
          ))}
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
              className={`w-8 h-10 border-b-4 flex items-center justify-center text-2xl font-black ${answer[i] ? "border-indigo-500 text-indigo-600" : "border-slate-100 text-slate-300"} ${feedback.type === "error" ? "border-red-500 text-red-500" : ""}`}
=======
              className={`w-8 h-10 border-b-4 flex items-center justify-center text-2xl font-black
                ${answer[i] ? "border-indigo-500 text-indigo-600" : "border-slate-100 text-slate-300"}
                ${feedback.type === "error" ? "border-red-500 text-red-500" : ""}`}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
              disabled={!!feedback.type}
=======
              disabled={!!feedback.type && feedback.type === "success"}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
          {feedback.type === "error" && tryCount < 2 ? (
=======
          {/* ✅ Show Try Again only on first wrong attempt */}
          {feedback.type === "error" && !hasRetried ? (
            // This state is never reached because hasRetried is set before feedback
            // keeping for safety
            <button
              onClick={() => {
                setAnswer("");
                setFeedback({ msg: "", type: null });
              }}
              className="w-full py-3 bg-orange-500 text-white font-black rounded-xl shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none uppercase"
            >
              🔄 Try Again
            </button>
          ) : feedback.type === "error" && hasRetried ? (
            // ✅ After retry — show clear so kid can retype
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
                answer.length !== current.word.length || !!feedback.type
=======
                answer.length !== current.word.length ||
                feedback.type === "success"
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
              }
              className="w-full py-3 bg-indigo-600 text-white font-black rounded-xl shadow-[0_4px_0_0_#4338ca] active:translate-y-1 active:shadow-none disabled:bg-slate-200 disabled:shadow-none transition-all uppercase"
            >
              Check Answer
            </button>
          )}
<<<<<<< HEAD
          <div className="flex gap-2">
            <button
              onClick={() => setAnswer((prev) => prev.slice(0, -1))}
              disabled={!!feedback.type}
=======

          <div className="flex gap-2">
            <button
              onClick={() => setAnswer((prev) => prev.slice(0, -1))}
              disabled={feedback.type === "success"}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
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
<<<<<<< HEAD
=======

        {/* Feedback message */}
        {feedback.msg && (
          <p
            className={`text-center text-sm font-black ${feedback.type === "success" ? "text-green-500" : "text-red-500"}`}
          >
            {feedback.msg}
          </p>
        )}
>>>>>>> c30dad3035bc685687766d655829ba3a37a7dcc0
      </div>
    </div>
  );
}
