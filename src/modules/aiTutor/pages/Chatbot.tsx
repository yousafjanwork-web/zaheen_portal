import React, { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import "../../../styles/chatbot_fullpage.css";
import { getLanguage } from "@/modules/shared/i18n";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

const translations: Record<string, any> = {
  en: enTranslations,
  ur: urTranslations,
};

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

  const t = useCallback(
    (key: string): string => {
      const val = getNestedValue(dict, key);
      if (val !== key) return val;
      return getNestedValue(translations.en, key);
    },
    [dict]
  );

  return { t, lang };
};

/* ─────────────────────────────────────────────────────────────
   CUSTOM DROPDOWN — replaces native <select> to fix mobile overflow
──────────────────────────────────────────────────────────────── */
interface DropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  icon?: string;
}

const CustomDropdown: React.FC<DropdownProps> = ({ value, options, onChange, icon }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
            top: "calc(100% + 6px)",
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

/* ─────────────────────────────────────────────────────────────
   Types
──────────────────────────────────────────────────────────────── */
interface Message {
  text: string;
  type: "user" | "bot";
  isHtml?: boolean;
}

interface ChatHistory {
  role: "user" | "model";
  text: string;
}

const API_URL = "https://zai.zaheen.com.pk/api/chat";

function formatBotResponse(text: string): string {
  let html = text
    .replace(/^## (.+)$/gm, '<h2 class="bot-heading">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="bot-subheading">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="bot-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="bot-list">${match}</ul>`)
    .replace(/\n(?!<)/g, "<br/>");
  return html;
}

/* ═══════════════════════════════════════════════════════════
   CHATBOT COMPONENT
═══════════════════════════════════════════════════════════ */
const Chatbot: React.FC = () => {
  const { t, lang } = useTranslation();
  const isUrduLang = lang === "ur";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [topic, setTopic] = useState<string>("Maths");
  const [apiLang, setApiLang] = useState<string>("English");
  const apiLangRef = useRef<string>("English");

  const chatRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const memoryRef = useRef<string>("");
  const isListening = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const historyRef = useRef<ChatHistory[]>([]);
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);

  const handleApiLangChange = (val: string) => {
    setApiLang(val);
    apiLangRef.current = val;
    historyRef.current = [];
    memoryRef.current = "";
    queueRef.current = [];
    const notice =
      val === "Urdu"
        ? t("chatbot.switchNotice").replace("English", "Urdu")
        : t("chatbot.switchNotice");
    setMessages((prev) => [...prev, { text: notice, type: "bot", isHtml: false }]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const typeMessage = useCallback((text: string, onComplete: () => void) => {
    let i = 0;
    let temp = "";
    setMessages((prev) => [...prev, { text: "", type: "bot", isHtml: true }]);

    const interval = setInterval(() => {
      temp += text.charAt(i);
      const partialFormatted = formatBotResponse(temp);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: partialFormatted, type: "bot", isHtml: true };
        return updated;
      });
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        historyRef.current.push({ role: "model", text });
        if (historyRef.current.length > 10) historyRef.current.shift();
        onComplete();
      }
    }, 8);
  }, []);

  const processMessage = useCallback(
    async (textToSend: string) => {
      isProcessingRef.current = true;
      setLoading(true);

      setMessages((prev) => [...prev, { text: textToSend, type: "user" }]);
      historyRef.current.push({ role: "user", text: textToSend });
      if (historyRef.current.length > 10) historyRef.current.shift();

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            language: apiLangRef.current,
            history: historyRef.current.slice(-10),
            memory: memoryRef.current,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.reply) {
          if (data.memory) memoryRef.current = data.memory;
          typeMessage(data.reply, () => {
            isProcessingRef.current = false;
            if (queueRef.current.length > 0) {
              processMessage(queueRef.current.shift()!);
            } else {
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          });
        } else {
          isProcessingRef.current = false;
          if (queueRef.current.length > 0) processMessage(queueRef.current.shift()!);
        }
      } catch (err) {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ Server error. Try again.", type: "bot" },
        ]);
        isProcessingRef.current = false;
        if (queueRef.current.length > 0) {
          processMessage(queueRef.current.shift()!);
        } else {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }
    },
    [topic, typeMessage]
  );

  const sendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = input.trim();
    if (!textToSend) return;
    setInput("");
    if (isProcessingRef.current) {
      queueRef.current.push(textToSend);
    } else {
      processMessage(textToSend);
    }
  };

  const startListening = () => {
    if (isListening.current) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = apiLangRef.current === "Urdu" ? "ur-PK" : "en-US";
    isListening.current = true;
    recognition.start();

    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
    };
    recognition.onend = () => {
      isListening.current = false;
      inputRef.current?.focus();
    };
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

  /* ── render ── */
  return (
    <div
      className="chatbot-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0a0a1a 0%, #0d0d2b 40%, #0f0a20 100%)",
        position: "relative",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Background ambient orbs */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0,
      }}>
        <div style={{
          position: "absolute", top: "-80px", left: "-80px",
          width: 320, height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", right: "-60px",
          width: 280, height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "40%", left: "30%",
          width: 200, height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }} />
      </div>

      {/* ── HEADER ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 20px",
        borderBottom: "1px solid rgba(99,102,241,0.15)",
        background: "rgba(10,10,30,0.85)",
        backdropFilter: "blur(20px)",
        flexShrink: 0,
      }}>
        {/* Logo mark */}
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 20px rgba(99,102,241,0.4), 0 4px 12px rgba(0,0,0,0.3)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
              fill="white" opacity="0.9" />
            <path d="M9 8h2v8H9zm4 0h2v8h-2z" fill="white" />
            <circle cx="12" cy="12" r="3" fill="rgba(255,255,255,0.3)" />
            <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        {/* Title */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 15, fontWeight: 800,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}>
            {t("chatbot.header")}
          </div>
        </div>

        {/* Status dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: loading ? "#f59e0b" : "#10b981",
            boxShadow: loading
              ? "0 0 8px rgba(245,158,11,0.8)"
              : "0 0 8px rgba(16,185,129,0.8)",
            transition: "background 0.3s, box-shadow 0.3s",
          }} />
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
            {loading ? "Thinking..." : "Online"}
          </span>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        gap: 10,
        padding: "12px 16px",
        borderBottom: "1px solid rgba(99,102,241,0.08)",
        background: "rgba(8,8,24,0.6)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          <span style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
            Topic
          </span>
          <CustomDropdown value={topic} options={topicOptions} onChange={setTopic} icon="📚" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
          <span style={{ fontSize: 11, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
            Lang
          </span>
          <CustomDropdown value={apiLang} options={langOptions} onChange={handleApiLangChange} icon="🌐" />
        </div>
      </div>

      {/* ── CHAT AREA ── */}
      <div
        className="chat-area"
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 16px 12px",
          position: "relative",
          zIndex: 5,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99,102,241,0.2) transparent",
        }}
      >
        {/* Empty state */}
        {!hasMessages && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", height: "100%", gap: 16, opacity: 0.6,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
              border: "1.5px solid rgba(99,102,241,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28,
            }}>
              💬
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#94a3b8", fontSize: 14, fontWeight: 600 }}>
                Start a conversation
              </div>
              <div style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>
                Ask anything about your subject
              </div>
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
              marginBottom: 14,
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            {/* Bot avatar */}
            {msg.type === "bot" && (
              <div style={{
                width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginBottom: 2,
              }}>
                🤖
              </div>
            )}

            {msg.isHtml && msg.type === "bot" ? (
              <div
                className="bubble bot-formatted"
                style={{
                  maxWidth: "78%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 16px",
                  color: "#e2e8f0",
                  fontSize: 13.5,
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
                  maxWidth: "78%",
                  padding: "11px 16px",
                  borderRadius: msg.type === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  background: msg.type === "user"
                    ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                    : "rgba(255,255,255,0.05)",
                  border: msg.type === "user"
                    ? "none"
                    : "1px solid rgba(99,102,241,0.2)",
                  color: msg.type === "user" ? "#ffffff" : "#e2e8f0",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  fontWeight: msg.type === "user" ? 500 : 400,
                  boxShadow: msg.type === "user"
                    ? "0 4px 20px rgba(99,102,241,0.35)"
                    : "0 4px 20px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(8px)",
                }}
              >
                {msg.text}
              </div>
            )}

            {/* User avatar */}
            {msg.type === "user" && (
              <div style={{
                width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginBottom: 2,
                boxShadow: "0 2px 8px rgba(99,102,241,0.4)",
              }}>
                👤
              </div>
            )}
          </div>
        ))}

        {/* Typing / thinking indicator */}
        {loading && (
          <div
            className={`msg bot ${isUrduLang ? "urdu" : ""}`}
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: 14,
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>
              🤖
            </div>
            <div
              className="bubble thinking"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "18px 18px 18px 4px",
                padding: "14px 20px",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {/* Animated dots */}
              {[0, 1, 2].map((n) => (
                <div
                  key={n}
                  style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#6366f1",
                    animation: "zai-bounce 1.2s ease-in-out infinite",
                    animationDelay: `${n * 0.18}s`,
                  }}
                />
              ))}
              <style>{`
                @keyframes zai-bounce {
                  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                  40% { transform: translateY(-6px); opacity: 1; }
                }
              `}</style>
            </div>
          </div>
        )}
      </div>

      {/* Queue notice */}
      {queueRef.current.length > 0 && (
        <div style={{
          position: "relative",
          zIndex: 10,
          margin: "0 16px 4px",
          padding: "8px 14px",
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.2)",
          borderRadius: 10,
          fontSize: 12,
          color: "#fbbf24",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <span>⏳</span>
          {queueRef.current.length} {t("chatbot.queueNotice")}
        </div>
      )}

      {/* ── INPUT AREA ── */}
      <div style={{
        position: "relative",
        zIndex: 10,
        padding: "12px 16px 16px",
        borderTop: "1px solid rgba(99,102,241,0.12)",
        background: "rgba(8,8,24,0.85)",
        backdropFilter: "blur(20px)",
        flexShrink: 0,
      }}>
        <form
          className="input-box"
          onSubmit={sendMessage}
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid rgba(99,102,241,0.2)",
            borderRadius: 16,
            padding: "6px 8px 6px 14px",
            transition: "border-color 0.2s",
          }}
          onFocus={() => {}}
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
              width: 36, height: 36, borderRadius: 10,
              border: "1px solid rgba(99,102,241,0.2)",
              background: "rgba(99,102,241,0.08)",
              color: "#6366f1",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "background 0.2s, transform 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(99,102,241,0.2)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(99,102,241,0.08)";
              e.currentTarget.style.transform = "scale(1)";
            }}
            title={t("chatbot.micBtn")}
          >
            🎙️
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            style={{
              height: 36, borderRadius: 10,
              border: "none",
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                : "rgba(99,102,241,0.15)",
              color: input.trim() && !loading ? "#ffffff" : "#475569",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "0 16px",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.01em",
              transition: "all 0.2s",
              flexShrink: 0,
              boxShadow: input.trim() && !loading
                ? "0 4px 16px rgba(99,102,241,0.35)"
                : "none",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t("chatbot.sendBtn")}
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 10.5,
          color: "#334155",
          fontWeight: 500,
          letterSpacing: "0.03em",
        }}>
          Press Enter to send
        </div>
      </div>
    </div>
  );
};

export default Chatbot;