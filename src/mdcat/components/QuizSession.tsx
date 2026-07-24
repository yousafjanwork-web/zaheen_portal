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
import { mdcatApi, mdcatAiApi } from "../config";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const markdownComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-sm font-black uppercase tracking-tight text-sky-900 mb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-xs font-black uppercase tracking-wide text-sky-800 mt-3 mb-1.5">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-xs font-black uppercase tracking-wide text-sky-700 mt-3 mb-1">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-xs font-bold text-sky-900 leading-relaxed mb-2">
      {children}
    </p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-black text-sky-950">{children}</strong>
  ),
  ul: ({ children }: any) => (
    <ul className="space-y-1 mb-2 pl-1">{children}</ul>
  ),
  li: ({ children }: any) => (
    <li className="text-xs font-bold text-sky-900 leading-relaxed flex gap-2">
      <span className="text-sky-400 mt-0.5">•</span>
      <span>{children}</span>
    </li>
  ),
  hr: () => <hr className="border-sky-100 my-3" />,
};

const conceptMarkdownComponents = {
  ...markdownComponents,
  strong: ({ children }: any) => (
    <strong className="font-black text-violet-950">{children}</strong>
  ),
  li: ({ children }: any) => (
    <li className="text-xs font-semibold text-violet-900 leading-relaxed flex gap-2">
      <span className="text-violet-400 mt-0.5">•</span>
      <span>{children}</span>
    </li>
  ),
};



interface QuizSessionProps {
  quiz: Quiz;
  onBack: () => void;
  onAttemptFinished: () => Promise<void>;
  submitQuizId?: number;
  
}

export default function QuizSession({
  quiz,
  onBack,
  onAttemptFinished,
  submitQuizId
  
}: QuizSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, "A" | "B" | "C" | "D">
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);
  
  const [quizSnapshot] = useState(quiz);
  

   const totalQuestions = quizSnapshot.questions?.length || 0;
  const [timeLeft, setTimeLeft] = useState(
    totalQuestions === 180 ? 210 * 60 : totalQuestions * 60,
  );
  const [quizStatus, setQuizStatus] = useState<"taking" | "submitted">(
    "taking",
  );

  
   useEffect(()=>
  {
    window.scrollTo(0,0)
  },[])

  const questionsList = quizSnapshot.questions || [];

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
      const response = await fetch(mdcatAiApi("/api/mdcat/chat"), {
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
      const response = await fetch(mdcatAiApi("/api/mdcat/chat"), {
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

      const response = await fetch(mdcatAiApi("/api/mdcat/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `Act as an elite medical entry exam mentor. The student recently attempted the MDCAT Practice Module "${quizSnapshot.title}" and answered several questions incorrectly.
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
          subject: quizSnapshot.subject,
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
        quizId: quizSnapshot.id,
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
      // console.log(json)
      const savedAttempt: QuizAttempt = json.data ?? json;
      
      setAttemptResult(savedAttempt);
      setQuizStatus("submitted");
      
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

      <div className="p-8 rounded-3xl bg-white border border-sky-100 card-shadow text-center  space-y-4">
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
<div className="h-full w-full flex flex-col gap-4 overflow-hidden ">  {/* Top Action Bar — just Back now, timer moved down into the progress panel */}
  
  {quizStatus === "taking" ? (
    
    <div className="flex-1 min-h-0 flex flex-col gap-4 m-6">
      <div className="flex items-center justify-between gap-4 py-2 border-b border-sky-100 flex-wrap shrink-0">
    <button
      onClick={onBack}
      className="text-sky-950 hover:text-sky-600 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider "
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
    <span className="text-[10px] font-black uppercase tracking-widest text-sky-500">
      Subject Area: <b className="text-sky-950">{quizSnapshot.subject}</b>
    </span>
    </div>

      {/* Combined Exam Progress + Timer bar — replaces the old linear progress bar */}
      <div className="shrink-0 flex items-center gap-3 p-3 rounded-2xl bg-white border border-sky-100 card-shadow">
        <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-sky-100">
          <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
          <span className="font-mono-custom font-black text-xs text-sky-950 whitespace-nowrap">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-2 overflow-x-auto no-scrollbar min-w-0">
          {questionsList.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`shrink-0 w-8 h-8 rounded-lg font-mono-custom text-[11px] font-black flex items-center justify-center transition border ${
                  isCurrent
                    ? "ring-2 ring-sky-500 border-transparent bg-sky-50 text-sky-800"
                    : isAnswered
                    ? "bg-sky-600 text-white border-transparent"
                    : "bg-sky-50/50 text-sky-900 border-sky-100 hover:bg-sky-100/30"
                }`}
              >
                {(idx + 1).toString().padStart(2, "0")}
              </button>
            );
          })}
        </div>

        <span className="shrink-0 pl-3 ml-auto border-l border-sky-100 text-[10px] font-black uppercase tracking-widest text-sky-500 whitespace-nowrap">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {/* MCQ Card — fills remaining space */}
      <div className="flex-1 min-h-0 p-5 md:p-8 rounded-3xl bg-white border border-sky-100 card-shadow flex flex-col gap-5 overflow-hidden">
        <div className="space-y-2 shrink-0">
          <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 rounded-md">
            {currentQuestion.subTopic || "Module Specific"}
          </span>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-sky-950 leading-snug font-sans">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Two-column options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 flex-1 content-start overflow-y-auto">
          {[
            { key: "A", value: currentQuestion.optionA },
            { key: "B", value: currentQuestion.optionB },
            { key: "C", value: currentQuestion.optionC },
            { key: "D", value: currentQuestion.optionD },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleSelectOption(option.key as any)}
              className={`w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all flex items-center gap-3 group scale-[0.99] active:scale-[0.98] ${getOptionClass(option.key as any, option.value)}`}
            >
              <span
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-display text-xs font-black border transition ${
                  selectedAnswers[currentQuestion.id] === option.key
                    ? "bg-sky-600 text-white border-transparent"
                    : "bg-sky-50/50 text-sky-905 border-sky-100 text-sky-800"
                }`}
              >
                {option.key}
              </span>
              <span className="text-xs md:text-sm text-sky-950/90 font-semibold select-none leading-relaxed">
                {option.value}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation — always visible at the bottom, never needs scrolling to reach */}
      <div className="shrink-0 flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-sky-100 text-sky-900 bg-white rounded-xl hover:bg-sky-50 disabled:opacity-40 disabled:hover:bg-white text-xs font-black uppercase tracking-wider flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        {

        currentQuestionIndex === totalQuestions - 1 ? (
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
  ) :  (
        /* =====================================================================
           SUBMITTED / DETAILED REVIEW MODE: Show answers & incorrect explanations
           ===================================================================== */
        <div className="space-y-8 animate-fade-in mx-8">
{/* Diagnostic Stats Result Summary */}

<div
  className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/60 to-white card-shadow"
  style={{
    marginLeft: "calc(-50vw + 50%)",
    marginRight: "calc(-50vw + 50%)",
    width: "auto",
    marginTop: "-1.5rem",
  }}
>
  {/* Back button, overlaid top-left */}
  <button
    onClick={onBack}
    className="absolute top-6 left-6 md:top-8 md:left-8 z-20 text-sky-950 hover:text-sky-600 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider"
  >
    <ArrowLeft className="w-4 h-4" /> Back
  </button>

  {/* Soft glow blob */}
  <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl" />
  
  <div className="relative z-10 p-8 md:p-12 text-center space-y-6">
    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-black uppercase text-orange-700 bg-orange-100 border border-orange-200 rounded-full tracking-widest">
      <TrendingUp className="w-3.5 h-3.5" /> Practice paper results
    </span>

    <div className="space-y-2">
      <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight text-sky-950">
        {attemptResult ? (
          <>
            You scored{" "}
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {attemptResult.percentage}%
            </span>
          </>
        ) : (
          quizSnapshot.title
        )}
      </h2>
      <p className="text-sm text-slate-500 font-semibold leading-relaxed max-w-lg mx-auto">
        Review mistakes to fix weak concepts before the actual MDCAT exam.
      </p>
    </div>

    {attemptResult && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto pt-2">
        <div className="rounded-2xl bg-white card-shadow border-t-4 border-sky-500 p-5">
          <div className="text-3xl font-black text-sky-950 font-mono-custom">
            {attemptResult.totalQuestions}
          </div>
          <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">
            Total MCQs
          </div>
        </div>
        <div className="rounded-2xl bg-white card-shadow border-t-4 border-emerald-500 p-5">
          <div className="text-3xl font-black text-emerald-600 font-mono-custom">
            {attemptResult.score}
          </div>
          <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">
            Correct
          </div>
        </div>
        <div className="rounded-2xl bg-white card-shadow border-t-4 border-rose-500 p-5">
          <div className="text-3xl font-black text-rose-600 font-mono-custom">
            {attemptResult.totalQuestions - attemptResult.score}
          </div>
          <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider mt-1">
            Incorrect
          </div>
        </div>
      </div>
    )}
  </div>
</div>

{/* AI Concept Summarizer Master Panel */}
{incorrectQuestions.length > 0 && (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1b4b] via-[#312663] to-[#1e1b4b] card-shadow">
    {/* Ambient glow orbs */}
    <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-violet-500/30 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-24 -left-10 w-64 h-64 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />

    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center p-8 md:p-10">
      {/* Left: copy + CTA */}
      <div className="space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase text-violet-200 bg-white/10 border border-white/10 rounded-full tracking-widest backdrop-blur-sm">
          <Sparkles className="w-3 h-3" /> AI Revision Hub
        </span>

        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
          Concept Summarizer
          <br className="hidden md:block" /> Master Sheet
        </h3>

        <p className="text-sm text-violet-100/70 font-semibold max-w-lg leading-relaxed">
          One tap turns your{" "}
          <span className="text-white font-black">
            {incorrectQuestions.length} missed topics
          </span>{" "}
          into a single high-yield cheat sheet — core mechanisms, formulas,
          and mnemonics, bundled for fast revision.
        </p>

        <button
          onClick={handleRequestMasterConceptSummary}
          disabled={isGeneratingMaster}
          className="mt-2 px-6 py-3.5 bg-white hover:bg-violet-50 text-violet-900 font-black uppercase text-[11px] tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-violet-950/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer w-fit"
        >
          <Sparkles
            className={`w-4 h-4 text-violet-600 ${isGeneratingMaster ? "animate-pulse" : "animate-pulse"}`}
          />
          {isGeneratingMaster
            ? "Generating Master Summary Sheet..."
            : "Generate Missed Concepts Cheat Sheet"}
        </button>
      </div>

      {/* Right: floating stat badge */}
      <div className="justify-self-center lg:justify-self-end">
        <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-sm flex flex-col items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-300">
          <BookOpen className="w-6 h-6 text-violet-200 mb-1" />
          <div className="text-4xl font-black text-white font-mono-custom">
            {incorrectQuestions.length}
          </div>
          <div className="text-[9px] uppercase font-black text-violet-200 tracking-widest mt-1">
            Weak Topics
          </div>
        </div>
      </div>
    </div>

{/* Master Summary output display */}
{masterSummary && (
  <div className="relative z-10 mx-8 md:mx-10 mb-8 md:mb-10 p-6 bg-white/95 backdrop-blur border border-white/20 rounded-2xl shadow-xl animate-fade-in space-y-4">
    <div className="flex items-center justify-between border-b border-violet-100 pb-3">
      <span className="text-[10px] text-violet-600 font-extrabold uppercase tracking-widest flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 fill-violet-100" />
        High-Yield Revision Sheet
      </span>

      <button
        onClick={() => setMasterSummary("")}
        className="text-[9px] font-black uppercase text-rose-600 hover:text-rose-700 tracking-wider flex items-center gap-0.5 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded"
      >
        <X className="w-3 h-3" />
        Close
      </button>
    </div>

    <div className="prose-summary text-sky-950">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-base font-black uppercase tracking-tight text-violet-900 mb-3">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-black uppercase tracking-wide text-violet-800 mt-5 mb-2 pb-1 border-b border-violet-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-black uppercase tracking-wide text-violet-700 mt-4 mb-1.5">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-xs font-semibold text-sky-950/90 leading-relaxed mb-3">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-black text-sky-950">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 mb-3 pl-1">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="text-xs font-semibold text-sky-950/90 leading-relaxed flex gap-2">
              <span className="text-violet-400 mt-0.5">•</span>
              <span>{children}</span>
            </li>
          ),
          hr: () => <hr className="border-violet-100 my-4" />,
        }}
      >
        {masterSummary}
      </ReactMarkdown>
    </div>
  </div>
)}
  </div>
)}

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
                          "bg-sky-100 text-sky-700";

                        if (isThisCorrectOption) {
                          optionStyle =
                            "border-emerald-400 bg-emerald-50/50 text-sky-950 border-2 card-shadow";
                          badgeStyle = "bg-emerald-500 text-white font-black";
                        } else if (isThisSelectedByStudent && !isCorrect) {
                          optionStyle =
                            "border-rose-400 bg-rose-50/50 text-sky-950 border-2";
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
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs text-sky-900 pl-4 relative space-y-2.5">
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
                            <Sparkles className="w-3 h-3 fill-sky-200" /> Zaheen
                            AI Masterclass Explanation:
                          </div>
                          <div className="text-sky-900">
                            <ReactMarkdown components={markdownComponents}>
                              {aiExplanationMap[question.id]}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Concept Summarizer Segment */}
                    {!isCorrect && (
                      <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 text-xs text-violet-900 relative space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-violet-700 font-black uppercase tracking-wider text-[10px]">
                            <BookOpen className="w-4 h-4 text-violet-600" /> AI
                            Concept Summarizer 🧠
                          </div>

                          <button
                            onClick={() =>
                              handleRequestConceptSummary(question)
                            }
                            disabled={isSummarizingMap[question.id]}
                            className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider bg-violet-600 hover:bg-violet-700 text-white rounded-lg flex items-center gap-1 cursor-pointer disabled:opacity-55 self-start transition-all"
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
                              <Sparkles className="w-3 h-3 fill-violet-200" />{" "}
                              Bulleted Concept Summary:
                            </div>
                            <div className="text-violet-950">
                              <ReactMarkdown components={conceptMarkdownComponents}>
                                {conceptSummaryMap[question.id]}
                              </ReactMarkdown>
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
      )}
    </div>
  );
}
