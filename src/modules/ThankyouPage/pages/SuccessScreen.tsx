import BackgroundEffects from "../components/BackgroundEffects";
import HeroSection from "../components/HeroSection";
import ActionButtons from "../components/ActionButtons";
import NextSteps from "../components/NextSteps";
import SupportInfo from "../components/SupportInfo";

export default function SuccessScreen() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 md:py-24">

      <BackgroundEffects />

      <div className="relative z-10 max-w-4xl w-full text-center">
        <HeroSection />
        <ActionButtons />
        <NextSteps />
      </div>

      <SupportInfo />

    </main>
  );
}