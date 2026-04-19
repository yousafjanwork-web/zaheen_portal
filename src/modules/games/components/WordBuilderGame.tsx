// WordBuilderGame.tsx
import { useState } from "react";

const words = [
  { word: "APPLE", hint: "🍎" },
  { word: "BALL", hint: "⚽" },
  { word: "CAT", hint: "🐱" },
];

export default function WordBuilderGame() {
  const [current] = useState(words[Math.floor(Math.random() * words.length)]);
  const [letters] = useState([...current.word].sort(() => Math.random() - 0.5));
  const [answer, setAnswer] = useState("");

  const check = () => {
    if (answer === current.word) alert("✅ Correct!");
    else alert("❌ Try again");
  };

  return (
    <div className="text-center">
      <div className="text-6xl mb-4">{current.hint}</div>

      <div className="flex justify-center gap-2 mb-4">
        {letters.map((l, i) => (
          <button
            key={i}
            onClick={() => setAnswer(answer + l)}
            className="bg-yellow-300 px-4 py-2 rounded"
          >
            {l}
          </button>
        ))}
      </div>

      <div className="text-2xl mb-4">{answer}</div>

      <button onClick={check} className="bg-green-500 text-white px-4 py-2 rounded">
        Check
      </button>
    </div>
  );
}