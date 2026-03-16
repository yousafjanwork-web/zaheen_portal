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

export const sendPin = async (msisdn: string) => {
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