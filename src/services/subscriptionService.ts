import axios from "axios";

const SERVICE_ID = "205";

export const getHE = async () => {
  const res = await axios.get("https://z.zaheen.com.pk/he/gethe");
  return res.data;
};

export const checkSubscriberStatus = async (msisdn: string) => {
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/subscriber/status",
    {
      params: {
        msisdn,
        serviceId: SERVICE_ID,
      },
    }
  );

  return res.data;
};

export const subscribeUser = async (msisdn: string) => {
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/subscribe",
    {
      params: {
        msisdn,
        serviceId: SERVICE_ID,
        subMethod: "WEB",
        transactionId: Date.now(),
      },
    }
  );

  return res.data;
};

export const sendPin = async (
  msisdn: string,
  login: (msisdn: string) => void
) => {

  try {

    /* CHECK SUBSCRIBER STATUS FIRST */

    const statusRes = await checkSubscriberStatus(msisdn);

    console.log("Subscriber status:", statusRes);

    if (statusRes.status === "ACTIVE") {

      console.log("User already subscribed");

      alert("You are already subscribed");

      login(msisdn);

      window.location.href = "/";

      return {
        status: "ALREADY_SUBSCRIBED"
      };

    }

    /* NOT ACTIVE → SEND PIN */

    const res = await axios.get(
      "https://subgateway.fitsworld.com.pk/zongcharging/api/send-pin",
      {
        params: {
          msisdn,
          serviceId: SERVICE_ID,
        },
      }
    );

    return res.data;

  } catch (error) {

    console.error("Send PIN failed:", error);

    return {
      status: "ERROR"
    };

  }

};


export const verifyPin = async (msisdn: string, pin: string) => {
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/verify-pin",
    {
      params: {
        msisdn,
        serviceId: SERVICE_ID,
        pin,
      },
    }
  );

  return res.data;
};

export const handleSubscribe = async (
  msisdn: string | null,
  login: (msisdn: string) => void
) => {

  try {

    if (msisdn) {

      console.log("Session MSISDN:", msisdn);

      /* CHECK SUBSCRIBER STATUS */

      const statusRes = await checkSubscriberStatus(msisdn);

      console.log("Subscriber status:", statusRes);

      if (statusRes.status === "ACTIVE") {

        console.log("Already subscribed → login");

        login(msisdn);

        window.location.href = "/";

        return;

      }

      /* NOT ACTIVE → SUBSCRIBE */

      const subRes = await subscribeUser(msisdn);

      console.log("Subscribe response:", subRes);

      if (subRes.status === "1") {

        login(msisdn);

        window.location.href = "/";

        return;

      }

      alert(subRes.desc || "Subscription failed");

      return;

    }

    /* NO SESSION → HE REDIRECT */

    const redirect = encodeURIComponent(
      "https://z.zaheen.com.pk/subscribe"
    );

    window.location.href =
      `http://he.zaheen.com.pk/gethe?redirect=${redirect}`;

  } catch (error) {

    console.error("Subscription failed:", error);

  }

};