import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";

const MobileHeader = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b px-4 py-3 lg:hidden">

      <div className="flex items-center justify-between">

        {/* LEFT MENU */}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24}/> : <Menu size={24}/>}
        </button>

        {/* CENTER LOGO */}
        <img
          src={logo}
          alt="Zaheen"
          className="h-8"
        />

        {/* LANGUAGE */}
        <select className="border rounded-lg px-2 py-1 text-sm">
          <option>EN</option>
          <option>UR</option>
        </select>

      </div>

      {menuOpen && (
        <div className="mt-4 space-y-3 text-sm">

          <a href="/" className="block">Home</a>
          <a href="/courses" className="block">Courses</a>
          <a href="/practice" className="block">Practice Corner</a>
          <a href="/results" className="block">Board Results</a>
          <a href="/ai" className="block">AI Tutor</a>

        </div>
      )}

    </header>
  );
};

export default MobileHeader;