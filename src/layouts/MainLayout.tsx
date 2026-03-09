import { useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

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