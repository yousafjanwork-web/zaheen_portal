import React from "react";
import { t } from "@/modules/shared/i18n";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-20 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-slate-900">
          {t("privacy.title")}
        </h1>

        <p className="mb-10 text-slate-600">
          {t("privacy.intro")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.collectTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.collectText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.useTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.useText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.zongTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.zongText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.cookiesTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.cookiesText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.sharingTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.sharingText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.securityTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.securityText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.retentionTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.retentionText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.rightsTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.rightsText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.childrenTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.childrenText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.thirdPartyTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.thirdPartyText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.updatesTitle")}
        </h2>
        <p className="mb-6 text-slate-600">
          {t("privacy.updatesText")}
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4">
          {t("privacy.contactTitle")}
        </h2>
        <p className="text-slate-600">
          {t("privacy.contactEmail")}
        </p>
        <p className="text-slate-600">
          {t("privacy.contactPhone")}
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;