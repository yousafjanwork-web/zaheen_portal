import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { Confetti } from "../ui/Confetti";
import { Button } from "../ui/Button";
import { useEffect } from "react";
import { sfx } from "../../utils/audio";
import { badges } from "../../data/content";

export function CelebrationModal() {
  const show = useGameStore((s) => s.showCelebration);
  const message = useGameStore((s) => s.celebrationMessage);
  const badgeId = useGameStore((s) => s.newlyEarnedBadge);
  const clear = useGameStore((s) => s.clearCelebration);
  const sound = useGameStore((s) => s.soundEnabled);

  const badge = badges.find((b) => b.id === badgeId);

  useEffect(() => {
    if (show && sound) sfx.celebrate();
  }, [show, sound]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clear}
        >
          <Confetti count={50} />
          <motion.div
            initial={{ scale: 0.5, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="relative w-full max-w-md rounded-[2rem] bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-8 text-center shadow-2xl border-4 border-amber-300"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="text-7xl mb-4"
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.8 }}
            >
              {badge?.emoji ?? "🎉"}
            </motion.div>
            <h2 className="text-2xl font-black text-emerald-900 mb-2">Celebration!</h2>
            <p className="text-lg font-bold text-emerald-700 mb-1">{message}</p>
            {badge && (
              <p className="text-sm text-emerald-600 mb-6">{badge.description}</p>
            )}
            {!badge && <div className="mb-6" />}
            <Button variant="gold" size="lg" onClick={clear} className="w-full">
              Awesome! ⭐
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
