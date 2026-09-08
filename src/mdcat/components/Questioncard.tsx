import React from "react";
import { ArrowRight, CalendarClock } from "lucide-react";

export interface RepeatedQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  subject: string;
  sub_topic: string;
  year_count: number;
  occurrence_count: number;
  years: string;
}

export interface QuestionCardProps {
  item: RepeatedQuestion;
  onSelect: (item: RepeatedQuestion) => void;
}

export default function QuestionCard({ item, onSelect }: QuestionCardProps) {
  return (
    <button
      onClick={() => onSelect(item)}
      className="w-full h-full text-left rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 flex flex-col"
    >
      <p className="text-[15px] leading-snug font-semibold text-slate-800 pr-2 line-clamp-2 flex-1">
        {item.question_text}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          <CalendarClock size={13} strokeWidth={2.25} />
          Repeated in {item.year_count} years
        </span>
        {item.subject && (
          <span className="text-xs font-medium text-blue-700 bg-blue-100 rounded-full px-2.5 py-1">
            {item.subject}
          </span>
        )}
        {item.sub_topic && (
          <span className="text-xs text-slate-500">{item.sub_topic}</span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
        See details
        <ArrowRight size={13} strokeWidth={2.5} />
      </div>
    </button>
  );
}