import { useNavigate, useParams } from "react-router-dom";
const mascot = "https://cdn.zaheen.com.pk/zaheen-web-img/mascot.png";

// ─── KG Game card images ───────────────────────────────────────
import alphabetMatchImg from "@/assets/images/games/kg/cards/alphabet-match.png";
import urduMatchImg from "@/assets/images/games/kg/cards/urdu-match.JFIF";
import howManyImg from "@/assets/images/games/kg/cards/how-many.png";
import animalAlphabetImg from "@/assets/images/games/kg/cards/animal-alphabet.png";
import urduAnimalImg from "@/assets/images/games/kg/cards/urdu-animal-alphabet.png";

const GamesPage = () => {
  const navigate = useNavigate();
  const { type = "kg" } = useParams();

  /* =========================
     🎮 KG GAMES
  ========================== */
  if (type === "kg") {
    const featured = {
      id: "alphabet-match",
      title: "Alphabet Match",
      description:
        "Master the ABCs by matching letters with fun pictures and sounds!",
      badge: "MOST POPULAR",
      image: alphabetMatchImg,
      bg: "#f0f4ff",
      accent: "#2563eb",
    };

    const gridGames = [
      {
        id: "how-many",
        title: "How Many?",
        description: "Count the objects and tap the right number!",
        image: howManyImg,
        bg: "#fef3c7",
        accent: "#d97706",
        urdu: false,
      },
      {
        id: "urdu-match",
        title: "اردو میچ",
        description: "الف سے یے تک — اردو حروف پہچانو",
        image: urduMatchImg,
        bg: "#d1fae5",
        accent: "#059669",
        urdu: true,
      },
      {
        id: "animal-alphabet",
        title: "Animal Alphabet",
        description: "Match English letters to their animals!",
        image: animalAlphabetImg,
        bg: "#fce7f3",
        accent: "#db2777",
        urdu: false,
      },
      {
        id: "urdu-animal-alphabet",
        title: "اردو حروف",
        description: "اردو حروف اور جانوروں کو ملاؤ",
        image: urduAnimalImg,
        bg: "#ede9fe",
        accent: "#7c3aed",
        urdu: true,
      },
    ];

    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: "#f8fafc",
          fontFamily: "'Nunito', 'Quicksand', sans-serif",
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #dbeafe55 0%, transparent 50%), radial-gradient(circle at 80% 80%, #d1fae555 0%, transparent 50%)",
          }}
        />

        {/* Header */}
        <div className="relative z-10 pt-6 pb-2 px-4 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
            Fun Games Hub
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">
            Explore a world of playful learning! These games are designed to
            spark curiosity and joy.
          </p>
        </div>

        {/* Grid */}
        <div className="relative z-10 px-4 sm:px-8 py-6 max-w-5xl mx-auto">
          {/* ── Top row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* ── Featured card ── */}
            <div
              onClick={() => navigate(`/games/${type}/play/${featured.id}`)}
              className="lg:col-span-2 rounded-3xl overflow-hidden cursor-pointer group relative"
              style={{
                background: "#ffffff",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
                minHeight: "280px",
              }}
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Text side */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span
                      className="inline-block text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                      style={{ background: "#dbeafe", color: "#1d4ed8" }}
                    >
                      {featured.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-2 leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {featured.description}
                    </p>
                  </div>
                  <button
                    className="mt-6 self-start flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black text-white transition-all group-hover:scale-105 active:scale-95"
                    style={{
                      background: featured.accent,
                      boxShadow: `0 4px 12px -2px ${featured.accent}66`,
                    }}
                  >
                    Play Now ▶
                  </button>
                </div>

                {/* ✅ Image side — white background, image is a floating rounded square */}
                <div
                  className="sm:w-64 flex items-center justify-center p-5 relative"
                  style={{ background: "#ffffff", minHeight: "200px" }}
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="group-hover:scale-105 transition-transform duration-300"
                    style={{
                      width: "100%",
                      maxWidth: "220px",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "20px",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* How Many — top right */}
            {gridGames[0] && (
              <TopRightCard
                game={gridGames[0]}
                onClick={() => navigate(`/games/${type}/play/${gridGames[0].id}`)}
              />
            )}
          </div>

          {/* ── Bottom row: 3 equal cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gridGames.slice(1).map((g) => (
              <BottomCard
                key={g.id}
                game={g}
                onClick={() => navigate(`/games/${type}/play/${g.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Mascot */}
        <div className="hidden md:flex fixed bottom-4 left-4 items-end z-30 pointer-events-none">
          <div className="relative">
            <div className="absolute -top-12 left-16 bg-white px-3 py-2 rounded-2xl rounded-bl-none shadow-lg border-2 border-yellow-300 text-sm font-black text-orange-500 whitespace-nowrap">
              Pick a game! 🎉
            </div>
            <img
              src={mascot}
              alt="mascot"
              className="w-28 h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    );
  }

  /* =========================
   🎮 Grade 1–5 Games
  ========================== */
  if (type === "1-5") {
    const games = [
      {
        id: "how-many-fruit",
        title: "How Many Fruit",
        emoji: "🍎",
        color: "bg-pink-700",
      },
      {
        id: "missing-letter",
        title: "Missing Letter Game",
        emoji: "🚌",
        color: "bg-pink-500",
      },
      {
        id: "word-builder",
        title: "Word Builder",
        emoji: "🔤",
        color: "bg-pink-300",
      },
      {
        id: "missing-number",
        title: "Number Puzzle",
        emoji: "🔢",
        color: "bg-blue-300",
      },
      {
        id: "balloon",
        title: "Balloon Math",
        emoji: "🎈",
        color: "bg-yellow-300",
      },
      {
        id: "operator",
        title: "Operator Game",
        emoji: "➗",
        color: "bg-green-300",
      },
      {
        id: "math-basic",
        title: "Math Game",
        emoji: "➕",
        color: "bg-yellow-200",
      },
      {
        id: "math-battle",
        title: "Math Battle",
        emoji: "⚔️",
        color: "bg-blue-200",
      },
      {
        id: "math-signs",
        title: "Math Signs",
        emoji: "➖",
        color: "bg-green-200",
      },
      {
        id: "math-word",
        title: "Math Word Search",
        emoji: "🔍",
        color: "bg-purple-200",
      },
    ];

    return (
      <div className="min-h-screen p-4 bg-slate-200 relative overflow-hidden flex flex-col items-center">
        <header className="relative mb-8 pt-4 z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            🎮{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Learning Hub
            </span>
          </h1>
        </header>
        <div className="w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 px-4 z-10">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/games/${type}/play/${g.id}`)}
              className="group relative cursor-pointer"
            >
              <div
                className={`relative z-10 h-full p-4 rounded-xl border-2 bg-slate-700 transition-all duration-300 hover:-translate-y-1 ${g.color.replace("bg-", "border-").replace("400", "500")}`}
              >
                <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {g.emoji}
                  </span>
                </div>
                <h2 className="text-sm md:text-base font-bold text-slate-200 text-center mb-3 leading-tight">
                  {g.title}
                </h2>
                <div className="flex justify-center">
                  <span
                    className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded text-gray-700 ${g.color}`}
                  >
                    Start
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================
     🎮 Grade 6–8 Games
  ========================== */
  if (type === "6-8") {
    const games = [
      {
        id: "word-search",
        title: "Word Search",
        emoji: "🧠",
        color: "bg-indigo-300",
      },
    ];
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-slate-300 via-indigo-100 to-cyan-300 relative overflow-hidden flex flex-col items-center">
        <header className="relative mb-6 pt-4 z-10 text-center">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">
            Advanced Brain Games
          </h1>
        </header>
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 z-10">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/games/${type}/play/${g.id}`)}
              className="group relative cursor-pointer"
            >
              <div
                className={`relative z-10 h-full p-4 rounded-2xl border-2 bg-white/90 transition-all hover:-translate-y-1.5 ${g.color.replace("bg-", "border-").replace("400", "500")}`}
              >
                <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 rounded-xl bg-slate-50">
                  <span className="text-2xl">{g.emoji}</span>
                </div>
                <h2 className="text-sm md:text-base font-bold text-slate-700 text-center mb-3">
                  {g.title}
                </h2>
                <div className="flex justify-center">
                  <span
                    className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg text-white ${g.color}`}
                  >
                    Start
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-purple-200 to-pink-200 p-6">
      <div className="text-6xl mb-4 animate-bounce">🎮</div>
      <h1 className="text-3xl font-black text-purple-800 mb-3">
        Games Coming Soon!
      </h1>
      <button
        onClick={() => navigate(-1)}
        className="bg-white px-6 py-3 rounded-full shadow-lg font-bold"
      >
        ⬅ Back
      </button>
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────
interface CardGame {
  id: string;
  title: string;
  description: string;
  image: string;
  bg: string;
  accent: string;
  urdu?: boolean;
}

// ─── Top right card (How Many) ────────────────────────────────
function TopRightCard({
  game,
  onClick,
}: {
  game: CardGame;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-3xl overflow-hidden cursor-pointer group flex flex-col"
      style={{
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
        minHeight: "280px",
      }}
    >
      <div
        className="w-full overflow-hidden flex-shrink-0"
        style={{
          height: "170px",
          borderRadius: "24px 24px 0 0",
          backgroundColor: game.bg,
        }}
      >
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2
          className="font-black text-gray-800 text-base leading-tight"
          style={{
            fontFamily: game.urdu ? "Noto Nastaliq Urdu, serif" : "inherit",
            direction: game.urdu ? "rtl" : "ltr",
          }}
        >
          {game.title}
        </h2>
        <p
          className="text-gray-400 text-xs leading-relaxed flex-1"
          style={{
            fontFamily: game.urdu ? "Noto Nastaliq Urdu, serif" : "inherit",
            direction: game.urdu ? "rtl" : "ltr",
          }}
        >
          {game.description}
        </p>
        <button
          className="mt-2 w-full py-2.5 rounded-full text-xs font-black text-white transition-all group-hover:opacity-90 active:scale-95"
          style={{ background: game.accent }}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}

// ─── Bottom row card ──────────────────────────────────────────
function BottomCard({
  game,
  onClick,
}: {
  game: CardGame;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="rounded-3xl overflow-hidden cursor-pointer group flex flex-col"
      style={{
        background: "#ffffff",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
        minHeight: "320px",
      }}
    >
      <div
        className="w-full overflow-hidden flex-shrink-0"
        style={{
          height: "170px",
          borderRadius: "24px 24px 0 0",
          backgroundColor: game.bg,
        }}
      >
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2
          className="font-black text-gray-800 text-base leading-tight"
          style={{
            fontFamily: game.urdu ? "Noto Nastaliq Urdu, serif" : "inherit",
            direction: game.urdu ? "rtl" : "ltr",
          }}
        >
          {game.title}
        </h2>
        <p
          className="text-gray-400 text-xs leading-relaxed flex-1"
          style={{
            fontFamily: game.urdu ? "Noto Nastaliq Urdu, serif" : "inherit",
            direction: game.urdu ? "rtl" : "ltr",
          }}
        >
          {game.description}
        </p>
        <button
          className="mt-2 w-full py-2.5 rounded-full text-xs font-black text-white transition-all group-hover:opacity-90 active:scale-95"
          style={{ background: game.accent }}
        >
          Play Now
        </button>
      </div>
    </div>
  );
}

export default GamesPage;