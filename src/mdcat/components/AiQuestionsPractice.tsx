import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { Sparkles, ClipboardList, Target, CheckCircle2, ArrowRight } from "lucide-react";
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
});

// Splits a flat array into chunks of `size`, e.g. [1..45] with size 20 -> [[1..20],[21..40],[41..45]]
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

interface AIQuestionsPracticeProps {
  setActiveQuiz: (quiz: Quiz) => void;
}

export default function AIQuestionsPractice({ setActiveQuiz }: AIQuestionsPracticeProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [aiQuizzes, setAiQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(mdcatApi("/api/mdcat/quizzes/getAIQuestions"))
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const raw = json.data ?? json;
        const allQuestions = (Array.isArray(raw) ? raw : []).map(mapQuestion);

        const chunks = chunkArray(allQuestions, 20);
        const quizzes: Quiz[] = chunks.map((questions, idx) => ({
          id: 9999 * 1000 + idx, // synthetic id per chunk, e.g. 9999000, 9999001...
          title: `AI Generated Set ${idx + 1}`,
          subject: "MIXED",
          subTopic: "AI Generated",
          questions,
        } as Quiz));

        setAiQuizzes(quizzes);
      })
      .catch((e) => console.error("Failed to load AI questions", e))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingFrame />;
  }

  if (aiQuizzes.length === 0) {
    return (
      <div className="py-16 text-center space-y-2">
        <p className="text-sky-400 text-xs font-bold uppercase tracking-wider">
          No AI-generated questions available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto">
      {aiQuizzes.map((quiz) => (
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
                navigate("/login", { state: { from: location.pathname } });
                return;
              }
              setActiveQuiz({ ...quiz, id: 9999 });
              navigate("/mdcat/ai-quiz");
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
  );
}