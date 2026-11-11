import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, Mic } from 'lucide-react';
import { SubjectId } from '../data/quizData';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentView: 'home' | SubjectId | 'stickers' | 'quiz';
  onNavigate: (view: 'home' | SubjectId | 'stickers') => void;
  totalStars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenMediaStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  totalStars,
  isMuted,
  onToggleMute,
  onOpenMediaStudio,
}) => {
  const handleNavClick = (view: 'home' | SubjectId | 'stickers') => {
    sounds.playPop();
    onNavigate(view);
  };

  return (
    <header className="hidden bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Wordmark Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="hidden"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xl sm:text-2xl shadow-md border-2 border-amber-500 group-hover:scale-105 transition-transform">
            <span>ذ</span>
          </div>
          <div className="leading-tight">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors font-fun">
              Zaheen
            </span>
            <span className="hidden sm:inline-block ml-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              Kindergarten
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'home'
                ? 'bg-amber-100 text-amber-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick('english')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'english'
                ? 'bg-sky-100 text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            English
          </button>

          <button
            onClick={() => handleNavClick('urdu')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap font-urdu text-base sm:text-lg ${
              currentView === 'urdu'
                ? 'bg-rose-100 text-rose-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            اردو
          </button>

          <button
            onClick={() => handleNavClick('maths')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'maths'
                ? 'bg-emerald-100 text-emerald-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Maths
          </button>

          <button
            onClick={() => handleNavClick('stickers')}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'stickers'
                ? 'bg-purple-100 text-purple-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-purple-600" />
            <span>Stickers</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Star Meter */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Custom Media Studio Button for Parents/Teachers */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenMediaStudio();
            }}
            title="Record Voice & Upload Custom Photos"
            className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">My Voice & Photos</span>
            <span className="sm:hidden">Custom</span>
          </button>

          {/* Star Counter */}
          <button
            onClick={() => handleNavClick('stickers')}
            title="View Zaheen's Stickers"
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-sm sm:text-base shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400" />
            <span className="tabular-nums font-fun">{totalStars}</span>
          </button>

          {/* Sound Mute / Unmute */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 transition-transform active:scale-95 cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-slate-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
