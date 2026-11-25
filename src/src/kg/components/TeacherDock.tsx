import { Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { KG_ASSET_BASE } from '../config';
import { useKg } from '../context/KgContext';
import { useIsSpeaking } from '../audio/useSpeaking';
import { VOICES } from '../data/voices';
import { useTeacher } from '../teacher/TeacherContext';
import { Avatar } from '../teacher/Avatar';

const isArabicScript = (s: string) => /[\u0600-\u06FF]/.test(s);

export function TeacherDock() {
  const { voice, setVoice } = useKg();
  const { line, replay } = useTeacher();
  const speaking = useIsSpeaking();
  // Lesson pages follow the language chosen at the start: no language buttons there.
  const { pathname } = useLocation();
  void pathname;
  const showVoiceSwitch = false;
  const rtl = !!line && isArabicScript(line.text);

  return (
    <aside className={`zkg-dock${speaking ? ' is-speaking' : ''}`} aria-label="Miss Ayesha, your teacher">
      <div className="zkg-dock-stage">
        <Avatar />
        {speaking && (
          <div className="zkg-bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="zkg-dock-main">
        <p className="zkg-teacher-name">
          Miss Ayesha <span>· KG Teacher</span>
        </p>

        <div className="zkg-bubble" key={line?.id ?? 0} aria-live="polite">
          {line ? (
            <p
              className={`zkg-bubble-native${rtl ? ' zkg-ur' : ''}`}
              dir={rtl ? 'rtl' : 'ltr'}
              lang={line.lang === 'pa' ? 'pa-Arab' : line.lang}
            >
              {line.text}
            </p>
          ) : (
            <p className="zkg-bubble-en">Coming soon</p>
          )}
        </div>

        <div className="zkg-dock-actions">
          <button type="button" className="zkg-btn zkg-btn-primary zkg-btn-sm" onClick={replay} disabled={!line}>
            <Volume2 size={16} aria-hidden="true" />
            {speaking ? 'Speaking…' : 'Hear again'}
          </button>
          <div className="zkg-seg" role="radiogroup" aria-label="Miss Ayesha's voice" style={showVoiceSwitch ? undefined : { display: 'none' }}>
            {VOICES.map((v) => (
              <button
                key={v.code}
                type="button"
                role="radio"
                aria-checked={voice === v.code}
                className={`zkg-seg-btn${voice === v.code ? ' is-active' : ''}`}
                onClick={() => setVoice(v.code)}
              >
                {v.nameEn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}