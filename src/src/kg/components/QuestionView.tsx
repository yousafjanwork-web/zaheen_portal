import { useState } from 'react';
import { useAutoAdvance } from '../audio/useAutoAdvance';
import { ArrowRight, Check } from 'lucide-react';
import { Question } from '../api/types';
import { LanguageCode } from '../types';
import { VisualAsset } from '../activities/VisualAsset';
import { KNOWN_VISUALS } from '../activities/visualKeys';
import { playSuccessChime, playTryAgainTone, unlockVoicePortal } from '../activities/sfx';

export function QuestionView({
  question, language, last, onCorrect, onWrong, onDone,
}: {
  question: Question;
  language: LanguageCode;
  last: boolean;
  onCorrect: () => void;
  onWrong: () => void;
  onDone: (firstTry: boolean) => void;
}) {
  const isUr = language === 'ur';
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState<number | null>(null);

  const pick = (i: number) => {
    unlockVoicePortal();
    if (solved !== null || wrong.includes(i)) return;
    if (question.options[i].correct) {
      setSolved(i);
      playSuccessChime();
      onCorrect();
    } else {
      setWrong([...wrong, i]);
      playTryAgainTone();
      onWrong();
    }
  };

  const explanation = isUr ? question.explanationUr || question.explanationEn : question.explanationEn;

  // Little children: move on by itself shortly after the right answer.
  useAutoAdvance(solved !== null, () => onDone(wrong.length === 0), 2200);

  return (
    <div className="zkg-q">
      <h2 className="zkg-q-prompt">{question.prompt}</h2>

      <div className="zkg-q-options">
        {question.options.map((o, i) => {
          const state = solved === i ? ' is-correct' : wrong.includes(i) ? ' is-wrong' : '';
          const key = o.text.trim().toLowerCase();
          const picture = question.type === 'picture_match' && KNOWN_VISUALS.has(key);
          return (
            <button
              key={o.id || i}
              type="button"
              className={`zkg-q-option${state}`}
              onClick={() => pick(i)}
              disabled={solved !== null && solved !== i}
            >
              {picture && <VisualAsset visualKey={key} size={72} />}
              <span className={picture ? '' : 'zkg-q-option-text'}>{o.text}</span>
              {solved === i && <Check size={20} className="zkg-q-tick" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {solved !== null && explanation && <p className="zkg-feedback is-good zkg-q-explain">{explanation}</p>}

      {solved !== null && (
        <button type="button" className="zkg-btn zkg-btn-primary zkg-btn-lg" onClick={() => onDone(wrong.length === 0)}>
          {last ? 'Finish' : 'Next question'} <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}