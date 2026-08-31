import { ShopItem, PetCompanion } from '../types';

export const shopItems: ShopItem[] = [
  // Pets
  { id: 'pet-dragon', name: 'Spike the Dragon', description: 'A brave fire-breathing companion!', icon: '🐉', type: 'pet', cost: 500, rarity: 'epic' },
  { id: 'pet-unicorn', name: 'Stardust Unicorn', description: 'Magical horn that grants extra XP!', icon: '🦄', type: 'pet', cost: 800, rarity: 'legendary' },
  { id: 'pet-panda', name: 'Bamboo Panda', description: 'A cuddly word-loving friend!', icon: '🐼', type: 'pet', cost: 400, rarity: 'rare' },
  { id: 'pet-fox', name: 'Ruby the Fox', description: 'Clever and quick-witted!', icon: '🦊', type: 'pet', cost: 300, rarity: 'rare' },
  { id: 'pet-cat', name: 'Whiskers', description: 'A curious reading cat!', icon: '🐱', type: 'pet', cost: 200, rarity: 'common' },
  { id: 'pet-owl', name: 'Hoot the Owl', description: 'A wise night-time learner!', icon: '🦉', type: 'pet', cost: 250, rarity: 'common' },

  // Themes
  { id: 'theme-galaxy', name: 'Galaxy Theme', description: 'Unlock a cosmic UI theme!', icon: '🌌', type: 'theme', cost: 350, rarity: 'rare' },
  { id: 'theme-rainbow', name: 'Rainbow Theme', description: 'Colorful everywhere!', icon: '🌈', type: 'theme', cost: 450, rarity: 'epic' },
  { id: 'theme-forest', name: 'Forest Theme', description: 'Green and natural!', icon: '🌳', type: 'theme', cost: 300, rarity: 'rare' },
  { id: 'theme-ocean', name: 'Ocean Theme', description: 'Cool blue waves!', icon: '🌊', type: 'theme', cost: 300, rarity: 'rare' },

  // Avatar frames
  { id: 'frame-gold', name: 'Gold Frame', description: 'Shine like gold!', icon: '🥇', type: 'avatar', cost: 200, rarity: 'rare' },
  { id: 'frame-rainbow', name: 'Rainbow Frame', description: 'All colors of the rainbow!', icon: '🌈', type: 'avatar', cost: 400, rarity: 'epic' },
  { id: 'frame-fire', name: 'Fire Frame', description: 'A blazing hot frame!', icon: '🔥', type: 'avatar', cost: 350, rarity: 'epic' },

  // Boosts
  { id: 'boost-xp-2x', name: '2× XP Boost (1 day)', description: 'Double XP for 24 hours!', icon: '⚡', type: 'boost', cost: 150, rarity: 'rare' },
  { id: 'boost-streak-shield', name: 'Streak Shield', description: 'Protect your streak!', icon: '🛡️', type: 'boost', cost: 100, rarity: 'common' },

  // Word packs
  { id: 'pack-advanced', name: 'Advanced Words Pack', description: '50 new challenging words!', icon: '📦', type: 'pack', cost: 250, rarity: 'rare' },
];

export const petSpecies: PetCompanion[] = [
  { id: 'pet-cat', species: 'cat', name: 'Whiskers', emoji: '🐱', level: 1, xp: 0, happiness: 100, evolutionStage: 0, unlockedAt: '' },
  { id: 'pet-owl', species: 'owl', name: 'Hoot', emoji: '🦉', level: 1, xp: 0, happiness: 100, evolutionStage: 0, unlockedAt: '' },
  { id: 'pet-fox', species: 'fox', name: 'Ruby', emoji: '🦊', level: 1, xp: 0, happiness: 100, evolutionStage: 0, unlockedAt: '' },
  { id: 'pet-panda', species: 'panda', name: 'Bamboo', emoji: '🐼', level: 1, xp: 0, happiness: 100, evolutionStage: 0, unlockedAt: '' },
  { id: 'pet-dragon', species: 'dragon', name: 'Spike', emoji: '🐉', level: 1, xp: 0, happiness: 100, evolutionStage: 0, unlockedAt: '' },
  { id: 'pet-unicorn', species: 'unicorn', name: 'Stardust', emoji: '🦄', level: 1, xp: 0, happiness: 100, evolutionStage: 0, unlockedAt: '' },
];
