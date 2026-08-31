import { useEffect, useRef } from "react";

interface DotGridBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
  dotColor?: string;
  spacing?: number;
  radius?: number;
  repelRadius?: number;
  repelStrength?: number;
}

export default function DotGridBackground({
  className = "",
  style,
  dotColor = "201, 220, 240",
  spacing = 26,
  radius = 1.5,
  repelRadius = 120,
  repelStrength = 18,
}: DotGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dots: { x: number; y: number; ox: number; oy: number }[] = [];
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const buildDots = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          dots.push({ x, y, ox: x, oy: y });
        }
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const d of dots) {
        const dx = d.ox - mx;
        const dy = d.oy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let targetX = d.ox;
        let targetY = d.oy;

        if (dist < repelRadius) {
          const force = (1 - dist / repelRadius) * repelStrength;
          const angle = Math.atan2(dy, dx);
          targetX = d.ox + Math.cos(angle) * force;
          targetY = d.oy + Math.sin(angle) * force;
        }

        d.x += (targetX - d.x) * 0.12;
        d.y += (targetY - d.y) * 0.12;

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor}, 0.9)`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    buildDots();
    draw();

    const parent = canvas.parentElement;
    window.addEventListener("resize", buildDots);
    parent?.addEventListener("mousemove", handleMouseMove);
    parent?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", buildDots);
      parent?.removeEventListener("mousemove", handleMouseMove);
      parent?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [dotColor, spacing, radius, repelRadius, repelStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}
    />
  );
}   