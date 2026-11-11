import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, BookOpen, Star, Play } from 'lucide-react';
import { StickerReward } from '../data/quizData';
import { sounds } from '../utils/audio';

interface RewardModalProps {
  score: number;
  total: number;
  completedStageTitle?: string;
  completedStageTitleUrdu?: string;
  nextStageTitle?: string;
  nextStageTitleUrdu?: string;
  unlockedSticker: StickerReward | null;
  isUrduSubject: boolean;
  onPlayAgain: () => void;
  onStartNextTest?: () => void;
  onChooseAnother: () => void;
  onViewStickers: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  score,
  total,
  completedStageTitle,
  completedStageTitleUrdu,
  nextStageTitle,
  nextStageTitleUrdu,
  unlockedSticker,
  isUrduSubject,
  onPlayAgain,
  onStartNextTest,
  onChooseAnother,
  onViewStickers,
}) => {
  useEffect(() => {
    sounds.playFanfare();

    // Big celebratory confetti blast
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#8B5CF6'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in ${
        isUrduSubject ? 'rtl' : 'ltr'
      }`}
      dir={isUrduSubject ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-2xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 animate-scale-up">
        {/* Trophy Header Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg border-4 border-amber-500 animate-bounce">
            <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-amber-950" />
          </div>
        </div>

        {/* Congratulatory Text */}
        <div className="space-y-1.5">
          <h2
            className={`text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight ${
              isUrduSubject ? 'font-urdu text-3xl sm:text-4xl leading-snug' : ''
            }`}
          >
            {isUrduSubject ? 'شاباش، ذہین! شاندار کامیابی!' : 'Hooray, Zaheen! 🌟'}
          </h2>
          <p
            className={`text-sm sm:text-base font-semibold text-emerald-700 ${
              isUrduSubject ? 'font-urdu' : ''
            }`}
          >
            {isUrduSubject
              ? `${completedStageTitleUrdu || 'ٹیسٹ'} کامیابی سے مکمل ہو گیا!`
              : `You completed ${completedStageTitle || 'this test'} with flying colors!`}
          </p>
        </div>

        {/* Stars Earned Scoreboard */}
        <div className="bg-amber-50 rounded-2xl p-3 sm:p-4 border-2 border-amber-200 space-y-1.5">
          <div className="flex justify-center gap-1.5 text-2xl sm:text-4xl text-amber-400">
            {Array.from({ length: total }).map((_, i) => (
              <span key={i} className={i < score ? 'animate-pulse' : 'text-slate-300'}>
                ★
              </span>
            ))}
          </div>
          <div className="text-xs sm:text-sm font-extrabold text-amber-900">
            {score} / {total} Stars Added to Your Bag! 🌟
          </div>
        </div>

        {/* Unlocked Sticker Card */}
        {unlockedSticker && (
          <div className="bg-purple-50 rounded-2xl p-3 border-2 border-purple-200 space-y-1 text-center">
            <div className="inline-flex items-center gap-1 bg-purple-200 text-purple-900 px-3 py-0.5 rounded-full text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-purple-700" />
              <span>{isUrduSubject ? 'نیا اسٹیکر انعام!' : 'New Sticker Unlocked!'}</span>
            </div>
            <div className="text-3xl animate-bounce">{unlockedSticker.badgeEmoji}</div>
            <div className="text-base font-bold text-slate-900">
              {isUrduSubject ? unlockedSticker.nameUrdu : unlockedSticker.name}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          {/* PRIMARY: Start Next Test Button (when available) */}
          {onStartNextTest && nextStageTitle && (
            <button
              onClick={() => {
                sounds.playPop();
                onStartNextTest();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold py-4 px-5 rounded-2xl shadow-lg text-base sm:text-lg transition-transform active:scale-95 cursor-pointer border-2 border-emerald-400 animate-pulse"
            >
              <Play className="w-5 h-5 fill-white" />
              <span className={isUrduSubject ? 'font-urdu' : ''}>
                {isUrduSubject
                  ? `اگلا ٹیسٹ کھیلیں: ${nextStageTitleUrdu || nextStageTitle} ➡️`
                  : `Start Next Test: ${nextStageTitle} ➡️`}
              </span>
            </button>
          )}

          {/* Replay Current Test */}
          <button
            onClick={() => {
              sounds.playPop();
              onPlayAgain();
            }}
            className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold py-3 px-4 rounded-2xl shadow-sm text-sm sm:text-base transition-transform active:scale-95 cursor-pointer border-2 border-amber-500"
          >
            <RotateCcw className="w-4 h-4" />
            <span className={isUrduSubject ? 'font-urdu' : ''}>
              {isUrduSubject ? 'یہ ٹیسٹ دوبارہ کھیلیں' : 'Play This Test Again'}
            </span>
          </button>

          {/* Back to Subject Stages */}
          <button
            onClick={() => {
              sounds.playPop();
              onChooseAnother();
            }}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-2xl shadow-md text-sm sm:text-base transition-transform active:scale-95 cursor-pointer border-2 border-slate-900"
          >
            <span>{isUrduSubject ? 'تمام ٹیسٹ دیکھیں' : 'See All Tests & Stages'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>

          {/* View Sticker Album */}
          <button
            onClick={() => {
              sounds.playPop();
              onViewStickers();
            }}
            className="w-full text-center text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-900 py-1 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{isUrduSubject ? 'میرے تمام اسٹیکرز دیکھیں' : 'View My Sticker Album'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
