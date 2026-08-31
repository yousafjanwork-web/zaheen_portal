import { motion } from "framer-motion";
import { AnimatedBackground } from "../components/layout/AnimatedBackground";
import { PakistanMap } from "../components/map/PakistanMap";
import { CaptainZaheen } from "../components/character/CaptainZaheen";
import { Card } from "../components/ui/Card";
import { provinces } from "../data/provinces";
import { Link } from "react-router-dom";
import { useGameStore } from "../store/useGameStore";
import { useEffect } from "react";
import { usePakistanBase } from "../hooks/usePakistanBase";

export function MapPage() {
  const base = usePakistanBase();
  const setZaheen = useGameStore((s) => s.setZaheenMessage);
  const visited = useGameStore((s) => s.visitedProvinces);

  useEffect(() => {
    setZaheen("Tap a glowing province to zoom in and explore!", "excited");
  }, [setZaheen]);

  return (
    <div className="relative min-h-screen pb-24">
      <AnimatedBackground variant="map" />
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl md:text-5xl font-black text-emerald-900 text-shadow-soft">
            Map of Pakistan 🗺️
          </h1>
          <p className="font-bold text-emerald-700 mt-2">
            Hover to peek · Click to explore · {visited.length}/7 regions
            visited
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
          <Card
            className="bg-gradient-to-b from-sky-50/90 to-emerald-50/90"
            padding="sm"
          >
            <PakistanMap />
          </Card>

          <div className="space-y-4">
            <div className="flex justify-center lg:justify-start">
              <CaptainZaheen size="md" />
            </div>

            <Card>
              <h3 className="font-black text-emerald-900 mb-3">Regions</h3>
              <div className="space-y-2">
                {provinces.map((p) => {
                  const done = visited.includes(p.id);
                  return (
                    <Link key={p.id} to={`${base}/province/${p.id}`}>
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 bg-white/70 hover:bg-white border border-emerald-50"
                      >
                        <span
                          className="h-3 w-3 rounded-full shrink-0"
                          style={{ background: p.color }}
                        />
                        <span className="text-lg">{p.emoji}</span>
                        <span className="text-sm font-bold text-emerald-900 flex-1">
                          {p.name}
                        </span>
                        {done && <span>⭐</span>}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
              <p className="text-sm font-bold text-amber-900">
                💡 Tip: Each province has cities, foods, animals, and mini
                adventures waiting!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}