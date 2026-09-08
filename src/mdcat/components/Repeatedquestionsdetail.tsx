import React from "react";
import { ArrowLeft, CalendarClock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RepeatedQuestion } from "./Questioncard";

const OPTION_KEYS: Array<RepeatedQuestion["correct_option"]> = ["A", "B", "C", "D"];

interface OptionRowProps {
  label: string;
  text: string;
  isCorrect: boolean;
}

function OptionRow({ label, text, isCorrect }: OptionRowProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3.5 ${
        isCorrect
          ? "border-green-300 bg-green-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isCorrect
            ? "bg-green-600 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {label}
      </span>
      <p
        className={`text-[14px] leading-snug ${
          isCorrect ? "text-green-900 font-medium" : "text-slate-700"
        }`}
      >
        {text}
      </p>
      {isCorrect && (
        <CheckCircle2
          size={18}
          className="ml-auto shrink-0 text-green-600"
          strokeWidth={2.25}
        />
      )}
    </div>
  );
}

export interface RepeatedQuestionsDetailProps {
  item: RepeatedQuestion;
  onBack: () => void;
}

export default function RepeatedQuestionsDetail({
  item,
  onBack,
}: RepeatedQuestionsDetailProps) {
  const navigate = useNavigate();
  const years = (item.years || "")
    .split(",")
    .map((y) => y.trim())
    .filter(Boolean);

  const handleBack = () => {
    onBack();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 0);
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-50 hover:text-white transition-colors"
        >
          <ArrowLeft size={15} strokeWidth={2.5} />
          Back to repeated questions
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
              <CalendarClock size={13} strokeWidth={2.25} />
              Repeated in {item.year_count} years
            </span>
            <span className="text-xs font-medium text-blue-700 bg-blue-100 rounded-full px-2.5 py-1">
              {item.subject}
            </span>
            <span className="text-xs text-slate-500">{item.sub_topic}</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-900 leading-snug">
            {item.question_text}
          </h2>
        </div>

        <div className="space-y-2.5">
          {OPTION_KEYS.map((key) => {
            const optionField = `option_${key.toLowerCase()}` as keyof RepeatedQuestion;
            const text = item[optionField] as string;
            if (!text) return null;
            return (
              <OptionRow
                key={key}
                label={key}
                text={text}
                isCorrect={item.correct_option === key}
              />
            );
          })}
        </div>

        {item.explanation && (
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1.5">
              Explanation
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              {item.explanation}
            </p>
          </div>
        )}

        {years.length > 0 && (
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2.5">
              Appeared in
            </p>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <span
                  key={y}
                  className="text-sm font-medium text-slate-700 bg-slate-100 rounded-lg px-3 py-1"
                >
                  {y}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}