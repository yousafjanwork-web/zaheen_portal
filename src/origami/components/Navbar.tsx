import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrigamiBase } from '../hooks/useOrigamiBase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sun, Moon, User, Home, Grid3X3, Play, BarChart3, LogOut, ChevronDown } from 'lucide-react';
import { useAuth as useZaheenAuth } from '@/modules/shared/context/AuthContext';
import { useUserDisplayName } from '@/modules/shared/hooks/useUserDisplayName';
const logo = "https://cdn.zaheen.com.pk/zaheen-web-img/zaheen-origami-logo1-1.png";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const Navbar = ({ darkMode, setDarkMode }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const base = useOrigamiBase();

  // Phone number the user actually logged in with, straight from the
  // shared auth context — no separate "name" field exists, so this is
  // the identity we show in the navbar per sir's instruction.
  const { msisdn, isLoggedIn, logout } = useZaheenAuth();
  const displayName = useUserDisplayName();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout();
    navigate(`${base}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
     navigate(`${base}/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

 const navLinks = [
    { to: base, label: 'Home', icon: <Home size={18} /> },
    { to: `${base}/library`, label: 'Videos', icon: <Play size={18} /> },
    { to: `${base}/category/animals`, label: 'Categories', icon: <Grid3X3 size={18} /> },
    { to: `${base}/profile`, label: 'My Profile', icon: <User size={18} /> },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${darkMode ? 'bg-[#0f0f23]/90' : 'bg-white/90'} backdrop-blur-xl border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
           <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
  <motion.img
    whileHover={{ rotate: 15, scale: 1.05 }}
    src={logo}
    alt="Zaheen Origami Logo"
    className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
  />
              <div className="flex flex-col">
                <span className="font-fredoka font-bold text-lg sm:text-xl gradient-text leading-tight">
                  Zaheen Origami
                </span>
                <span className={`text-[10px] sm:text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} font-nunito leading-tight hidden sm:block`}>
                  Learn • Fold • Create
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-nunito font-semibold transition-all duration-200 ${
                    darkMode
                      ? 'hover:bg-white/10 text-gray-300 hover:text-white'
                      : 'hover:bg-primary/5 text-gray-600 hover:text-primary'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSearchOpen(true)}
                className={`p-2.5 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Search size={20} />
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>

              {/* Profile */}
              {isLoggedIn ? (
                <div className="relative hidden sm:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-pink px-4 py-2 rounded-xl text-white font-nunito font-bold text-sm"
                  >
                    <span>🦊</span>
                    <span>{displayName || msisdn}</span>
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200"
                      style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </motion.button>

                  {/* Desktop dropdown */}
                  {profileOpen && (
                    <div className={`absolute right-0 top-12 w-48 rounded-2xl overflow-hidden z-50 shadow-xl border ${
                      darkMode
                        ? 'bg-[#16213e] border-white/10'
                        : 'bg-white border-gray-100'
                    }`}>
                      <Link
                        to={`${base}/profile`}
                        onClick={() => setProfileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-nunito font-semibold transition-colors ${
                          darkMode
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                        }`}
                      >
                        <User size={15} className="flex-shrink-0" />
                        My Profile
                      </Link>
                      <div className={`border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`} />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-nunito font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} className="flex-shrink-0" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-pink px-4 py-2 rounded-xl text-white font-nunito font-bold text-sm"
                >
                  <User size={16} />
                  <span>Log In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden overflow-hidden border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-nunito font-semibold transition-all ${
                      darkMode
                        ? 'hover:bg-white/10 text-gray-300'
                        : 'hover:bg-primary/5 text-gray-700'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                {/* Mobile Profile */}
                {isLoggedIn ? (
                  <>
                    <Link
                      to={`${base}/profile`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 bg-gradient-to-r from-primary to-pink px-4 py-3 rounded-2xl text-white font-nunito font-bold mt-2"
                    >
                      <span className="text-xl">🦊</span>
                      <span>{displayName || msisdn}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-nunito font-semibold text-red-500 mt-1 transition-colors ${
                        darkMode ? 'hover:bg-white/10' : 'hover:bg-red-50'
                      }`}
                    >
                      <LogOut size={20} className="flex-shrink-0" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 bg-gradient-to-r from-primary to-pink px-4 py-3 rounded-2xl text-white font-nunito font-bold mt-2"
                  >
                    <User size={20} />
                    <span>Log In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden ${
                darkMode ? 'bg-[#16213e]' : 'bg-white'
              }`}
            >
              <form onSubmit={handleSearch} className="flex items-center p-4 sm:p-6">
                <Search className={`mr-3 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} size={24} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search origami crafts, categories..."
                  className={`flex-1 text-lg sm:text-xl font-nunito outline-none bg-transparent ${
                    darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className={`p-2 rounded-xl ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <X size={20} />
                </button>
              </form>
              <div className={`px-6 pb-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <p className={`text-sm font-nunito mt-4 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Paper Crane', 'Butterfly', 'Dog', 'Heart', 'Airplane', 'Flower', 'Star', 'Fish'].map((term) => (
                    <button
                      key={term}
                     onClick={() => {
                        navigate(`${base}/search?q=${encodeURIComponent(term)}`);
                        setSearchOpen(false);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-nunito font-semibold transition-all ${
                        darkMode
                          ? 'bg-white/10 hover:bg-white/20 text-gray-300'
                          : 'bg-gray-100 hover:bg-primary/10 text-gray-600 hover:text-primary'
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;