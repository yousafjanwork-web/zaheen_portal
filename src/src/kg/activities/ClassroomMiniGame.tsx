import { useMemo, useState } from 'react';
import { Gamepad2, Sparkles, Volume2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { VisualAsset } from './VisualAsset';
import {
  playPopSound,
  playSuccessChime,
  playTryAgainTone,
  speakText,
  unlockVoicePortal,
} from './sfx';

interface BubbleRound {
  promptEn: string;
  promptUr: string;
  targets: string[];
  bubbles: Array<{ id: string; label: string; visual?: string; color: string; isTarget: boolean }>;
}

interface PairCard {
  id: string;
  pairKey: string;
  labelEn: string;
  labelUr: string;
  visual: string;
}

interface ClassroomMiniGameProps {
  gameMode: 'bubble_hunt' | 'pair_match';
  rounds?: BubbleRound[];
  cards?: PairCard[];
  instructionsEn: string;
  instructionsUr: string;
  language: LanguageCode;
  onAttempt?: (info: { isCorrect: boolean; labelEn: string; labelUr: string }) => void;
  onComplete: (result: { isCorrect: boolean; accuracy: number }) => void;
}

export function ClassroomMiniGame({
  gameMode,
  rounds = [],
  cards = [],
  instructionsEn,
  instructionsUr,
  language,
  onAttempt,
  onComplete,
}: ClassroomMiniGameProps) {
  const isUr = language === 'ur';

  // Bubble Hunt state
  const [roundIdx, setRoundIdx] = useState(0);
  const [poppedIds, setPoppedIds] = useState<string[]>([]);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [gameDone, setGameDone] = useState(false);

  // Pair Match state
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const activeRound = rounds[roundIdx];
  const roundTargetCount = useMemo(
    () => (activeRound ? activeRound.bubbles.filter((b) => b.isTarget).length : 0),
    [activeRound]
  );

  const totalPairCount = useMemo(() => {
    const keys = new Set(cards.map((c) => c.pairKey));
    return keys.size;
  }, [cards]);

  const handleBubbleTap = (bubble: BubbleRound['bubbles'][number]) => {
    if (gameDone || poppedIds.includes(bubble.id)) return;
    unlockVoicePortal();

    if (bubble.isTarget) {
      playPopSound();
      const next = [...poppedIds, bubble.id];
      setPoppedIds(next);
      setWrongId(null);

      if (next.length >= roundTargetCount) {
        if (roundIdx + 1 < rounds.length) {
          playSuccessChime();
          onAttempt?.({
            isCorrect: true,
            labelEn: bubble.label,
            labelUr: bubble.label,
          });
          setTimeout(() => {
            setRoundIdx((r) => r + 1);
            setPoppedIds([]);
            setWrongId(null);
          }, 700);
        } else {
          playSuccessChime();
          setGameDone(true);
          onAttempt?.({
            isCorrect: true,
            labelEn: bubble.label,
            labelUr: bubble.label,
          });
          onComplete({ isCorrect: true, accuracy: Math.max(76, 100 - mistakes * 5) });
        }
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongId(bubble.id);
      playTryAgainTone();
      onAttempt?.({
        isCorrect: false,
        labelEn: bubble.label,
        labelUr: bubble.label,
      });
    }
  };

  const handleCardTap = (card: PairCard) => {
    if (gameDone || matchedPairs.includes(card.pairKey)) return;
    unlockVoicePortal();

    if (!selectedCardId) {
      playPopSound();
      setSelectedCardId(card.id);
      setWrongId(null);
      return;
    }

    if (selectedCardId === card.id) {
      setSelectedCardId(null);
      return;
    }

    const first = cards.find((c) => c.id === selectedCardId);
    if (!first) {
      setSelectedCardId(card.id);
      return;
    }

    if (first.pairKey === card.pairKey) {
      playSuccessChime();
      const nextMatched = [...matchedPairs, card.pairKey];
      setMatchedPairs(nextMatched);
      setSelectedCardId(null);
      setWrongId(null);
      onAttempt?.({
        isCorrect: true,
        labelEn: `${first.labelEn} & ${card.labelEn}`,
        labelUr: `${first.labelUr} اور ${card.labelUr}`,
      });

      if (nextMatched.length >= totalPairCount) {
        setGameDone(true);
        onComplete({ isCorrect: true, accuracy: Math.max(78, 100 - mistakes * 5) });
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongId(card.id);
      playTryAgainTone();
      onAttempt?.({
        isCorrect: false,
        labelEn: card.labelEn,
        labelUr: card.labelUr,
      });
      setTimeout(() => {
        setSelectedCardId(null);
        setWrongId(null);
      }, 550);
    }
  };

  if (gameMode === 'bubble_hunt' && activeRound) {
    const prompt = isUr ? activeRound.promptUr : activeRound.promptEn;
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-1">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>
                {isUr
                  ? `کھیل · راؤنڈ ${roundIdx + 1} از ${rounds.length}`
                  : `Bubble Game · Round ${roundIdx + 1} of ${rounds.length}`}
              </span>
            </span>
            <p className={`text-base font-bold text-slate-900 ${isUr ? 'zkg-ur text-lg' : ''}`}>{prompt}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              unlockVoicePortal();
              speakText(prompt, isUr ? 'ur' : 'en');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF7FD] hover:bg-[#D5EEFA] text-slate-900 font-semibold text-sm min-h-[42px] cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#0284C7]" />
            <span>{isUr ? 'سنیں' : 'Hear Goal'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span>
            {isUr
              ? `پکڑے گئے: ${poppedIds.length} / ${roundTargetCount}`
              : `Bubbles Caught: ${poppedIds.length} of ${roundTargetCount}`}
          </span>
          <span className="inline-flex items-center gap-1 text-[#059669]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isUr ? 'صحیح بلبلے دبائیں!' : 'Pop every matching bubble!'}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 py-2">
          {activeRound.bubbles.map((b) => {
            const popped = poppedIds.includes(b.id);
            const isWrong = wrongId === b.id;
            return (
              <button
                key={b.id}
                type="button"
               
               
               
                onClick={() => handleBubbleTap(b)}
                style={{ backgroundColor: popped ? '#EAF9F1' : isWrong ? '#FFEBE7' : b.color }}
                className={`aspect-square rounded-full border-4 flex flex-col items-center justify-center shadow-sm cursor-pointer transition-colors ${
                  popped
                    ? 'border-[#60C994] text-[#065F46]'
                    : isWrong
                      ? 'border-[#FF927F] text-[#9A3412]'
                      : 'border-white text-slate-950 hover:scale-105'
                }`}
              >
                {b.visual ? (
                  <VisualAsset visualKey={b.visual} size={56} />
                ) : (
                  <span className={`font-extrabold text-3xl sm:text-4xl ${isUr ? 'font-urdu-heading' : ''}`}>
                    {b.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Pair Match mode
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-1">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>{isUr ? 'جوڑ ملائیں کھیل' : 'Match-Up Game'}</span>
          </span>
          <p className={`text-base font-bold text-slate-900 ${isUr ? 'zkg-ur text-lg' : ''}`}>
            {isUr ? instructionsUr : instructionsEn}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            unlockVoicePortal();
            speakText(isUr ? instructionsUr : instructionsEn, isUr ? 'ur' : 'en');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF7FD] hover:bg-[#D5EEFA] text-slate-900 font-semibold text-sm min-h-[42px] cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-[#0284C7]" />
          <span>{isUr ? 'سنیں' : 'Hear Rule'}</span>
        </button>
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
        <span>
          {isUr
            ? `مکمل جوڑے: ${matchedPairs.length} / ${totalPairCount}`
            : `Pairs Matched: ${matchedPairs.length} of ${totalPairCount}`}
        </span>
        <span>{isUr ? 'دو ملتے جلتے کارڈ دبائیں' : 'Tap two cards that go together!'}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {cards.map((card) => {
          const isMatched = matchedPairs.includes(card.pairKey);
          const isSelected = selectedCardId === card.id;
          const isWrong = wrongId === card.id;

          return (
            <button
              key={card.id}
              type="button"
             
              onClick={() => handleCardTap(card)}
              className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 min-h-[144px] cursor-pointer transition-all ${
                isMatched
                  ? 'bg-[#EAF9F1] border-[#60C994] shadow-sm'
                  : isSelected
                    ? 'bg-[#EBF7FD] border-[#0284C7] shadow-md scale-[1.03]'
                    : isWrong
                      ? 'bg-[#FFEBE7] border-[#FF927F]'
                      : 'bg-[#F8FAFC] hover:bg-white border-slate-200 hover:border-[#B9A0EF]'
              }`}
            >
              <VisualAsset visualKey={card.visual} size={68} />
              <span className={`font-bold text-sm text-slate-900 ${isUr ? 'zkg-ur' : ''}`}>
                {isUr ? card.labelUr : card.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
