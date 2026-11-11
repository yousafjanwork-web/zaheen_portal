import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Volume2, Lightbulb, CheckCircle2, RotateCcw } from 'lucide-react';
import { QuizQuestion, ACTIVITIES } from '../data/quizData';
import { CustomMediaItem } from '../data/customMediaStorage';
import { ItemIllustration } from './illustrations/ItemIllustration';
import { sounds } from '../utils/audio';
import { getHardcodedAudio, getHardcodedImage, getHardcodedOptionImage } from '../data/hardcodedMedia';

interface QuizPlayScreenProps {
  questions: QuizQuestion[];
  stageTitle?: string;
  stageTitleUrdu?: string;
  customMediaMap?: Record<string, CustomMediaItem>;
  onCompleteRound: (correctCount: number, totalQuestions: number) => void;
  onExit: () => void;
}

export const QuizPlayScreen: React.FC<QuizPlayScreenProps> = ({
  questions,
  stageTitle,
  stageTitleUrdu,
  customMediaMap = {},
  onCompleteRound,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [correctTotal, setCorrectTotal] = useState(0);

  // For interactive counting game: tracks which items the child has tapped
  const [tappedItemIds, setTappedItemIds] = useState<string[]>([]);

  const currentQ = questions[currentIndex];
  const isUrdu = currentQ?.subject === 'urdu';
  const activityMeta = currentQ ? ACTIVITIES[currentQ.activityType] : undefined;
  const currentCustomData = currentQ ? customMediaMap[currentQ.id] : undefined;

  // Auto-read question on new question load (gentle delay)
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrectAnswer(null);
    setShowHint(false);
    setTappedItemIds([]);

    if (!currentQ) return;
    const timer = setTimeout(() => {
      sounds.playCustomAudio(
        getHardcodedAudio(currentQ.id) || currentCustomData?.customAudioUrl || currentQ.customAudioUrl,
        currentQ.speechText,
        currentQ.speechLang
      );
    }, 450);

    return () => clearTimeout(timer);
  }, [currentIndex, currentQ, currentCustomData]);

  if (!currentQ) {
    return (
      <div className="text-center py-20">
        <button onClick={onExit} className="bg-amber-400 font-bold px-6 py-3 rounded-2xl">Back</button>
      </div>
    );
  }

  // Audio read button
  const handleReadPrompt = () => {
    sounds.playPop();
    sounds.playCustomAudio(
      getHardcodedAudio(currentQ.id) || currentCustomData?.customAudioUrl || currentQ.customAudioUrl,
      currentQ.speechText,
      currentQ.speechLang
    );
  };

  // Item tap in counting games
  const handleItemCountTap = (itemId: string, index: number) => {
    sounds.playCountSound(index + 1);

    if (!tappedItemIds.includes(itemId)) {
      const nextTapped = [...tappedItemIds, itemId];
      setTappedItemIds(nextTapped);

      const countNum = nextTapped.length;
      const countWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
      const word = countWords[countNum - 1] || `${countNum}`;
      sounds.speak(word, 'en');
    }
  };

  // Option selection
  const handleSelectOption = (optionId: string, isCorrect: boolean) => {
    if (isAnswered && isCorrectAnswer) return; // already solved

    sounds.playPop();
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    if (isCorrect) {
      setIsCorrectAnswer(true);
      setCorrectTotal((prev) => prev + 1);
      sounds.playSuccess();

      // Confetti burst for kid celebration
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#8B5CF6'],
        });
      } catch {
        // Confetti fallback
      }

      // Next question or finish round
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onCompleteRound(correctTotal + 1, questions.length);
        }
      }, 1300);
    } else {
      setIsCorrectAnswer(false);
      sounds.playGentleTryAgain();
      // Allow them to try another answer immediately
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-16 ${isUrdu ? 'rtl' : 'ltr'}`}
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Top Header: Exit, Stepping Stones, Audio */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => {
            sounds.playPop();
            onExit();
          }}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 font-bold px-3.5 py-2 rounded-2xl border-2 border-slate-200 shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base"
        >
          <ArrowLeft className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />
          <span>{isUrdu ? 'واپس' : 'Quit'}</span>
        </button>

        {/* Stepping Stones / Star Progress */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/90 px-3 sm:px-4 py-1.5 rounded-full border-2 border-amber-200 shadow-sm">
          {questions.map((_, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-amber-950 font-bold text-sm shadow-md ring-4 ring-amber-200 animate-pulse'
                    : isCompleted
                    ? 'w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-sm'
                    : 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 text-slate-400 text-xs'
                }`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
            );
          })}
        </div>

        {/* Listen Button */}
        <button
          onClick={handleReadPrompt}
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold px-3.5 py-2 rounded-2xl border-2 border-amber-500 shadow-sm transition-transform active:scale-95 cursor-pointer text-sm sm:text-base"
          title={isUrdu ? 'سوال سنیں' : 'Hear question read aloud'}
        >
          <Volume2 className="w-5 h-5" />
          <span className="hidden sm:inline">{isUrdu ? 'سنیں' : 'Read Aloud'}</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-lg p-5 sm:p-8 space-y-6">
        {/* Activity Tag & Question Number */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-extrabold shadow-xs">
            {isUrdu ? (stageTitleUrdu || activityMeta?.titleUrdu) : (stageTitle || activityMeta?.title)}
          </span>
          <span className="tabular-nums font-bold">
            {isUrdu
              ? `سوال ${currentIndex + 1} از ${questions.length}`
              : `Question ${currentIndex + 1} of ${questions.length}`}
          </span>
        </div>

        {/* Prompt Heading */}
        <div className="space-y-2 text-center">
          <h2
            className={`text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug ${
              isUrdu ? 'font-urdu leading-loose text-3xl sm:text-4xl' : ''
            }`}
          >
            {isUrdu ? (currentQ.promptUrdu || currentQ.prompt) : currentQ.prompt}
          </h2>
        </div>

        {/* ==================================================== */}
        {/* CENTRAL VISUAL PRESENTATION STAGE                   */}
        {/* ==================================================== */}

        {/* 1. Countable Interactive Items Stage */}
        {currentQ.countableItems && currentQ.countableItems.length > 0 && (
          <div className="p-4 sm:p-6 bg-amber-50/80 rounded-2xl border-2 border-dashed border-amber-300 space-y-3">
            <div className="text-center text-xs sm:text-sm font-bold text-amber-900">
              👉 Tap each {currentQ.countableItems[0]?.illustration} to count! (Tapped:{' '}
              <span className="text-amber-700 font-extrabold">{tappedItemIds.length}</span> /{' '}
              {currentQ.countableItems.length})
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
              {currentQ.countableItems.map((item, idx) => {
                const isTapped = tappedItemIds.includes(item.id);
                const tapOrder = tappedItemIds.indexOf(item.id) + 1;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemCountTap(item.id, idx)}
                    className="relative group p-2 rounded-2xl bg-white shadow-md hover:shadow-lg border-2 border-amber-200 hover:border-amber-400 transition-transform active:scale-90 cursor-pointer"
                    title={`Tap to count ${item.name}`}
                  >
                    <ItemIllustration id={item.illustration} size="lg" showName={true} nameLang={isUrdu ? 'ur' : 'en'} />

                    {/* Number Stamp Popover */}
                    {isTapped && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 text-white font-extrabold text-base flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        {tapOrder}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Visual Addition Stage */}
        {currentQ.additionGroups && currentQ.additionGroups.length === 2 && (
          <div className="p-4 sm:p-6 bg-purple-50/80 rounded-2xl border-2 border-purple-200">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
              {/* Group 1 */}
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border-2 border-purple-200 shadow-sm">
                <div className="flex gap-1.5">
                  {Array.from({ length: currentQ.additionGroups[0].count }).map((_, i) => (
                    <ItemIllustration
                      key={`g1-${i}`}
                      id={currentQ.additionGroups![0].illustration}
                      size="md"
                    />
                  ))}
                </div>
                <span className="font-extrabold text-2xl text-purple-900 ml-2">
                  {currentQ.additionGroups[0].count}
                </span>
              </div>

              {/* Plus Sign */}
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-600">+</span>

              {/* Group 2 */}
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border-2 border-purple-200 shadow-sm">
                <div className="flex gap-1.5">
                  {Array.from({ length: currentQ.additionGroups[1].count }).map((_, i) => (
                    <ItemIllustration
                      key={`g2-${i}`}
                      id={currentQ.additionGroups![1].illustration}
                      size="md"
                    />
                  ))}
                </div>
                <span className="font-extrabold text-2xl text-purple-900 ml-2">
                  {currentQ.additionGroups[1].count}
                </span>
              </div>

              {/* Equals Sign */}
              <span className="text-3xl sm:text-4xl font-extrabold text-purple-600">=</span>

              {/* Question Box */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-300 border-4 border-amber-400 flex items-center justify-center font-extrabold text-3xl sm:text-4xl text-amber-950 shadow-md animate-pulse">
                ?
              </div>
            </div>
          </div>
        )}

        {/* 3. Featured Single Illustration */}
        {currentQ.featuredIllustration && !currentQ.countableItems && (
          <div className="flex justify-center py-2">
            <div
              onClick={() => {
                sounds.playPop();
                sounds.playCustomAudio(
                  getHardcodedAudio(currentQ.id) || currentCustomData?.customAudioUrl || currentQ.customAudioUrl,
                  currentQ.speechText,
                  currentQ.speechLang
                );
              }}
              className="group p-4 bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl border-4 border-amber-200 shadow-md hover:scale-105 transition-transform cursor-pointer"
              title="Tap to listen"
            >
              <ItemIllustration
                id={currentQ.featuredIllustration}
                customImageUrl={getHardcodedImage(currentQ.id) || currentCustomData?.customImageUrl || currentQ.customImageUrl}
                size="xl"
                showName={true}
                nameLang={isUrdu ? 'ur' : 'en'}
              />
            </div>
          </div>
        )}

        {/* 4. Featured Big Letter / Number Block */}
        {(currentQ.featuredLetter || currentQ.featuredNumber) && (
          <div className="flex justify-center py-2">
            <div
              onClick={() => {
                sounds.playPop();
                sounds.speak(
                  currentQ.featuredLetter
                    ? `Letter ${currentQ.featuredLetter}`
                    : `Number ${currentQ.featuredNumber}`,
                  currentQ.speechLang
                );
              }}
              className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center shadow-lg border-4 transition-transform hover:scale-105 active:scale-95 cursor-pointer select-none ${
                isUrdu
                  ? 'bg-rose-500 border-rose-600 text-white font-urdu text-6xl sm:text-7xl font-bold'
                  : 'bg-amber-400 border-amber-500 text-amber-950 text-5xl sm:text-6xl font-extrabold font-fun'
              }`}
            >
              <span>{currentQ.featuredLetter || currentQ.featuredNumber}</span>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* INTERACTIVE ANSWER OPTIONS (LARGE & TACTILE)         */}
        {/* ==================================================== */}
        <div className="space-y-3 pt-2">
          <div className="text-center text-xs font-bold text-slate-500">
            {isUrdu ? 'صحیح جواب پر ٹیپ کریں:' : 'Tap your answer:'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {currentQ.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;

              let buttonStyle =
                'bg-white border-4 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-md';

              if (isSelected && isCorrect) {
                buttonStyle =
                  'bg-emerald-50 border-4 border-emerald-500 ring-4 ring-emerald-200 shadow-xl scale-102';
              } else if (isSelected && !isCorrect) {
                buttonStyle =
                  'bg-rose-50 border-4 border-rose-400 ring-4 ring-rose-200 shadow-md';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id, isCorrect)}
                  className={`group relative p-4 sm:p-5 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer ${buttonStyle}`}
                >
                  {/* Rich Illustration if available */}
                  {option.illustration && (
                    <div className="p-2 transition-transform group-hover:scale-105 flex flex-col items-center">
                      <ItemIllustration
                        id={option.illustration}
                        customImageUrl={getHardcodedOptionImage(currentQ.id, option.id) || customMediaMap[option.id]?.customImageUrl || option.customImageUrl}
                        size="lg"
                        showName={true}
                        nameLang={isUrdu ? 'ur' : 'en'}
                      />
                    </div>
                  )}

                  {/* Count Visual Mini Group if available */}
                  {option.countVisual && (
                    <div className="flex flex-wrap items-center justify-center gap-1.5 p-2 bg-amber-50/80 rounded-2xl border border-amber-200 w-full min-h-[72px]">
                      {Array.from({ length: option.countVisual.count }).map((_, i) => (
                        <ItemIllustration
                          key={i}
                          id={option.countVisual!.itemId}
                          size="sm"
                        />
                      ))}
                    </div>
                  )}

                  {/* Option Label / Letter */}
                  {option.label && (
                    <span
                      className={`text-xl sm:text-2xl font-bold tracking-tight text-slate-900 ${
                        isUrdu ? 'font-urdu text-2xl sm:text-3xl' : ''
                      }`}
                    >
                      {option.label}
                    </span>
                  )}

                  {/* Sub-label Phonics / Romanization Hint */}
                  {option.subLabel && (
                    <span
                      className={`text-xs sm:text-sm font-semibold text-slate-500 ${
                        isUrdu ? 'font-urdu' : ''
                      }`}
                    >
                      {option.subLabel}
                    </span>
                  )}

                  {/* Success Badge checkmark */}
                  {isSelected && isCorrect && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}

                  {/* Gentle retry hint icon */}
                  {isSelected && !isCorrect && (
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-rose-500 text-white rounded-full p-1 shadow-md">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================== */}
        {/* ANSWER FEEDBACK CALLOUT                             */}
        {/* ==================================================== */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border-2 text-center transition-all ${
              isCorrectAnswer
                ? 'bg-emerald-100 border-emerald-300 text-emerald-950 shadow-md animate-bounce'
                : 'bg-amber-100 border-amber-300 text-amber-950 shadow-sm'
            }`}
          >
            {isCorrectAnswer ? (
              <div className="space-y-1">
                <span className={`text-xl sm:text-2xl font-extrabold ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? '🌟 شاباش ذہین! بہت خوب!' : '🌟 Super Job, Zaheen! Wonderful!'}
                </span>
                <p className="text-sm font-semibold opacity-90">
                  {isUrdu ? 'اگلے سوال کی طرف بڑھ رہے ہیں...' : 'Moving to the next question...'}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <span className={`text-lg sm:text-xl font-bold ${isUrdu ? 'font-urdu' : ''}`}>
                  {isUrdu ? 'کوئی بات نہیں، دوبارہ کوشش کریں! آپ کر سکتے ہیں!' : 'Oops, let\'s look closely! Try another card!'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Hint Section Toggle */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={() => {
              sounds.playPop();
              setShowHint(!showHint);
              if (!showHint) {
                sounds.speak(currentQ.hint, currentQ.speechLang);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-full border border-amber-300 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>{isUrdu ? 'مدد / اشارہ' : 'Need a Hint?'}</span>
          </button>

          {showHint && (
            <p className={`text-xs sm:text-sm font-semibold text-amber-900 max-w-sm text-right ${isUrdu ? 'font-urdu text-right' : ''}`}>
              💡 {isUrdu ? (currentQ.hintUrdu || currentQ.hint) : currentQ.hint}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
