import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Languages, Play, Sparkles } from 'lucide-react';
import { useChapters, useWelcome } from '../api/useApi';
import { SubjectKey, subjectOf } from '../api/useDayPlan';
import { KG_BASE_PATH, KG_HOME_BANNER_URL, KG_LECTURE_PATHS } from '../config';
import { readSession, useKg } from '../context/KgContext';
import { useTeacher } from '../teacher/TeacherContext';
import { getVoice } from '../data/voices';

const UI_KEY = 'zaheen.kg.ui';

const BOX: Record<SubjectKey, { en: string; ur: string; classes: string; iconBg: string }> = {
  english: { en: 'English', ur: 'انگریزی', classes: 'bg-[#EBF7FD] hover:bg-[#D5EEFA] border-2 border-[#57BCEB]', iconBg: 'text-[#0284C7]' },
  urdu: { en: 'Urdu', ur: 'اردو', classes: 'bg-[#EAF9F1] hover:bg-[#D4F3E2] border-2 border-[#60C994]', iconBg: 'text-[#059669]' },
  math: { en: 'Maths', ur: 'ریاضی', classes: 'bg-[#F2EDFC] hover:bg-[#E5DCFA] border-2 border-[#B9A0EF]', iconBg: 'text-[#6D28D9]' },
};
const ORDER: SubjectKey[] = ['english', 'urdu', 'math'];

function Glyph({ k }: { k: SubjectKey }) {
  if (k === 'math') return <Calculator className="w-6 h-6 text-[#6D28D9]" aria-hidden="true" />;
  return (
    <span className={`font-extrabold text-2xl ${BOX[k].iconBg}`} aria-hidden="true">
      {k === 'english' ? 'A' : 'ا'}
    </span>
  );
}

export function KgHomePage() {
  const navigate = useNavigate();
  const { voice, voiceChosen, openVoiceChooser } = useKg();
  const { line, replay, sayLocalized, react, phrasesReady } = useTeacher();
  // The voice this visit has already spoken for (so it plays once per visit and again when the language changes).
  const spokenFor = useRef<string | null>(null);
  const welcome = useWelcome();
  const chapters = useChapters();
  const isUr = readSession(UI_KEY) === 'ur';

  useEffect(() => {
    if (!voiceChosen) return;
    if (spokenFor.current === voice) return;
    // This page already has its greeting for this voice (restored when coming back): show it, don't repeat it.
    if (line) {
      spokenFor.current = voice;
      replay();
      return;
    }
    if (welcome.loading) return;
    if (welcome.data && sayLocalized(welcome.data.text, welcome.data.audio)) {
      spokenFor.current = voice;
      return;
    }
    if (phrasesReady) {
      react('greeting');
      spokenFor.current = voice;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceChosen, voice, welcome.loading, welcome.data, phrasesReady, !!line]);

  const describe = (k: SubjectKey) => {
    const c = (chapters.data ?? []).find((x) => subjectOf(x) === k);
    if (!c) return chapters.loading ? '' : 'Coming soon';
    return (isUr ? c.descriptionUr : undefined) || c.descriptionEn || 'Coming soon';
  };

  return (
    <main className="zkg-page" style={{ display: 'grid', gap: 20 }}>
      <style>{`
        @keyframes zkgBounce { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.02); } }
        @keyframes zkgRing { 0% { box-shadow: 0 0 0 0 rgba(245,158,11,.6); } 70% { box-shadow: 0 0 0 22px rgba(245,158,11,0); } 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); } }
        @keyframes zkgShine { 0% { left: -60%; } 60%, 100% { left: 130%; } }
        @keyframes zkgWiggle { 0%,100% { transform: rotate(0); } 20% { transform: rotate(-14deg) scale(1.2); } 40% { transform: rotate(12deg) scale(1.2); } 60% { transform: rotate(-8deg); } 80% { transform: rotate(6deg); } }
        .zkg-start-wiggle { position: relative; overflow: hidden; animation: zkgBounce 1.6s ease-in-out infinite, zkgRing 1.6s ease-out infinite; }
        .zkg-start-wiggle::after { content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%; background: linear-gradient(100deg, transparent, rgba(255,255,255,.7), transparent); transform: skewX(-20deg); animation: zkgShine 2.4s ease-in-out infinite; pointer-events: none; }
        .zkg-start-wiggle:hover { animation-play-state: paused; transform: scale(1.04); }
        .zkg-start-icon { animation: zkgWiggle 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .zkg-start-wiggle, .zkg-start-wiggle::after, .zkg-start-icon { animation: none; } }
      `}</style>
      <div className="zkg-lang-row">
        <button type="button" className="zkg-lang-btn" onClick={openVoiceChooser} aria-label="Change language">
          <Languages size={15} aria-hidden="true" />
          <span>Language</span>
          <span className="zkg-lang-current">
            {getVoice(voice).nameEn} · <span className="zkg-ur">{getVoice(voice).nativeName}</span>
          </span>
        </button>
      </div>
      <section
        className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm"
        style={{ background: 'linear-gradient(135deg,#2F6B4F 0%,#7BB661 55%,#F5C642 100%)' }}
      >
        {KG_HOME_BANNER_URL && (
          <img src={KG_HOME_BANNER_URL} alt="" className="w-full object-cover" style={{ height: 250 }} />
        )}
        <div
          className={KG_HOME_BANNER_URL ? 'absolute inset-0 flex items-end' : 'flex items-end'}
          style={{
            minHeight: 250,
            background: KG_HOME_BANNER_URL ? 'linear-gradient(to top, rgba(2,6,23,.85), rgba(2,6,23,.4), transparent)' : undefined,
          }}
        >
          <div className="p-6 sm:p-8 w-full text-white">
            <p dir="rtl" className="zkg-ur text-2xl mb-1" style={{ color: '#FFD45C' }}>
              کھیلیں، سیکھیں، آگے بڑھیں!
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {isUr ? 'ذہین کے جی میں خوش آمدید!' : 'Play, Learn & Grow Together'}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">{isUr ? 'آپ آج کیا کرنا چاہیں گے؟' : 'Choose What We Do First!'}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <button
            type="button"
            onClick={() => navigate(`${KG_BASE_PATH}/today`)}
            className="p-5 rounded-2xl bg-[#FFD45C] hover:bg-[#F5C642] text-slate-950 zkg-start-wiggle flex items-center gap-4 text-left shadow-sm transition-transform active:scale-95 cursor-pointer min-h-[84px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/75 flex items-center justify-center shrink-0">
              <Play className="w-6 h-6 fill-current zkg-start-icon" aria-hidden="true" />
            </div>
            <div>
              <p className="font-extrabold text-lg">{isUr ? 'سیکھنا شروع کریں' : 'Start Learning'}</p>
              <p className="text-xs font-semibold text-slate-800">{isUr ? 'آج کی کلاس کھولیں' : "Open today's class"}</p>
            </div>
          </button>

          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => navigate(KG_LECTURE_PATHS[k])}
              className={`p-5 rounded-2xl ${BOX[k].classes} text-slate-950 flex items-center gap-4 text-left transition-transform active:scale-95 cursor-pointer min-h-[84px]`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
                <Glyph k={k} />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-lg">{isUr ? BOX[k].ur : BOX[k].en}</p>
                <p className="text-xs font-semibold text-slate-700 line-clamp-2">{describe(k)}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
            <span>{isUr ? 'مس عائشہ کو دبا کر بھی سنیں!' : 'Tip: Tap Miss Ayesha anytime to hear her speak!'}</span>
          </span>
        </div>
      </section>

    </main>
  );
}
