import React, { useState } from "react";
import { X } from "lucide-react";
import { t } from "@/i18n";

import { handleSubscribe } from "@/services/subscriptionService";
import { useAuth } from "@/context/AuthContext";

const MobileMarketingBanner = () => {

const { msisdn, login, isLoggedIn } = useAuth();

  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-lime-500 text-white px-4 py-2 flex items-center justify-between text-sm">

      <span className="font-medium">
        {t("mob.heading1")}
      </span>

      <div className="flex items-center gap-3">

    {!isLoggedIn && (

          <button
            onClick={() => handleSubscribe(msisdn, login)}
            className="bg-primary text-white px-4 py-1.5 rounded-full"
          >
            {t("auth.subscribe")}
          </button>

        )}

        <button onClick={() => setVisible(false)}>
          <X size={16}/>
        </button>

      </div>

    </div>
  );
};

export default MobileMarketingBanner;