import '@/styles/landingpage.css';

import SubscriptionImage from "../components/SubscriptionImage";
import SubscriptionForm from "../components/SubscriptionForm";
import TermsSection from "@/modules/shared/components/TermsSection";
import AlertModal from "../components/AlertModal";

import { useSubscription } from "../hooks/useSubscription";

export default function SubEnrollNow() {

  const subscription = useSubscription();

  return (
    <main className="min-h-screen flex flex-col justify-center px-4 py-12 md:py-20">

      {/* ALERT */}
      <AlertModal alert={subscription.alert} />

      <div className="w-full max-w-6xl mx-auto gap-10">

        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row gap-10">

          <SubscriptionImage />

          <SubscriptionForm {...subscription} />

        </div>

        {/* TERMS BELOW */}
        <TermsSection />

      </div>

    </main>
  );
}