import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Quest, DailyChallenge } from '../types';
import { Target, Zap, Gift, Check, Calendar, Sparkles, Flame } from 'lucide-react';
import { useState } from 'react';

function QuestCard({ quest, onClaim, canClaim }: {
  quest: Quest;
  onClaim: () => void;
  canClaim: boolean;
}) {
  const expired = new Date(quest.expiresAt) < new Date();
  const progressPct = Math.round((quest.goal.current / quest.goal.target) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden ${
        quest.completed && !quest.claimedAt
          ? 'border-lime-300 dark:border-lime-700/50 bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/10 shadow-md'
          : quest.claimedAt
          ? 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 opacity-70'
          : expired
          ? 'border-slate-200 dark:border-slate-700 opacity-60'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{quest.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-800 dark:text-white">{quest.title}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              quest.type === 'daily' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
            }`}>
              {quest.type}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{quest.description}</p>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-slate-600 dark:text-slate-300">
                {quest.goal.current} / {quest.goal.target}
              </span>
              <span className="text-slate-400">{progressPct}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                className={`h-full rounded-full ${
                  quest.completed ? 'bg-gradient-to-r from-lime-400 to-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> {quest.xpReward} XP
            </span>
            <span className="text-lime-600 dark:text-lime-400 font-bold flex items-center gap-1">
              🪙 {quest.coinReward}
            </span>
          </div>

          {/* Claim button */}
          {quest.completed && !quest.claimedAt && canClaim && (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClaim}
              className="mt-3 w-full py-2.5 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl font-black hover:scale-[1.02] transition-all shadow-lg shadow-lime-200/50 flex items-center justify-center gap-2 animate-pulse"
            >
              <Gift className="w-4 h-4" /> Claim Reward!
            </motion.button>
          )}
          {quest.claimedAt && (
            <div className="mt-3 w-full py-2 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Claimed
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DailyChallengeCard({ challenge }: { challenge: DailyChallenge }) {
  const progressPct = Math.round((challenge.current / challenge.target) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className={`relative p-5 rounded-2xl border-2 transition-all overflow-hidden ${
        challenge.completed
          ? 'border-amber-300 dark:border-amber-700/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-amber-300'
      }`}
    >
      {challenge.completed && (
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-white" />
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="text-2xl">
          {challenge.type === 'word-sprint' && '⚡'}
          {challenge.type === 'memory-match' && '🧠'}
          {challenge.type === 'story-sprint' && '📝'}
          {challenge.type === 'spelling-bee' && '🐝'}
          {challenge.type === 'word-detective' && '🔍'}
        </div>
        <div className="flex-1">
          <h3 className="font-black text-slate-800 dark:text-white">{challenge.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{challenge.description}</p>

          <div className="mt-3 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              className={`h-full rounded-full ${
                challenge.completed
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                  : 'bg-gradient-to-r from-orange-400 to-rose-500'
              }`}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs">
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {challenge.current} / {challenge.target}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-amber-600 font-bold">+{challenge.xpReward} XP</span>
              <span className="text-lime-600 font-bold">+{challenge.coinReward} 🪙</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Quests() {
  const { quests, dailyChallenges, claimQuest, streak } = useAuth();
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const weeklyQuests = quests.filter(q => q.type === 'weekly');
  const list = tab === 'daily' ? dailyQuests : weeklyQuests;

  const completedCount = quests.filter(q => q.completed).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-6 md:p-8 text-white shadow-xl shadow-pink-200/40"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-yellow-200/30 blur-3xl animate-float" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-fuchsia-200/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold border border-white/30 mb-2">
              🎯 Quests & Challenges
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Daily missions await!
            </h1>
            <p className="text-white/85 mt-1">
              Complete quests for bonus XP, coins, and rare badges!
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 text-center min-w-[90px]">
              <p className="text-[10px] text-white/80 uppercase tracking-wider font-bold">Done</p>
              <p className="text-2xl font-black">{completedCount}/{quests.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 text-center min-w-[90px]">
              <Flame className="w-5 h-5 mx-auto mb-0.5" />
              <p className="text-2xl font-black">{streak}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily challenges (always shown) */}
      <div>
        <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-amber-500" />
          Today's Challenges
          <span className="text-xs text-slate-400 font-normal">— Resets daily</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {dailyChallenges.map(c => (
            <DailyChallengeCard key={c.id} challenge={c} />
          ))}
        </div>
      </div>

      {/* Quests tab */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Quests
          </h2>
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {(['daily', 'weekly'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  tab === t
                    ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {list.map(q => (
            <QuestCard
              key={q.id}
              quest={q}
              onClaim={() => claimQuest(q.id)}
              canClaim={q.completed && !q.claimedAt}
            />
          ))}
        </div>
      </div>

      {/* Streak protection reminder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 rounded-2xl p-5 border border-orange-200/60 dark:border-orange-700/30 flex items-center gap-4"
      >
        <div className="text-5xl">🔥</div>
        <div>
          <h3 className="font-black text-slate-800 dark:text-white">
            {streak}-day streak in progress!
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Learn something today to keep your streak alive and unlock bonus rewards!
          </p>
        </div>
        <Sparkles className="ml-auto w-8 h-8 text-amber-500 animate-pulse" />
      </motion.div>
    </div>
  );
}
