import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

import {

  User, Badge, XPTransaction, LearningCalendarDay,

  WordCollection, AchievementStory, DailyChallenge, Quest,

} from '../types';

import { STORAGE_KEYS, getItem, setItem, clearVocabStorageForUser } from '../utils/storage';

import { allBadges } from '../data/badges';

import { initialDailyChallenges, initialQuests } from '../data/quests';

import { completeLessonWithUserId } from '../services/vocabApi';



interface AuthContextType {

  user: User | null;

  updateUser: (updates: Partial<User>) => void;

  addXP: (amount: number, reason: string, lessonId?: string) => void;

  addCoins: (amount: number) => void;

  spendCoins: (amount: number) => boolean;

  completedLessons: string[];

  markLessonComplete: (

    lessonId: string,

    result?: { score: number; xpEarned: number; wordsCount: number },

  ) => void;

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

  xp: 0,

  level: 1,

  streak: 0,

  lastActive: new Date().toISOString(),

  joinedAt: new Date().toISOString(),

  wordsLearned: 0,

  lessonsCompleted: 0,

  coins: 0,

  pets: [],

  equippedPet: null,

  inventory: [],

  customizations: { theme: 'blue', avatarFrame: 'none', trailEffect: 'none' },

};

interface AuthProviderProps {
  children: ReactNode;
  isLoggedIn?: boolean;
  displayName?: string | null;
  token?: string | null;
}



export function AuthProvider({ children, isLoggedIn = false, displayName, token }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    if (!isLoggedIn) return { ...defaultUser, xp: 0, level: 1, streak: 0, coins: 0, wordsLearned: 0, lessonsCompleted: 0 };
    const saved = getItem<User | null>(STORAGE_KEYS.USER, null);
    return saved ?? defaultUser;
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() =>
    isLoggedIn ? getItem<string[]>(STORAGE_KEYS.COMPLETED_LESSONS, []) : []
  );
  const [streak, setStreak] = useState<number>(() =>
    isLoggedIn ? getItem<number>(STORAGE_KEYS.STREAK, 0) : 0
  );

  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>(() => getItem<XPTransaction[]>(STORAGE_KEYS.XP_TRANSACTIONS, []));

  const [badges, setBadges] = useState<Badge[]>(() => getItem<Badge[]>(STORAGE_KEYS.BADGES, []));

 

  const [calendar, setCalendar] = useState<LearningCalendarDay[]>(() => getItem<LearningCalendarDay[]>(STORAGE_KEYS.CALENDAR, []));

  const [wordsLearned, setWordsLearned] = useState<string[]>(() => getItem<string[]>(STORAGE_KEYS.WORDS_LEARNED, []));

  const [challengeResponses, setChallengeResponses] = useState<Record<string, { response: string; score: number; feedback: string }>>(() => getItem(STORAGE_KEYS.CHALLENGE_RESPONSES, {}));

  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => getItem(STORAGE_KEYS.QUIZ_SCORES, {}));

  const [wordCollection, setWordCollection] = useState<WordCollection[]>(() => getItem<WordCollection[]>(STORAGE_KEYS.WORD_COLLECTION, []));

  const [stories, setStories] = useState<AchievementStory[]>(() => getItem<AchievementStory[]>(STORAGE_KEYS.STORIES, []));

  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(() => getItem<DailyChallenge[]>(STORAGE_KEYS.DAILY_CHALLENGES, initialDailyChallenges()));

  const [quests, setQuests] = useState<Quest[]>(() => getItem<Quest[]>(STORAGE_KEYS.QUESTS, initialQuests()));



  // Sync Zaheen display name into the local user object
  useEffect(() => {
    if (isLoggedIn && displayName) {
      setUser(prev => prev ? { ...prev, name: displayName } : null);
    }
  }, [isLoggedIn, displayName]);

  // Reset progress only when user explicitly logs out
  // (isLoggedIn goes from true → false, not on first mount)
  const prevLoggedInRef = useRef<boolean>(isLoggedIn);
  useEffect(() => {
    const wasLoggedIn = prevLoggedInRef.current;
    prevLoggedInRef.current = isLoggedIn;
    // Only reset if user WAS logged in and now ISN'T (actual logout)
      if (wasLoggedIn && !isLoggedIn) {
      // Clear the previous user's vocab data from localStorage
      const prevUserId = (() => {
        try {
          const raw = localStorage.getItem('zaheen_auth');
          const parsed = raw ? JSON.parse(raw) : {};
          return parsed?.userId ? String(parsed.userId) : 'guest';
        } catch { return 'guest'; }
      })();
      clearVocabStorageForUser(prevUserId);

      setUser({ ...defaultUser, xp: 0, level: 1, streak: 0, coins: 0, wordsLearned: 0, lessonsCompleted: 0 });
      setCompletedLessons([]);
      setXpTransactions([]);
      setBadges([]);
      setWordsLearned([]);
      setChallengeResponses({});
      setQuizScores({});
      setWordCollection([]);
      setStories([]);
      setDailyChallenges(initialDailyChallenges());
      setQuests(initialQuests());
    }
  }, [isLoggedIn]);

  // Persistence
  useEffect(() => { if (isLoggedIn && user) setItem(STORAGE_KEYS.USER, user); }, [user, isLoggedIn]);

   useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.COMPLETED_LESSONS, completedLessons); }, [completedLessons, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.XP_TRANSACTIONS, xpTransactions); }, [xpTransactions, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.BADGES, badges); }, [badges, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.STREAK, streak); }, [streak, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.CALENDAR, calendar); }, [calendar, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.WORDS_LEARNED, wordsLearned); }, [wordsLearned, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.CHALLENGE_RESPONSES, challengeResponses); }, [challengeResponses, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.QUIZ_SCORES, quizScores); }, [quizScores, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.WORD_COLLECTION, wordCollection); }, [wordCollection, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.STORIES, stories); }, [stories, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.DAILY_CHALLENGES, dailyChallenges); }, [dailyChallenges, isLoggedIn]);
  useEffect(() => { if (isLoggedIn) setItem(STORAGE_KEYS.QUESTS, quests); }, [quests, isLoggedIn]);



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



  const markLessonComplete = (

    lessonId: string,

    result?: { score: number; xpEarned: number; wordsCount: number },

  ) => {

    if (!completedLessons.includes(lessonId)) {

      setCompletedLessons(prev => [...prev, lessonId]);

      setUser(prev => prev ? { ...prev, lessonsCompleted: prev.lessonsCompleted + 1, lastActive: new Date().toISOString() } : null);

      const today = new Date().toISOString().split('T')[0];

      const xpEarnedToday = result?.xpEarned ?? 70;

      setCalendar(prev => {

        const exists = prev.find(d => d.date === today);

        if (exists) return prev.map(d => d.date === today ? { ...d, completed: true, xpEarned: d.xpEarned + xpEarnedToday, lessonId } : d);

        return [...prev, { date: today, completed: true, xpEarned: xpEarnedToday, lessonId }];

      });



      // Tell the backend this lesson is complete — updates the

      // student's XP/level/streak/coins server-side. Only called

      // when someone is actually logged in (we have a token).

      // This is fire-and-forget: it must never block or break the

      // celebration UI if the network hiccups.

               if (isLoggedIn && result) {
        import("../../modules/shared/hooks/Usevideoprogress").then(({ resolveUserId }) =>
          resolveUserId().then(userId => {
                     if (!userId) return;
            completeLessonWithUserId(lessonId, userId, {
              score: result.score,
              xp_earned: result.xpEarned,
              words_count: result.wordsCount,
            }).catch(err => {
              console.error(`Failed to sync lesson completion for ${lessonId}:`, err);
            });
          })
        );

      }

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

