/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Check,
  Sparkles,
  Coffee,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MDCATSubject } from "../types";
import { mdcatApi } from "../config";

interface FocusTimerProps {
  onSessionLogged: () => void;
}

type TimerMode = "work" | "shortBreak" | "longBreak";

export default function FocusTimer({ onSessionLogged }: FocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>("work");
  const [subject, setSubject] = useState<MDCATSubject>("Biology");
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Keep track of total elapsed seconds in the block for logging
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const modeTimes: Record<TimerMode, number> = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  // Handle switching modes
  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeTimes[newMode]);
    setSecondsElapsed(0);
    setSavedSuccess(false);
  };

  // Timer Tick implementation
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);

            // Automatically log work sessions when fully completed!
            if (mode === "work") {
              logSession(Math.round(modeTimes.work / 60));
            }
            // Trigger browser native audio beep alert
            try {
              const audioCtx = new (
                window.AudioContext || (window as any).webkitAudioContext
              )();
              const oscillator = audioCtx.createOscillator();
              const gainNode = audioCtx.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              oscillator.type = "sine";
              oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
              gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
              oscillator.start();
              oscillator.stop(audioCtx.currentTime + 0.5);
            } catch (e) {
              console.log(
                "Audio Context beep not supported directly, running silent ring.",
              );
            }

            return 0;
          }
          setSecondsElapsed((elapsed) => elapsed + 1);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Log study session onto the dashboard
  const logSession = async (minutesToLog: number) => {
    if (minutesToLog <= 0) return;
    setIsSaving(true);
    try {
      const response = await fetch(
        mdcatApi("/api/mdcat/focus-sessions"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            duration: minutesToLog,
          }),
        },
      );
      if (response.ok) {
        setSavedSuccess(true);
        onSessionLogged(); // Refresh stats on dashboard
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to log study focus session:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Manual session logging
  const handleManualLog = () => {
    const mins = Math.max(1, Math.round(secondsElapsed / 60));
    logSession(mins);
    // Reset timer
    setTimeLeft(modeTimes[mode]);
    setIsRunning(false);
    setSecondsElapsed(0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = (timeLeft / modeTimes[mode]) * 100;

  return (
    <div
      id="pomodoro-focus-widget"
      className="bg-white p-5 rounded-3xl border border-sky-100 card-shadow space-y-4"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] uppercase font-black text-sky-400 tracking-widest flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-200" /> Pomodoro
          Timer
        </h4>
        <span className="px-2 py-0.5 text-[9px] font-black uppercase text-sky-600 bg-sky-50 rounded-md">
          {mode === "work" ? "Study Block" : "Relaxation Break"}
        </span>
      </div>

      {/* Modes Bar */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-sky-50/50 border border-sky-100 rounded-xl">
        <button
          onClick={() => handleModeChange("work")}
          className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
            mode === "work"
              ? "bg-sky-600 text-white card-shadow"
              : "text-sky-900 hover:bg-sky-150 hover:bg-sky-50"
          }`}
        >
          Study
        </button>
        <button
          onClick={() => handleModeChange("shortBreak")}
          className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
            mode === "shortBreak"
              ? "bg-sky-600 text-white card-shadow"
              : "text-sky-900 hover:bg-sky-150 hover:bg-sky-50"
          }`}
        >
          Short
        </button>
        <button
          onClick={() => handleModeChange("longBreak")}
          className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
            mode === "longBreak"
              ? "bg-sky-600 text-white card-shadow"
              : "text-sky-900 hover:bg-sky-150 hover:bg-sky-50"
          }`}
        >
          Long
        </button>
      </div>

      {/* Subject selector for study blocks */}
      {mode === "work" && (
        <div className="space-y-1">
          <label className="text-[8px] font-black uppercase text-sky-400 block tracking-wider">
            Target Syllabus Material
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as MDCATSubject)}
            className="w-full text-xs font-bold border border-sky-100 rounded-lg bg-sky-50/30 px-2 py-1.5 text-sky-900 focus:outline-none"
          >
            <option value="Biology">Biology Syllabus</option>
            <option value="Chemistry">Chemistry Syllabus</option>
            <option value="Physics">Physics Syllabus</option>
            <option value="English">MDCAT English</option>
            <option value="Logical Reasoning">Logical Reasoning</option>
          </select>
        </div>
      )}

      {/* Timer Circular/Aesthetic Ring & Numeric Block */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <div className="relative w-36 h-36 flex items-center justify-center bg-sky-50/30 rounded-full border border-sky-100/50">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              className="stroke-sky-100"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              className="stroke-sky-600 transition-all duration-300"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 64}`}
              strokeDashoffset={`${2 * Math.PI * 64 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
            />
          </svg>

          {/* Core numerical display */}
          <div className="text-center z-10">
            <div className="font-mono-custom text-3xl font-black text-sky-950 tracking-tight leading-none">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </div>
            {mode === "work" && secondsElapsed > 0 && (
              <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest block mt-1">
                Ticking: +{Math.round(secondsElapsed / 60)}m
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(modeTimes[mode]);
            setSecondsElapsed(0);
          }}
          className="w-8 h-8 rounded-full border border-sky-100 hover:border-sky-300 bg-sky-50/50 text-sky-600 flex items-center justify-center hover:scale-105 active:scale-95 transition"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white card-shadow active:scale-95 transition hover:scale-105 ${
            isRunning
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-sky-600 hover:bg-sky-700"
          }`}
        >
          {isRunning ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>

        {/* Manual logging when study sequence is stopped */}
        <button
          disabled={secondsElapsed < 15 || isSaving}
          onClick={handleManualLog}
          className={`w-8 h-8 rounded-full border text-emerald-600 flex items-center justify-center hover:scale-105 active:scale-95 transition ${
            secondsElapsed >= 15
              ? "border-emerald-100 bg-emerald-50/50 hover:border-emerald-300"
              : "opacity-40 cursor-not-allowed border-sky-100 bg-sky-50/20"
          }`}
          title="Log study time collected so far"
        >
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
        </button>
      </div>

      {/* Alert Messaging and Success Logs */}
      <AnimatePresence mode="wait">
        {savedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="p-2.5 rounded-xl bg-emerald-50 text-emerald-850 text-[10px] font-bold text-center border border-emerald-150 leading-normal flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-emerald-100 text-emerald-600" />{" "}
            Session logged onto your dashboard!
          </motion.div>
        )}
      </AnimatePresence>

      {mode === "work" && secondsElapsed > 0 && (
        <p className="text-[9px] text-center font-bold text-sky-400 uppercase tracking-tight">
          Keep focused! Finish or hit the green check to register study hours.
        </p>
      )}
    </div>
  );
}
