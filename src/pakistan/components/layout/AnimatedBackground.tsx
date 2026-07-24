import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  variant?: "home" | "map" | "province" | "game" | "night" | "mountain" | "desert" | "sea";
}

export function AnimatedBackground({ variant = "home" }: AnimatedBackgroundProps) {
  const skies: Record<string, string> = {
    home: "from-sky-300 via-blue-200 to-amber-100",
    map: "from-cyan-200 via-sky-100 to-emerald-100",
    province: "from-violet-200 via-fuchsia-100 to-amber-100",
    game: "from-indigo-300 via-purple-200 to-pink-200",
    night: "from-indigo-900 via-purple-900 to-slate-900",
    mountain: "from-sky-400 via-blue-200 to-slate-200",
    desert: "from-orange-200 via-amber-100 to-yellow-100",
    sea: "from-cyan-300 via-sky-200 to-teal-100",
  };

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b ${skies[variant]}`}>
      {/* Sun / moon */}
      {variant !== "night" ? (
        <motion.div
          className="absolute top-8 right-[12%] h-20 w-20 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.6)]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      ) : (
        <div className="absolute top-10 right-[15%] h-16 w-16 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 shadow-[0_0_40px_rgba(254,243,199,0.5)]" />
      )}

      {/* Clouds */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute opacity-80"
          style={{ top: `${8 + i * 12}%` }}
          initial={{ x: -200 }}
          animate={{ x: "110vw" }}
          transition={{
            duration: 30 + i * 8,
            repeat: Infinity,
            ease: "linear",
            delay: i * 4,
          }}
        >
          <Cloud />
        </motion.div>
      ))}

      {/* Birds */}
      {variant !== "night" &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={`bird-${i}`}
            className="absolute text-lg opacity-70"
            style={{ top: `${15 + i * 10}%` }}
            initial={{ x: -50 }}
            animate={{ x: "110vw", y: [0, -15, 10, 0] }}
            transition={{
              x: { duration: 18 + i * 5, repeat: Infinity, ease: "linear", delay: i * 6 },
              y: { duration: 3, repeat: Infinity },
            }}
          >
            🕊️
          </motion.div>
        ))}

      {/* Butterflies */}
      {variant === "home" &&
        [0, 1].map((i) => (
          <motion.div
            key={`bf-${i}`}
            className="absolute text-xl"
            style={{ top: `${40 + i * 20}%`, left: `${20 + i * 40}%` }}
            animate={{ y: [0, -20, 0], x: [0, 15, -10, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity }}
          >
            🦋
          </motion.div>
        ))}

      {/* Balloons */}
      {variant === "home" &&
        ["🎈", "🎈", "🎈"].map((b, i) => (
          <motion.div
            key={`bal-${i}`}
            className="absolute text-3xl"
            style={{ left: `${10 + i * 30}%`, bottom: "20%" }}
            animate={{ y: [0, -40, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i }}
          >
            {b}
          </motion.div>
        ))}

      {/* Rainbow */}
      {variant === "home" && (
        <div className="absolute top-[8%] left-[5%] h-40 w-80 opacity-40">
          <div className="absolute inset-0 rounded-t-full border-[12px] border-b-0 border-red-400" />
          <div className="absolute inset-2 rounded-t-full border-[12px] border-b-0 border-orange-400" />
          <div className="absolute inset-4 rounded-t-full border-[12px] border-b-0 border-yellow-400" />
          <div className="absolute inset-6 rounded-t-full border-[12px] border-b-0 border-green-400" />
          <div className="absolute inset-8 rounded-t-full border-[12px] border-b-0 border-blue-400" />
          <div className="absolute inset-10 rounded-t-full border-[12px] border-b-0 border-purple-400" />
        </div>
      )}

      {/* Ground hills */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 200" className="w-full h-32 md:h-48" preserveAspectRatio="none">
          <path
            d="M0,120 C200,40 400,160 720,80 C1000,20 1200,140 1440,60 L1440,200 L0,200 Z"
            fill="#86efac"
            opacity="0.7"
          />
          <path
            d="M0,150 C300,80 500,180 800,120 C1100,60 1300,160 1440,100 L1440,200 L0,200 Z"
            fill="#4ade80"
            opacity="0.85"
          />
          <path
            d="M0,180 C250,140 450,190 700,160 C1000,120 1200,180 1440,150 L1440,200 L0,200 Z"
            fill="#22c55e"
          />
        </svg>
      </div>

      {/* Silhouette landmarks on home */}
      {variant === "home" && (
        <div className="absolute bottom-16 md:bottom-24 left-0 right-0 flex justify-center items-end gap-2 md:gap-6 opacity-30 px-4">
          <span className="text-4xl md:text-6xl">🕌</span>
          <span className="text-5xl md:text-7xl">🗼</span>
          <span className="text-4xl md:text-6xl">⛰️</span>
          <span className="text-3xl md:text-5xl">🕌</span>
        </div>
      )}

      {/* Stars for night */}
      {variant === "night" &&
        Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
          />
        ))}
    </div>
  );
}

function Cloud() {
  return (
    <div className="relative">
      <div className="h-10 w-24 rounded-full bg-white/90" />
      <div className="absolute -top-4 left-4 h-12 w-16 rounded-full bg-white/90" />
      <div className="absolute -top-2 left-12 h-10 w-14 rounded-full bg-white/90" />
    </div>
  );
}
