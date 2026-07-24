import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { CelebrationModal } from "./components/layout/CelebrationModal";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { ProvincePage } from "./pages/ProvincePage";
import { CityPage } from "./pages/CityPage";
import { GamesPage } from "./pages/GamesPage";
import { GamePlayPage } from "./pages/GamePlayPage";
import { QuizPage } from "./pages/QuizPage";
import { StoryPage } from "./pages/StoryPage";
import { HeroesPage } from "./pages/HeroesPage";
import { AnimalsPage } from "./pages/AnimalsPage";
import { FoodsPage } from "./pages/FoodsPage";
import { SymbolsPage } from "./pages/SymbolsPage";
import { CollectionPage } from "./pages/CollectionPage";
import { BadgesPage } from "./pages/BadgesPage";
import { ProgressPage } from "./pages/ProgressPage";
import { VideosPage } from "./pages/VideosPage";
import { useEffect } from "react";
import { useGameStore } from "./store/useGameStore";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          {/* ✅ All paths are now relative (no leading /) so they work under /pakistan/* */}
          <Route path="/map" element={<MapPage />} />
          <Route path="province/:id" element={<ProvincePage />} />
          <Route path="province/:provinceId/city/:cityId" element={<CityPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="games/:gameId" element={<GamePlayPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="heroes" element={<HeroesPage />} />
          <Route path="animals" element={<AnimalsPage />} />
          <Route path="foods" element={<FoodsPage />} />
          <Route path="symbols" element={<SymbolsPage />} />
          <Route path="collection" element={<CollectionPage />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function FloatingCompanion() {
  const setMsg = useGameStore((s) => s.setZaheenMessage);
  const location = useLocation();

  // Hide floating button on home (hero already has Zaheen)
  // Matches both /pakistan and /pakistan-mobile home paths
  const isHome = /^\/pakistan(-mobile)?\/?$/.test(location.pathname);
  if (isHome) return null;

  return (
    <motion.button
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 text-2xl shadow-2xl border-4 border-white"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.5 }}
      onClick={() =>
        setMsg(
          [
            "Need a hint? Explore the map!",
            "Try a mini-game for bonus XP!",
            "Have you met the national heroes yet?",
            "Collect stars in city adventures!",
            "You're doing amazing, explorer!",
          ][Math.floor(Math.random() * 5)],
          "wave"
        )
      }
      aria-label="Ask Captain Zaheen"
    >
      🧑‍🚀
    </motion.button>
  );
}

// The actual module content. Use this INSIDE your own <Routes>/<Router>
// if your host app already has react-router-dom set up (recommended).
export function DiscoverPakistanApp({ hideNavbar = false }: { hideNavbar?: boolean }) {
  const checkStreak = useGameStore((s) => s.checkStreak);

  useEffect(() => {
    checkStreak();
    // Warm up speech voices
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, [checkStreak]);

  return (
    <div className="min-h-screen font-[Nunito,system-ui,sans-serif]">
      <ScrollToTop />
      {!hideNavbar && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      <FloatingCompanion />
      <CelebrationModal />
    </div>
  );
}

// Standalone version (wraps its own BrowserRouter).
// ONLY use this default export if your host project does NOT already
// use react-router-dom / does not already have a <BrowserRouter> somewhere
// above where you render this. Otherwise you'll get a "You cannot render
// a <Router> inside another <Router>" error — in that case, import
// { DiscoverPakistanApp } instead and mount it under your own <Routes>.
export default function DiscoverPakistan() {
  return (
    <BrowserRouter>
      <DiscoverPakistanApp />
    </BrowserRouter>
  );
}