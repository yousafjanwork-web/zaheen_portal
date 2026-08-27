import React, { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import "../../../styles/chatbot_fullpage.css";
import { getLanguage } from "@/modules/shared/i18n";
import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

const translations: Record<string, any> = { en: enTranslations, ur: urTranslations };

const getNestedValue = (obj: any, key: string): string => {
  const value = key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);
  return typeof value === "string" ? value : key;
};

const useTranslation = () => {
  const [lang, setLang] = useState<string>(() => getLanguage());
  useEffect(() => {
    const sync = () => setLang(getLanguage());
    window.addEventListener("storage", sync);
    window.addEventListener("languageChange", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("languageChange", sync);
    };
  }, []);
  const dict = translations[lang] ?? translations.en;
  const t = useCallback((key: string): string => {
    const val = getNestedValue(dict, key);
    if (val !== key) return val;
    return getNestedValue(translations.en, key);
  }, [dict]);
  return { t, lang };
};

/* ── Custom Dropdown ── */
interface DropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  dropUp?: boolean;
  icon?: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({ value, options, onChange, dropUp, icon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flex: 1 }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          padding: "9px 14px",
          borderRadius: 12,
          border: "1.5px solid rgba(99,102,241,0.25)",
          background: "rgba(255,255,255,0.06)",
          fontSize: 13,
          fontWeight: 600,
          color: "#e2e8f0",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
          backdropFilter: "blur(8px)",
          transition: "border-color 0.2s, background 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.6)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)")}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
          <span style={{ color: "#a5b4fc" }}>{selected?.label}</span>
        </span>
        <svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
        >
          <path d="M2 4L6 8L10 4" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: dropUp ? "auto" : "calc(100% + 6px)",
            bottom: dropUp ? "calc(100% + 6px)" : "auto",
            left: 0,
            right: 0,
            background: "rgba(15,15,35,0.98)",
            border: "1.5px solid rgba(99,102,241,0.3)",
            borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
            zIndex: 9999,
            maxHeight: 260,
            overflowY: "auto",
            backdropFilter: "blur(20px)",
            padding: "4px",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: "100%",
                padding: "10px 14px",
                textAlign: "left",
                border: "none",
                borderRadius: 10,
                background: opt.value === value
                  ? "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))"
                  : "transparent",
                color: opt.value === value ? "#a5b4fc" : "#94a3b8",
                fontSize: 13,
                fontWeight: opt.value === value ? 700 : 500,
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={e => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                  e.currentTarget.style.color = "#c7d2fe";
                }
              }}
              onMouseLeave={e => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              {opt.value === value && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" fill="#6366f1" />
                </svg>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Types ── */
interface Message { text: string; type: "user" | "bot"; isHtml?: boolean; }
interface ChatHistory { role: "user" | "model"; text: string; }
const API_URL = "https://zai.zaheen.com.pk/api/chat";

function formatBotResponse(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2 class="bot-heading">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="bot-subheading">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="bot-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul class="bot-list">${m}</ul>`)
    .replace(/\n(?!<)/g, "<br/>");
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const AiTutorMobile: React.FC = () => {
  const { t, lang } = useTranslation();
  const isUrduLang = lang === "ur";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("Maths");
  const [apiLang, setApiLang] = useState("English");
  const apiLangRef = useRef("English");

  const chatRef        = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const memoryRef      = useRef("");
  const isListening    = useRef(false);
  const inputRef       = useRef<HTMLInputElement>(null);
  const historyRef     = useRef<ChatHistory[]>([]);
  const queueRef       = useRef<string[]>([]);
  const isProcessing   = useRef(false);

  const handleApiLangChange = (val: string) => {
    setApiLang(val);
    apiLangRef.current = val;
    historyRef.current = [];
    memoryRef.current = "";
    queueRef.current = [];
    const notice = val === "Urdu"
      ? t("chatbot.switchNotice").replace("English", "Urdu")
      : t("chatbot.switchNotice");
    setMessages((p) => [...p, { text: notice, type: "bot" }]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const typeMessage = useCallback((text: string, onComplete: () => void) => {
    let i = 0, temp = "";
    setMessages((p) => [...p, { text: "", type: "bot", isHtml: true }]);
    const iv = setInterval(() => {
      temp += text.charAt(i);
      const html = formatBotResponse(temp);
      setMessages((p) => { const u = [...p]; u[u.length - 1] = { text: html, type: "bot", isHtml: true }; return u; });
      i++;
      if (i >= text.length) {
        clearInterval(iv);
        historyRef.current.push({ role: "model", text });
        if (historyRef.current.length > 10) historyRef.current.shift();
        onComplete();
      }
    }, 8);
  }, []);

  const processMessage = useCallback(async (textToSend: string) => {
    isProcessing.current = true;
    setLoading(true);
    setMessages((p) => [...p, { text: textToSend, type: "user" }]);
    historyRef.current.push({ role: "user", text: textToSend });
    if (historyRef.current.length > 10) historyRef.current.shift();
    try {
      const res  = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language: apiLangRef.current, history: historyRef.current.slice(-10), memory: memoryRef.current }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.reply) {
        if (data.memory) memoryRef.current = data.memory;
        typeMessage(data.reply, () => {
          isProcessing.current = false;
          if (queueRef.current.length > 0) processMessage(queueRef.current.shift()!);
          else setTimeout(() => inputRef.current?.focus(), 50);
        });
      } else {
        isProcessing.current = false;
        if (queueRef.current.length > 0) processMessage(queueRef.current.shift()!);
      }
    } catch {
      setLoading(false);
      setMessages((p) => [...p, { text: "⚠️ Server error. Try again.", type: "bot" }]);
      isProcessing.current = false;
      if (queueRef.current.length > 0) processMessage(queueRef.current.shift()!);
      else setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [topic, typeMessage]);

  const sendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (isProcessing.current) queueRef.current.push(text);
    else processMessage(text);
  };

  const startListening = () => {
    if (isListening.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    recognitionRef.current = r;
    r.lang = apiLangRef.current === "Urdu" ? "ur-PK" : "en-US";
    isListening.current = true;
    r.start();
    r.onresult = (e: any) => setInput(e.results[0][0].transcript);
    r.onend = () => { isListening.current = false; inputRef.current?.focus(); };
  };

  const isUrduText = (text: string) => /[\u0600-\u06FF]/.test(text);

  const topicOptions = [
    { value: "Maths",     label: t("chatbot.topics.maths")     },
    { value: "English",   label: t("chatbot.topics.english")   },
    { value: "Urdu",      label: t("chatbot.topics.urdu")      },
    { value: "Chemistry", label: t("chatbot.topics.chemistry") },
    { value: "Physics",   label: t("chatbot.topics.physics")   },
    { value: "Science",   label: t("chatbot.topics.science")   },
    { value: "Computer",  label: t("chatbot.topics.computer")  },
  ];

  const langOptions = [
    { value: "English", label: t("chatbot.languages.english") },
    { value: "Urdu",    label: t("chatbot.languages.urdu")    },
  ];

  const hasMessages = messages.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0a0a1a 0%, #0d0d2b 40%, #0f0a20 100%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Background ambient orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-80px", left: "-80px",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-60px",
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
        }} />
      </div>

      {/* ── HEADER ── */}
      <div style={{
        position: "relative", zIndex: 10, flexShrink: 0,
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        background: "rgba(10,10,30,0.85)",
        backdropFilter: "blur(20px)",
      }}>

        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: loading ? "#f59e0b" : "#10b981",
            boxShadow: loading ? "0 0 8px rgba(245,158,11,0.8)" : "0 0 8px rgba(16,185,129,0.8)",
            transition: "background 0.3s, box-shadow 0.3s",
          }} />
          <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>
            {loading ? "Thinking..." : "Online"}
          </span>
        </div>
      </div>

      {/* ── SELECTORS ROW ── */}
      <div style={{
        position: "relative", zIndex: 100, flexShrink: 0,
        display: "flex", gap: 10, padding: "10px 14px",
        borderBottom: "1px solid rgba(99,102,241,0.08)",
        background: "rgba(8,8,24,0.6)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          <span style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
            Topic
          </span>
          <CustomDropdown value={topic} options={topicOptions} onChange={setTopic} icon="📚" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          <span style={{ fontSize: 10, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
            Lang
          </span>
          <CustomDropdown value={apiLang} options={langOptions} onChange={handleApiLangChange} icon="🌐" />
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div
        ref={chatRef}
        className="chat-area"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "16px 14px 10px",
          position: "relative",
          zIndex: 5,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99,102,241,0.2) transparent",
        }}
      >
        {/* Empty state */}
        {!hasMessages && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: 14, opacity: 0.55,
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: 18,
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
              border: "1.5px solid rgba(99,102,241,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26,
            }}>
              💬
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#94a3b8", fontSize: 13, fontWeight: 600 }}>Start a conversation</div>
              <div style={{ color: "#475569", fontSize: 11, marginTop: 3 }}>Ask anything about your subject</div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.type} ${isUrduText(msg.text) ? "urdu" : ""}`}
            style={{
              display: "flex",
              justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
              marginBottom: 12,
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {/* Bot avatar */}
            {msg.type === "bot" && (
              <div style={{
                width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, marginBottom: 2,
              }}>
                🤖
              </div>
            )}

            {msg.isHtml && msg.type === "bot" ? (
              <div
                className="bubble bot-formatted"
                style={{
                  maxWidth: "80%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "16px 16px 16px 4px",
                  padding: "10px 14px",
                  color: "#e2e8f0",
                  fontSize: 13,
                  lineHeight: 1.65,
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ) : (
              <div
                className="bubble"
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: msg.type === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.type === "user"
                    ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                    : "rgba(255,255,255,0.05)",
                  border: msg.type === "user"
                    ? "none"
                    : "1px solid rgba(99,102,241,0.2)",
                  color: msg.type === "user" ? "#ffffff" : "#e2e8f0",
                  fontSize: 13,
                  lineHeight: 1.6,
                  fontWeight: msg.type === "user" ? 500 : 400,
                  boxShadow: msg.type === "user"
                    ? "0 4px 18px rgba(99,102,241,0.35)"
                    : "0 4px 18px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {msg.text}
              </div>
            )}

            {/* User avatar */}
            {msg.type === "user" && (
              <div style={{
                width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, marginBottom: 2,
                boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
              }}>
                👤
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div
            className={`msg bot ${isUrduLang ? "urdu" : ""}`}
            style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12, alignItems: "flex-end", gap: 8 }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 9, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
            }}>
              🤖
            </div>
            <div
              className="bubble thinking"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "16px 16px 16px 4px",
                padding: "13px 18px",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {[0, 1, 2].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#6366f1",
                    animation: "zai-bounce 1.2s ease-in-out infinite",
                    animationDelay: `${n * 0.18}s`,
                  }}
                />
              ))}
              <style>{`
                @keyframes zai-bounce {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-5px); opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        )}
      </div>

      {/* ── INPUT AREA ── */}
      <div style={{
        position: "relative", zIndex: 10, flexShrink: 0,
        padding: "10px 14px",
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        borderTop: "1px solid rgba(99,102,241,0.12)",
        background: "rgba(8,8,24,0.85)",
        backdropFilter: "blur(20px)",
      }}>
        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid rgba(99,102,241,0.2)",
            borderRadius: 16,
            padding: "5px 7px 5px 13px",
          }}
        >
          <input
            ref={inputRef}
            value={input}
            placeholder={t("chatbot.placeholder")}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            className={isUrduLang ? "urdu-input" : ""}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.5,
              padding: "6px 0",
              caretColor: "#6366f1",
            }}
          />

          {/* Mic button */}
          <button
            type="button"
            onClick={startListening}
            style={{
              width: 34, height: 34, borderRadius: 9,
              border: "1px solid rgba(99,102,241,0.2)",
              background: "rgba(99,102,241,0.08)",
              color: "#6366f1",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(99,102,241,0.08)")}
            title={t("chatbot.micBtn")}
          >
            🎙️
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              height: 34, borderRadius: 9,
              border: "none",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                : "rgba(99,102,241,0.15)",
              color: input.trim() && !loading ? "#ffffff" : "#475569",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 5,
              padding: "0 14px",
              fontSize: 13, fontWeight: 700,
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow: input.trim() && !loading
                ? "0 4px 14px rgba(99,102,241,0.35)"
                : "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("chatbot.sendBtn")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiTutorMobile;