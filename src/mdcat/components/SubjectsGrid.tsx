import React, { useEffect, useRef, useState } from "react";

const ACCENTS: Record<string, { bar: string; chip: string; icon: string }> = {
  PHYSICS: { bar: "bg-violet-600", chip: "bg-violet-50", icon: "text-violet-600" },
  CHEMISTRY: { bar: "bg-orange-600", chip: "bg-orange-50", icon: "text-orange-600" },
  BIOLOGY: { bar: "bg-teal-600", chip: "bg-teal-50", icon: "text-teal-600" },
  ENGLISH: { bar: "bg-blue-600", chip: "bg-blue-50", icon: "text-blue-600" },
  "LOGICAL REASONING": { bar: "bg-rose-600", chip: "bg-rose-50", icon: "text-rose-600" },
};

export default function SubjectsGrid({
  SUBJECTS,
  onHoverSubject,
}: {
  SUBJECTS: any[];
  onHoverSubject?: (name: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
  ref={containerRef}
  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
>
  <style>{`
    @keyframes fadeUpIn {
      0% {
        opacity: 0;
        transform: translateY(14px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .swoop-card {
      opacity: 0;
    }
    .swoop-card.swoop-play {
      animation: fadeUpIn 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  `}</style>

  {SUBJECTS.map((subj, i) => {
    const Icon = subj.icon;
    const accent = ACCENTS[subj.name] ?? ACCENTS.PHYSICS;
    return (
      <div
        key={subj.name}
        onMouseEnter={() => onHoverSubject?.(subj.name)}
        onMouseLeave={() => onHoverSubject?.(null)}
        className={`group rounded-2xl ${accent.bar} overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 swoop-card ${
          inView ? "swoop-play" : ""
        }`}
        style={{ animationDelay: `${i * 70}ms` }}
      >
        <div className="p-5">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
            <Icon className="w-5 h-5 text-white" strokeWidth={2.25} />
          </div>
          <h4 className="text-xs font-black uppercase tracking-tight text-white">
            {subj.name}
          </h4>
        </div>
      </div>
    );
  })}
</div>
  );
}
