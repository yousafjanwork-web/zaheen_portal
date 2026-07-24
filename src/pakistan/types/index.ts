export type ProvinceId =
  | "punjab"
  | "sindh"
  | "kpk"
  | "balochistan"
  | "gilgit"
  | "kashmir"
  | "islamabad";

export type BadgeId =
  | "explorer"
  | "geography"
  | "history"
  | "wildlife"
  | "quiz"
  | "culture"
  | "foodie"
  | "hero"
  | "pakistan-expert"
  | "streak-7"
  | "collector";

export type CollectibleType =
  | "flag"
  | "animal"
  | "food"
  | "monument"
  | "hero"
  | "symbol";

export type GameId =
  | "map-drag"
  | "match-capitals"
  | "guess-landmark"
  | "animal-memory"
  | "food-match"
  | "dress-match"
  | "flag-builder"
  | "timeline"
  | "trivia"
  | "province-puzzle"
  | "word-search"
  | "balloon-pop"
  | "treasure-hunt";

export interface Collectible {
  id: string;
  name: string;
  type: CollectibleType;
  emoji: string;
  description: string;
  provinceId?: ProvinceId;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
  requirement: string;
  color: string;
}

export interface City {
  id: string;
  name: string;
  emoji: string;
  description: string;
  funFacts: string[];
  landmarks: Landmark[];
  foods: string[];
  narration: string;
}

export interface Landmark {
  id: string;
  name: string;
  emoji: string;
  description: string;
  funFact: string;
  narration: string;
}

export interface Animal {
  id: string;
  name: string;
  image: string;
  habitat: string;
  funFact: string;
  sound: string;
  provinceId?: ProvinceId;
}

export interface Food {
  id: string;
  name: string;
  image: string;
  description: string;
  provinceId?: ProvinceId;
  ingredients: string[];
}

export interface Hero {
  id: string;
  name: string;
  title: string;
  image: string;
  award?: string;
  years: string;
  story: string[];
  funFact: string;
  quote: string;
}

export interface Province {
  id: ProvinceId;
  name: string;
  nameUrdu: string;
  capital: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
  funFacts: string[];
  population: string;
  area: string;
  language: string[];
  traditionalDress: { name: string; emoji: string; description: string };
  famousFoods: Food[];
  animals: Animal[];
  cities: City[];
  landmarks: Landmark[];
  culture: string[];
  weather: string;
  music: string;
  history: string;
  narration: string;
  mapPath: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  emoji: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  emoji: string;
  scenes: StoryScene[];
}

export interface StoryScene {
  id: string;
  narrator: string;
  text: string;
  characterEmoji: string;
  background: string;
  interactiveHint?: string;
  collectibleId?: string;
}

export interface GameMeta {
  id: GameId;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  coinReward: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  color: string;
}

export interface SymbolItem {
  id: string;
  name: string;
  image: string;
  type: string;
  description: string;
  funFact: string;
}

export type PageId =
  | "home"
  | "map"
  | "province"
  | "city"
  | "games"
  | "game"
  | "quiz"
  | "story"
  | "heroes"
  | "animals"
  | "foods"
  | "symbols"
  | "collection"
  | "badges"
  | "progress"
  | "videos";

  
