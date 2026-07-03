import React from "react";
import { t } from "@/modules/shared/i18n";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          {t("terms.title")}
        </h1>

        <p className="mb-10 text-slate-600">
          {t("terms.intro")}
        </p>

        {/* 1. About Zaheen */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.aboutTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.aboutText")}
        </p>

        {/* 2. Eligibility */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.eligibilityTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.eligibilityText")}
        </p>

        {/* 3. Zong Subscribers Only */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.zongTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.zongText")}
        </p>

        {/* 4. Free Trial & Subscription Plans */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.trialTitle")}
        </h2>
        <p className="mb-4 text-slate-600">
          {t("terms.trialText")}
        </p>
        <p className="mb-2 font-medium text-slate-700">
          {t("terms.plansLabel")}
        </p>
        <ul className="mb-6 list-disc list-inside text-slate-600 space-y-1">
          <li>{t("terms.plansDaily")}</li>
          <li>{t("terms.plansWeekly")}</li>
          <li>{t("terms.plansMonthly")}</li>
        </ul>

        {/* 5. Auto-Renewal & Billing */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.billingTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.billingText")}
        </p>

        {/* 6. Cancellation */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.cancellationTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.cancellationText")}
        </p>

        {/* 7. User Accounts */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.accountsTitle")}
        </h2>
        <p className="mb-4 text-slate-600">
          {t("terms.accountInfo")}
        </p>
        <p className="mb-6 text-slate-600">
          {t("terms.accountSecurity")}
        </p>

        {/* 8. Acceptable Use */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.acceptableUseTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.acceptableUseText")}
        </p>

        {/* 9. Intellectual Property */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.ipTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.ipText")}
        </p>

        {/* 10. Educational Content */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.contentTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.contentText")}
        </p>

        {/* 11. Privacy */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.privacyNoticeTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.privacyNoticeText")}
        </p>

        {/* 12. Service Availability */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.availabilityTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.availabilityText")}
        </p>

        {/* 13. Limitation of Liability */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.liabilityTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.liabilityText")}
        </p>

        {/* 14. Termination */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.terminationTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.terminationText")}
        </p>

        {/* 15. Governing Law */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.lawTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("terms.lawText")}
        </p>

        {/* 16. Contact */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.contactTitle")}
        </h2>
        <p className="text-slate-600">
          {t("terms.contactEmail")}
        </p>
        <p className="mb-6 text-slate-600">
          {t("terms.contactPhone")}
        </p>

        {/* 17. Acceptance */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.acceptanceTitle")}
        </h2>
        <p className="text-slate-600">
          {t("terms.acceptanceText")}
        </p>

      </div>
    </div>
  );
};

export default TermsOfService;