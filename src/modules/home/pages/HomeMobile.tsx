import MobileMarketingBanner from "@/modules/home/sections/MobileMarketingBanner";
import MobileHeader from "@/modules/shared/components/MobileHeader";
import PromoSlider from "@/modules/home/sections/PromoSlider";


import HeroMobile from "@/modules/home/sections/HeroMobile";
import BrowseByGrade from "@/modules/home/sections/BrowseByGrade";
import ProfessionalCourses from "@/modules/home/sections/ProfessionalCourses";
import Pricing from "@/modules/home/sections/Pricing";
import CTASection from "@/modules/home/sections/CTASection";
import MDCATBanner from "../sections/MDCATMobileBanner";
import SummerCampBanner from "../sections/SummerCampMobile";
import OrigamiCampMobile from "../sections/OrigamiMobile";

const HomeMobile = () => {
  return (
    <>
      {/* <MobileMarketingBanner /> */}

      {/* <MobileHeader /> */}

      <HeroMobile />
      <PromoSlider />
      <BrowseByGrade />
      <SummerCampBanner/>
      {/* <OrigamiCampMobile/> */}
      <ProfessionalCourses />
      <MDCATBanner/>
      <Pricing />

      <CTASection />
    </>
  );
};

export default HomeMobile;