import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import MathGame from "../components/MathGame";
import MemoryGame from "../components/MemoryGame";
import GameLayout from "../components/GameLayout";
import WordBuilderGame from "../components/WordBuilderGame";
import MissingNumberGame from "../components/MissingNumberGame";
import BalloonPopGame from "../components/BalloonPopGame";
import OperatorGame from "../components/OperatorGame";

const PlayGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const game = query.get("game")?.toLowerCase();
  const type = query.get("type") || "kg";

  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  // ❌ If no game → go back
  if (!game) {
    navigate(`/games?type=${type}`);
    return null;
  }

  // 🎯 Grade mapping
  let grade = "KG";
  if (type === "1-5") grade = "KG1";
  else if (type === "6-8") grade = "KG2";

  /* =========================
     🌐 External Games Map
  ========================== */
  const externalGames: any = {
    "math-basic": "https://fitsworld.com.pk/Games/Math-Game/",
    "math-battle": "https://fitsworld.com.pk/Games/Math-Magic-Battle/",
    "math-signs": "https://fitsworld.com.pk/Games/Math-Signs-Game/",
    "math-word": "https://fitsworld.com.pk/Games/Math-Word-Search/",
    "word-search": "https://fitsworld.com.pk/Games/Word_Search/",
  };

  /* =========================
     🎮 Render Game
  ========================== */
  const renderGame = () => {
    // ✅ Internal games
    if (game === "math") return <MathGame grade={grade} />;
    if (game === "memory-en") return <MemoryGame lang="en" />;
    if (game === "memory-ur") return <MemoryGame lang="ur" />;
    if (game === "word-builder") return <WordBuilderGame />;
    if (game === "missing-number") return <MissingNumberGame />;
    if (game === "balloon") return <BalloonPopGame />;
    if (game === "operator") return <OperatorGame />;

    // ✅ External games
    if (externalGames[game]) {
      const url = externalGames[game];

      return (
        <div className="relative w-full h-full">
          {/* ⏳ Loading Screen */}
          {loading && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <div className="text-5xl animate-bounce mb-4">🎮</div>
              <p className="text-lg font-bold">Loading your game...</p>
            </div>
          )}

          {/* ❌ Fallback if iframe blocked */}
          {iframeError ? (
            <div className="text-center mt-10">
              <p className="text-lg mb-4">
                🚀 Click below to play the game
              </p>
              <button
                onClick={() => window.open(url, "_blank")}
                className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg"
              >
                ▶ Play Game
              </button>
            </div>
          ) : (
            <iframe
              src={url}
              title="Game"
              className="w-full h-[calc(100vh-100px)] border-0 rounded-xl"
              onLoad={() => setLoading(false)}
              onError={() => {
                setIframeError(true);
                setLoading(false);
              }}
            />
          )}
        </div>
      );
    }

    // ❌ Unknown game
    return (
      <div className="text-center mt-10 text-xl">
        ❌ Game not found ({game})
      </div>
    );
  };

  /* =========================
     🎨 Page Layout
  ========================== */
  return (
    <GameLayout title="Game Time" type={type}>
      {renderGame()}
    </GameLayout>
  );
};

export default PlayGamePage;