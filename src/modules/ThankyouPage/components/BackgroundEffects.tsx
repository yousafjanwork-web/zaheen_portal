import { motion } from "motion/react";
import { School, Sparkles, CheckCircle2 } from "lucide-react";

export default function BackgroundEffects() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-[15%] left-[10%] opacity-40"
      >
        <School className="w-16 h-16 text-primary" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-[20%] right-[12%] opacity-40"
      >
        <Sparkles className="w-12 h-12 text-secondary" />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-[40%] right-[5%] opacity-20"
      >
        <CheckCircle2 className="w-32 h-32 text-tertiary" />
      </motion.div>

    </div>
  );
}