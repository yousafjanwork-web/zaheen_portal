import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User, Badge, XPTransaction, LearningCalendarDay,
  WordCollection, AchievementStory, DailyChallenge, Quest,
} from '../types';
import { STORAGE_KEYS, getItem, setItem } from '../utils/storage';
import { allBadges } from '../data/badges';
import { initialDailyChallenges, initialQuests } from '../data/quests';

interface AuthContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number, reason: string, lessonId?: string) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  completedLessons: string[];
  markLessonComplete: (lessonId: string) => void;
  badges: Badge[];
  xpTransactions: XPTransaction[];
  calendar: LearningCalendarDay[];
  wordsLearned: string[];
  addWordsLearned: (wordIds: string[]) => void;
  challengeResponses: Record<string, { response: string; score: number; feedback: string }>;
  saveChallengeResponse: (lessonId: string, response: string, score: number, feedback: string) => void;
  quizScores: Record<string, number>;
  saveQuizScore: (lessonId: string, score: number) => void;
  streak: number;
  wordCollection: WordCollection[];
  addToCollection: (word: { id: string; word: string; theme: string; emoji: string; definition: string }) => void;
  stories: AchievementStory[];
  publishStory: (story: Omit<AchievementStory, 'id' | 'published' | 'likes'>) => void;
  likeStory: (storyId: string) => void;
  dailyChallenges: DailyChallenge[];
  updateChallengeProgress: (id: string, increment: number) => void;
  quests: Quest[];
  updateQuestProgress: (id: string, increment: number) => void;
  claimQuest: (id: string) => boolean;
  equipPet: (petId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const defaultUser: User = {
  id: 'user-1',
  name: 'Alex',
  email: 'alex@example.com',
  role: 'student',
  ageGroup: 'junior',
  avatar: '🦸',
  xp: 150,
  level: 2,
  streak: 3,
  lastActive: new Date().toISOString(),
  joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  wordsLearned: 15,
  lessonsCompleted: 2,
  coins: 250,
  pets: [],
  equippedPet: null,
  inventory: [],
  customizations: { theme: 'blue', avatarFrame: 'none', trailEffect: 'none' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getItem<User | null>(STORAGE_KEYS.USER, defaultUser));
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => getItem<string[]>(STORAGE_KEYS.COMPLETED_LESSONS, ['lesson-1']));
  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>(() => getItem<XPTransaction[]>(STORAGE_KEYS.XP_TRANSACTIONS, []));
  const [badges, setBadges] = useState<Badge[]>(() => getItem<Badge[]>(STORAGE_KEYS.BADGES, []));
  const [streak] = useState<number>(() => getItem<number>(STORAGE_KEYS.STREAK, 3));
  const [calendar, setCalendar] = useState<LearningCalendarDay[]>(() => getItem<LearningCalendarDay[]>(STORAGE_KEYS.CALENDAR, []));
  const [wordsLearned, setWordsLearned] = useState<string[]>(() => getItem<string[]>(STORAGE_KEYS.WORDS_LEARNED, []));
  const [challengeResponses, setChallengeResponses] = useState<Record<string, { response: string; score: number; feedback: string }>>(() => getItem(STORAGE_KEYS.CHALLENGE_RESPONSES, {}));
  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => getItem(STORAGE_KEYS.QUIZ_SCORES, {}));
  const [wordCollection, setWordCollection] = useState<WordCollection[]>(() => getItem<WordCollection[]>(STORAGE_KEYS.WORD_COLLECTION, []));
  const [stories, setStories] = useState<AchievementStory[]>(() => getItem<AchievementStory[]>(STORAGE_KEYS.STORIES, []));
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => getItem<DailyChallenge[]>(STORAGE_KEYS.DAILY_CHALLENGES, initialDailyChallenges()));
  const [quests, setQuests] = useState<Quest[]>(() => getItem<Quest[]>(STORAGE_KEYS.QUESTS, initialQuests()));

  // Persistence
  useEffect(() => { if (user) setItem(STORAGE_KEYS.USER, user); }, [user]);
  useEffect(() => { setItem(STORAGE_KEYS.COMPLETED_LESSONS, completedLessons); }, [completedLessons]);
  useEffect(() => { setItem(STORAGE_KEYS.XP_TRANSACTIONS, xpTransactions); }, [xpTransactions]);
  useEffect(() => { setItem(STORAGE_KEYS.BADGES, badges); }, [badges]);
  useEffect(() => { setItem(STORAGE_KEYS.STREAK, streak); }, [streak]);
  useEffect(() => { setItem(STORAGE_KEYS.CALENDAR, calendar); }, [calendar]);
  useEffect(() => { setItem(STORAGE_KEYS.WORDS_LEARNED, wordsLearned); }, [wordsLearned]);
  useEffect(() => { setItem(STORAGE_KEYS.CHALLENGE_RESPONSES, challengeResponses); }, [challengeResponses]);
  useEffect(() => { setItem(STORAGE_KEYS.QUIZ_SCORES, quizScores); }, [quizScores]);
  useEffect(() => { setItem(STORAGE_KEYS.WORD_COLLECTION, wordCollection); }, [wordCollection]);
  useEffect(() => { setItem(STORAGE_KEYS.STORIES, stories); }, [stories]);
  useEffect(() => { setItem(STORAGE_KEYS.DAILY_CHALLENGES, dailyChallenges); }, [dailyChallenges]);
  useEffect(() => { setItem(STORAGE_KEYS.QUESTS, quests); }, [quests]);

  // Badge checker
  useEffect(() => {
    const newBadges: Badge[] = [];
    const earnedIds = new Set(badges.map(b => b.id));

    if (completedLessons.length >= 1 && !earnedIds.has('first-lesson')) {
      newBadges.push({ ...allBadges.find(b => b.id === 'first-lesson')!, unlockedAt: new Date().toISOString() });
    }
    if (wordsLearned.length >= 25 && !earnedIds.has('vocabulary-explorer')) {
      newBadges.push({ ...allBadges.find(b => b.id === 'vocabulary-explorer')!, unlockedAt: new Date().toISOString() });
    }
    if (wordsLearned.length >= 50 && !earnedIds.has('fifty-words')) {
      newBadges.push({ ...allBadges.find(b => b.id === 'fifty-words')!, unlockedAt: new Date().toISOString() });
    }
    if (streak >= 7 && !earnedIds.has('seven-day-streak')) {
      newBadges.push({ ...allBadges.find(b => b.id === 'seven-day-streak')!, unlockedAt: new Date().toISOString() });
    }
    if (wordsLearned.length >= 100 && !earnedIds.has('word-collector')) {
      newBadges.push({ ...allBadges.find(b => b.id === 'word-collector')!, unlockedAt: new Date().toISOString() });
    }

    const challengeResponsesArray = Object.values(challengeResponses);
    const highScoreChallenges = challengeResponsesArray.filter(c => c.score >= 80).length;
    if (highScoreChallenges >= 5 && !earnedIds.has('creative-writer')) {
      newBadges.push({ ...allBadges.find(b => b.id === 'creative-writer')!, unlockedAt: new Date().toISOString() });
    }

    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
    }
  }, [completedLessons, wordsLearned, streak, challengeResponses]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const addXP = (amount: number, reason: string, lessonId?: string) => {
    const transaction: XPTransaction = {
      id: `xp-${Date.now()}-${Math.random()}`,
      userId: user?.id || '',
      amount,
      reason,
      timestamp: new Date().toISOString(),
      lessonId,
    };
    setXpTransactions(prev => [...prev, transaction]);
    setUser(prev => {
      if (!prev) return null;
      const newXP = prev.xp + amount;
      const newLevel = Math.max(1, Math.floor(newXP / 500) + 1);
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const addCoins = (amount: number) => {
    setUser(prev => prev ? { ...prev, coins: prev.coins + amount } : null);
  };

  const spendCoins = (amount: number): boolean => {
    if (!user || user.coins < amount) return false;
    setUser(prev => prev ? { ...prev, coins: prev.coins - amount } : null);
    return true;
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
      setUser(prev => prev ? { ...prev, lessonsCompleted: prev.lessonsCompleted + 1, lastActive: new Date().toISOString() } : null);
      const today = new Date().toISOString().split('T')[0];
      setCalendar(prev => {
        const exists = prev.find(d => d.date === today);
        if (exists) return prev.map(d => d.date === today ? { ...d, completed: true, xpEarned: d.xpEarned + 70, lessonId } : d);
        return [...prev, { date: today, completed: true, xpEarned: 70, lessonId }];
      });
    }
  };

  const addWordsLearned = (wordIds: string[]) => {
    setWordsLearned(prev => {
      const newWords = wordIds.filter(w => !prev.includes(w));
      return [...prev, ...newWords];
    });
    setUser(prev => prev ? { ...prev, wordsLearned: prev.wordsLearned + wordIds.length } : null);
  };

  const saveChallengeResponse = (lessonId: string, response: string, score: number, feedback: string) => {
    setChallengeResponses(prev => ({ ...prev, [lessonId]: { response, score, feedback } }));
  };

  const saveQuizScore = (lessonId: string, score: number) => {
    setQuizScores(prev => ({ ...prev, [lessonId]: score }));
  };

  const addToCollection = (word: { id: string; word: string; theme: string; emoji: string; definition: string }) => {
    setWordCollection(prev => {
      const existing = prev.find(w => w.wordId === word.id);
      if (existing) {
        return prev.map(w => w.wordId === word.id
          ? { ...w, timesReviewed: w.timesReviewed + 1, mastery: w.timesReviewed + 1 >= 3 ? 'mastered' : w.timesReviewed + 1 >= 1 ? 'familiar' : 'learning' }
          : w);
      }
      const newWord: WordCollection = {
        wordId: word.id,
        word: word.word,
        theme: word.theme,
        emoji: word.emoji,
        definition: word.definition,
        collectedAt: new Date().toISOString(),
        timesReviewed: 0,
        mastery: 'new',
      };
      return [...prev, newWord];
    });
  };

  const publishStory = (story: Omit<AchievementStory, 'id' | 'published' | 'likes'>) => {
    setStories(prev => [{ ...story, id: `story-${Date.now()}`, published: true, likes: 0 }, ...prev]);
  };

  const likeStory = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, likes: s.likes + 1 } : s));
  };

  const updateChallengeProgress = (id: string, increment: number) => {
    setDailyChallenges(prev => prev.map(c =>
      c.id === id && !c.completed
        ? { ...c, current: Math.min(c.target, c.current + increment), completed: c.current + increment >= c.target }
        : c
    ));
  };

  const updateQuestProgress = (id: string, increment: number) => {
    setQuests(prev => prev.map(q =>
      q.id === id && !q.completed && !q.claimedAt
        ? { ...q, goal: { ...q.goal, current: Math.min(q.goal.target, q.goal.current + increment) }, completed: q.goal.current + increment >= q.goal.target }
        : q
    ));
  };

  const claimQuest = (id: string): boolean => {
    const quest = quests.find(q => q.id === id);
    if (!quest || !quest.completed || quest.claimedAt) return false;
    setQuests(prev => prev.map(q => q.id === id ? { ...q, claimedAt: new Date().toISOString() } : q));
    addXP(quest.xpReward, `Quest complete: ${quest.title}`);
    addCoins(quest.coinReward);
    return true;
  };

  const equipPet = (petId: string) => {
    setUser(prev => prev ? { ...prev, equippedPet: prev.equippedPet === petId ? null : petId } : null);
  };

  return (
    <AuthContext.Provider value={{
      user, updateUser,
      addXP, addCoins, spendCoins,
      completedLessons, markLessonComplete, badges, xpTransactions,
      calendar, wordsLearned, addWordsLearned, challengeResponses,
      saveChallengeResponse, quizScores, saveQuizScore, streak,
      wordCollection, addToCollection,
      stories, publishStory, likeStory,
      dailyChallenges, updateChallengeProgress,
      quests, updateQuestProgress, claimQuest,
      equipPet,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
