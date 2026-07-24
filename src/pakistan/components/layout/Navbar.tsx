import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Map,
  Gamepad2,
  Trophy,
  BookOpen,
  Star,
  Volume2,
  VolumeX,
  Menu,
  X,
  Award,
  Package,
} from "lucide-react";
import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { cn } from "../../utils/cn";
import { sfx } from "../../utils/audio";
import { usePakistanBase } from "../../hooks/usePakistanBase";

// Determines whether a nav link should be highlighted as active.
// The Home link is treated as an exact match only — otherwise it
// would match every nested route (they all start with the base path).
function isLinkActive(pathname: string, to: string, base: string) {
  if (to === base) {
    return pathname === base;
  }
  return pathname === to || pathname.startsWith(to + "/");
}

export function Navbar() {
  const location = useLocation();
  const base = usePakistanBase();
  const links = [
    { to: base, icon: Home, label: "Home" },
    { to: `${base}/map`, icon: Map, label: "Map" },
    { to: `${base}/games`, icon: Gamepad2, label: "Games" },
    { to: `${base}/story`, icon: BookOpen, label: "Stories" },
    { to: `${base}/quizz`, icon: Star, label: "Quiz" },
    { to: `${base}/badges`, icon: Award, label: "Badges" },
    { to: `${base}/collection`, icon: Package, label: "Collection" },
    { to: `${base}/progress`, icon: Trophy, label: "Progress" },
  ];
  const [open, setOpen] = useState(false);
  const { xp, coins, stars, level, streak, soundEnabled, toggleSound } = useGameStore();
  const sound = useGameStore((s) => s.soundEnabled);

  return (
    <header className="sticky top-0 z-50 safe-bottom">
      <div className="mx-auto max-w-7xl px-3 pt-3">
        <nav className="glass flex items-center justify-between gap-2 rounded-3xl border-2 border-white/80 px-3 py-2 shadow-xl md:px-5">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => sound && sfx.click()}
          >
            <motion.span
              className="text-2xl md:text-3xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              🇵🇰
            </motion.span>
            <div className="hidden sm:block">
              <p className="text-sm font-black leading-tight text-emerald-800 md:text-base">
                Discover Pakistan
              </p>
              <p className="text-[10px] font-bold text-emerald-600">Lvl {level} Explorer</p>
            </div>
          </Link>

          {/* Stats */}
          <div className="flex items-center gap-1.5 md:gap-3 text-xs md:text-sm font-extrabold">
            <StatChip emoji="⚡" value={xp} color="bg-violet-100 text-violet-700" />
            <StatChip emoji="🪙" value={coins} color="bg-amber-100 text-amber-700" />
            <StatChip emoji="⭐" value={stars} color="bg-yellow-100 text-yellow-700" />
            {streak > 0 && (
              <StatChip emoji="🔥" value={streak} color="bg-orange-100 text-orange-700" />
            )}
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ to, icon: Icon, label }) => {
            const active = isLinkActive(location.pathname, to, base);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => sound && sfx.click()}
                  className={cn(
                    "flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition",
                    active
                      ? "bg-emerald-500 text-white shadow-md"
                      : "text-emerald-800 hover:bg-emerald-100"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                toggleSound();
                sfx.click();
              }}
              className="ml-1 rounded-xl p-2 text-emerald-800 hover:bg-emerald-100"
              aria-label={soundEnabled ? "Mute" : "Unmute"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden rounded-xl bg-emerald-100 p-2 text-emerald-800"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile drawer */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 glass rounded-3xl border-2 border-white/80 p-3 shadow-xl lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {links.map(({ to, icon: Icon, label }) => {
               const active = isLinkActive(location.pathname, to, base);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => {
                      setOpen(false);
                      if (sound) sfx.click();
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-bold",
                      active
                        ? "bg-emerald-500 text-white"
                        : "bg-white/70 text-emerald-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
              <button
                onClick={() => toggleSound()}
                className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-3 text-sm font-bold text-emerald-800 col-span-2"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {soundEnabled ? "Sound On" : "Sound Off"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}

function StatChip({
  emoji,
  value,
  color,
}: {
  emoji: string;
  value: number;
  color: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-full px-2 py-1", color)}>
      <span>{emoji}</span>
      <span>{value}</span>
    </span>
  );
}