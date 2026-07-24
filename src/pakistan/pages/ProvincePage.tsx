import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePakistanBase } from "../hooks/usePakistanBase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Cloud, CloudRain, Sun, Snowflake } from "lucide-react";
import { getProvince } from "../data/provinces";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { NarrationBar } from "../components/layout/NarrationBar";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useGameStore } from "../store/useGameStore";
import type { ProvinceId } from "../types";

const tabs = ["Overview", "Cities", "Food", "Animals", "Culture", "Fun Facts"] as const;

export function ProvincePage() {
  const base = usePakistanBase();
  const { id } = useParams();
  const province = getProvince(id || "");
  const visitProvince = useGameStore((s) => s.visitProvince);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const viewFood = useGameStore((s) => s.viewFood);
  const viewAnimal = useGameStore((s) => s.viewAnimal);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [weatherAnim, setWeatherAnim] = useState(0);

  useEffect(() => {
    if (province) {
      visitProvince(province.id as ProvinceId);
      setZaheen(`Welcome to ${province.name}! ${province.emoji}`, "excited");
    }
  }, [province, visitProvince, setZaheen]);

  useEffect(() => {
    const t = setInterval(() => setWeatherAnim((w) => w + 1), 3000);
    return () => clearInterval(t);
  }, []);

  if (!province) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="font-bold">Province not found!</p>
      <Link to={`${base}/map`}>
            <Button className="mt-3">Back to Map</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const bgVariant =
    province.id === "gilgit" || province.id === "kashmir"
      ? "mountain"
      : province.id === "balochistan"
        ? "desert"
        : province.id === "sindh"
          ? "sea"
          : "province";

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant={bgVariant} />

      <div className="mx-auto max-w-5xl px-4 pt-4">
       <Link to={`${base}/map`} className="inline-flex items-center gap-1 font-bold text-emerald-800 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Map
        </Link>
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${province.gradient} p-6 md:p-10 text-white shadow-2xl mb-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <motion.span
              className="text-7xl md:text-8xl"
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              {province.emoji}
            </motion.span>
            <div className="flex-1">
              <p className="font-bold text-white/80 text-sm mb-1">{province.nameUrdu}</p>
              <h1 className="text-3xl md:text-5xl font-black text-shadow-strong">
                {province.name}
              </h1>
              <p className="mt-2 font-semibold text-white/95 max-w-xl">{province.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Chip>🏛️ {province.capital}</Chip>
                <Chip>👥 {province.population}</Chip>
                <Chip>📐 {province.area}</Chip>
                <Chip>🗣️ {province.language[0]}</Chip>
              </div>
            </div>
            <CaptainZaheen size="md" showBubble={false} className="hidden md:flex" />
          </div>

          {/* Floating decorations */}
          <motion.div
            className="absolute top-4 right-8 text-3xl opacity-40"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            ☁️
          </motion.div>
        </motion.div>

        <NarrationBar text={province.narration} className="mb-6" />

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-extrabold transition ${
                tab === t
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-white/80 text-emerald-800 hover:bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {tab === "Overview" && (
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <h3 className="font-black text-emerald-900 text-lg mb-2">📜 History</h3>
                  <p className="font-semibold text-slate-600">{province.history}</p>
                </Card>
                <Card>
                  <h3 className="font-black text-emerald-900 text-lg mb-2">👗 Traditional Dress</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{province.traditionalDress.emoji}</span>
                    <div>
                      <p className="font-extrabold text-emerald-800">
                        {province.traditionalDress.name}
                      </p>
                      <p className="text-sm font-semibold text-slate-600">
                        {province.traditionalDress.description}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <h3 className="font-black text-emerald-900 text-lg mb-2 flex items-center gap-2">
                    Weather
                    {weatherAnim % 4 === 0 ? (
                      <Sun className="h-5 w-5 text-amber-500" />
                    ) : weatherAnim % 4 === 1 ? (
                      <Cloud className="h-5 w-5 text-slate-400" />
                    ) : weatherAnim % 4 === 2 ? (
                      <CloudRain className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Snowflake className="h-5 w-5 text-sky-400" />
                    )}
                  </h3>
                  <p className="font-semibold text-slate-600">{province.weather}</p>
                  <div className="mt-3 flex gap-2 text-2xl">
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                      ☀️
                    </motion.span>
                    <motion.span animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                      ☁️
                    </motion.span>
                    {(province.id === "gilgit" || province.id === "kashmir") && (
                      <motion.span
                        animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        ❄️
                      </motion.span>
                    )}
                  </div>
                </Card>
                <Card>
                  <h3 className="font-black text-emerald-900 text-lg mb-2">🎵 Music</h3>
                  <p className="font-semibold text-slate-600">{province.music}</p>
                  <motion.div
                    className="mt-3 flex gap-1"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    {["🎵", "🎶", "🥁", "🎤"].map((m, i) => (
                      <motion.span
                        key={m}
                        className="text-2xl"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                      >
                        {m}
                      </motion.span>
                    ))}
                  </motion.div>
                </Card>
              </div>
            )}

            {tab === "Cities" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {province.cities.map((city, i) => (
                  <motion.div
                    key={city.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                  <Link to={`${base}/province/${province.id}/city/${city.id}`}>
                      <Card className="h-full cursor-pointer hover:ring-2 hover:ring-emerald-300">
                        <div className="flex items-start gap-3">
                          <span className="text-4xl">{city.emoji}</span>
                          <div>
                            <h3 className="font-black text-emerald-900 text-lg">{city.name}</h3>
                            <p className="text-sm font-semibold text-slate-600 line-clamp-2">
                              {city.description}
                            </p>
                            <p className="mt-2 text-xs font-extrabold text-amber-600">
                              Enter city adventure →
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "Food" && (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {province.famousFoods.map((food) => (
                  <Card
                    key={food.id}
                    className="text-center cursor-pointer"
                    onClick={() => {
                      viewFood(food.id);
                      setZaheen(`Yum! ${food.name} is delicious!`, "happy");
                    }}
                  >
                    <motion.div
                      className="text-6xl mb-2"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {food.emoji}
                    </motion.div>
                    {/* Steam */}
                    <div className="relative h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="absolute left-1/2 text-slate-300 text-xs"
                          style={{ marginLeft: (i - 1) * 10 }}
                          animate={{ y: [0, -20], opacity: [0.6, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                        >
                          💨
                        </motion.span>
                      ))}
                    </div>
                    <h3 className="font-black text-emerald-900">{food.name}</h3>
                    <p className="text-sm font-semibold text-slate-600 mt-1">{food.description}</p>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {food.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {tab === "Animals" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {province.animals.map((animal) => (
                  <Card
                    key={animal.id}
                    className="cursor-pointer"
                    onClick={() => {
                      viewAnimal(animal.id);
                      setZaheen(`${animal.name} says hello!`, "excited");
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <motion.span
                        className="text-6xl"
                        animate={{ x: [0, 6, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        {animal.emoji}
                      </motion.span>
                      <div>
                        <h3 className="font-black text-emerald-900 text-lg">{animal.name}</h3>
                        <p className="text-xs font-bold text-emerald-600">🏠 {animal.habitat}</p>
                        <p className="text-sm font-semibold text-slate-600 mt-1">{animal.funFact}</p>
                        <p className="text-xs font-bold text-amber-600 mt-1">🔊 {animal.sound}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {tab === "Culture" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {province.culture.map((c, i) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card>
                      <p className="font-bold text-emerald-900 text-lg">
                        {["🎭", "💃", "🥁", "🎨"][i % 4]} {c}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "Fun Facts" && (
              <div className="space-y-3">
                {province.funFacts.map((fact, i) => (
                  <motion.div
                    key={fact}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-black text-amber-700">
                        {i + 1}
                      </span>
                      <p className="font-bold text-emerald-900 pt-1.5">{fact}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Landmarks outside cities */}
        {province.landmarks.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-black text-emerald-900 mb-3">Famous Landmarks</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {province.landmarks.map((l) => (
                <Card key={l.id}>
                  <div className="flex gap-3">
                    <span className="text-4xl">{l.emoji}</span>
                    <div>
                      <h3 className="font-black text-emerald-900">{l.name}</h3>
                      <p className="text-sm font-semibold text-slate-600">{l.description}</p>
                      <p className="text-xs font-bold text-amber-600 mt-1">💡 {l.funFact}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/25 backdrop-blur px-3 py-1 text-xs font-extrabold">
      {children}
    </span>
  );
}
