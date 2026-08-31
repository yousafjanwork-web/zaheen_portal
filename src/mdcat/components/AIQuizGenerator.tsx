/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
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
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MDCATSubject, Quiz } from "../types";
import { MDCAT_AI_API, mdcatAiApi, mdcatApi } from "../config";
import SEO from "./SEO";
import AIQuestionsPractice from "./AiQuestionsPractice";
import { body } from "motion/react-client";

interface AIQuizGeneratorProps {
  onQuizGenerated?: (quiz: Quiz) => void;
  onBack?: () => void,
  setActiveQuiz : (quiz: Quiz) => void;
}

export default function AIQuizGenerator({
  onQuizGenerated,
  onBack,
  setActiveQuiz
}: AIQuizGeneratorProps) {
const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
  useEffect(() => {
    const loaderInterval = setInterval(() => {
      
      setLoadingTipIndex((prev) => (prev + 1) % tips.length);
    }, 2800);
    return () => clearInterval(loaderInterval);
  });

  useEffect(()=>
    {
      window.scrollTo(0,0)
    },[])

  const handleGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setIsGenerating(true);
    setErrorMsg(null);
    // works if u put a valid id like 1 in the prompt
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
      
      const response = await fetch(mdcatAiApi("/api/mdcat/chat"), {
        signal:AbortSignal.timeout(20000),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          subject: subject,
          language: "English",
        }),
      });
      

      if (!response.ok) {
        console.log(response)
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
        throw new Error(
          "AI did not return a valid quiz format. Please try again.",
        );
      }

      const generatedQuiz: Quiz = JSON.parse(
        clean.slice(jsonStart, jsonEnd + 1),
      );


            console.log("AI quiz generated")
      onQuizGenerated(generatedQuiz);

    } catch (err: any) {

       console.error(err.message);
       setErrorMsg(
         err.message ||
           "Connecting server failed. Sourcing standard test questions.",
       );
     
        try
        {

          const response = await fetch(mdcatApi("/api/mdcat/quizzes/AISubstituteQuestions"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subject: subject,
              subTopic: subTopic,
              questionCount:questionCount
            }),
          });
          if(!response.ok)
          {
            console.log(err.message)
            setErrorMsg(
           
             "Could not Find Replacement Quiz aswell.Please Try Again later",
            );
            return;
          }

          const rawquiz = await response.json();
          const rows = rawquiz.data || rawquiz; // array of question rows from DB

          const quiz: Quiz = {
            id: 9999,
            title: `AI Generated ${subject} Quiz`,
            subject: subject,
            subTopic: subTopic?.trim() || "General",
            difficulty: difficulty,
            isAiGenerated: true,
            questions: rows.map((row: any, index: number) => ({
              id: row.id ?? index + 1,
              questionText: row.question_text ?? row.questionText,
              optionA: row.option_a ?? row.optionA,
              optionB: row.option_b ?? row.optionB,
              optionC: row.option_c ?? row.optionC,
              optionD: row.option_d ?? row.optionD,
              correctOption: row.correct_option ?? row.correctOption,
              explanation: row.explanation,
              subject: row.subject ?? subject,
              subTopic: row.sub_topic ?? row.subTopic ?? subTopic,
            })),
          };
        
        console.log("sub quiz");
        onQuizGenerated(quiz);
        }
        catch(err:any)
        {
          setErrorMsg(
          err.message ||
           "Could not Find Replacement Quiz aswell.Please Try Again later",
          );
        }
       
      
    } finally {
      setIsGenerating(false);
    }
  };

  const viewPastAIPapers = () =>
  {
    document.getElementById("ai-practice-questions")?.scrollIntoView();
  }

  return (
    <div className="max-w-2xl m-8 lg:max-w-3xl xl:max-w-4xl mx-auto space-y-8">


     <SEO
      title="AI-Generated MDCAT Practice Exams — Custom MCQs by Topic"
      description="Generate custom MDCAT MCQ practice exams by subject, topic, and difficulty level, powered by AI and aligned with PMDC, UHS, KMU, and Sindh board standards."
      path="/ai-prep"
      />


  {/* Header bar */}
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-sky-100">
  <div className="space-y-1">
    <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-sky-950 flex items-center gap-2">
      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 animate-pulse shrink-0" />
      AI Custom Exams
    </h2>
    <p className="text-[11px] sm:text-xs font-bold text-sky-500 uppercase tracking-tight">
      Formulate high-fidelity MDCAT practice papers dynamically.
    </p>
  </div>

  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-5 w-full sm:w-auto">
    <button
      onClick={viewPastAIPapers}
      className="text-white text-[11px] sm:text-sm bg-blue-500 hover:scale-102 font-black uppercase tracking-wider px-3 sm:px-4 py-2 sm:py-2.5 border border-sky-100 rounded-xl hover:bg-blue-600 transition-all shadow-sm whitespace-nowrap"
    >
      Past Quizzes
    </button>

    <button
      onClick={onBack}
      className="text-sky-900 hover:text-sky-600 hover:scale-102 text-[11px] sm:text-sm font-black uppercase tracking-wider px-3 sm:px-4 py-2 sm:py-2.5 border border-sky-100 rounded-xl bg-white hover:bg-sky-50/50 transition-all shadow-sm whitespace-nowrap"
    >
      Back to Home
    </button>
  </div>


      </div>
  <AnimatePresence mode="wait">
    {!isGenerating ? (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="p-7 md:p-12 rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-blue-50/60 border border-sky-100 shadow-xl shadow-sky-100/50"
      >
       <form onSubmit={handleGenerate} className="space-y-5">
  {/* Error box */}
  {errorMsg && (
    <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-sm flex items-start gap-2 border border-rose-100">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
      <p className="font-bold">{errorMsg}</p>
    </div>
  )}

  {/* Subject / Difficulty / Count row */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
    {/* Subject dropdown */}
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-sky-500 block uppercase tracking-widest">
        MDCAT Subject Area
      </label>
      <div className="relative">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value as MDCATSubject)}
          className="w-full appearance-none p-3 pr-9 text-xs font-black uppercase tracking-wider border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-400 bg-white text-sky-950 transition cursor-pointer shadow-sm"
        >
          {(
            [
              "Biology",
              "Chemistry",
              "Physics",
              "English",
              "Logical Reasoning",
            ] as MDCATSubject[]
          ).map((subj) => (
            <option 
            key={subj} 
            value={subj}
            className="bg-slate-900 text-slate-100 font-semibold p-3">
            {subj}
          </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-sky-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    {/* Difficulty */}
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-sky-500 block uppercase tracking-widest">
        Core Difficulty
      </label>
      <div className="relative">
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          className="w-full appearance-none p-3 pr-9 text-xs font-black uppercase tracking-wider border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-400 bg-white text-sky-950 transition cursor-pointer shadow-sm"
        >
          <option  className="bg-slate-900 text-slate-100 font-semibold p-3" value="Easy">Easy · Foundation</option>
          <option  className="bg-slate-900 text-slate-100 font-semibold p-3" value="Medium">Medium · Standard</option>
          <option  className="bg-slate-900 text-slate-100 font-semibold p-3" value="Hard">Hard · Challenge</option>
        </select>
        <ChevronDown className="w-4 h-4 text-sky-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>

    {/* Count */}
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-sky-500 block uppercase tracking-widest">
        Question Count
      </label>
      <div className="relative">
        <select
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
          className="w-full appearance-none p-3 pr-9 text-xs font-black uppercase tracking-wider border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-400 bg-white text-sky-950 transition cursor-pointer shadow-sm"
        >
          <option  className="bg-slate-900 text-slate-100 font-semibold p-3" value="5">5 Questions</option>
          <option  className="bg-slate-900 text-slate-100 font-semibold p-3" value="10">10 Questions</option>
          <option  className="bg-slate-900 text-slate-100 font-semibold p-3" value="15">15 · Full Drill</option>
        </select>
        <ChevronDown className="w-4 h-4 text-sky-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  </div>

  {/* Focus Topics Text */}
  <div className="space-y-1.5">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-[10px] uppercase font-black tracking-wider text-sky-500">
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
      className="w-full p-3 text-xs font-bold uppercase tracking-wide border-2 border-sky-100 rounded-xl focus:outline-hidden focus:border-sky-400 bg-white focus:bg-white transition text-sky-950 placeholder-slate-400 shadow-sm"
    />
  </div>

  {/* Guidance Info Panel */}
  <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs font-bold text-sky-900 flex items-start gap-2.5">
    <Lightbulb className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
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
    className="w-full p-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg shadow-sky-200 flex items-center justify-center gap-2 transform hover:scale-[1.005] cursor-pointer"
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
        className="p-12 md:p-16 text-center rounded-3xl bg-gradient-to-br from-white via-sky-50/40 to-blue-50/60 border border-sky-100 shadow-xl shadow-sky-100/50 space-y-9 flex flex-col items-center justify-center min-h-[380px]"
      >
        {/* Spinning Brain AI visual graphic */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin flex items-center justify-center font-bold"></div>
          <Brain className="w-7 h-7 text-sky-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
        </div>

        <div className="space-y-3 max-w-sm">
          <h3 className="text-sm font-black uppercase text-sky-950 tracking-wider">
            Generating Subject Models
          </h3>

          {/* Staggered text rotator */}
          <p className="text-[10px] font-bold text-sky-500 uppercase tracking-tight h-10 transition-all flex items-center justify-center">
            {tips[loadingTipIndex]}
          </p>
        </div>

        <div className="w-full max-w-xs bg-sky-50 h-2 rounded-full overflow-hidden border border-sky-100">
          <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 animate-infinite-loading rounded-full"></div>
        </div>

        <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center">
          <Cpu className="w-3.5 h-3.5 text-sky-500" /> Powered by Gemini AI
        </span>
      </motion.div>
    )}
    <div id="ai-practice-questions" className="scroll-mt-24">
    <AIQuestionsPractice setActiveQuiz={setActiveQuiz} />
    </div>
  </AnimatePresence>
</div>
  );
}
