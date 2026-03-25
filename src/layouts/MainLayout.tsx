import { useState } from "react";
import Header from "../modules/shared/components/Header/Header";
import Footer from "../modules/shared/components/Footer/Footer";

const MainLayout = ({ children }: any) => {

  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;