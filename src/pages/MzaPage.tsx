import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import HomeMobile from "@/pages/Home/HomeMobile";

import { logMzaRequest } from "@/services/mzaService";

const MzaPage = () => {

  const [searchParams] = useSearchParams();

  const { login } = useAuth();

  useEffect(() => {

    const data = searchParams.get("data");
    const signature = searchParams.get("signature");

    console.log("MZA Incoming Request");
    console.log("MSISDN:", data);
    console.log("Signature:", signature);

    if (!data) {

      console.warn("No MSISDN found in request");

      return;

    }

    const msisdn = data;

    /* CALL LOG SERVICE */

    logMzaRequest(msisdn, signature);

    /* LOGIN USER */

    login(msisdn);

    console.log("User logged in via MZA:", msisdn);

  }, []);

  return <HomeMobile />;

};

export default MzaPage;