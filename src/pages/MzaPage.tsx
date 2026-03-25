import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/modules/shared/context/AuthContext";
import HomeMobile from "@/modules/home/pages/HomeMobile";

import { logMzaRequest } from "@/modules/shared/services/mzaService";

const MzaPage = () => {

  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {

    const data = searchParams.get("data");
    const signature = searchParams.get("signature");

    console.log("MZA Incoming Request");
    console.log("MSISDN:", data);
    console.log("Signature:", signature);

    if (!data) return;

    let msisdn = data;

    /* NORMALIZE */

    if (!msisdn.startsWith("92")) {
      msisdn = "92" + msisdn;
    }

    console.log("Normalized MSISDN:", msisdn);

    /* LOG REQUEST */

    logMzaRequest(msisdn, signature);

    /* STORE MZA MSISDN */

    sessionStorage.setItem("mzaMsisdn", msisdn);

  }, []);

  return <HomeMobile />;

};

export default MzaPage;