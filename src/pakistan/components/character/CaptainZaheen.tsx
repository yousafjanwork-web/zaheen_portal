import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { cn } from "../../utils/cn";

interface CaptainZaheenProps {
  size?: "sm" | "md" | "lg" | "xl";
  showBubble?: boolean;
  message?: string | null;
  mood?: "happy" | "excited" | "thinking" | "celebrate" | "wave";
  className?: string;
  onClick?: () => void;
}

const sizes = {
  sm: "w-16 h-16 text-3xl",
  md: "w-24 h-24 text-5xl",
  lg: "w-36 h-36 text-7xl",
  xl: "w-48 h-48 text-8xl",
};

export function CaptainZaheen({
  size = "md",
  showBubble = true,
  message,
  mood,
  className,
  onClick,
}: CaptainZaheenProps) {
  const storeMsg = useGameStore((s) => s.zaheenMessage);
  const storeMood = useGameStore((s) => s.zaheenMood);
  const setMsg = useGameStore((s) => s.setZaheenMessage);

  const displayMsg = message !== undefined ? message : storeMsg;
  const displayMood = mood ?? storeMood;

  const getAnimate = () => {
    if (displayMood === "excited" || displayMood === "celebrate") {
      return { y: [0, -12, 0] };
    }
    if (displayMood === "wave") {
      return { rotate: [0, 10, -10, 8, 0] };
    }
    return { y: [0, -8, 0] };
  };

  const getTransition = () => {
    if (displayMood === "excited" || displayMood === "celebrate") {
      return { repeat: Infinity, duration: 0.6 };
    }
    if (displayMood === "wave") {
      return { repeat: Infinity, duration: 1.5 };
    }
    return { repeat: Infinity, duration: 3, ease: "easeInOut" as const };
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <AnimatePresence>
        {showBubble && displayMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-3 max-w-[220px] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-center text-sm font-bold text-emerald-900 shadow-xl border-2 border-emerald-100 relative"
          >
            {displayMsg}
            <div className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 bg-white border-r-2 border-b-2 border-emerald-100" />
            <button
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-white text-xs font-bold shadow"
              onClick={() => setMsg(null)}
              aria-label="Close message"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        animate={getAnimate()}
        transition={getTransition()}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-amber-300 shadow-2xl border-4 border-white flex items-center justify-center",
          sizes[size]
        )}
        aria-label="Captain Zaheen"
      >
        <div className="relative flex flex-col items-center justify-center">
          <span className="select-none leading-none" role="img" aria-label="Captain Zaheen">
            {displayMood === "celebrate"
              ? "🤩"
              : displayMood === "thinking"
                ? "🤔"
                : displayMood === "excited"
                  ? "😄"
                  : displayMood === "wave"
                    ? "👋"
                    : "🧑‍🚀"}
          </span>
        </div>

        <motion.div
          className="absolute -top-1 -right-1 text-lg"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🇵🇰
        </motion.div>

        <div className="absolute inset-0 rounded-full ring-4 ring-amber-300/40 animate-pulse-glow pointer-events-none" />
      </motion.button>

      {size !== "sm" && (
        <motion.p
          className="mt-2 text-center font-extrabold text-emerald-900 text-shadow-soft"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Captain Zaheen
        </motion.p>
      )}
    </div>
  );
}
