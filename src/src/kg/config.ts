/**
 * KG module settings. Change these in ONE place if Zaheen's URLs differ.
 */

/** Where the module is mounted in Zaheen's router. */
export const KG_BASE_PATH = '/kg';
/** Public folder that holds the module's images and audio (public/kg/...). */
export const KG_ASSET_BASE = '/public/kg';

/**
 * Small row on the KG home that links to Zaheen's EXISTING KG pages
 * (video lectures and quiz) so they stay reachable. Set to false to hide it.
 */
export const SHOW_ZAHEEN_LINKS = true;

export const ZAHEEN_LINKS: Array<{ label: string; labelUr: string; to: string }> = [
  { label: 'English videos', labelUr: 'انگریزی', to: '/kg/english' },
  { label: 'Urdu videos', labelUr: 'اردو', to: '/kg/urdu' },
  { label: 'Math videos', labelUr: 'ریاضی', to: '/kg/math' },
  { label: 'Practice quiz', labelUr: 'کوئز', to: '/kg/quiz' },
];
export const KG_API_BASE = 'https://api.zaheen.com.pk/v2';
export const KG_FALLBACK_BOARD_ID = 1;
export const KG_FALLBACK_CLASS_ID = 1;
export const KG_TEACHER_IMAGE = 'https://cdn.zaheen.com.pk/images/miss.png';

/** Banner picture on the KG home. Put the image URL here. Empty = plain coloured banner. */
export const KG_HOME_BANNER_URL = 'https://cdn.zaheen.com.pk/images/welcome.jpeg';

/** Zaheen's existing KG lecture pages (opened from the home screen). */
export const KG_LECTURE_PATHS = { english: '/kg/english', urdu: '/kg/urdu', math: '/kg/math' } as const;

/** Pictures for the subject cards on Today's class (the same ones Zaheen's KG lecture pages use). */
export const KG_SUBJECT_IMAGES = {
  english: 'https://cdn.zaheen.com.pk/zaheen-web-img/owl.png',
  urdu: 'https://cdn.zaheen.com.pk/zaheen-web-img/orange.png',
  math: 'https://cdn.zaheen.com.pk/zaheen-web-img/123.png',
} as const;