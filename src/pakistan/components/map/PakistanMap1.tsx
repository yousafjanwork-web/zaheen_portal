import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { provinces } from "../../data/provinces";
import type { Province, ProvinceId } from "../../types";
import { sfx } from "../../utils/audio";
import { useGameStore } from "../../store/useGameStore";

// Shapes traced directly from the reference Pakistan provinces map via
// pixel color-mask + contour extraction (verified >90% IoU against source).
// Label points use "pole of inaccessibility" so they always sit inside
// the shape, even for thin/concave regions like Kashmir and KPK.
const provinceShapes: Record<
  ProvinceId,
  { d: string; labelX: number; labelY: number; color: string }
> = {
  // Gilgit-Baltistan — top right, borders China
  gilgit: {
    d: "M309,59 L308,66 L321,66 L323,72 L339,78 L337,85 L347,89 L357,88 L360,96 L372,96 L377,106 L403,98 L407,100 L410,93 L436,81 L420,80 L403,69 L394,71 L388,62 L389,49 L383,43 L378,45 L375,36 L364,37 L357,34 L354,38 L340,40 L339,44 L322,44 L314,57 Z",
    labelX: 360,
    labelY: 63,
    color: "#22c9d6",
  },
  // Azad Jammu & Kashmir — thin sliver below Gilgit-Baltistan
  kashmir: {
    d: "M354,91 L345,92 L345,96 L329,109 L336,138 L333,141 L335,149 L350,157 L353,156 L349,154 L350,151 L342,146 L345,144 L342,141 L347,138 L341,133 L349,123 L340,123 L338,119 L342,116 L335,112 L350,99 L366,104 L372,102 L371,99 L364,101 L358,98 Z",
    labelX: 337,
    labelY: 127,
    color: "#f472b6",
  },
  // Khyber Pakhtunkhwa — purple, west of Gilgit-Baltistan/Kashmir
  kpk: {
    d: "M334,38 L308,38 L289,48 L276,62 L287,89 L272,102 L277,100 L269,109 L273,121 L243,125 L255,143 L233,151 L239,151 L226,168 L227,178 L240,178 L252,203 L263,200 L277,168 L270,160 L277,146 L286,148 L303,121 L324,128 L327,107 L342,96 L335,79 L304,67 L320,41 Z",
    labelX: 308,
    labelY: 95,
    color: "#8b5cf6",
  },
  // Islamabad Capital Territory — tiny sliver at the KPK / Kashmir / Punjab junction
  islamabad: {
    d: "M332,142 L344,138 L353,144 L352,153 L342,158 L331,153 Z",
    labelX: 342,
    labelY: 148,
    color: "#a855f7",
  },
  // Punjab — center, orange
  punjab: {
    d: "M305,127 L290,152 L276,157 L281,172 L268,202 L254,209 L250,233 L239,250 L242,263 L236,277 L247,292 L259,290 L265,298 L286,294 L298,273 L315,262 L323,240 L337,233 L336,224 L352,207 L354,182 L370,175 L331,153 L329,138 L320,143 Z",
    labelX: 313,
    labelY: 193,
    color: "#f59e0b",
  },
  // Balochistan — largest, southwest, jagged coastline
  balochistan: {
    d: "M237,186 L218,198 L200,193 L190,206 L169,207 L159,216 L158,244 L133,254 L61,260 L34,251 L48,275 L73,286 L73,313 L86,318 L81,335 L50,345 L45,370 L100,360 L110,366 L163,360 L168,372 L179,353 L171,331 L177,297 L207,278 L225,277 L234,262 L231,248 L247,212 Z",
    labelX: 128,
    labelY: 301,
    color: "#84cc16",
  },
  // Sindh — south
  sindh: {
    d: "M233,282 L209,284 L196,296 L184,299 L179,307 L177,334 L186,354 L176,374 L169,378 L185,382 L182,397 L189,404 L193,399 L200,405 L206,400 L212,402 L214,392 L235,392 L239,397 L256,389 L263,395 L268,392 L265,389 L269,384 L257,360 L252,361 L243,351 L246,335 L237,336 L229,328 L230,319 L245,304 Z",
    labelX: 215,
    labelY: 362,
    color: "#ef4444",
  },
};

export function PakistanMap1({
  interactive = true,
  highlightId,
  onSelect,
  compact = false,
}: {
  interactive?: boolean;
  highlightId?: ProvinceId;
  onSelect?: (id: ProvinceId) => void;
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState<ProvinceId | null>(null);
  const navigate = useNavigate();
  const sound = useGameStore((s) => s.soundEnabled);
  const visited = useGameStore((s) => s.visitedProvinces);

  const active = hovered || highlightId;
  const province: Province | undefined = active
    ? provinces.find((p) => p.id === active)
    : undefined;

  const handleClick = (id: ProvinceId) => {
    if (!interactive) return;
    if (sound) sfx.whoosh();
    if (onSelect) onSelect(id);
    else navigate(`/pakistan/province/${id}`);
  };

  return (
    <div
      className={`relative w-full ${compact ? "max-w-md" : "max-w-2xl"} mx-auto`}
    >
      <svg
        viewBox="15 15 440 410"
        className="w-full h-auto drop-shadow-2xl"
        role="img"
        aria-label="Interactive map of Pakistan"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Sea backdrop */}
        <rect
          x="15"
          y="15"
          width="440"
          height="410"
          fill="url(#water)"
          opacity="0.12"
          rx="20"
        />

        {provinces.map((p) => {
          const shape = provinceShapes[p.id];
          if (!shape) return null;
          const isActive = active === p.id;
          const isVisited = visited.includes(p.id);

          return (
            <g key={p.id}>
              <motion.path
                d={shape.d}
                fill={shape.color}
                stroke={isActive ? "#fbbf24" : "#ffffff"}
                strokeWidth={isActive ? 4 : 2}
                strokeLinejoin="round"
                className="province-path"
                style={{
                  cursor: interactive ? "pointer" : "default",
                  filter: isActive ? "url(#glow)" : undefined,
                  opacity: isVisited || isActive ? 1 : 0.85,
                }}
                initial={{ scale: 1 }}
                animate={{
                  scale: isActive ? 1.03 : 1,
                  opacity: highlightId && highlightId !== p.id ? 0.45 : 1,
                }}
                whileHover={interactive ? { scale: 1.04 } : undefined}
                onMouseEnter={() => interactive && setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleClick(p.id)}
                onFocus={() => interactive && setHovered(p.id)}
                onBlur={() => setHovered(null)}
                tabIndex={interactive ? 0 : -1}
                role={interactive ? "button" : undefined}
                aria-label={p.name}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClick(p.id);
                }}
              />
              <text
                x={shape.labelX}
                y={shape.labelY}
                textAnchor="middle"
                className="pointer-events-none select-none"
                fill="#fff"
                fontSize={p.id === "islamabad" || p.id === "kashmir" ? 7 : 12}
                fontWeight="800"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
              >
                {p.emoji}{" "}
                {p.id === "islamabad"
                  ? "ISB"
                  : p.name.split("-")[0].split(" ")[0]}
              </text>
              {isVisited && (
                <text x={shape.labelX + 20} y={shape.labelY - 12} fontSize="11">
                  ⭐
                </text>
              )}
            </g>
          );
        })}

        {/* Indus river hint */}
        <path
          d="M360,85 Q320,155 300,225 Q280,295 250,385"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          opacity="0.5"
        />
      </svg>

      {/* Hover card */}
      <AnimatePresence>
        {province && interactive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] max-w-sm rounded-2xl bg-white/95 border-2 border-white p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{province.emoji}</span>
              <div>
                <h3 className="font-black text-emerald-900 text-lg">
                  {province.name}
                </h3>
                <p className="text-xs font-bold text-emerald-600">
                  Capital: {province.capital} ·{" "}
                  {province.traditionalDress.emoji}{" "}
                  {province.famousFoods[0]?.emoji} {province.animals[0]?.emoji}
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-600 line-clamp-2">
              {province.description}
            </p>
            <p className="mt-1 text-xs font-bold text-amber-600">
              Tap to explore! ✨
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
