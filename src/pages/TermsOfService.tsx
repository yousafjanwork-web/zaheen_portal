import React from "react";
import { t } from "@/modules/shared/i18n";

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          {t("terms.title")}
        </h1>

        <p className="mb-6 text-slate-600">
          {t("terms.intro")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.useWebsite")}
        </h2>

        <p className="mb-4 text-slate-600">
          {t("terms.ageRequirement")}
        </p>

        <p className="mb-6 text-slate-600">
          {t("terms.lawfulUse")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.userAccounts")}
        </h2>

        <p className="mb-4 text-slate-600">
          {t("terms.accountInfo")}
        </p>

        <p className="mb-6 text-slate-600">
          {t("terms.accountSecurity")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.intellectualProperty")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("terms.ipText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.liability")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("terms.liabilityText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.changes")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("terms.changesText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.law")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("terms.lawText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("terms.contact")}
        </h2>

        <p className="text-slate-600">
          {t("terms.contactText")}
        </p>

        <p className="mt-2 font-semibold">
          info@zaheen.com.pk
        </p>

      </div>

    </div>
  );
};

export default TermsOfService;