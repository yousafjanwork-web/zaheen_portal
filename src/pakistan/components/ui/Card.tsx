import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  hover = true,
  glow = false,
  padding = "md",
  ...props
}: CardProps) {
  const pads = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -6, scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-3xl bg-white/90 backdrop-blur-md border-2 border-white shadow-xl shadow-black/5",
        pads[padding],
        glow && "ring-2 ring-amber-300/60 shadow-amber-200/50",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
