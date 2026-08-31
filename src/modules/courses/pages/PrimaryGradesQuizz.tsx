/**
 * PrimaryGradesQuiz.tsx  —  KG & Grades 1–5
 *
 * HOW GRADE-SPECIFIC QUESTIONS WORK:
 *   The route provides classSlug (e.g. "kg", "class-3").
 *   We look up its videoId from PRIMARY_GRADE_VIDEO_IDS in quizApi.ts.
 *   Each videoId maps to a completely separate set of questions in the DB.
 *
 *   kg      → videoId 1  → KG questions
 *   class-1 → videoId 2  → Grade 1 questions
 *   class-2 → videoId 3  → Grade 2 questions
 *   class-3 → videoId 4  → Grade 3 questions
 *   class-4 → videoId 5  → Grade 4 questions
 *   class-5 → videoId 6  → Grade 5 questions
 *
 * Route example:  /kg/quiz       → classSlug = "kg"
 *                 /class-3/quiz  → classSlug = "class-3"
 */

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaVolumeUp,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaBolt,
  FaBoxOpen,
} from "react-icons/fa";
import { t, getLanguage } from "@/modules/shared/i18n";
import {
  getPrimaryQuizQuestions,
  PRIMARY_GRADE_VIDEO_IDS,
  PrimaryQuestion,
} from "../../shared/services/quizApi";

/* ─────────────── CONSTANTS ─────────────── */
const LETTERS = ["A", "B", "C", "D"] as const;
const URDU_LETTERS: Record<string, string> = {
  A: "الف",
  B: "ب",
  C: "ج",
  D: "د",
};

/* ─────────────── HELPERS ─────────────── */
function normalize(value: string | null | undefined): string {
  return (value ?? "").trim();
}

function isSelectionCorrect(
  question: PrimaryQuestion,
  selectedLetter: string | undefined
): boolean {
  if (!selectedLetter) return false;
  const idx = LETTERS.indexOf(selectedLetter as (typeof LETTERS)[number]);
  if (idx === -1) return false;
  const selectedText = question[
    `option${idx + 1}` as keyof PrimaryQuestion
  ] as string;
  return normalize(selectedText) === normalize(question.answer);
}

/* ─────────────── COMPONENT ─────────────── */
export default function PrimaryGradesQuiz() {
  const { classSlug } = useParams<{ classSlug: string }>();

  // Each slug has its own videoId → completely separate questions
  const videoId = PRIMARY_GRADE_VIDEO_IDS[classSlug ?? ""] ?? 1;

  const isUrdu = getLanguage() === "ur";

  const [questions, setQuestions] = useState<PrimaryQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);

  /* ── Fetch whenever the grade changes ── */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setQuestions([]);
      setCurrentIndex(0);
      setAnswers({});
      setFinished(false);
      try {
        const data = await getPrimaryQuizQuestions(videoId);
        if (!cancelled) setQuestions(data);
      } catch (err) {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Failed to load questions"
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  /* ── Derived values ── */
  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const selectedOption = currentQuestion ? answers[currentQuestion.id] : undefined;
  const hasAnswered = !!selectedOption;

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    return LETTERS.map((letter, idx) => ({
      id: letter,
      label: isUrdu ? `${URDU_LETTERS[letter]} (${letter})` : letter,
      text: currentQuestion[
        `option${idx + 1}` as keyof PrimaryQuestion
      ] as string,
    }));
  }, [currentQuestion, isUrdu]);

  const correctCount = useMemo(
    () =>
      questions.reduce(
        (acc, q) =>
          isSelectionCorrect(q, answers[q.id]) ? acc + 1 : acc,
        0
      ),
    [questions, answers]
  );

  const answeredCount = Object.keys(answers).length;

  /* ── Handlers ── */
  function handleSelect(letter: string) {
    if (!currentQuestion || hasAnswered) return;
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
    if (!currentQuestion || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentQuestion.question);
    u.lang = isUrdu ? "ur-PK" : "en-US";
    window.speechSynthesis.speak(u);
  }

  /* ── Render ── */
  return (
    <div
      className={`min-h-screen bg-[#f4f7fa] p-4 md:p-8 flex justify-center items-start ${
        isUrdu ? "font-urdu" : ""
      }`}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ── MAIN ── */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          <h1 className="text-[#0d53c7] text-3xl md:text-4xl font-black tracking-tight">
            {t("quiz.title")}
          </h1>

          {/* Progress bar */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3 font-bold text-sm">
              <span className="text-[#0d53c7] tracking-wider">
                {t("quiz.progress")}{" "}
                {total > 0 ? `(${currentIndex + 1}/${total})` : ""}
              </span>
              <span className="text-[#4a5568]">
                {t("quiz.earned")}: {correctCount}
              </span>
            </div>
            <div className="bg-[#edf2f7] rounded-full h-4 overflow-hidden">
              <div
                className="bg-[#057a55] h-full rounded-full transition-all"
                style={{
                  width:
                    total > 0
                      ? `${((currentIndex + 1) / total) * 100}%`
                      : "0%",
                }}
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl px-6 py-16 flex items-center justify-center shadow-md">
              <span className="text-[#4a5568] font-bold">
                {t("quiz.loading") || "Loading questions…"}
              </span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-white border border-[#fca5a5] rounded-3xl px-6 py-16 flex flex-col items-center gap-4 shadow-md">
              <span className="text-[#b91c1c] font-bold">{error}</span>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                }}
                className="bg-[#0d53c7] text-white font-bold py-2 px-6 rounded-full"
              >
                {t("quiz.retry") || "Retry"}
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && total === 0 && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl px-6 py-16 flex items-center justify-center shadow-md">
              <span className="text-[#4a5568] font-bold">
                {t("quiz.empty") || "No questions found for this grade."}
              </span>
            </div>
          )}

          {/* Results */}
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

          {/* Question card */}
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
                  const isCorrectOption =
                    normalize(option.text) ===
                    normalize(currentQuestion.answer);

                  let stateClasses = "border-[#edf2f7] hover:border-[#cbd5e1]";
                  if (hasAnswered && isCorrectOption) {
                    stateClasses =
                      "border-[#057a55] ring-1 ring-[#057a55] bg-[#f0fdf4]";
                  } else if (hasAnswered && isSelected && !isCorrectOption) {
                    stateClasses =
                      "border-[#dc2626] ring-1 ring-[#dc2626] bg-[#fef2f2]";
                  } else if (isSelected) {
                    stateClasses = "border-[#0d53c7] ring-1 ring-[#0d53c7]";
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      disabled={hasAnswered}
                      className={`bg-white border-2 rounded-2xl py-6 px-4 flex flex-col items-center justify-center gap-2 transition-all ${stateClasses}`}
                    >
                      <span className="text-xs font-black text-[#718096]">
                        {option.label}
                      </span>
                      <span
                        className={`text-lg font-black ${
                          isSelected ? "text-[#0d53c7]" : "text-[#4a5568]"
                        }`}
                      >
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
                {isUrdu ? <FaArrowRight /> : <FaArrowLeft />}{" "}
                {t("quiz.prev")}
              </button>
              <button
                onClick={handleNext}
                disabled={!hasAnswered}
                className="flex items-center gap-2 bg-[#0d53c7] text-white font-bold py-3 px-8 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {currentIndex === total - 1
                  ? t("quiz.finish") || "Finish"
                  : t("quiz.next")}
                {isUrdu ? <FaArrowLeft /> : <FaArrowRight />}
              </button>
            </footer>
          )}
        </main>

        {/* ── SIDEBAR ── */}
        <aside className="lg:col-span-1 w-full">
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-center text-[#0d53c7] text-lg font-bold">
              {t("quiz.rewards")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#ffeadd] text-[#c05621] rounded-2xl p-4 flex flex-col items-center">
                <FaStar className="text-2xl" />
                <span className="font-black text-xl">{correctCount}</span>
              </div>
              <div className="bg-[#d1fae5] text-[#065f46] rounded-2xl p-4 flex flex-col items-center">
                <FaBolt className="text-2xl" />
                <span className="font-black text-xl">
                  {answeredCount * 90}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center py-4 border-b-2 border-dashed border-[#edf2f7]">
              <div className="w-28 h-28 flex items-center justify-center">
                <FaBoxOpen className="text-5xl text-[#b7791f]" />
              </div>
              <span className="bg-[#1a202c] text-white text-[10px] font-black px-3 py-0.5 rounded-md">
                {t("quiz.locked")}
              </span>
              <p className="text-sm text-[#718096] font-bold mt-2">
                {t("quiz.goal")}
              </p>
            </div>
            <div className="bg-[#e6fffa] border-2 border-dashed border-[#319795] rounded-2xl p-5">
              <span className="bg-[#004d40] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                {t("quiz.tipLabel")}
              </span>
              <p className="text-[#234e52] text-sm mt-2">
                {t("quiz.tipText")}
              </p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}