import React, { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import "../../../styles/chatbot_fullpage.css";
import { getLanguage } from "@/modules/shared/i18n";

import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─────────────────────────────────────────────────────────────
   TRANSLATION HOOK
   Reactive — re-renders when language changes via storage or
   custom "languageChange" event (same pattern as every other page).
   To add Pashto: import psTranslations, add  ps: psTranslations.
──────────────────────────────────────────────────────────────── */
const translations: Record<string, any> = {
  en: enTranslations,
  ur: urTranslations,
  // ps: psTranslations,
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
      // fallback to English if key missing in current lang
      return getNestedValue(translations.en, key);
    },
    [dict]
  );

  return { t, lang };
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
  /* ── i18n ── */
  const { t, lang } = useTranslation();
  const isUrduLang  = lang === "ur";

  /* ── chat state ── */
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState<string>("");
  const [loading, setLoading]     = useState<boolean>(false);

  /* ── topic & language for API — kept in both state (for UI) and ref (for callbacks) ── */
  const [topic, setTopic]         = useState<string>("Maths");
  const [apiLang, setApiLang]     = useState<string>("English");
  const apiLangRef                = useRef<string>("English");

  /* ── refs ── */
  const chatRef         = useRef<HTMLDivElement | null>(null);
  const recognitionRef  = useRef<any>(null);
  const memoryRef       = useRef<string>("");
  const isListening     = useRef<boolean>(false);
  const inputRef        = useRef<HTMLInputElement | null>(null);
  const historyRef      = useRef<ChatHistory[]>([]);
  const queueRef        = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);

  /* ── language switch handler ──────────────────────────────
   * ROOT CAUSE FIX: conversation history carried the old language
   * as strong context, so the AI kept replying in Urdu even after
   * switching back to English. Clearing history + memory on switch
   * gives the AI a clean slate.
   *────────────────────────────────────────────────────────── */
  const handleApiLangChange = (val: string) => {
    setApiLang(val);
    apiLangRef.current = val;

    // Clear all state that carries the old language's context
    historyRef.current = [];
    memoryRef.current  = "";
    queueRef.current   = [];

    // Show a divider so the user knows a new session started
    const notice = val === "Urdu"
      ? t("chatbot.switchNotice").replace("English", "Urdu")
      : t("chatbot.switchNotice");

    setMessages((prev) => [...prev, { text: notice, type: "bot", isHtml: false }]);
  };

  /* ── auto-scroll ── */
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  /* ── typing animation ── */
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

  /* ── send to API ── */
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
            // Read from ref (not state) to avoid stale closure — ensures
            // language is always current even inside memoized callback
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

  /* ── voice input ── */
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

  /* ── topic options — values stay English (sent to API), labels translated ── */
  const topicOptions = [
    { value: "Maths",     labelKey: "chatbot.topics.maths"     },
    { value: "English",   labelKey: "chatbot.topics.english"   },
    { value: "Urdu",      labelKey: "chatbot.topics.urdu"      },
    { value: "Chemistry", labelKey: "chatbot.topics.chemistry" },
    { value: "Physics",   labelKey: "chatbot.topics.physics"   },
    { value: "Science",   labelKey: "chatbot.topics.science"   },
    { value: "Computer",  labelKey: "chatbot.topics.computer"  },
  ];

  const langOptions = [
    { value: "English", labelKey: "chatbot.languages.english" },
    { value: "Urdu",    labelKey: "chatbot.languages.urdu"    },
  ];

  /* ── render ── */
  return (
    <div
      className="chatbot-container"
      style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}
    >
      {/* Header */}
      <div className="chatbot-header">
        {t("chatbot.header")}
      </div>

      {/* Topic + Language selectors */}
      <div className="controls">
        {/* Topic — value stays in English so the API always receives the correct subject name */}
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topicOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>

        {/* Language for API replies */}
        <select value={apiLang} onChange={(e) => handleApiLangChange(e.target.value)}>
          {langOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.labelKey)}
            </option>
          ))}
        </select>
      </div>

      {/* Chat area */}
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

      {/* Queue notice — only rendered when messages are queued */}
      {queueRef.current.length > 0 && (
        <div className="queue-notice">
          {queueRef.current.length} {t("chatbot.queueNotice")}
        </div>
      )}

      {/* Input form */}
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