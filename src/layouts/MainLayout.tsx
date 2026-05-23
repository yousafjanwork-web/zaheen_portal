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
      <div className="hidden lg:block">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      <div className="lg:hidden dark:bg-black dark:text-white">
        <MobileMarketingBanner />
        <MobileHeader />
      </div>

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default MainLayout;