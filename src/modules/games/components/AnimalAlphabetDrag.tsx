import { useState, useEffect, useRef } from "react";
import GameLayout from "@/modules/games/components/GameLayout";

interface LetterPair {
  letter: string;
  animal: string;
  emoji: string;
  urduName: string;
  color: string;
}

const LETTER_DATA: LetterPair[] = [
  {
    letter: "A",
    animal: "Alligator",
    emoji: "🐊",
    urduName: "مگرمچھ",
    color: "#FF6B6B",
  },
  {
    letter: "B",
    animal: "Bee",
    emoji: "🐝",
    urduName: "مکھی",
    color: "#FFD93D",
  },
  {
    letter: "C",
    animal: "Cat",
    emoji: "🐱",
    urduName: "بلی",
    color: "#6BCB77",
  },
  {
    letter: "D",
    animal: "Dog",
    emoji: "🐶",
    urduName: "کتا",
    color: "#4D96FF",
  },
  {
    letter: "E",
    animal: "Elephant",
    emoji: "🐘",
    urduName: "ہاتھی",
    color: "#C77DFF",
  },
  {
    letter: "F",
    animal: "Frog",
    emoji: "🐸",
    urduName: "مینڈک",
    color: "#FF9F1C",
  },
  {
    letter: "G",
    animal: "Goat",
    emoji: "🐐",
    urduName: "بکری",
    color: "#2EC4B6",
  },
  {
    letter: "H",
    animal: "Horse",
    emoji: "🐴",
    urduName: "گھوڑا",
    color: "#E71D36",
  },
  {
    letter: "I",
    animal: "Iguana",
    emoji: "🦎",
    urduName: "گوہ",
    color: "#FF6B6B",
  },
  {
    letter: "J",
    animal: "Jaguar",
    emoji: "🐆",
    urduName: "چیتا",
    color: "#FFD93D",
  },
  {
    letter: "K",
    animal: "Kangaroo",
    emoji: "🦘",
    urduName: "کینگرو",
    color: "#6BCB77",
  },
  {
    letter: "L",
    animal: "Lion",
    emoji: "🦁",
    urduName: "شیر",
    color: "#4D96FF",
  },
  {
    letter: "M",
    animal: "Monkey",
    emoji: "🐒",
    urduName: "بندر",
    color: "#C77DFF",
  },
  {
    letter: "N",
    animal: "Narwhal",
    emoji: "🐋",
    urduName: "ناروہیل",
    color: "#FF9F1C",
  },
  {
    letter: "O",
    animal: "Owl",
    emoji: "🦉",
    urduName: "الو",
    color: "#2EC4B6",
  },
  {
    letter: "P",
    animal: "Penguin",
    emoji: "🐧",
    urduName: "پینگوئن",
    color: "#E71D36",
  },
  {
    letter: "Q",
    animal: "Quail",
    emoji: "🐦",
    urduName: "بٹیر",
    color: "#FF6B6B",
  },
  {
    letter: "R",
    animal: "Rabbit",
    emoji: "🐰",
    urduName: "خرگوش",
    color: "#FFD93D",
  },
  {
    letter: "S",
    animal: "Snake",
    emoji: "🐍",
    urduName: "سانپ",
    color: "#6BCB77",
  },
  {
    letter: "T",
    animal: "Tiger",
    emoji: "🐯",
    urduName: "شیر",
    color: "#4D96FF",
  },
  {
    letter: "U",
    animal: "Unicorn",
    emoji: "🦄",
    urduName: "یونی کورن",
    color: "#C77DFF",
  },
  {
    letter: "V",
    animal: "Vulture",
    emoji: "🦅",
    urduName: "گدھ",
    color: "#FF9F1C",
  },
  {
    letter: "W",
    animal: "Wolf",
    emoji: "🐺",
    urduName: "بھیڑیا",
    color: "#2EC4B6",
  },
  {
    letter: "X",
    animal: "X-ray fish",
    emoji: "🐠",
    urduName: "مچھلی",
    color: "#E71D36",
  },
  {
    letter: "Y",
    animal: "Yak",
    emoji: "🐃",
    urduName: "یاک",
    color: "#FF6B6B",
  },
  {
    letter: "Z",
    animal: "Zebra",
    emoji: "🦓",
    urduName: "زیبرا",
    color: "#FFD93D",
  },
];

const getAnimalImage = (animal: string) =>
  `/src/assets/images/games/kg/animals/${animal.toLowerCase().replace(/[^a-z]/g, "_")}.png`;

const playSound = (type: "correct" | "wrong") => {
  const audio = new Audio(`/src/assets/sounds/${type}.mp3`);
  audio.volume = 1;
  audio.play().catch(() => {});
};

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const buildOptions = (correctIdx: number): LetterPair[] => {
  const wrong = LETTER_DATA.filter((_, i) => i !== correctIdx);
  const picked = shuffle(wrong).slice(0, 2);
  return shuffle([LETTER_DATA[correctIdx], ...picked]);
};

const speakEnglish = (text: string) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
};

const speakUrdu = (text: string) => {
  window.speechSynthesis.cancel();
  const speak = (voice?: SpeechSynthesisVoice) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ur-PK";
    u.rate = 0.75;
    u.pitch = 1.1;
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const v = window.speechSynthesis.getVoices();
      speak(
        v.find((x) => x.lang === "ur-PK") ||
          v.find((x) => x.lang.startsWith("ur")),
      );
    };
  } else {
    speak(
      voices.find((x) => x.lang === "ur-PK") ||
        voices.find((x) => x.lang.startsWith("ur")),
    );
  }
};

// ✅ FIXED: image stays inside box
function AnimalImage({
  pair,
  isDragging,
}: {
  pair: LetterPair;
  isDragging: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return imgFailed ? (
    <span
      className="text-5xl sm:text-6xl leading-none pointer-events-none"
      style={{ opacity: isDragging ? 0.3 : 1 }}
    >
      {pair.emoji}
    </span>
  ) : (
    <img
      src={getAnimalImage(pair.animal)}
      alt={pair.animal}
      className="max-w-full max-h-full w-auto h-auto object-contain pointer-events-none"
      style={{ opacity: isDragging ? 0.3 : 1, maxHeight: "85px" }}
      onError={() => setImgFailed(true)}
    />
  );
}

export default function AnimalAlphabetDrag() {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<LetterPair[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropStatus, setDropStatus] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
  const [optionStatuses, setOptionStatuses] = useState<
    Record<string, "idle" | "correct" | "wrong">
  >({});
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [answered, setAnswered] = useState(false);

  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [ghostEmoji, setGhostEmoji] = useState<string>("");
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragLetterRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);

  const TOTAL = 25;
  const leftPair = LETTER_DATA[index];
  const rightPair = LETTER_DATA[index + 1];
  const pct = Math.round((index / TOTAL) * 100);

  useEffect(() => {
    const opts = buildOptions(index + 1);
    setOptions(opts);
    setDropStatus("idle");
    setAnswered(false);
    setDraggedLetter(null);
    setIsDraggingOver(false);
    setGhostPos(null);
    dragLetterRef.current = null;
    isDraggingRef.current = false;
    const statuses: Record<string, "idle" | "correct" | "wrong"> = {};
    opts.forEach((o) => (statuses[o.letter] = "idle"));
    setOptionStatuses(statuses);

    speakEnglish(leftPair.letter);
    setTimeout(
      () =>
        speakUrdu(
          `یہ ہے ${leftPair.urduName}، اب ${rightPair.letter} کا جانور ڈھونڈو`,
        ),
      900,
    );
  }, [index]);

  const handleAnswer = (selected: LetterPair) => {
    if (answered) return;
    const isCorrect = selected.letter === rightPair.letter;

    if (isCorrect) {
      playSound("correct");
      setDropStatus("correct");
      setOptionStatuses((prev) => ({ ...prev, [selected.letter]: "correct" }));
      setAnswered(true);
      setScore((s) => s + 10);
      setTimeout(() => speakUrdu(`سہی جواب! یہ ہے ${rightPair.urduName}`), 600);
      setTimeout(() => {
        setResults((r) => [...r, true]);
        if (index + 1 >= TOTAL) setGameOver(true);
        else setIndex((i) => i + 1);
      }, 1800);
    } else {
      playSound("wrong");
      setOptionStatuses((prev) => ({ ...prev, [selected.letter]: "wrong" }));
      setTimeout(() => speakUrdu(`غلط جواب! دوبارہ کوشش کرو`), 400);
      setTimeout(() => {
        setOptionStatuses((prev) => ({ ...prev, [selected.letter]: "idle" }));
      }, 1000);
    }
  };

  const handleDragStart = (pair: LetterPair) => setDraggedLetter(pair.letter);
  const handleDragEnd = () => setDraggedLetter(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = () => setIsDraggingOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (!draggedLetter) return;
    const selected = options.find((o) => o.letter === draggedLetter);
    if (selected) handleAnswer(selected);
    setDraggedLetter(null);
  };

  const handleTouchStart = (pair: LetterPair, e: React.TouchEvent) => {
    if (answered) return;
    e.preventDefault();
    isDraggingRef.current = false;
    dragLetterRef.current = pair.letter;
    setDraggedLetter(pair.letter);
    setGhostEmoji(pair.emoji);
    setGhostPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    const touch = e.touches[0];
    setGhostPos({ x: touch.clientX, y: touch.clientY });
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      setIsDraggingOver(
        touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom,
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setGhostPos(null);
    setIsDraggingOver(false);
    const touch = e.changedTouches[0];
    const wasDrag = isDraggingRef.current;

    if (!wasDrag) {
      const pair = options.find((o) => o.letter === dragLetterRef.current);
      if (pair) {
        speakEnglish(pair.animal);
        setTimeout(() => speakUrdu(pair.urduName), 700);
      }
      setDraggedLetter(null);
      dragLetterRef.current = null;
      isDraggingRef.current = false;
      return;
    }

    if (dropZoneRef.current && dragLetterRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const isOverDrop =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      if (isOverDrop) {
        const selected = options.find(
          (o) => o.letter === dragLetterRef.current,
        );
        if (selected) handleAnswer(selected);
      }
    }

    setDraggedLetter(null);
    dragLetterRef.current = null;
    isDraggingRef.current = false;
  };

  const handleClick = (pair: LetterPair) => {
    speakEnglish(pair.animal);
    setTimeout(() => speakUrdu(pair.urduName), 700);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setResults([]);
    setGameOver(false);
    setAnswered(false);
    setDropStatus("idle");
    setGhostPos(null);
    dragLetterRef.current = null;
    isDraggingRef.current = false;
  };

  if (gameOver) {
    const correct = results.filter(Boolean).length;
    const incorrect = results.length - correct;
    const accuracy = Math.round((correct / TOTAL) * 100);

    setTimeout(() => {
      speakUrdu(
        accuracy === 100
          ? "بہت خوب! تم نے سو فیصد درست جواب دیے"
          : accuracy >= 70
            ? "شاباش! تم نے بہت اچھا کیا"
            : "کوشش جاری رکھو! تم ضرور بہتر کرو گے",
      );
    }, 500);

    return (
      <GameLayout title="Animal Alphabet" type="kg">
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
                <span className="text-xs font-bold text-gray-500">
                  Accuracy
                </span>
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
                onClick={() => window.history.back()}
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
      </GameLayout>
    );
  }

  return (
    <GameLayout title="Animal Alphabet" type="kg">
      {/* Floating ghost */}
      {ghostPos && (
        <div
          className="fixed pointer-events-none z-50 text-6xl select-none"
          style={{
            left: ghostPos.x - 30,
            top: ghostPos.y - 30,
            transform: "scale(1.3)",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        >
          {ghostEmoji}
        </div>
      )}

      <div className="w-full flex flex-col items-center px-3 sm:px-6 py-4 gap-5">
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
              Round {index + 1} / {TOTAL}
            </span>
            <span className="text-xs sm:text-sm font-bold text-yellow-600">
              ⭐ {score}
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="w-full max-w-md rounded-3xl border-4 border-green-300 bg-green-100 overflow-hidden shadow-[0px_8px_0px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-2 divide-x-4 divide-green-300">
            {/* LEFT */}
            <div className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6">
              <span
                className="text-6xl sm:text-7xl font-black drop-shadow-md select-none"
                style={{ color: leftPair.color }}
              >
                {leftPair.letter}
              </span>
              <button
                onClick={() => {
                  speakEnglish(leftPair.animal);
                  setTimeout(() => speakUrdu(leftPair.urduName), 700);
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 overflow-hidden"
              >
                <AnimalImage pair={leftPair} isDragging={false} />
              </button>
            </div>

            {/* RIGHT — drop zone */}
            <div className="flex flex-col items-center justify-center gap-2 p-4 sm:p-6">
              <span
                className="text-6xl sm:text-7xl font-black drop-shadow-md select-none"
                style={{ color: rightPair.color }}
              >
                {rightPair.letter}
              </span>
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-dashed
                  flex items-center justify-center transition-all duration-200 overflow-hidden
                  ${
                    isDraggingOver
                      ? "border-blue-400 bg-blue-50 scale-110"
                      : dropStatus === "correct"
                        ? "border-green-400 bg-green-100"
                        : "border-green-400 bg-white/60"
                  }
                `}
              >
                {dropStatus === "correct" ? (
                  <AnimalImage pair={rightPair} isDragging={false} />
                ) : isDraggingOver ? (
                  <span className="text-3xl animate-bounce">⬇️</span>
                ) : (
                  <span className="text-4xl text-green-400 font-black select-none">
                    ?
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-400 italic text-center">
                {dropStatus === "correct" ? "✅ Correct!" : "Drop here!"}
              </span>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center px-4">
          <p className="text-sm sm:text-base font-black text-gray-700">
            🐾 Drag the animal for letter{" "}
            <span
              style={{ color: rightPair.color }}
              className="font-black text-lg"
            >
              {rightPair.letter}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            👆 Tap to hear name • drag to answer
          </p>
        </div>

        {/* ✅ FIXED Option Cards — overflow-hidden keeps images inside */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs sm:max-w-sm">
          {options.map((pair) => {
            const status = optionStatuses[pair.letter] ?? "idle";
            const isDragging = draggedLetter === pair.letter;
            const isDone = answered && status !== "correct";

            return (
              <div
                key={pair.letter}
                draggable={!isDone}
                onDragStart={() => handleDragStart(pair)}
                onDragEnd={handleDragEnd}
                onClick={() => handleClick(pair)}
                onTouchStart={(e) => handleTouchStart(pair, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`
                  flex flex-col items-center justify-center gap-1 p-1
                  rounded-2xl border-4 select-none transition-all duration-200
                  touch-manipulation aspect-square overflow-hidden
                  ${
                    status === "correct"
                      ? "border-green-400 bg-green-50 scale-105 cursor-default"
                      : status === "wrong"
                        ? "border-red-400 bg-red-50"
                        : isDone
                          ? "border-gray-200 bg-gray-50 opacity-30 cursor-not-allowed"
                          : isDragging
                            ? "border-blue-300 bg-blue-50 opacity-40 scale-95"
                            : "border-yellow-300 bg-white shadow-[0px_5px_0px_#b45309] cursor-grab active:cursor-grabbing hover:scale-105"
                  }
                `}
                style={{ minHeight: 110 }}
              >
                <AnimalImage pair={pair} isDragging={isDragging} />
                <span className="text-[10px] text-gray-300 pointer-events-none">
                  🔊
                </span>
              </div>
            );
          })}
        </div>

        {/* Result dots */}
        <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
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
    </GameLayout>
  );
}
