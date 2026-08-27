/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";
import {
  Sparkles,
  Send,
  RefreshCw,
  AlertCircle,
  Bot,
  ChevronDown,
} from "lucide-react";
import { mdcatAiApi } from "../config";

interface AiTutorPageProps {
  onBack?: () => void;
}

type ChatMessage = {
  id: string;
  role: "user" | "ai" | "error";
  content: string;
  subject?: string;
};

const presetDoubts = [
  {
    subj: "Biology",
    text: "Difference between mitosis and meiosis?",
  },
  {
    subj: "Chemistry",
    text: "Why does atomic radius decrease across a period?",
  },
  {
    subj: "Physics",
    text: "Explain Newton's third law with an example",
  },
  {
    subj: "English",
    text: "Simile vs metaphor — what's the difference?",
  },
];

const subjects = ["Biology", "Chemistry", "Physics", "English", "Logical Reasoning"];
const languages = ["Bilingual (Urdu + Eng)", "English Only"];

export default function AiTutorPage() {
 const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatSubject, setChatSubject] = useState("Biology");
  const [chatLanguage, setChatLanguage] = useState("Bilingual (Urdu + Eng)");
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isAskingAI]);

  useEffect(()=>
  {
    window.scrollTo(0,0)
  },[])

 const sendQuestion = async (text: string, subject: string) => {
    if (!text.trim() || isAskingAI) return;
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      subject,
    };
    setMessages((prev) => [...prev, userMsg]);
    setChatQuestion("");
    setIsAskingAI(true);

    try {
      const response = await fetch(mdcatAiApi("/api/mdcat/chat"), 
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          subject,
          language: chatLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to retrieve AI explanation");

      const data = await response.json();
      const reply = data.data?.reply ?? data.reply;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "ai", content: reply },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "error",
          content:
             "Couldn't reach Zaheen AI Tutor. Try again in a moment.",
        },
      ]);
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuestion(chatQuestion, chatSubject);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(chatQuestion, chatSubject);
    }
  };

  const hasMessages = messages.length > 0;

  return (
      <div
  className="flex flex-col bg-sky-950 card-shadow h-full relative overflow-hidden "
  style={{
    marginLeft: "calc(-50vw + 50%)",
    marginRight: "calc(-50vw + 50%)",
    width: "auto",
  }}
>
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.14),_transparent_50%)]" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full border-8 border-sky-800/30" />

      {/* ── Header ── */}
<div className="relative z-30 flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-sky-800/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-sky-400/30 blur-md animate-pulse" />
            <div className="relative w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-white">
              Zaheen AI Tutor
            </h3>
            <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest">
              Ask anything, anytime
            </p>
          </div>
        </div>

        {/* Subject / language settings toggle */}
        <div className="relative">
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-wider text-sky-200 transition-colors"
          >
            <span className="text-sky-400">{chatSubject}</span>
            <span className="w-1 h-1 rounded-full bg-sky-600" />
            <span>{chatLanguage === "English Only" ? "EN" : "EN + UR"}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-sky-900 border border-sky-800 shadow-xl p-3 space-y-3 z-20">
              <div>
                <span className="text-[9px] uppercase font-black text-sky-500 tracking-wider block mb-1.5">
                  Subject
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {subjects.map((s) => (
                    <button
                      key={s}
                      onClick={() => setChatSubject(s)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        chatSubject === s
                          ? "bg-sky-500 text-sky-950"
                          : "bg-white/5 text-sky-200 hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase font-black text-sky-500 tracking-wider block mb-1.5">
                  Language
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {languages.map((l) => (
                    <button
                      key={l}
                      onClick={() => setChatLanguage(l)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                        chatLanguage === l
                          ? "bg-sky-500 text-sky-950"
                          : "bg-white/5 text-sky-200 hover:bg-white/10"
                      }`}
                    >
                      {l === "English Only" ? "English only" : "Bilingual"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Body: hero (empty) or message thread (active) ── */}
      {!hasMessages ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-8 gap-7 overflow-hidden">
          <div className="text-center space-y-3">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none" />
              <div className="relative w-14 h-14 rounded-3xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-sky-300" />
              </div>
            </div>
            <h4 className="text-white font-black uppercase tracking-tight text-lg md:text-2xl">
              What can Zaheen help with?
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-xl">
            <div className="flex items-end gap-2.5 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-sky-400 focus-within:bg-white/[0.07] transition-all">
              <textarea
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Zaheen anything about your syllabus..."
                rows={1}
                className="flex-1 bg-transparent text-sm font-bold text-white placeholder:text-sky-300/40 focus:outline-none resize-none leading-relaxed max-h-32"
              />
              <button
                type="submit"
                disabled={isAskingAI || !chatQuestion.trim()}
                className="w-10 h-10 shrink-0 bg-sky-500 hover:bg-sky-400 text-sky-950 rounded-xl flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAskingAI ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
            {presetDoubts.map((doubt, idx) => (
              <button
                key={idx}
                onClick={() => sendQuestion(doubt.text, doubt.subj)}
                className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-400/40 text-[11px] font-bold text-sky-100 hover:text-white transition-all"
              >
                <span className="text-sky-400 mr-1.5">{doubt.subj}:</span>
                {doubt.text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="relative z-10 flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-5"
          >
            {messages.map((msg) => {
              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[80%] md:max-w-[65%]">
                      {msg.subject && (
                        <span className="block text-right text-[9px] uppercase font-black text-sky-500 tracking-wider mb-1 pr-1">
                          {msg.subject}
                        </span>
                      )}
                      <div className="bg-sky-500 text-sky-950 rounded-2xl rounded-tr-md px-4 py-3 text-xs font-bold leading-relaxed shadow-lg shadow-sky-950/30">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.role === "error") {
                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="max-w-[80%] md:max-w-[65%] flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-2xl rounded-tl-md px-4 py-3 text-xs font-bold leading-relaxed">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{msg.content}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="max-w-[80%] md:max-w-[65%] bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3 text-xs font-semibold text-sky-50 leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {isAskingAI && (
              <div className="flex justify-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-tl-md px-4 py-3.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* ── Composer (only shown once chat has started) ── */}
          <div className="relative z-10 border-t border-sky-800/60 p-4 md:p-5 bg-sky-950/80 backdrop-blur shrink-0">
            <form onSubmit={handleSubmit} className="flex items-end gap-2.5">
              <textarea
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Zaheen anything about your syllabus..."
                rows={1}
                className="flex-1 text-xs font-bold border border-white/10 rounded-2xl bg-white/5 px-4 py-3.5 text-white placeholder:text-sky-300/40 focus:outline-none focus:border-sky-400 focus:bg-white/[0.07] transition-all resize-none leading-relaxed max-h-32"
              />
              <button
                type="submit"
                disabled={isAskingAI || !chatQuestion.trim()}
                className="w-11 h-11 shrink-0 bg-sky-500 hover:bg-sky-400 text-sky-950 rounded-2xl flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isAskingAI ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            <p className="text-[9px] text-sky-500/60 font-bold uppercase tracking-wider mt-2 pl-1">
              Enter to send · Shift + Enter for a new line
            </p>
          </div>
        </>
      )}
    </div>
  );
}