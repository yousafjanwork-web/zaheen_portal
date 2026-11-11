/**
 * Zaheen - Kindergarten Learning & Quiz Portal
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SubjectHub } from './components/SubjectHub';
import { QuizPlayScreen } from './components/QuizPlayScreen';
import { RewardModal } from './components/RewardModal';
import { StickerBook } from './components/StickerBook';
import { ParentMediaStudio } from './components/ParentMediaStudio';
import {
  SubjectId,
  ActivityTypeId,
  STICKERS,
  StickerReward,
  QuizQuestion,
} from './data/quizData';
import {
  QuizTestStage,
  getTestStagesForSubject,
  getNextTestStage,
} from './data/quizStages';
import { CustomMediaItem, getAllCustomMedia } from './data/customMediaStorage';
import { sounds } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | SubjectId | 'quiz' | 'stickers'>('home');
  const [currentSubject, setCurrentSubject] = useState<SubjectId>('english');
  const [currentStage, setCurrentStage] = useState<QuizTestStage | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [quizRunId, setQuizRunId] = useState(0);

  // Custom Media Map (Voice recordings & uploaded photos)
  const [customMediaMap, setCustomMediaMap] = useState<Record<string, CustomMediaItem>>({});
  const [isMediaStudioOpen, setIsMediaStudioOpen] = useState(false);

  const refreshCustomMedia = async () => {
    try {
      const data = await getAllCustomMedia();
      setCustomMediaMap(data);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    refreshCustomMedia();
  }, []);

  // Persistent storage for stars and unlocked stickers
  const [totalStars, setTotalStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('zaheen_total_stars');
      return saved ? parseInt(saved, 10) : 5; // Start with 5 welcome stars for Zaheen
    } catch {
      return 5;
    }
  });

  // Track highest unlocked stage index by subject (0 = Test 1 unlocked, 1 = Test 2 unlocked, etc.)
  const [unlockedStageIndices, setUnlockedStageIndices] = useState<Record<SubjectId, number>>(() => {
    try {
      const saved = localStorage.getItem('zaheen_unlocked_stage_indices');
      return saved ? JSON.parse(saved) : { english: 0, urdu: 0, maths: 0 };
    } catch {
      return { english: 0, urdu: 0, maths: 0 };
    }
  });

  // Track completed stage IDs
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zaheen_completed_stage_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track earned stars per stage
  const [earnedStarsByStage, setEarnedStarsByStage] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('zaheen_stage_stars');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Teacher / evaluator mode to unlock all tests
  const [isUnlockAllActive, setIsUnlockAllActive] = useState(false);

  const [unlockedStickerIds, setUnlockedStickerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zaheen_stickers');
      return saved ? JSON.parse(saved) : ['stk-star', 'stk-bear'];
    } catch {
      return ['stk-star', 'stk-bear'];
    }
  });

  const [isMuted, setIsMuted] = useState(false);

  // Celebration Modal State
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [lastRoundScore, setLastRoundScore] = useState({ score: 5, total: 5 });
  const [newlyUnlockedSticker, setNewlyUnlockedSticker] = useState<StickerReward | null>(null);

  // Next stage reference for reward modal
  const [nextStageForModal, setNextStageForModal] = useState<QuizTestStage | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('zaheen_total_stars', totalStars.toString());
      localStorage.setItem('zaheen_unlocked_stage_indices', JSON.stringify(unlockedStageIndices));
      localStorage.setItem('zaheen_completed_stage_ids', JSON.stringify(completedStageIds));
      localStorage.setItem('zaheen_stage_stars', JSON.stringify(earnedStarsByStage));
      localStorage.setItem('zaheen_stickers', JSON.stringify(unlockedStickerIds));
    } catch {
      // Storage fallback
    }
  }, [totalStars, unlockedStageIndices, completedStageIds, earnedStarsByStage, unlockedStickerIds]);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.isMuted = nextMute;
  };

  // Launch a specific progressive test stage (5 letters or numbers!)
  const handleLaunchStage = (stage: QuizTestStage) => {
    sounds.playPop();
    setCurrentStage(stage);
    setCurrentSubject(stage.subject);
    setActiveQuestions(stage.questions);
    setQuizRunId((n) => n + 1);
    setCurrentView('quiz');
  };

  // Launch first test of a subject directly
  const handleLaunchFirstStageOfSubject = (subj: SubjectId) => {
    const stages = getTestStagesForSubject(subj);
    const highestIdx = unlockedStageIndices[subj] || 0;
    const targetStage = stages[highestIdx] || stages[0];
    if (targetStage) {
      handleLaunchStage(targetStage);
    }
  };

  // Select Subject Hub
  const handleSelectSubject = (subj: SubjectId) => {
    sounds.playPop();
    setCurrentSubject(subj);
    setCurrentView(subj);
  };

  // Round completed
  const handleCompleteRound = (score: number, total: number) => {
    setLastRoundScore({ score, total });
    setTotalStars((prev) => prev + score);

    if (currentStage) {
      // Update earned stars for this stage
      setEarnedStarsByStage((prev) => ({
        ...prev,
        [currentStage.id]: Math.max(prev[currentStage.id] || 0, score),
      }));

      // Mark stage as completed
      setCompletedStageIds((prev) =>
        prev.includes(currentStage.id) ? prev : [...prev, currentStage.id]
      );

      // Unlock the next test stage in the sequence!
      const nextIndex = currentStage.stageNumber; // stageNumber is 1-based, which becomes the next 0-based index
      setUnlockedStageIndices((prev) => ({
        ...prev,
        [currentSubject]: Math.max(prev[currentSubject] || 0, nextIndex),
      }));

      // Calculate next stage for instant next test launch button
      const nextStage = getNextTestStage(currentStage.id);
      setNextStageForModal(nextStage);
    }

    // Unlock new sticker based on achievements
    let stickerToUnlock: StickerReward | null = null;

    if (currentSubject === 'english' && !unlockedStickerIds.includes('stk-abc')) {
      stickerToUnlock = STICKERS.find((s) => s.id === 'stk-abc') || null;
    } else if (currentSubject === 'urdu' && !unlockedStickerIds.includes('stk-titli')) {
      stickerToUnlock = STICKERS.find((s) => s.id === 'stk-titli') || null;
    } else if (currentSubject === 'maths' && !unlockedStickerIds.includes('stk-count')) {
      stickerToUnlock = STICKERS.find((s) => s.id === 'stk-count') || null;
    } else if (score >= total && !unlockedStickerIds.includes('stk-trophy')) {
      stickerToUnlock = STICKERS.find((s) => s.id === 'stk-trophy') || null;
    }

    if (stickerToUnlock) {
      setNewlyUnlockedSticker(stickerToUnlock);
      setUnlockedStickerIds((prev) => [...prev, stickerToUnlock!.id]);
    } else {
      setNewlyUnlockedSticker(null);
    }

    setRewardModalOpen(true);
  };

  // Replay current test stage
  const handlePlayAgain = () => {
    setRewardModalOpen(false);
    if (currentStage) {
      handleLaunchStage(currentStage);
    }
  };

  // Start next test stage directly from celebration modal
  const handleStartNextTest = () => {
    setRewardModalOpen(false);
    if (nextStageForModal) {
      handleLaunchStage(nextStageForModal);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 flex flex-col font-fun selection:bg-amber-200">

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {currentView === 'home' && (
          <HomeScreen
            onSelectSubject={handleSelectSubject}
            onLaunchActivity={(actId) => {
              if (actId.startsWith('ur-')) handleLaunchFirstStageOfSubject('urdu');
              else if (actId.startsWith('math-')) handleLaunchFirstStageOfSubject('maths');
              else handleLaunchFirstStageOfSubject('english');
            }}
            onViewStickers={() => {
              sounds.playPop();
              setCurrentView('stickers');
            }}
            onOpenMediaStudio={() => setIsMediaStudioOpen(true)}
            totalStars={totalStars}
          />
        )}

        {(currentView === 'english' || currentView === 'urdu' || currentView === 'maths') && (
          <SubjectHub
            subject={currentView}
            onBack={() => setCurrentView('home')}
            onLaunchStage={handleLaunchStage}
            unlockedStageIndices={unlockedStageIndices}
            completedStageIds={completedStageIds}
            earnedStarsByStage={earnedStarsByStage}
            isUnlockAllActive={isUnlockAllActive}
            onToggleUnlockAll={() => setIsUnlockAllActive((prev) => !prev)}
          />
        )}

        {currentView === 'quiz' && (
          <QuizPlayScreen
            key={quizRunId}
            questions={activeQuestions}
            stageTitle={currentStage?.title}
            stageTitleUrdu={currentStage?.titleUrdu}
            customMediaMap={customMediaMap}
            onCompleteRound={handleCompleteRound}
            onExit={() => setCurrentView(currentSubject)}
          />
        )}

        {currentView === 'stickers' && (
          <StickerBook
            unlockedStickerIds={unlockedStickerIds}
            totalStars={totalStars}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Parent & Teacher Media Studio Modal */}
      {false && isMediaStudioOpen && (
        <ParentMediaStudio
          customMediaMap={customMediaMap}
          onMediaUpdated={refreshCustomMedia}
          onClose={() => setIsMediaStudioOpen(false)}
        />
      )}

      {/* Victory Celebration Reward Modal with Instant "Next Test" button */}
      {rewardModalOpen && (
        <RewardModal
          score={lastRoundScore.score}
          total={lastRoundScore.total}
          completedStageTitle={currentStage?.title}
          completedStageTitleUrdu={currentStage?.titleUrdu}
          nextStageTitle={nextStageForModal?.title}
          nextStageTitleUrdu={nextStageForModal?.titleUrdu}
          unlockedSticker={newlyUnlockedSticker}
          isUrduSubject={currentSubject === 'urdu'}
          onPlayAgain={handlePlayAgain}
          onStartNextTest={nextStageForModal ? handleStartNextTest : undefined}
          onChooseAnother={() => {
            setRewardModalOpen(false);
            setCurrentView(currentSubject);
          }}
          onViewStickers={() => {
            setRewardModalOpen(false);
            setCurrentView('stickers');
          }}
        />
      )}

      {/* Quiet Footer */}
      <footer className="hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Zaheen Kindergarten Quiz Portal</span>
            <span>·</span>
            <span>English · اردو · Maths</span>
          </div>
          <div>Step-by-step 5-letter progressive tests 🌟</div>
        </div>
      </footer>
    </div>
  );
}
