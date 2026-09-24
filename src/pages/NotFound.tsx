import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const NotFound = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── Floating particles background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      r:    Math.random() * 3 + 1,
      dx:   (Math.random() - 0.5) * 0.6,
      dy:   (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Glowing blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", filter: "blur(50px)" }}
      />

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full">

        {/* Zaheen logo pill */}
        <div className="mb-10 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
        >
          <span className="text-white font-black text-lg tracking-wide">ذہین</span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Zaheen</span>
        </div>

        {/* 404 number — smaller so buttons stay visible without scrolling */}
        <div className="relative mb-2 select-none">
          <span
            className="text-[90px] sm:text-[110px] font-black leading-none"
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(129,140,248,0.4))",
            }}
          >
            404
          </span>
          {/* Reflection */}
          <span
            className="absolute top-full left-0 right-0 text-[90px] sm:text-[110px] font-black leading-none opacity-10 scale-y-[-1] block"
            style={{
              background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </span>
        </div>

        {/* Divider line */}
        <div className="flex items-center gap-3 w-full mb-5">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(129,140,248,0.4))" }} />
          <span className="text-indigo-400 text-lg">✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(129,140,248,0.4))" }} />
        </div>

        {/* Text */}
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
          Oops! Page Not Found
        </h1>
        <p className="text-white/50 text-[14px] leading-relaxed mb-7 max-w-sm">
          The path you entered doesn't exist on Zaheen. It may have been moved, deleted, or you may have typed it incorrectly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white/70 hover:text-white transition-all border border-white/10 hover:border-white/30"
            style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
          >
            ← Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: "0 0 30px rgba(99,102,241,0.4)",
            }}
          >
            🏠 Go to Home
          </button>
        </div>

        {/* Bottom hint */}
        <p className="mt-6 text-white/20 text-xs tracking-widest uppercase">
          zaheen.com.pk
        </p>
      </div>
    </div>
  );
};

export default NotFound;