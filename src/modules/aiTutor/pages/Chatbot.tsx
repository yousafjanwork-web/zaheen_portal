// src/components/Chatbot.js

import React, { useState, useRef, useEffect } from "react";
import "../../../styles/chatbot_fullpage.css";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [topic, setTopic] = useState("Mathematics");
    const [language, setLanguage] = useState("English");

    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    /* ---------------- TEXT TO SPEECH ---------------- */

    const speakText = (text, lang) => {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang =
            lang === "Urdu"
                ? "ur-PK"
                : lang === "Arabic"
                    ? "ar-SA"
                    : "en-US";

        utterance.rate = 0.95;
        speechSynthesis.speak(utterance);
    };

    /* ---------------- SEND MESSAGE ---------------- */

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");

        let historyToSend = [];

        setMessages((prev) => {
            historyToSend = [...prev, { role: "user", text: userMessage }];
            return [...historyToSend, { role: "loading", text: "Thinking..." }];
        });

        try {
            const response = await fetch(
                "https://api.zaheen.com.pk/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        topic,
                        language,
                        history: historyToSend
                            .filter(m => m.role !== "loading")
                            .slice(-10),
                    }),
                }
            );
            const data = await response.json();

            setMessages((prev) =>
                prev
                    .filter((m) => m.role !== "loading")
                    .concat({
                        role: "model",
                        text: data.reply || "Sorry, I couldn't generate a response.",
                    })
            );
        } catch (error) {
            setMessages((prev) =>
                prev
                    .filter((m) => m.role !== "loading")
                    .concat({
                        role: "model",
                        text: "⚠️ Unable to reach tutor service.",
                    })
            );
        }
    };

    /* ---------------- ENTER KEY ---------------- */

    const handleKeyDown = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    /* ---------------- AUTO SCROLL ---------------- */

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    /* ---------------- UI ---------------- */

    return (
        <div className="chatbot-container">

            {/* Header */}

            <div className="chatbot-header">
                <h3>Zaheen AI Tutor</h3>
                <button onClick={() => navigate("/")}>✖</button>
            </div>

            {/* Settings */}

            <div className="chatbot-settings">

                <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Biology</option>
                    <option>Chemistry</option>
                    <option>Computer Science</option>
                </select>

                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Urdu</option>
                    <option>Arabic</option>
                </select>

            </div>

            {/* Messages */}

            <div className="chatbot-messages">

                {messages.map((msg, i) => (
                    <div key={i} className={`message ${msg.role}`}>

                        <img
                            className="avatar"
                            src={
                                msg.role === "user"
                                    ? "https://cdn-icons-png.flaticon.com/512/219/219970.png"
                                    : "https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
                            }
                            alt="avatar"
                        />

                        <span>{msg.text}</span>

                        {msg.role === "model" && (
                            <button
                                className="play-button"
                                onClick={() => speakText(msg.text, language)}
                            >
                                🔊
                            </button>
                        )}

                    </div>
                ))}

                <div ref={chatEndRef} />

            </div>

            {/* Input */}

            <div className="chatbot-input">

                <input
                    type="text"
                    value={input}
                    placeholder="Ask your tutor anything..."
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={sendMessage}>Send</button>

            </div>

        </div>
    );
};

export default Chatbot;