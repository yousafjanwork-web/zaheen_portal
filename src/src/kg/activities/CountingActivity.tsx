import { useState } from 'react';
import { VisualAsset } from './VisualAsset';
import { LanguageCode } from '../types';
import { playPopSound, playSuccessChime, playTryAgainTone, speakText } from './sfx';

interface CountingActivityProps {
  itemVisual: string;
  count: number;
  choices: number[];
  correctCount: number;
  language: LanguageCode;
  onResult: (isCorrect: boolean) => void;
}

const EN_NUMBERS = [
  'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
];
const UR_NUMBERS = [
  'ایک', 'دو', 'تین', 'چار', 'پانچ', 'چھ', 'سات', 'آٹھ', 'نو', 'دس',
  'گیارہ', 'بارہ', 'تیرہ', 'چودہ', 'پندرہ', 'سولہ', 'سترہ', 'اٹھارہ', 'انیس', 'بیس',
];

export function CountingActivity({
  itemVisual,
  count,
  choices,
  correctCount,
  language,
  onResult,
}: CountingActivityProps) {
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const isUr = language === 'ur';

  const handleTapItem = (idx: number) => {
    playPopSound();
    if (!tappedIndices.includes(idx)) {
      const next = [...tappedIndices, idx];
      setTappedIndices(next);
      const numIdx = next.length - 1;
      speakText(isUr ? UR_NUMBERS[numIdx] || String(next.length) : EN_NUMBERS[numIdx] || String(next.length), isUr ? 'ur' : 'en');
    } else {
      speakText(isUr ? UR_NUMBERS[idx] || String(idx + 1) : EN_NUMBERS[idx] || String(idx + 1), isUr ? 'ur' : 'en');
    }
  };

  const handlePickNumber = (choice: number) => {
    setSelectedChoice(choice);
    if (choice === correctCount) {
      setStatus('correct');
      playSuccessChime();
      onResult(true);
    } else {
      setStatus('wrong');
      playTryAgainTone();
      onResult(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <p className={`text-center text-sm font-semibold text-slate-600 mb-4 ${isUr ? 'zkg-ur' : ''}`}>
        {isUr
          ? 'ہر تصویر کو باری باری چھو کر گنیں، پھر نیچے صحیح عدد دبائیں!'
          : 'Tap each object one by one to count aloud, then pick the matching number!'}
      </p>

      {/* Interactive Objects Stage */}
      <div className="bg-[#FFFDF5] border border-[#FDE68A] rounded-2xl p-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {Array.from({ length: count }).map((_, idx) => {
          const countedIndex = tappedIndices.indexOf(idx);
          const isCounted = countedIndex !== -1;
          return (
            <button
              key={idx}
              type="button"
             
              onClick={() => handleTapItem(idx)}
              className={`relative p-3 rounded-2xl border-2 transition-colors cursor-pointer min-w-[76px] min-h-[76px] flex items-center justify-center ${
                isCounted ? 'bg-white border-[#60C994] shadow-sm' : 'bg-white/70 border-slate-200 hover:border-[#FFD45C]'
              }`}
            >
              <VisualAsset visualKey={itemVisual} size={64} />
              {isCounted && (
                <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-[#60C994] text-slate-950 font-extrabold text-sm flex items-center justify-center tabular-nums shadow">
                  {countedIndex + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Number Choices */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        {choices.map((c) => {
          const isSelected = selectedChoice === c;
          const isCorrectChoice = status === 'correct' && isSelected;
          const isWrongChoice = status === 'wrong' && isSelected;
          return (
            <button
              key={c}
              type="button"
              onClick={() => handlePickNumber(c)}
              className={`min-w-[84px] min-h-[68px] px-6 py-3 rounded-2xl font-extrabold text-3xl tabular-nums border-2 transition-all cursor-pointer ${
                isCorrectChoice
                  ? 'bg-[#60C994] border-[#059669] text-slate-950 scale-105'
                  : isWrongChoice
                    ? 'bg-[#FFEBE7] border-[#FF927F] text-slate-900'
                    : 'bg-[#F8FAFC] hover:bg-[#FFF7DF] border-slate-200 hover:border-[#FFD45C] text-slate-900'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
