// MissingNumberGame.tsx
import { useState } from "react";

export default function MissingNumberGame() {
  const a = Math.floor(Math.random() * 10);
  const step = Math.floor(Math.random() * 5) + 1;

  const sequence = [a, a + step, a + 2 * step, a + 3 * step];
  const correct = sequence[2];

  const options = [correct, correct + 1, correct - 1, correct + 2].sort(
    () => Math.random() - 0.5
  );

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="text-center">
      <h2 className="text-2xl mb-4">
        {sequence[0]}, {sequence[1]}, __ , {sequence[3]}
      </h2>

      <div className="flex justify-center gap-3">
        {options.map((o, i) => (
          <button
            key={i}
            onClick={() => setSelected(o)}
            className="bg-blue-300 px-4 py-2 rounded"
          >
            {o}
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="mt-4 text-xl">
          {selected === correct ? "✅ Correct!" : "❌ Wrong"}
        </div>
      )}
    </div>
  );
}