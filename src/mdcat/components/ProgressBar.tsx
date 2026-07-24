import React from 'react'
import { PerformanceStats } from './types';
import { useEffect, useRef, useState } from "react";
import { Dna, FlaskConical, Atom, BookOpen, Brain } from "lucide-react";

interface ProgressBarProps {
  performanceStats: PerformanceStats;
  getSubjectColorBadge: (subject: string) => string;
}

const SUBJECTS = ["Biology", "Chemistry", "Physics", "English", "Logical Reasoning"];

const SUBJECT_ICON: Record<string, React.ElementType> = {
  Biology: Dna,
  Chemistry: FlaskConical,
  Physics: Atom,
  English: BookOpen,
  "Logical Reasoning": Brain,
};

// Light tint + icon-circle color per subject — keep in sync with getSubjectColorBadge's palette
const SUBJECT_THEME: Record<string, { row: string; iconBg: string; iconColor: string }> = {
  Biology: { row: "bg-emerald-50/60", iconBg: "bg-emerald-500", iconColor: "text-white" },
  Chemistry: { row: "bg-orange-50/60", iconBg: "bg-orange-500", iconColor: "text-white" },
  Physics: { row: "bg-violet-50/60", iconBg: "bg-violet-500", iconColor: "text-white" },
  English: { row: "bg-blue-50/60", iconBg: "bg-blue-500", iconColor: "text-white" },
  "Logical Reasoning": { row: "bg-rose-50/60", iconBg: "bg-rose-500", iconColor: "text-white" },
};

const ProgressBar = ({ performanceStats, getSubjectColorBadge }: ProgressBarProps) => {
  const syllabusRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [randomStart] = useState<Record<string, number>>(() =>
    SUBJECTS.reduce((acc, name) => {
      acc[name] = Math.floor(Math.random() * 80) + 5;
      return acc;
    }, {} as Record<string, number>),
  );

  useEffect(() => {
    const node = syllabusRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setHasAnimated(true));
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const avg =
    performanceStats.subjectBreakdown.reduce((sum, s) => sum + s.percentage, 0) /
    (performanceStats.subjectBreakdown.length || 1);

  return (
  <div
  ref={syllabusRef}
  className="w-full bg-white rounded-2xl sm:rounded-3xl card-shadow p-4 sm:p-6 space-y-4 sm:space-y-5 border border-sky-100"
>
  <div className="flex items-baseline justify-between">
    <div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-sky-500">
        Your Progress
      </span>
      <h3 className="text-lg sm:text-xl font-black uppercase text-sky-950">
        Syllabus Check
      </h3>
    </div>
    <span className="text-xs font-bold text-slate-400">
      {avg.toFixed(0)}% avg
    </span>
  </div>

  <div className="space-y-2.5 sm:space-y-3">
    {SUBJECTS.map((name) => {
      const pct =
        performanceStats.subjectBreakdown.find((s) => s.subject === name)
          ?.percentage || 0;
      const displayWidth = hasAnimated ? pct : randomStart[name];
      const Icon = SUBJECT_ICON[name];
      const theme = SUBJECT_THEME[name];

      return (
        <div key={name} className="flex items-center gap-2.5 sm:gap-3">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${theme.iconBg}`}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1 sm:mb-1.5 gap-2">
              <span className="text-xs sm:text-sm font-bold text-sky-950 truncate">
                {name}
              </span>
              <span className="text-xs font-black text-sky-950 shrink-0">
                {pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 sm:h-2 rounded-full bg-sky-50 overflow-hidden">
              <div
                className={`h-full rounded-full ${getSubjectColorBadge(name)} transition-[width] duration-[1200ms] ease-out`}
                style={{ width: `${displayWidth}%` }}
              />
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
};

export default ProgressBar;