import React from "react";
import { CheckCircle2, Users, ShieldCheck, RefreshCw } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";
import { t } from "@/i18n";

import SubscribeModal from "@/components/SubscribeModal";
import { useSubscribe } from "@/hooks/useSubscribe";
import { useAuth } from "@/context/AuthContext";

const Pricing = () => {

  const { handleSubscribe, showModal, setShowModal } = useSubscribe();
const { isLoggedIn } = useAuth();
  const features = [
    t("pricing.feature1"),
    t("pricing.feature2"),
    t("pricing.feature3"),
    t("pricing.feature4"),
    t("pricing.feature5")
  ];

  return (
    <>
      <section className="py-24 bg-slate-50" id="pricing">

        <div className="max-w-7xl mx-auto px-4">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">

            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              {t("pricing.title")}
            </h2>

            <p className="text-xl text-secondary mb-4">
              {t("pricing.subtitle")}
            </p>

            <p className="text-slate-600">
              {t("pricing.description")}
            </p>

          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Pricing Card */}
            <div>

              <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10">

                {/* Logo + Title */}
                <div className="flex items-center gap-4 mb-10">

                  <img
                    src={logo}
                    alt="Zaheen Logo"
                    className="h-10"
                  />

                  <h3 className="text-2xl font-bold text-primary">
                    {t("pricing.plan")}
                  </h3>

                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10">

                  {features.map((feature, i) => (

                    <li key={i} className="flex items-center text-slate-700">

                      <CheckCircle2
                        size={20}
                        className="text-secondary mr-3 flex-shrink-0"
                      />

                      {feature}

                    </li>

                  ))}

                </ul>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-8">

                  <span className="text-5xl font-extrabold text-slate-900">
                    Rs 5
                  </span>

                  <span className="text-slate-500">
                    {t("pricing.perDay")}
                  </span>

                </div>

                {/* Subscribe Button */}
                 {!isLoggedIn && (
                <button
                 onClick={() =>
  window.location.href =
    "http://he.zaheen.com.pk/gethe?redirect=https://z.zaheen.com.pk/subscribe"
}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-md hover:shadow-xl transition"
                >
                  {t("pricing.subscribe")}
                </button>
                 )}

              </div>

            </div>

            {/* Right Info Section */}
            <div className="space-y-10">

              {/* Item 1 */}
              <div className="flex gap-5">

                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-primary">
                  <Users size={28} />
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-1 text-slate-900">
                    {t("pricing.familyTitle")}
                  </h4>

                  <p className="text-slate-600">
                    {t("pricing.familyDesc")}
                  </p>
                </div>

              </div>

              {/* Item 2 */}
              <div className="flex gap-5">

                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-1 text-slate-900">
                    {t("pricing.commitmentTitle")}
                  </h4>

                  <p className="text-slate-600">
                    {t("pricing.commitmentDesc")}
                  </p>
                </div>

              </div>

              {/* Item 3 */}
              <div className="flex gap-5">

                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500">
                  <RefreshCw size={28} />
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-1 text-slate-900">
                    {t("pricing.updateTitle")}
                  </h4>

                  <p className="text-slate-600">
                    {t("pricing.updateDesc")}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {showModal && (
        <SubscribeModal onClose={() => setShowModal(false)} />
      )}

    </>
  );
};

export default Pricing;