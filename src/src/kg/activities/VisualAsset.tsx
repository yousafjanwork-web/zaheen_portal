import { useEffect, useState } from 'react';

export const CHILD_AVATARS = [
  { id: 'rabbit', labelEn: 'Bunny', labelUr: 'خرگوش', bg: '#E6F5FC', accent: '#57BCEB' },
  { id: 'parrot', labelEn: 'Parrot', labelUr: 'طوطا', bg: '#E7F7EE', accent: '#60C994' },
  { id: 'bear', labelEn: 'Teddy Bear', labelUr: 'بھالو', bg: '#FFF7DF', accent: '#FFD45C' },
  { id: 'cat', labelEn: 'Kitten', labelUr: 'بلی', bg: '#FFEBE7', accent: '#FF927F' },
  { id: 'owl', labelEn: 'Wise Owl', labelUr: 'الو', bg: '#F2EDFC', accent: '#B9A0EF' },
];

export function AvatarBadge({ avatarId, size = 56 }: { avatarId: string; size?: number }) {
  const meta = CHILD_AVATARS.find((a) => a.id === avatarId) || CHILD_AVATARS[0];
  return (
    <div
      style={{ width: size, height: size, backgroundColor: meta.bg, borderColor: meta.accent }}
      className="rounded-full border-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
    >
      <VisualAsset visualKey={avatarId} size={Math.round(size * 0.72)} />
    </div>
  );
}

export function VisualAsset({
  visualKey,
  imageUrl,
  alt,
  size = 72,
}: {
  visualKey: string;
  imageUrl?: string | null;
  alt?: string;
  size?: number;
}) {
  const key = (visualKey || '').trim();
  const overrideUrl = imageUrl || null;
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [overrideUrl]);

  if (overrideUrl && !imgFailed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-2xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center shrink-0 select-none shadow-sm"
      >
        <img
          src={overrideUrl}
          alt={alt || key || 'Lesson image'}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="w-full h-full object-contain p-1"
        />
      </div>
    );
  }

  if (key.startsWith('letter_')) {
    const ch = key.replace('letter_', '');
    const isLowercase = ch.length === 1 && ch === ch.toLowerCase() && ch !== ch.toUpperCase();
    const isPair = ch.length >= 2;
    return (
      <div
        style={{ width: size, height: size }}
        className={`rounded-2xl border-2 flex items-center justify-center font-extrabold select-none ${
          isLowercase
            ? 'bg-[#FFF5EC] border-[#FB923C] text-[#9A3412]'
            : isPair
              ? 'bg-[#F3E8FF] border-[#B9A0EF] text-[#5B21B6]'
              : 'bg-[#EBF7FD] border-[#57BCEB] text-[#0F4C75]'
        }`}
      >
        <span style={{ fontSize: Math.round(size * (isPair ? 0.44 : 0.56)) }}>{ch}</span>
      </div>
    );
  }

  if (key.startsWith('dots_')) {
    const count = Math.max(0, Math.min(3, Number(key.replace('dots_', '')) || 0));
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-2xl bg-[#EAF9F1] border-2 border-[#60C994] flex flex-col items-center justify-center gap-1.5 select-none px-2"
      >
        <div className="w-10 h-3 rounded-b-full border-b-4 border-[#15803D]" />
        <div className="flex items-center justify-center gap-1.5 min-h-[14px]">
          {count === 0 ? (
            <span className="text-xs font-extrabold text-[#166534]">0</span>
          ) : (
            Array.from({ length: count }).map((_, idx) => (
              <span key={idx} className="w-3 h-3 rounded-full bg-[#15803D] inline-block" />
            ))
          )}
        </div>
      </div>
    );
  }

  if (key.startsWith('urdu_')) {
    const map: Record<string, string> = {
      urdu_alif: 'ا',
      urdu_alif_madda: 'آ',
      urdu_bay: 'ب',
      urdu_pay: 'پ',
      urdu_tay: 'ت',
      urdu_ttay: 'ٹ',
      urdu_say: 'ث',
      urdu_jeem: 'ج',
      urdu_chay: 'چ',
      urdu_hay: 'ح',
      urdu_khay: 'خ',
      urdu_daal: 'د',
      urdu_ddaal: 'ڈ',
      urdu_zaal: 'ذ',
      urdu_ray: 'ر',
      urdu_rray: 'ڑ',
      urdu_zay: 'ز',
      urdu_zhay: 'ژ',
      urdu_seen: 'س',
      urdu_sheen: 'ش',
      urdu_suad: 'ص',
      urdu_zuad: 'ض',
      urdu_toye: 'ط',
      urdu_zoye: 'ظ',
      urdu_ain: 'ع',
      urdu_ghain: 'غ',
      urdu_fay: 'ف',
      urdu_qaf: 'ق',
      urdu_kaf: 'ک',
      urdu_gaf: 'گ',
      urdu_lam: 'ل',
      urdu_meem: 'م',
      urdu_noon: 'ن',
      urdu_wao: 'و',
      urdu_choti_hay: 'ہ',
      urdu_hamza: 'ء',
      urdu_choti_yay: 'ی',
      urdu_badi_yay: 'ے',
    };
    const ch = map[key] || 'ا';
    return (
      <div
        dir="rtl"
        style={{ width: size, height: size }}
        className="rounded-2xl bg-[#EAF9F1] border-2 border-[#60C994] flex items-center justify-center font-urdu-heading font-bold text-[#14532D] select-none"
      >
        <span style={{ fontSize: Math.round(size * 0.52), lineHeight: 1 }}>{ch}</span>
      </div>
    );
  }

  if (key.startsWith('num_')) {
    const n = key.replace('num_', '');
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-2xl bg-[#FFF8E1] border-2 border-[#FFD45C] flex items-center justify-center font-extrabold text-[#78350F] tabular-nums select-none"
      >
        <span style={{ fontSize: Math.round(size * 0.56) }}>{n}</span>
      </div>
    );
  }

  if (key.startsWith('color_')) {
    const colorMap: Record<string, string> = {
      color_yellow: '#FFD45C',
      color_blue: '#57BCEB',
      color_green: '#60C994',
      color_coral: '#FF927F',
      color_purple: '#B9A0EF',
    };
    const hex = colorMap[key] || '#57BCEB';
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
        <path
          d="M42 10 C58 10 70 22 68 38 C66 56 54 70 36 68 C19 66 10 53 12 36 C14 21 26 10 42 10 Z"
          fill={hex}
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <ellipse cx="30" cy="26" rx="7" ry="4" fill="#FFFFFF" opacity="0.45" transform="rotate(-25 30 26)" />
      </svg>
    );
  }

  switch (key) {
    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Apple">
          <path d="M40 20 C41 12 48 8 54 10" stroke="#6D4C41" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M42 17 C48 11 58 12 58 20 C51 22 45 21 42 17 Z" fill="#60C994" />
          <path
            d="M40 24 C27 19 14 28 15 44 C16 61 28 70 37 68 C39 67.5 41 67.5 43 68 C52 70 64 61 65 44 C66 28 53 19 40 24 Z"
            fill="#EF4444"
          />
          <ellipse cx="28" cy="36" rx="4.5" ry="9" fill="#FCA5A5" opacity="0.6" transform="rotate(-18 28 36)" />
        </svg>
      );

    case 'pomegranate':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Pomegranate">
          <path d="M33 18 L36 10 L40 15 L44 10 L47 18 Z" fill="#DC2626" />
          <circle cx="40" cy="44" r="24" fill="#E11D48" />
          <circle cx="46" cy="47" r="15" fill="#FFF1F2" />
          <circle cx="42" cy="43" r="3" fill="#BE123C" />
          <circle cx="50" cy="42" r="3" fill="#BE123C" />
          <circle cx="46" cy="50" r="3" fill="#BE123C" />
          <circle cx="53" cy="50" r="2.8" fill="#BE123C" />
          <circle cx="39" cy="51" r="2.8" fill="#BE123C" />
        </svg>
      );

    case 'ball':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Ball">
          <circle cx="40" cy="40" r="26" fill="#57BCEB" />
          <path d="M19 25 Q40 40 19 55" stroke="#FFD45C" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M61 25 Q40 40 61 55" stroke="#FF927F" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="40" r="26" fill="none" stroke="#0284C7" strokeWidth="2.5" />
        </svg>
      );

    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Cat">
          <polygon points="20,34 17,14 34,25" fill="#FDBA74" />
          <polygon points="60,34 63,14 46,25" fill="#FDBA74" />
          <circle cx="40" cy="44" r="22" fill="#FED7AA" />
          <circle cx="32" cy="41" r="3.2" fill="#1E293B" />
          <circle cx="48" cy="41" r="3.2" fill="#1E293B" />
          <polygon points="37,48 43,48 40,52" fill="#FB7185" />
          <path d="M35 55 Q40 59 45 55" stroke="#7C2D12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'ant':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Ant">
          <circle cx="24" cy="45" r="10" fill="#B45309" />
          <circle cx="41" cy="42" r="8" fill="#D97706" />
          <circle cx="56" cy="36" r="9" fill="#B45309" />
          <circle cx="58" cy="34" r="2" fill="#FFFFFF" />
          <path d="M58 27 Q62 18 67 18" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M53 27 Q52 17 48 16" stroke="#78350F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M38 49 L32 62 M42 49 L44 62 M46 47 L54 60" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'sun':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Sun">
          <circle cx="40" cy="40" r="18" fill="#FFD45C" />
          <g stroke="#F59E0B" strokeWidth="4" strokeLinecap="round">
            <line x1="40" y1="10" x2="40" y2="17" />
            <line x1="40" y1="63" x2="40" y2="70" />
            <line x1="10" y1="40" x2="17" y2="40" />
            <line x1="63" y1="40" x2="70" y2="40" />
            <line x1="19" y1="19" x2="24" y2="24" />
            <line x1="56" y1="56" x2="61" y2="61" />
            <line x1="61" y1="19" x2="56" y2="24" />
            <line x1="24" y1="56" x2="19" y2="61" />
          </g>
        </svg>
      );

    case 'star':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Star">
          <polygon
            points="40,10 49,29 70,32 54,47 58,68 40,58 22,68 26,47 10,32 31,29"
            fill="#FFD45C"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Circle">
          <circle cx="40" cy="40" r="26" fill="#57BCEB" stroke="#0284C7" strokeWidth="3" />
        </svg>
      );

    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Triangle">
          <polygon points="40,12 68,64 12,64" fill="#FFD45C" stroke="#D97706" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );

    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Square">
          <rect x="15" y="15" width="50" height="50" rx="8" fill="#60C994" stroke="#059669" strokeWidth="3" />
        </svg>
      );

    case 'rectangle':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Rectangle">
          <rect x="10" y="22" width="60" height="36" rx="7" fill="#B9A0EF" stroke="#7C3AED" strokeWidth="3" />
        </svg>
      );

    case 'banana':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Banana">
          <path
            d="M18 52 C28 66 56 58 64 26 C66 20 60 16 56 20 C50 42 32 50 20 45 C15 43 14 48 18 52 Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="2.5"
          />
          <path d="M59 19 L63 14" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );

    case 'cup':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Cup">
          <path d="M22 24 H54 L50 58 C49 62 46 64 42 64 H34 C30 64 27 62 26 58 Z" fill="#57BCEB" stroke="#0284C7" strokeWidth="2.5" />
          <path d="M53 30 C63 30 63 48 51 48" fill="none" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" />
          <ellipse cx="38" cy="24" rx="16" ry="4" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2" />
        </svg>
      );

    case 'grapes':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Grapes">
          <path d="M40 16 V24" stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M40 18 C48 12 56 14 55 21 C49 23 44 21 40 18 Z" fill="#60C994" />
          <circle cx="32" cy="34" r="8" fill="#9333EA" />
          <circle cx="48" cy="34" r="8" fill="#A855F7" />
          <circle cx="40" cy="36" r="8" fill="#7E22CE" />
          <circle cx="35" cy="48" r="8" fill="#A855F7" />
          <circle cx="46" cy="48" r="8" fill="#9333EA" />
          <circle cx="40" cy="60" r="8" fill="#7E22CE" />
        </svg>
      );

    case 'butterfly':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Butterfly">
          <ellipse cx="26" cy="34" rx="14" ry="13" fill="#F472B6" />
          <ellipse cx="54" cy="34" rx="14" ry="13" fill="#F472B6" />
          <ellipse cx="28" cy="50" rx="11" ry="10" fill="#FB923C" />
          <ellipse cx="52" cy="50" rx="11" ry="10" fill="#FB923C" />
          <rect x="37" y="24" width="6" height="36" rx="3" fill="#475569" />
          <path d="M39 24 Q33 14 29 15" stroke="#475569" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M41 24 Q47 14 51 15" stroke="#475569" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'rabbit':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Bunny">
          <ellipse cx="30" cy="22" rx="6" ry="16" fill="#D6B59C" />
          <ellipse cx="50" cy="22" rx="6" ry="16" fill="#D6B59C" />
          <ellipse cx="30" cy="23" rx="3" ry="11" fill="#FBCFE8" />
          <ellipse cx="50" cy="23" rx="3" ry="11" fill="#FBCFE8" />
          <circle cx="40" cy="48" r="20" fill="#E7D3C1" />
          <circle cx="33" cy="45" r="2.8" fill="#1E293B" />
          <circle cx="47" cy="45" r="2.8" fill="#1E293B" />
          <ellipse cx="40" cy="51" rx="3.5" ry="2.5" fill="#FB7185" />
          <path d="M36 55 Q40 59 44 55" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'parrot':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Parrot">
          <circle cx="40" cy="42" r="22" fill="#60C994" />
          <circle cx="34" cy="36" r="6" fill="#FFFFFF" />
          <circle cx="35" cy="36" r="2.8" fill="#1E293B" />
          <path d="M44 38 C56 38 58 48 48 50 Z" fill="#F97316" />
          <circle cx="31" cy="44" r="3.5" fill="#FB7185" opacity="0.6" />
        </svg>
      );

    case 'bear':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Teddy Bear">
          <circle cx="23" cy="25" r="9" fill="#B4845C" />
          <circle cx="57" cy="25" r="9" fill="#B4845C" />
          <circle cx="40" cy="44" r="22" fill="#C69770" />
          <ellipse cx="40" cy="50" rx="10" ry="8" fill="#F3E5D8" />
          <circle cx="32" cy="39" r="3" fill="#1E293B" />
          <circle cx="48" cy="39" r="3" fill="#1E293B" />
          <ellipse cx="40" cy="47" rx="4" ry="2.8" fill="#451A03" />
        </svg>
      );

    case 'owl':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Owl">
          <circle cx="40" cy="44" r="22" fill="#B9A0EF" />
          <circle cx="32" cy="40" r="8" fill="#FFFFFF" />
          <circle cx="48" cy="40" r="8" fill="#FFFFFF" />
          <circle cx="32" cy="40" r="3.2" fill="#1E293B" />
          <circle cx="48" cy="40" r="3.2" fill="#1E293B" />
          <polygon points="37,46 43,46 40,53" fill="#F59E0B" />
        </svg>
      );

    case 'duck':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Duck">
          <ellipse cx="38" cy="49" rx="22" ry="15" fill="#FACC15" />
          <circle cx="52" cy="30" r="12" fill="#FDE047" />
          <path d="M62 29 L73 32 L62 36 Z" fill="#F97316" />
          <circle cx="55" cy="27" r="2.5" fill="#1E293B" />
          <ellipse cx="34" cy="49" rx="11" ry="7" fill="#EAB308" />
        </svg>
      );

    case 'elephant':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Elephant">
          <circle cx="24" cy="36" r="14" fill="#94A3B8" />
          <circle cx="56" cy="36" r="14" fill="#94A3B8" />
          <circle cx="40" cy="38" r="18" fill="#CBD5E1" />
          <path d="M36 44 C36 58 42 66 50 62" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="33" cy="34" r="2.5" fill="#1E293B" />
          <circle cx="47" cy="34" r="2.5" fill="#1E293B" />
        </svg>
      );

    case 'fish':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Fish">
          <polygon points="55,40 70,26 70,54" fill="#FB923C" />
          <ellipse cx="37" cy="40" rx="23" ry="15" fill="#38BDF8" />
          <circle cx="24" cy="37" r="3" fill="#FFFFFF" />
          <circle cx="23.5" cy="37" r="1.5" fill="#0F172A" />
          <path d="M36 27 Q42 39 36 53" stroke="#BAE6FD" strokeWidth="3" fill="none" />
        </svg>
      );

    case 'hat':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Hat">
          <path d="M22 48 L27 22 C29 18 51 18 53 22 L58 48 Z" fill="#8B5CF6" />
          <rect x="23" y="40" width="34" height="7" fill="#FFD45C" />
          <ellipse cx="40" cy="50" rx="28" ry="7" fill="#7C3AED" />
        </svg>
      );

    case 'igloo':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Igloo">
          <path d="M12 58 C12 30 68 30 68 58 Z" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="3" />
          <path d="M32 58 L32 45 C32 39 48 39 48 45 L48 58 Z" fill="#0284C7" />
          <line x1="16" y1="45" x2="64" y2="45" stroke="#BAE6FD" strokeWidth="2.5" />
          <line x1="40" y1="30" x2="40" y2="40" stroke="#BAE6FD" strokeWidth="2.5" />
        </svg>
      );

    case 'jug':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Jug">
          <path d="M26 20 H50 L54 58 C54 63 49 66 44 66 H32 C27 66 22 63 22 58 Z" fill="#60C994" stroke="#059669" strokeWidth="2.5" />
          <path d="M51 28 C64 28 64 50 53 50" fill="none" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="38" cy="20" rx="13" ry="4" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
        </svg>
      );

    case 'kite':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Kite">
          <polygon points="40,10 62,34 40,58 18,34" fill="#FB7185" stroke="#E11D48" strokeWidth="2.5" />
          <polygon points="40,10 62,34 40,34" fill="#FFD45C" />
          <polygon points="18,34 40,34 40,58" fill="#57BCEB" />
          <path d="M40 58 Q46 66 36 72" stroke="#64748B" strokeWidth="2.5" fill="none" />
        </svg>
      );

    case 'lion':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Lion">
          <circle cx="40" cy="40" r="26" fill="#D97706" />
          <circle cx="40" cy="41" r="18" fill="#FCD34D" />
          <circle cx="33" cy="38" r="2.8" fill="#1E293B" />
          <circle cx="47" cy="38" r="2.8" fill="#1E293B" />
          <polygon points="37,44 43,44 40,48" fill="#9A3412" />
          <path d="M35 51 Q40 55 45 51" stroke="#78350F" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'mango':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Mango">
          <path d="M44 16 C51 11 58 14 56 20 C50 22 46 20 44 16 Z" fill="#60C994" />
          <path d="M42 20 C58 20 62 36 54 54 C47 68 30 68 24 56 C18 42 26 20 42 20 Z" fill="#F59E0B" />
          <ellipse cx="33" cy="34" rx="5" ry="9" fill="#FDE68A" opacity="0.6" transform="rotate(-15 33 34)" />
        </svg>
      );

    case 'nest':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Nest">
          <ellipse cx="34" cy="38" rx="7" ry="9" fill="#BAE6FD" />
          <ellipse cx="46" cy="38" rx="7" ry="9" fill="#FDE68A" />
          <path d="M14 42 C14 62 66 62 66 42 Z" fill="#B45309" />
          <ellipse cx="40" cy="42" rx="26" ry="6" fill="#D97706" />
        </svg>
      );

    case 'orange':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Orange">
          <path d="M40 14 V22" stroke="#6D4C41" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M41 16 C48 11 56 13 55 19 C49 21 44 20 41 16 Z" fill="#60C994" />
          <circle cx="40" cy="44" r="23" fill="#FB923C" stroke="#EA580C" strokeWidth="2.5" />
          <circle cx="31" cy="35" r="3" fill="#FED7AA" />
        </svg>
      );

    case 'queen':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Queen Crown">
          <polygon points="14,56 18,24 30,38 40,18 50,38 62,24 66,56" fill="#FFD45C" stroke="#D97706" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="40" cy="43" r="4.5" fill="#EC4899" />
          <circle cx="25" cy="46" r="3.5" fill="#38BDF8" />
          <circle cx="55" cy="46" r="3.5" fill="#60C994" />
        </svg>
      );

    case 'tiger':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Tiger">
          <circle cx="22" cy="24" r="8" fill="#F97316" />
          <circle cx="58" cy="24" r="8" fill="#F97316" />
          <circle cx="40" cy="42" r="22" fill="#FB923C" />
          <path d="M26 28 L31 32 M54 28 L49 32 M40 22 V29" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="39" r="3" fill="#1E293B" />
          <circle cx="48" cy="39" r="3" fill="#1E293B" />
          <polygon points="37,46 43,46 40,50" fill="#1E293B" />
        </svg>
      );

    case 'umbrella':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Umbrella">
          <path d="M12 42 C12 18 68 18 68 42 Z" fill="#A855F7" />
          <path d="M28 42 C28 18 52 18 52 42 Z" fill="#57BCEB" />
          <path d="M40 42 V60 C40 66 48 66 48 60" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'van':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Van">
          <path d="M12 48 V28 C12 24 16 22 20 22 H48 L62 34 L68 38 V48 Z" fill="#57BCEB" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="20" y="27" width="14" height="10" rx="2" fill="#E0F2FE" />
          <polygon points="38,27 48,27 56,36 38,36" fill="#E0F2FE" />
          <circle cx="24" cy="52" r="8" fill="#334155" />
          <circle cx="56" cy="52" r="8" fill="#334155" />
          <circle cx="24" cy="52" r="3" fill="#CBD5E1" />
          <circle cx="56" cy="52" r="3" fill="#CBD5E1" />
        </svg>
      );

    case 'watch':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Watch">
          <rect x="31" y="10" width="18" height="60" rx="5" fill="#64748B" />
          <circle cx="40" cy="40" r="18" fill="#FFFFFF" stroke="#0284C7" strokeWidth="4" />
          <line x1="40" y1="40" x2="40" y2="29" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="40" x2="49" y2="40" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'xylophone':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Xylophone">
          <rect x="14" y="20" width="9" height="40" rx="4" fill="#EF4444" />
          <rect x="26" y="23" width="9" height="34" rx="4" fill="#F59E0B" />
          <rect x="38" y="26" width="9" height="28" rx="4" fill="#60C994" />
          <rect x="50" y="29" width="9" height="22" rx="4" fill="#57BCEB" />
          <rect x="62" y="31" width="8" height="18" rx="4" fill="#B9A0EF" />
        </svg>
      );

    case 'yak':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Yak">
          <path d="M18 28 C12 18 22 14 26 24 M62 28 C68 18 58 14 54 24" stroke="#E2E8F0" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="20" y="26" width="40" height="34" rx="16" fill="#78350F" />
          <circle cx="32" cy="38" r="2.8" fill="#FFFFFF" />
          <circle cx="48" cy="38" r="2.8" fill="#FFFFFF" />
          <ellipse cx="40" cy="50" rx="10" ry="6" fill="#B45309" />
        </svg>
      );

    case 'zebra':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Zebra">
          <circle cx="40" cy="42" r="22" fill="#F8FAFC" stroke="#334155" strokeWidth="2.5" />
          <path d="M24 30 L34 34 M56 30 L46 34 M22 44 L31 44 M58 44 L49 44" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="33" cy="38" r="2.8" fill="#1E293B" />
          <circle cx="47" cy="38" r="2.8" fill="#1E293B" />
          <ellipse cx="40" cy="52" rx="9" ry="6" fill="#CBD5E1" />
        </svg>
      );

    case 'drum':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Drum">
          <rect x="16" y="28" width="48" height="32" rx="8" fill="#EF4444" />
          <ellipse cx="40" cy="28" rx="24" ry="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          <path d="M22 35 L32 56 L42 35 L52 56 L58 35" stroke="#FFD45C" strokeWidth="3" fill="none" />
        </svg>
      );

    case 'egg':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Egg">
          <path d="M40 14 C54 14 60 36 60 48 C60 60 51 66 40 66 C29 66 20 60 20 48 C20 36 26 14 40 14 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
          <ellipse cx="32" cy="34" rx="4" ry="8" fill="#FFFFFF" opacity="0.7" transform="rotate(-14 32 34)" />
        </svg>
      );

    case 'flower':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Flower">
          <circle cx="40" cy="22" r="10" fill="#FB7185" />
          <circle cx="57" cy="36" r="10" fill="#F472B6" />
          <circle cx="50" cy="55" r="10" fill="#FB7185" />
          <circle cx="30" cy="55" r="10" fill="#F472B6" />
          <circle cx="23" cy="36" r="10" fill="#FB7185" />
          <circle cx="40" cy="40" r="11" fill="#FFD45C" />
        </svg>
      );

    case 'goat':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Goat">
          <path d="M28 24 C24 14 18 16 20 26 M52 24 C56 14 62 16 60 26" stroke="#94A3B8" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="40" cy="42" r="19" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2.5" />
          <circle cx="33" cy="39" r="2.8" fill="#1E293B" />
          <circle cx="47" cy="39" r="2.8" fill="#1E293B" />
          <polygon points="37,54 43,54 40,63" fill="#CBD5E1" />
        </svg>
      );

    case 'house':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="House">
          <polygon points="40,12 68,36 12,36" fill="#FF927F" stroke="#E11D48" strokeWidth="2.5" />
          <rect x="20" y="36" width="40" height="30" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
          <rect x="34" y="46" width="12" height="20" rx="2" fill="#57BCEB" />
        </svg>
      );

    case 'icecream':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Ice Cream">
          <polygon points="27,40 53,40 40,68" fill="#F59E0B" />
          <circle cx="33" cy="32" r="11" fill="#F472B6" />
          <circle cx="47" cy="32" r="11" fill="#60C994" />
          <circle cx="40" cy="23" r="11" fill="#FEF3C7" />
        </svg>
      );

    case 'juice':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Juice">
          <path d="M46 14 L52 24" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <rect x="25" y="24" width="30" height="42" rx="6" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
          <circle cx="40" cy="45" r="8" fill="#F97316" />
        </svg>
      );

    case 'key':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Key">
          <circle cx="28" cy="40" r="13" fill="#FFD45C" stroke="#D97706" strokeWidth="3" />
          <circle cx="28" cy="40" r="4.5" fill="#FFFFFF" />
          <rect x="40" y="36" width="26" height="8" rx="3" fill="#FFD45C" stroke="#D97706" strokeWidth="2" />
          <rect x="52" y="44" width="5" height="9" fill="#D97706" />
          <rect x="60" y="44" width="5" height="7" fill="#D97706" />
        </svg>
      );

    case 'leaf':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Leaf">
          <path d="M18 58 C18 28 42 16 62 18 C64 42 50 62 18 58 Z" fill="#60C994" stroke="#059669" strokeWidth="2.5" />
          <path d="M16 60 L52 26" stroke="#065F46" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'moon':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Moon">
          <path d="M48 14 C30 16 20 32 24 49 C28 64 46 70 60 62 C44 64 34 52 36 37 C37 26 42 19 48 14 Z" fill="#FFD45C" stroke="#D97706" strokeWidth="2.5" />
        </svg>
      );

    case 'net':
    case 'box':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Box">
          <rect x="18" y="24" width="44" height="38" rx="6" fill="#FDBA74" stroke="#C2410C" strokeWidth="2.5" />
          <line x1="18" y1="36" x2="62" y2="36" stroke="#C2410C" strokeWidth="2.5" />
          <rect x="33" y="32" width="14" height="8" rx="2" fill="#FEF3C7" />
        </svg>
      );

    case 'pencil':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Pencil">
          <polygon points="18,62 24,44 36,56" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
          <polygon points="18,62 21,54 26,59" fill="#1E293B" />
          <polygon points="24,44 52,16 64,28 36,56" fill="#FFD45C" stroke="#D97706" strokeWidth="2.5" />
        </svg>
      );

    case 'quilt':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Quilt">
          <rect x="16" y="16" width="24" height="24" rx="4" fill="#57BCEB" />
          <rect x="40" y="16" width="24" height="24" rx="4" fill="#FFD45C" />
          <rect x="16" y="40" width="24" height="24" rx="4" fill="#FF927F" />
          <rect x="40" y="40" width="24" height="24" rx="4" fill="#60C994" />
        </svg>
      );

    case 'rainbow':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Rainbow">
          <path d="M12 54 C12 22 68 22 68 54" stroke="#EF4444" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M19 54 C19 30 61 30 61 54" stroke="#FFD45C" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M26 54 C26 38 54 38 54 54" stroke="#57BCEB" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'tree':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Tree">
          <rect x="35" y="44" width="10" height="24" rx="3" fill="#92400E" />
          <circle cx="40" cy="30" r="18" fill="#60C994" />
          <circle cx="26" cy="36" r="13" fill="#34D399" />
          <circle cx="54" cy="36" r="13" fill="#34D399" />
        </svg>
      );

    case 'vase':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Vase">
          <circle cx="40" cy="20" r="8" fill="#F472B6" />
          <path d="M31 28 H49 L45 36 C54 44 52 64 40 64 C28 64 26 44 35 36 Z" fill="#B9A0EF" stroke="#7C3AED" strokeWidth="2.5" />
        </svg>
      );

    case 'watermelon':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Watermelon">
          <path d="M12 34 C12 62 68 62 68 34 Z" fill="#16A34A" />
          <path d="M17 34 C17 55 63 55 63 34 Z" fill="#EF4444" />
          <circle cx="32" cy="42" r="2.2" fill="#1E293B" />
          <circle cx="40" cy="45" r="2.2" fill="#1E293B" />
          <circle cx="48" cy="42" r="2.2" fill="#1E293B" />
        </svg>
      );

    case 'yoyo':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Yo-Yo">
          <line x1="40" y1="10" x2="40" y2="28" stroke="#64748B" strokeWidth="3" />
          <circle cx="40" cy="46" r="20" fill="#FB7185" stroke="#E11D48" strokeWidth="3" />
          <circle cx="40" cy="46" r="9" fill="#FFD45C" />
        </svg>
      );

    case 'zip':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Zipper">
          <rect x="34" y="12" width="12" height="56" rx="4" fill="#CBD5E1" />
          <rect x="31" y="26" width="18" height="14" rx="4" fill="#57BCEB" stroke="#0284C7" strokeWidth="2" />
          <rect x="36" y="40" width="8" height="14" rx="3" fill="#0284C7" />
        </svg>
      );

    case 'tomato':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Tomato">
          <path d="M33 20 L40 13 L47 20 L40 23 Z" fill="#16A34A" />
          <circle cx="40" cy="44" r="22" fill="#EF4444" />
          <ellipse cx="30" cy="36" rx="4" ry="8" fill="#FCA5A5" opacity="0.6" transform="rotate(-15 30 36)" />
        </svg>
      );

    case 'book':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Book">
          <rect x="18" y="16" width="44" height="48" rx="6" fill="#57BCEB" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="26" y="22" width="28" height="12" rx="3" fill="#FFFFFF" />
          <line x1="22" y1="16" x2="22" y2="64" stroke="#0369A1" strokeWidth="4" />
        </svg>
      );

    case 'mountain':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Mountain">
          <polygon points="10,62 34,20 58,62" fill="#60C994" />
          <polygon points="34,62 52,28 70,62" fill="#34D399" />
          <polygon points="27,32 34,20 41,32" fill="#FFFFFF" />
        </svg>
      );

    case 'glasses':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Glasses">
          <circle cx="24" cy="42" r="13" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />
          <circle cx="56" cy="42" r="13" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />
          <line x1="37" y1="42" x2="43" y2="42" stroke="#0284C7" strokeWidth="4" />
        </svg>
      );

    case 'balloon':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Balloon">
          <ellipse cx="40" cy="34" rx="18" ry="22" fill="#EC4899" />
          <polygon points="36,56 44,56 40,61" fill="#DB2777" />
          <path d="M40 61 Q44 67 36 72" stroke="#64748B" strokeWidth="2.5" fill="none" />
          <ellipse cx="32" cy="26" rx="4" ry="7" fill="#FBCFE8" opacity="0.6" transform="rotate(-15 32 26)" />
        </svg>
      );

    case 'lemon':
      return (
        <svg width={size} height={size} viewBox="0 0 80 80" aria-label="Lemon">
          <ellipse cx="40" cy="42" rx="24" ry="17" fill="#FDE047" stroke="#CA8A04" strokeWidth="2.5" />
          <circle cx="32" cy="38" r="2.5" fill="#FEF9C3" />
        </svg>
      );

    default:
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-2xl bg-[#EEF2FF] border-2 border-[#C7D2FE] flex flex-col items-center justify-center font-bold text-[#3730A3] px-1 text-center select-none"
        >
          <span style={{ fontSize: Math.max(12, Math.round(size * 0.28)) }} className="leading-tight uppercase">
            {key.slice(0, 3)}
          </span>
        </div>
      );
  }
}
