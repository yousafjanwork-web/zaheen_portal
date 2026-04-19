import React, { useEffect, useState } from "react";

const alphabets = {
  en: ["A", "B", "C", "D", "E", "F"],
  ur: ["ا", "ب", "پ", "ت", "ٹ", "ث"],
};

export default function MemoryGame({ lang = "en" }) {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  useEffect(() => {
    const base = alphabets[lang];
    let deck = [...base, ...base]
      .sort(() => Math.random() - 0.5)
      .map((val, i) => ({ id: i, value: val }));

    setCards(deck);
  }, [lang]);

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index)) return;

    const newFlip = [...flipped, index];
    setFlipped(newFlip);

    if (newFlip.length === 2) {
      const [a, b] = newFlip;

      if (cards[a].value === cards[b].value) {
        setMatched((m) => [...m, a, b]);
      }

      setTimeout(() => setFlipped([]), 800);
    }
  };

  return (
    <div className="min-h-screen bg-blue-200 p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">
        {lang === "en" ? "Memory Game" : "یادداشت کھیل"}
      </h1>

      <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
        {cards.map((card, i) => {
          const isOpen = flipped.includes(i) || matched.includes(i);

          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className={`h-20 flex items-center justify-center text-2xl rounded-xl cursor-pointer shadow-md transition
                ${isOpen ? "bg-white" : "bg-purple-400"}
              `}
            >
              {isOpen ? card.value : "❓"}
            </div>
          );
        })}
      </div>
    </div>
  );
}