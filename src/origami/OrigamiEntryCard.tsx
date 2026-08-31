import { Scissors, Sparkles, ChevronRight, Star } from 'lucide-react';

interface OrigamiEntryCardProps {
  onEnter: () => void;
}

export default function OrigamiEntryCard({ onEnter }: OrigamiEntryCardProps) {
  return (
    <div
      onClick={onEnter}
      className="cursor-pointer group relative overflow-hidden rounded-3xl border border-green-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-white to-white pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-green-100/40 blur-3xl rounded-full pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-md">
          <Scissors className="w-6 h-6 text-white" />
        </div>
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 rounded-full px-3 py-1">
          <Sparkles className="w-3 h-3" /> Kids Craft
        </span>
      </div>

      <div className="relative mt-4 space-y-1">
        <h3 className="text-base font-black uppercase text-green-950 tracking-tight">
          Origami World
        </h3>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">
          Learn paper folding with step-by-step guides, video tutorials, and
          fun crafts for all ages.
        </p>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {['Paper Crane', 'Animals', 'Flowers', 'Stars', 'Video Library'].map((f) => (
          <span
            key={f}
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">
            Ages 4–14 · 100+ Crafts
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-green-600 group-hover:gap-2 transition-all">
          Start Folding
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
