import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#22c55e", "#fbbf24", "#3b82f6", "#f472b6", "#a78bfa", "#f97316", "#ffffff"];

export function Confetti({ count = 40 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 2,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 10,
        rotate: Math.random() * 360,
        shape: Math.random() > 0.5 ? "50%" : "2px",
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            borderRadius: p.shape,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: p.rotate + 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
