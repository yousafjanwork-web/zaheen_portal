import HeroSlider from "../sections/HeroSlider";
import BrowseByGrade from "../sections/BrowseByGrade";
import ProfessionalCourses from "../sections/ProfessionalCourses";
import Pricing from "../sections/Pricing";
import CTASection from "../sections/CTASection";
import MDCATDesktopBanner from "../sections/MDCATDesktopBanner";
// import SummerCampBanner from "../sections/SummerCampDesktop";
// import OrigamiCampBanner from "../sections/OrigamiDesktop";
import SummerBreak from "../sections/SummerbreakSlider"

const HomeDesktop = () => {
  return (
    <>
      <HeroSlider />
      <BrowseByGrade />
      <SummerBreak/>
        {/* <SummerCampBanner/> */}
          {/* <OrigamiCampBanner/> */}
      <ProfessionalCourses />
      <MDCATDesktopBanner/>
      

      <Pricing />
      <CTASection />

    </>
  );
};

export default HomeDesktop;