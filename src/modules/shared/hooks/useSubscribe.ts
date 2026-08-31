import { useNavigate } from "react-router-dom";

export const useSubscribe = () => {

  const navigate = useNavigate();

  const handleSubscribe = () => {

    /* Check if user came from MZA */
    const mzaMsisdn = sessionStorage.getItem("mzaMsisdn");

    if (mzaMsisdn) {
      navigate(`/subscribe?msisdn=${mzaMsisdn}`);
      return;
    }

    /* Mobile: use HE redirect (auto-detects msisdn) */
    /* Desktop: go directly to clean /subscribe URL */
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      const redirect = encodeURIComponent(`${window.location.origin}/subscribe`);
      window.location.href = `http://he.zaheen.com.pk/gethe?redirect=${redirect}`;
    } else {
      navigate("/subscribe");
    }

  };

  return { handleSubscribe };

};