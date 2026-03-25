import axios from "axios";

const BASE_URL = "https://zai.zaheen.com.pk/api";

/* LOG MZA REQUEST */

export const logMzaRequest = async (
  msisdn: string | null,
  signature: string | null
) => {

  try {

    const res = await axios.get(`${BASE_URL}/mza-log`, {
      params: {
        data: msisdn,
        signature
      }
    });

    console.log("MZA log response:", res.data);

    return res.data;

  } catch (error) {

    console.error("MZA log failed:", error);

  }

};