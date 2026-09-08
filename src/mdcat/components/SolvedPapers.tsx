import { useMemo, useState } from "react";
import questions, { type Question, type CorrectOption } from "../data/Questionsdata";

const SUBJECT_STYLE: Record<string, string> = {
  Biology: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Chemistry: "bg-violet-50 text-violet-700 ring-violet-200",
  Physics: "bg-sky-50 text-sky-700 ring-sky-200",
  English: "bg-amber-50 text-amber-700 ring-amber-200",
  "Psychological Test": "bg-rose-50 text-rose-700 ring-rose-200",
};

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "bg-teal-50 text-teal-700 ring-teal-200",
  Moderate: "bg-orange-50 text-orange-700 ring-orange-200",
  Hard: "bg-red-50 text-red-700 ring-red-200",
};

const COGNITIVE_STYLE: Record<string, string> = {
  Recall: "bg-blue-50 text-blue-700 ring-blue-200",
  Application: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

const TOPIC_STYLE = "bg-slate-50 text-slate-600 ring-slate-200";

interface PillProps {
  children: React.ReactNode;
  className: string;
}

function Pill({ children, className }: PillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

const LETTERS: CorrectOption[] = ["a", "b", "c", "d"];

interface QuestionCardProps {
  q: Question;
}

function QuestionCard({ q }: QuestionCardProps) {
  return (
    <div className="rounded-2xl bg-[#121214] p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-white sm:text-base">
          <span className="text-neutral-500">Q{q.id}. </span>
          {q.questionText}
        </h3>
      </div>

      <ul className="mb-4 space-y-1.5">
        {q.options.map((opt, i) => {
          const letter = LETTERS[i];
          const isCorrect = letter === q.correct_option;
          return (
            <li
              key={letter}
              className={`text-sm leading-relaxed ${
                isCorrect
                  ? "font-semibold text-emerald-400"
                  : "text-neutral-400"
              }`}
            >
              {letter.toUpperCase()}. {opt}
              {isCorrect && <span className="ml-1.5">✓</span>}
            </li>
          );
        })}
      </ul>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <Pill className={SUBJECT_STYLE[q.subject] || TOPIC_STYLE}>
          {q.subject}
        </Pill>
        <Pill className={TOPIC_STYLE}>{q.topic}</Pill>
        <Pill className={DIFFICULTY_STYLE[q.difficulty] || TOPIC_STYLE}>
          {q.difficulty}
        </Pill>
        <Pill className={COGNITIVE_STYLE[q.cognitive_level] || TOPIC_STYLE}>
          {q.cognitive_level}
        </Pill>
      </div>

      <div className="rounded-xl bg-white/[0.04] p-3.5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Explanation
        </p>
        <p className="text-sm leading-relaxed text-neutral-300">
          {q.explanation}
        </p>
      </div>
    </div>
  );
}

export default function SolvedPaper() {
  const [search, setSearch] = useState<string>("");
  const [subject, setSubject] = useState<string>("All");

  const subjects = useMemo<string[]>(
    () => ["All", ...Array.from(new Set(questions.map((q) => q.subject)))],
    []
  );

  const filtered = useMemo<Question[]>(() => {
    const term = search.trim().toLowerCase();
    return questions.filter((q) => {
      const matchesSubject = subject === "All" || q.subject === subject;
      const matchesSearch =
        !term ||
        q.questionText.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term);
      return matchesSubject && matchesSearch;
    });
  }, [search, subject]);

  return (
    <div className="min-h-screen bg-[#eef3fb]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            NUMS MDCAT 2026 — Predicted Paper, Fully Solved
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {questions.length} questions · answer key, subject, topic,
            difficulty, and explanation for each
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question or topic…"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-1.5">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSubject(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset transition-colors ${
                  subject === s
                    ? "bg-blue-600 text-white ring-blue-600"
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 text-xs text-slate-400">
          Showing {filtered.length} of {questions.length}
        </p>

        <div className="space-y-4">
          {filtered.map((q) => (
            <QuestionCard key={q.id} q={q} />
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">
              No questions match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}