import React, { useState } from 'react';
import { ArrowLeft, Play, Sparkles, Volume2, Lock, CheckCircle2, RotateCcw, Unlock } from 'lucide-react';
import { SubjectId } from '../data/quizData';
import { QuizTestStage, getTestStagesForSubject } from '../data/quizStages';
import { ItemIllustration } from './illustrations/ItemIllustration';
import { sounds } from '../utils/audio';
import { getHardcodedAudio } from '../data/hardcodedMedia';

interface SubjectHubProps {
  subject: SubjectId;
  onBack: () => void;
  onLaunchStage: (stage: QuizTestStage) => void;
  unlockedStageIndices: Record<SubjectId, number>;
  completedStageIds: string[];
  earnedStarsByStage: Record<string, number>;
  isUnlockAllActive?: boolean;
  onToggleUnlockAll?: () => void;
}

export const SubjectHub: React.FC<SubjectHubProps> = ({
  subject,
  onBack,
  onLaunchStage,
  unlockedStageIndices,
  completedStageIds,
  earnedStarsByStage,
  isUnlockAllActive = false,
  onToggleUnlockAll,
}) => {
  const isUrdu = subject === 'urdu';
  const stages = getTestStagesForSubject(subject);
  const highestUnlockedIndex = unlockedStageIndices[subject] || 0;

  // Determine current active stage (first incomplete stage, or the first stage)
  const currentStageIndex = isUnlockAllActive
    ? 0
    : Math.min(highestUnlockedIndex, stages.length - 1);
  const activeStage = stages[currentStageIndex] || stages[0];

  const getSubjectHeader = () => {
    switch (subject) {
      case 'english':
        return {
          title: 'English Alphabet & Phonics',
          subtitle: 'Step-by-step 5-letter quizzes! Finish each test to unlock the next one with cheerful friends!',
          previewIllustration: 'apple' as const,
          bgGradient: 'from-sky-400 via-blue-400 to-indigo-500',
          borderColor: 'border-sky-300',
          badgeText: 'Kindergarten English · 5 Letters Per Test',
          speech: 'Welcome to English! Tap Start to play your first test with 5 letters!',
          speechLang: 'en' as const,
        };
      case 'urdu':
        return {
          title: 'پیاری اردو — حروفِ تہجی و گنتی',
          subtitle: 'پانچ پانچ حروف کے آسان ٹیسٹ! پہلا ٹیسٹ مکمل کریں اور اگلا ٹیسٹ کھولیں!',
          previewIllustration: 'titli' as const,
          bgGradient: 'from-rose-400 via-pink-400 to-purple-500',
          borderColor: 'border-rose-300',
          badgeText: 'اردو قاعدہ برائے ذہین · ۵ حروف فی ٹیسٹ',
          speech: 'اردو میں خوش آمدید! پہلے ٹیسٹ میں پانچ حروف سیکھنے کے لیے شروع کریں پر ٹیپ کریں',
          speechLang: 'ur' as const,
        };
      case 'maths':
        return {
          title: 'Early Maths & Counting',
          subtitle: 'Playful 5-number tests! Master 1 to 5, then unlock 6 to 10, counting, and fun addition!',
          previewIllustration: 'duck' as const,
          bgGradient: 'from-emerald-400 via-teal-400 to-green-500',
          borderColor: 'border-emerald-300',
          badgeText: 'Fun Counting Playground · 5 Numbers Per Test',
          speech: 'Welcome to Maths! Tap Start to practice numbers 1 to 5!',
          speechLang: 'en' as const,
        };
    }
  };

  const headerInfo = getSubjectHeader();

  const handleSpeak = () => {
    sounds.playPop();
    sounds.playCustomAudio(getHardcodedAudio(`welcome-${subject}`), headerInfo.speech, headerInfo.speechLang);
  };

  const handleSelectStage = (stage: QuizTestStage, isLocked: boolean) => {
    if (isLocked && !isUnlockAllActive) {
      sounds.playGentleTryAgain();
      sounds.speak(
        isUrdu
          ? 'پہلے پچھلا ٹیسٹ مکمل کریں تاکہ یہ ٹیسٹ کھل سکے!'
          : 'Complete the previous test to unlock this one!',
        isUrdu ? 'ur' : 'en'
      );
      return;
    }

    sounds.playPop();
    onLaunchStage(stage);
  };

  return (
    <div className={`space-y-6 sm:space-y-8 pb-16 ${isUrdu ? 'rtl' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button
          onClick={() => {
            sounds.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-bold px-4 py-2.5 rounded-2xl border-2 border-slate-200 shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base"
        >
          <ArrowLeft className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />
          <span>{isUrdu ? 'واپس ہوم' : 'Back to Home'}</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleUnlockAll && (
            <button
              onClick={() => {
                sounds.playPop();
                onToggleUnlockAll();
              }}
              className={`inline-flex items-center gap-1.5 font-bold px-3 py-2 rounded-2xl border-2 shadow-xs transition-transform active:scale-95 cursor-pointer text-xs sm:text-sm ${
                isUnlockAllActive
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle unlock all tests for evaluation"
            >
              {isUnlockAllActive ? <Unlock className="w-4 h-4 text-purple-600" /> : <Lock className="w-4 h-4 text-slate-400" />}
              <span>{isUnlockAllActive ? 'All Tests Unlocked' : 'Teacher Unlock'}</span>
            </button>
          )}

          <button
            onClick={handleSpeak}
            className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base"
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span>{isUrdu ? 'آواز سنیں' : 'Hear Audio'}</span>
          </button>
        </div>
      </div>

      {/* Subject Hero Header */}
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${headerInfo.bgGradient} p-6 sm:p-10 text-white shadow-lg border-4 ${headerInfo.borderColor}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span className={isUrdu ? 'font-urdu' : ''}>{headerInfo.badgeText}</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isUrdu ? 'font-urdu leading-snug' : ''}`}>
              {headerInfo.title}
            </h1>

            <p className={`text-base sm:text-xl font-medium text-white/95 max-w-xl ${isUrdu ? 'font-urdu leading-loose' : ''}`}>
              {headerInfo.subtitle}
            </p>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/90 rounded-3xl shadow-xl border-4 border-white/50 flex flex-col items-center justify-center p-3 animate-bounce">
              <ItemIllustration id={headerInfo.previewIllustration} size="xl" showName={true} nameLang={isUrdu ? 'ur' : 'en'} />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* FEATURED ACTIVE / NEXT TEST BANNER                  */}
      {/* ==================================================== */}
      {activeStage && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 p-6 sm:p-8 border-4 border-amber-300 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-950/10 text-amber-950 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>{isUrdu ? 'ابھی کھیلنے کے لیے تیار:' : 'Current Active Test:'}</span>
              </div>

              <h2 className={`text-2xl sm:text-4xl font-extrabold text-amber-950 tracking-tight ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? activeStage.titleUrdu : activeStage.title}
              </h2>

              <p className={`text-sm sm:text-base text-amber-900 font-medium ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? activeStage.subtitleUrdu : activeStage.subtitle}
              </p>

              {/* 5-Letter Preview Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-bold text-amber-900/80 mr-1">
                  {isUrdu ? 'ٹیسٹ میں شامل:' : 'In this test:'}
                </span>
                {activeStage.previewItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="min-w-10 h-10 px-3 whitespace-nowrap rounded-2xl bg-white/95 text-amber-950 font-extrabold text-base sm:text-lg flex items-center justify-center shadow-sm border border-amber-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex sm:flex-col justify-end">
              <button
                onClick={() => handleSelectStage(activeStage, false)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-4 px-8 rounded-2xl shadow-xl text-lg sm:text-xl transition-transform active:scale-95 cursor-pointer border-2 border-slate-900 animate-pulse"
              >
                <Play className="w-6 h-6 text-amber-400 fill-amber-400" />
                <span className={isUrdu ? 'font-urdu' : ''}>
                  {isUrdu ? `شروع کریں (${activeStage.titleUrdu})` : `Start ${activeStage.title}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* PROGRESSIVE TEST STAGES MAP & LIST                  */}
      {/* ==================================================== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-xl sm:text-2xl font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'تمام مرحلہ وار ٹیسٹ' : 'All Test Stages (5 Items Each)'}
          </h2>
          <span className="text-xs sm:text-sm font-bold text-slate-500">
            {completedStageIds.filter((id) => id.startsWith(subject === 'urdu' ? 'ur-' : subject === 'english' ? 'eng-' : 'math-')).length} / {stages.length} {isUrdu ? 'مکمل' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stages.map((stage, index) => {
            const isCompleted = completedStageIds.includes(stage.id);
            const isUnlocked = isUnlockAllActive || index <= highestUnlockedIndex;
            const isCurrentActive = index === currentStageIndex && !isCompleted;
            const stars = earnedStarsByStage[stage.id] || 0;

            let cardBorder = 'border-slate-200 bg-white';
            if (isCompleted) {
              cardBorder = 'border-emerald-300 bg-emerald-50/40';
            } else if (isCurrentActive) {
              cardBorder = 'border-amber-400 bg-amber-50/50 ring-4 ring-amber-200';
            } else if (!isUnlocked) {
              cardBorder = 'border-slate-200 bg-slate-50 opacity-75';
            }

            return (
              <div
                key={stage.id}
                className={`flex flex-col justify-between rounded-3xl border-4 p-5 sm:p-6 shadow-md transition-all ${cardBorder}`}
              >
                <div className="space-y-4">
                  {/* Top Badge & Stage Index */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : isCurrentActive
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                          : isUnlocked
                          ? 'bg-sky-100 text-sky-900 border-sky-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {isCompleted
                        ? (isUrdu ? 'مکمل شدہ ✓' : 'Completed ✓')
                        : isCurrentActive
                        ? (isUrdu ? 'اب اگلا ٹیسٹ ⭐' : 'Up Next ⭐')
                        : (isUrdu ? stage.badgeUrdu : stage.badge)}
                    </span>

                    <span className="text-sm font-bold text-slate-400 tabular-nums">
                      {stage.stageNumber} / {stages.length}
                    </span>
                  </div>

                  {/* Stage Title & Subtitle */}
                  <div className="space-y-1.5">
                    <h3 className={`text-xl sm:text-2xl font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                      {isUrdu ? stage.titleUrdu : stage.title}
                    </h3>
                    <p className={`text-xs sm:text-sm text-slate-600 font-medium ${isUrdu ? 'font-urdu' : ''}`}>
                      {isUrdu ? stage.subtitleUrdu : stage.subtitle}
                    </p>
                  </div>

                  {/* 5-Item Preview Chips */}
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {stage.previewItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 whitespace-nowrap rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 shadow-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Stars / Completion indicator */}
                  {isCompleted && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-emerald-800">
                        {isUrdu ? 'حاصل ستارے:' : 'Score:'}
                      </span>
                      <div className="flex gap-1 text-amber-400 text-base">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= stars ? 'fill-amber-400' : 'text-slate-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 pt-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isUrdu ? 'پچھلا ٹیسٹ مکمل کر کے کھولیں' : 'Complete previous test to unlock'}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5">
                  {isUnlocked ? (
                    <button
                      onClick={() => handleSelectStage(stage, false)}
                      className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-2xl shadow-sm text-sm sm:text-base transition-transform active:scale-95 cursor-pointer border-2 ${
                        isCompleted
                          ? 'bg-white hover:bg-emerald-50 text-emerald-900 border-emerald-300'
                          : isCurrentActive
                          ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-500 shadow-md'
                          : 'bg-sky-500 hover:bg-sky-600 text-white border-sky-600'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span className={isUrdu ? 'font-urdu' : ''}>
                            {isUrdu ? 'دوبارہ کھیلیں' : 'Play Again'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span className={isUrdu ? 'font-urdu' : ''}>
                            {isUrdu ? 'ٹیسٹ شروع کریں' : 'Start Test'}
                          </span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectStage(stage, true)}
                      className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-400 font-bold py-3 px-4 rounded-2xl border-2 border-slate-300 cursor-not-allowed text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isUrdu ? 'مقفل' : 'Locked'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
