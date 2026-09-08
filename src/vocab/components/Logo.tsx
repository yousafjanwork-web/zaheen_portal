import { motion } from "framer-motion";
const ZaheenLogo = "https://cdn.zaheen.com.pk/zaheen-web-img/ZaheenLogo.png";
interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  animate?: boolean;
  variant?: "default" | "white" | "dark";
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  animate = true,
  variant = "default",
  className = "",
}: LogoProps) {
  const dimensions: Record<
    string,
    { mark: number; text: string; gap: string }
  > = {
    xs: { mark: 56, text: "text-base", gap: "gap-1.5" },
    sm: { mark: 72, text: "text-lg", gap: "gap-2" },
    md: { mark: 88, text: "text-xl", gap: "gap-2.5" },
    lg: { mark: 120, text: "text-3xl", gap: "gap-3" },
    xl: { mark: 176, text: "text-5xl", gap: "gap-4" },
  };
  const dim = dimensions[size];

  return (
    <div className={`inline-flex items-center ${dim.gap} ${className}`}>
      {/* Logo mark — PNG image */}
      <motion.div
        className="relative shrink-0"
        whileHover={animate ? { scale: 1.08, rotate: -2 } : undefined}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <img
          src={ZaheenLogo}
          alt="Zaheen"
          width={dim.mark}
          height={dim.mark}
          className="object-contain"
        />
      </motion.div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight ${dim.text} ${
              variant === "white"
                ? "text-white"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent"
            }`}
          ></span>
          {size !== "xs" && size !== "sm" && (
            <span
              className={`text-[10px] font-semibold uppercase tracking-[0.18em] mt-0.5 ${
                variant === "white" ? "text-lime-200" : "text-lime-600"
              }`}
            >
              Smart Words for Kids
            </span>
          )}
        </div>
      )}
    </div>
  );
}
