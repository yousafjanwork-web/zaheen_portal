import axios from "axios";

/* LOGIN PIN (STEP 1) */

export const loginPin = async (msisdn: string) => {
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/login-pin",
    {
      params: { msisdn }
    }
  );

  return res.data;
};

/* VERIFY LOGIN PIN (STEP 2) */
export const verifyLoginPin = async (msisdn: string, pin: string) => {
  const res = await axios.get(
    "https://subgateway.fitsworld.com.pk/zongcharging/api/verify-login-pin",
    {
      params: { msisdn, pin }
    }
  );

  return res.data;
};