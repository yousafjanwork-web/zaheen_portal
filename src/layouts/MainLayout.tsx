import { useState } from "react";
import Header from "../modules/shared/components/Header/Header";
import MobileHeader from "@/modules/shared/components/MobileHeader";
import Footer from "../modules/shared/components/Footer/Footer";
import MobileMarketingBanner from "@/modules/home/sections/MobileMarketingBanner";

const MainLayout = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block">
        <Header isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <MobileMarketingBanner/>
        <MobileHeader />
      </div>

      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;