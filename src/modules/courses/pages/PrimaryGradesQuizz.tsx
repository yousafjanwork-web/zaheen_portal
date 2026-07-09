import React, { useEffect, useMemo, useState } from 'react';
import { FaVolumeUp, FaArrowLeft, FaArrowRight, FaStar, FaBolt, FaBoxOpen } from 'react-icons/fa';
import { t, getLanguage } from "@/modules/shared/i18n";

interface QuizQuestion {
  id: number;
  videoid: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string; // "A" | "B" | "C" | "D"
  status: number;
  datecreated: string;
}

interface QuizApiResponse {
  success: boolean;
  total: number;
  data: QuizQuestion[];
}

const LETTERS = ['A', 'B', 'C', 'D'] as const;
const URDU_LETTERS: Record<string, string> = { A: 'الف', B: 'ب', C: 'ج', D: 'د' };

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim();
}

// The `answer` field stores the TEXT of the correct option (e.g. "A" meaning the
// option whose text is literally "A"), not its position (option1/2/3/4).
// So we resolve correctness by matching text, not by matching the A/B/C/D slot letter.
function isSelectionCorrect(question: QuizQuestion, selectedLetter: string | undefined): boolean {
  if (!selectedLetter) return false;
  const idx = LETTERS.indexOf(selectedLetter as (typeof LETTERS)[number]);
  if (idx === -1) return false;
  const selectedText = question[`option${idx + 1}` as keyof QuizQuestion] as string;
  return normalize(selectedText) === normalize(question.answer);
}

interface PrimaryGradesQuizProps {
  videoId?: number;
}

export default function PrimaryGradesQuiz({ videoId = 1 }: PrimaryGradesQuizProps) {
  const isUrdu = getLanguage() === "ur";

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  // answers[questionId] = the letter the user picked
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchQuestions() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.zaheen.com.pk/v2/api/get-quiz-questions/${videoId}`);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const json: QuizApiResponse = await res.json();
        if (!json.success) throw new Error('API returned success: false');
        if (!cancelled) {
          setQuestions(json.data ?? []);
          setCurrentIndex(0);
          setAnswers({});
          setFinished(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load quiz questions');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    return LETTERS.map((letter, idx) => ({
      id: letter,
      label: isUrdu ? `${URDU_LETTERS[letter]} (${letter})` : letter,
      text: currentQuestion[`option${idx + 1}` as keyof QuizQuestion] as string,
    }));
  }, [currentQuestion, isUrdu]);

  const correctCount = useMemo(() => {
    return questions.reduce((acc, q) => (isSelectionCorrect(q, answers[q.id]) ? acc + 1 : acc), 0);
  }, [questions, answers]);

  const answeredCount = Object.keys(answers).length;

  function handleSelect(letter: string) {
    if (!currentQuestion) return;
    // lock in the answer for this question; once picked, show correct/incorrect
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }));
  }

  function handlePrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  function handleNext() {
    if (currentIndex === total - 1) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => Math.min(total - 1, i + 1));
    }
  }

  function handleRetry() {
    setAnswers({});
    setCurrentIndex(0);
    setFinished(false);
  }

  function handleSpeak() {
    if (!currentQuestion) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  const hasAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  return (
    <div className={`min-h-screen bg-[#f4f7fa] p-4 md:p-8 flex justify-center items-start ${isUrdu ? 'font-urdu' : ''}`}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">

        <main className="lg:col-span-3 flex flex-col gap-6">
          <h1 className="text-[#0d53c7] text-3xl md:text-4xl font-black tracking-tight">
            {t("quiz.title")}
          </h1>

          {/* Progress */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3 font-bold text-sm">
              <span className="text-[#0d53c7] tracking-wider">
                {t("quiz.progress")} {total > 0 ? `(${currentIndex + 1}/${total})` : ''}
              </span>
              <span className="text-[#4a5568]">{t("quiz.earned")}: {correctCount}</span>
            </div>
            <div className="bg-[#edf2f7] rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#057a55] h-full rounded-full transition-all"
                style={{ width: total > 0 ? `${((currentIndex + 1) / total) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl px-6 py-16 flex items-center justify-center shadow-md">
              <span className="text-[#4a5568] font-bold">{t("quiz.loading") || "Loading questions..."}</span>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="bg-white border border-[#fca5a5] rounded-3xl px-6 py-16 flex flex-col items-center justify-center gap-4 shadow-md">
              <span className="text-[#b91c1c] font-bold">{error}</span>
              <button
                onClick={() => setError(null) || setLoading(true)}
                className="bg-[#0d53c7] text-white font-bold py-2 px-6 rounded-full"
              >
                {t("quiz.retry") || "Retry"}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && total === 0 && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl px-6 py-16 flex items-center justify-center shadow-md">
              <span className="text-[#4a5568] font-bold">{t("quiz.empty") || "No questions found."}</span>
            </div>
          )}

          {/* Finished / results screen */}
          {!loading && !error && total > 0 && finished && (
            <div className="bg-white border-t-8 border-t-[#057a55] border border-[#e2e8f0] rounded-3xl px-6 py-14 flex flex-col items-center text-center shadow-md gap-4">
              <h2 className="text-[#1a202c] text-2xl md:text-3xl font-black">
                {t("quiz.results") || "Quiz Complete!"}
              </h2>
              <p className="text-[#4a5568] text-lg font-bold">
                {correctCount} / {total}
              </p>
              <button
                onClick={handleRetry}
                className="bg-[#0d53c7] text-white font-bold py-3 px-8 rounded-full shadow-lg"
              >
                {t("quiz.retryQuiz") || "Try Again"}
              </button>
            </div>
          )}

          {/* Question */}
          {!loading && !error && total > 0 && !finished && currentQuestion && (
            <div className="bg-white border-t-8 border-t-[#0d53c7] border border-[#e2e8f0] rounded-3xl px-6 py-10 md:py-14 flex flex-col items-center text-center shadow-md">
              <button
                onClick={handleSpeak}
                className="bg-[#e0eaff] text-[#0d53c7] rounded-full w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform mb-6"
              >
                <FaVolumeUp className="text-xl" />
              </button>
              <h2 className="text-[#1a202c] text-2xl md:text-3xl font-bold max-w-xl mb-10 leading-tight">
                {currentQuestion.question}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-2xl">
                {options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrectOption = normalize(option.text) === normalize(currentQuestion.answer);
                  let stateClasses = 'border-[#edf2f7] hover:border-[#cbd5e1]';
                  if (hasAnswered && isCorrectOption) {
                    stateClasses = 'border-[#057a55] ring-1 ring-[#057a55] bg-[#f0fdf4]';
                  } else if (hasAnswered && isSelected && !isCorrectOption) {
                    stateClasses = 'border-[#dc2626] ring-1 ring-[#dc2626] bg-[#fef2f2]';
                  } else if (isSelected) {
                    stateClasses = 'border-[#0d53c7] ring-1 ring-[#0d53c7]';
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={hasAnswered}
                      className={`bg-white border-2 rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-2 transition-all ${stateClasses}`}
                    >
                      <span className="text-xs font-black text-[#718096]">{option.label}</span>
                      <span className={`text-lg font-black ${isSelected ? 'text-[#0d53c7]' : 'text-[#4a5568]'}`}>
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          {!loading && !error && total > 0 && !finished && (
            <footer className="flex justify-between items-center mt-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 text-[#0d53c7] font-bold hover:text-[#0a43a0] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isUrdu ? <FaArrowRight /> : <FaArrowLeft />} {t("quiz.prev")}
              </button>
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className="flex items-center gap-2 bg-[#0d53c7] text-white font-bold py-3 px-8 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentIndex === total - 1 ? (t("quiz.finish") || "Finish") : t("quiz.next")}
                {isUrdu ? <FaArrowLeft /> : <FaArrowRight />}
              </button>
            </footer>
          )}
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 w-full">
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-center text-[#0d53c7] text-lg font-bold">{t("quiz.rewards")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#ffeadd] text-[#c05621] rounded-2xl p-4 flex flex-col items-center">
                <FaStar className="text-2xl" />
                <span className="font-black text-xl">{correctCount}</span>
              </div>
              <div className="bg-[#d1fae5] text-[#065f46] rounded-2xl p-4 flex flex-col items-center">
                <FaBolt className="text-2xl" />
                <span className="font-black text-xl">{answeredCount * 90}</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center py-4 border-b-2 border-dashed border-[#edf2f7]">
              <div className="w-28 h-28 flex items-center justify-center">
                <FaBoxOpen className="text-5xl text-[#b7791f]" />
              </div>
              <span className="bg-[#1a202c] text-white text-[10px] font-black px-3 py-0.5 rounded-md">
                {t("quiz.locked")}
              </span>
              <p className="text-sm text-[#718096] font-bold mt-2">{t("quiz.goal")}</p>
            </div>
            <div className="bg-[#e6fffa] border-2 border-dashed border-[#319795] rounded-2xl p-5">
              <span className="bg-[#004d40] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                {t("quiz.tipLabel")}
              </span>
              <p className="text-[#234e52] text-sm mt-2">{t("quiz.tipText")}</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}