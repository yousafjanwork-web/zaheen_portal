// BalloonPopGame.tsx
import { useEffect, useState } from "react";

export default function BalloonPopGame() {
  const [question, setQuestion] = useState({ a: 0, b: 0 });
  const [answers, setAnswers] = useState<number[]>([]);

  useEffect(() => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const correct = a + b;

    let opts = [correct];
    while (opts.length < 4) {
      let fake = correct + Math.floor(Math.random() * 5 - 2);
      if (!opts.includes(fake) && fake > 0) opts.push(fake);
    }

    setQuestion({ a, b });
    setAnswers(opts.sort(() => Math.random() - 0.5));
  }, []);

  const handleClick = (val: number) => {
    if (val === question.a + question.b) alert("🎉 Correct!");
    else alert("❌ Try again");
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-6">
        {question.a} + {question.b} = ?
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {answers.map((a, i) => (
          <div
            key={i}
            onClick={() => handleClick(a)}
            className="bg-pink-300 p-6 rounded-full cursor-pointer hover:scale-110 transition"
          >
            🎈 {a}
          </div>
        ))}
      </div>
    </div>
  );
}