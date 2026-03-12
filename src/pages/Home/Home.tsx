import HomeMobile from "./HomeMobile";
import HomeDesktop from "./HomeDesktop";

const Home = () => {
  return (
    <>
      <div className="lg:hidden">
        <HomeMobile />
      </div>

      <div className="hidden lg:block">
        <HomeDesktop />
      </div>
    </>
  );
};

export default Home;