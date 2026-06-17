/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Clock,
  TrendingUp,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  X,
  Plus,
  Compass,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { Quiz, Question, QuizAttempt } from "../types";
import { mdcatApi } from "../config";

interface QuizSessionProps {
  quiz: Quiz;
  onBack: () => void;
  onAttemptFinished: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export default function QuizSession({
  quiz,
  onBack,
  onAttemptFinished,
  refreshData,
}: QuizSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, "A" | "B" | "C" | "D">
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);

  const questionsList = quiz.questions || [];

  // FIX: use null instead of "A" fallback so unanswered questions are always wrong
  const incorrectQuestions = questionsList.filter((q) => {
    const userSelectedOption = selectedAnswers[q.id] || null;
    return userSelectedOption !== q.correctOption;
  });

  // AI Explanations mapping
  const [aiExplanationMap, setAiExplanationMap] = useState<
    Record<number, string>
  >({});
  const [isExplainingMap, setIsExplainingMap] = useState<
    Record<number, boolean>
  >({});

  // AI Concept Summarizer mapping
  const [conceptSummaryMap, setConceptSummaryMap] = useState<
    Record<number, string>
  >({});
  const [isSummarizingMap, setIsSummarizingMap] = useState<
    Record<number, boolean>
  >({});

  // AI Master Concept Summary Sheet state
  const [masterSummary, setMasterSummary] = useState<string>("");
  const [isGeneratingMaster, setIsGeneratingMaster] = useState<boolean>(false);

  const handleRequestAIExplanation = async (q: Question) => {
    setIsExplainingMap((prev) => ({ ...prev, [q.id]: true }));
    try {
      const qText = `Question: "${q.questionText}"\nOptions:\nA: ${q.optionA}\nB: ${q.optionB}\nC: ${q.optionC}\nD: ${q.optionD}\nCorrect Option: ${q.correctOption}\nExisting Explanation: ${q.explanation}`;
      const response = await fetch(mdcatApi("/api/mdcat/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Provide an extremely deep, highly analytical conceptual breakdown of this MDCAT biology/physics/chemistry question. State step-by-step why the correct option is indeed correct, why other options are incorrect, and share a clever mnemonic/memory trick for this specific concept. Keep it formatted nicely with bullet points.\n\n${qText}`,
          subject: q.subject,
          language: "Bilingual (Urdu + Eng)",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // FIX: unwrap { success, data: { reply } } response format
        setAiExplanationMap((prev) => ({
          ...prev,
          [q.id]: data.data?.reply ?? data.reply,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplainingMap((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const handleRequestConceptSummary = async (q: Question) => {
    setIsSummarizingMap((prev) => ({ ...prev, [q.id]: true }));
    try {
      const qText = `Question: "${q.questionText}"\nOptions:\nA: ${q.optionA}\nB: ${q.optionB}\nC: ${q.optionC}\nD: ${q.optionD}\nCorrect Option: ${q.correctOption}\nExisting Explanation: ${q.explanation}`;
      const response = await fetch(mdcatApi("/api/mdcat/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Act as an expert academic concept summarizer. The student answered incorrectly to this MDCAT question.
Subject Areas: "${q.subject}" -> "${q.subTopic || "General Topic"}".

Provide a concise, ultra-focused, bulleted explanation of the core complex concepts behind this topic. Avoid repeating the question or list of options. Instead, focus entirely on clarifying:
1. The underlying scientific mechanism or rule.
2. High-yield, critical definitions or facts.
3. Memorable mental shortcuts, mnemonics, or key formulas.

Formatting: Use exactly 3 to 4 bullet points with bold sub-headers. Keep it clear, friendly, and bilingual (with helpful Urdu annotations in brackets to make it memorable).

${qText}`,
          subject: q.subject,
          language: "Bilingual (Urdu + Eng)",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // FIX: unwrap { success, data: { reply } } response format
        setConceptSummaryMap((prev) => ({
          ...prev,
          [q.id]: data.data?.reply ?? data.reply,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizingMap((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  const handleRequestMasterConceptSummary = async () => {
    setIsGeneratingMaster(true);
    try {
      const topicAggregates = incorrectQuestions
        .map((q) => `* ${q.subTopic || "General Chapter"} (${q.subject})`)
        .join("\n");
      const questionAggregates = incorrectQuestions
        .map(
          (q, i) =>
            `${i + 1}. Topic: ${q.subTopic || q.subject} - "${q.questionText}" (Correct Answer: ${q.correctOption})`,
        )
        .join("\n");

      const response = await fetch(mdcatApi("/api/mdcat/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Act as an elite medical entry exam mentor. The student recently attempted the MDCAT Practice Module "${quiz.title}" and answered several questions incorrectly.
We have aggregated the topics they struggled with below:
${topicAggregates}

And the precise questions they got wrong are:
${questionAggregates}

Based on these combined topics, generate a master high-yield "AI Concept Summary Revision Sheet".
Format your response exactly as follows:
- Title: "HIGH-YIELD MDCAT REVISION SHEET" (bold and stylized)
- Introduction: A brief, encouraging 2-sentence note.
- Topic Breakdowns: For each incorrect topic list, provide a dedicated concise, bolded 2-3 bullet-point conceptual mastery explanation clarifying the underlying physiological/physical/chemical principles. Focus on high-yield exam facts, formulas, or provincial board distinctions. Include bullet points.
- Final Mnemonics & Tips: Give a combined memorable, clever mnemonic for these weak areas.

Ensure it is entirely composed of easy-to-read, concise, and highly professional bulleted explanations.`,
          subject: quiz.subject,
          language: "Bilingual (Urdu + Eng)",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // FIX: unwrap { success, data: { reply } } response format
        setMasterSummary(data.data?.reply ?? data.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // Timer settings: 60 seconds per question (standard MDCAT timing constraint). Full 180-question paper gets 210 minutes.
  const totalQuestions = quiz.questions?.length || 0;
  const [timeLeft, setTimeLeft] = useState(
    totalQuestions === 180 ? 210 * 60 : totalQuestions * 60,
  );
  const [quizStatus, setQuizStatus] = useState<"taking" | "submitted">(
    "taking",
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound/Vibe feedback logic
  const currentQuestion = questionsList[currentQuestionIndex];

  // Start timer
  useEffect(() => {
    if (quizStatus === "taking" && totalQuestions > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizStatus, totalQuestions]);

  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    if (quizStatus === "taking") {
      setSelectedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: option,
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);
    try {
      // FIX: use null for unanswered questions instead of defaulting to "A"
      // This ensures skipped questions are never accidentally marked correct
      const responses = questionsList.map((q) => ({
        questionId: q.id,
        selectedOption: selectedAnswers[q.id] || null,
      }));

      const bodyPayload = {
        quizId: quiz.id,
        responses,
      };

      const res = await fetch(mdcatApi("/api/mdcat/attempts"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        throw new Error("Could not compute quiz attempts on backend");
      }

      // FIX: unwrap { success, data: { ... } } response format
      const json = await res.json();
      const savedAttempt: QuizAttempt = json.data ?? json;
      setAttemptResult(savedAttempt);
      setQuizStatus("submitted");
      await refreshData();
      await onAttemptFinished();
    } catch (e) {
      console.error("[SessionError] Submission failed:", e);
      alert("Error submitting answers. Connecting via fallback mechanism.");
      setQuizStatus("submitted");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert time left into HH:MM:SS or MM:SS (perfect for long tests)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Option class name generator (while taking)
  const getOptionClass = (optKey: "A" | "B" | "C" | "D", value: string) => {
    const isSelected = selectedAnswers[currentQuestion.id] === optKey;
    if (isSelected) {
      return "border-sky-500 bg-sky-50 text-sky-950 shadow-sm font-semibold scale-[1.01]";
    }
    return "border-sky-100/60 bg-white text-sky-950/80 hover:border-sky-300 hover:bg-sky-50/20";
  };

  if (totalQuestions === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-sky-100 card-shadow text-center space-y-4">
        <HelpCircle className="w-12 h-12 text-sky-400 mx-auto" />
        <h3 className="text-lg font-black uppercase tracking-tight text-sky-950">
          Empty Practice Module
        </h3>
        <p className="text-sky-900/60 text-xs font-bold leading-relaxed">
          This paper does not contain any questions. Verify the database
          configurations.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-3 bg-sky-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-sky-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Top Action Bar with standard layout */}
      <div className="flex items-center justify-between gap-4 py-2 border-b border-sky-100 flex-wrap">
        <button
          onClick={onBack}
          className="text-sky-950 hover:text-sky-600 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {quizStatus === "taking" && (
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-sky-100 card-shadow">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-sky-500">
              <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>TIME:</span>
              <span className="font-mono-custom font-black text-xs text-sky-950">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}
      </div>

      {quizStatus === "taking" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Question Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Realtime progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] text-sky-500 uppercase font-black tracking-widest">
                <span>
                  Subject Area:{" "}
                  <b className="text-sky-950 font-black">{quiz.subject}</b>
                </span>
                <span>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>
              <div className="w-full bg-sky-50 h-2 rounded-full overflow-hidden border border-sky-100">
                <div
                  className="bg-sky-600 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* MCQ Card */}
            <div className="p-8 rounded-3xl bg-white border border-sky-100 card-shadow space-y-6">
              {/* Question Text with monospace accents for PMDC style */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 rounded-md">
                    {currentQuestion.subTopic || "Module Specific"}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-sky-950 leading-relaxed font-sans">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {/* Multiple Choice Options List */}
              <div className="space-y-3">
                {[
                  { key: "A", value: currentQuestion.optionA },
                  { key: "B", value: currentQuestion.optionB },
                  { key: "C", value: currentQuestion.optionC },
                  { key: "D", value: currentQuestion.optionD },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => handleSelectOption(option.key as any)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 group scale-[0.99] active:scale-[0.98] ${getOptionClass(option.key as any, option.value)}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-display text-xs font-black border transition ${selectedAnswers[currentQuestion.id] === option.key ? "bg-sky-600 text-white border-transparent" : "bg-sky-50/50 text-sky-905 border-sky-100 text-sky-800"}`}
                      >
                        {option.key}
                      </span>
                      <span className="text-xs md:text-sm text-sky-950/90 font-semibold select-none leading-relaxed">
                        {option.value}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Action Buttons footer */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-sky-100 text-sky-900 bg-white rounded-xl hover:bg-sky-50 disabled:opacity-40 disabled:hover:bg-white text-xs font-black uppercase tracking-wider flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-xs tracking-widest rounded-xl text-center shadow-md transition-all flex items-center gap-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Paper"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 hover:bg-sky-100/50 text-sky-900 bg-sky-50 border border-sky-100 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right sidebar: Quick question index jump panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-4">
              <h3 className="text-xs font-black text-sky-950 uppercase tracking-widest">
                Exam Progress
              </h3>

              <div className="grid grid-cols-5 gap-2.5">
                {questionsList.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-9 rounded-lg font-mono-custom text-xs font-black flex items-center justify-center transition border ${isCurrent ? "ring-2 ring-sky-500 border-transparent bg-sky-50 text-sky-800" : isAnswered ? "bg-sky-600 text-white border-transparent" : "bg-sky-50/50 text-sky-900 border-sky-100 hover:bg-sky-100/30"}`}
                    >
                      {(idx + 1).toString().padStart(2, "0")}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-sky-100 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-sky-450 text-sky-500">
                  <span className="w-3 h-3 rounded-full bg-sky-600 block"></span>
                  <span>Answered QUESTIONS</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-sky-450 text-sky-500">
                  <span className="w-3 h-3 rounded-full bg-sky-50/50 border border-sky-100 block"></span>
                  <span>Unanswered QUESTIONS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =====================================================================
           SUBMITTED / DETAILED REVIEW MODE: Show answers & incorrect explanations
           ===================================================================== */
        <div className="space-y-8 animate-fade-in">
          {/* Diagnostic Stats Result Summary */}
          <div className="p-8 rounded-3xl bg-white border border-sky-100 card-shadow text-center max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-sky-100 text-sky-600">
              <TrendingUp className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-sky-500 tracking-widest">
                Practice Paper Results
              </span>
              <h2 className="text-xl font-black text-sky-950 uppercase tracking-tight">
                {quiz.title}
              </h2>
              <p className="text-xs font-bold text-sky-900/60 leading-relaxed">
                Review mistakes to fix weak concepts before the actual MDCAT
                exam.
              </p>
            </div>

            {attemptResult && (
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-sky-100">
                <div className="text-center">
                  <div className="text-[10px] uppercase font-black text-sky-400 tracking-wider">
                    Total MCQ
                  </div>
                  <div className="text-lg font-mono-custom font-black text-sky-950">
                    {attemptResult.totalQuestions}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase font-black text-sky-450 tracking-wider">
                    Correct
                  </div>
                  <div className="text-lg font-mono-custom font-black text-emerald-600">
                    {attemptResult.score}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase font-black text-sky-450 tracking-wider">
                    Score Pct
                  </div>
                  <div className="text-lg font-mono-custom font-black text-sky-650 text-sky-600">
                    {attemptResult.percentage}%
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={onBack}
                className="px-6 py-3 bg-sky-600 text-white font-black uppercase text-xs tracking-widest rounded-xl text-center shadow-md hover:bg-sky-700 transition-all duration-150 transform hover:scale-[1.01]"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* AI Concept Summarizer Master Panel */}
          {incorrectQuestions.length > 0 && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-50/70 to-indigo-50/70 border border-violet-100 flex flex-col gap-5 card-shadow relative overflow-hidden group">
              <div className="space-y-1.5 z-10">
                <span className="px-2.5 py-0.5 text-[9px] font-black uppercase text-violet-700 bg-violet-100 rounded-md tracking-wider">
                  AI Revision Hub
                </span>
                <h3 className="text-base font-black text-sky-950 uppercase tracking-tight flex items-center gap-1.5">
                  AI Concept Summarizer Master Sheet 🧠
                </h3>
                <p className="text-xs text-indigo-900/70 font-semibold max-w-xl leading-relaxed">
                  Generate a complete high-yield bulleted concept cheat sheet
                  covering all{" "}
                  <b className="text-sky-950">
                    {incorrectQuestions.length} missed topics
                  </b>{" "}
                  from this test. Instantly identifies core physiological
                  mechanisms, formulas, and mnemonics!
                </p>
              </div>

              <div className="z-10 flex items-center justify-start">
                <button
                  onClick={handleRequestMasterConceptSummary}
                  disabled={isGeneratingMaster}
                  className="px-5 py-3 bg-violet-600 hover:bg-violet-750 text-white font-black uppercase text-[10px] tracking-wider rounded-xl flex items-center gap-1.5 transition card-shadow hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white fill-violet-250 animate-pulse" />
                  <span>
                    {isGeneratingMaster
                      ? "Generating Master Summary Sheet..."
                      : "Generate Missed Concepts Cheat Sheet"}
                  </span>
                </button>
              </div>

              {/* Master Summary output display */}
              {masterSummary && (
                <div className="z-10 mt-2 p-5 bg-white border border-violet-100 rounded-2xl shadow-sm animate-fade-in space-y-3">
                  <div className="flex items-center justify-between border-b border-violet-50 pb-2">
                    <span className="text-[10px] text-violet-600 font-extrabold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 fill-violet-100" />{" "}
                      High-Yield Revision Sheet
                    </span>
                    <button
                      onClick={() => setMasterSummary("")}
                      className="text-[9px] font-black uppercase text-rose-600 hover:text-rose-850 tracking-wider flex items-center gap-0.5 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded cursor-pointer transition-all"
                    >
                      Clear Sheet
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap font-semibold text-xs leading-relaxed text-indigo-950 pl-1 select-text">
                    {masterSummary}
                  </div>
                </div>
              )}

              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none text-9xl group-hover:scale-110 transition-all">
                🧠
              </div>
            </div>
          )}

          {/* Interactive Question-by-Question Explanation List */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-sky-950">
                Detailed MCQ Analytical Review
              </h3>
              <p className="text-xs text-sky-500 font-bold">
                Review detailed textbook descriptions and explanations for every
                incorrect option.
              </p>
            </div>

            <div className="space-y-6">
              {questionsList.map((question, idx) => {
                // FIX: use null instead of "A" so unanswered questions show as incorrect
                const userSelectedOption = selectedAnswers[question.id] || null;
                const isCorrect = userSelectedOption === question.correctOption;

                return (
                  <div
                    key={question.id}
                    className={`p-6 rounded-3xl bg-white border border-sky-100 card-shadow space-y-4 relative overflow-hidden transition-all`}
                  >
                    {/* Status side indicator bar */}
                    <div
                      className={`absolute top-0 left-0 bottom-0 w-1.5 ${isCorrect ? "bg-emerald-500" : "bg-rose-500"}`}
                    ></div>

                    {/* Header item */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 pl-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">
                            QUESTION {idx + 1}
                          </span>
                          <span className="px-2 py-0.5 text-[9px] font-black text-sky-700 bg-sky-100 rounded-md">
                            {question.subTopic || "Uncategorized"}
                          </span>
                        </div>
                        <h4 className="text-sm md:text-base font-bold text-sky-950 leading-relaxed pt-1">
                          {question.questionText}
                        </h4>
                      </div>

                      {isCorrect ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase text-emerald-700 bg-emerald-50 rounded-lg shrink-0 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                          Correct
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2.5 py-1 text-xs font-black uppercase text-rose-700 bg-rose-50 rounded-lg shrink-0 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />{" "}
                          {userSelectedOption ? "Incorrect" : "Skipped"}
                        </div>
                      )}
                    </div>

                    {/* Options list, displaying colors representing correct or mistakes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-1">
                      {[
                        { key: "A", val: question.optionA },
                        { key: "B", val: question.optionB },
                        { key: "C", val: question.optionC },
                        { key: "D", val: question.optionD },
                      ].map((item) => {
                        const isThisCorrectOption =
                          item.key === question.correctOption;
                        const isThisSelectedByStudent =
                          item.key === userSelectedOption;

                        // Calculate option class names for feedback
                        let optionStyle =
                          "border-sky-100/50 bg-sky-50/20 text-sky-900";
                        let badgeStyle =
                          "bg-sky-150 text-sky-650 text-sky-800 bg-sky-100";

                        if (isThisCorrectOption) {
                          optionStyle =
                            "border-emerald-250 bg-emerald-50/50 text-sky-950 border-2 card-shadow";
                          badgeStyle = "bg-emerald-500 text-white font-black";
                        } else if (isThisSelectedByStudent && !isCorrect) {
                          optionStyle =
                            "border-rose-250 bg-rose-50/50 text-sky-950 border-2";
                          badgeStyle = "bg-rose-500 text-white font-black";
                        }

                        return (
                          <div
                            key={item.key}
                            className={`p-3 px-4 rounded-xl border flex items-center justify-between gap-3 text-xs md:text-sm ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${badgeStyle}`}
                              >
                                {item.key}
                              </span>
                              <span className="font-bold text-sky-950">
                                {item.val}
                              </span>
                            </div>

                            {/* Checkmark or X icons inside options */}
                            {isThisCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isThisSelectedByStudent && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Segment */}
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-905 pl-4 relative space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sky-700 font-black uppercase tracking-wider text-[10px]">
                          <Compass className="w-4 h-4 text-sky-600" />{" "}
                          Analytical Explanation & Reference
                        </div>

                        <button
                          onClick={() => handleRequestAIExplanation(question)}
                          disabled={isExplainingMap[question.id]}
                          className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-55 self-start transition-all"
                        >
                          <Sparkles className="w-3 h-3 fill-sky-200" />
                          {isExplainingMap[question.id]
                            ? "AI is analyzing..."
                            : "Ask Zaheen AI Tutor"}
                        </button>
                      </div>

                      <p className="leading-relaxed text-sky-900 font-bold">
                        {question.explanation ||
                          "Detailed board text reference explanation available for this practice question."}
                      </p>

                      {/* Dynamic AI Explanation block */}
                      {aiExplanationMap[question.id] && (
                        <div className="mt-3 p-3.5 bg-white border border-sky-100 rounded-xl space-y-2 text-sky-950 font-sans tracking-tight leading-relaxed select-text shadow-sm animate-fade-in">
                          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-sky-600">
                            <Sparkles className="w-3 h-3 fill-sky-150" /> Zaheen
                            AI Masterclass Explanation:
                          </div>
                          <div className="whitespace-pre-wrap font-bold text-xs text-sky-900 space-y-1">
                            {aiExplanationMap[question.id]}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Concept Summarizer Segment */}
                    {!isCorrect && (
                      <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 text-xs text-violet-900 relative space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-violet-750 font-black uppercase tracking-wider text-[10px]">
                            <BookOpen className="w-4 h-4 text-violet-600" /> AI
                            Concept Summarizer 🧠
                          </div>

                          <button
                            onClick={() =>
                              handleRequestConceptSummary(question)
                            }
                            disabled={isSummarizingMap[question.id]}
                            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-violet-650 hover:bg-violet-700 text-white rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-55 self-start transition-all"
                          >
                            <Sparkles className="w-3 h-3 fill-violet-200" />
                            {isSummarizingMap[question.id]
                              ? "Summarizing..."
                              : "Summarize Concept"}
                          </button>
                        </div>

                        <p className="leading-relaxed text-violet-900/80 font-bold">
                          Struggling with this topic? Click to generate a
                          concise, bulleted conceptual summary clarifying core
                          mechanisms and formulas!
                        </p>

                        {/* Concept Summary Output */}
                        {conceptSummaryMap[question.id] && (
                          <div className="mt-3 p-3.5 bg-white border border-violet-100 rounded-xl space-y-2 text-sky-950 font-sans tracking-tight leading-relaxed select-text shadow-sm animate-fade-in font-semibold">
                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-violet-600">
                              <Sparkles className="w-3 h-3 fill-violet-150" />{" "}
                              Bulleted Concept Summary:
                            </div>
                            <div className="whitespace-pre-wrap font-semibold text-xs text-violet-950 space-y-2 pl-1">
                              {conceptSummaryMap[question.id]}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
