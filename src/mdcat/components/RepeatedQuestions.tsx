import React, { useState, useRef } from "react";
import QuestionCard, { type RepeatedQuestion } from "./Questioncard";
import RepeatedQuestionsDetail from "./Repeatedquestionsdetail";
import { useAuth } from "@/modules/shared/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useMdcatAuthOverlay } from "../context/MdcatAuthOverlayContext";

export interface RepeatedQuestionsProps {
  data?: RepeatedQuestion[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function RepeatedQuestions({ data, loading, hasMore, onLoadMore }: RepeatedQuestionsProps) {
  const [selected, setSelected] = useState<RepeatedQuestion | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { openOverlay } = useMdcatAuthOverlay();

  const handleBack = () => {
    setSelected(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  };

  return (
    <div ref={topRef} className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Repeated questions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Questions that have appeared across multiple past paper years.
          </p>
        </div>

        {selected ? (
          <RepeatedQuestionsDetail
            item={selected}
            onBack={handleBack}
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 items-start">
              {(data ?? []).map((item) => (
                <div key={item.id} className="h-full">
                  <QuestionCard
                  item={item}
                  onSelect={(q) => {
                    if (!isLoggedIn) {
                      openOverlay("login");
                      return;
                    }
                    setSelected(q);
                  }}
                />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more questions"
                  )}
                </button>
              </div>
            )}

            {!hasMore && (data ?? []).length > 0 && (
              <p className="text-center text-xs text-slate-400 mt-6 font-medium">
                All questions loaded
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}