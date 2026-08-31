import { motion } from "framer-motion";

export function StarBurst({ show }: { show: boolean }) {
  if (!show) return null;
  const stars = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {stars.map((i) => {
        const angle = (i / stars.length) * Math.PI * 2;
        const x = Math.cos(angle) * 60;
        const y = Math.sin(angle) * 60;
        return (
          <motion.span
            key={i}
            className="absolute text-2xl"
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{ scale: [0, 1.2, 0], x, y, opacity: [1, 1, 0] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ⭐
          </motion.span>
        );
      })}
    </div>
  );
}
