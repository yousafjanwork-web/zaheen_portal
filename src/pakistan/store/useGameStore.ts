import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BadgeId, Collectible, GameId, ProvinceId } from "../types";
import { badges, collectiblesCatalog } from "../data/content";

interface GameState {
  // Progress
  xp: number;
  coins: number;
  stars: number;
  level: number;
  streak: number;
  lastVisitDate: string | null;
  dailyRewardClaimed: boolean;

  // Exploration
  visitedProvinces: ProvinceId[];
  visitedCities: string[];
  viewedAnimals: string[];
  viewedFoods: string[];
  viewedHeroes: string[];
  completedStories: string[];
  completedGames: GameId[];
  perfectQuizzes: number;

  // Rewards
  earnedBadges: BadgeId[];
  collectibles: string[];
  newlyEarnedBadge: BadgeId | null;
  showCelebration: boolean;
  celebrationMessage: string;

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  narrationEnabled: boolean;
  language: "en" | "ur";
  ageGroup: "5-7" | "8-10" | "11-12";

  // Companion
  zaheenMessage: string | null;
  zaheenMood: "happy" | "excited" | "thinking" | "celebrate" | "wave";

  // Actions
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addStars: (amount: number) => void;
  visitProvince: (id: ProvinceId) => void;
  visitCity: (id: string) => void;
  viewAnimal: (id: string) => void;
  viewFood: (id: string) => void;
  viewHero: (id: string) => void;
  completeStory: (id: string) => void;
  completeGame: (id: GameId, score: number, maxScore: number) => void;
  completeQuiz: (correct: number, total: number) => void;
  addCollectible: (id: string) => void;
  claimDailyReward: () => void;
  checkStreak: () => void;
  checkBadges: () => void;
  clearCelebration: () => void;
  setZaheenMessage: (msg: string | null, mood?: GameState["zaheenMood"]) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleNarration: () => void;
  setLanguage: (lang: "en" | "ur") => void;
  setAgeGroup: (age: GameState["ageGroup"]) => void;
  getCollectibleItems: () => Collectible[];
}

const calcLevel = (xp: number) => Math.floor(xp / 100) + 1;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 50,
      stars: 0,
      level: 1,
      streak: 0,
      lastVisitDate: null,
      dailyRewardClaimed: false,

      visitedProvinces: [],
      visitedCities: [],
      viewedAnimals: [],
      viewedFoods: [],
      viewedHeroes: [],
      completedStories: [],
      completedGames: [],
      perfectQuizzes: 0,

      earnedBadges: [],
      collectibles: [],
      newlyEarnedBadge: null,
      showCelebration: false,
      celebrationMessage: "",

      soundEnabled: true,
      musicEnabled: true,
      narrationEnabled: true,
      language: "en",
      ageGroup: "8-10",

      zaheenMessage: null,
      zaheenMood: "happy",

      addXp: (amount) => {
        const { xp } = get();
        const newXp = xp + amount;
        const newLevel = calcLevel(newXp);
        const oldLevel = calcLevel(xp);
        set({ xp: newXp, level: newLevel });
        if (newLevel > oldLevel) {
          set({
            showCelebration: true,
            celebrationMessage: `Level Up! You reached Level ${newLevel}! 🌟`,
            zaheenMood: "celebrate",
            zaheenMessage: `Wow! Level ${newLevel}! You are amazing!`,
          });
          get().addCoins(25);
          get().addStars(3);
        }
        get().checkBadges();
      },

      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),

      addStars: (amount) => set((s) => ({ stars: s.stars + amount })),

      visitProvince: (id) => {
        const { visitedProvinces } = get();
        if (!visitedProvinces.includes(id)) {
          set({ visitedProvinces: [...visitedProvinces, id] });
          get().addXp(20);
          get().addCoins(5);
          get().addStars(1);
          get().setZaheenMessage("Great exploring! A new province unlocked!", "excited");
          // Province collectibles
          const provinceCols = collectiblesCatalog.filter((c) => c.provinceId === id);
          if (provinceCols[0]) get().addCollectible(provinceCols[0].id);
        }
        get().checkBadges();
      },

      visitCity: (id) => {
        const { visitedCities } = get();
        if (!visitedCities.includes(id)) {
          set({ visitedCities: [...visitedCities, id] });
          get().addXp(15);
          get().addStars(1);
        }
      },

      viewAnimal: (id) => {
        const { viewedAnimals } = get();
        if (!viewedAnimals.includes(id)) {
          set({ viewedAnimals: [...viewedAnimals, id] });
          get().addXp(5);
        }
        get().checkBadges();
      },

      viewFood: (id) => {
        const { viewedFoods } = get();
        if (!viewedFoods.includes(id)) {
          set({ viewedFoods: [...viewedFoods, id] });
          get().addXp(5);
        }
        get().checkBadges();
      },

      viewHero: (id) => {
        const { viewedHeroes } = get();
        if (!viewedHeroes.includes(id)) {
          set({ viewedHeroes: [...viewedHeroes, id] });
          get().addXp(10);
          get().addStars(1);
        }
        get().checkBadges();
      },

      completeStory: (id) => {
        const { completedStories } = get();
        if (!completedStories.includes(id)) {
          set({ completedStories: [...completedStories, id] });
          get().addXp(40);
          get().addCoins(15);
          get().addStars(2);
          get().setZaheenMessage("Story complete! You are a History Hero!", "celebrate");
        }
        get().checkBadges();
      },

      completeGame: (id, score, maxScore) => {
        const { completedGames } = get();
        if (!completedGames.includes(id)) {
          set({ completedGames: [...completedGames, id] });
        }
        const ratio = maxScore > 0 ? score / maxScore : 0;
        const xp = Math.round(30 + ratio * 30);
        const coins = Math.round(10 + ratio * 15);
        get().addXp(xp);
        get().addCoins(coins);
        if (ratio >= 0.8) get().addStars(2);
        else get().addStars(1);
        get().setZaheenMessage(
          ratio >= 0.8 ? "Fantastic game! You crushed it!" : "Nice try! Practice makes perfect!",
          ratio >= 0.8 ? "celebrate" : "happy"
        );
        get().checkBadges();
      },

      completeQuiz: (correct, total) => {
        const ratio = total > 0 ? correct / total : 0;
        get().addXp(Math.round(20 + ratio * 40));
        get().addCoins(Math.round(8 + ratio * 15));
        get().addStars(ratio === 1 ? 3 : ratio >= 0.6 ? 2 : 1);
        if (ratio === 1) {
          set((s) => ({ perfectQuizzes: s.perfectQuizzes + 1 }));
          get().setZaheenMessage("Perfect score! Quiz Champion energy!", "celebrate");
        } else {
          get().setZaheenMessage(`You got ${correct}/${total}! Keep learning!`, "happy");
        }
        get().checkBadges();
      },

      addCollectible: (id) => {
        const { collectibles } = get();
        if (!collectibles.includes(id)) {
          set({ collectibles: [...collectibles, id] });
          get().addXp(10);
          get().setZaheenMessage("New collectible for your shelf! ✨", "excited");
        }
        get().checkBadges();
      },

      claimDailyReward: () => {
        const { dailyRewardClaimed } = get();
        if (!dailyRewardClaimed) {
          get().addCoins(20);
          get().addXp(15);
          get().addStars(1);
          set({ dailyRewardClaimed: true });
          get().setZaheenMessage("Daily treasure claimed! Come back tomorrow!", "celebrate");
        }
      },

      checkStreak: () => {
        const today = new Date().toDateString();
        const { lastVisitDate, streak } = get();
        if (lastVisitDate === today) return;

        if (!lastVisitDate) {
          set({ lastVisitDate: today, streak: 1, dailyRewardClaimed: false });
          return;
        }

        const last = new Date(lastVisitDate);
        const now = new Date(today);
        const diff = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
          set({ lastVisitDate: today, streak: streak + 1, dailyRewardClaimed: false });
        } else {
          set({ lastVisitDate: today, streak: 1, dailyRewardClaimed: false });
        }
        get().checkBadges();
      },

      checkBadges: () => {
        const state = get();
        const earned = new Set(state.earnedBadges);
        let newBadge: BadgeId | null = null;

        const tryEarn = (id: BadgeId, condition: boolean) => {
          if (condition && !earned.has(id)) {
            earned.add(id);
            newBadge = id;
          }
        };

        tryEarn("explorer", state.visitedProvinces.length >= 1);
        tryEarn("geography", state.visitedProvinces.length >= 7);
        tryEarn("history", state.completedStories.length >= 1);
        tryEarn("wildlife", state.viewedAnimals.length >= 8);
        tryEarn("quiz", state.perfectQuizzes >= 1);
        tryEarn("culture", state.viewedHeroes.length >= 3);
        tryEarn("foodie", state.viewedFoods.length >= 5);
        tryEarn("hero", state.viewedHeroes.length >= 6);
        tryEarn("streak-7", state.streak >= 7);
        tryEarn("collector", state.collectibles.length >= 15);
        tryEarn("pakistan-expert", earned.size >= 6);

        const newEarned = Array.from(earned) as BadgeId[];
        if (newBadge && newEarned.length > state.earnedBadges.length) {
          const badge = badges.find((b) => b.id === newBadge);
          set({
            earnedBadges: newEarned,
            newlyEarnedBadge: newBadge,
            showCelebration: true,
            celebrationMessage: `New Badge: ${badge?.name ?? "Badge"}! ${badge?.emoji ?? "🏅"}`,
            zaheenMood: "celebrate",
            zaheenMessage: `You earned the ${badge?.name} badge! Incredible!`,
          });
          get().addCoins(30);
          get().addStars(5);
        } else if (newEarned.length !== state.earnedBadges.length) {
          set({ earnedBadges: newEarned });
        }
      },

      clearCelebration: () =>
        set({ showCelebration: false, celebrationMessage: "", newlyEarnedBadge: null }),

      setZaheenMessage: (msg, mood = "happy") =>
        set({ zaheenMessage: msg, zaheenMood: mood }),

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
      toggleNarration: () => set((s) => ({ narrationEnabled: !s.narrationEnabled })),
      setLanguage: (lang) => set({ language: lang }),
      setAgeGroup: (age) => set({ ageGroup: age }),

      getCollectibleItems: () => {
        const ids = get().collectibles;
        return collectiblesCatalog.filter((c) => ids.includes(c.id));
      },
    }),
    {
      name: "discover-pakistan-save",
      partialize: (s) => ({
        xp: s.xp,
        coins: s.coins,
        stars: s.stars,
        level: s.level,
        streak: s.streak,
        lastVisitDate: s.lastVisitDate,
        dailyRewardClaimed: s.dailyRewardClaimed,
        visitedProvinces: s.visitedProvinces,
        visitedCities: s.visitedCities,
        viewedAnimals: s.viewedAnimals,
        viewedFoods: s.viewedFoods,
        viewedHeroes: s.viewedHeroes,
        completedStories: s.completedStories,
        completedGames: s.completedGames,
        perfectQuizzes: s.perfectQuizzes,
        earnedBadges: s.earnedBadges,
        collectibles: s.collectibles,
        soundEnabled: s.soundEnabled,
        musicEnabled: s.musicEnabled,
        narrationEnabled: s.narrationEnabled,
        language: s.language,
        ageGroup: s.ageGroup,
      }),
    }
  )
);
