import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "from-green-400 to-emerald-600",
  height = "h-4",
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-1 flex justify-between text-xs font-bold text-emerald-800/80">
          <span>{label}</span>
          <span>
            {value}/{max}
          </span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-white/60 border border-white shadow-inner", height)}>
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>
    </div>
  );
}
