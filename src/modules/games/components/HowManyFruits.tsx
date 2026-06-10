import { useState, useMemo } from "react";
import correctSoundFile from "@/assets/sounds/correct.mp3";
import wrongSoundFile from "@/assets/sounds/wrong.mp3";

// ─── Audio & Speech ──────────────────────────────────────────
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
  u.rate = 0.9;
  u.lang = "en-US";

  window.speechSynthesis.speak(u);
};

// ─── Vite Static Asset Mapping ───────────────────────────────
// Globally discover and map all local fruit assets at bundle-time.
const fruitImages = import.meta.glob<{ default: string }>(
  "/src/assets/images/games/class1/fruits/*.png",
  { eager: true },
);

// ─── Dynamic Image Helper ────────────────────────────────────
// Safely matches your exact data paths directly to bundled asset targets.
const getImageUrl = (imagePath: string): string => {
  // standardizes paths starting with a clean forward slash
  const formattedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return fruitImages[formattedPath]?.default || "";
};

// ─── Types ───────────────────────────────────────────────────
interface FruitGroup {
  id: number;
  name: string;
  emoji: string;
  count: number;
  imagePath: string;
}

interface Round {
  id: number;
  title: string;
  bgColor: string;
  fruits: FruitGroup[];
}

// ─── 10 QUESTIONS ────────────────────────────────────────────
const ALL_ROUNDS: Round[] = [
  {
    id: 1,
    title: "ORANGE GROUP",
    bgColor: "#fff7ed",
    fruits: [
      {
        id: 101,
        name: "papaya",
        emoji: "🍈",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/papaya.png",
      },
      {
        id: 102,
        name: "peach",
        emoji: "🍑",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/peach.png",
      },
      {
        id: 103,
        name: "pineapple",
        emoji: "🍍",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/pineapple.png",
      },
    ],
  },
  {
    id: 2,
    title: "RED GROUP",
    bgColor: "#fff1f2",
    fruits: [
      {
        id: 201,
        name: "strawberry",
        emoji: "🍓",
        count: 1,
        imagePath: "/src/assets/images/games/class1/fruits/strawberry.png",
      },
      {
        id: 202,
        name: "apple",
        emoji: "🍎",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/apple.png",
      },
      {
        id: 203,
        name: "grape",
        emoji: "🍇",
        count: 6,
        imagePath: "/src/assets/images/games/class1/fruits/grape.png",
      },
    ],
  },
  {
    id: 3,
    title: "GREEN GROUP",
    bgColor: "#f0fdf4",
    fruits: [
      {
        id: 301,
        name: "pear",
        emoji: "🍐",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/pear.png",
      },
      {
        id: 302,
        name: "kiwi",
        emoji: "🥝",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/kiwi.png",
      },
      {
        id: 303,
        name: "melon",
        emoji: "🍈",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/melon.png",
      },
    ],
  },
  {
    id: 4,
    title: "TROPICAL GROUP",
    bgColor: "#fefce8",
    fruits: [
      {
        id: 401,
        name: "banana",
        emoji: "🍌",
        count: 5,
        imagePath: "/src/assets/images/games/class1/fruits/banana.png",
      },
      {
        id: 402,
        name: "coconut",
        emoji: "🥥",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/coconut.png",
      },
      {
        id: 403,
        name: "pineapple",
        emoji: "🍍",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/pineapple.png",
      },
    ],
  },
  {
    id: 5,
    title: "BERRY GROUP",
    bgColor: "#fdf2f8",
    fruits: [
      {
        id: 501,
        name: "cherry",
        emoji: "🍒",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/cherry.png",
      },
      {
        id: 502,
        name: "strawberry",
        emoji: "🍓",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/strawberry.png",
      },
      {
        id: 503,
        name: "blueberry",
        emoji: "🫐",
        count: 5,
        imagePath: "/src/assets/images/games/class1/fruits/blueberry.png",
      },
    ],
  },
  {
    id: 6,
    title: "YELLOW GROUP",
    bgColor: "#fef9c3",
    fruits: [
      {
        id: 601,
        name: "banana",
        emoji: "🍌",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/banana.png",
      },
      {
        id: 602,
        name: "lemon",
        emoji: "🍋",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/lemon.png",
      },
      {
        id: 603,
        name: "pineapple",
        emoji: "🍍",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/pineapple.png",
      },
    ],
  },
  {
    id: 7,
    title: "MIXED GROUP",
    bgColor: "#eff6ff",
    fruits: [
      {
        id: 701,
        name: "apple",
        emoji: "🍎",
        count: 5,
        imagePath: "/src/assets/images/games/class1/fruits/apple.png",
      },
      {
        id: 702,
        name: "banana",
        emoji: "🍌",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/banana.png",
      },
      {
        id: 703,
        name: "grape",
        emoji: "🍇",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/grape.png",
      },
    ],
  },
  {
    id: 8,
    title: "FRESH GROUP",
    bgColor: "#ecfccb",
    fruits: [
      {
        id: 801,
        name: "watermelon",
        emoji: "🍉",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/watermelon.png",
      },
      {
        id: 802,
        name: "orange",
        emoji: "🍊",
        count: 5,
        imagePath: "/src/assets/images/games/class1/fruits/orange.png",
      },
      {
        id: 803,
        name: "pear",
        emoji: "🍐",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/pear.png",
      },
    ],
  },
  {
    id: 9,
    title: "PURPLE GROUP",
    bgColor: "#faf5ff",
    fruits: [
      {
        id: 901,
        name: "grape",
        emoji: "🍇",
        count: 6,
        imagePath: "/src/assets/images/games/class1/fruits/grape.png",
      },
      {
        id: 902,
        name: "plum",
        emoji: "🟣",
        count: 2,
        imagePath: "/src/assets/images/games/class1/fruits/plum.png",
      },
      {
        id: 903,
        name: "berry",
        emoji: "🫐",
        count: 3,
        imagePath: "/src/assets/images/games/class1/fruits/berry.png",
      },
    ],
  },
  {
    id: 10,
    title: "FINAL GROUP",
    bgColor: "#f0f9ff",
    fruits: [
      {
        id: 1001,
        name: "apple",
        emoji: "🍎",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/apple.png",
      },
      {
        id: 1002,
        name: "orange",
        emoji: "🍊",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/orange.png",
      },
      {
        id: 1003,
        name: "banana",
        emoji: "🍌",
        count: 4,
        imagePath: "/src/assets/images/games/class1/fruits/banana.png",
      },
    ],
  },
];

const USE_CUSTOM_IMAGES = true;

// ─── COMPONENT ───────────────────────────────────────────────
export default function MultiFruitCounter() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<
    Record<number, "correct" | "wrong" | null>
  >({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tries, setTries] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentRound = ALL_ROUNDS[roundIdx];

  // ─── Mixed Grid ────────────────────────────────────────────
  const gridItems = useMemo(() => {
    const items: { emoji: string; name: string; imagePath: string }[] = [];

    currentRound.fruits.forEach((f) => {
      for (let i = 0; i < f.count; i++) {
        items.push({
          emoji: f.emoji,
          name: f.name,
          imagePath: f.imagePath,
        });
      }
    });

    return items.sort(() => Math.random() - 0.5);
  }, [currentRound]);

  // ─── Next Question Function ────────────────────────────────
  const nextRound = () => {
    if (roundIdx < ALL_ROUNDS.length - 1) {
      setRoundIdx((prev) => prev + 1);
      setUserAnswers({});
      setFeedback({});
      setIsSubmitted(false);
      setTries(0);
    } else {
      setShowResult(true);
    }
  };

  // ─── Check Answers ────────────────────────────────────────
  const checkAnswers = () => {
    let allCorrect = true;
    const newFeedback: Record<number, "correct" | "wrong"> = {};

    currentRound.fruits.forEach((f) => {
      const answer = userAnswers[f.id] || 0;
      const isRight = answer === f.count;
      newFeedback[f.id] = isRight ? "correct" : "wrong";

      if (!isRight) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      playCorrect();
      setCorrectCount((prev) => prev + 1);
      nextRound();
    } else {
      playWrong();

      if (tries === 0) {
        setFeedback(newFeedback);
        setIsSubmitted(true);
        setTries(1);
      } else {
        setWrongCount((prev) => prev + 1);
        nextRound();
      }
    }
  };

  // ─── Try Again ────────────────────────────────────────────
  const tryAgain = () => {
    setIsSubmitted(false);
    setFeedback({});
  };

  // ─── Restart Game ─────────────────────────────────────────
  const restartGame = () => {
    setRoundIdx(0);
    setUserAnswers({});
    setFeedback({});
    setIsSubmitted(false);
    setCorrectCount(0);
    setWrongCount(0);
    setTries(0);
    setShowResult(false);
  };

  // ─── RESULT SCREEN ────────────────────────────────────────
  if (showResult) {
    const percentage = Math.round((correctCount / ALL_ROUNDS.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 w-full max-w-md text-center border-8 border-yellow-300">
          <div className="text-7xl mb-4">🏆</div>

          <h1 className="text-4xl font-black text-orange-500 mb-2">
            GREAT JOB!
          </h1>

          <p className="text-gray-500 font-bold mb-8">
            You completed all 10 questions
          </p>

          <div className="space-y-4">
            <div className="bg-green-100 rounded-2xl p-4">
              <h2 className="text-green-700 font-black text-xl">✅ Correct</h2>
              <p className="text-4xl font-black text-green-600">
                {correctCount}
              </p>
            </div>

            <div className="bg-red-100 rounded-2xl p-4">
              <h2 className="text-red-700 font-black text-xl">❌ Incorrect</h2>
              <p className="text-4xl font-black text-red-600">{wrongCount}</p>
            </div>

            <div className="bg-amber-100 rounded-2xl p-4">
              <h2 className="text-amber-700 font-black text-xl">⭐ Score</h2>
              <p className="text-5xl font-black text-amber-600">
                {percentage}%
              </p>
            </div>
          </div>

          <button
            onClick={restartGame}
            className="mt-8 w-full py-4 bg-orange-500 text-white text-xl font-black rounded-2xl shadow-[0_5px_0_#c2410c] active:translate-y-1 active:shadow-none transition-all"
          >
            PLAY AGAIN 🔄
          </button>
        </div>
      </div>
    );
  }

  // ─── GAME SCREEN ──────────────────────────────────────────
  return (
    <div className="min-h-[500px] flex flex-col items-center p-4 font-sans">
      <h1 className="text-3xl font-black text-amber-900 mb-6 uppercase tracking-tighter text-center">
        HOW MANY FRUITS IN THE TABLE?
      </h1>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-amber-200">
        {/* Header */}
        <div className="bg-amber-100 py-3 text-center font-black text-amber-700 tracking-widest">
          {currentRound.title}
        </div>

        {/* Fruits Grid */}
        <div
          className="p-6 grid grid-cols-3 gap-4 min-h-[260px] items-center justify-items-center"
          style={{ backgroundColor: currentRound.bgColor }}
        >
          {gridItems.map((item, i) => (
            <span
              key={i}
              className="flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
              onClick={() => speak(item.name)}
            >
              {USE_CUSTOM_IMAGES ? (
                <img
                  src={getImageUrl(item.imagePath)}
                  alt={item.name}
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <span className="text-5xl">{item.emoji}</span>
              )}
            </span>
          ))}
        </div>

        {/* Controls */}
        <div className="p-6 border-t-4 border-amber-100">
          <div className="flex justify-around items-end gap-2">
            {currentRound.fruits.map((f) => (
              <div key={f.id} className="flex flex-col items-center gap-3">
                {USE_CUSTOM_IMAGES ? (
                  <img
                    src={getImageUrl(f.imagePath)}
                    alt={f.name}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-4xl">{f.emoji}</span>
                )}

                <div>
                  <div className="flex justify-center items-center w-full py-2">
                    <input
                      type="number"
                      min="0"
                      disabled={isSubmitted}
                      value={userAnswers[f.id] || ""}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setUserAnswers((prev) => ({
                          ...prev,
                          [f.id]: isNaN(val) ? 0 : val,
                        }));
                      }}
                      placeholder="0"
                      className={`w-16 h-12 text-center text-2xl font-black text-gray-800 border-2 rounded-xl focus:outline-none transition-colors appearance-none ${
                        feedback[f.id] === "wrong"
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 focus:border-amber-400"
                      }`}
                      style={{ MozAppearance: "textfield" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3">
            {!isSubmitted && (
              <button
                onClick={checkAnswers}
                className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl shadow-[0_4px_0_#b45309] active:translate-y-1 active:shadow-none transition-all"
              >
                CHECK ANSWERS
              </button>
            )}

            {isSubmitted &&
              Object.values(feedback).some((f) => f === "wrong") && (
                <button
                  onClick={tryAgain}
                  className="w-full py-4 bg-blue-500 text-white font-black rounded-2xl shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all"
                >
                  TRY AGAIN 🔄
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex gap-4 text-sm font-black">
        <div className="bg-white px-4 py-2 rounded-full shadow">
          Level {roundIdx + 1} / {ALL_ROUNDS.length}
        </div>

        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full shadow">
          ✅ {correctCount}
        </div>

        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full shadow">
          ❌ {wrongCount}
        </div>
      </div>
    </div>
  );
}
