import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import mascot from "@/assets/images/mascot.png";

const GameLayout = ({ children, title = "Game", type }: any) => {
  const navigate = useNavigate();
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // generate floating stars
    const s = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      size: Math.random() * 20 + 10,
    }));
    setStars(s);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-b from-blue-300 via-pink-200 to-yellow-200">
      {/* ✨ Floating Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute animate-bounce opacity-70"
          style={{
            left: `${s.left}%`,
            top: `${Math.random() * 100}%`,
            fontSize: s.size,
            animationDelay: `${s.delay}s`,
          }}
        >
          ⭐
        </div>
      ))}

      {/* 🧸 HEADER */}
      <div className="flex items-center justify-between p-4 relative z-10">
        <button
          onClick={() => navigate(`/games?type=${type}`)}
          className="bg-white px-4 py-2 rounded-full shadow-lg font-bold hover:scale-105 transition"
        >
          ⬅ Back
        </button>

        <h2 className="text-2xl font-black text-purple-800 drop-shadow">
          🎮 {title}
        </h2>

        <div className="bg-white px-4 py-2 rounded-full shadow font-bold">
          ⭐ Fun
        </div>
      </div>

      {/* 🧸 Mascot */}
      {/* 🧸 Mascot (Desktop Only) */}
      <div className="hidden md:block fixed bottom-0 left-[-10px] w-40 md:w-52 z-20 pointer-events-none">
        <img
          src={mascot}
          alt="mascot"
          className="w-full animate-bounce drop-shadow-2xl"
        />
      </div>
      {/* 🧸 Mascot (Mobile Only - Centered at bottom) */}
      <div className="md:hidden flex justify-center pb-6 relative z-20">
        <img
          src={mascot}
          alt="mascot"
          className="w-28 h-28 object-contain animate-bounce duration-[4000ms] drop-shadow-xl"
        />
      </div>

      {/* 🎮 GAME CONTENT */}
      <div className="relative z-10 p-4">{children}</div>
    </div>
  );
};

export default GameLayout;
