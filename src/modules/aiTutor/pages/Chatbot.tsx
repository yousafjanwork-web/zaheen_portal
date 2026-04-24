import React, { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import "../../../styles/chatbot_fullpage.css";

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

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [topic, setTopic] = useState<string>("Maths");
  const [language, setLanguage] = useState<string>("English");
  const [loading, setLoading] = useState<boolean>(false);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const memoryRef = useRef<string>("");
  const isListening = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const historyRef = useRef<ChatHistory[]>([]);
  const languageRef = useRef<string>("English");
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);

  // ROOT CAUSE FIX for "AI keeps replying in old language":
  // The conversation history (historyRef) contained all the previous Urdu messages.
  // When a new question was sent, that Urdu history was included in the API payload.
  // The AI model uses conversation history as strong context for which language to use,
  // so it ignored the new language setting and kept replying in Urdu.
  // Fix: on language change, wipe history + memory so the AI has a clean slate.
  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    languageRef.current = val;

    // Clear all state that carries the old language's context
    historyRef.current = [];
    memoryRef.current = "";
    queueRef.current = [];

    // Show a divider so the user knows a new session started
    const notice =
      val === "Urdu"
        ? "🔄 زبان اردو میں تبدیل ہو گئی — نئی گفتگو شروع"
        : "🔄 Language switched to English — new session started";
    setMessages((prev) => [...prev, { text: notice, type: "bot", isHtml: false }]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
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
        historyRef.current.push({ role: "model", text: text });
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
            // Read from ref (not state) to avoid stale closure — ensures
            // language is always current even inside memoized callback
            language: languageRef.current,
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
              const next = queueRef.current.shift()!;
              processMessage(next);
            } else {
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          });
        } else {
          isProcessingRef.current = false;
          if (queueRef.current.length > 0) {
            const next = queueRef.current.shift()!;
            processMessage(next);
          }
        }
      } catch (err) {
        setLoading(false);
        setMessages((prev) => [
          ...prev,
          { text: "⚠️ Server error. Try again.", type: "bot" },
        ]);
        isProcessingRef.current = false;
        if (queueRef.current.length > 0) {
          const next = queueRef.current.shift()!;
          processMessage(next);
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
    recognition.lang = languageRef.current === "Urdu" ? "ur-PK" : "en-US";
    isListening.current = true;
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

  const isUrdu = (text: string) => /[\u0600-\u06FF]/.test(text);
  const isUrduLang = language === "Urdu";

  return (
    <div
      className="chatbot-container"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      <div className="chatbot-header">📘 Zaheen AI Tutor</div>

      <div className="controls">
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="Maths">Maths</option>
          <option value="English">English</option>
          <option value="Urdu">Urdu</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Physics">Physics</option>
          <option value="Science">Science</option>
          <option value="Computer">Computer</option>
        </select>
        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
          <option value="English">English</option>
          <option value="Urdu">Urdu</option>
        </select>
      </div>

      <div
        className="chat-area"
        ref={chatRef}
        style={{ flex: 1, overflowY: "auto", paddingBottom: "8px" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`msg ${msg.type} ${isUrdu(msg.text) ? "urdu" : ""}`}
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
              {isUrduLang ? "🤖 AI soch raha hai..." : "🤖 AI is thinking..."}
            </div>
          </div>
        )}
      </div>

      {queueRef.current.length > 0 && (
        <div className="queue-notice">
          {queueRef.current.length} message(s) waiting...
        </div>
      )}

      <form className="input-box" onSubmit={sendMessage} style={{ flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          placeholder={isUrduLang ? "اپنا سوال پوچھیں..." : "Ask your question..."}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className={isUrduLang ? "urdu-input" : ""}
        />
        <button type="button" onClick={startListening}>🎤</button>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;