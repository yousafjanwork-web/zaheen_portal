import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import {
  BookOpen, Home, Trophy, User, Menu, X, Star, Sun, Moon,
  Target, Sparkles, Trees, Library, Award
} from 'lucide-react';

const juniorLevels = ['Beginner Explorer', 'Word Adventurer', 'Vocabulary Hero', 'Story Builder', 'Word Master'];
const seniorLevels = ['Word Explorer', 'Creative Communicator', 'Language Champion', 'Story Creator', 'Vocabulary Expert'];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  if (!user) return null;

  const levels = user.ageGroup === 'junior' ? juniorLevels : seniorLevels;
  const currentLevel = levels[Math.min(user.level - 1, levels.length - 1)];

  const navItems = [
    { to: '/vocab', label: 'Home', icon: Home },
    { to: '/vocab/courses', label: 'Courses', icon: BookOpen },
    { to: '/vocab/quests', label: 'Quests', icon: Target },
    { to: '/vocab/word-garden', label: 'Garden', icon: Trees },
    { to: '/vocab/flashcards', label: 'Cards', icon: Library },
  ];

  const moreItems = [
    { to: '/vocab/story-studio', label: 'Story Studio', icon: Sparkles },
    { to: '/vocab/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/vocab/achievements', label: 'Badges', icon: Award },
    { to: '/vocab/dashboard', label: 'Dashboard', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/75 dark:bg-slate-950/75 border-b border-slate-200/60 dark:border-slate-800/60 shadow-[0_1px_30px_-10px_rgba(37,99,235,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo size="sm" showText animate />
            <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-100 dark:bg-lime-900/30 text-[10px] font-bold text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-700/40">
              ⭐ {currentLevel}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-2xl p-1 border border-slate-200/60 dark:border-slate-700/60">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active
                      ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lime-500" />
                  )}
                </Link>
              );
            })}

            {/* More menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300">
                More <span className="text-[10px]">▾</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {moreItems.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10 border border-amber-200 dark:border-amber-700/30 shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{user.xp.toLocaleString()}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-700/30 shadow-sm">
              <span className="text-sm">🪙</span>
              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">{user.coins}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/10 border border-orange-200 dark:border-orange-700/30 shadow-sm">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{user.streak}d</span>
            </div>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 pl-2 ml-1 border-l border-slate-200 dark:border-slate-700 px-2 py-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Learner</span>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Menu"
            >
              {isOpen ? <X className="w-5 h-5 text-slate-700 dark:text-slate-300" /> : <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-700 space-y-1 animate-slide-up">
            {[...navItems, ...moreItems].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === to
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}