import React, { useState, useEffect, useRef } from "react";

interface FlipUnitProps {
  value: number;
  label: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface MdcatCountdownProps {
  testDate?: string | Date;
}

/* ---------- single flip unit (e.g. "23" DAYS) ---------- */
function FlipUnit({ value, label }: FlipUnitProps) {
  const [display, setDisplay] = useState<number>(value);
  const [flipping, setFlipping] = useState<boolean>(false);
  const prev = useRef<number>(value);

  useEffect(() => {
    if (value !== prev.current) {
      setFlipping(true);
      // swap the number exactly when the card is edge-on (90deg) and invisible,
      // so the whole card genuinely appears to flip over to the new face
      const swap = setTimeout(() => setDisplay(value), 190);
      const end = setTimeout(() => setFlipping(false), 380);
      prev.current = value;
      return () => {
        clearTimeout(swap);
        clearTimeout(end);
      };
    }
  }, [value]);

  const shown = String(display).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px]"
        style={{ perspective: "300px" }}
      >
        <div
          className="relative w-full h-full bg-white border border-sky-200 shadow-sm rounded-md flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            animation: flipping
              ? "flipCard 380ms cubic-bezier(0.45, 0, 0.55, 1)"
              : "none",
          }}
        >
          <span className="text-2xl sm:text-3xl font-bold text-[#0B2545] tabular-nums leading-none select-none">
            {shown}
          </span>

          {/* center seam to sell the flip-card look */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-sky-200/80 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      <span className="mt-2 text-[10px] sm:text-xs font-bold tracking-widest text-sky-600 uppercase">
        {label}
      </span>
    </div>
  );
}

/* ---------- main countdown ---------- */
export default function MdcatCountdown({ testDate }: MdcatCountdownProps) {
  const target = useRef<number>(
    testDate ? new Date(testDate).getTime() : new Date("2026-09-15T09:00:00").getTime()
  );

  function getTimeLeft(): TimeLeft {
    const diff = Math.max(0, target.current - Date.now());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  const [time, setTime] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center">
  <style>{`
    @keyframes flipCard {
      0% { transform: rotateX(0deg); }
      50% { transform: rotateX(-90deg); }
      100% { transform: rotateX(0deg); }
    }
  `}</style>

  <div className="bg-white/80 backdrop-blur-sm border border-sky-100 rounded-3xl card-shadow px-8 py-8 sm:px-12 sm:py-10 flex flex-col items-center">
    <p className="text-center font-black text-sky-950 text-2xl sm:text-4xl tracking-wide mb-6 uppercase">
      MDCAT <span className="text-sky-600">2026</span> Starts In
    </p>

    <div className="flex items-start gap-3 sm:gap-4">
      <FlipUnit value={time.days} label="Days" />
      <FlipUnit value={time.hours} label="Hours" />
      <FlipUnit value={time.minutes} label="Minutes" />
      <FlipUnit value={time.seconds} label="Seconds" />
    </div>
  </div>
</div>
  );
}