import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePakistanBase } from "../hooks/usePakistanBase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { gamesList, quizQuestions, encouragements, hints } from "../data/content";
import { provinces } from "../data/provinces";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Confetti } from "../components/ui/Confetti";
import { ProgressBar } from "../components/ui/ProgressBar";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import type { GameId } from "../types";

export function GamePlayPage() {
  const base = usePakistanBase();
  const { gameId } = useParams();
  const game = gamesList.find((g) => g.id === gameId);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="font-bold">Game not found</p>
          <Link to={`${base}/games`}>
            <Button className="mt-3">Back</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="game" />
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <Link to={`${base}/games`} className="inline-flex items-center gap-1 font-bold text-emerald-800 mb-4">
          <ArrowLeft className="h-4 w-4" /> Games
        </Link>
        <h1 className="text-2xl md:text-4xl font-black text-emerald-900 mb-1">
          {game.emoji} {game.title}
        </h1>
        <p className="font-bold text-emerald-700 mb-6">{game.description}</p>
        <GameEngine gameId={game.id} />
      </div>
    </div>
  );
}

function GameEngine({ gameId }: { gameId: GameId }) {
  switch (gameId) {
    case "match-capitals":
      return <MatchCapitalsGame />;
    case "animal-memory":
      return <MemoryGame />;
    case "flag-builder":
      return <FlagBuilderGame />;
    case "guess-landmark":
      return <GuessLandmarkGame />;
    case "food-match":
      return <FoodMatchGame />;
    case "timeline":
      return <TimelineGame />;
    case "balloon-pop":
      return <BalloonPopGame />;
    case "trivia":
      return <TriviaGame />;
    case "map-drag":
      return <MapDragGame />;
    case "dress-match":
      return <DressMatchGame />;
    case "treasure-hunt":
      return <TreasureHuntGame />;
    case "word-search":
      return <WordSearchGame />;
    default:
      return <TriviaGame />;
  }
}

function ResultScreen({
  score,
  max,
  onReplay,
  base,
}: {
  score: number;
  max: number;
  onReplay: () => void;
  base: string;
}) {
  const ratio = max > 0 ? score / max : 0;
  return (
    <Card className="text-center relative overflow-hidden">
      {ratio >= 0.7 && <Confetti count={30} />}
      <motion.div
        className="text-7xl mb-3"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.6 }}
      >
        {ratio === 1 ? "🏆" : ratio >= 0.7 ? "⭐" : "💪"}
      </motion.div>
      <h2 className="text-2xl font-black text-emerald-900">
        {ratio === 1 ? "Perfect!" : ratio >= 0.7 ? "Great job!" : "Nice try!"}
      </h2>
      <p className="font-bold text-emerald-700 mt-1">
        Score: {score}/{max}
      </p>
      <p className="text-sm font-semibold text-slate-500 mt-1">
        {encouragements[Math.floor(Math.random() * encouragements.length)]}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <Button onClick={onReplay}>Play Again</Button>
      <Link to={window.location.pathname.startsWith("/pakistan-mobile") ? "/pakistan-mobile/games" : "/pakistan/games"}>
          <Button variant="ghost">More Games</Button>
        </Link>
      </div>
    </Card>
  );
}

function MatchCapitalsGame() {
  const pairs = useMemo(
    () =>
      provinces
        .filter((p) => p.id !== "islamabad")
        .map((p) => ({ province: p.name, capital: p.capital, emoji: p.emoji })),
    []
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState<string | null>(null);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);

  const capitals = useMemo(
    () => [...pairs.map((p) => p.capital)].sort(() => Math.random() - 0.5),
    [pairs]
  );

  const pick = (capital: string) => {
    if (matched.includes(capital) || !selected) {
      // select province first via selected being province name
    }
  };

  const selectProvince = (name: string) => {
    if (matched.includes(name)) return;
    setSelected(name);
  };

  const selectCapital = (capital: string) => {
    if (!selected || matched.includes(capital)) return;
    const pair = pairs.find((p) => p.province === selected);
    if (pair?.capital === capital) {
      const nextMatched = [...matched, selected, capital];
      setMatched(nextMatched);
      setScore((s) => s + 1);
      setSelected(null);
      if (sound) sfx.success();
      setZaheen("Correct match! ⭐", "celebrate");
      if (nextMatched.length >= pairs.length * 2) {
        setDone(true);
        completeGame("match-capitals", pairs.length, pairs.length);
      }
    } else {
      if (sound) sfx.wrong();
      setShake(capital);
      setZaheen(hints[0], "thinking");
      setTimeout(() => setShake(null), 500);
      setSelected(null);
    }
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={pairs.length}
        onReplay={() => {
          setMatched([]);
          setScore(0);
          setDone(false);
          setSelected(null);
        }}
      />
    );
  }

  // fix pick unused
  void pick;

  return (
    <div>
      <ProgressBar value={score} max={pairs.length} label="Matches" showLabel className="mb-4" />
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-black text-emerald-900 mb-3">Provinces</h3>
          <div className="space-y-2">
            {pairs.map((p) => {
              const isMatched = matched.includes(p.province);
              return (
                <button
                  key={p.province}
                  disabled={isMatched}
                  onClick={() => selectProvince(p.province)}
                  className={`w-full rounded-xl px-3 py-3 text-left font-bold border-2 transition ${
                    isMatched
                      ? "bg-emerald-100 border-emerald-300 text-emerald-700 opacity-60"
                      : selected === p.province
                        ? "bg-amber-100 border-amber-400 text-amber-900"
                        : "bg-white border-slate-100 hover:border-emerald-300"
                  }`}
                >
                  {p.emoji} {p.province}
                </button>
              );
            })}
          </div>
        </Card>
        <Card>
          <h3 className="font-black text-emerald-900 mb-3">Capitals</h3>
          <div className="space-y-2">
            {capitals.map((c) => {
              const isMatched = matched.includes(c);
              return (
                <motion.button
                  key={c}
                  disabled={isMatched}
                  onClick={() => selectCapital(c)}
                  animate={shake === c ? { x: [-8, 8, -8, 8, 0] } : {}}
                  className={`w-full rounded-xl px-3 py-3 text-left font-bold border-2 transition ${
                    isMatched
                      ? "bg-emerald-100 border-emerald-300 text-emerald-700 opacity-60"
                      : "bg-white border-slate-100 hover:border-sky-300"
                  }`}
                >
                  🏙️ {c}
                </motion.button>
              );
            })}
          </div>
        </Card>
      </div>
      <p className="mt-3 text-center text-sm font-bold text-emerald-700">
        {selected ? `Selected: ${selected} — now pick its capital!` : "Tap a province, then its capital!"}
      </p>
    </div>
  );
}

function MemoryGame() {
  const animals = useMemo(
    () =>
      [
        { id: "a1", emoji: "🐐", name: "Markhor" },
        { id: "a2", emoji: "🐆", name: "Snow Leopard" },
        { id: "a3", emoji: "🐬", name: "Dolphin" },
        { id: "a4", emoji: "🐪", name: "Camel" },
        { id: "a5", emoji: "🦚", name: "Peacock" },
        { id: "a6", emoji: "🐢", name: "Turtle" },
      ].flatMap((a) => [
        { ...a, key: a.id + "-1" },
        { ...a, key: a.id + "-2" },
      ])
        .sort(() => Math.random() - 0.5),
    []
  );

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);
  const [done, setDone] = useState(false);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const flip = (key: string, id: string) => {
    if (lock || flipped.includes(key) || matched.includes(id)) return;
    const next = [...flipped, key];
    setFlipped(next);
    if (sound) sfx.pop();

    if (next.length === 2) {
      setLock(true);
      setMoves((m) => m + 1);
      const [k1, k2] = next;
      const c1 = animals.find((a) => a.key === k1)!;
      const c2 = animals.find((a) => a.key === k2)!;
      if (c1.id === c2.id) {
        const nextMatched = [...matched, c1.id];
        setMatched(nextMatched);
        setFlipped([]);
        setLock(false);
        if (sound) sfx.success();
        if (nextMatched.length === 6) {
          setDone(true);
          const score = Math.max(1, 12 - moves);
          completeGame("animal-memory", score, 12);
        }
      } else {
        if (sound) sfx.wrong();
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 700);
      }
    }
  };

  if (done) {
    return (
      <ResultScreen
        score={Math.max(1, 12 - moves)}
        max={12}
        onReplay={() => {
          setFlipped([]);
          setMatched([]);
          setMoves(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <div>
      <p className="font-bold text-emerald-800 mb-3 text-center">Moves: {moves}</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {animals.map((a) => {
          const isUp = flipped.includes(a.key) || matched.includes(a.id);
          return (
            <motion.button
              key={a.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => flip(a.key, a.id)}
              className={`aspect-square rounded-2xl border-2 shadow-md flex items-center justify-center text-4xl font-black ${
                matched.includes(a.id)
                  ? "bg-emerald-100 border-emerald-300"
                  : isUp
                    ? "bg-white border-amber-300"
                    : "bg-gradient-to-br from-green-500 to-emerald-700 border-emerald-600 text-white"
              }`}
            >
              {isUp ? a.emoji : "❓"}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function FlagBuilderGame() {
  const pieces = [
    { id: "green", label: "Green field", correct: 0, color: "bg-green-700" },
    { id: "white", label: "White stripe", correct: 1, color: "bg-white border" },
    { id: "crescent", label: "Crescent 🌙", correct: 2, color: "bg-emerald-100" },
    { id: "star", label: "Star ⭐", correct: 3, color: "bg-amber-100" },
  ];
  const [order, setOrder] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("Build the flag in the correct order!");
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);
  const addCollectible = useGameStore((s) => s.addCollectible);

  const addPiece = (id: string) => {
    if (order.includes(id) || done) return;
    const next = [...order, id];
    setOrder(next);
    if (sound) sfx.click();
    if (next.length === 4) {
      const correct = pieces.every((p, i) => next[i] === p.id);
      if (correct) {
        setDone(true);
        setMessage("Perfect flag! Pakistan Zindabad!");
        if (sound) sfx.celebrate();
        completeGame("flag-builder", 4, 4);
        addCollectible("col-flag");
      } else {
        setMessage("Not quite — try a different order!");
        if (sound) sfx.wrong();
        setTimeout(() => {
          setOrder([]);
          setMessage("Remember: Green field, white stripe, crescent, then star!");
        }, 1000);
      }
    }
  };

  if (done) {
    return (
      <ResultScreen
        score={4}
        max={4}
        onReplay={() => {
          setOrder([]);
          setDone(false);
          setMessage("Build the flag in the correct order!");
        }}
      />
    );
  }

  return (
    <div>
      <Card className="mb-4 text-center">
        <div className="mx-auto h-28 w-48 rounded-xl overflow-hidden border-4 border-slate-200 flex shadow-inner">
          {order.includes("green") && <div className="flex-[3] bg-green-700 relative">
            {order.includes("crescent") && (
              <span className="absolute left-1/3 top-1/2 -translate-y-1/2 text-white text-2xl">🌙</span>
            )}
            {order.includes("star") && (
              <span className="absolute left-1/2 top-1/2 -translate-y-1/2 text-white text-lg">⭐</span>
            )}
          </div>}
          {order.includes("white") && <div className="flex-1 bg-white" />}
        </div>
        <p className="mt-3 font-bold text-emerald-800">{message}</p>
        <p className="text-xs font-semibold text-slate-500">Steps: {order.length}/4</p>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        {pieces.map((p) => (
          <Button
            key={p.id}
            variant={order.includes(p.id) ? "ghost" : "primary"}
            disabled={order.includes(p.id)}
            onClick={() => addPiece(p.id)}
            className="h-16"
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

function GuessLandmarkGame() {
  const landmarks = useMemo(
    () =>
      [
        { emoji: "🕌", name: "Badshahi Mosque", clue: "Giant red mosque in Lahore built by a Mughal emperor" },
        { emoji: "🗼", name: "Minar-e-Pakistan", clue: "Tower where the Pakistan Resolution was passed" },
        { emoji: "🕌", name: "Faisal Mosque", clue: "Tent-shaped mosque in Islamabad" },
        { emoji: "🏛️", name: "Mazar-e-Quaid", clue: "White marble resting place of Quaid-e-Azam in Karachi" },
        { emoji: "🗻", name: "K2", clue: "Second highest mountain on Earth" },
        { emoji: "🏺", name: "Mohenjo-daro", clue: "Ancient Indus Valley city over 4,500 years old" },
      ].sort(() => Math.random() - 0.5),
    []
  );
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState("");
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const current = landmarks[index];
  const options = useMemo(() => {
    const others = landmarks.filter((l) => l.name !== current.name).slice(0, 3).map((l) => l.name);
    return [...others, current.name].sort(() => Math.random() - 0.5);
  }, [current, landmarks]);

  const answer = (name: string) => {
    const correct = name === current.name;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback("Yes! " + encouragements[0]);
      if (sound) sfx.success();
    } else {
      setFeedback(`It's ${current.name}! Keep going!`);
      if (sound) sfx.wrong();
    }
    setTimeout(() => {
      setFeedback("");
      if (index + 1 >= landmarks.length) {
        setDone(true);
        completeGame("guess-landmark", score + (correct ? 1 : 0), landmarks.length);
      } else {
        setIndex((i) => i + 1);
      }
    }, 900);
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={landmarks.length}
        onReplay={() => {
          setIndex(0);
          setScore(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Card className="text-center">
      <ProgressBar value={index} max={landmarks.length} className="mb-4" />
      <motion.div className="text-7xl mb-3" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        {current.emoji}
      </motion.div>
      <p className="font-bold text-emerald-800 text-lg mb-4">{current.clue}</p>
      <div className="grid gap-2">
        {options.map((o) => (
          <Button key={o} variant="ghost" onClick={() => answer(o)} disabled={!!feedback}>
            {o}
          </Button>
        ))}
      </div>
      <AnimatePresence>
        {feedback && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-extrabold text-amber-600"
          >
            {feedback}
          </motion.p>
        )}
      </AnimatePresence>
    </Card>
  );
}

function FoodMatchGame() {
  const items = useMemo(
    () =>
      [
        { food: "Sindhi Biryani", province: "Sindh", emoji: "🍛" },
        { food: "Chapli Kebab", province: "Khyber Pakhtunkhwa", emoji: "🥩" },
        { food: "Sajji", province: "Balochistan", emoji: "🍖" },
        { food: "Nihari", province: "Punjab", emoji: "🍲" },
        { food: "Mamtu", province: "Gilgit-Baltistan", emoji: "🥟" },
        { food: "Pink Tea", province: "Azad Kashmir", emoji: "🍵" },
      ].sort(() => Math.random() - 0.5),
    []
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);
  const viewFood = useGameStore((s) => s.viewFood);

  const current = items[idx];
  const options = useMemo(() => {
    const all = items.map((i) => i.province);
    return [...new Set([current.province, ...all])].slice(0, 4).sort(() => Math.random() - 0.5);
  }, [current, items]);

  const pick = (p: string) => {
    const ok = p === current.province;
    viewFood(`food-game-${current.food}`);
    if (ok) {
      setScore((s) => s + 1);
      if (sound) sfx.success();
    } else if (sound) sfx.wrong();
    if (idx + 1 >= items.length) {
      setDone(true);
      completeGame("food-match", score + (ok ? 1 : 0), items.length);
    } else setIdx((i) => i + 1);
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={items.length}
        onReplay={() => {
          setIdx(0);
          setScore(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Card className="text-center">
      <motion.div className="text-7xl mb-2" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        {current.emoji}
      </motion.div>
      <h2 className="text-xl font-black text-emerald-900 mb-1">{current.food}</h2>
      <p className="font-bold text-slate-500 mb-4">Which province is this food from?</p>
      <div className="grid gap-2">
        {options.map((o) => (
          <Button key={o} variant="soft" onClick={() => pick(o)}>
            {o}
          </Button>
        ))}
      </div>
      <p className="mt-3 text-sm font-bold text-emerald-700">
        {idx + 1}/{items.length}
      </p>
    </Card>
  );
}

function TimelineGame() {
  const events = useMemo(
    () => [
      { id: "e1", year: "1930", text: "Iqbal shares the dream of a homeland" },
      { id: "e2", year: "1940", text: "Pakistan Resolution in Lahore" },
      { id: "e3", year: "1947", text: "Pakistan becomes independent!" },
      { id: "e4", year: "1948", text: "Quaid-e-Azam passes away" },
      { id: "e5", year: "1956", text: "Pakistan becomes a Republic" },
    ],
    []
  );
  const [shuffled, setShuffled] = useState(() => [...events].sort(() => Math.random() - 0.5));
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const move = (index: number, dir: -1 | 1) => {
    const next = [...shuffled];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setShuffled(next);
  };

  const check = () => {
    let s = 0;
    shuffled.forEach((e, i) => {
      if (e.id === events[i].id) s++;
    });
    setScore(s);
    setDone(true);
    if (sound) (s === events.length ? sfx.celebrate : sfx.success)();
    completeGame("timeline", s, events.length);
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={events.length}
        onReplay={() => {
          setShuffled([...events].sort(() => Math.random() - 0.5));
          setDone(false);
          setScore(0);
        }}
      />
    );
  }

  return (
    <Card>
      <p className="font-bold text-emerald-800 mb-4 text-center">
        Put history in order — oldest at the top!
      </p>
      <div className="space-y-2">
        {shuffled.map((e, i) => (
          <div
            key={e.id}
            className="flex items-center gap-2 rounded-xl bg-white border-2 border-emerald-50 p-3"
          >
            <div className="flex flex-col gap-1">
              <button
                className="rounded bg-emerald-100 px-2 text-xs font-black"
                onClick={() => move(i, -1)}
              >
                ↑
              </button>
              <button
                className="rounded bg-emerald-100 px-2 text-xs font-black"
                onClick={() => move(i, 1)}
              >
                ↓
              </button>
            </div>
            <div>
              <p className="font-black text-amber-600">{e.year}</p>
              <p className="font-bold text-emerald-900 text-sm">{e.text}</p>
            </div>
          </div>
        ))}
      </div>
      <Button className="w-full mt-4" onClick={check}>
        Check Order ✓
      </Button>
    </Card>
  );
}

function BalloonPopGame() {
  const qs = useMemo(
    () => quizQuestions.filter((q) => q.difficulty === "easy").slice(0, 5),
    []
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [popped, setPopped] = useState<number | null>(null);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const q = qs[idx];
  if (!q) return null;

  const pop = (i: number) => {
    setPopped(i);
    const ok = i === q.correctIndex;
    if (ok) {
      setScore((s) => s + 1);
      if (sound) sfx.pop();
      setTimeout(() => sound && sfx.success(), 150);
    } else if (sound) sfx.wrong();

    setTimeout(() => {
      setPopped(null);
      if (idx + 1 >= qs.length) {
        setDone(true);
        completeGame("balloon-pop", score + (ok ? 1 : 0), qs.length);
      } else setIdx((x) => x + 1);
    }, 700);
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={qs.length}
        onReplay={() => {
          setIdx(0);
          setScore(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Card className="text-center">
      <p className="font-black text-emerald-900 text-lg mb-4">{q.emoji} {q.question}</p>
      <div className="grid grid-cols-2 gap-4">
        {q.options.map((opt, i) => (
          <motion.button
            key={opt}
            onClick={() => pop(i)}
            disabled={popped !== null}
            animate={
              popped === i
                ? { scale: 0, opacity: 0 }
                : { y: [0, -10, 0] }
            }
            transition={
              popped === i
                ? { duration: 0.4 }
                : { repeat: Infinity, duration: 2 + i * 0.3 }
            }
            className="relative flex flex-col items-center"
          >
            <span className="text-5xl">🎈</span>
            <span className="mt-1 rounded-xl bg-white px-2 py-1 text-xs font-extrabold text-emerald-800 shadow border">
              {opt}
            </span>
          </motion.button>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold text-emerald-700">
        Pop the correct balloon! {idx + 1}/{qs.length}
      </p>
    </Card>
  );
}

function TriviaGame() {
  const qs = useMemo(
    () => [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5),
    []
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const q = qs[idx];
  if (!q) return null;

  const choose = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const ok = i === q.correctIndex;
    if (ok) {
      setScore((s) => s + 1);
      if (sound) sfx.success();
    } else if (sound) sfx.wrong();
    setTimeout(() => {
      setSelected(null);
      setHint(false);
      if (idx + 1 >= qs.length) {
        setDone(true);
        completeGame("trivia", score + (ok ? 1 : 0), qs.length);
      } else setIdx((x) => x + 1);
    }, 900);
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={qs.length}
        onReplay={() => {
          setIdx(0);
          setScore(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Card>
      <ProgressBar value={idx} max={qs.length} label="Questions" showLabel className="mb-4" />
      <p className="text-3xl text-center mb-2">{q.emoji}</p>
      <h2 className="text-xl font-black text-emerald-900 text-center mb-4">{q.question}</h2>
      <div className="grid gap-2">
        {q.options.map((opt, i) => {
          let cls = "bg-white border-slate-100";
          if (selected !== null) {
            if (i === q.correctIndex) cls = "bg-emerald-100 border-emerald-400";
            else if (i === selected) cls = "bg-rose-100 border-rose-300";
          }
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.98 }}
              animate={selected === i && i !== q.correctIndex ? { x: [-6, 6, -6, 0] } : {}}
              onClick={() => choose(i)}
              className={`rounded-xl border-2 px-4 py-3 text-left font-bold text-emerald-900 ${cls}`}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
      <div className="mt-3 text-center">
        <Button size="sm" variant="ghost" onClick={() => setHint(true)}>
          Need a hint? 💡
        </Button>
        {hint && <p className="mt-2 text-sm font-bold text-amber-600">{q.hint}</p>}
      </div>
    </Card>
  );
}

function MapDragGame() {
  const items = useMemo(
    () =>
      provinces.map((p) => ({ id: p.id, name: p.name, emoji: p.emoji, color: p.color })),
    []
  );
  const [pool, setPool] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [slots, setSlots] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(items.map((i) => [i.id, null]))
  );
  const [active, setActive] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const place = (slotId: string) => {
    if (!active || slots[slotId]) return;
    const next = { ...slots, [slotId]: active };
    setSlots(next);
    setPool((p) => p.filter((x) => x.id !== active));
    const ok = active === slotId;
    if (ok && sound) sfx.success();
    else if (!ok && sound) sfx.wrong();
    setActive(null);

    if (Object.values(next).every(Boolean)) {
      let s = 0;
      Object.entries(next).forEach(([k, v]) => {
        if (k === v) s++;
      });
      setScore(s);
      setDone(true);
      completeGame("map-drag", s, items.length);
    }
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={items.length}
        onReplay={() => {
          setPool([...items].sort(() => Math.random() - 0.5));
          setSlots(Object.fromEntries(items.map((i) => [i.id, null])));
          setDone(false);
          setScore(0);
        }}
      />
    );
  }

  return (
    <div>
      <p className="font-bold text-center text-emerald-800 mb-3">
        Tap a province chip, then tap the matching slot!
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[48px]">
        {pool.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.id)}
            className={`rounded-full px-3 py-2 text-sm font-extrabold border-2 shadow ${
              active === p.id ? "border-amber-400 bg-amber-100 scale-110" : "border-white bg-white"
            }`}
          >
            {p.emoji} {p.name.split(" ")[0]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((slot) => {
          const placed = slots[slot.id];
          const placedItem = items.find((i) => i.id === placed);
          return (
            <button
              key={slot.id}
              onClick={() => place(slot.id)}
              className="rounded-2xl border-2 border-dashed border-emerald-300 bg-white/70 p-4 min-h-[80px] text-left"
              style={{ borderColor: slot.color }}
            >
              <p className="text-xs font-bold text-slate-500 mb-1">Slot: {slot.name}</p>
              {placedItem ? (
                <p className="font-black text-emerald-900">
                  {placedItem.emoji} {placedItem.name}
                  {placed === slot.id ? " ✓" : " ✗"}
                </p>
              ) : (
                <p className="text-sm font-bold text-slate-400">Drop here</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DressMatchGame() {
  const items = useMemo(
    () =>
      provinces.map((p) => ({
        province: p.name,
        dress: p.traditionalDress.name,
        emoji: p.traditionalDress.emoji,
      })),
    []
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  const current = items[idx];
  const options = useMemo(() => {
    return [...items.map((i) => i.province)].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [items, idx]);

  // ensure correct option present
  const opts = options.includes(current.province)
    ? options
    : [current.province, ...options.slice(0, 3)];

  const pick = (p: string) => {
    const ok = p === current.province;
    if (ok) {
      setScore((s) => s + 1);
      if (sound) sfx.success();
    } else if (sound) sfx.wrong();
    if (idx + 1 >= Math.min(5, items.length)) {
      setDone(true);
      completeGame("dress-match", score + (ok ? 1 : 0), Math.min(5, items.length));
    } else setIdx((i) => i + 1);
  };

  if (done) {
    return (
      <ResultScreen
        score={score}
        max={Math.min(5, items.length)}
        onReplay={() => {
          setIdx(0);
          setScore(0);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Card className="text-center">
      <div className="text-6xl mb-2">{current.emoji}</div>
      <h2 className="font-black text-emerald-900 text-lg mb-1">{current.dress}</h2>
      <p className="font-bold text-slate-500 mb-4">Which region wears this?</p>
      <div className="grid gap-2">
        {opts.map((o) => (
          <Button key={o} variant="ghost" onClick={() => pick(o)}>
            {o}
          </Button>
        ))}
      </div>
    </Card>
  );
}

function TreasureHuntGame() {
  const spots = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        hasStar: [1, 4, 7, 9, 11].includes(i),
        emoji: ["🏔️", "🌊", "🕌", "🌾", "🏜️", "🌲", "🏛️", "🐪", "🐐", "🌸", "⭐", "💎"][i],
      })),
    []
  );
  const [found, setFound] = useState<number[]>([]);
  const [opened, setOpened] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);
  const totalStars = spots.filter((s) => s.hasStar).length;

  const open = (id: number) => {
    if (opened.includes(id) || done) return;
    setOpened((o) => [...o, id]);
    const spot = spots[id];
    if (spot.hasStar) {
      const next = [...found, id];
      setFound(next);
      if (sound) sfx.star();
      if (next.length >= totalStars) {
        setDone(true);
        completeGame("treasure-hunt", totalStars, totalStars);
        if (sound) sfx.celebrate();
      }
    } else if (sound) sfx.click();
  };

  if (done) {
    return (
      <ResultScreen
        score={found.length}
        max={totalStars}
        onReplay={() => {
          setFound([]);
          setOpened([]);
          setDone(false);
        }}
      />
    );
  }

  return (
    <div>
      <p className="text-center font-bold text-emerald-800 mb-3">
        Find hidden stars across Pakistan! ⭐ {found.length}/{totalStars}
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {spots.map((s) => {
          const isOpen = opened.includes(s.id);
          return (
            <motion.button
              key={s.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => open(s.id)}
              className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center shadow-md ${
                isOpen
                  ? s.hasStar
                    ? "bg-amber-100 border-amber-300"
                    : "bg-slate-50 border-slate-200"
                  : "bg-gradient-to-br from-teal-400 to-cyan-600 border-teal-500"
              }`}
            >
              <span className="text-3xl">{isOpen ? s.emoji : "📦"}</span>
              {isOpen && s.hasStar && <span className="text-lg">⭐</span>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function WordSearchGame() {
  const words = ["PAKISTAN", "INDUS", "K2", "FLAG", "JINNAH"];
  const [found, setFound] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const completeGame = useGameStore((s) => s.completeGame);
  const sound = useGameStore((s) => s.soundEnabled);

  // Simple letter grid containing the words
  const grid = useMemo(
    () => [
      ["P", "A", "K", "I", "S", "T", "A", "N"],
      ["Q", "I", "N", "D", "U", "S", "X", "M"],
      ["J", "I", "N", "N", "A", "H", "B", "C"],
      ["F", "L", "A", "G", "K", "2", "Y", "Z"],
      ["L", "A", "H", "O", "R", "E", "W", "V"],
    ],
    []
  );

  const submit = () => {
    const w = input.trim().toUpperCase();
    if (words.includes(w) && !found.includes(w)) {
      const next = [...found, w];
      setFound(next);
      setInput("");
      if (sound) sfx.success();
      if (next.length === words.length) {
        setDone(true);
        completeGame("word-search", words.length, words.length);
      }
    } else {
      if (sound) sfx.wrong();
      setInput("");
    }
  };

  if (done) {
    return (
      <ResultScreen
        score={found.length}
        max={words.length}
        onReplay={() => {
          setFound([]);
          setDone(false);
        }}
      />
    );
  }

  return (
    <Card>
      <p className="font-bold text-center text-emerald-800 mb-3">
        Find these words: {words.map((w) => (found.includes(w) ? `✅${w}` : w)).join(" · ")}
      </p>
      <div className="inline-grid grid-cols-8 gap-1 mx-auto mb-4">
        {grid.flat().map((letter, i) => (
          <div
            key={i}
            className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg bg-emerald-50 font-black text-emerald-900 text-sm"
          >
            {letter}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Type a word you found..."
          className="flex-1 rounded-xl border-2 border-emerald-100 px-4 py-2 font-bold outline-none focus:border-emerald-400"
        />
        <Button onClick={submit}>Find</Button>
      </div>
      <p className="mt-2 text-center text-sm font-bold text-amber-600">
        Found {found.length}/{words.length}
      </p>
    </Card>
  );
}
