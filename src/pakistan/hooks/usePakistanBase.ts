import { useLocation } from "react-router-dom";

export function usePakistanBase() {
  const location = useLocation();
  return location.pathname.startsWith("/pakistan-mobile")
    ? "/pakistan-mobile"
    : "/pakistan";
}