import React from 'react';

export type IllustrationId =
  // English / General
  | 'apple'
  | 'ball'
  | 'cat'
  | 'duck'
  | 'elephant'
  | 'fish'
  | 'grapes'
  | 'house'
  | 'icecream'
  | 'kite'
  | 'lion'
  | 'moon'
  | 'sun'
  | 'tree'
  | 'umbrella'
  | 'star'
  | 'flower'
  | 'butterfly'
  | 'orange'
  | 'penguin'
  | 'queen'
  | 'rabbit'
  | 'van'
  | 'watch'
  | 'xylophone'
  | 'yoyo'
  | 'zebra'
  // Urdu Specific Objects
  | 'anar' // Pomegranate (ا - انار)
  | 'billi' // Cat (ب - بلی)
  | 'basta' // School bag (ب - بستہ)
  | 'patang' // Kite (پ - پتنگ)
  | 'titli' // Butterfly (ت - تتلی)
  | 'tamatar' // Tomato (ٹ - ٹماٹر)
  | 'jahaz' // Aeroplane (ج - جہاز)
  | 'chand' // Moon (چ - چاند)
  | 'machhli' // Fish (م - مچھلی)
  | 'mor' // Peacock (م - مور)
  | 'darakht' // Tree (د - درخت)
  | 'gaind' // Ball (گ - گیند)
  | 'kitaab' // Book (ک - کتاب)
  | 'aam' // Mango (آ - آم)
  | 'angoor' // Grapes (ا - انگور)
  | 'topi' // Cap (ٹ - ٹوپی)
  | 'samar' // Fruits (ث - ثمر)
  | 'huqqa' // Basin (ح - حوض)
  | 'kharboza' // Melon (خ - خربوزہ)
  | 'dhol' // Drum (ڈ - ڈھول)
  | 'rail' // Train (ر - ریل)
  | 'zarafah' // Giraffe (ز - زرافہ)
  | 'saib' // Apple (س - سیب)
  | 'sher' // Lion (ش - شیر)
  | 'sabun' // Soap (ص - صابن)
  | 'tota' // Parrot (ط - طوطا)
  | 'ainak' // Glasses (ع - عینک)
  | 'gubbara' // Balloon (غ - غبارہ)
  | 'fowara' // Fountain (ف - فوارہ)
  | 'qalam' // Pen (ق - قلم)
  | 'lattu' // Spinning Top (ل - لٹو)
  | 'nalka' // Tap (ن - نلکا)
  | 'hathi'; // Elephant (ہ - ہاتھی)

export const ILLUSTRATION_NAMES: Record<IllustrationId, { en: string; ur: string }> = {
  apple: { en: 'Apple', ur: 'سیب' },
  ball: { en: 'Ball', ur: 'گیند' },
  cat: { en: 'Cat', ur: 'بلی' },
  duck: { en: 'Duck', ur: 'بطخ' },
  elephant: { en: 'Elephant', ur: 'ہاتھی' },
  fish: { en: 'Fish', ur: 'مچھلی' },
  grapes: { en: 'Grapes', ur: 'انگور' },
  house: { en: 'House', ur: 'گھر' },
  icecream: { en: 'Ice Cream', ur: 'آئس کریم' },
  kite: { en: 'Kite', ur: 'پتنگ' },
  lion: { en: 'Lion', ur: 'شیر' },
  moon: { en: 'Moon', ur: 'چاند' },
  sun: { en: 'Sun', ur: 'سورج' },
  tree: { en: 'Tree', ur: 'درخت' },
  umbrella: { en: 'Umbrella', ur: 'چھتری' },
  star: { en: 'Star', ur: 'ستارہ' },
  flower: { en: 'Flower', ur: 'پھول' },
  butterfly: { en: 'Butterfly', ur: 'تتلی' },
  orange: { en: 'Orange', ur: 'مالٹا' },
  penguin: { en: 'Penguin', ur: 'پینگوئن' },
  queen: { en: 'Queen', ur: 'ملکہ' },
  rabbit: { en: 'Rabbit', ur: 'خرگوش' },
  van: { en: 'Van', ur: 'وین' },
  watch: { en: 'Watch', ur: 'گھڑی' },
  xylophone: { en: 'Xylophone', ur: 'زائلوفون' },
  yoyo: { en: 'Yo-Yo', ur: 'یو یو' },
  zebra: { en: 'Zebra', ur: 'زیبرا' },
  // Urdu Specific Objects
  anar: { en: 'Pomegranate', ur: 'انار' },
  billi: { en: 'Cat', ur: 'بلی' },
  basta: { en: 'School Bag', ur: 'بستہ' },
  patang: { en: 'Kite', ur: 'پتنگ' },
  titli: { en: 'Butterfly', ur: 'تتلی' },
  tamatar: { en: 'Tomato', ur: 'ٹماٹر' },
  jahaz: { en: 'Aeroplane', ur: 'جہاز' },
  chand: { en: 'Moon', ur: 'چاند' },
  machhli: { en: 'Fish', ur: 'مچھلی' },
  mor: { en: 'Peacock', ur: 'مور' },
  darakht: { en: 'Tree', ur: 'درخت' },
  gaind: { en: 'Ball', ur: 'گیند' },
  kitaab: { en: 'Book', ur: 'کتاب' },
  aam: { en: 'Mango', ur: 'آم' },
  angoor: { en: 'Grapes', ur: 'انگور' },
  topi: { en: 'Cap', ur: 'ٹوپی' },
  samar: { en: 'Fruits', ur: 'ثمر' },
  huqqa: { en: 'Basin', ur: 'حوض' },
  kharboza: { en: 'Melon', ur: 'خربوزہ' },
  dhol: { en: 'Drum', ur: 'ڈھول' },
  rail: { en: 'Train', ur: 'ریل گاڑی' },
  zarafah: { en: 'Giraffe', ur: 'زرافہ' },
  saib: { en: 'Apple', ur: 'سیب' },
  sher: { en: 'Lion', ur: 'شیر' },
  sabun: { en: 'Soap', ur: 'صابن' },
  tota: { en: 'Parrot', ur: 'طوطا' },
  ainak: { en: 'Glasses', ur: 'عینک' },
  gubbara: { en: 'Balloon', ur: 'غبارہ' },
  fowara: { en: 'Fountain', ur: 'فوارہ' },
  qalam: { en: 'Pen', ur: 'قلم' },
  lattu: { en: 'Spinning Top', ur: 'لٹو' },
  nalka: { en: 'Water Tap', ur: 'نلکا' },
  hathi: { en: 'Elephant', ur: 'ہاتھی' },
};

interface ItemIllustrationProps {
  id: IllustrationId;
  customImageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  active?: boolean;
  showName?: boolean;
  nameLang?: 'en' | 'ur' | 'both';
}

export const ItemIllustration: React.FC<ItemIllustrationProps> = ({
  id,
  customImageUrl,
  className = '',
  size = 'md',
  interactive = false,
  active = false,
  showName = false,
  nameLang = 'both',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  }[size];

  const labelInfo = ILLUSTRATION_NAMES[id] || { en: id, ur: id };
  const displayText =
    nameLang === 'en'
      ? labelInfo.en
      : nameLang === 'ur'
      ? labelInfo.ur
      : `${labelInfo.en} · ${labelInfo.ur}`;

  if (customImageUrl && !imgError) {
    return (
      <div className={`flex flex-col items-center gap-1 ${className}`}>
        <div
          className={`inline-flex items-center justify-center transition-transform select-none ${sizeClasses} ${
            interactive ? 'cursor-pointer active:scale-95 hover:scale-105' : ''
          } ${active ? 'scale-105 ring-4 ring-amber-400 rounded-2xl' : ''}`}
        >
          <img
            src={customImageUrl}
            alt={labelInfo.en}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-amber-200"
          />
        </div>
        {showName && (
          <span className="text-[11px] sm:text-xs font-bold text-slate-700 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs">
            {displayText}
          </span>
        )}
      </div>
    );
  }

  const renderContent = () => {
    switch (id) {
      case 'apple':
      case 'anar':
        return (
          // Glossy cute red apple / anar with shining highlights, green leaf and cheerful face
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Leaf */}
            <path d="M50 25 C52 10 70 8 72 20 C70 30 54 26 50 25 Z" fill="#22C55E" />
            <path d="M52 24 Q60 18 68 18" stroke="#15803D" strokeWidth="1.5" fill="none" />
            {/* Stem */}
            <path d="M50 26 C49 20 46 14 43 12" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Body */}
            <path
              d="M50 32 C30 22 15 38 18 64 C20 84 38 92 50 88 C62 92 80 84 82 64 C85 38 70 22 50 32 Z"
              fill="url(#appleGrad)"
            />
            {/* Shine highlight */}
            <ellipse cx="32" cy="45" rx="8" ry="14" transform="rotate(-25 32 45)" fill="white" opacity="0.35" />
            {/* Cute face */}
            <circle cx="38" cy="58" r="3.5" fill="#1E293B" />
            <circle cx="62" cy="58" r="3.5" fill="#1E293B" />
            <circle cx="39.5" cy="56.5" r="1.2" fill="white" />
            <circle cx="63.5" cy="56.5" r="1.2" fill="white" />
            <ellipse cx="33" cy="64" rx="4" ry="2.5" fill="#FECDD3" />
            <ellipse cx="67" cy="64" rx="4" ry="2.5" fill="#FECDD3" />
            <path d="M44 64 Q50 71 56 64" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <defs>
              <linearGradient id="appleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="60%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'ball':
      case 'gaind':
        return (
          // Colorful beach ball with bright cheerful stripes
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="42" fill="#F8FAFC" stroke="#0284C7" strokeWidth="3" />
            {/* Blue stripe */}
            <path d="M50 8 A42 42 0 0 0 16 30 L50 50 Z" fill="#38BDF8" />
            {/* Yellow stripe */}
            <path d="M16 30 A42 42 0 0 0 16 70 L50 50 Z" fill="#FACC15" />
            {/* Red stripe */}
            <path d="M16 70 A42 42 0 0 0 50 92 L50 50 Z" fill="#F43F5E" />
            {/* Green stripe */}
            <path d="M50 92 A42 42 0 0 0 84 70 L50 50 Z" fill="#34D399" />
            {/* Orange stripe */}
            <path d="M84 70 A42 42 0 0 0 84 30 L50 50 Z" fill="#FB923C" />
            {/* Purple stripe */}
            <path d="M84 30 A42 42 0 0 0 50 8 L50 50 Z" fill="#A855F7" />
            {/* Center circle */}
            <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            {/* Gloss highlight */}
            <ellipse cx="34" cy="30" rx="9" ry="5" transform="rotate(-30 34 30)" fill="white" opacity="0.5" />
          </svg>
        );

      case 'cat':
      case 'billi':
        return (
          // Adorable orange tabby kitten with cheerful smile and whiskers
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Ears */}
            <path d="M22 45 L18 16 L42 32 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" strokeLinejoin="round" />
            <path d="M25 40 L22 22 L38 31 Z" fill="#FDBA74" />
            <path d="M78 45 L82 16 L58 32 Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" strokeLinejoin="round" />
            <path d="M75 40 L78 22 L62 31 Z" fill="#FDBA74" />
            {/* Head */}
            <ellipse cx="50" cy="55" rx="35" ry="30" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
            {/* Tabby stripes */}
            <path d="M46 28 L50 38 L54 28" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <ellipse cx="36" cy="52" rx="4.5" ry="6" fill="#0F172A" />
            <circle cx="34.5" cy="50" r="2" fill="white" />
            <ellipse cx="64" cy="52" rx="4.5" ry="6" fill="#0F172A" />
            <circle cx="62.5" cy="50" r="2" fill="white" />
            {/* Cheeks */}
            <circle cx="28" cy="62" r="5" fill="#FCA5A5" opacity="0.6" />
            <circle cx="72" cy="62" r="5" fill="#FCA5A5" opacity="0.6" />
            {/* Nose & Mouth */}
            <polygon points="50,60 46,56 54,56" fill="#F43F5E" />
            <path d="M45 62 Q50 67 55 62" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Whiskers */}
            <path d="M26 56 L10 54 M26 62 L8 64 M26 68 L12 73" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
            <path d="M74 56 L90 54 M74 62 L92 64 M74 68 L88 73" stroke="#7C2D12" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'duck':
        return (
          // Cheerful yellow rubber duckling
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Body */}
            <path d="M25 65 C22 45 45 42 65 52 C85 62 82 82 58 84 C35 86 28 85 25 65 Z" fill="#FBBF24" />
            {/* Tail */}
            <path d="M22 64 C12 60 10 52 14 48 C18 48 24 55 26 60 Z" fill="#F59E0B" />
            {/* Wing */}
            <path d="M38 65 C45 60 55 60 58 66 C56 74 46 75 38 65 Z" fill="#F59E0B" />
            {/* Head */}
            <circle cx="64" cy="38" r="18" fill="#FDE047" />
            {/* Eye */}
            <circle cx="68" cy="34" r="3.5" fill="#0F172A" />
            <circle cx="69.5" cy="32.5" r="1.2" fill="white" />
            {/* Beak */}
            <path d="M78 38 C88 35 94 40 88 44 C82 48 76 43 78 38 Z" fill="#EA580C" />
            {/* Water waves */}
            <path d="M12 85 Q22 81 32 85 T52 85 T72 85 T92 85" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'elephant':
        return (
          // Cute friendly baby elephant with trunk raised
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Big ear */}
            <ellipse cx="30" cy="46" rx="18" ry="24" fill="#94A3B8" />
            <ellipse cx="30" cy="46" rx="12" ry="16" fill="#F1F5F9" opacity="0.6" />
            {/* Body */}
            <ellipse cx="58" cy="58" rx="26" ry="24" fill="#64748B" />
            {/* Head */}
            <circle cx="48" cy="44" r="20" fill="#64748B" />
            {/* Eye */}
            <circle cx="42" cy="40" r="3" fill="#0F172A" />
            <circle cx="43" cy="39" r="1" fill="white" />
            {/* Trunk curled happily up */}
            <path
              d="M48 52 C52 64 62 68 66 60 C69 54 62 48 60 48"
              stroke="#64748B"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cheeks */}
            <circle cx="36" cy="46" r="3.5" fill="#FCA5A5" opacity="0.7" />
            {/* Legs */}
            <rect x="42" y="74" width="8" height="14" rx="4" fill="#475569" />
            <rect x="62" y="74" width="8" height="14" rx="4" fill="#475569" />
          </svg>
        );

      case 'fish':
      case 'machhli':
        return (
          // Bright turquoise fish blowing bubbles
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Tail */}
            <path d="M22 50 L8 32 C12 45 12 55 8 68 Z" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
            {/* Dorsal fin */}
            <path d="M45 28 C55 22 68 28 65 35 Z" fill="#0891B2" />
            {/* Body */}
            <path
              d="M20 50 C26 28 65 24 82 50 C65 76 26 72 20 50 Z"
              fill="url(#fishGrad)"
              stroke="#0891B2"
              strokeWidth="2"
            />
            {/* Scales detail */}
            <path d="M42 42 C44 48 44 52 42 58 M52 40 C54 48 54 52 52 60" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.6" />
            {/* Eye */}
            <circle cx="68" cy="46" r="5" fill="white" stroke="#0F172A" strokeWidth="1" />
            <circle cx="70" cy="46" r="3" fill="#0F172A" />
            <circle cx="71" cy="45" r="1" fill="white" />
            {/* Smile */}
            <path d="M78 54 Q75 58 72 56" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Bubbles */}
            <circle cx="86" cy="38" r="3" fill="#BAE6FD" opacity="0.7" />
            <circle cx="92" cy="26" r="4.5" fill="#BAE6FD" opacity="0.7" />
            <defs>
              <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'titli':
      case 'butterfly':
        return (
          // Gorgeous colorful butterfly (تتلی) with smiling face
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Wings */}
            <path d="M46 50 C36 18 8 20 12 48 C14 62 38 62 46 54 Z" fill="#F43F5E" />
            <path d="M46 52 C38 64 16 66 18 80 C20 92 40 84 46 64 Z" fill="#FB923C" />
            <path d="M54 50 C64 18 92 20 88 48 C86 62 62 62 54 54 Z" fill="#F43F5E" />
            <path d="M54 52 C62 64 84 66 82 80 C80 92 60 84 54 64 Z" fill="#FB923C" />
            {/* Wing Spots */}
            <circle cx="28" cy="38" r="6" fill="#FDE047" />
            <circle cx="72" cy="38" r="6" fill="#FDE047" />
            <circle cx="32" cy="74" r="4" fill="#38BDF8" />
            <circle cx="68" cy="74" r="4" fill="#38BDF8" />
            {/* Antennae */}
            <path d="M48 30 Q40 18 36 20" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="20" r="2.5" fill="#1E293B" />
            <path d="M52 30 Q60 18 64 20" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="64" cy="20" r="2.5" fill="#1E293B" />
            {/* Body */}
            <rect x="47" y="28" width="6" height="42" rx="3" fill="#475569" />
            {/* Face */}
            <circle cx="48.5" cy="34" r="1.2" fill="white" />
            <circle cx="51.5" cy="34" r="1.2" fill="white" />
          </svg>
        );

      case 'chand':
      case 'moon':
        return (
          // Warm smiling crescent moon with night stars
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path
              d="M62 14 C36 18 20 40 22 66 C24 84 42 94 62 90 C46 80 44 48 64 36 C68 33 66 22 62 14 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="2"
            />
            {/* Moon Face */}
            <circle cx="44" cy="50" r="3" fill="#1E293B" />
            <circle cx="45" cy="49" r="1" fill="white" />
            <path d="M38 60 Q44 66 48 58" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="36" cy="54" r="3" fill="#FCA5A5" opacity="0.6" />
            {/* Little star nearby */}
            <polygon points="76,32 78,38 84,38 79,42 81,48 76,44 71,48 73,42 68,38 74,38" fill="#FDE047" />
          </svg>
        );

      case 'tamatar':
        return (
          // Shiny red tomato (ٹ - ٹماٹر)
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Green calyx/leaves */}
            <polygon points="50,22 42,26 40,16 48,18" fill="#16A34A" />
            <polygon points="50,22 58,26 62,16 54,18" fill="#16A34A" />
            <polygon points="50,22 48,32 50,30 52,32" fill="#15803D" />
            <rect x="48" y="10" width="4" height="12" rx="2" fill="#15803D" />
            {/* Round plump tomato body */}
            <ellipse cx="50" cy="58" rx="38" ry="32" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            {/* Gloss reflection */}
            <ellipse cx="32" cy="46" rx="9" ry="12" transform="rotate(-30 32 46)" fill="white" opacity="0.35" />
            {/* Cheerful face */}
            <circle cx="38" cy="58" r="3.5" fill="#1E293B" />
            <circle cx="62" cy="58" r="3.5" fill="#1E293B" />
            <circle cx="39.5" cy="56.5" r="1.2" fill="white" />
            <circle cx="63.5" cy="56.5" r="1.2" fill="white" />
            <circle cx="30" cy="64" r="4.5" fill="#FECDD3" />
            <circle cx="70" cy="64" r="4.5" fill="#FECDD3" />
            <path d="M44 64 Q50 71 56 64" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'patang':
      case 'kite':
        return (
          // Flying diamond kite with tail bows
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Diamond kite */}
            <polygon points="50,10 82,46 50,78 18,46" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <polygon points="50,10 82,46 50,46" fill="#EF4444" />
            <polygon points="50,46 50,78 18,46" fill="#0EA5E9" />
            <polygon points="50,46 82,46 50,78" fill="#10B981" />
            {/* Cross bars */}
            <line x1="50" y1="10" x2="50" y2="78" stroke="#78350F" strokeWidth="2" />
            <line x1="18" y1="46" x2="82" y2="46" stroke="#78350F" strokeWidth="2" />
            {/* Tail string */}
            <path d="M50 78 Q60 88 52 98" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            {/* Little tail ribbons */}
            <polygon points="56,86 52,83 60,83" fill="#EC4899" />
            <polygon points="50,94 46,91 54,91" fill="#8B5CF6" />
          </svg>
        );

      case 'jahaz':
        return (
          // Cheerful jet aeroplane (ج - جہاز)
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Wings */}
            <polygon points="46,50 20,68 32,70 54,54" fill="#0284C7" />
            <polygon points="46,42 20,24 32,22 54,38" fill="#0284C7" />
            {/* Fuselage body */}
            <ellipse cx="50" cy="46" rx="38" ry="12" fill="#F8FAFC" stroke="#0284C7" strokeWidth="2.5" />
            {/* Tail fin */}
            <polygon points="18,46 10,24 22,24 28,46" fill="#EF4444" />
            {/* Windows */}
            <circle cx="58" cy="46" r="3" fill="#38BDF8" />
            <circle cx="68" cy="46" r="3" fill="#38BDF8" />
            <circle cx="78" cy="46" r="3" fill="#38BDF8" />
            {/* Nose cone */}
            <path d="M82 40 C88 43 88 49 82 52 Z" fill="#EF4444" />
          </svg>
        );

      case 'darakht':
      case 'tree':
        return (
          // Lush green tree with sweet red apples
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Trunk */}
            <rect x="42" y="60" width="16" height="32" rx="4" fill="#78350F" />
            {/* Foliage crown */}
            <circle cx="50" cy="40" r="28" fill="#22C55E" />
            <circle cx="34" cy="48" r="18" fill="#16A34A" />
            <circle cx="66" cy="48" r="18" fill="#16A34A" />
            <circle cx="50" cy="28" r="20" fill="#4ADE80" />
            {/* Red apples on tree */}
            <circle cx="38" cy="38" r="4" fill="#EF4444" />
            <circle cx="62" cy="36" r="4" fill="#EF4444" />
            <circle cx="50" cy="48" r="4.5" fill="#EF4444" />
          </svg>
        );

      case 'kitaab':
        return (
          // Colorful open book (ک - کتاب)
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Book cover back */}
            <path d="M12 72 Q50 68 50 82 Q50 68 88 72 L88 32 Q50 28 50 42 Q50 28 12 32 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            {/* Book pages left and right */}
            <path d="M14 68 Q50 64 50 78 L50 38 Q50 24 14 28 Z" fill="#FEF08A" />
            <path d="M86 68 Q50 64 50 78 L50 38 Q50 24 86 28 Z" fill="#FEF9C3" />
            {/* Spine */}
            <line x1="50" y1="36" x2="50" y2="78" stroke="#1E3A8A" strokeWidth="3" />
            {/* Page text lines */}
            <line x1="22" y1="40" x2="42" y2="40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="48" x2="40" y2="48" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="40" x2="78" y2="40" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="48" x2="76" y2="48" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'sun':
        return (
          // Smiling radiant sun
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Rays */}
            <g stroke="#F59E0B" strokeWidth="4" strokeLinecap="round">
              <line x1="50" y1="12" x2="50" y2="20" />
              <line x1="50" y1="80" x2="50" y2="88" />
              <line x1="12" y1="50" x2="20" y2="50" />
              <line x1="80" y1="50" x2="88" y2="50" />
              <line x1="24" y1="24" x2="30" y2="30" />
              <line x1="70" y1="70" x2="76" y2="76" />
              <line x1="24" y1="76" x2="30" y2="70" />
              <line x1="70" y1="30" x2="76" y2="24" />
            </g>
            {/* Sun Circle */}
            <circle cx="50" cy="50" r="26" fill="#FDE047" stroke="#F59E0B" strokeWidth="3" />
            {/* Cheerful face */}
            <circle cx="42" cy="46" r="3" fill="#1E293B" />
            <circle cx="58" cy="46" r="3" fill="#1E293B" />
            <circle cx="34" cy="52" r="3.5" fill="#FCA5A5" opacity="0.6" />
            <circle cx="66" cy="52" r="3.5" fill="#FCA5A5" opacity="0.6" />
            <path d="M42 54 Q50 62 58 54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'star':
        return (
          // Bright gold star
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon
              points="50,14 62,38 88,40 68,58 74,84 50,70 26,84 32,58 12,40 38,38"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Face */}
            <circle cx="43" cy="48" r="2.5" fill="#78350F" />
            <circle cx="57" cy="48" r="2.5" fill="#78350F" />
            <path d="M46 56 Q50 60 54 56" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="52" r="2.5" fill="#FCA5A5" opacity="0.6" />
            <circle cx="62" cy="52" r="2.5" fill="#FCA5A5" opacity="0.6" />
          </svg>
        );

      case 'flower':
        return (
          // Cheerful pink daisy
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Petals */}
            <circle cx="50" cy="26" r="14" fill="#F472B6" />
            <circle cx="72" cy="38" r="14" fill="#F472B6" />
            <circle cx="68" cy="64" r="14" fill="#F472B6" />
            <circle cx="32" cy="64" r="14" fill="#F472B6" />
            <circle cx="28" cy="38" r="14" fill="#F472B6" />
            {/* Center */}
            <circle cx="50" cy="50" r="18" fill="#FDE047" stroke="#EAB308" strokeWidth="2" />
            {/* Face */}
            <circle cx="44" cy="48" r="2.5" fill="#1E293B" />
            <circle cx="56" cy="48" r="2.5" fill="#1E293B" />
            <path d="M45 54 Q50 58 55 54" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'icecream':
        return (
          // Strawberry & chocolate scoop ice cream cone
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Waffle cone */}
            <polygon points="34,50 66,50 50,92" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <line x1="38" y1="56" x2="60" y2="76" stroke="#D97706" strokeWidth="1.5" />
            <line x1="62" y1="56" x2="40" y2="76" stroke="#D97706" strokeWidth="1.5" />
            {/* Strawberry scoop */}
            <circle cx="50" cy="40" r="20" fill="#FB7185" />
            {/* Vanilla / Cherry on top */}
            <circle cx="50" cy="20" r="7" fill="#EF4444" />
            {/* Sprinkles */}
            <rect x="42" y="32" width="2" height="6" rx="1" transform="rotate(30 42 32)" fill="#38BDF8" />
            <rect x="56" y="35" width="2" height="6" rx="1" transform="rotate(-40 56 35)" fill="#FACC15" />
            <rect x="48" y="44" width="2" height="6" rx="1" transform="rotate(20 48 44)" fill="#34D399" />
          </svg>
        );

      case 'lion':
        return (
          // Friendly smiling lion cub
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Mane */}
            <circle cx="50" cy="50" r="36" fill="#EA580C" />
            {/* Ears */}
            <circle cx="28" cy="28" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="72" cy="28" r="10" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            {/* Face */}
            <circle cx="50" cy="52" r="26" fill="#FBBF24" />
            {/* Muzzle */}
            <ellipse cx="50" cy="62" rx="12" ry="8" fill="#FEF3C7" />
            {/* Eyes */}
            <circle cx="40" cy="48" r="3" fill="#1E293B" />
            <circle cx="60" cy="48" r="3" fill="#1E293B" />
            <circle cx="41" cy="47" r="1" fill="white" />
            <circle cx="61" cy="47" r="1" fill="white" />
            {/* Nose & mouth */}
            <polygon points="50,58 46,55 54,55" fill="#78350F" />
            <path d="M46 62 Q50 66 54 62" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'grapes':
      case 'angoor':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M50 18 Q55 10 65 14" stroke="#78350F" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M52 20 Q62 20 60 28" fill="#22C55E" />
            <circle cx="50" cy="35" r="10" fill="#9333EA" />
            <circle cx="40" cy="46" r="10" fill="#A855F7" />
            <circle cx="60" cy="46" r="10" fill="#A855F7" />
            <circle cx="32" cy="60" r="9" fill="#7E22CE" />
            <circle cx="50" cy="58" r="10" fill="#9333EA" />
            <circle cx="68" cy="60" r="9" fill="#7E22CE" />
            <circle cx="42" cy="72" r="9" fill="#6B21A8" />
            <circle cx="58" cy="72" r="9" fill="#6B21A8" />
            <circle cx="50" cy="84" r="8" fill="#581C87" />
          </svg>
        );

      case 'house':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,15 15,45 85,45" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <rect x="25" y="45" width="50" height="45" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
            <rect x="42" y="60" width="16" height="30" rx="3" fill="#B45309" />
            <circle cx="54" cy="75" r="2" fill="#FEF08A" />
            <rect x="30" y="52" width="10" height="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            <rect x="60" y="52" width="10" height="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            <rect x="65" y="20" width="8" height="16" fill="#78350F" />
          </svg>
        );

      case 'umbrella':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M15 55 Q50 10 85 55 Z" fill="#EC4899" stroke="#DB2777" strokeWidth="2" />
            <path d="M15 55 Q27 50 38 55 Q50 50 62 55 Q73 50 85 55" fill="#F472B6" />
            <line x1="50" y1="20" x2="50" y2="78" stroke="#475569" strokeWidth="3" />
            <path d="M50 78 Q50 88 42 88" stroke="#475569" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="18" r="3" fill="#F59E0B" />
          </svg>
        );

      case 'orange':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="55" r="34" fill="#FB923C" stroke="#EA580C" strokeWidth="2" />
            <circle cx="50" cy="55" r="30" fill="#F97316" />
            <path d="M50 24 C52 14 62 14 62 22 Z" fill="#16A34A" />
            <circle cx="40" cy="52" r="3" fill="#1E293B" />
            <circle cx="60" cy="52" r="3" fill="#1E293B" />
            <path d="M44 62 Q50 68 56 62" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'queen':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="20,40 25,65 75,65 80,40 65,52 50,30 35,52" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <circle cx="20" cy="38" r="4" fill="#EF4444" />
            <circle cx="50" cy="28" r="5" fill="#3B82F6" />
            <circle cx="80" cy="38" r="4" fill="#10B981" />
            <rect x="25" y="65" width="50" height="8" rx="2" fill="#F59E0B" />
            <circle cx="50" cy="69" r="2.5" fill="#EF4444" />
          </svg>
        );

      case 'rabbit':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Long ears */}
            <ellipse cx="40" cy="28" rx="8" ry="22" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="40" cy="28" rx="4" ry="16" fill="#FECDD3" />
            <ellipse cx="60" cy="28" rx="8" ry="22" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
            <ellipse cx="60" cy="28" rx="4" ry="16" fill="#FECDD3" />
            {/* Head */}
            <circle cx="50" cy="58" r="26" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            <circle cx="42" cy="54" r="3" fill="#1E293B" />
            <circle cx="58" cy="54" r="3" fill="#1E293B" />
            <polygon points="50,62 47,59 53,59" fill="#FB7185" />
            <path d="M46 64 Q50 68 54 64" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'van':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <path d="M15 65 L15 45 Q15 40 20 40 L60 40 L75 52 L85 52 Q88 52 88 56 L88 65 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <rect x="25" y="44" width="16" height="10" rx="2" fill="#BAE6FD" />
            <rect x="46" y="44" width="14" height="10" rx="2" fill="#BAE6FD" />
            <polygon points="64,44 72,52 64,52" fill="#BAE6FD" />
            <circle cx="32" cy="68" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
            <circle cx="72" cy="68" r="9" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
          </svg>
        );

      case 'watch':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="42" y="10" width="16" height="80" rx="4" fill="#0284C7" />
            <circle cx="50" cy="50" r="26" fill="#FFFFFF" stroke="#0284C7" strokeWidth="4" />
            <circle cx="50" cy="50" r="3" fill="#0F172A" />
            <line x1="50" y1="50" x2="50" y2="34" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="50" x2="62" y2="50" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'xylophone':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="20" y="24" width="10" height="52" rx="3" fill="#EF4444" />
            <rect x="33" y="28" width="10" height="48" rx="3" fill="#F97316" />
            <rect x="46" y="32" width="10" height="44" rx="3" fill="#EAB308" />
            <rect x="59" y="36" width="10" height="40" rx="3" fill="#22C55E" />
            <rect x="72" y="40" width="10" height="36" rx="3" fill="#3B82F6" />
          </svg>
        );

      case 'yoyo':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="50" rx="30" ry="24" fill="#EC4899" stroke="#BE185D" strokeWidth="3" />
            <ellipse cx="50" cy="50" rx="20" ry="15" fill="#FDE047" />
            <path d="M50 26 Q40 10 50 4" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );

      case 'zebra':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="52" r="30" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="28" y1="42" x2="42" y2="46" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="26" y1="54" x2="40" y2="54" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="42" x2="58" y2="46" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <line x1="74" y1="54" x2="60" y2="54" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="42" cy="46" r="3" fill="#0F172A" />
            <circle cx="58" cy="46" r="3" fill="#0F172A" />
            <ellipse cx="50" cy="64" rx="14" ry="10" fill="#E2E8F0" />
            <circle cx="46" cy="64" r="2" fill="#0F172A" />
            <circle cx="54" cy="64" r="2" fill="#0F172A" />
          </svg>
        );

      case 'dhol':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="50" rx="34" ry="24" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            <ellipse cx="24" cy="50" rx="8" ry="20" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="76" cy="50" rx="8" ry="20" fill="#FEF08A" stroke="#78350F" strokeWidth="2" />
            <line x1="30" y1="36" x2="70" y2="64" stroke="#FEF08A" strokeWidth="2" />
            <line x1="30" y1="64" x2="70" y2="36" stroke="#FEF08A" strokeWidth="2" />
          </svg>
        );

      case 'tota':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="45" r="25" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="58" cy="40" r="4" fill="#0F172A" />
            <path d="M68 42 C78 45 74 54 66 50 Z" fill="#EF4444" />
            <path d="M38 52 C25 65 30 75 42 70 Z" fill="#15803D" />
          </svg>
        );

      case 'ainak':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="34" cy="50" r="16" fill="#BAE6FD" stroke="#0284C7" strokeWidth="4" />
            <circle cx="66" cy="50" r="16" fill="#BAE6FD" stroke="#0284C7" strokeWidth="4" />
            <line x1="50" y1="50" x2="50" y2="50" stroke="#0284C7" strokeWidth="4" />
            <path d="M48 46 Q50 42 52 46" stroke="#0284C7" strokeWidth="3" fill="none" />
            <line x1="18" y1="48" x2="6" y2="40" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
            <line x1="82" y1="48" x2="94" y2="40" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'gubbara':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="45" rx="28" ry="32" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <polygon points="50,77 46,82 54,82" fill="#B91C1C" />
            <path d="M50 82 Q56 92 48 98" stroke="#475569" strokeWidth="1.5" fill="none" />
            <ellipse cx="38" cy="35" rx="6" ry="12" transform="rotate(-30 38 35)" fill="white" opacity="0.4" />
          </svg>
        );

      case 'qalam':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="35,15 65,15 58,75 42,75" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <polygon points="42,75 58,75 50,92" fill="#F59E0B" />
            <polygon points="47,86 53,86 50,92" fill="#0F172A" />
            <rect x="35" y="15" width="30" height="12" fill="#93C5FD" />
          </svg>
        );

      case 'hathi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="48" r="28" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <ellipse cx="26" cy="46" rx="14" ry="18" fill="#64748B" />
            <ellipse cx="74" cy="46" rx="14" ry="18" fill="#64748B" />
            <circle cx="42" cy="44" r="3" fill="#0F172A" />
            <circle cx="58" cy="44" r="3" fill="#0F172A" />
            <path d="M50 52 C52 66 60 70 64 64" stroke="#475569" strokeWidth="6" strokeLinecap="round" fill="none" />
          </svg>
        );

      default:
        return (
          // Fallback colorful star
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="40" fill="#FBBF24" />
            <text x="50" y="58" textAnchor="middle" fontSize="32" fill="#78350F" fontWeight="bold">★</text>
          </svg>
        );
    }
  };

  if (showName) {
    return (
      <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
        <div
          className={`inline-flex items-center justify-center transition-transform select-none ${sizeClasses} ${
            interactive ? 'cursor-pointer active:scale-95 hover:scale-105' : ''
          } ${active ? 'scale-105 ring-4 ring-amber-400 rounded-2xl' : ''}`}
        >
          {renderContent()}
        </div>
        <span className="text-[11px] sm:text-xs font-bold text-slate-800 bg-amber-100/95 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs text-center whitespace-nowrap">
          {displayText}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center transition-transform select-none ${sizeClasses} ${
        interactive ? 'cursor-pointer active:scale-95 hover:scale-105' : ''
      } ${active ? 'scale-105 ring-4 ring-amber-400 rounded-2xl' : ''} ${className}`}
    >
      {renderContent()}
    </div>
  );
};
