/**
 * CosmokidEntryCard — Drop this card anywhere on the Zaheen LMS dashboard.
 * When a logged-in user clicks it, they navigate to the Cosmokid space explorer.
 */
import React from "react";
import { Rocket, Sparkles, ChevronRight, Globe } from "lucide-react";

interface CosmokidEntryCardProps {
  onEnter: () => void;
}

export default function CosmokidEntryCard({ onEnter }: CosmokidEntryCardProps) {
  return (
    <div
      onClick={onEnter}
      className="cursor-pointer group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a2a] p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5 select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-transparent pointer-events-none" />
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1">
          <Sparkles className="w-3 h-3" /> Kids
        </span>
      </div>

      <div className="relative mt-4 space-y-1">
        <h3 className="text-base font-black uppercase text-white tracking-tight">
          Cosmo Kid
        </h3>
        <p className="text-xs font-bold text-white/50 leading-relaxed">
          Explore planets, quiz your space knowledge, and launch rockets — in English & Urdu!
        </p>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {["Solar System", "Space Quiz", "Academy", "Urdu Support"].map((f) => (
          <span key={f} className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-white/5 text-white/60 border border-white/10">
            {f}
          </span>
        ))}
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-cyan-500" />
          <span className="text-[10px] font-black uppercase text-cyan-500/70 tracking-widest">
            Ages 6–14
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-cyan-400 group-hover:gap-2 transition-all">
          Explore
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
