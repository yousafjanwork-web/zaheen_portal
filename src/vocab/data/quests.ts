import { Quest, DailyChallenge } from '../types';

export const initialDailyChallenges = (): DailyChallenge[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: `dc-${today}-1`,
      date: today,
      type: 'word-sprint',
      title: 'Word Sprint',
      description: 'Learn 5 new vocabulary words today',
      target: 5,
      current: 0,
      completed: false,
      xpReward: 30,
      coinReward: 15,
    },
    {
      id: `dc-${today}-2`,
      date: today,
      type: 'memory-match',
      title: 'Memory Champion',
      description: 'Get 100% on any one activity',
      target: 1,
      current: 0,
      completed: false,
      xpReward: 25,
      coinReward: 10,
    },
    {
      id: `dc-${today}-3`,
      date: today,
      type: 'story-sprint',
      title: 'Story Teller',
      description: 'Write 50+ words in any challenge',
      target: 50,
      current: 0,
      completed: false,
      xpReward: 35,
      coinReward: 20,
    },
  ];
};

export const initialQuests = (): Quest[] => {
  const now = new Date();
  const dayEnd = new Date(now);
  dayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  return [
    {
      id: 'q-daily-1',
      title: 'Morning Warm-up',
      description: 'Complete any lesson today',
      type: 'daily',
      goal: { target: 1, current: 0 },
      xpReward: 20,
      coinReward: 10,
      expiresAt: dayEnd.toISOString(),
      completed: false,
      icon: '☀️',
    },
    {
      id: 'q-daily-2',
      title: 'Word Wizard',
      description: 'Learn 3 new vocabulary words',
      type: 'daily',
      goal: { target: 3, current: 0 },
      xpReward: 15,
      coinReward: 8,
      expiresAt: dayEnd.toISOString(),
      completed: false,
      icon: '✨',
    },
    {
      id: 'q-daily-3',
      title: 'Quiz Master',
      description: 'Pass any quiz with 80%+',
      type: 'daily',
      goal: { target: 1, current: 0 },
      xpReward: 25,
      coinReward: 12,
      expiresAt: dayEnd.toISOString(),
      completed: false,
      icon: '🎯',
    },
    {
      id: 'q-weekly-1',
      title: 'Marathon Reader',
      description: 'Complete 5 lessons this week',
      type: 'weekly',
      goal: { target: 5, current: 0 },
      xpReward: 100,
      coinReward: 50,
      expiresAt: weekEnd.toISOString(),
      completed: false,
      icon: '🏃',
    },
    {
      id: 'q-weekly-2',
      title: 'Word Collector',
      description: 'Learn 15 new words this week',
      type: 'weekly',
      goal: { target: 15, current: 0 },
      xpReward: 75,
      coinReward: 40,
      expiresAt: weekEnd.toISOString(),
      completed: false,
      icon: '📚',
    },
  ];
};
