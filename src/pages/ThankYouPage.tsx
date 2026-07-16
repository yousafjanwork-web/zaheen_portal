import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ThankYouPage: React.FC = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900 flex items-center justify-center px-4">
      {/* ambient sparks */}
      <div className="pointer-events-none absolute inset-0">
        {[
          { top: "18%", left: "12%", delay: "0s" },
          { top: "30%", left: "82%", delay: "0.6s" },
          { top: "70%", left: "18%", delay: "1.1s" },
          { top: "76%", left: "88%", delay: "0.3s" },
          { top: "12%", left: "60%", delay: "1.4s" },
          { top: "60%", left: "50%", delay: "0.9s" },
        ].map((spark, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/70 animate-pulse"
            style={{ top: spark.top, left: spark.left, animationDelay: spark.delay, animationDuration: "2.4s" }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        {/* seal */}
        <div className="relative mb-10 h-28 w-28">
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F0B429"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#F0B429"
              strokeWidth="2.5"
              strokeDasharray="327"
              strokeDashoffset="327"
              strokeLinecap="round"
              style={{
                animation: "seal-draw 1.1s ease-out forwards",
                transform: "rotate(-90deg)",
                transformOrigin: "60px 60px",
              }}
            />
            <circle cx="60" cy="60" r="40" fill="#0f172a" stroke="#1e293b" strokeWidth="1" />
            <path
              d="M42 61 L54 73 L79 46"
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="60"
              strokeDashoffset="60"
              style={{ animation: "seal-check 0.5s ease-out 0.9s forwards" }}
            />
          </svg>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-teal-400">
          Subscription confirmed
        </p>

        <h1
          className="mb-4 text-4xl md:text-5xl text-white leading-tight"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          Thank you for subscribing
        </h1>

        <p className="mb-10 text-base md:text-lg text-slate-400 max-w-md">
          You're all set. Your subscription is active and your lessons,
          practice sets, and progress tracking are ready whenever you are.
        </p>

        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full bg-amber-400 px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        >
          Continue learning
          <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
        </Link>
      </div>

      <style>{`
        @keyframes seal-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes seal-check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;