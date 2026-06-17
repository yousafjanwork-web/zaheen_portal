import HeroSlider from "../sections/HeroSlider";
import BrowseByGrade from "../sections/BrowseByGrade";
import ProfessionalCourses from "../sections/ProfessionalCourses";
import Pricing from "../sections/Pricing";
import CTASection from "../sections/CTASection";
import MDCATDesktopBanner from "../sections/MDCATDesktopBanner";


const HomeDesktop = () => {
  return (
    <>
      <HeroSlider />
      <BrowseByGrade />
      <ProfessionalCourses />
      <MDCATDesktopBanner/>

      <Pricing />
      <CTASection />

    </>
  );
};

export default HomeDesktop;