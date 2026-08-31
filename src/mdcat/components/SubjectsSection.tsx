import { useState } from "react";
import SubjectsGrid from "./SubjectsGrid";

const SUBJECT_ACCENTS: Record<string, { rgb: string; iconColor: string }> = {
  PHYSICS: { rgb: "124, 58, 237", iconColor: "text-violet-600" },
  CHEMISTRY: { rgb: "234, 88, 12", iconColor: "text-orange-600" },
  BIOLOGY: { rgb: "13, 148, 136", iconColor: "text-teal-600" },
  ENGLISH: { rgb: "37, 99, 235", iconColor: "text-blue-600" },
  "LOGICAL REASONING": { rgb: "225, 29, 72", iconColor: "text-rose-600" },
};

export default function SubjectsSection({ SUBJECTS }: { SUBJECTS: any[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const activeSubject = SUBJECTS.find((s) => s.name === hovered);
  const accent = hovered ? SUBJECT_ACCENTS[hovered] : null;
  const Icon = activeSubject?.icon;

  return (
    <section
      id="subjects"
      className="relative overflow-hidden max-w-6xl mx-auto px-6 py-16 space-y-8 rounded-3xl transition-colors duration-500"
      style={{
        backgroundImage: accent
          ? `radial-gradient(ellipse 70% 60% at 50% 40%, rgba(${accent.rgb}, 0.08), transparent)`
          : "none",
      }}
    >
      <style>{`
        @keyframes bigIconSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .big-icon-spin {
          animation: bigIconSpin 6s linear infinite;
        }
      `}</style>

      {Icon && (
        <div
          className={`pointer-events-none absolute top-1/2 left-1/2 big-icon-spin ${accent?.iconColor}`}
          style={{ opacity: 0.08 }}
        >
          <Icon style={{ width: 280, height: 280 }} strokeWidth={1.2} />
        </div>
      )}

      <div className="relative text-center space-y-2">
        <span className="text-[16px] font-black uppercase tracking-widest text-orange-500">Full Coverage</span>
        <h3 className="text-2xl md:text-3xl font-black uppercase text-sky-950">
          Every MDCAT Subject, <span className="text-blue-500">One</span> Platform
        </h3>
      </div>

      <div className="relative">
        <SubjectsGrid SUBJECTS={SUBJECTS} onHoverSubject={setHovered} />
      </div>
    </section>
  );
}
