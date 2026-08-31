/**
 * MdcatEntryCard — Drop this card anywhere on the Zaheen LMS dashboard.
 * When a logged-in user clicks it, they navigate to the MDCAT prep module.
 *
 * USAGE in Zaheen dashboard:
 *   import MdcatEntryCard from "./mdcat/MdcatEntryCard";
 *   <MdcatEntryCard onEnter={() => navigate("/mdcat")} />
 */

import React from "react";
import { Stethoscope, BookMarked, Sparkles, ChevronRight, Brain } from "lucide-react";

interface MdcatEntryCardProps {
  /** Called when the user clicks the card — navigate to /mdcat in your router */
  onEnter: () => void;
}

export default function MdcatEntryCard({ onEnter }: MdcatEntryCardProps) {
  return (
    <div
      onClick={onEnter}
      className="cursor-pointer group relative overflow-hidden rounded-3xl border border-sky-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 select-none"
    >
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 via-white to-white pointer-events-none" />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center shadow-md">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-sky-500 bg-sky-50 border border-sky-100 rounded-full px-3 py-1">
          <Sparkles className="w-3 h-3 text-sky-500" /> AI Powered
        </span>
      </div>

      {/* Title */}
      <div className="relative mt-4 space-y-1">
        <h3 className="text-base font-black uppercase text-sky-950 tracking-tight">
          MDCAT Prep
        </h3>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">
          Practice past papers, AI-generated quizzes, and study notes — all
          aligned with PMDC Pakistan curriculum.
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {["Past Papers", "AI Quizzes", "Study Notes", "Focus Timer"].map((f) => (
          <span
            key={f}
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100"
          >
            {f}
          </span>
        ))}
      </div>

      {/* CTA row */}
      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-sky-500" />
          <span className="text-[10px] font-black uppercase text-sky-500 tracking-widest">
            UHS · KMU · Sindh Board
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-sky-600 group-hover:gap-2 transition-all">
          Start Prep
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
