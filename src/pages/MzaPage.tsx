import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import HomeMobile from "@/pages/Home/HomeMobile";

import { logMzaRequest } from "@/services/mzaService";
import { checkSubscriberStatus } from "@/services/subscriptionService";

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

    let msisdn = data;

    /* NORMALIZE MSISDN */

    if (!msisdn.startsWith("92")) {

      msisdn = "92" + msisdn;

    }

    console.log("Normalized MSISDN:", msisdn);

    /* LOG REQUEST */

    logMzaRequest(msisdn, signature);

    /* CHECK SUBSCRIPTION */

    checkSubscriberStatus(msisdn)
      .then((res) => {

        console.log("Subscriber status:", res);

        if (res.status === "ACTIVE") {

          console.log("User already subscribed → login");

          login(msisdn);

        } else {

          console.log("User not subscribed → store session");

          login(msisdn); // still store session

        }

      })
      .catch((err) => {

        console.error("Status check failed:", err);

        login(msisdn); // fallback

      });

  }, []);

  return <HomeMobile />;

};

export default MzaPage;