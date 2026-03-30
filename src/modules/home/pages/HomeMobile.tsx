import MobileMarketingBanner from "@/modules/home/sections/MobileMarketingBanner";
import MobileHeader from "@/modules/shared/components/MobileHeader";
import PromoSlider from "@/modules/home/sections/PromoSlider";


import HeroMobile from "@/modules/home/sections/HeroMobile";
import BrowseByGrade from "@/modules/home/sections/BrowseByGrade";
import ProfessionalCourses from "@/modules/home/sections/ProfessionalCourses";
import Pricing from "@/modules/home/sections/Pricing";
import CTASection from "@/modules/home/sections/CTASection";

const HomeMobile = () => {
  return (
    <>
      {/* <MobileMarketingBanner /> */}

      {/* <MobileHeader /> */}

      <HeroMobile />
      <PromoSlider />
      <BrowseByGrade />

      <ProfessionalCourses />

      <Pricing />

      <CTASection />
    </>
  );
};

export default HomeMobile;