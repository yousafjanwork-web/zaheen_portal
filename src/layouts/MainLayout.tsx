import { useState, useEffect } from "react";
import Header from "../modules/shared/components/Header/Header";
import MobileHeader from "@/modules/shared/components/MobileHeader";
import Footer from "../modules/shared/components/Footer/Footer";
// import MobileMarketingBanner from "@/modules/home/sections/MobileMarketingBanner";
import { Outlet, useLocation } from "react-router-dom";

const MINI_APP_PREFIXES = ["/mdcat", "/cosmokid", "/vocab", "/origami", "/pakistan"];

const MainLayout = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const isMzaPage = location.pathname === "/mza";

  const toggleTheme = () => setIsDark(prev => !prev);

  // ── Reset title to "Zaheen | Home" when navigating back from any mini-app ──
  useEffect(() => {
    const isMiniApp = MINI_APP_PREFIXES.some(prefix =>
      location.pathname.startsWith(prefix)
    );
    if (!isMiniApp) {
      document.title = "Zaheen | Home";
    }
  }, [location.pathname]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block relative z-50">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {/* Mobile Header — hidden on MZA page to avoid duplicate */}
      {!isMzaPage && (
        <div className="lg:hidden relative z-[99] dark:bg-black dark:text-white">

          {/* <MobileMarketingBanner /> */}
          
          <MobileHeader />
        </div>
      )}

      <main className="relative z-10">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;