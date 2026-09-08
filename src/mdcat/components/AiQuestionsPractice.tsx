import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { Sparkles, ClipboardList, Target, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Quiz } from "./types";
import LoadingFrame from "../components/LoadingFrame";
import { mdcatAiApi, mdcatApi } from "../config";

const mapQuestion = (q: any) => ({
  ...q,
  questionText: q.questionText ?? q.question_text ?? "",
  optionA: q.optionA ?? q.option_a ?? "",
  optionB: q.optionB ?? q.option_b ?? "",
  optionC: q.optionC ?? q.option_c ?? "",
  optionD: q.optionD ?? q.option_d ?? "",
  correctOption: q.correctOption ?? q.correct_option ?? "A",
  subTopic: q.subTopic ?? q.sub_topic ?? "",
  subject: q.subject ?? q.subject_name ?? q.subjectArea ?? "",
});

// Splits a flat array into chunks of `size`, e.g. [1..45] with size 20 -> [[1..20],[21..40],[41..45]]
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const SUBJECT_PILLS = [
  { key: "MIXED", label: "Mixed" },
  { key: "English", label: "English" },
  { key: "Logical Reasoning", label: "Logical Reasoning" },
  { key: "Biology", label: "Biology" },
  { key: "Chemistry", label: "Chemistry" },
  { key: "Physics", label: "Physics" },
] as const;

type SubjectKey = (typeof SUBJECT_PILLS)[number]["key"];

const QUIZZES_PER_PAGE = 3; // one row on lg screens (lg:grid-cols-3)

interface AIQuestionsPracticeProps {
  setActiveQuiz: (quiz: Quiz) => void;
}

export default function AIQuestionsPractice({ setActiveQuiz }: AIQuestionsPracticeProps) {
const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>("MIXED");
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch(mdcatApi("/api/mdcat/quizzes/getAIQuestions"))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const raw = json.data ?? json;
        const mapped = (Array.isArray(raw) ? raw : []).map(mapQuestion);
        setAllQuestions(mapped);
      })
      .catch((e) => console.error("Failed to load AI questions", e))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  // Reset to page 1 whenever the selected subject changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedSubject]);

  // Group questions by subject
  const subjectQuestions = useMemo(() => {
    const groups: Record<string, any[]> = {
      Physics: [],
      Biology: [],
      Chemistry: [],
      English: [],
      "Logical Reasoning": [],
    };

    allQuestions.forEach((q) => {
      const subj = Object.keys(groups).find(
        (key) => key.toLowerCase() === String(q.subject).toLowerCase()
      );
      if (subj) groups[subj].push(q);
    });

    return groups;
  }, [allQuestions]);

  const physicsQuestions = subjectQuestions["Physics"];
  const biologyQuestions = subjectQuestions["Biology"];
  const chemistryQuestions = subjectQuestions["Chemistry"];
  const englishQuestions = subjectQuestions["English"];
  const logicalReasoningQuestions = subjectQuestions["Logical Reasoning"];

  // Counts per subject, shown next to pills — number of QUIZZES (chunks of 20), not raw question count
  const subjectCounts = useMemo(() => {
    const quizCount = (arr: any[]) => Math.ceil(arr.length / 20);

    return {
      MIXED: quizCount(allQuestions),
      Physics: quizCount(physicsQuestions),
      Biology: quizCount(biologyQuestions),
      Chemistry: quizCount(chemistryQuestions),
      English: quizCount(englishQuestions),
      "Logical Reasoning": quizCount(logicalReasoningQuestions),
    };
  }, [allQuestions, physicsQuestions, biologyQuestions, chemistryQuestions, englishQuestions, logicalReasoningQuestions]);

  // Build quizzes (chunks of 20) from whichever question array is currently selected
  const aiQuizzes: Quiz[] = useMemo(() => {
    const sourceMap: Record<SubjectKey, any[]> = {
      MIXED: allQuestions,
      Physics: physicsQuestions,
      Biology: biologyQuestions,
      Chemistry: chemistryQuestions,
      English: englishQuestions,
      "Logical Reasoning": logicalReasoningQuestions,
    };

    const source = sourceMap[selectedSubject];
    const chunks = chunkArray(source, 20);

    return chunks.map((questions, idx) => ({
      id: 9999 * 1000 + idx, // synthetic id per chunk, e.g. 9999000, 9999001...
      title: `${selectedSubject === "MIXED" ? "AI Generated" : selectedSubject} Set ${idx + 1}`,
      subject: selectedSubject === "MIXED" ? "MIXED" : selectedSubject,
      subTopic: "AI Generated",
      questions,
    } as Quiz));
  }, [selectedSubject, allQuestions, physicsQuestions, biologyQuestions, chemistryQuestions, englishQuestions, logicalReasoningQuestions]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(aiQuizzes.length / QUIZZES_PER_PAGE));

  const paginatedQuizzes = useMemo(() => {
    const start = currentPage * QUIZZES_PER_PAGE;
    return aiQuizzes.slice(start, start + QUIZZES_PER_PAGE);
  }, [aiQuizzes, currentPage]);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  if (loading) {
    return <LoadingFrame />;
  }

  if (allQuestions.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
          No AI-generated questions available.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      {/* Subject filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {SUBJECT_PILLS.map((pill) => {
          const isActive = selectedSubject === pill.key;
          const count = subjectCounts[pill.key];
          return (
            <button
              key={pill.key}
              onClick={() => setSelectedSubject(pill.key)}
              className={`px-3.5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                  : "bg-white text-sky-700 border-sky-100 hover:border-sky-300 hover:bg-sky-50"
              }`}
            >
              {pill.label}
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-sky-50 text-sky-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {aiQuizzes.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
            No questions available for {selectedSubject}.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-100 border border-sky-100 card-shadow flex flex-col gap-5 hover:border-sky-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-sky-950 leading-tight">
                        {quiz.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                        Practice
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase text-sky-700 bg-sky-50 rounded-md shrink-0">
                    AI
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-sky-400" />
                    {quiz.subject}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-sky-400" />
                    {quiz.questions.length} Questions
                  </span>
                </div>

                <ul className="space-y-2 flex-1">
                  <li className="flex items-start gap-2 text-xs text-slate-600 font-semibold leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <span>{quiz.title}</span>
                  </li>
                </ul>

               <button
                  onClick={() => {
                    if (!isLoggedIn) {
                    navigate("/login", { state: { from: location.pathname, mdcat: true } });
                      return;
                    }
                    setActiveQuiz({ ...quiz, id: 9999 });
                    navigate(location.pathname.includes("mdcat-mobile") ? "/mdcat-mobile/ai-quiz" : "/mdcat/ai-quiz");
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black uppercase text-[11px] tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition card-shadow"
                >
                  Practice online
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 hover:border-sky-300 transition-all shrink-0"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentPage ? "w-6 bg-sky-600" : "w-2 bg-sky-200 hover:bg-sky-300"
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-sky-100 bg-white text-sky-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 hover:border-sky-300 transition-all shrink-0"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Page {currentPage + 1} of {totalPages}
          </p>
        </>
      )}
    </div>
  );
}