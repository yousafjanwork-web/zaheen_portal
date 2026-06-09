import React, { useState } from 'react';
import { FaVolumeUp, FaArrowLeft, FaArrowRight, FaStar, FaBolt, FaBoxOpen } from 'react-icons/fa';
import { t, getLanguage } from "@/modules/shared/i18n";

export default function PrimaryGradesQuiz() {
  const [selectedOption, setSelectedOption] = useState<string>('A');
  const isUrdu = getLanguage() === "ur";

  const options = isUrdu
    ? [
        { id: 'A', display: 'الف (A)' },
        { id: 'B', display: 'ب (B)'  },
        { id: 'C', display: 'ج (C)'  },
        { id: 'D', display: 'د (D)'  },
      ]
    : [
        { id: 'A', display: 'A' },
        { id: 'B', display: 'B' },
        { id: 'C', display: 'C' },
        { id: 'D', display: 'D' },
      ];

  return (
    <div className={`min-h-screen bg-[#f4f7fa] p-4 md:p-8 flex justify-center items-start ${isUrdu ? 'font-urdu' : ''}`}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">

        <main className="lg:col-span-3 flex flex-col gap-6">
          <h1 className="text-[#0d53c7] text-3xl md:text-4xl font-black tracking-tight">
            {t("quiz.title")}
          </h1>

          {/* Progress */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3 font-bold text-sm">
              <span className="text-[#0d53c7] tracking-wider">{t("quiz.progress")}</span>
              <span className="text-[#4a5568]">{t("quiz.earned")}</span>
            </div>
            <div className="bg-[#edf2f7] rounded-full h-4 overflow-hidden">
              <div className="bg-[#057a55] h-full rounded-full" style={{ width: '30%' }} />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white border-t-8 border-t-[#0d53c7] border border-[#e2e8f0] rounded-3xl px-6 py-10 md:py-14 flex flex-col items-center text-center shadow-md">
            <button className="bg-[#e0eaff] text-[#0d53c7] rounded-full w-14 h-14 flex items-center justify-center hover:scale-105 transition-transform mb-6">
              <FaVolumeUp className="text-xl" />
            </button>
            <h2 className="text-[#1a202c] text-2xl md:text-3xl font-bold max-w-xl mb-10 leading-tight">
              {t("quiz.question")}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 w-full max-w-2xl">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`bg-white border-2 rounded-2xl py-8 px-4 flex flex-col items-center justify-center gap-2 transition-all ${
                    selectedOption === option.id
                      ? 'border-[#0d53c7] ring-1 ring-[#0d53c7]'
                      : 'border-[#edf2f7] hover:border-[#cbd5e1]'
                  }`}
                >
                  <span className={`text-2xl font-black ${selectedOption === option.id ? 'text-[#0d53c7]' : 'text-[#4a5568]'}`}>
                    {option.display}
                  </span>
                  {selectedOption === option.id && (
                    <span className="text-xs text-[#718096] font-medium">{t("quiz.select")}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <footer className="flex justify-between items-center mt-2">
            <button className="flex items-center gap-2 text-[#0d53c7] font-bold hover:text-[#0a43a0]">
              {isUrdu ? <FaArrowRight /> : <FaArrowLeft />} {t("quiz.prev")}
            </button>
            <button className="flex items-center gap-2 bg-[#0d53c7] text-white font-bold py-3 px-8 rounded-full shadow-lg">
              {t("quiz.next")} {isUrdu ? <FaArrowLeft /> : <FaArrowRight />}
            </button>
          </footer>
        </main>

        {/* Sidebar */}
        <aside className="lg:col-span-1 w-full">
          <div className="bg-white rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <h3 className="text-center text-[#0d53c7] text-lg font-bold">{t("quiz.rewards")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#ffeadd] text-[#c05621] rounded-2xl p-4 flex flex-col items-center">
                <FaStar className="text-2xl" />
                <span className="font-black text-xl">12</span>
              </div>
              <div className="bg-[#d1fae5] text-[#065f46] rounded-2xl p-4 flex flex-col items-center">
                <FaBolt className="text-2xl" />
                <span className="font-black text-xl">450</span>
              </div>
            </div>
            <div className="flex flex-col items-center text-center py-4 border-b-2 border-dashed border-[#edf2f7]">
              <div className="w-28 h-28 flex items-center justify-center">
                <FaBoxOpen className="text-5xl text-[#b7791f]" />
              </div>
              <span className="bg-[#1a202c] text-white text-[10px] font-black px-3 py-0.5 rounded-md">
                {t("quiz.locked")}
              </span>
              <p className="text-sm text-[#718096] font-bold mt-2">{t("quiz.goal")}</p>
            </div>
            <div className="bg-[#e6fffa] border-2 border-dashed border-[#319795] rounded-2xl p-5">
              <span className="bg-[#004d40] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                {t("quiz.tipLabel")}
              </span>
              <p className="text-[#234e52] text-sm mt-2">{t("quiz.tipText")}</p>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}