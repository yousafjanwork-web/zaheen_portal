import MobileMarketingBanner from "@/modules/home/sections/MobileMarketingBanner";
import MobileHeader from "@/modules/shared/components/MobileHeader";
import PromoSlider from "@/modules/home/sections/PromoSlider";
import HeroMobile from "@/modules/home/sections/HeroMobile";
import BrowseByGrade from "@/modules/home/sections/BrowseByGrade";
import ProfessionalCourses from "@/modules/home/sections/ProfessionalCourses";
import Pricing from "@/modules/home/sections/Pricing";
import CTASection from "@/modules/home/sections/CTASection";
import MDCATBanner from "../sections/MDCATMobileBanner";
import ZaheenAppMobile from "../sections/ZaheenAppMobile";
import SummerBreak from "../sections/SummerbreakSlider";
import { useLocation } from "react-router-dom";

const HomeMobile = () => {

  const location = useLocation();
  const isMzaPage = location.pathname === "/mza";
  const mzaActive = sessionStorage.getItem("mzaStatus") === "ACTIVE";

  return (
    <>
      {/* Only render header/banner on MZA page */}
      {isMzaPage && (
        <div className="lg:hidden relative z-[99] dark:bg-black dark:text-white">
          {!mzaActive && <MobileMarketingBanner />}
          <MobileHeader />
        </div>
      )}

      <HeroMobile />
      <PromoSlider />
      <BrowseByGrade />
      <SummerBreak />
      <ProfessionalCourses />
      <MDCATBanner />
      <ZaheenAppMobile />

      {/* ✅ Always show — sir didn't say to hide these */}
      <Pricing />
      <CTASection />
    </>
  );

};

export default HomeMobile;