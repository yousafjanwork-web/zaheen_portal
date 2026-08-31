import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import { useAuth } from "@/modules/shared/context/AuthContext";
import HomeMobile from "@/modules/home/pages/HomeMobile";
import { logMzaRequest } from "@/modules/shared/services/mzaService";

const MzaPage = () => {

  const [searchParams] = useSearchParams();
  const { login, logout } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {

    const data = searchParams.get("data");
    const signature = searchParams.get("signature");

    if (!data) {
      setChecking(false);
      return;
    }

    let msisdn = data;

    /* NORMALIZE */
    if (!msisdn.startsWith("92")) {
      msisdn = "92" + msisdn;
    }

    /* LOG REQUEST */
    logMzaRequest(msisdn, signature);
    sessionStorage.setItem("mzaMsisdn", msisdn);

    /* CHECK LOGIN STATUS */
    const checkLoginStatus = async () => {
      try {

        const res = await axios.get(
          "https://subgateway.fitsworld.com.pk/zongcharging/api/checklogin",
          { params: { msisdn } }
        );

        const { status } = res.data;

       if (status === "ACTIVE") {

  console.log("MZA ✅ User ACTIVE:", msisdn);

  sessionStorage.setItem("mzaStatus", "ACTIVE");
  sessionStorage.setItem("mzaLoggedIn", "true");
  sessionStorage.setItem("mzaMsisdn", msisdn); // ← keep
  login(msisdn);

} else {

  console.warn("MZA ❌ User INACTIVE — session cleared");

  /* ✅ Keep mzaMsisdn so Subscribe page can auto-fill the number */
  sessionStorage.setItem("mzaMsisdn", msisdn);

  /* Only clear the active/login flags */
  sessionStorage.removeItem("mzaStatus");
  sessionStorage.removeItem("mzaLoggedIn");
  localStorage.removeItem("msisdn");
  logout();

}

      } catch (error) {
        console.error("MZA checklogin failed:", error);
      } finally {
        setChecking(false);
      }
    };

    checkLoginStatus();

  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  return <HomeMobile />;

};

export default MzaPage;