import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLeaderboardData } from '../hooks/useLeaderboardData';
import { LeaderboardEntry } from '../types';
import { Crown, Medal, Trophy, Flame, Star, Sparkles } from 'lucide-react';

type Tab = 'all-time' | 'weekly';

export default function Leaderboard() {
  const { user } = useAuth();
  const { entries: leaders, isLoading, error } = useLeaderboardData();
  const [tab, setTab] = useState<Tab>('all-time');

  if (!user) return null;

  if (isLoading) {
    return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Loading leaderboard…</div>;
  }
  if (error) {
    return <div className="text-center py-20 text-rose-500">{error}</div>;
  }

  const userEntry: Omit<LeaderboardEntry, 'rank'> = {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    badgeCount: 0,
    weeklyXp: Math.floor(user.xp * 0.4),
    isCurrentUser: true,
  };

  // If the current user is already in the top-20 the API returned,
  // don't duplicate them — just flag the existing row instead.
  const alreadyInList = leaders.some(l => l.id === user.id);
  const combined: Omit<LeaderboardEntry, 'rank'>[] = alreadyInList
    ? leaders.map(l => (l.id === user.id ? { ...l, isCurrentUser: true } : l))
    : [...leaders, userEntry];

  const all: LeaderboardEntry[] = combined
    .sort((a, b) => tab === 'all-time' ? b.xp - a.xp : (b.weeklyXp || 0) - (a.weeklyXp || 0))
    .map((entry, i) => ({ ...entry, rank: i + 1 }));

  const podium = all.slice(0, 3);
  const rest = all.slice(3);
  const myRank = all.find(e => e.isCurrentUser)?.rank || 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 md:p-8 text-white shadow-xl shadow-orange-200/40"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-yellow-200/30 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-pink-200/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 mb-2">
              🏆 Leaderboard
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Compete with friends!
            </h1>
            <p className="text-white/85 mt-1">
              Climb the ranks by earning XP and winning streaks.
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 text-center min-w-[160px]">
            <p className="text-xs text-white/80 uppercase tracking-wider font-bold">Your Rank</p>
            <p className="text-4xl font-black">#{myRank}</p>
          </div>
        </div>
      </motion.div>

      {/* Tab switcher */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1">
          {(['all-time', 'weekly'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-md'
                  : 'text-slate-500'
              }`}
            >
              {t === 'all-time' ? '🏆 All-Time' : '⚡ This Week'}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 items-end">
        {podium.map((entry, i) => {
          const order = [1, 0, 2][i]; // 2nd, 1st, 3rd visual order
          const displayIndex = order;
          const podiumHeight = displayIndex === 0 ? 'h-48' : displayIndex === 1 ? 'h-40' : 'h-32';
          const podiumColor = displayIndex === 0
            ? 'from-amber-400 to-yellow-500'
            : displayIndex === 1
            ? 'from-slate-300 to-slate-400'
            : 'from-orange-400 to-amber-600';
          const Icon = displayIndex === 0 ? Crown : Medal;
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`${podiumHeight} rounded-2xl p-3 flex flex-col items-center justify-end text-center text-white bg-gradient-to-b ${podiumColor} shadow-lg relative overflow-hidden ${entry.isCurrentUser ? 'ring-4 ring-lime-400' : ''}`}
            >
              {entry.isCurrentUser && (
                <div className="absolute -top-2 inset-x-0 flex justify-center">
                  <span className="px-2 py-0.5 rounded-full bg-lime-400 text-lime-900 text-[10px] font-black uppercase tracking-wider">
                    You
                  </span>
                </div>
              )}
              <Icon className="w-6 h-6 mb-1 drop-shadow" />
              <div className="text-3xl mb-1">{entry.avatar}</div>
              <p className="text-xs font-black truncate w-full">{entry.name}</p>
              <p className="text-[10px] opacity-80">Lv {entry.level}</p>
              <p className="font-black text-lg mt-1">
                {tab === 'all-time' ? entry.xp.toLocaleString() : entry.weeklyXp}
              </p>
              <p className="text-[10px] opacity-80">{tab === 'all-time' ? 'XP' : 'XP/week'}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-slate-200/70 dark:border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {tab === 'all-time' ? 'All-Time Rankings' : 'This Week\'s Champions'}
          </span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {rest.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                entry.isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                entry.isCurrentUser
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                #{entry.rank}
              </div>
              <div className="text-2xl">{entry.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                  {entry.name} {entry.isCurrentUser && <span className="text-blue-500 text-xs">(You)</span>}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <span>Lv {entry.level}</span>
                  <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-500" />{entry.streak}d</span>
                  <span className="flex items-center gap-0.5"><Trophy className="w-3 h-3 text-amber-500" />{entry.badgeCount}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-slate-800 dark:text-white">
                  {tab === 'all-time' ? entry.xp.toLocaleString() : entry.weeklyXp}
                </p>
                <p className="text-[10px] text-slate-400 flex items-center gap-0.5 justify-end">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {tab === 'all-time' ? 'XP' : 'XP this week'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
