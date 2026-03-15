import MobileMarketingBanner from "@/components/MobileMarketingBanner";
import MobileHeader from "@/components/MobileHeader";
import PromoSlider from "@/sections/PromoSlider";


import HeroMobile from "@/sections/HeroMobile";
import BrowseByGrade from "@/sections/BrowseByGrade";
import ProfessionalCourses from "@/sections/ProfessionalCourses";
import Pricing from "@/sections/Pricing";
import CTASection from "@/sections/CTASection";

const HomeMobile = () => {
  return (
    <>
      <MobileMarketingBanner />

      <MobileHeader />

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