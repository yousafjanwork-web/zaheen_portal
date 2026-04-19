import { useNavigate, useLocation } from "react-router-dom";
import mascot from "@/assets/images/mascot.png";

const GamesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const type = query.get("type") || "kg";

  /* =========================
     🎮 KG GAMES
  ========================== */
  if (type === "kg") {
    const games = [
      { id: "math", title: "Math Fun", emoji: "➕", color: "bg-yellow-300" },
      { id: "memory-en", title: "Alphabet Memory", emoji: "🔤", color: "bg-pink-300" },
      { id: "memory-ur", title: "Urdu Memory", emoji: "🅰️", color: "bg-green-300" },
    ];

    return (
      <div className="min-h-screen p-4 bg-gradient-to-b from-yellow-200 to-pink-200">
        <h1 className="text-3xl font-black text-center mb-6">
          🎮 Fun Learning Games
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() =>
                navigate(`/games/play?game=${g.id}&type=${type}`)
              }
              className={`p-6 rounded-3xl shadow-lg cursor-pointer hover:scale-105 transition ${g.color}`}
            >
              <div className="text-5xl text-center mb-3">{g.emoji}</div>
              <h2 className="text-center font-bold">{g.title}</h2>
            </div>
          ))}
        </div>

        {/* 🧸 Mascot (desktop only) */}
        <div className="hidden md:block fixed bottom-0 left-0 w-36 z-20 pointer-events-none">
          <img src={mascot} alt="mascot" className="animate-bounce" />
        </div>
      </div>
    );
  }

  /* =========================
     🎮 Grade 1–5 Games
  ========================== */
 /* =========================
   🎮 Grade 1–5 Games
========================== */
if (type === "1-5") {
  const games = [
    { id: "word-builder", title: "Word Builder", emoji: "🔤", color: "bg-pink-300" },
    { id: "missing-number", title: "Number Puzzle", emoji: "🔢", color: "bg-blue-300" },
    { id: "balloon", title: "Balloon Math", emoji: "🎈", color: "bg-yellow-300" },
    { id: "operator", title: "Operator Game", emoji: "➗", color: "bg-green-300" },

    // 🌐 External Games
    { id: "math-basic", title: "Math Game", emoji: "➕", color: "bg-yellow-200" },
    { id: "math-battle", title: "Math Battle", emoji: "⚔️", color: "bg-blue-200" },
    { id: "math-signs", title: "Math Signs", emoji: "➖", color: "bg-green-200" },
    { id: "math-word", title: "Math Word Search", emoji: "🔍", color: "bg-purple-200" },
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-blue-200 to-green-200">
      <h1 className="text-3xl font-black text-center mb-6">
        🎮 Learning Games
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((g) => (
          <div
            key={g.id}
            onClick={() =>
              navigate(`/games/play?game=${g.id}&type=${type}`)
            }
            className={`p-6 rounded-3xl shadow-lg cursor-pointer hover:scale-105 transition ${g.color}`}
          >
            <div className="text-5xl text-center mb-3">{g.emoji}</div>
            <h2 className="text-center font-bold">{g.title}</h2>
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
    { id: "word-search", title: "Word Search", emoji: "🧠", color: "bg-indigo-300" },
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-indigo-200 to-purple-200">
      <h1 className="text-3xl font-black text-center mb-6">
        🎮 Brain Games
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {games.map((g) => (
          <div
            key={g.id}
            onClick={() =>
              navigate(`/games/play?game=${g.id}&type=${type}`)
            }
            className={`p-6 rounded-3xl shadow-lg cursor-pointer hover:scale-105 transition ${g.color}`}
          >
            <div className="text-5xl text-center mb-3">{g.emoji}</div>
            <h2 className="text-center font-bold">{g.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

  /* =========================
     🚧 Coming Soon (Others)
  ========================== */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-b from-purple-200 to-pink-200 p-6">
      <div className="text-6xl mb-4 animate-bounce">🎮</div>

      <h1 className="text-3xl font-black text-purple-800 mb-3">
        Games Coming Soon!
      </h1>

      <p className="text-lg text-gray-700 max-w-md mb-6">
        Amazing games are coming for your grade 🚀
      </p>

      <button
        onClick={() => navigate(-1)}
        className="bg-white px-6 py-3 rounded-full shadow-lg font-bold"
      >
        ⬅ Back
      </button>
    </div>
  );
};

export default GamesPage;