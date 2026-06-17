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

/* ── Custom Dropdown (replaces native <select> to fix overflow) ── */
interface DropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  dropUp?: boolean; // opens upward when true
}

const CustomDropdown: React.FC<DropdownProps> = ({ value, options, onChange, dropUp }) => {
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
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          background: "#fff",
          fontSize: 14,
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 4,
        }}
      >
        <span>{selected?.label}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown list — opens DOWNWARD from selector bar, fully inside viewport */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: dropUp ? "auto" : "calc(100% + 4px)",
            bottom: dropUp ? "calc(100% + 4px)" : "auto",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
            // ✅ Never goes outside — max height + scroll if needed
            maxHeight: 260,
            overflowY: "auto",
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
                background: opt.value === value ? "#2563eb" : "#fff",
                color: opt.value === value ? "#fff" : "#1e293b",
                fontSize: 14,
                cursor: "pointer",
                fontWeight: opt.value === value ? 700 : 400,
              }}
            >
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

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#f8fafc", overflow: "hidden" }}>

      {/* ── Selectors row ── */}
      <div style={{ flexShrink: 0, background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "8px 12px", display: "flex", gap: 8, position: "relative", zIndex: 100 }}>
        <CustomDropdown
          value={topic}
          options={topicOptions}
          onChange={setTopic}
        />
        <CustomDropdown
          value={apiLang}
          options={langOptions}
          onChange={handleApiLangChange}
        />
      </div>

      {/* ── Chat area — only this scrolls ── */}
      <div
        ref={chatRef}
        className="chat-area"
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "12px", WebkitOverflowScrolling: "touch" }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.type} ${isUrduText(msg.text) ? "urdu" : ""}`}>
            {msg.isHtml && msg.type === "bot"
              ? <div className="bubble bot-formatted" dangerouslySetInnerHTML={{ __html: msg.text }} />
              : <div className="bubble">{msg.text}</div>
            }
          </div>
        ))}
        {loading && (
          <div className={`msg bot ${isUrduLang ? "urdu" : ""}`}>
            <div className="bubble thinking">{t("chatbot.thinking")}</div>
          </div>
        )}
      </div>

      {/* ── Input — always at bottom ── */}
      <form
        onSubmit={sendMessage}
        style={{
          flexShrink: 0,
          borderTop: "1px solid #e2e8f0",
          background: "#fff",
          padding: "8px 12px",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <input
          ref={inputRef}
          value={input}
          placeholder={t("chatbot.placeholder")}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className={isUrduLang ? "urdu-input" : ""}
          style={{ flex: 1, fontSize: 14, padding: "8px 12px", borderRadius: 20, border: "1px solid #cbd5e1", outline: "none" }}
        />
        <button
          type="button"
          onClick={startListening}
          style={{ padding: "8px 12px", borderRadius: 20, border: "none", background: "#e2e8f0", cursor: "pointer", fontSize: 16, flexShrink: 0 }}
        >
          {t("chatbot.micBtn")}
        </button>
        <button
          type="submit"
          style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14, flexShrink: 0 }}
        >
          {t("chatbot.sendBtn")}
        </button>
      </form>
    </div>
  );
};

export default AiTutorMobile;