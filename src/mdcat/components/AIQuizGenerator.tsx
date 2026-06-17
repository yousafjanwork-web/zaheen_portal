/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import {
  Plus,
  Sparkles,
  AlertCircle,
  BookOpen,
  CheckCircle,
  HelpCircle,
  BookMarked,
  Brain,
  Lightbulb,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MDCATSubject, Quiz } from "../types";
import { mdcatAiApi } from "../config";

interface AIQuizGeneratorProps {
  onQuizGenerated: (quiz: Quiz) => void;
  onBack: () => void;
}

export default function AIQuizGenerator({
  onQuizGenerated,
  onBack,
}: AIQuizGeneratorProps) {
  const [subject, setSubject] = useState<MDCATSubject>("Biology");
  const [subTopic, setSubTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium",
  );
  const [questionCount, setQuestionCount] = useState("5");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Encouraging PMDC syllabus loading tips during AI generation sequence
  const [loadingTipIndex, setLoadingTipIndex] = useState(0);
  const tips = [
    "Aligning questions with Pakistan PMDC National MDCAT guidelines...",
    "Curating questions matching UHS, KMU, and Sindh Board standard paradigms...",
    "Engineering high-fidelity distractor options to challenge conceptual understanding...",
    "Constructing detailed analytical step-by-step explanations and references...",
    "Configuring logical and analytical parameters for English and Analytical reasoning...",
  ];

  // Rotate tips during loading
  useState(() => {
    const loaderInterval = setInterval(() => {
      setLoadingTipIndex((prev) => (prev + 1) % tips.length);
    }, 2800);
    return () => clearInterval(loaderInterval);
  });

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    const prompt = `Generate exactly ${questionCount} MDCAT ${difficulty} level MCQ questions for subject: ${subject}, topic: ${subTopic.trim() || "General PMDC Syllabus Concepts"}.

Return ONLY a valid JSON object with no extra text, no markdown, no code fences. Use this exact structure:
{
  "id": 9999,
  "title": "AI Generated ${subject} Quiz",
  "subject": "${subject}",
  "subTopic": "${subTopic.trim() || "General PMDC Syllabus Concepts"}",
  "difficulty": "${difficulty}",
  "isAiGenerated": true,
  "questions": [
    {
      "id": 1,
      "questionText": "Question here?",
      "optionA": "Option A",
      "optionB": "Option B",
      "optionC": "Option C",
      "optionD": "Option D",
      "correctOption": "A",
      "explanation": "Explanation here.",
      "subject": "${subject}",
      "subTopic": "${subTopic.trim() || "General"}"
    }
  ]
}`;

    try {
      const response = await fetch(
        mdcatAiApi("/api/mdcat/chat"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: prompt,
            subject: subject,
            language: "English",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            "Failed to generate MDCAT exam. Verify connection settings.",
        );
      }

      const result = await response.json();
      const replyText: string = result?.data?.reply || "";

      // Strip markdown code fences if present
      const clean = replyText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Extract JSON object from the reply
      const jsonStart = clean.indexOf("{");
      const jsonEnd = clean.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("AI did not return a valid quiz format. Please try again.");
      }

      const generatedQuiz: Quiz = JSON.parse(clean.slice(jsonStart, jsonEnd + 1));
      onQuizGenerated(generatedQuiz);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message ||
          "Connecting server failed. Sourcing standard test questions.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-sky-100">
        <div>
          <h2 className="text-xl md:text-2xl font-black uppercase text-sky-950 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sky-600 animate-pulse" />
            AI Custom Exams
          </h2>
          <p className="text-xs font-bold text-sky-500 uppercase tracking-tight">
            Formulate high-fidelity MDCAT practice papers dynamically.
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-sky-900 hover:text-sky-600 text-[10px] font-black uppercase tracking-wider px-3.5 py-2 border border-sky-100 rounded-xl bg-white hover:bg-sky-50/50 transition-all card-shadow"
        >
          Cancel
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 rounded-3xl bg-white border border-sky-100 card-shadow"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Error box */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 text-rose-800 text-sm flex items-start gap-2.5 border border-rose-100">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <p className="font-bold">{errorMsg}</p>
                </div>
              )}

              {/* Subject area details */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-sky-455 text-sky-500 block uppercase tracking-widest">
                  MDCAT Subject Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {(
                    [
                      "Biology",
                      "Chemistry",
                      "Physics",
                      "English",
                      "Logical Reasoning",
                    ] as MDCATSubject[]
                  ).map((subj) => (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => setSubject(subj)}
                      className={`p-3 text-[10px] font-black uppercase tracking-wider rounded-xl text-center border-2 transition-all ${subject === subj ? "border-sky-500 bg-sky-50 text-sky-900 shadow-xs scale-[1.01]" : "border-sky-50/50 bg-sky-50/20 text-sky-950/75 hover:border-sky-100/80 hover:bg-sky-50/40"}`}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Topics Text */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-sky-500">
                  <label>Focus Subtopics / Chapters</label>
                  <span className="text-slate-400 normal-case font-bold tracking-tight">
                    e.g., Genetics, Alkyl Halides, Coulomb Law
                  </span>
                </div>
                <input
                  type="text"
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
                  placeholder="e.g. Cellular enzymes, chemical kinetics, Ohm's law, synonyms, syllogisms"
                  className="w-full p-3.5 text-xs font-bold uppercase tracking-wide border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-500 bg-sky-50/30 focus:bg-white transition text-sky-950"
                />
              </div>

              {/* Grid Difficulty & Question count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-500 block uppercase tracking-widest">
                    MDCAT Core Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-3 text-xs font-bold uppercase tracking-wider border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-500 bg-sky-50/30 bg-white text-sky-950"
                  >
                    <option value="Easy">Easy (Foundation builder)</option>
                    <option value="Medium">Medium (MDCAT standard)</option>
                    <option value="Hard">Hard (High target challenge)</option>
                  </select>
                </div>

                {/* Count */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-sky-500 block uppercase tracking-widest">
                    Question Count
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="w-full p-3 text-xs font-bold uppercase tracking-wider border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-500 bg-sky-50/30 bg-white text-sky-950"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions (Full drill)</option>
                  </select>
                </div>
              </div>

              {/* Guidance Info Panel */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs font-bold text-sky-900 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Our algorithm compiles custom questions testing core concepts,
                  logic traps, and typical MD-CAT exam format traps. Every
                  practice question has interactive steps, allowing immediate
                  incorrect-concept corrections.
                </p>
              </div>

              {/* Submit Trigger */}
              <button
                type="submit"
                className="w-full p-4 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 transform hover:scale-[1.005]"
              >
                <Sparkles className="w-4 h-4 fill-white text-white animate-pulse" />
                Compile Practice Exam
              </button>
            </form>
          </motion.div>
        ) : (
          /* =====================================================================
             LOADING sequence: interactive medical guidelines tips animation
             ===================================================================== */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-12 text-center rounded-3xl bg-white border border-sky-100 card-shadow space-y-8 flex flex-col items-center justify-center min-h-[380px]"
          >
            {/* Spinning Brain AI visual graphic */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-sky-100 border-t-sky-600 animate-spin flex items-center justify-center font-bold"></div>
              <Brain className="w-7 h-7 text-sky-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
            </div>

            <div className="space-y-2.5 max-w-sm">
              <h3 className="text-sm font-black uppercase text-sky-950 tracking-wider">
                Generating Subject Models
              </h3>

              {/* Staggered text rotator */}
              <p className="text-[10px] font-bold text-sky-500 uppercase tracking-tight h-10 transition-all flex items-center justify-center">
                {tips[loadingTipIndex]}
              </p>
            </div>

            <div className="w-full max-w-xs bg-sky-50/50 h-2 rounded-full overflow-hidden border border-sky-100">
              <div className="h-full bg-sky-600 animate-infinite-loading rounded-full"></div>
            </div>

            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center">
              <Cpu className="w-3.5 h-3.5 text-sky-600" /> Powered by Zaheen AI
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
