import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { allBadges } from '../data/badges';
import { Trophy, Lock, Award } from 'lucide-react';

export default function Achievements() {
  const { user, badges } = useAuth();
  if (!user) return null;

  const earnedBadgeIds = new Set(badges.map(b => b.id));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-500" /> Achievements
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {badges.length}/{allBadges.length} badges earned — keep learning to unlock more!
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Badge Progress</span>
          <span className="text-sm font-bold text-violet-600 dark:text-violet-400">{badges.length}/{allBadges.length}</span>
        </div>
        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(badges.length / allBadges.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allBadges.map((badge, i) => {
          const earned = earnedBadgeIds.has(badge.id);
          const earnedBadge = badges.find(b => b.id === badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl p-5 border-2 text-center transition-all ${
                earned
                  ? 'bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10 border-amber-300 dark:border-amber-600 shadow-lg shadow-amber-100 dark:shadow-amber-900/20'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-70'
              }`}
            >
              {earned && (
                <div className="absolute -top-2 -right-2">
                  <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <div className={`text-5xl mb-3 ${earned ? '' : 'grayscale opacity-50'}`}>
                {badge.icon}
              </div>
              <h3 className={`font-bold text-sm mb-1 ${earned ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {badge.name}
              </h3>
              <p className="text-xs text-slate-400">{badge.description}</p>
              <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-2">{badge.criteria}</p>

              {earned && earnedBadge?.unlockedAt && (
                <p className="text-[10px] text-amber-500 mt-2 font-medium">
                  🎉 Earned {new Date(earnedBadge.unlockedAt).toLocaleDateString()}
                </p>
              )}

              {!earned && (
                <div className="mt-2">
                  <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
