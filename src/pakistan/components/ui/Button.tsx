import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";
import { sfx } from "../../utils/audio";
import { useGameStore } from "../../store/useGameStore";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "gold" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  children: React.ReactNode;
}

const variants = {
  primary:
    "bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-lg shadow-green-500/30 border-green-600",
  secondary:
    "bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-400/30 border-sky-500",
  gold: "bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-lg shadow-amber-400/40 border-amber-400",
  ghost: "bg-white/80 text-emerald-800 shadow-md border-white/60 backdrop-blur",
  danger: "bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-lg border-rose-500",
  soft: "bg-gradient-to-br from-pink-300 to-fuchsia-400 text-white shadow-lg border-pink-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-xl gap-1",
  md: "px-5 py-2.5 text-base rounded-2xl gap-2",
  lg: "px-7 py-3.5 text-lg rounded-2xl gap-2",
  xl: "px-8 py-4 text-xl rounded-3xl gap-3",
};

export function Button({
  variant = "primary",
  size = "md",
  glow = false,
  className,
  children,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.06, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn(
        "inline-flex items-center justify-center font-bold border-b-4 active:border-b-0 active:translate-y-1 transition-colors select-none",
        variants[variant],
        sizes[size],
        glow && "animate-pulse-glow",
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
      disabled={disabled}
      onClick={(e) => {
        if (soundEnabled) sfx.click();
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
