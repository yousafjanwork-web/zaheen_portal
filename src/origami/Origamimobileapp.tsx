import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import FloatingElements from './components/FloatingElements';
import HomePage from './pages/HomePage';
import CraftDetailPage from './pages/CraftDetailPage';
import VideoLibraryPage from './pages/VideoLibraryPage';
import CategoryPage from './pages/CategoryPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import './origami.css';

/**
 * Resets scroll position to the top every time the route changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

/**
 * OrigamiMobileApp — drop this inside a <Route path="/origami-mobile/*"> in Zaheen's router.
 * Identical to OrigamiApp, but renders with no Navbar and no Footer.
 * No API, no auth needed — fully static data from data/crafts.ts
 */
export default function OrigamiMobileApp() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Cleanup when module unmounts
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]);

  return (
    <div className={`origami-module min-h-screen overflow-x-hidden isolate transition-colors duration-300 ${darkMode ? 'bg-[#0f0f23] text-gray-100' : 'bg-[#F9FAFB] text-gray-900'}`}>
      <FloatingElements />
      {/* No Navbar, no Footer — mobile view is chrome-free */}
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route path="craft/:slug" element={<CraftDetailPage darkMode={darkMode} />} />
          <Route path="library" element={<VideoLibraryPage darkMode={darkMode} />} />
          <Route path="category/:id" element={<CategoryPage darkMode={darkMode} />} />
          <Route path="profile" element={<ProfilePage darkMode={darkMode} />} />
          <Route path="search" element={<SearchPage darkMode={darkMode} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}