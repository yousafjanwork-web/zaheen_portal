import { useState, useEffect } from "react";
import Header from "../modules/shared/components/Header/Header";
import MobileHeader from "@/modules/shared/components/MobileHeader";
import Footer from "../modules/shared/components/Footer/Footer";
import MobileMarketingBanner from "@/modules/home/sections/MobileMarketingBanner";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

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
      {/* Desktop Header Container */}
      <div className="hidden lg:block relative z-50">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {/* FIXED: Mobile Header Wrapper Container */}
      {/* Yahan relative aur z-[99] lagaya hai taake language switcher dropdown har kism ke custom cards aur mobile animation se hamesha upar render ho */}
      <div className="lg:hidden relative z-[99] dark:bg-black dark:text-white">
        <MobileMarketingBanner />
        <MobileHeader />
      </div>

      <main className="relative z-10">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;