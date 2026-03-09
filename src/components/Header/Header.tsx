import React, { useState, useEffect } from "react";
import { Search, Globe, Moon, Sun, Menu, X } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        
        {/* Logo */}
        <img src={logo} alt="Zaheen Logo" className="h-10 w-auto" />

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search size={18} />
            </span>

            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-3 py-2 border rounded-full text-sm"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-4">
          <button className="hidden sm:flex items-center space-x-1 text-sm">
            <Globe size={18} />
            <span>Urdu / English</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;