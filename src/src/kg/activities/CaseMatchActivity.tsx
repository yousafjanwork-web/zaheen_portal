import { useState } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { VisualAsset } from './VisualAsset';
import {
  playPopSound,
  playSuccessChime,
  playTryAgainTone,
  speakText,
  unlockVoicePortal,
} from './sfx';

interface CaseMatchActivityProps {
  capitalLetter: string;
  smallLetter: string;
  distractorCapitals?: string[];
  distractorSmalls?: string[];
  language: LanguageCode;
  onAttempt?: (info: { isCorrect: boolean; labelEn: string; labelUr: string }) => void;
  onComplete: (result: { isCorrect: boolean; accuracy: number }) => void;
}

export function CaseMatchActivity({
  capitalLetter,
  smallLetter,
  distractorCapitals = ['B', 'C'],
  distractorSmalls = ['b', 'c'],
  language,
  onAttempt,
  onComplete,
}: CaseMatchActivityProps) {
  const isUr = language === 'ur';
  const [round, setRound] = useState<1 | 2 | 3>(1);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [basketFound, setBasketFound] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [done, setDone] = useState(false);

  const round1Options = [
    { id: 'r1-target', char: smallLetter, isCorrect: true },
    { id: 'r1-d1', char: distractorSmalls[0] || 'b', isCorrect: false },
    { id: 'r1-d2', char: distractorSmalls[1] || 'c', isCorrect: false },
  ];

  const round2Options = [
    { id: 'r2-d1', char: distractorCapitals[0] || 'B', isCorrect: false },
    { id: 'r2-target', char: capitalLetter, isCorrect: true },
    { id: 'r2-d2', char: distractorCapitals[1] || 'C', isCorrect: false },
  ];

  const basketItems = [
    { char: capitalLetter, isTarget: true },
    { char: distractorSmalls[0] || 'b', isTarget: false },
    { char: smallLetter, isTarget: true },
    { char: distractorCapitals[1] || 'C', isTarget: false },
    { char: smallLetter, isTarget: true },
    { char: capitalLetter, isTarget: true },
  ];
  const targetCount = basketItems.filter((item) => item.isTarget).length;

  const roundPromptEn =
    round === 1
      ? `Find the small letter "${smallLetter}" for Capital "${capitalLetter}"!`
      : round === 2
        ? `Now find the Capital letter "${capitalLetter}" for small "${smallLetter}"!`
        : `Tap ALL ${targetCount} Capital "${capitalLetter}" and small "${smallLetter}" cards!`;

  const roundPromptUr =
    round === 1
      ? `بڑے حرف "${capitalLetter}" کے لیے چھوٹا حرف "${smallLetter}" تلاش کریں!`
      : round === 2
        ? `اب چھوٹے حرف "${smallLetter}" کے لیے بڑا حرف "${capitalLetter}" ڈھونڈیں!`
        : `تمام ${targetCount} بڑے "${capitalLetter}" اور چھوٹے "${smallLetter}" کارڈز دبائیں!`;

  const handleRoundPick = (id: string, char: string, isCorrect: boolean) => {
    unlockVoicePortal();
    if (isCorrect) {
      playSuccessChime();
      setWrongId(null);
      onAttempt?.({
        isCorrect: true,
        labelEn: char,
        labelUr: char,
      });
      setTimeout(() => {
        setRound(round === 1 ? 2 : 3);
      }, 650);
    } else {
      setMistakes((m) => m + 1);
      setWrongId(id);
      playTryAgainTone();
      onAttempt?.({
        isCorrect: false,
        labelEn: char,
        labelUr: char,
      });
    }
  };

  const handleBasketTap = (idx: number, char: string, isTarget: boolean) => {
    if (done || basketFound.includes(idx)) return;
    unlockVoicePortal();

    if (isTarget) {
      playPopSound();
      const next = [...basketFound, idx];
      setBasketFound(next);
      setWrongId(null);

      if (next.length >= targetCount) {
        playSuccessChime();
        setDone(true);
        onAttempt?.({
          isCorrect: true,
          labelEn: `${capitalLetter} & ${smallLetter}`,
          labelUr: `${capitalLetter} اور ${smallLetter}`,
        });
        const accuracy = Math.max(75, 100 - mistakes * 6);
        onComplete({ isCorrect: true, accuracy });
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongId(`basket-${idx}`);
      playTryAgainTone();
      onAttempt?.({
        isCorrect: false,
        labelEn: char,
        labelUr: char,
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUr ? `مرحلہ ${round} از 3` : `Round ${round} of 3`}</span>
          </span>
          <p className={`text-base font-bold text-slate-900 ${isUr ? 'zkg-ur text-lg' : ''}`}>
            {isUr ? roundPromptUr : roundPromptEn}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            unlockVoicePortal();
            speakText(isUr ? roundPromptUr : roundPromptEn, isUr ? 'ur' : 'en');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF7FD] hover:bg-[#D5EEFA] text-slate-900 font-semibold text-sm min-h-[42px] cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-[#0284C7]" />
          <span>{isUr ? 'سنیں' : 'Hear Clue'}</span>
        </button>
      </div>

      {round !== 3 && (
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
            <VisualAsset visualKey={`letter_${round === 1 ? capitalLetter : smallLetter}`} size={86} />
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {round === 1
                  ? isUr
                    ? 'بڑا حرف (Capital)'
                    : 'Capital Letter'
                  : isUr
                    ? 'چھوٹا حرف (Small)'
                    : 'Small Letter'}
              </p>
              <p className="text-2xl font-extrabold text-slate-900">
                {round === 1 ? capitalLetter : smallLetter}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full">
            {(round === 1 ? round1Options : round2Options).map((opt) => (
              <button
                key={opt.id}
                type="button"
               
                onClick={() => handleRoundPick(opt.id, opt.char, opt.isCorrect)}
                className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 min-h-[146px] cursor-pointer transition-colors ${
                  wrongId === opt.id
                    ? 'bg-[#FFEBE7] border-[#FF927F]'
                    : 'bg-[#F8FAFC] hover:bg-white border-slate-200 hover:border-[#57BCEB]'
                }`}
              >
                <VisualAsset visualKey={`letter_${opt.char}`} size={76} />
                <span className="text-xs font-bold text-slate-500">
                  {round === 1 ? (isUr ? 'چھوٹا حرف' : 'Small') : isUr ? 'بڑا حرف' : 'Capital'}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {round === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
            <span>
              {isUr
                ? `مل گئے: ${basketFound.length} / ${targetCount}`
                : `Found: ${basketFound.length} of ${targetCount}`}
            </span>
            <span className="text-[#0284C7]">
              {isUr
                ? `${capitalLetter} اور ${smallLetter} دونوں چنیں!`
                : `Pick both ${capitalLetter} and ${smallLetter}!`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {basketItems.map((item, idx) => {
              const found = basketFound.includes(idx);
              const isWrong = wrongId === `basket-${idx}`;
              return (
                <button
                  key={idx}
                  type="button"
                 
                  onClick={() => handleBasketTap(idx, item.char, item.isTarget)}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-1.5 min-h-[126px] cursor-pointer transition-all ${
                    found
                      ? 'bg-[#EAF9F1] border-[#60C994] shadow-sm scale-[1.02]'
                      : isWrong
                        ? 'bg-[#FFEBE7] border-[#FF927F]'
                        : 'bg-[#F8FAFC] hover:bg-white border-slate-200 hover:border-[#B9A0EF]'
                  }`}
                >
                  <VisualAsset visualKey={`letter_${item.char}`} size={68} />
                  <span className="text-[11px] font-bold text-slate-500">
                    {item.char === item.char.toUpperCase() ? 'Capital' : 'Small'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
