/// <reference types="vite/client" />

// File name = question id (e.g. eng-let-a.mp3). Option images: <questionId>--<optionId>.png
const audioFiles = import.meta.glob('../assets/audio/**/*.{mp3,wav,ogg,m4a,webm}', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;

const imageFiles = import.meta.glob('../assets/media/**/*.{png,jpg,jpeg,webp,svg}', {
  eager: true, query: '?url', import: 'default',
}) as Record<string, string>;

const byName = (files: Record<string, string>) => {
  const map: Record<string, string> = {};
  for (const [path, url] of Object.entries(files)) {
    map[path.split('/').pop()!.replace(/\.[^.]+$/, '')] = url;
  }
  return map;
};

const AUDIO = byName(audioFiles);
const IMAGES = byName(imageFiles);
console.log('Hardcoded audio found:', Object.keys(AUDIO));

export const getHardcodedAudio = (questionId: string) => AUDIO[questionId];
export const getHardcodedImage = (questionId: string) => IMAGES[questionId];
export const getHardcodedOptionImage = (questionId: string, optionId: string) =>
  IMAGES[`${questionId}--${optionId}`];