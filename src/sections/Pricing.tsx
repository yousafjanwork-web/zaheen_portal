import React from "react";
import { CheckCircle2, Users, ShieldCheck, RefreshCw } from "lucide-react";
import logo from "@/assets/images/ZaheenLogo.png";

const Pricing = () => {
  return (
    <section className="py-24 bg-slate-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">

          <h2 className="text-4xl font-bold mb-4 text-slate-900">
            Simple, Transparent Pricing
          </h2>

          <p className="arabic-text text-xl text-secondary mb-4">
            ایک سبسکرپشن، لامحدود مواقع
          </p>

          <p className="text-slate-600">
            One single subscription unlocks everything. No individual course
            fees, no hidden costs. Just pure learning for the whole family.
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
                  All-Access Pass
                </h3>

              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">

                {[
                  "Full access to all K-12 curriculum (Grades KG-12)",
                  "Unlimited entry to Professional Course libraries",
                  "Interactive games and foundation materials",
                  "Progress tracking and certifications",
                  "24/7 Priority Support"
                ].map((feature, i) => (

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
                  / Day
                </span>

              </div>

              {/* Button */}
              <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-md hover:shadow-xl transition">
                Subscribe Now
              </button>

            </div>

          </div>

          {/* Right Info Section */}
          <div className="space-y-10">

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-primary">
                <Users size={28} />
              </div>

              <div>
                <h4 className="text-xl font-bold mb-1 text-slate-900">
                  Perfect for Families
                </h4>

                <p className="text-slate-600">
                  A single subscription that grows with your children,
                  from their first school day to their professional career.
                </p>
              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                <ShieldCheck size={28} />
              </div>

              <div>
                <h4 className="text-xl font-bold mb-1 text-slate-900">
                  No Commitment
                </h4>

                <p className="text-slate-600">
                  Cancel or pause anytime with no hidden fees or penalties.
                </p>
              </div>

            </div>

            <div className="flex gap-5">

              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500">
                <RefreshCw size={28} />
              </div>

              <div>
                <h4 className="text-xl font-bold mb-1 text-slate-900">
                  Always Updated
                </h4>

                <p className="text-slate-600">
                  New professional courses and updated K-12 content regularly
                  at no additional cost.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Pricing;