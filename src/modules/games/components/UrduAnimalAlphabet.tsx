import { useState, useEffect, useRef } from "react";
import GameLayout from "@/modules/games/components/GameLayout";

// ─── Correct / Wrong sounds ───────────────────────────────────
import correctSoundFile from "@/assets/sounds/correct.mp3";
import wrongSoundFile from "@/assets/sounds/wrong.mp3";

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

// ─── Letter sounds ────────────────────────────────────────────
import alifSound from "@/assets/sounds/urdu/alif.mp3";
import baySound from "@/assets/sounds/urdu/bay.mp3";
import paySound from "@/assets/sounds/urdu/pay.mp3";
import taySound from "@/assets/sounds/urdu/tay.mp3";
import ttaySound from "@/assets/sounds/urdu/ttay.mp3";
import jeemSound from "@/assets/sounds/urdu/jeem.mp3";
import chaySound from "@/assets/sounds/urdu/chay.mp3";
import khaySound from "@/assets/sounds/urdu/khay.mp3";
import daalSound from "@/assets/sounds/urdu/daal.mp3";
import raySound from "@/assets/sounds/urdu/ray.mp3";
import zaySound from "@/assets/sounds/urdu/zay.mp3";
import seenSound from "@/assets/sounds/urdu/seen.mp3";
import sheenSound from "@/assets/sounds/urdu/sheen.mp3";
import toaySound from "@/assets/sounds/urdu/toay.mp3";
import ainSound from "@/assets/sounds/urdu/ain.mp3";
import ghainSound from "@/assets/sounds/urdu/ghain.mp3";
import faySound from "@/assets/sounds/urdu/fay.mp3";
import qaafSound from "@/assets/sounds/urdu/qaaf.mp3";
import kaafSound from "@/assets/sounds/urdu/kaaf.mp3";
import gaafSound from "@/assets/sounds/urdu/gaaf.mp3";
import laamSound from "@/assets/sounds/urdu/laam.mp3";
import meemSound from "@/assets/sounds/urdu/meem.mp3";
import noonSound from "@/assets/sounds/urdu/noon.mp3";
import waoSound from "@/assets/sounds/urdu/wao.mp3";
import hay2Sound from "@/assets/sounds/urdu/hay2.mp3";
import yaySound from "@/assets/sounds/urdu/yay.mp3";

// ─── Word sounds ──────────────────────────────────────────────
import catSound from "@/assets/sounds/urdu/animals/billi.wav";
import butterflySound from "@/assets/sounds/urdu/animals/titli.wav";
import giraffeSound from "@/assets/sounds/urdu/animals/zarafa.wav";
import lionSound from "@/assets/sounds/urdu/animals/sher.wav";
import parrotSound from "@/assets/sounds/urdu/animals/tota.wav";
import fishSound from "@/assets/sounds/urdu/animals/machhli.wav";
import elephantSound from "@/assets/sounds/urdu/animals/hathi.wav";
import yakSound from "@/assets/sounds/urdu/animals/yak.wav";
import anarSound from "@/assets/sounds/urdu/animals/anaar.wav";
import patangSound from "@/assets/sounds/urdu/animals/patang.wav";
import topiSound from "@/assets/sounds/urdu/animals/topi.wav";
import jahaazSound from "@/assets/sounds/urdu/animals/jahaz.wav";
import chaandSound from "@/assets/sounds/urdu/animals/chand.wav";
import khargoshSound from "@/assets/sounds/urdu/animals/khargosh.wav";
import dudhSound from "@/assets/sounds/urdu/animals/doodh.wav";
import rasSound from "@/assets/sounds/urdu/animals/ras.wav";
import saibSound from "@/assets/sounds/urdu/animals/saib.wav";
import ainakSound from "@/assets/sounds/urdu/animals/ainak.wav";
import ghubaaraSound from "@/assets/sounds/urdu/animals/ghubara.wav";
import phoneSound from "@/assets/sounds/urdu/animals/phone.wav";
import qalamSound from "@/assets/sounds/urdu/animals/qalam.wav";
import kitaabSound from "@/assets/sounds/urdu/animals/kitaab.wav";
import gendSound from "@/assets/sounds/urdu/animals/gend.wav";
import lemonSound from "@/assets/sounds/urdu/animals/lemon.wav";
import naakSound from "@/assets/sounds/urdu/animals/naak.wav";
import vardiSound from "@/assets/sounds/urdu/animals/wardi.wav";

// ─── Sound maps ───────────────────────────────────────────────
const LETTER_SOUNDS: Record<string, HTMLAudioElement> = {
  الف: new Audio(alifSound),
  بے: new Audio(baySound),
  پے: new Audio(paySound),
  تے: new Audio(taySound),
  ٹے: new Audio(ttaySound),
  جیم: new Audio(jeemSound),
  چے: new Audio(chaySound),
  خے: new Audio(khaySound),
  دال: new Audio(daalSound),
  رے: new Audio(raySound),
  زے: new Audio(zaySound),
  سین: new Audio(seenSound),
  شین: new Audio(sheenSound),
  طوے: new Audio(toaySound),
  عین: new Audio(ainSound),
  غین: new Audio(ghainSound),
  فے: new Audio(faySound),
  قاف: new Audio(qaafSound),
  کاف: new Audio(kaafSound),
  گاف: new Audio(gaafSound),
  لام: new Audio(laamSound),
  میم: new Audio(meemSound),
  نون: new Audio(noonSound),
  واو: new Audio(waoSound),
  ہے: new Audio(hay2Sound),
  یے: new Audio(yaySound),
};

const WORD_SOUNDS: Record<string, HTMLAudioElement> = {
  بلی: new Audio(catSound),
  تتلی: new Audio(butterflySound),
  زرافہ: new Audio(giraffeSound),
  شیر: new Audio(lionSound),
  طوطا: new Audio(parrotSound),
  مچھلی: new Audio(fishSound),
  ہاتھی: new Audio(elephantSound),
  یاک: new Audio(yakSound),
  انار: new Audio(anarSound),
  پتنگ: new Audio(patangSound),
  ٹوپی: new Audio(topiSound),
  جہاز: new Audio(jahaazSound),
  چاند: new Audio(chaandSound),
  خرگوش: new Audio(khargoshSound),
  دودھ: new Audio(dudhSound),
  رس: new Audio(rasSound),
  سیب: new Audio(saibSound),
  عینک: new Audio(ainakSound),
  غبارہ: new Audio(ghubaaraSound),
  فون: new Audio(phoneSound),
  قلم: new Audio(qalamSound),
  کتاب: new Audio(kitaabSound),
  گیند: new Audio(gendSound),
  لیموں: new Audio(lemonSound),
  ناک: new Audio(naakSound),
  وردی: new Audio(vardiSound),
};

// ✅ Play letter sound only
const playLetter = (letterName: string) => {
  const s = LETTER_SOUNDS[letterName];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
};

// ✅ Play word sound only
const playWord = (wordUrdu: string) => {
  const s = WORD_SOUNDS[wordUrdu];
  if (!s) return;
  s.currentTime = 0;
  s.play().catch(() => {});
};

// ─── Types ────────────────────────────────────────────────────
interface WordPair {
  letter: string;
  letterName: string;
  word: string;
  image: string; // ✅ image filename without extension
  color: string;
}

// ─── Word list with corrected image file names ────────────────
// ✅ image names match exactly what is in your urdu-animals folder
const LETTER_DATA: WordPair[] = [
  {
    letter: "ا",
    letterName: "الف",
    word: "انار",
    image: "anaar",
    color: "#FF6B6B",
  },
  {
    letter: "ب",
    letterName: "بے",
    word: "بلی",
    image: "billi",
    color: "#FFD93D",
  },
  {
    letter: "پ",
    letterName: "پے",
    word: "پتنگ",
    image: "patang",
    color: "#6BCB77",
  },
  {
    letter: "ت",
    letterName: "تے",
    word: "تتلی",
    image: "titli",
    color: "#4D96FF",
  },
  {
    letter: "ٹ",
    letterName: "ٹے",
    word: "ٹوپی",
    image: "topi",
    color: "#C77DFF",
  },
  {
    letter: "ج",
    letterName: "جیم",
    word: "جہاز",
    image: "jahaz",
    color: "#FF9F1C",
  },
  {
    letter: "چ",
    letterName: "چے",
    word: "چاند",
    image: "chand",
    color: "#2EC4B6",
  },
  {
    letter: "خ",
    letterName: "خے",
    word: "خرگوش",
    image: "khargosh",
    color: "#E71D36",
  },
  {
    letter: "د",
    letterName: "دال",
    word: "دودھ",
    image: "doodh",
    color: "#FF6B6B",
  },
  { letter: "ر", letterName: "رے", word: "رس", image: "ras", color: "#FFD93D" },
  {
    letter: "ز",
    letterName: "زے",
    word: "زرافہ",
    image: "zarafa",
    color: "#6BCB77",
  },
  {
    letter: "س",
    letterName: "سین",
    word: "سیب",
    image: "saib",
    color: "#4D96FF",
  },
  {
    letter: "ش",
    letterName: "شین",
    word: "شیر",
    image: "sher",
    color: "#C77DFF",
  },
  {
    letter: "ط",
    letterName: "طوے",
    word: "طوطا",
    image: "tota",
    color: "#FF9F1C",
  },
  {
    letter: "ع",
    letterName: "عین",
    word: "عینک",
    image: "ainak",
    color: "#2EC4B6",
  },
  {
    letter: "غ",
    letterName: "غین",
    word: "غبارہ",
    image: "ghubara",
    color: "#E71D36",
  },
  {
    letter: "ف",
    letterName: "فے",
    word: "فون",
    image: "phone",
    color: "#FF6B6B",
  },
  {
    letter: "ق",
    letterName: "قاف",
    word: "قلم",
    image: "qalam",
    color: "#FFD93D",
  },
  {
    letter: "ک",
    letterName: "کاف",
    word: "کتاب",
    image: "kitaab",
    color: "#6BCB77",
  },
  {
    letter: "گ",
    letterName: "گاف",
    word: "گیند",
    image: "gend",
    color: "#4D96FF",
  },
  {
    letter: "ل",
    letterName: "لام",
    word: "لیموں",
    image: "lemon",
    color: "#C77DFF",
  },
  {
    letter: "م",
    letterName: "میم",
    word: "مچھلی",
    image: "machhli",
    color: "#FF9F1C",
  },
  {
    letter: "ن",
    letterName: "نون",
    word: "ناک",
    image: "naak",
    color: "#2EC4B6",
  },
  {
    letter: "و",
    letterName: "واو",
    word: "وردی",
    image: "wardi",
    color: "#E71D36",
  },
  {
    letter: "ہ",
    letterName: "ہے",
    word: "ہاتھی",
    image: "hathi",
    color: "#FF6B6B",
  },
  {
    letter: "ی",
    letterName: "یے",
    word: "یاک",
    image: "yak",
    color: "#FFD93D",
  },
];

// ─── Image path ───────────────────────────────────────────────
// Folder: src/assets/images/games/kg/urdu-animals/
const getImage = (name: string) =>
  `/src/assets/images/games/kg/urdu-animals/${name}.png`;

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const buildOptions = (correctIdx: number): WordPair[] => {
  const wrong = LETTER_DATA.filter((_, i) => i !== correctIdx);
  const picked = shuffle(wrong).slice(0, 2);
  return shuffle([LETTER_DATA[correctIdx], ...picked]);
};

// ─── Word Image Component ─────────────────────────────────────
function WordImage({
  pair,
  dimmed,
  className = "",
}: {
  pair: WordPair;
  dimmed?: boolean;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return imgFailed ? (
    // fallback emoji if image not found
    <span
      className="text-5xl sm:text-6xl leading-none select-none pointer-events-none"
      style={{ opacity: dimmed ? 0.3 : 1 }}
    >
      🖼️
    </span>
  ) : (
    <img
      src={getImage(pair.image)}
      alt={pair.word}
      className={`object-contain pointer-events-none ${className}`}
      style={{ opacity: dimmed ? 0.3 : 1 }}
      onError={() => setImgFailed(true)}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function UrduLetterDrag() {
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState<WordPair[]>([]);
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
  const [ghostWord, setGhostWord] = useState<string>("");

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragLetterRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);

  const TOTAL = LETTER_DATA.length - 1;
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

    // ✅ On question load: LEFT letter sound → RIGHT letter sound
    // NO word sounds here at all
    playLetter(leftPair.letterName);
    setTimeout(() => playLetter(rightPair.letterName), 1000);
  }, [index]);

  const handleAnswer = (selected: WordPair) => {
    if (answered) return;
    const isCorrect = selected.letter === rightPair.letter;

    if (isCorrect) {
      playCorrect();
      setDropStatus("correct");
      setOptionStatuses((prev) => ({ ...prev, [selected.letter]: "correct" }));
      setAnswered(true);
      setScore((s) => s + 10);
      setTimeout(() => {
        setResults((r) => [...r, true]);
        if (index + 1 >= TOTAL) setGameOver(true);
        else setIndex((i) => i + 1);
      }, 1800);
    } else {
      playWrong();
      setOptionStatuses((prev) => ({ ...prev, [selected.letter]: "wrong" }));
      setTimeout(() => {
        setOptionStatuses((prev) => ({ ...prev, [selected.letter]: "idle" }));
      }, 1000);
    }
  };

  // ── Desktop drag ──────────────────────────────────────────
  const handleDragStart = (pair: WordPair) => setDraggedLetter(pair.letter);
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

  // ── Touch drag ────────────────────────────────────────────
  const handleTouchStart = (pair: WordPair, e: React.TouchEvent) => {
    if (answered) return;
    e.preventDefault();
    isDraggingRef.current = false;
    dragLetterRef.current = pair.letter;
    setDraggedLetter(pair.letter);
    setGhostWord(pair.word);
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
      // ✅ Tap on option = play WORD sound only
      const pair = options.find((o) => o.letter === dragLetterRef.current);
      if (pair) playWord(pair.word);
      setDraggedLetter(null);
      dragLetterRef.current = null;
      isDraggingRef.current = false;
      return;
    }

    if (dropZoneRef.current && dragLetterRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const isOver =
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom;
      if (isOver) {
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

  // ✅ Click option card = play WORD sound only
  const handleOptionClick = (pair: WordPair) => playWord(pair.word);

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

  // ── GAME OVER ─────────────────────────────────────────────
  if (gameOver) {
    const correct = results.filter(Boolean).length;
    const incorrect = results.length - correct;
    const accuracy = Math.round((correct / TOTAL) * 100);

    return (
      <GameLayout title="اردو حروف تہجی" type="kg">
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
                <div className="text-xs font-bold text-green-400">درست</div>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3">
                <div className="text-2xl font-black text-red-500">
                  {incorrect}
                </div>
                <div className="text-xs font-bold text-red-400">غلط</div>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">
                <div className="text-2xl font-black text-blue-600">{score}</div>
                <div className="text-xs font-bold text-blue-400">اسکور</div>
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-gray-500">درستگی</span>
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
                ← واپس
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

  // ── MAIN GAME ─────────────────────────────────────────────
  return (
    <GameLayout title="اردو حروف تہجی" type="kg">
      {/* Touch drag ghost — shows word text not image for simplicity */}
      {ghostPos && (
        <div
          className="fixed pointer-events-none z-50 select-none text-2xl font-black bg-white rounded-xl px-3 py-2 shadow-lg border-2 border-blue-300"
          style={{
            left: ghostPos.x - 30,
            top: ghostPos.y - 30,
            direction: "rtl",
            fontFamily: "Noto Nastaliq Urdu, serif",
          }}
        >
          {ghostWord}
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
            <span
              className="text-xs sm:text-sm font-bold text-blue-600"
              dir="rtl"
            >
              سوال {index + 1} / {TOTAL}
            </span>
            <span className="text-xs sm:text-sm font-bold text-yellow-600">
              ⭐ {score}
            </span>
          </div>
        </div>

        {/* Main card */}
        <div className="w-full max-w-md rounded-3xl border-4 border-blue-300 bg-blue-50 overflow-hidden shadow-[0px_8px_0px_rgba(0,0,0,0.1)]">
          <div className="grid grid-cols-2 divide-x-4 divide-blue-300">
            {/* LEFT — tap letter = letter sound ONLY, image shown but NO word sound */}
            <div className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5">
              {/* ✅ Tap letter = letter sound only */}
              <button
                onClick={() => playLetter(leftPair.letterName)}
                className="text-6xl sm:text-7xl font-black drop-shadow-md select-none active:scale-90 transition-transform"
                style={{ color: leftPair.color, fontFamily: "serif" }}
              >
                {leftPair.letter}
              </button>

              {/* ✅ Image shown — NO tap sound here */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/70 border-2 border-blue-200 flex items-center justify-center overflow-hidden shadow-sm">
                <WordImage pair={leftPair} className="w-full h-full" />
              </div>

              <span
                className="text-sm font-black text-gray-700 mt-0.5"
                dir="rtl"
                style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
              >
                {leftPair.word}
              </span>
            </div>

            {/* RIGHT — tap letter = letter sound ONLY, drop zone shows image after correct */}
            <div className="flex flex-col items-center justify-center gap-2 p-4 sm:p-5">
              {/* ✅ Tap letter = letter sound only */}
              <button
                onClick={() => playLetter(rightPair.letterName)}
                className="text-6xl sm:text-7xl font-black drop-shadow-md select-none active:scale-90 transition-transform"
                style={{ color: rightPair.color, fontFamily: "serif" }}
              >
                {rightPair.letter}
              </button>

              {/* Drop zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-dashed overflow-hidden
                  flex items-center justify-center transition-all duration-200
                  ${
                    isDraggingOver
                      ? "border-blue-400 bg-blue-100 scale-110"
                      : dropStatus === "correct"
                        ? "border-green-400 bg-green-100"
                        : "border-blue-300 bg-white/60"
                  }
                `}
              >
                {dropStatus === "correct" ? (
                  <WordImage pair={rightPair} className="w-full h-full" />
                ) : isDraggingOver ? (
                  <span className="text-3xl animate-bounce">⬇️</span>
                ) : (
                  <span className="text-4xl text-blue-300 font-black select-none">
                    ؟
                  </span>
                )}
              </div>

              <span
                className="text-xs font-bold text-center"
                dir="rtl"
                style={{
                  color: dropStatus === "correct" ? "#16a34a" : "#9ca3af",
                }}
              >
                {dropStatus === "correct"
                  ? `✅ ${rightPair.word}`
                  : "یہاں ڈالو!"}
              </span>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center px-4" dir="rtl">
          <p className="text-sm sm:text-base font-black text-gray-700">
            🔤{" "}
            <span
              style={{ color: rightPair.color }}
              className="font-black text-lg"
            >
              {rightPair.letterName}
            </span>{" "}
            سے شروع ہونے والا لفظ ڈھونڈو
          </p>
          <p className="text-xs text-gray-400 mt-1">
            👆 چھوئیں تو لفظ سنیں • گھسیٹ کر جواب دیں
          </p>
        </div>

        {/* ✅ Option cards — tap plays WORD sound, drag to answer */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm">
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
                onClick={() => handleOptionClick(pair)}
                onTouchStart={(e) => handleTouchStart(pair, e)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={`
                  flex flex-col items-center justify-center
                  rounded-2xl border-4 select-none transition-all duration-200
                  touch-manipulation overflow-hidden aspect-square p-1
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
                style={{ minHeight: 100 }}
              >
                {/* ✅ Image fills card fully */}
                <div className="w-full flex-1 min-h-0 overflow-hidden flex items-center justify-center">
                  <WordImage
                    pair={pair}
                    dimmed={isDragging}
                    className="w-full h-full"
                  />
                </div>

                {/* Urdu word label */}
                <span
                  className="text-[11px] sm:text-xs font-black text-gray-600 text-center leading-tight pb-0.5 px-1"
                  dir="rtl"
                  style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
                >
                  {pair.word}
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
