import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePakistanBase } from "../hooks/usePakistanBase";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import { getCity, getProvince } from "../data/provinces";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { NarrationBar } from "../components/layout/NarrationBar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StarBurst } from "../components/ui/StarBurst";
import { useGameStore } from "../store/useGameStore";
import { sfx } from "../utils/audio";
import { Confetti } from "../components/ui/Confetti";

export function CityPage() {
  const base = usePakistanBase();
  const { provinceId, cityId } = useParams();
  const province = getProvince(provinceId || "");
  const city = getCity(provinceId || "", cityId || "");
  const visitCity = useGameStore((s) => s.visitCity);
  const addStars = useGameStore((s) => s.addStars);
  const addXp = useGameStore((s) => s.addXp);
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const sound = useGameStore((s) => s.soundEnabled);
  const addCollectible = useGameStore((s) => s.addCollectible);

  const [entered, setEntered] = useState(false);
  const [activeLandmark, setActiveLandmark] = useState<string | null>(null);
  const [collected, setCollected] = useState<string[]>([]);
  const [burst, setBurst] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (city) {
      visitCity(city.id);
      setZaheen(`Welcome to ${city.name}! Walk through the city gate!`, "excited");
    }
  }, [city, visitCity, setZaheen]);

  if (!city || !province) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <p className="font-bold">City not found</p>
        <Link to={`${base}/map`}> 
            <Button className="mt-3">Map</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const collectStar = (landmarkId: string) => {
    if (collected.includes(landmarkId)) return;
    const next = [...collected, landmarkId];
    setCollected(next);
    setBurst(true);
    addStars(1);
    addXp(10);
    if (sound) sfx.star();
    setTimeout(() => setBurst(false), 900);
    if (next.length === city.landmarks.length) {
      setShowConfetti(true);
      setZaheen(`You explored all of ${city.name}! Super star!`, "celebrate");
      if (sound) sfx.celebrate();
      if (city.id === "lahore") addCollectible("col-badshahi");
      if (city.id === "karachi") addCollectible("col-biryani");
      if (city.id === "islamabad-city") addCollectible("col-faisal");
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const landmark = city.landmarks.find((l) => l.id === activeLandmark);

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="province" />
      {showConfetti && <Confetti />}

      <div className="mx-auto max-w-4xl px-4 pt-4">
       <Link
          to={`${base}/province/${province.id}`}
          className="inline-flex items-center gap-1 font-bold text-emerald-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4" /> {province.name}
        </Link>

        {!entered ? (
          <motion.div
            className="flex flex-col items-center text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="text-8xl mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🚪
            </motion.div>
            <h1 className="text-4xl font-black text-emerald-900 mb-2">
              {city.emoji} {city.name}
            </h1>
            <p className="font-bold text-emerald-700 max-w-md mb-6">{city.description}</p>
            <Button
              size="xl"
              glow
              onClick={() => {
                setEntered(true);
                if (sound) sfx.whoosh();
                setZaheen(`You entered ${city.name}! Visit each place to earn stars!`, "excited");
              }}
            >
              Enter City Gate ✨
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <h1 className="text-3xl font-black text-emerald-900">
                  {city.emoji} {city.name} Adventure
                </h1>
                <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-extrabold text-amber-700">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {collected.length}/{city.landmarks.length}
                </div>
              </div>
              <NarrationBar text={city.narration} />
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6 relative">
              <StarBurst show={burst} />
              {city.landmarks.map((l, i) => {
                const got = collected.includes(l.id);
                return (
                  <motion.div
                    key={l.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer relative ${got ? "ring-2 ring-amber-300" : ""}`}
                      onClick={() => {
                        setActiveLandmark(l.id);
                        collectStar(l.id);
                      }}
                    >
                      {got && (
                        <span className="absolute top-3 right-3 text-xl">⭐</span>
                      )}
                      <div className="flex gap-3 items-start">
                        <motion.span
                          className="text-5xl"
                          whileHover={{ scale: 1.15, rotate: 5 }}
                        >
                          {l.emoji}
                        </motion.span>
                        <div>
                          <h3 className="font-black text-emerald-900 text-lg">{l.name}</h3>
                          <p className="text-sm font-semibold text-slate-600 line-clamp-2">
                            {l.description}
                          </p>
                          <p className="text-xs font-extrabold text-amber-600 mt-2">
                            Tap to visit & collect star!
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Fun facts */}
            <Card className="mb-4">
              <h3 className="font-black text-emerald-900 mb-2">Fun Facts 💡</h3>
              <ul className="space-y-2">
                {city.funFacts.map((f) => (
                  <li key={f} className="font-semibold text-slate-600 flex gap-2">
                    <span>✨</span> {f}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Foods */}
            <Card>
              <h3 className="font-black text-emerald-900 mb-2">Taste the City 🍽️</h3>
              <div className="flex flex-wrap gap-2">
                {city.foods.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-800"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Landmark modal */}
        <AnimatePresence>
          {landmark && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLandmark(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.span
                    className="text-7xl inline-block mb-3"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {landmark.emoji}
                  </motion.span>
                  <h2 className="text-2xl font-black text-emerald-900">{landmark.name}</h2>
                  <p className="font-semibold text-slate-600 mt-2">{landmark.description}</p>
                  <p className="text-sm font-bold text-amber-600 mt-3">💡 {landmark.funFact}</p>
                </div>
                <div className="mt-4">
                  <NarrationBar text={landmark.narration} />
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => setActiveLandmark(null)}
                >
                  Continue Exploring
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
