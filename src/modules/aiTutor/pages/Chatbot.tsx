import React, { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import "../../../styles/chatbot_fullpage.css";
import { getLanguage } from "@/modules/shared/i18n";
import enTranslations from "@/modules/shared/i18n/en.json";
import urTranslations from "@/modules/shared/i18n/ur.json";

/* ─────────────────────────────────────────────────────────────
   TRANSLATION HELPER  (same pattern as SubjectLecturesView)
──────────────────────────────────────────────────────────────── */
const translations: Record<string, any> = {
  en: enTranslations,
  ur: urTranslations,
};

const getNestedValue = (obj: any, key: string): string => {
  const value = key.split(".").reduce((acc: any, part: string) => acc?.[part], obj);
  return typeof value === "string" ? value : key;
};

const useT = () => {
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
  return (key: string) => getNestedValue(dict, key);
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
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul class="bot-list">${match}</ul>`)
    .replace(/\n(?!<)/g, '<br/>');
  return html;
}

/* ─────────────────────────────────────────────────────────────
   CHATBOT COMPONENT
──────────────────────────────────────────────────────────────── */
const Chatbot: React.FC = () => {
  const t = useT();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState<string>("");

  // topic key stored internally (always English), displayed label comes from t()
  const [topicKey, setTopicKey] = useState<string>("Maths");

  // chatLanguage is the AI reply language — "English" or "Urdu" (sent to API unchanged)
  const [chatLanguage, setChatLanguage] = useState<string>("English");

  const [loading, setLoading] = useState<boolean>(false);

  const chatRef          = useRef<HTMLDivElement | null>(null);
  const recognitionRef   = useRef<any>(null);
  const memoryRef        = useRef<string>("");
  const isListening      = useRef<boolean>(false);
  const inputRef         = useRef<HTMLInputElement | null>(null);
  const historyRef       = useRef<ChatHistory[]>([]);
  const languageRef      = useRef<string>("English");
  const queueRef         = useRef<string[]>([]);
  const isProcessingRef  = useRef<boolean>(false);

  // ── topic options: key maps to en.json chatbot.topics key ──
  const topicOptions: { key: string; i18nKey: string; apiValue: string }[] = [
    { key: "Maths",     i18nKey: "chatbot.topics.maths",     apiValue: "Maths"     },
    { key: "English",   i18nKey: "chatbot.topics.english",   apiValue: "English"   },
    { key: "Urdu",      i18nKey: "chatbot.topics.urdu",      apiValue: "Urdu"      },
    { key: "Chemistry", i18nKey: "chatbot.topics.chemistry", apiValue: "Chemistry" },
    { key: "Physics",   i18nKey: "chatbot.topics.physics",   apiValue: "Physics"   },
    { key: "Science",   i18nKey: "chatbot.topics.science",   apiValue: "Science"   },
    { key: "Computer",  i18nKey: "chatbot.topics.computer",  apiValue: "Computer"  },
  ];

  // derive the API topic value from the current key
  const apiTopic = topicOptions.find((o) => o.key === topicKey)?.apiValue ?? topicKey;

  /* ─── Language change: wipe history so AI gets a clean slate ─── */
  const handleLanguageChange = (val: string) => {
    setChatLanguage(val);
    languageRef.current = val;

    // Clear all state that carries the old language's context
    historyRef.current = [];
    memoryRef.current  = "";
    queueRef.current   = [];

    // Notice key differs by target language
    const noticeKey =
      val === "Urdu"
        ? "chatbot.switchNotice"   // ur.json: "🔄 زبان اردو میں تبدیل ہو گئی — نئی گفتگو شروع"
        : "chatbot.switchNotice";  // en.json: "🔄 Language switched to English — new session started"

    // We need the notice in the *new* language, so read directly from the dict
    const dict = val === "Urdu" ? urTranslations : enTranslations;
    const notice = getNestedValue(dict, noticeKey);
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
            topic: apiTopic,
            language: languageRef.current, // always current via ref
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
    [apiTopic, typeMessage]
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
    recognition.lang      = languageRef.current === "Urdu" ? "ur-PK" : "en-US";
    isListening.current   = true;
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => {
      isListening.current = false;
      inputRef.current?.focus();
    };
  };

  const isUrdu     = (text: string) => /[\u0600-\u06FF]/.test(text);
  const isUrduLang = chatLanguage === "Urdu";

  return (
    <div
      className="chatbot-container"
      style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}
    >
      {/* ── Header ── */}
      <div className="chatbot-header">{t("chatbot.header")}</div>

      {/* ── Controls ── */}
      <div className="controls">
        {/* Topic dropdown — labels come from translation */}
        <select value={topicKey} onChange={(e) => setTopicKey(e.target.value)}>
          {topicOptions.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {t(opt.i18nKey)}
            </option>
          ))}
        </select>

        {/* Language dropdown — labels come from translation */}
        <select value={chatLanguage} onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="English">{t("chatbot.languages.english")}</option>
          <option value="Urdu">{t("chatbot.languages.urdu")}</option>
        </select>
      </div>

      {/* ── Chat area ── */}
      <div
        className="chat-area"
        ref={chatRef}
        style={{ flex: 1, overflowY: "auto", paddingBottom: "8px" }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.type} ${isUrdu(msg.text) ? "urdu" : ""}`}>
            {msg.isHtml && msg.type === "bot" ? (
              <div className="bubble bot-formatted" dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              <div className="bubble">{msg.text}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className={`msg bot ${isUrduLang ? "urdu" : ""}`}>
            <div className="bubble thinking">{t("chatbot.thinking")}</div>
          </div>
        )}
      </div>

      {/* ── Queue notice ── */}
      {queueRef.current.length > 0 && (
        <div className="queue-notice">
          {queueRef.current.length} {t("chatbot.queueNotice")}
        </div>
      )}

      {/* ── Input form ── */}
      <form className="input-box" onSubmit={sendMessage} style={{ flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          placeholder={t("chatbot.placeholder")}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className={isUrduLang ? "urdu-input" : ""}
        />
        <button type="button" onClick={startListening}>{t("chatbot.micBtn")}</button>
        <button type="submit">{t("chatbot.sendBtn")}</button>
      </form>
    </div>
  );
};

export default Chatbot;