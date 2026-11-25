import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { LanguageCode } from '../types';
import { Activity } from '../api/types';
import { VisualAsset } from './VisualAsset';
import { TracingCanvas } from './TracingCanvas';
import { CountingActivity } from './CountingActivity';
import { SequenceOrderActivity } from './SequenceOrderActivity';
import { CaseMatchActivity } from './CaseMatchActivity';
import { ClassroomMiniGame } from './ClassroomMiniGame';
import { playSuccessChime, playTryAgainTone, speakText, unlockVoicePortal } from './sfx';

interface ActivityEngineProps {
  activity: Activity;
  language: LanguageCode;
  onAttempt?: (info: { isCorrect: boolean; labelEn: string; labelUr: string }) => void;
  onComplete: (result: { isCorrect: boolean; accuracy: number }) => void;
}

export function ActivityEngine({ activity, language, onAttempt, onComplete }: ActivityEngineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const isUr = language === 'ur';
  const cfg = activity.config || {};

  const handleOptionSelect = (opt: any, idx: number) => {
    unlockVoicePortal();
    setSelectedId(String(idx));
    const labelEn = String(opt.labelEn || opt.id);
    const labelUr = String(opt.labelUr || labelEn);

    if (opt.isCorrect) {
      setFeedback('correct');
      playSuccessChime();
      onAttempt?.({ isCorrect: true, labelEn, labelUr });
      onComplete({ isCorrect: true, accuracy: 100 });
    } else {
      setFeedback('wrong');
      playTryAgainTone();
      onAttempt?.({ isCorrect: false, labelEn, labelUr });
    }
  };

  if (activity.type === 'letter_tracing' || activity.type === 'number_tracing') {
    return (
      <TracingCanvas
        character={String(cfg.character || 'A')}
        strokeHintEn={cfg.strokeHintEn}
        strokeHintUr={cfg.strokeHintUr}
        language={language}
        onComplete={(accuracy) => onComplete({ isCorrect: true, accuracy })}
      />
    );
  }

  if (activity.type === 'case_match') {
    return (
      <CaseMatchActivity
        capitalLetter={String(cfg.capitalLetter || 'A')}
        smallLetter={String(cfg.smallLetter || 'a')}
        distractorCapitals={Array.isArray(cfg.distractorCapitals) ? cfg.distractorCapitals : ['B', 'C']}
        distractorSmalls={Array.isArray(cfg.distractorSmalls) ? cfg.distractorSmalls : ['b', 'c']}
        language={language}
        onAttempt={onAttempt}
        onComplete={onComplete}
      />
    );
  }

  if (activity.type === 'classroom_game') {
    return (
      <ClassroomMiniGame
        gameMode={cfg.gameMode === 'pair_match' ? 'pair_match' : 'bubble_hunt'}
        rounds={Array.isArray(cfg.rounds) ? cfg.rounds : []}
        cards={Array.isArray(cfg.cards) ? cfg.cards : []}
        instructionsEn={activity.instructionsEn ?? ''}
        instructionsUr={activity.instructionsUr ?? ''}
        language={language}
        onAttempt={onAttempt}
        onComplete={onComplete}
      />
    );
  }

  if (activity.type === 'counting') {
    return (
      <CountingActivity
        itemVisual={String(cfg.itemVisual || 'apple')}
        count={Number(cfg.count || 5)}
        choices={Array.isArray(cfg.choices) ? cfg.choices : [3, 4, 5]}
        correctCount={Number(cfg.correctCount || 5)}
        language={language}
        onResult={(ok) => {
          onAttempt?.({ isCorrect: ok, labelEn: String(cfg.correctCount || 5), labelUr: String(cfg.correctCount || 5) });
          if (ok) onComplete({ isCorrect: true, accuracy: 100 });
        }}
      />
    );
  }

  if (activity.type === 'sequence_order') {
    return (
      <SequenceOrderActivity
        sequence={Array.isArray(cfg.sequence) ? cfg.sequence : ['1', '2', '3', '4', '5']}
        shuffled={Array.isArray(cfg.shuffled) ? cfg.shuffled : ['3', '1', '5', '2', '4']}
        language={language}
        onResult={(ok) => {
          onAttempt?.({ isCorrect: ok, labelEn: '1 to 5', labelUr: '١ سے ٥' });
          if (ok) onComplete({ isCorrect: true, accuracy: 100 });
        }}
      />
    );
  }

  const options: any[] = Array.isArray(cfg.options) ? cfg.options : [];
  const audioPhrase = isUr ? cfg.audioPhraseUr || activity.instructionsUr : cfg.audioPhraseEn || activity.instructionsEn;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <p className={`text-base font-semibold text-slate-800 ${isUr ? 'zkg-ur' : ''}`}>
          {isUr ? activity.instructionsUr : activity.instructionsEn}
        </p>
        <button
          type="button"
          onClick={() => {
            unlockVoicePortal();
            speakText(audioPhrase, isUr ? 'ur' : 'en');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EBF7FD] hover:bg-[#D5EEFA] text-slate-900 font-semibold text-sm min-h-[42px] cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-[#0284C7]" />
          <span>{isUr ? 'سنیں' : 'Play Sound'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt, idx) => {
          const isPicked = selectedId === String(idx);
          const showCorrect = feedback === 'correct' && isPicked;
          const showWrong = feedback === 'wrong' && isPicked;

          return (
            <button
              key={`${opt.id}-${idx}`}
              type="button"
              onClick={() => handleOptionSelect(opt, idx)}
              className={`p-5 rounded-3xl border-2 flex flex-col items-center justify-center gap-3 transition-all min-h-[164px] cursor-pointer ${
                showCorrect
                  ? 'bg-[#EAF9F1] border-[#60C994] shadow-md scale-[1.02]'
                  : showWrong
                    ? 'bg-[#FFEBE7] border-[#FF927F]'
                    : 'bg-[#F8FAFC] hover:bg-white border-slate-200 hover:border-[#57BCEB] hover:shadow-sm'
              }`}
            >
              {opt.hex ? (
                <div
                  style={{ backgroundColor: opt.hex }}
                  className="w-20 h-20 rounded-3xl border-4 border-white shadow-sm"
                />
              ) : (
                <VisualAsset visualKey={String(opt.visual || opt.id)} size={82} />
              )}
              <span className={`font-bold text-lg text-slate-900 ${isUr ? 'zkg-ur' : ''}`}>
                {isUr ? opt.labelUr || opt.labelEn : opt.labelEn}
              </span>
            </button>
          );
        })}
      </div>

      {feedback === 'wrong' && (
        <p className={`mt-4 text-center text-sm font-semibold text-[#C2410C] ${isUr ? 'zkg-ur' : ''}`}>
          {isUr ? 'بہت اچھی کوشش! ایک بار پھر سوچ کر دوبارہ دبائیں۔' : 'Good try! Look closely and tap another picture.'}
        </p>
      )}
    </div>
  );
}
