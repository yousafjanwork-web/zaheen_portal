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
}

const CustomDropdown: React.FC<DropdownProps> = ({ value, options, onChange }) => {
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
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          padding: "6px 10px",
          borderRadius: 6,
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

      {/* List — absolutely positioned, always inside viewport */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #cbd5e1",
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            zIndex: 9999,
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
  const isUrduLang  = lang === "ur";

  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState<string>("");
  const [loading, setLoading]     = useState<boolean>(false);

  const [topic, setTopic]         = useState<string>("Maths");
  const [apiLang, setApiLang]     = useState<string>("English");
  const apiLangRef                = useRef<string>("English");

  const chatRef         = useRef<HTMLDivElement | null>(null);
  const recognitionRef  = useRef<any>(null);
  const memoryRef       = useRef<string>("");
  const isListening     = useRef<boolean>(false);
  const inputRef        = useRef<HTMLInputElement | null>(null);
  const historyRef      = useRef<ChatHistory[]>([]);
  const queueRef        = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);

  const handleApiLangChange = (val: string) => {
    setApiLang(val);
    apiLangRef.current = val;
    historyRef.current = [];
    memoryRef.current  = "";
    queueRef.current   = [];
    const notice = val === "Urdu"
      ? t("chatbot.switchNotice").replace("English", "Urdu")
      : t("chatbot.switchNotice");
    setMessages((prev) => [...prev, { text: notice, type: "bot", isHtml: false }]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const typeMessage = useCallback((text: string, onComplete: () => void) => {
    let i    = 0;
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
            memory:  memoryRef.current,
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

    const recognition     = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang       = apiLangRef.current === "Urdu" ? "ur-PK" : "en-US";
    isListening.current    = true;
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

  /* ── topic options — labels resolved here for CustomDropdown ── */
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

  /* ── render ── */
  return (
    <div
      className="chatbot-container"
      style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}
    >
      {/* Header — unchanged */}
      <div className="chatbot-header">
        {t("chatbot.header")}
      </div>

      {/* Topic + Language selectors — only this block changed */}
      <div className="controls" style={{ display: "flex", gap: 8, padding: "8px 12px", position: "relative", zIndex: 100 }}>
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

      {/* Chat area — unchanged */}
      <div
        className="chat-area"
        ref={chatRef}
        style={{ flex: 1, overflowY: "auto", paddingBottom: "8px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.type} ${isUrduText(msg.text) ? "urdu" : ""}`}
          >
            {msg.isHtml && msg.type === "bot" ? (
              <div
                className="bubble bot-formatted"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ) : (
              <div className="bubble">{msg.text}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className={`msg bot ${isUrduLang ? "urdu" : ""}`}>
            <div className="bubble thinking">
              {t("chatbot.thinking")}
            </div>
          </div>
        )}
      </div>

      {/* Queue notice — unchanged */}
      {queueRef.current.length > 0 && (
        <div className="queue-notice">
          {queueRef.current.length} {t("chatbot.queueNotice")}
        </div>
      )}

      {/* Input form — unchanged */}
      <form className="input-box" onSubmit={sendMessage} style={{ flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          placeholder={t("chatbot.placeholder")}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className={isUrduLang ? "urdu-input" : ""}
        />
        <button type="button" onClick={startListening}>
          {t("chatbot.micBtn")}
        </button>
        <button type="submit">
          {t("chatbot.sendBtn")}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;