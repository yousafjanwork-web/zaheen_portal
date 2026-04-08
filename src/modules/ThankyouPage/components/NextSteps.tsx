import BentoCard from "../BentoCard";
import { BookOpen, MessageSquare, LayoutDashboard } from "lucide-react";

export default function NextSteps() {
  return (
    <div className="text-left">
      <h2 className="font-headline text-2xl font-bold mb-8 text-center text-on-surface uppercase tracking-widest">What's Next?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BentoCard
          title="Access Curriculum"
          description="Dive straight into 200+ hours of premium, industry-vetted learning modules."
          icon={BookOpen}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          accentColor="#105caa"
          delay={0.5}
        />
        <BentoCard
          title="Mentor Chat"
          description="Connect with your assigned mentor to discuss your goals and roadblocks."
          icon={MessageSquare}
          iconColor="text-secondary"
          iconBg="bg-secondary/10"
          accentColor="#486800"
          delay={0.6}
        />
        <BentoCard
          title="Personalized View"
          description="Set your study pace and track real-time progress on your custom dashboard."
          icon={LayoutDashboard}
          iconColor="text-tertiary"
          iconBg="bg-tertiary/10"
          accentColor="#006766"
          delay={0.7}
        />
      </div>
    </div>
  );
}