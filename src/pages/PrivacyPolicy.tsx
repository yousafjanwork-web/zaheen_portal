import React from "react";
import { t } from "@/i18n";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          {t("privacy.title")}
        </h1>

        <p className="mb-6 text-slate-600">
          {t("privacy.intro")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.infoCollect")}
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.personalInfo")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.personalInfoText")}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.usageInfo")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.usageInfoText")}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.cookies")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.cookiesText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.useInfo")}
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.provideServices")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.provideServicesText")}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.communication")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.communicationText")}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.improveSite")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.improveSiteText")}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">
          {t("privacy.marketing")}
        </h3>

        <p className="mb-6 text-slate-600">
          {t("privacy.marketingText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.sharing")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("privacy.sharingText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.security")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("privacy.securityText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.thirdParty")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("privacy.thirdPartyText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.changes")}
        </h2>

        <p className="mb-6 text-slate-600">
          {t("privacy.changesText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.contact")}
        </h2>

        <p className="text-slate-600">
          {t("privacy.contactText")}
        </p>

        <p className="mt-2 font-semibold">
          info@zaheen.com.pk
        </p>

      </div>

    </div>
  );
};

export default PrivacyPolicy;