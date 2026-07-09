import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLessonsData } from "../context/LessonsContext";
import XPCelebration from "../components/XPCelebration";
import Mascot from "../components/Mascot";
import SpeakButton from "../components/SpeakButton";
import { speech, SpeechManager } from "../utils/speech";
import {
  Play,
  Check,
  X as XIcon,
  ArrowRight,
  ArrowLeft,
  Star,
  Sparkles,
  Clock,
  BookOpen,
  Trophy,
  Send,
} from "lucide-react";

type Step =
  | "intro"
  | "video"
  | "words"
  | "activity"
  | "quiz"
  | "challenge"
  | "complete";

export default function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const {
    addXP,
    addCoins,
    markLessonComplete,
    addWordsLearned,
    saveQuizScore,
    saveChallengeResponse,
    addToCollection,
    updateQuestProgress,
    updateChallengeProgress,
  } = useAuth();
  const { getLessonById, isLoading: lessonsLoading, error: lessonsError } = useLessonsData();
  const lesson = getLessonById(lessonId || "");

  const [step, setStep] = useState<Step>("intro");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [activityAnswers, setActivityAnswers] = useState<
    Record<string, string>
  >({});
  const [activitySubmitted, setActivitySubmitted] = useState(false);
  const [activityScore, setActivityScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [challengeText, setChallengeText] = useState("");
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);
  const [xpCelebration, setXpCelebration] = useState<{
    xp: number;
    reason: string;
  } | null>(null);

  // Mascot state
  const [mascotMessage, setMascotMessage] = useState("");
  const [mascotEmotion, setMascotEmotion] = useState<
    | "happy"
    | "excited"
    | "thinking"
    | "celebrating"
    | "encouraging"
    | "sleeping"
  >("happy");
  const [mascotAutoSpeak, setMascotAutoSpeak] = useState(true);
  const [mascotDismissed, setMascotDismissed] = useState(false);

  // NOTE ON HOOK ORDER: `lesson` now comes from an API fetch instead
  // of a static in-memory array, so it can legitimately be undefined
  // on the very first render (while the fetch is still in flight),
  // not just when the lessonId is wrong. All hooks below MUST stay
  // above any conditional `return` — each effect below guards itself
  // internally with `if (!lesson) return;` instead. Previously the
  // "lesson not found" return sat ABOVE these useEffects, which meant
  // React called a different number of hooks on the loading render
  // vs. the loaded render — that mismatch is what caused the crash
  // mentioned in this module's known issues. Keep the guard clauses
  // for "loading" / "not found" AFTER this hook block, not before it.

  // Update mascot messages based on step
  useEffect(() => {
    if (!lesson || mascotDismissed) return;

    const messages: Record<Step, string> = {
      intro: `Hi there! 🤖 Welcome to "${lesson.title}"! I'm Sparky, your learning buddy! We have ${lesson.words.length} amazing new words to learn today. Ready? Let's go!`,
      video: `Watch the video carefully! 🎬 It will help you understand today's words much better!`,
      words: `Let's learn the word "${lesson.words[currentWordIndex]?.word}"! ${lesson.words[currentWordIndex]?.funFact || ""}`,
      activity: `Great job learning all the words! Now let's test your memory with a fun activity. ${lesson.activity.instructions}`,
      quiz: `You're doing amazing! Time for the quiz! Don't worry, you've got this! Just pick the best answer.`,
      challenge: `Almost done! Now it's time to be creative! Use the words you learned to write something wonderful!`,
      complete: `🎉 Congratulations! You completed "${lesson.title}"! I'm so proud of you! You earned tons of XP today!`,
    };

    setMascotMessage(messages[step]);

    const emotions: Record<
      Step,
      "happy" | "excited" | "thinking" | "celebrating" | "encouraging"
    > = {
      intro: "excited",
      video: "happy",
      words: "happy",
      activity: "thinking",
      quiz: "encouraging",
      challenge: "thinking",
      complete: "celebrating",
    };
    setMascotEmotion(emotions[step]);
  }, [step, currentWordIndex, lesson]);

  // Speak on word change (only during words step)
  useEffect(() => {
    if (!lesson) return;
    const currentWord = lesson.words[currentWordIndex];
    if (step === "words" && mascotAutoSpeak && currentWord && SpeechManager.isAvailable()) {
      setMascotMessage(
        `Let's learn the word "${currentWord.word}"! ${currentWord.funFact || ""}`,
      );
    }
  }, [currentWordIndex, step, lesson]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      speech.cancel();
    };
  }, []);

  // Reset word index when entering words step
  useEffect(() => {
    if (step === "words") {
      setCurrentWordIndex(0);
    }
  }, [step]);

  if (lessonsLoading) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        Loading lesson…
      </div>
    );
  }

  if (lessonsError) {
    return (
      <div className="text-center py-20 text-rose-500">{lessonsError}</div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Lesson not found
        </h2>
        <Link
          to="/vocab/courses"
          className="mt-4 inline-flex items-center gap-2 text-violet-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
      </div>
    );
  }

  const currentWord = lesson.words[currentWordIndex];

  const handleVideoComplete = () => {
    addXP(lesson.xpRewards.video, "Watched video lesson");
    setXpCelebration({
      xp: lesson.xpRewards.video,
      reason: "Video completed! 🎬",
    });
    setTimeout(() => setStep("activity"), 1500);
  };

  const handleActivitySubmit = () => {
    let correct = 0;
    lesson.activity.questions.forEach((q) => {
      if (activityAnswers[q.id] === q.correctAnswer) correct++;
    });
    const score = Math.round(
      (correct / lesson.activity.questions.length) * 100,
    );
    setActivityScore(score);
    setActivitySubmitted(true);
    addXP(lesson.xpRewards.activity, "Completed activity");
    addCoins(5);
    updateQuestProgress("q-daily-1", 1);
    updateChallengeProgress(
      `dc-${new Date().toISOString().split("T")[0]}-2`,
      score >= 100 ? 1 : 0,
    );
    setXpCelebration({
      xp: lesson.xpRewards.activity,
      reason: "Activity completed! 🎮",
    });

    if (score >= 80) setMascotEmotion("celebrating");
    else if (score >= 60) setMascotEmotion("happy");
    else setMascotEmotion("encouraging");

    setTimeout(() => setStep("quiz"), 2500);
  };

  const handleQuizSubmit = () => {
    let correct = 0;
    lesson.quiz.questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / lesson.quiz.questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    saveQuizScore(lesson.id, score);
    addXP(lesson.xpRewards.quiz, "Quiz completed!");
    addCoins(10);
    updateQuestProgress("q-daily-3", score >= 80 ? 1 : 0);
    lesson.words.forEach((w) =>
      addToCollection({
        id: w.id,
        word: w.word,
        theme: lesson.theme,
        emoji: w.imageUrl,
        definition: w.definition,
      }),
    );
    setXpCelebration({
      xp: lesson.xpRewards.quiz,
      reason: "Quiz completed! 📝",
    });

    if (score >= 80) {
      setMascotEmotion("celebrating");
      setMascotMessage(`Wow! You scored ${score}%! That's incredible! 🌟`);
    } else if (score >= 60) {
      setMascotEmotion("happy");
      setMascotMessage(
        `Great effort! You scored ${score}%! Let's move to the writing challenge!`,
      );
    } else {
      setMascotEmotion("encouraging");
      setMascotMessage(
        `You scored ${score}%. Don't worry, keep practicing! Now let's do the creative writing challenge!`,
      );
    }

    setTimeout(() => setStep("challenge"), 2500);
  };

  const handleChallengeSubmit = () => {
    const wordCount = challengeText.split(/\s+/).filter(Boolean).length;
    const usedWords = lesson.words.filter((w) =>
      challengeText.toLowerCase().includes(w.word.toLowerCase()),
    ).length;
    const vocabScore = Math.min((usedWords / lesson.words.length) * 40, 40);
    const creativityScore = Math.min((wordCount / 50) * 35, 35);
    const grammarScore = wordCount > 10 ? 25 : 15;
    const total = Math.round(vocabScore + creativityScore + grammarScore);

    setChallengeScore(total);
    setChallengeSubmitted(true);
    saveChallengeResponse(
      lesson.id,
      challengeText,
      total,
      generateFeedback(total, usedWords),
    );
    addXP(lesson.xpRewards.challenge, "Challenge completed!");
    setXpCelebration({
      xp: lesson.xpRewards.challenge,
      reason: "Challenge completed! ✍️",
    });

    markLessonComplete(lesson.id, {
      score: Math.round((activityScore + quizScore + total) / 3),
      xpEarned:
        lesson.xpRewards.video +
        lesson.xpRewards.activity +
        lesson.xpRewards.quiz +
        lesson.xpRewards.challenge,
      wordsCount: lesson.words.length,
    });
    addWordsLearned(lesson.words.map((w) => w.id));
    addCoins(15);
    updateQuestProgress("q-weekly-1", 1);
    updateQuestProgress("q-weekly-2", lesson.words.length);
    setTimeout(() => setStep("complete"), 2000);
  };

  const generateFeedback = (score: number, wordsUsed: number): string => {
    if (score >= 90)
      return `🌟 Outstanding! You used ${wordsUsed} vocabulary words creatively. Your writing is fantastic!`;
    if (score >= 70)
      return `👏 Great job! You used ${wordsUsed} vocabulary words. Try to add more descriptive details next time.`;
    if (score >= 50)
      return `👍 Good effort! You used ${wordsUsed} vocabulary words. Keep practicing to improve your sentences.`;
    return `💪 Nice try! You used ${wordsUsed} words. Try writing longer sentences with more vocabulary words.`;
  };

  // Progress bar uses 6 visual steps (intro, video, words, activity, quiz, challenge, complete)
  const steps: Step[] = [
    "intro",
    "video",
    "words",
    "activity",
    "quiz",
    "challenge",
    "complete",
  ];
  const progressLabels = [
    "Intro",
    "Video",
    "Words",
    "Activity",
    "Quiz",
    "Challenge",
    "Done",
  ];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* XP Celebration Modal */}
      {xpCelebration && (
        <XPCelebration
          xp={xpCelebration.xp}
          reason={xpCelebration.reason}
          onClose={() => setXpCelebration(null)}
        />
      )}

      {/* Mascot */}
      {!mascotDismissed && (
        <Mascot
          message={mascotMessage}
          emotion={mascotEmotion}
          autoSpeak={mascotAutoSpeak}
          position="bottom-right"
          size="md"
          showDismiss
          onDismiss={() => setMascotDismissed(true)}
        />
      )}

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 dark:text-white">
              {lesson.title}
            </h2>
            <span className="text-2xl">{lesson.words[0].imageUrl}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMascotAutoSpeak(!mascotAutoSpeak)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                mascotAutoSpeak
                  ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-500"
              }`}
            >
              🔊 Auto-speak {mascotAutoSpeak ? "ON" : "OFF"}
            </button>
            {mascotDismissed && (
              <button
                onClick={() => setMascotDismissed(false)}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
              >
                🤖 Show Sparky
              </button>
            )}
            <span className="text-sm text-slate-500">
              {currentStepIndex}/{steps.length - 1}
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {progressLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div
                className={`h-2 rounded-full transition-all ${
                  i < currentStepIndex
                    ? "bg-emerald-500"
                    : i === currentStepIndex
                      ? "bg-violet-500"
                      : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block text-center">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────
            STEP 1: INTRO
        ───────────────────────────────────────── */}
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl mb-4"
            >
              {lesson.words[0].imageUrl}
            </motion.div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
              {lesson.title}
              <SpeakButton
                text={`${lesson.title}. ${lesson.theme} theme. We will learn ${lesson.words.length} new vocabulary words today.`}
                type="generic"
                size="md"
              />
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Theme:{" "}
              <span className="font-semibold text-violet-600">
                {lesson.theme}
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {lesson.words.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-1 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 rounded-full"
                >
                  <span className="text-violet-700 dark:text-violet-300 text-sm font-medium">
                    {w.word}
                  </span>
                  <SpeakButton
                    text={w.word}
                    type="word"
                    word={w.word}
                    pronunciation={w.pronunciation}
                    size="xs"
                    autoColor={false}
                    className="!rounded-full !w-5 !h-5 bg-violet-200/50 dark:bg-violet-700/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500 mb-6">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> ~10 min
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500" /> 70 XP
              </span>
            </div>
            <button
              onClick={() => setStep("video")}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-violet-200 dark:shadow-violet-900/30"
            >
              <Play className="w-5 h-5 inline mr-2" /> Start Learning with
              Sparky 🤖
            </button>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────
            STEP 2: VIDEO (CDN video plays here)
        ───────────────────────────────────────── */}
        {step === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-violet-500" />
                Watch the lesson video! 🎬
              </h3>

              {/* CDN mp4 video */}
              {lesson.videoUrl && !lesson.videoUrl.includes("youtube") ? (
                <div className="rounded-2xl overflow-hidden bg-black mb-4">
                  <video
                    key={lesson.videoUrl}
                    src={lesson.videoUrl}
                    controls
                    autoPlay
                    className="w-full max-h-[400px] object-contain"
                    onEnded={() => setStep("words")}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                /* YouTube embed fallback */
                <div
                  className="rounded-2xl overflow-hidden mb-4"
                  style={{ aspectRatio: "16/9" }}
                >
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                  />
                </div>
              )}

              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  💡 Watch the full video, then we'll explore the words!
                </p>
                <button
                  onClick={() => setStep("words")}
                  className="px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-colors"
                >
                  Skip video →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────
            STEP 3: WORD CARDS (one by one)
        ───────────────────────────────────────── */}
        {step === "words" && (
          <motion.div
            key="words"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700/50 overflow-hidden"
          >
            <div className="p-6">
              {/* Word Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                    Word {currentWordIndex + 1} of {lesson.words.length}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                      {currentWord.word}
                    </span>
                    <SpeakButton
                      text={currentWord.word}
                      type="word"
                      word={currentWord.word}
                      pronunciation={currentWord.pronunciation}
                      size="md"
                      label={`Listen to "${currentWord.word}"`}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium">
                    {currentWord.partOfSpeech}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Visual */}
                <div className="space-y-4">
                  <motion.div
                    key={currentWord.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      className="text-9xl mb-3"
                      animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {currentWord.imageUrl}
                    </motion.div>
                    <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {currentWord.word}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <p className="text-sm text-slate-500 italic">
                        /{currentWord.pronunciation}/
                      </p>
                      <SpeakButton
                        text={currentWord.pronunciation}
                        type="sentence"
                        size="xs"
                        label="Hear pronunciation"
                      />
                    </div>
                  </motion.div>

                  {/* Definition */}
                  <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-violet-700 dark:text-violet-300 text-sm">
                        📖 Definition
                      </p>
                      <SpeakButton
                        text={currentWord.definition}
                        type="definition"
                        word={currentWord.word}
                        size="xs"
                        label="Listen to definition"
                      />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {currentWord.definition}
                    </p>
                    {currentWord.urduDefinition && (
                      <p
                        dir="rtl"
                        lang="ur"
                        className="text-slate-600 dark:text-slate-400 mt-1.5 pt-1.5 border-t border-violet-100 dark:border-violet-800/40"
                        style={{
                          fontFamily: "'Noto Nastaliq Urdu', serif",
                          lineHeight: 1.9,
                        }}
                      >
                        {currentWord.urduDefinition}
                      </p>
                    )}
                  </div>

                  {/* Fun Fact */}
                  {currentWord.funFact && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                          💡 Fun Fact
                        </p>
                        <SpeakButton
                          text={currentWord.funFact}
                          type="sentence"
                          size="xs"
                          label="Listen to fun fact"
                        />
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                        {currentWord.funFact}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column - Details */}
                <div className="space-y-3">
                  {/* Example Sentence */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        💬 Example Sentence
                      </p>
                      <SpeakButton
                        text={currentWord.exampleSentence}
                        type="example"
                        size="xs"
                        label="Listen to example"
                      />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic">
                      "{currentWord.exampleSentence}"
                    </p>
                  </div>

                  {/* Synonyms */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-emerald-600 text-sm">
                        ✅ Synonyms (similar words)
                      </p>
                      <SpeakButton
                        text={`Synonyms of ${currentWord.word}: ${currentWord.synonyms.join(", ")}`}
                        type="sentence"
                        size="xs"
                        label="Listen to synonyms"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentWord.synonyms.map((s) => (
                        <div key={s} className="flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                            {s}
                          </span>
                          <SpeakButton
                            text={s}
                            type="word"
                            size="xs"
                            autoColor={false}
                            className="!w-5 !h-5 !rounded-full text-emerald-600 hover:bg-emerald-100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Antonyms */}
                  {currentWord.antonyms.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-red-500 text-sm">
                          ❌ Antonyms (opposite words)
                        </p>
                        <SpeakButton
                          text={`Antonyms of ${currentWord.word}: ${currentWord.antonyms.join(", ")}`}
                          type="sentence"
                          size="xs"
                          label="Listen to antonyms"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {currentWord.antonyms.map((a) => (
                          <div key={a} className="flex items-center gap-1">
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium">
                              {a}
                            </span>
                            <SpeakButton
                              text={a}
                              type="word"
                              size="xs"
                              autoColor={false}
                              className="!w-5 !h-5 !rounded-full text-red-500 hover:bg-red-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hear Everything Button */}
                  <button
                    onClick={async () => {
                      if (!SpeechManager.isAvailable()) return;
                      setMascotEmotion("happy");
                      setMascotMessage(
                        `Let me tell you everything about "${currentWord.word}"!`,
                      );
                      await speech.speak(
                        `The word is ${currentWord.word}. ${currentWord.pronunciation}. It means: ${currentWord.definition}. For example: ${currentWord.exampleSentence}. Some similar words are: ${currentWord.synonyms.join(", ")}.`,
                        { rate: 0.8, pitch: 1.2 },
                      );
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium hover:from-violet-200 hover:to-indigo-200 transition-all flex items-center justify-center gap-2"
                  >
                    🔊 Hear Everything About This Word
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    speech.cancel();
                    if (currentWordIndex === 0) {
                      setStep("video"); // go back to video
                    } else {
                      setCurrentWordIndex(currentWordIndex - 1);
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {currentWordIndex === 0 ? "Rewatch Video" : "Previous"}
                </button>

                {/* Word dots */}
                <div className="flex items-center gap-2">
                  {lesson.words.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        speech.cancel();
                        setCurrentWordIndex(i);
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i === currentWordIndex
                          ? "bg-violet-500 scale-125"
                          : i < currentWordIndex
                            ? "bg-emerald-400"
                            : "bg-slate-300 dark:bg-slate-600"
                      }`}
                    />
                  ))}
                </div>

                {currentWordIndex < lesson.words.length - 1 ? (
                  <button
                    onClick={() => {
                      speech.cancel();
                      setCurrentWordIndex(currentWordIndex + 1);
                    }}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-200 transition-colors flex items-center gap-1"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      speech.cancel();
                      handleVideoComplete();
                    }}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:scale-105 shadow-lg shadow-emerald-200 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> I've Learned These! 🎉
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────
            STEP 4: ACTIVITY
        ───────────────────────────────────────── */}
        {step === "activity" && (
          <motion.div
            key="activity"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />{" "}
                {lesson.activity.title}
              </h3>
              <SpeakButton
                text={`${lesson.activity.title}. ${lesson.activity.instructions}`}
                type="generic"
                size="md"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {lesson.activity.instructions}
            </p>

            <div className="space-y-6">
              {lesson.activity.questions.map((q, qi) => (
                <div
                  key={q.id}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-bold">
                      {qi + 1}
                    </span>
                    <p className="font-medium text-slate-700 dark:text-slate-300 flex-1">
                      {q.prompt}
                    </p>
                    <SpeakButton text={q.prompt} type="sentence" size="xs" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 ml-9">
                    {q.options.map((opt) => {
                      const isSelected = activityAnswers[q.id] === opt;
                      const isCorrect =
                        activitySubmitted && opt === q.correctAnswer;
                      const isWrong =
                        activitySubmitted &&
                        isSelected &&
                        opt !== q.correctAnswer;
                      return (
                        <button
                          key={opt}
                          onClick={() => {
                            if (!activitySubmitted) {
                              setActivityAnswers((prev) => ({
                                ...prev,
                                [q.id]: opt,
                              }));
                              if (
                                mascotAutoSpeak &&
                                SpeechManager.isAvailable()
                              ) {
                                speech.speak(opt, { rate: 0.9, pitch: 1.2 });
                              }
                            }
                          }}
                          disabled={activitySubmitted}
                          className={`p-3 rounded-xl text-sm font-medium transition-all border-2 flex items-center gap-2 ${
                            isCorrect
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700"
                              : isWrong
                                ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600"
                                : isSelected
                                  ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700"
                                  : "border-slate-200 dark:border-slate-600 hover:border-violet-300 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <span className="flex-1">{opt}</span>
                          {isCorrect && (
                            <Check className="w-4 h-4 text-emerald-500" />
                          )}
                          {isWrong && (
                            <XIcon className="w-4 h-4 text-red-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {activitySubmitted ? (
              <div className="mt-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                >
                  Score: {activityScore}%{" "}
                  {activityScore >= 80
                    ? "⭐"
                    : activityScore >= 60
                      ? "👍"
                      : "💪"}
                </motion.div>
                <p className="text-sm text-slate-500 mt-1">Moving to quiz...</p>
              </div>
            ) : (
              <button
                onClick={handleActivitySubmit}
                disabled={
                  Object.keys(activityAnswers).length <
                  lesson.activity.questions.length
                }
                className="mt-6 w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Answers
              </button>
            )}
          </motion.div>
        )}

        {/* ─────────────────────────────────────────
            STEP 5: QUIZ
        ───────────────────────────────────────── */}
        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />{" "}
                {lesson.quiz.title}
              </h3>
              <SpeakButton text={lesson.quiz.title} type="generic" size="md" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {lesson.quiz.questions.length} questions • Pass score:{" "}
              {lesson.quiz.passingScore}%
            </p>

            <div className="space-y-5">
              {lesson.quiz.questions.map((q, qi) => {
                const isCorrect =
                  quizSubmitted && quizAnswers[q.id] === q.correctAnswer;
                const isWrong =
                  quizSubmitted &&
                  quizAnswers[q.id] &&
                  quizAnswers[q.id] !== q.correctAnswer;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      quizSubmitted
                        ? isCorrect
                          ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-900/10"
                          : isWrong
                            ? "border-red-300 bg-red-50/50 dark:bg-red-900/10"
                            : "border-slate-200 dark:border-slate-700"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          quizSubmitted
                            ? isCorrect
                              ? "bg-emerald-500 text-white"
                              : isWrong
                                ? "bg-red-500 text-white"
                                : "bg-slate-200 text-slate-500"
                            : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                        }`}
                      >
                        {quizSubmitted ? (isCorrect ? "✓" : "✗") : qi + 1}
                      </span>
                      <p className="font-medium text-slate-700 dark:text-slate-300 flex-1">
                        {q.question}
                      </p>
                      <SpeakButton
                        text={q.question}
                        type="sentence"
                        size="xs"
                        label="Read question aloud"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-8">
                      {q.options.map((opt) => {
                        const selected = quizAnswers[q.id] === opt;
                        const showCorrect =
                          quizSubmitted && opt === q.correctAnswer;
                        return (
                          <button
                            key={opt}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt,
                                }));
                                if (
                                  mascotAutoSpeak &&
                                  SpeechManager.isAvailable()
                                ) {
                                  speech.speak(opt, { rate: 0.9, pitch: 1.2 });
                                }
                              }
                            }}
                            disabled={quizSubmitted}
                            className={`p-2.5 rounded-xl text-sm font-medium transition-all border-2 text-left flex items-center gap-2 ${
                              showCorrect
                                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700"
                                : selected && !quizSubmitted
                                  ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700"
                                  : selected && quizSubmitted && !showCorrect
                                    ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600"
                                    : "border-slate-200 dark:border-slate-600 hover:border-violet-300 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span className="flex-1">{opt}</span>
                            {showCorrect && (
                              <Check className="w-4 h-4 text-emerald-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && !isCorrect && (
                      <div className="ml-8 mt-2 flex items-center gap-2">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          ✓ Correct: {q.correctAnswer}
                        </p>
                        <SpeakButton
                          text={`The correct answer is: ${q.correctAnswer}`}
                          type="sentence"
                          size="xs"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {quizSubmitted ? (
              <div className="mt-6 text-center bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                <div
                  className={`text-3xl font-bold ${quizScore >= lesson.quiz.passingScore ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {quizScore}%
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {quizScore >= 80
                    ? "🌟 Excellent!"
                    : quizScore >= 60
                      ? "👍 Good job!"
                      : "💪 Keep practicing!"}
                </p>
                <p className="text-sm text-slate-500">Moving to challenge...</p>
              </div>
            ) : (
              <button
                onClick={handleQuizSubmit}
                disabled={
                  Object.keys(quizAnswers).length < lesson.quiz.questions.length
                }
                className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" /> Submit Quiz
              </button>
            )}
          </motion.div>
        )}

        {/* ─────────────────────────────────────────
            STEP 6: CHALLENGE
        ───────────────────────────────────────── */}
        {step === "challenge" && (
          <motion.div
            key="challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-500" />{" "}
                {lesson.challenge.title}
              </h3>
              <SpeakButton
                text={`${lesson.challenge.title}. ${lesson.challenge.instructions}. Use words like: ${lesson.words.map((w) => w.word).join(", ")}`}
                type="generic"
                size="md"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-2">
              {lesson.challenge.instructions}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {lesson.words.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center gap-1 px-2 py-1 bg-violet-50 dark:bg-violet-900/20 rounded-lg"
                >
                  <span className="text-violet-700 dark:text-violet-300 text-xs font-medium">
                    {w.word}
                  </span>
                  <SpeakButton
                    text={w.word}
                    type="word"
                    word={w.word}
                    pronunciation={w.pronunciation}
                    size="xs"
                    autoColor={false}
                    className="!w-5 !h-5 !rounded-full"
                  />
                </div>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                disabled={challengeSubmitted}
                placeholder="Type your response here... Be creative! 🌟"
                rows={6}
                className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 outline-none transition-all resize-none disabled:opacity-60"
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {challengeText.split(/\s+/).filter(Boolean).length} words
                </span>
                {challengeText.trim().length > 0 && (
                  <SpeakButton
                    text={challengeText}
                    type="sentence"
                    size="xs"
                    label="Hear what you wrote"
                  />
                )}
              </div>
            </div>

            {!challengeSubmitted && challengeText.length > 0 && (
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">
                  Words used:
                </span>
                {lesson.words.map((w) => {
                  const used = challengeText
                    .toLowerCase()
                    .includes(w.word.toLowerCase());
                  return (
                    <span
                      key={w.id}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                        used
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-400"
                      }`}
                    >
                      {used ? "✓" : "○"} {w.word}
                    </span>
                  );
                })}
              </div>
            )}

            {challengeSubmitted && (
              <div className="mt-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-slate-800 dark:text-white">
                    AI Feedback
                  </span>
                  <SpeakButton
                    text={generateFeedback(challengeScore, 0)}
                    type="generic"
                    size="xs"
                    label="Hear feedback"
                  />
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-3">
                  {generateFeedback(challengeScore, 0)}
                </p>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Vocabulary: </span>
                    <span className="font-bold text-violet-600">
                      {Math.round(
                        lesson.challenge.evaluationCriteria.vocabularyUsage *
                          (challengeScore / 100),
                      )}
                      /{lesson.challenge.evaluationCriteria.vocabularyUsage}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Creativity: </span>
                    <span className="font-bold text-amber-600">
                      {Math.round(
                        lesson.challenge.evaluationCriteria.creativity *
                          (challengeScore / 100),
                      )}
                      /{lesson.challenge.evaluationCriteria.creativity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Grammar: </span>
                    <span className="font-bold text-emerald-600">
                      {Math.round(
                        lesson.challenge.evaluationCriteria.grammar *
                          (challengeScore / 100),
                      )}
                      /{lesson.challenge.evaluationCriteria.grammar}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-2xl font-bold text-rose-600 dark:text-rose-400">
                  Score: {challengeScore}%
                </div>
              </div>
            )}

            {!challengeSubmitted && (
              <button
                onClick={handleChallengeSubmit}
                disabled={challengeText.trim().length < 10}
                className="mt-4 w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl font-bold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Challenge
              </button>
            )}
          </motion.div>
        )}

        {/* ─────────────────────────────────────────
            STEP 7: COMPLETE
        ───────────────────────────────────────── */}
        {step === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700/50 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
              Lesson Complete!
              <SpeakButton
                text={`Congratulations! You completed ${lesson.title}! You learned ${lesson.words.length} new words and earned lots of XP. Amazing job!`}
                type="generic"
                size="lg"
              />
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Amazing job! You've completed "{lesson.title}" and earned XP!
            </p>

            <div className="mb-6 bg-violet-50 dark:bg-violet-900/20 rounded-2xl p-4">
              <h3 className="font-bold text-violet-700 dark:text-violet-300 mb-3">
                📚 Words You Learned Today
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {lesson.words.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-violet-200 dark:border-violet-700"
                  >
                    <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                      {w.word}
                    </span>
                    <span className="text-xs text-slate-500">
                      — {w.definition.slice(0, 30)}...
                    </span>
                    <SpeakButton
                      text={`${w.word}. ${w.definition}`}
                      type="generic"
                      size="xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "Video", xp: lesson.xpRewards.video, icon: "📺" },
                {
                  label: "Activity",
                  xp: lesson.xpRewards.activity,
                  icon: "🎮",
                  score: activityScore,
                },
                {
                  label: "Quiz",
                  xp: lesson.xpRewards.quiz,
                  icon: "📝",
                  score: quizScore,
                },
                {
                  label: "Challenge",
                  xp: lesson.xpRewards.challenge,
                  icon: "✍️",
                  score: challengeScore,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold text-violet-600 dark:text-violet-400">
                    +{item.xp} XP
                  </p>
                  {item.score !== undefined && (
                    <p className="text-xs text-slate-400">{item.score}%</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/vocab/courses"
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> More Lessons
              </Link>
              <Link
                to="/vocab/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" /> View Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
