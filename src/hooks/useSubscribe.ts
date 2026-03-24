import { useNavigate } from "react-router-dom";

export const useSubscribe = () => {

  const navigate = useNavigate();

  const handleSubscribe = () => {

    /* Check if user came from MZA */

    const mzaMsisdn = sessionStorage.getItem("mzaMsisdn");

    if (mzaMsisdn) {

      console.log("MZA user detected:", mzaMsisdn);

      navigate(`/subscribe?msisdn=${mzaMsisdn}`);

      return;

    }

    /* Otherwise redirect to HE */

    console.log("Redirecting to HE");

    const redirect = encodeURIComponent(
      "https://z.zaheen.com.pk/subscribe"
    );

    window.location.href =
      `http://he.zaheen.com.pk/gethe?redirect=${redirect}`;

  };

  return { handleSubscribe };

};