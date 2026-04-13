import axios from "axios";

/* HE SERVICE */

export const getHE = async () => {
  const res = await axios.get("https://z.zaheen.com.pk/he/gethe");
  return res.data;
};

/* CHECK SUBSCRIBER STATUS */

export const checkSubscriberStatus = async (
  msisdn: string,
  serviceId: string
) => {
  console.log("Subscriber status  msisdn:" + msisdn + " serviceid " + serviceId);
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/subscriber/status",
    {
      params: {
        msisdn,
        serviceId
      }
    }
  );

  return res.data;
};

/* SEND PIN */

export const sendPin = async (
  msisdn: string,
  serviceId: string
) => {

  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/send-pin",
    {
      params: {
        msisdn,
        serviceId
      }
    }
  );

  return res.data;

};

/* VERIFY PIN */

export const verifyPin = async (
  msisdn: string,
  pin: string,
  serviceId: string,
  transactionId:string
) => {

  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/verify-subscribe",
    {
      params: {
        msisdn,
        serviceId,
        pin,
        transactionId
      }
    }
  );

  return res.data;

};

/* SUBSCRIBE USER */

export const subscribeUser = async (
  msisdn: string,
  serviceId: string
) => {


  const getSubMethod = () => {
    const params = new URLSearchParams(window.location.search);

    // ✅ 1. Check if request is from MyZongApp
    if (
      params.get("mza") ||
      params.get("source")?.toLocaleLowerCase() === "mza" ||
      params.get("channel")?.toLowerCase() === "mza" ||
      sessionStorage.getItem("mzaMsisdn")
    ) {
      return "MZA";
    }

    // ✅ 2. Detect Mobile vs Web (basic UA check)
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      return "MOBILE";
    }

    // ✅ 3. Default
    return "WEB";
  };

  const subMethod = getSubMethod();

  console.log(subMethod, "onsubmethod");

  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/subscribe",
    {
      params: {
        msisdn,
        serviceId,
        subMethod,
        transactionId: Date.now()
      }
    }
  );

  return res.data;

};


/* HANDLE SUBSCRIBE ENTRY */

export const handleSubscribe = async (
  msisdn: string | null,
  login: (msisdn: string) => void,
  serviceId: string
) => {

  try {

    /* STORE PLAN BEFORE REDIRECT */

    localStorage.setItem("pendingServiceId", serviceId);

    let finalMsisdn = msisdn;

    if (!finalMsisdn) {

      finalMsisdn =
        localStorage.getItem("msisdn") ||
        sessionStorage.getItem("mzaMsisdn");

    }

    if (!finalMsisdn) {

      /* REDIRECT TO HE */

      const redirect = encodeURIComponent(
        `https://z.zaheen.com.pk/subscribe`
      );

      window.location.href =
        `http://he.zaheen.com.pk/gethe?redirect=${redirect}`;

      return;

    }

    console.log("Using MSISDN:", finalMsisdn);

    /* CHECK SUBSCRIBER */

    const statusRes = await checkSubscriberStatus(finalMsisdn, serviceId);

    console.log("Subscriber status:", statusRes);

    if (statusRes.status === "ACTIVE") {

      login(finalMsisdn);

      sessionStorage.removeItem("mzaMsisdn");

      window.location.href = "/";

      return;

    }

    /* SUBSCRIBE */

    const subRes = await subscribeUser(finalMsisdn, serviceId);

    console.log("Subscribe response:", subRes);

    if (subRes.status === "1") {

      login(finalMsisdn);

      localStorage.setItem("activeServiceId", serviceId);
      sessionStorage.removeItem("mzaMsisdn");

      window.location.href = "/";

      return;

    }

    alert(subRes.desc || "Subscription failed");

  } catch (error) {

    console.error("Subscription failed:", error);

  }

};