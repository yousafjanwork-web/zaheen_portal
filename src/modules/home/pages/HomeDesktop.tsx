import HeroSlider from "../sections/HeroSlider";
import BrowseByGrade from "../sections/BrowseByGrade";
import ProfessionalCourses from "../sections/ProfessionalCourses";
import Pricing from "../sections/Pricing";
import CTASection from "../sections/CTASection";
import MDCATDesktopBanner from "../sections/MDCATDesktopBanner";
import ZaheenAppDesktop from "../sections/ZaheenAppDesktop"
import SummerBreak from "../sections/SummerbreakSlider"

const HomeDesktop = () => {
  return (
    <>
      <HeroSlider />
      <BrowseByGrade />
      <SummerBreak/>
      <ProfessionalCourses />
      <MDCATDesktopBanner/>
      <ZaheenAppDesktop />
      <Pricing />
      <CTASection />

    </>
  );
};

export default HomeDesktop;