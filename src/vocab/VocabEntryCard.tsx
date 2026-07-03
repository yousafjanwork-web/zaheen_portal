/**
 * VocabEntryCard — Drop this card on the Zaheen LMS dashboard.
 * When a user clicks it, navigate to /vocab.
 */
import { BookOpen, Sparkles, ChevronRight, Trophy, Star } from "lucide-react";

interface VocabEntryCardProps {
  onEnter: () => void;
}

export default function VocabEntryCard({ onEnter }: VocabEntryCardProps) {
  return (
    <div
      onClick={onEnter}
      className="cursor-pointer group relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 select-none"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-white pointer-events-none" />
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-100/40 blur-3xl rounded-full pointer-events-none" />

      {/* Top row */}
      <div className="relative flex items-start justify-between">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-50 border border-purple-100 rounded-full px-3 py-1">
          <Sparkles className="w-3 h-3" /> Gamified
        </span>
      </div>

      {/* Title */}
      <div className="relative mt-4 space-y-1">
        <h3 className="text-base font-black uppercase text-purple-950 tracking-tight">
          Vocabulary Builder
        </h3>
        <p className="text-xs font-bold text-slate-500 leading-relaxed">
          Learn English words through interactive lessons, quizzes, and
          story challenges — earn XP and badges as you grow.
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative mt-4 flex flex-wrap gap-2">
        {["Lessons", "Flashcards", "Quests", "Leaderboard", "Word Garden"].map((f) => (
          <span
            key={f}
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-100"
          >
            {f}
          </span>
        ))}
      </div>

      {/* CTA row */}
      <div className="relative mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">
            XP · Badges · Streaks
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-purple-600 group-hover:gap-2 transition-all">
          Start Learning
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
