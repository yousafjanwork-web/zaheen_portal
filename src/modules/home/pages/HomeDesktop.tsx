import HeroSlider from "../sections/HeroSlider";
import BrowseByGrade from "../sections/BrowseByGrade";
import ProfessionalCourses from "../sections/ProfessionalCourses";
import Pricing from "../sections/Pricing";
// import MDCATDesktopBanner from "../sections/MDCATDesktopBanner";
import PrepExamSlider from "../sections/PrepExamSlider";
import ZaheenAppDesktop from "../sections/ZaheenAppDesktop"
import SummerBreak from "../sections/SummerbreakSlider"

const HomeDesktop = () => {
  return (
    <>
      <HeroSlider />
      <BrowseByGrade />
      <SummerBreak/>
      <ProfessionalCourses />
      {/* <MDCATDesktopBanner/> */}
      <PrepExamSlider />
      <ZaheenAppDesktop />
      <Pricing />

    </>
  );
};

export default HomeDesktop;