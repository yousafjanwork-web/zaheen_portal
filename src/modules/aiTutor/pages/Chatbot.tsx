import React, { useState, useRef, useEffect, FormEvent } from "react";
import "../../../styles/chatbot_fullpage.css";

interface Message {
  text: string;
  type: "user" | "bot";
}

interface ChatHistory {
  role: "user" | "model";
  text: string;
}

const API_URL = "https://zai.zaheen.com.pk/api/chat";

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

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const addMessage = (text: string, type: "user" | "bot") => {
    const newMessage: Message = { text, type };
    setMessages((prev) => [...prev, newMessage]);
    
    if (text !== "") {
      historyRef.current.push({
        role: type === "user" ? "user" : "model",
        text: text,
      });
      if (historyRef.current.length > 10) historyRef.current.shift();
    }
  };

  const typeMessage = (text: string) => {
    let i = 0;
    let temp = "";
    setMessages((prev) => [...prev, { text: "", type: "bot" }]);

    const interval = setInterval(() => {
      temp += text.charAt(i);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { text: temp, type: "bot" };
        return updated;
      });
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        historyRef.current.push({ role: "model", text: text });
      }
    }, 8);
  };

  const sendMessage = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const textToSend = input.trim();
    if (!textToSend || loading) return;

    setInput(""); 
    setLoading(true);
    setMessages((prev) => [...prev, { text: textToSend, type: "user" }]);
    historyRef.current.push({ role: "user", text: textToSend });

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          language,
          history: historyRef.current.slice(-10),
          memory: memoryRef.current,
        }),
      });

      const data = await res.json();
      if (data.reply) typeMessage(data.reply);
      if (data.memory) memoryRef.current = data.memory;
    } catch (err) {
      addMessage("⚠️ Server error. Try again.", "bot");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const startListening = () => {
    if (isListening.current) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language === "Urdu" ? "ur-PK" : "en-US";
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

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">📘 Zaheen AI Tutor</div>
      
      <div className="controls">
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option>Maths</option><option>English</option><option>Urdu</option>
          <option>Chemistry</option><option>Physics</option><option>Science</option>
          <option>Computer</option>
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option><option value="Urdu">Urdu</option>
        </select>
      </div>

      <div className="chat-area" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.type} ${isUrdu(msg.text) ? "urdu" : ""}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        
        {/* Yahan fix kiya hai: Jab Urdu select ho to loading bhi Urdu style mein aye */}
        {loading && (
          <div className={`msg bot ${language === "Urdu" ? "urdu" : ""}`}>
            <div className="bubble thinking">
              {language === "Urdu" ? "🤖 AI soch raha hai..." : "🤖 AI is thinking..."}
            </div>
          </div>
        )}
      </div>

      <form className="input-box" onSubmit={sendMessage}>
        <input
          ref={inputRef}
          value={input}
          placeholder={language === "Urdu" ? "اپنا سوال پوچھیں..." : "Ask your question..."}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          className={language === "Urdu" ? "urdu-input" : ""}
        />
        <button type="button" onClick={startListening}>🎤</button>
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
};

export default Chatbot;