import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
// Save your mp3 files in: src/assets/sounds/urdu/
// Use EXACTLY these file names:
//
//  alif.mp3    bay.mp3     pay.mp3     tay.mp3     ttay.mp3
//  say.mp3     jeem.mp3    chay.mp3    hay.mp3     khay.mp3
//  daal.mp3    ddaal.mp3   zaal.mp3    ray.mp3     zay.mp3
//  zhay.mp3    seen.mp3    sheen.mp3   suad.mp3    zuad.mp3
//  toay.mp3    zoay.mp3    ain.mp3     ghain.mp3   fay.mp3
//  qaaf.mp3    kaaf.mp3    gaaf.mp3    laam.mp3    meem.mp3
//  noon.mp3    wao.mp3     hay2.mp3    hamza.mp3   yay.mp3

import alifSound from "@/assets/sounds/urdu/alif.mp3";
import baySound from "@/assets/sounds/urdu/bay.mp3";
import paySound from "@/assets/sounds/urdu/pay.mp3";
import taySound from "@/assets/sounds/urdu/tay.mp3";
import ttaySound from "@/assets/sounds/urdu/ttay.mp3";
import saySound from "@/assets/sounds/urdu/say.mp3";
import jeemSound from "@/assets/sounds/urdu/jeem.mp3";
import chaySound from "@/assets/sounds/urdu/chay.mp3";
import haySound from "@/assets/sounds/urdu/hay.mp3";
import khaySound from "@/assets/sounds/urdu/khay.mp3";
import daalSound from "@/assets/sounds/urdu/daal.mp3";
import ddaalSound from "@/assets/sounds/urdu/ddaal.mp3";
import zaalSound from "@/assets/sounds/urdu/zaal.mp3";
import raySound from "@/assets/sounds/urdu/ray.mp3";
import zaySound from "@/assets/sounds/urdu/zay.mp3";
import zhaySound from "@/assets/sounds/urdu/zhay.mp3";
import seenSound from "@/assets/sounds/urdu/seen.mp3";
import sheenSound from "@/assets/sounds/urdu/sheen.mp3";
import suadSound from "@/assets/sounds/urdu/suad.mp3";
import zuadSound from "@/assets/sounds/urdu/zuad.mp3";
import toaySound from "@/assets/sounds/urdu/toay.mp3";
import zoaySound from "@/assets/sounds/urdu/zoay.mp3";
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
import hamzaSound from "@/assets/sounds/urdu/hamza.mp3";
import yaySound from "@/assets/sounds/urdu/yay.mp3";

// Map letter name → Audio object
const LETTER_SOUNDS: Record<string, HTMLAudioElement> = {
  الف: new Audio(alifSound),
  بے: new Audio(baySound),
  پے: new Audio(paySound),
  تے: new Audio(taySound),
  ٹے: new Audio(ttaySound),
  ثے: new Audio(saySound),
  جیم: new Audio(jeemSound),
  چے: new Audio(chaySound),
  حے: new Audio(haySound),
  خے: new Audio(khaySound),
  دال: new Audio(daalSound),
  ڈال: new Audio(ddaalSound),
  ذال: new Audio(zaalSound),
  رے: new Audio(raySound),
  زے: new Audio(zaySound),
  ژے: new Audio(zhaySound),
  سین: new Audio(seenSound),
  شین: new Audio(sheenSound),
  صاد: new Audio(suadSound),
  ضاد: new Audio(zuadSound),
  طوے: new Audio(toaySound),
  ظوے: new Audio(zoaySound),
  عین: new Audio(ainSound),
  غین: new Audio(ghainSound),
  فے: new Audio(faySound),
  قاف: new Audio(qaafSound),
  کاف: new Audio(kaafSound),
  گاف: new Audio(gaafSound),
  لام: new Audio(laamSound),
  میم: new Audio(meemSound),
  نون: new Audio(noonSound),
  واؤ: new Audio(waoSound),
  ہے: new Audio(hay2Sound),
  ہمزہ: new Audio(hamzaSound),
  یے: new Audio(yaySound),
};

const playLetter = (letterName: string) => {
  const sound = LETTER_SOUNDS[letterName];
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch(() => {});
};

// ─── Types ────────────────────────────────────────────────────
interface OptionItem {
  name: string;
  emoji: string;
}
interface LetterData {
  letter: string;
  name: string;
  correct: string;
  emoji: string;
  options: OptionItem[];
}
interface OptionState {
  name: string;
  emoji: string;
  status: "idle" | "correct" | "wrong";
}

// ─── Data — unchanged from your existing file ─────────────────
const RAW_DATA = [
  {
    letter: "ا",
    name: "الف",
    correct: { name: " انار", emoji: "🍎" },
    wrong: [
      { name: "گیند", emoji: "⚽" },
      { name: "بلی", emoji: "🐱" },
    ],
  },
  {
    letter: "ب",
    name: "بے",
    correct: { name: "بلی", emoji: "🐱" },
    wrong: [
      { name: " انار", emoji: "🍎" },
      { name: "چاند", emoji: "🌙" },
    ],
  },
  {
    letter: "پ",
    name: "پے",
    correct: { name: "پرندہ", emoji: "🐦" },
    wrong: [
      { name: "بلی", emoji: "🐱" },
      { name: "درخت", emoji: "🌳" },
    ],
  },
  {
    letter: "ت",
    name: "تے",
    correct: { name: "تتلی", emoji: "🦋" },
    wrong: [
      { name: "مچھلی", emoji: "🐟" },
      { name: "گاجر", emoji: "🥕" },
    ],
  },
  {
    letter: "ٹ",
    name: "ٹے",
    correct: { name: "ٹرین", emoji: "🚂" },
    wrong: [
      { name: "تتلی", emoji: "🦋" },
      { name: "سیب", emoji: "🍎" },
    ],
  },
  {
    letter: "ث",
    name: "ثے",
    correct: { name: "ثمر", emoji: "🍑" },
    wrong: [
      { name: "ٹرین", emoji: "🚂" },
      { name: "بلی", emoji: "🐱" },
    ],
  },
  {
    letter: "ج",
    name: "جیم",
    correct: { name: "جہاز", emoji: "✈️" },
    wrong: [
      { name: "گیند", emoji: "⚽" },
      { name: " انار", emoji: "🍎" },
    ],
  },
  {
    letter: "چ",
    name: "چے",
    correct: { name: "چاند", emoji: "🌙" },
    wrong: [
      { name: "جہاز", emoji: "✈️" },
      { name: "پھول", emoji: "🌸" },
    ],
  },
  {
    letter: "ح",
    name: "حے",
    correct: { name: "حلوہ", emoji: "🍮" },
    wrong: [
      { name: "چاند", emoji: "🌙" },
      { name: "مچھلی", emoji: "🐟" },
    ],
  },
  {
    letter: "خ",
    name: "خے",
    correct: { name: "خرگوش", emoji: "🐰" },
    wrong: [
      { name: "حلوہ", emoji: "🍮" },
      { name: "گیند", emoji: "⚽" },
    ],
  },
  {
    letter: "د",
    name: "دال",
    correct: { name: "درخت", emoji: "🌳" },
    wrong: [
      { name: "خرگوش", emoji: "🐰" },
      { name: "سورج", emoji: "☀️" },
    ],
  },
  {
    letter: "ڈ",
    name: "ڈال",
    correct: { name: "ڈبہ", emoji: "📦" },
    wrong: [
      { name: "درخت", emoji: "🌳" },
      { name: "بلی", emoji: "🐱" },
    ],
  },
  {
    letter: "ذ",
    name: "ذال",
    correct: { name: "ذرہ", emoji: "✨" },
    wrong: [
      { name: "ڈبہ", emoji: "📦" },
      { name: "انار", emoji: "🍎" },
    ],
  },
  {
    letter: "ر",
    name: "رے",
    correct: { name: "ریچھ", emoji: "🐻" },
    wrong: [
      { name: "درخت", emoji: "🌳" },
      { name: "مچھلی", emoji: "🐟" },
    ],
  },
  {
    letter: "ز",
    name: "زے",
    correct: { name: "زیبرا", emoji: "🦓" },
    wrong: [
      { name: "ریچھ", emoji: "🐻" },
      { name: "سیب", emoji: "🍎" },
    ],
  },
  {
    letter: "ژ",
    name: "ژے",
    correct: { name: "ژالہ", emoji: "🌨️" },
    wrong: [
      { name: "زیبرا", emoji: "🦓" },
      { name: "گیند", emoji: "⚽" },
    ],
  },
  {
    letter: "س",
    name: "سین",
    correct: { name: "سیب", emoji: "🍎" },
    wrong: [
      { name: "زیبرا", emoji: "🦓" },
      { name: "چاند", emoji: "🌙" },
    ],
  },
  {
    letter: "ش",
    name: "شین",
    correct: { name: "شیر", emoji: "🦁" },
    wrong: [
      { name: "سیب", emoji: "🍎" },
      { name: "پرندہ", emoji: "🐦" },
    ],
  },
  {
    letter: "ص",
    name: "صاد",
    correct: { name: "صابن", emoji: "🧼" },
    wrong: [
      { name: "شیر", emoji: "🦁" },
      { name: "گیند", emoji: "⚽" },
    ],
  },
  {
    letter: "ض",
    name: "ضاد",
    correct: { name: "ضرورت", emoji: "💡" },
    wrong: [
      { name: "صابن", emoji: "🧼" },
      { name: "بلی", emoji: "🐱" },
    ],
  },
  {
    letter: "ط",
    name: "طوے",
    correct: { name: "طوطا", emoji: "🦜" },
    wrong: [
      { name: "شیر", emoji: "🦁" },
      { name: "درخت", emoji: "🌳" },
    ],
  },
  {
    letter: "ظ",
    name: "ظوے",
    correct: { name: "ظرف", emoji: "🫙" },
    wrong: [
      { name: "طوطا", emoji: "🦜" },
      { name: "سیب", emoji: "🍎" },
    ],
  },
  {
    letter: "ع",
    name: "عین",
    correct: { name: "عقاب", emoji: "🦅" },
    wrong: [
      { name: "ظرف", emoji: "🫙" },
      { name: "انار", emoji: "🍎" },
    ],
  },
  {
    letter: "غ",
    name: "غین",
    correct: { name: "غبارہ", emoji: "🎈" },
    wrong: [
      { name: "عقاب", emoji: "🦅" },
      { name: "گیند", emoji: "⚽" },
    ],
  },
  {
    letter: "ف",
    name: "فے",
    correct: { name: "فوجی ", emoji: "👮‍♂️" },
    wrong: [
      { name: "غبارہ", emoji: "🎈" },
      { name: "مچھلی", emoji: "🐟" },
    ],
  },
  {
    letter: "ق",
    name: "قاف",
    correct: { name: "قلم", emoji: "✏️" },
    wrong: [
      { name: "پھول", emoji: "🌸" },
      { name: "بلی", emoji: "🐱" },
    ],
  },
  {
    letter: "ک",
    name: "کاف",
    correct: { name: "کتاب", emoji: "📚" },
    wrong: [
      { name: "قلم", emoji: "✏️" },
      { name: "سیب", emoji: "🍎" },
    ],
  },
  {
    letter: "گ",
    name: "گاف",
    correct: { name: "گاجر", emoji: "🥕" },
    wrong: [
      { name: "کتاب", emoji: "📚" },
      { name: "شیر", emoji: "🦁" },
    ],
  },
  {
    letter: "ل",
    name: "لام",
    correct: { name: "لیموں", emoji: "🍋" },
    wrong: [
      { name: "گاجر", emoji: "🥕" },
      { name: "درخت", emoji: "🌳" },
    ],
  },
  {
    letter: "م",
    name: "میم",
    correct: { name: "مچھلی", emoji: "🐟" },
    wrong: [
      { name: "لیموں", emoji: "🍋" },
      { name: "گیند", emoji: "⚽" },
    ],
  },
  {
    letter: "ن",
    name: "نون",
    correct: { name: "ناریل", emoji: "🥥" },
    wrong: [
      { name: "مچھلی", emoji: "🐟" },
      { name: "سیب", emoji: "🍎" },
    ],
  },
  {
    letter: "و",
    name: "واؤ",
    correct: { name: "وین", emoji: "🚐" },
    wrong: [
      { name: "ناریل", emoji: "🥥" },
      { name: "بلی", emoji: "🐱" },
    ],
  },
  {
    letter: "ہ",
    name: "ہے",
    correct: { name: "ہاتھی", emoji: "🐘" },
    wrong: [
      { name: "وین", emoji: "🚐" },
      { name: " انار", emoji: "🍎" },
    ],
  },
  {
    letter: "ء",
    name: "ہمزہ",
    correct: { name: "آنکھ", emoji: "👁️" },
    wrong: [
      { name: "ہاتھی", emoji: "🐘" },
      { name: "گیند", emoji: "⚽" },
    ],
  },
  {
    letter: "ی",
    name: "یے",
    correct: { name: "یاک", emoji: "🐃" },
    wrong: [
      { name: "آنکھ", emoji: "👁️" },
      { name: "سیب", emoji: "🍎" },
    ],
  },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const buildQueue = (): LetterData[] =>
  RAW_DATA.map((d) => ({
    letter: d.letter,
    name: d.name,
    correct: d.correct.name,
    emoji: d.correct.emoji,
    options: shuffle([
      { name: d.correct.name, emoji: d.correct.emoji },
      ...d.wrong,
    ]),
  }));

// ─── Option Card — unchanged ──────────────────────────────────
function OptionCard({
  item,
  status,
  onTap,
  disabled,
}: {
  item: OptionItem;
  status: "idle" | "correct" | "wrong";
  onTap: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onTap}
      disabled={disabled}
      className={`flex flex-col items-center gap-1.5 transition-all duration-150
        ${
          disabled && status === "idle"
            ? "cursor-default opacity-60"
            : disabled
              ? "cursor-default"
              : "cursor-pointer active:translate-y-1"
        }`}
    >
      <div
        className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center
        relative overflow-hidden border-4 transition-all duration-300 gap-1
        ${
          status === "correct"
            ? "border-green-400 bg-green-50 shadow-[0px_5px_0px_#16a34a]"
            : status === "wrong"
              ? "border-red-400 bg-red-50 shadow-[0px_5px_0px_#dc2626]"
              : "border-yellow-300 bg-white shadow-[0px_5px_0px_#b45309]"
        }`}
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
        <span className="text-4xl sm:text-5xl select-none leading-none">
          {item.emoji}
        </span>
        <span
          className="text-xs sm:text-sm font-black text-gray-600"
          style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
        >
          {item.name}
        </span>
      </div>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function UrduMatch() {
  const navigate = useNavigate();

  const [queue] = useState<LetterData[]>(() => buildQueue());
  const [index, setIndex] = useState(0);
  const [optionStates, setOptionStates] = useState<OptionState[]>([]);
  const [score, setScore] = useState(0);
  const [answeredCorrect, setAnsweredCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const current = queue[index];
  const TOTAL = queue.length;
  const pct = Math.round((index / TOTAL) * 100);

  useEffect(() => {
    if (!current) return;
    setOptionStates(
      current.options.map((o) => ({
        name: o.name,
        emoji: o.emoji,
        status: "idle",
      })),
    );
    setAnsweredCorrect(false);
  }, [index, current]);

  // ✅ Play letter mp3 when question changes
  useEffect(() => {
    if (gameStarted && current) {
      const timer = setTimeout(() => playLetter(current.name), 200);
      return () => clearTimeout(timer);
    }
  }, [index, current, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
    playLetter(current.name); // ✅ Plays الف sound on game start
  };

  const handleTap = (i: number) => {
    if (answeredCorrect) return;
    const tapped = optionStates[i].name;
    const isCorrect = tapped === current.correct;

    if (isCorrect) {
      setOptionStates((prev) =>
        prev.map((opt) =>
          opt.name === current.correct ? { ...opt, status: "correct" } : opt,
        ),
      );
      setAnsweredCorrect(true);
      setScore((s) => s + 10);
      playCorrect();
      setTimeout(() => {
        setResults((r) => [...r, true]);
        if (index + 1 >= TOTAL) setGameOver(true);
        else setIndex((prev) => prev + 1);
      }, 1800);
    } else {
      setOptionStates((prev) =>
        prev.map((opt, idx) => (idx === i ? { ...opt, status: "wrong" } : opt)),
      );
      playWrong();
      setTimeout(() => {
        setOptionStates((prev) =>
          prev.map((opt, idx) =>
            idx === i ? { ...opt, status: "idle" } : opt,
          ),
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
  };

  if (!gameStarted) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
        <button
          onClick={handleStartGame}
          className="bg-green-500 text-white px-10 py-6 rounded-3xl font-black text-2xl shadow-[0px_8px_0px_#15803d] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center gap-2"
        >
          <span>کھیل شروع کریں! ▶️</span>
          <span className="text-sm font-normal opacity-80">(Start Game)</span>
        </button>
      </div>
    );
  }

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
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-3">
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
              className="flex-1 py-3 bg-green-600 text-white font-bold rounded-2xl text-sm shadow-[0px_4px_0px_#15803d] active:translate-y-1 active:shadow-none transition-all"
            >
              🔄 دوبارہ کھیلو
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-3 sm:px-6 py-4 gap-4 md:gap-5">
      <div className="w-full max-w-lg">
        <div className="bg-gray-200 h-4 w-full rounded-full border-2 border-gray-300 overflow-hidden">
          <div
            className="bg-green-400 h-full rounded-r-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 px-1">
          <span className="text-xs sm:text-sm font-bold text-green-600">
            حرف {index + 1} / {TOTAL}
          </span>
          <span className="text-xs sm:text-sm font-bold text-yellow-600">
            ⭐ {score}
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          onClick={() => playLetter(current.name)}
          className="cursor-pointer w-32 h-40 sm:w-40 sm:h-52 bg-white border-4 border-green-500 rounded-[2rem] flex flex-col items-center justify-center shadow-[0px_8px_0px_rgba(0,0,0,0.15)] overflow-hidden relative gap-1 active:scale-95 transition-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-50 to-transparent" />
          <span
            className="text-7xl sm:text-8xl font-black text-green-600 select-none leading-none z-10"
            style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
          >
            {current.letter}
          </span>
          <span
            className="text-sm font-bold text-green-400 z-10"
            style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
          >
            {current.name}
          </span>
        </div>
        <button
          onClick={() => playLetter(current.name)}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-lg z-20 hover:bg-green-600 active:scale-90 transition-all"
        >
          🔊
        </button>
        <div className="absolute -bottom-2 -right-12 sm:-right-16 pointer-events-none">
          <span className="text-5xl sm:text-6xl select-none block">👧</span>
        </div>
      </div>

      <div className="text-center mt-5 sm:mt-3 px-4">
        <h2 className="text-base sm:text-xl font-black text-gray-800 mb-1">
          صحیح تصویر چنیں!
        </h2>
        <p
          className="text-xs sm:text-sm text-gray-500 font-medium"
          style={{ fontFamily: "Noto Nastaliq Urdu, serif" }}
        >
          وہ تصویر چُنو جو '{current.letter}' سے شروع ہو
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md px-2">
        {optionStates.map((opt, i) => (
          <OptionCard
            key={`${index}-${opt.name}`}
            item={{ name: opt.name, emoji: opt.emoji }}
            status={opt.status}
            onTap={() => handleTap(i)}
            disabled={answeredCorrect}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 max-w-xs mt-1">
        {results.map((r, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${r ? "bg-green-400" : "bg-red-400"}`}
          />
        ))}
        {index < TOTAL && (
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        )}
      </div>
    </div>
  );
}
