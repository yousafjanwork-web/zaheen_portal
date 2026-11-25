import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { LanguageCode } from '../types';
import { playPopSound, playSuccessChime, playTryAgainTone } from './sfx';

interface SequenceOrderActivityProps {
  sequence: string[];
  shuffled: string[];
  language: LanguageCode;
  onResult: (isCorrect: boolean) => void;
}

export function SequenceOrderActivity({ sequence, shuffled, language, onResult }: SequenceOrderActivityProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const isUr = language === 'ur';

  const handleTapTile = (item: string) => {
    if (picked.includes(item) || status === 'correct') return;
    playPopSound();
    const next = [...picked, item];
    setPicked(next);

    if (next.length === sequence.length) {
      const ok = sequence.every((val, idx) => next[idx] === val);
      if (ok) {
        setStatus('correct');
        playSuccessChime();
        onResult(true);
      } else {
        setStatus('wrong');
        playTryAgainTone();
        onResult(false);
      }
    }
  };

  const handleReset = () => {
    setPicked([]);
    setStatus('idle');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className={`text-sm font-semibold text-slate-600 ${isUr ? 'zkg-ur' : ''}`}>
          {isUr ? 'صحیح ترتیب سے ایک ایک کر کے دبائیں:' : 'Tap the cards in order from first to last:'}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold min-h-[38px] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isUr ? 'دوبارہ' : 'Reset'}</span>
        </button>
      </div>

      {/* Slots */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-4 mb-6">
        {sequence.map((_, idx) => {
          const val = picked[idx];
          return (
            <div
              key={idx}
              className={`h-16 sm:h-20 rounded-2xl border-2 flex items-center justify-center font-extrabold text-2xl tabular-nums ${
                val
                  ? status === 'correct'
                    ? 'bg-[#EAF9F1] border-[#60C994] text-slate-900'
                    : status === 'wrong'
                      ? 'bg-[#FFEBE7] border-[#FF927F] text-slate-900'
                      : 'bg-[#EBF7FD] border-[#57BCEB] text-slate-900'
                  : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {val || idx + 1}
            </div>
          );
        })}
      </div>

      {/* Tap Bank */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {shuffled.map((item) => {
          const used = picked.includes(item);
          return (
            <button
              key={item}
              type="button"
              disabled={used}
              onClick={() => handleTapTile(item)}
              className={`min-w-[68px] min-h-[60px] px-5 py-3 rounded-2xl font-extrabold text-2xl tabular-nums border-2 transition-all cursor-pointer ${
                used
                  ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-default'
                  : 'bg-[#FFF7DF] hover:bg-[#FFD45C] border-[#FFD45C] text-slate-900 shadow-sm'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
