import HeroSlider from "../../sections/HeroSlider";
import BrowseByGrade from "../../sections/BrowseByGrade";
import ProfessionalCourses from "../../sections/ProfessionalCourses";
import Pricing from "../../sections/Pricing";
import CTASection from "../../sections/CTASection";

const HomeDesktop = () => {
  return (
    <>
      <HeroSlider />
      <BrowseByGrade />
      <ProfessionalCourses />
      <Pricing />
      <CTASection />
    </>
  );
};

export default HomeDesktop;