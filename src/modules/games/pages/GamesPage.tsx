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
      {
        id: "alphabet-match",
        title: "Alphabet Match",
        emoji: "🔤",
        color: "bg-blue-300",
      },
      {
        id: "urdu-match",
        title: "Urdu Match",
        emoji: "اردو",
        color: "bg-green-300",
      },
      {
        id: "how-many",
        title: "How Many?",
        emoji: "🔢",
        color: "bg-yellow-300",
      },
      {
        id: "animal-alphabet",
        title: "Animal Alphabet",
        emoji: "🐾",
        color: "bg-green-300",
      },
      {
        id: "urdu-animal-alphabet",
        title: "اردو حروف",
        emoji: "اردو",
        color: "bg-pink-300",
      },
    ];
    return (
      <div className="min-h-screen p-4 bg-amber-100 relative overflow-hidden flex flex-col items-center">
        {/* Playful background decorations */}
        <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[-5%] right-[-5%] w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-40" />

        {/* Header: Compact for more space */}
        <header className="relative mb-8 pt-4 z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-orange-500 drop-shadow-sm">
            ✨ Magic Learning Games ✨
          </h1>
          <p className="text-blue-400 font-bold text-md mt-1 italic">
            Let's play and learn!
          </p>
        </header>

        {/* Grid: Smaller cards and tighter gap */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6 px-6 mb-12 z-10">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/games/play?game=${g.id}&type=${type}`)}
              className="relative group cursor-pointer"
            >
              {/* Main Card: Smaller padding and smaller text */}
              <div
                className={`
            relative z-10 bg-white border-[5px] rounded-[2rem] p-5 h-full 
            flex flex-col items-center justify-center transition-all duration-200
            group-hover:-translate-y-2 group-active:translate-y-1
            shadow-[0_8px_0_0_rgba(0,0,0,0.05)]
            ${g.color.replace("bg-", "border-")}
          `}
              >
                {/* Smaller Icon */}
                <div className="text-5xl text-center mb-3 group-hover:scale-110 transition-transform">
                  {g.emoji}
                </div>

                <h2
                  className={`text-lg md:text-xl font-black text-center leading-tight ${g.color.replace("bg-", "text-")}`}
                >
                  {g.title}
                </h2>
              </div>

              {/* 3D Shadow */}
              <div className="absolute inset-0 translate-y-2 bg-gray-200 rounded-[2rem] z-0" />
            </div>
          ))}
        </div>

        {/* 🧸 Mascot: Fixed position and smaller size */}
        <div className="hidden md:flex fixed bottom-4 left-4 items-end z-30 pointer-events-none">
          <div className="relative">
            {/* Speech bubble moved up to stay away from the small cards */}
            <div className="absolute -top-14 left-20 w-32 bg-white px-3 py-2 rounded-2xl rounded-bl-none shadow-lg border-[3px] border-yellow-400 text-sm font-black text-orange-500">
              Hi! Pick one!
            </div>
            <img
              src={mascot}
              alt="mascot"
              className="w-32 h-auto drop-shadow-xl"
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

      // 🌐 External Games
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
        {/* Neon Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[120px] pointer-events-none" />

        <header className="relative mb-8 pt-4 z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            🎮{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Learning Hub
            </span>
          </h1>
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mt-2 rounded-full opacity-80" />
        </header>

        {/* Compact Grid */}
        <div className="w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 px-4 z-10">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/games/play?game=${g.id}&type=${type}`)}
              className="group relative cursor-pointer"
            >
              <div
                className={`
            relative z-10 h-full p-4 rounded-xl border-2 bg-slate-700 backdrop-blur-xl
            transition-all duration-300 ease-in-out
            hover:-translate-y-1 hover:shadow-[0_0_15px_-5px_rgba(255,255,255,0.3)]
            ${g.color.replace("bg-", "border-").replace("400", "500")}
          `}
              >
                <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <span className="text-3xl group-hover:scale-110 transition-transform">
                    {g.emoji}
                  </span>
                </div>

                <h2 className="text-sm md:text-base font-bold text-slate-200 text-center mb-3 leading-tight tracking-wide">
                  {g.title}
                </h2>

                <div className="flex justify-center">
                  <span
                    className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded text-gray-700 shadow-lg ${g.color}`}
                  >
                    Start
                  </span>
                </div>
              </div>

              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 ${g.color}`}
              />
            </div>
          ))}
        </div>

        {/* 🧸 Fixed Mascot & Visible Speech Bubble */}
        <div className="hidden lg:flex fixed bottom-8 left-8 items-end z-20 pointer-events-none">
          <div className="relative">
            {/* Changed to White background with high contrast text */}
            <div className="absolute -top-14 left-14 bg-white border-2 border-cyan-400 px-4 py-2 rounded-2xl rounded-bl-none shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-bounce">
              <p className="text-xs font-black text-slate-900 whitespace-nowrap">
                Ready to level up? 🚀
              </p>
              {/* Triangle tail for bubble */}
              <div className="absolute -bottom-2 left-0 w-0 h-0 border-t-[10px] border-t-white border-r-[10px] border-r-transparent"></div>
            </div>

            <img
              src={mascot}
              alt="mascot"
              className="w-24 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </div>
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
        {/* Soft Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-200/30 rounded-full blur-[100px] pointer-events-none" />

        {/* Header Section */}
        <header className="relative mb-6 pt-4 z-10 text-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 flex items-center gap-2 justify-center">
            <span>🎮</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">
              Advanced Brain Games
            </span>
          </h1>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto mt-2 rounded-full opacity-80" />
        </header>

        {/* Compact Grid with Smaller Cards */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 z-10">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/games/play?game=${g.id}&type=${type}`)}
              className="group relative cursor-pointer"
            >
              {/* Compact Light Card */}
              <div
                className={`
            relative z-10 h-full p-4 rounded-2xl border-2 bg-white/90 backdrop-blur-sm
            transition-all duration-300 ease-out
            hover:-translate-y-1.5 hover:bg-white
            hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)]
            /* Vibrant colored borders */
            ${g.color.replace("bg-", "border-").replace("400", "500")}
          `}
              >
                {/* Scaled Down Icon Box */}
                <div className="flex items-center justify-center h-12 w-12 mx-auto mb-3 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                  <span className="text-2xl drop-shadow-sm">{g.emoji}</span>
                </div>

                <h2 className="text-sm md:text-base font-bold text-slate-700 text-center mb-3 leading-tight">
                  {g.title}
                </h2>

                <div className="flex justify-center">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg text-white shadow-sm transform transition-all group-hover:bg-opacity-90 ${g.color}`}
                  >
                    Start
                  </span>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 rounded-2xl ${g.color}`}
              />
            </div>
          ))}
        </div>

        {/* 🧸 Mascot with High-Contrast Bubble */}
        <div className="hidden lg:flex fixed bottom-8 left-8 items-end z-20 pointer-events-none">
          <div className="relative group">
            {/* Dark Bubble for Light Background visibility */}
            <div className="absolute -top-12 left-16 bg-slate-800 px-4 py-1.5 rounded-2xl rounded-bl-none shadow-lg border border-slate-700">
              <p className="text-[11px] font-bold text-white whitespace-nowrap">
                Ready to level up? 🚀
              </p>
            </div>

            <img
              src={mascot}
              alt="mascot"
              className="w-24 h-auto drop-shadow-md transition-transform hover:scale-110"
            />
          </div>
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
