import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import MathGame from "../components/MathGame";
import MemoryGame from "../components/MemoryGame";
import GameLayout from "../components/GameLayout";
import WordBuilderGame from "../components/WordBuilderGame";
import MissingNumberGame from "../components/MissingNumberGame";
import BalloonPopGame from "../components/BalloonPopGame";
import OperatorGame from "../components/OperatorGame";
import AlphabetMatch from "../components/AlphabetMatch";
import HowManyGame from "../components/Howmanygame";
import UrduMatch from "../components/UrduMatch";
import AnimalAlphabetDray from "../components/AnimalAlphabetDrag";
import UrduAnimalAlphabet from "../components/UrduAnimalAlphabet";
import HowManyFruits from "../components/HowManyFruits";
import Missinglettergame from "../components/Missinglettergame";
// ✅ Games that have their OWN GameLayout inside — no double wrapping
const SELF_LAYOUT_GAMES = [
  "alphabet-match",
  "urdu-match",
  "how-many",
  "animal-alphabet",
  "urdu-animal-alphabet",
];

const PlayGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const game = query.get("game")?.toLowerCase();
  const type = query.get("type") || "kg";

  const [loading, setLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  if (!game) {
    navigate(`/games?type=${type}`);
    return null;
  }

  let grade = "KG";
  if (type === "1-5") grade = "KG1";
  else if (type === "6-8") grade = "KG2";

  const externalGames: any = {
    "math-basic": "https://fitsworld.com.pk/Games/Math-Game/",
    "math-battle": "https://fitsworld.com.pk/Games/Math-Magic-Battle/",
    "math-signs": "https://fitsworld.com.pk/Games/Math-Signs-Game/",
    "math-word": "https://fitsworld.com.pk/Games/Math-Word-Search/",
    "word-search": "https://fitsworld.com.pk/Games/Word_Search/",
  };

  const renderGame = () => {
    if (game === "math") return <MathGame grade={grade} />;
    if (game === "memory-en") return <MemoryGame lang="en" />;
    if (game === "memory-ur") return <MemoryGame lang="ur" />;
    if (game === "word-builder") return <WordBuilderGame />;
    if (game === "missing-number") return <MissingNumberGame />;
    if (game === "balloon") return <BalloonPopGame />;
    if (game === "operator") return <OperatorGame />;
    if (game === "alphabet-match") return <AlphabetMatch />;
    if (game === "how-many") return <HowManyGame />;
    if (game === "urdu-match") return <UrduMatch />;
    if (game === "animal-alphabet") return <AnimalAlphabetDray />;
    if (game === "urdu-animal-alphabet") return <UrduAnimalAlphabet />;
    if (game === "how-many-fruit") return <HowManyFruits />;
    if (game === "missing-letter") return <Missinglettergame />;
    if (externalGames[game]) {
      const url = externalGames[game];
      return (
        <div className="relative w-full h-full">
          {loading && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <div className="text-5xl animate-bounce mb-4">🎮</div>
              <p className="text-lg font-bold">Loading your game...</p>
            </div>
          )}
          {iframeError ? (
            <div className="text-center mt-10">
              <p className="text-lg mb-4">🚀 Click below to play the game</p>
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

    return (
      <div className="text-center mt-10 text-xl">
        ❌ Game not found ({game})
      </div>
    );
  };

  // ✅ Self-layout games — render directly without wrapper
  if (SELF_LAYOUT_GAMES.includes(game)) {
    return <>{renderGame()}</>;
  }

  // All other games use shared GameLayout
  return (
    <GameLayout title="Game Time" type={type}>
      {renderGame()}
    </GameLayout>
  );
};

export default PlayGamePage;
