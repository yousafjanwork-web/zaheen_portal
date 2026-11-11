import React from 'react';
import { ArrowLeft, Sparkles, Trophy, Lock } from 'lucide-react';
import { STICKERS, StickerReward } from '../data/quizData';
import { sounds } from '../utils/audio';

interface StickerBookProps {
  unlockedStickerIds: string[];
  totalStars: number;
  onBack: () => void;
}

export const StickerBook: React.FC<StickerBookProps> = ({
  unlockedStickerIds,
  totalStars,
  onBack,
}) => {
  const handleStickerTap = (sticker: StickerReward, isUnlocked: boolean) => {
    if (isUnlocked) {
      sounds.playStarEarn();
      sounds.speak(`${sticker.name}! Great job, Zaheen!`);
    } else {
      sounds.playGentleTryAgain();
      sounds.speak(`Keep playing quizzes to unlock this special sticker!`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2.5 rounded-2xl border-2 border-slate-200 shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 bg-amber-100 border-2 border-amber-300 text-amber-900 px-4 py-1.5 rounded-full font-bold text-sm sm:text-base shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>{totalStars} Stars Collected</span>
        </div>
      </div>

      {/* Album Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border border-purple-200">
          <Trophy className="w-4 h-4 text-purple-600" />
          <span>Zaheen's Achievement Gallery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          My Sticker Album
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md mx-auto">
          Tap your unlocked stickers to hear them celebrate! Earn more by finishing quiz rounds!
        </p>
      </div>

      {/* Stickers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {STICKERS.map((sticker) => {
          const isUnlocked = unlockedStickerIds.includes(sticker.id);

          return (
            <div
              key={sticker.id}
              onClick={() => handleStickerTap(sticker, isUnlocked)}
              className={`p-4 sm:p-5 rounded-3xl border-4 text-center flex flex-col items-center justify-between gap-3 transition-all select-none ${
                isUnlocked
                  ? 'bg-white border-amber-300 hover:border-amber-400 shadow-md hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-slate-100 border-slate-200 opacity-60 cursor-pointer'
              }`}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-50 flex items-center justify-center border-2 border-amber-200">
                {isUnlocked ? (
                  <span className="text-4xl sm:text-5xl animate-wiggle">
                    {sticker.badgeEmoji}
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-slate-400">
                    <Lock className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Locked</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="font-bold text-slate-900 text-sm sm:text-base">
                  {sticker.name}
                </div>
                <div className="font-bold text-slate-500 text-xs font-urdu">
                  {sticker.nameUrdu}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                {sticker.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
