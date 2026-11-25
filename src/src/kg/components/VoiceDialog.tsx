import { useEffect, useRef, useState } from 'react';
import { Check, Volume2 } from 'lucide-react';
import { localize } from '../api/client';
import { usePhrases } from '../api/useApi';
import { Avatar } from '../teacher/Avatar';
import { useKg } from '../context/KgContext';
import { useIsSpeaking } from '../audio/useSpeaking';
import { speak, stopVoice } from '../audio/voice';
import { getVoice, VOICES } from '../data/voices';
import { VoiceLang } from '../types';

export function VoiceDialog() {
  const { voice: initial, confirmVoice } = useKg();
  const phrases = usePhrases();
  const [selected, setSelected] = useState<VoiceLang>(initial);
  const speaking = useIsSpeaking();
  const autoPlayed = useRef(false);

  const sample = (code: VoiceLang) => {
    const p = phrases.data?.get(`voice_sample_${code}`);
    return p ? localize(p.text, p.audio, code) : null;
  };

  const play = (code: VoiceLang) => {
    const s = sample(code);
    if (s) speak({ url: s.audio ?? undefined, text: s.text, lang: s.lang });
  };

  useEffect(() => {
    if (autoPlayed.current || !phrases.data) return;
    autoPlayed.current = true;
    const s = sample(initial);
    if (s) speak({ url: s.audio ?? undefined, text: s.text, lang: s.lang });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases.data]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const choose = (code: VoiceLang) => {
    setSelected(code);
    play(code);
  };

  const start = () => {
    stopVoice();
    confirmVoice(selected);
  };

  const current = sample(selected);
  const meta = getVoice(selected);

  return (
    <div className="zkg-backdrop" role="presentation">
      <div className="zkg-dialog" role="dialog" aria-modal="true" aria-labelledby="zkg-dialog-title">
        <div className="zkg-dialog-side">
          <Avatar />
          {current && (
            <p className="zkg-ur zkg-dialog-native" dir="rtl">
              {current.text}
            </p>
          )}
        </div>

        <div className="zkg-dialog-main">
          <p className="zkg-eyebrow">Miss Ayesha · KG Teacher</p>
          <h2 id="zkg-dialog-title" className="zkg-dialog-title">
            Choose Miss Ayesha&rsquo;s voice
          </h2>
          <p className="zkg-muted">Miss Ayesha will speak to you in the voice you pick. You can change it any time.</p>

          {phrases.error && <p className="zkg-error">Voices could not be loaded right now. You can still continue.</p>}

          <div className="zkg-options" role="radiogroup" aria-label="Voice language">
            {VOICES.map((v) => {
              const active = selected === v.code;
              const s = sample(v.code);
              const p = phrases.data?.get(`voice_sample_${v.code}`);
              return (
                <div key={v.code} className={`zkg-option${active ? ' is-active' : ''}`}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className="zkg-option-main"
                    onClick={() => choose(v.code)}
                  >
                    <span className="zkg-option-glyph zkg-ur" aria-hidden="true">
                      {v.glyph}
                    </span>
                    <span className="zkg-option-text">
                      <strong>
                        {v.nameEn} <span className="zkg-ur">· {v.nativeName}</span>
                      </strong>
                      <small>{phrases.loading ? 'Loading…' : p?.text.en || s?.text || ''}</small>
                    </span>
                    {active && <Check size={18} className="zkg-option-check" aria-hidden="true" />}
                  </button>
                  <button
                    type="button"
                    className="zkg-btn zkg-btn-ghost zkg-btn-sm"
                    onClick={() => play(v.code)}
                    disabled={!s}
                    aria-label={`Play ${v.nameEn} sample`}
                  >
                    <Volume2 size={16} aria-hidden="true" />
                    Sample
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" className="zkg-btn zkg-btn-sun zkg-btn-lg" onClick={start} autoFocus>
            <Check size={20} aria-hidden="true" />
            Start with {meta.nameEn} voice
          </button>
        </div>
      </div>
    </div>
  );
}