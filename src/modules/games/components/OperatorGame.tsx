// OperatorGame.tsx
import { useState } from "react";

export default function OperatorGame() {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);

  const operators = [
    { op: "+", result: a + b },
    { op: "-", result: a - b },
  ];

  const correct = operators[0]; // addition for now

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">
        {a} __ {b} = {correct.result}
      </h2>

      <div className="flex justify-center gap-4">
        {operators.map((o, i) => (
          <button
            key={i}
            onClick={() => setSelected(o.op)}
            className="bg-purple-300 px-6 py-3 rounded text-xl"
          >
            {o.op}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-4 text-xl">
          {selected === correct.op ? "✅ Correct!" : "❌ Wrong"}
        </div>
      )}
    </div>
  );
}