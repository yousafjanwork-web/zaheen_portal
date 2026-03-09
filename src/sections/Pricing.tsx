import React from 'react';
import { CheckCircle2, Users, ShieldCheck, RefreshCw } from 'lucide-react';

export const Pricing = () => {
  return (
    <section className="py-24 bg-white dark:bg-background-dark" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
          <p className="arabic-text text-xl text-secondary mb-4">ایک سبسکرپشن، لامحدود مواقع</p>
          <p className="text-slate-600 dark:text-slate-400">
            One single subscription unlocks everything. No individual course fees, no hidden costs. Just pure learning for the whole family.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 md:p-12 rounded-[3rem] border-2 border-primary/20 dark:border-primary/10">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                  <img 
                    src="../../images/ZaheenLogo.png" 
                    alt="Zaheen Logo" 
                    className="h-8 w-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-2xl font-bold text-primary">All-Access Pass</span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {[
                  "Full access to all K-12 curriculum (Grades KG-12)",
                  "Unlimited entry to all Professional Course libraries",
                  "Interactive games and foundation materials",
                  "Progress tracking and certifications",
                  "24/7 Priority Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-slate-700 dark:text-slate-200">
                    <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline space-x-2 mb-8">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">Rs 5</span>
                <span className="text-slate-500">/Day</span>
              </div>
              
              <button className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform">
                Subscribe Now
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-1 gap-12">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                  <Users size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Perfect for Families</h4>
                  <p className="text-slate-600 dark:text-slate-400">A single subscription that grows with your children, from their first day of school to their professional career.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-secondary">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">No Commitment</h4>
                  <p className="text-slate-600 dark:text-slate-400">Cancel or pause your subscription at any time with no hidden fees or cancellation charges.</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                  <RefreshCw size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2 dark:text-white">Always Updated</h4>
                  <p className="text-slate-600 dark:text-slate-400">We regularly add new professional courses and update K-12 materials at no extra cost to you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Pricing;