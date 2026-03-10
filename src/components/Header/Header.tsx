import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun
} from "lucide-react";

import { Link } from "react-router-dom";

import logo from "@/assets/images/ZaheenLogo.png";

import CoursesMenu from "@/components/Header/CoursesMenu";
import LearningMenu from "@/components/Header/LearningMenu";
import MobileMenu from "@/components/Header/MobileMenu";

import SubscribeModal from "@/components/SubscribeModal";
import LoginModal from "@/components/LoginModal";

import { useSubscribe } from "@/hooks/useSubscribe";
import { useAuth } from "@/context/AuthContext";
import { useLogin } from "@/hooks/useLogin";

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const boards = [
  "Federal Board",
  "Punjab Board",
  "Sindh Board",
  "KPK Board",
  "Balochistan Board"
];

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {

  const { msisdn, logout } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const { handleLogin } = useLogin(() => setShowLoginModal(true));

  const { handleSubscribe, showModal, setShowModal } = useSubscribe();

  const [menuOpen, setMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);

  const [boardOpen, setBoardOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState("Federal Board");

  const [language, setLanguage] = useState("EN");
  const [languageOpen, setLanguageOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Scroll effect */

  useEffect(() => {

    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  /* Close dropdowns when clicking outside */

  useEffect(() => {

    const handleClickOutside = (e: any) => {

      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {

        setBoardOpen(false);
        setCoursesOpen(false);
        setLearningOpen(false);
        setLanguageOpen(false);
        

      }

    };

   
    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

 const closeMenus = () => {
      setCoursesOpen(false)
      setLearningOpen(false)
    }
  return (
    <>
      <header
        className={`sticky top-0 z-50 transition ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-slate-200"
            : "bg-white"
        }`}
      >
        <div
          ref={dropdownRef}
          className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16"
        >

{/* LEFT */}

<div className="flex items-center gap-6">

{/* LOGO */}

<Link to="/" onClick={closeMenus}>
<img src={logo} alt="Zaheen" className="h-10 cursor-pointer"/>
</Link>

{/* BOARD SELECTOR */}

<div className="relative hidden lg:block">

<button
onClick={() => setBoardOpen(!boardOpen)}
className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium"
>
{selectedBoard}
<ChevronDown size={16}/>
</button>

{boardOpen && (

<div className="absolute top-12 left-0 w-56 bg-white shadow-lg rounded-xl border p-2">

{boards.map((b) => (
<button
key={b}
onClick={()=>{
setSelectedBoard(b)
setBoardOpen(false)
}}
className="block w-full text-left px-3 py-2 rounded-md hover:bg-slate-100"
>
{b}
</button>
))}

</div>

)}

</div>

{/* NAVIGATION */}

<nav className="hidden lg:flex items-center gap-6 text-sm font-medium">

<Link to="/" onClick={closeMenus} className="hover:text-primary">
Home
</Link>

{/* COURSES MENU */}

<div className="relative">

<button
onClick={()=>{
setCoursesOpen(!coursesOpen)
setLearningOpen(false)
}}
className="flex items-center gap-1 hover:text-primary"
>
Courses
<ChevronDown size={16}/>
</button>

<CoursesMenu
  open={coursesOpen}
  onClose={() => setCoursesOpen(false)}
/>

</div>

{/* LEARNING HUB */}

<div className="relative">

<button
onClick={()=>{
setLearningOpen(!learningOpen)
setCoursesOpen(false)
}}
className="flex items-center gap-1 hover:text-primary"
>
Learning Hub
<ChevronDown size={16}/>
</button>

<LearningMenu
  open={learningOpen}
  onClose={() => setLearningOpen(false)}
/>

</div>

<Link to="/ai" onClick={closeMenus} className="hover:text-primary">
AI Tutor
</Link>

</nav>

</div>

{/* RIGHT SIDE */}

<div className="flex items-center gap-4">

{/* LANGUAGE */}

<div className="relative">

<button
onClick={()=>setLanguageOpen(!languageOpen)}
className="flex items-center gap-1 border px-3 py-1.5 rounded-lg text-sm"
>
{language}
<ChevronDown size={16}/>
</button>

{languageOpen && (

<div className="absolute right-0 top-10 w-32 bg-white shadow-lg border rounded-xl py-2">

<button
onClick={()=>{setLanguage("EN");setLanguageOpen(false)}}
className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
>
EN – English
</button>

<button
onClick={()=>{setLanguage("UR");setLanguageOpen(false)}}
className="block w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
>
UR – Urdu
</button>

</div>

)}

</div>

{/* THEME */}

<button
onClick={toggleTheme}
className="p-2 rounded-full bg-slate-100"
>
{isDark ? <Sun size={18}/> : <Moon size={18}/>}
</button>

{/* AUTH STATE */}

{msisdn ? (

<>

<span className="text-sm font-medium">
{msisdn}
</span>

<button
onClick={logout}
className="border px-4 py-2 rounded-full"
>
Logout
</button>

</>

) : (

<>

<button
onClick={handleLogin}
className="border border-primary text-primary px-5 py-2 rounded-full"
>
Login
</button>

<button
onClick={handleSubscribe}
className="bg-primary text-white px-5 py-2 rounded-full"
>
Subscribe
</button>

</>

)}

{/* MOBILE TOGGLE */}

<button
className="lg:hidden"
onClick={()=>setMenuOpen(!menuOpen)}
>
{menuOpen ? <X size={22}/> : <Menu size={22}/>}
</button>

</div>

</div>

{/* MOBILE MENU */}

<MobileMenu open={menuOpen}/>

</header>

{/* MODALS */}

{showModal && (
<SubscribeModal onClose={()=>setShowModal(false)}/>
)}

{showLoginModal && (
<LoginModal onClose={()=>setShowLoginModal(false)}/>
)}

</>
);

};

export default Header;