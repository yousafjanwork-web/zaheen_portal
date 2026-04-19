import React, { useState, useRef, useEffect } from "react";
import "../../../styles/chatbot_fullpage.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://zai.zaheen.com.pk/api/chat";

const Chatbot = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("Maths");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const recognitionRef = useRef(null);
  const memoryRef = useRef("");

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* ---------------- ADD MESSAGE ---------------- */
  const addMessage = (text, type) => {
    setMessages((prev) => [...prev, { text, type }]);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput("");
    setLoading(true);

    addMessage(text, "user");

    const historyToSend = [
      ...messages.map((m) => ({
        role: m.type === "user" ? "user" : "model",
        text: m.text,
      })),
      { role: "user", text },
    ];

    // show typing
    addMessage("Typing...", "bot");

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          topic,
          language,
          history: historyToSend.slice(-10),
          memory: memoryRef.current,
        }),
      });

      clearTimeout(timeout);

      // remove typing
      setMessages((prev) => prev.filter((m) => m.text !== "Typing..."));

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      if (!data.reply) throw new Error("Empty response");

      addMessage(data.reply, "bot");

      if (data.memory) {
        memoryRef.current = data.memory;
      }
    } catch (err) {
      // remove typing
      setMessages((prev) => prev.filter((m) => m.text !== "Typing..."));

      let message = "⏳ AI is taking too long. Try again.";

      if (err.name === "AbortError") {
        message = "⏳ Request timed out. Try again.";
      } else if (err.message.includes("Failed")) {
        message = "🌐 Unable to connect to server.";
      } else if (err.message.includes("Server")) {
        message = "⚠️ Server error occurred.";
      } else if (err.message.includes("Empty")) {
        message = "🤖 Empty response. Ask differently.";
      }

      addMessage(message, "bot");
      console.error("Chat error:", err);
    }

    setLoading(false);
  };

  /* ---------------- ENTER KEY ---------------- */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  /* ---------------- VOICE INPUT ---------------- */
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      addMessage("🎤 Voice not supported in this browser.", "bot");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = language === "Urdu" ? "ur-PK" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    addMessage("🎤 Listening...", "bot");

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setInput(transcript);
      addMessage("🗣️ " + transcript, "user");

      sendMessage();
    };

    recognition.onerror = (event) => {
      let msg = "🎤 Voice error occurred.";

      if (event.error === "not-allowed") {
        msg = "🚫 Microphone permission denied.";
      } else if (event.error === "no-speech") {
        msg = "🤷 No speech detected.";
      }

      addMessage(msg, "bot");
    };
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="chatbot-container">

      {/* HEADER */}
      <div className="chatbot-header">
        📘 Zaheen AI Tutor
       
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option>Maths</option>
          <option>English</option>
          <option>Urdu</option>
          <option>Chemistry</option>
          <option>Physics</option>
          <option>Science</option>
          <option>Computer</option>
        </select>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="English">English</option>
          <option value="Urdu">Urdu</option>
        </select>
      </div>

      {/* CHAT */}
      <div className="chat-area" ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="input-box">
        <input
          value={input}
          placeholder="Ask your question..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={startListening}>🎤</button>

        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;