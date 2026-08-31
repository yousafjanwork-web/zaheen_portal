import { Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import { speak, stopSpeaking } from "../../utils/audio";
import { useGameStore } from "../../store/useGameStore";
import { Button } from "../ui/Button";

interface NarrationBarProps {
  text: string;
  className?: string;
}

export function NarrationBar({ text, className = "" }: NarrationBarProps) {
  const [playing, setPlaying] = useState(false);
  const narrationEnabled = useGameStore((s) => s.narrationEnabled);
  const language = useGameStore((s) => s.language);
  const [highlight, setHighlight] = useState(-1);

  const words = text.split(" ");

  const play = () => {
    if (!narrationEnabled) return;
    setPlaying(true);
    setHighlight(0);
    // Simple word highlight simulation while speaking
    const avg = Math.max(280, Math.min(500, 4000 / words.length));
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      if (i >= words.length) {
        clearInterval(interval);
        setHighlight(-1);
        setPlaying(false);
      } else {
        setHighlight(i);
      }
    }, avg);

    speak(text, true, language === "ur" ? "ur" : "en-US");

    // Fallback stop
    setTimeout(
      () => {
        clearInterval(interval);
        setPlaying(false);
        setHighlight(-1);
      },
      avg * words.length + 500
    );
  };

  const pause = () => {
    stopSpeaking();
    setPlaying(false);
    setHighlight(-1);
  };

  return (
    <div className={`rounded-2xl bg-white/80 border-2 border-emerald-100 p-3 shadow-md ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex gap-1 shrink-0">
          {!playing ? (
            <Button size="sm" variant="secondary" onClick={play} aria-label="Play narration">
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={pause} aria-label="Pause">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={play} aria-label="Replay">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mb-1">
            <Volume2 className="h-3 w-3" />
            Narration
          </div>
          <p className="text-sm md:text-base font-semibold text-slate-700 leading-relaxed">
            {words.map((w, i) => (
              <span
                key={i}
                className={
                  i === highlight
                    ? "bg-amber-300 text-emerald-900 rounded px-0.5 transition"
                    : ""
                }
              >
                {w}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
