import { useLocation } from "react-router-dom";

export function useVocabBase() {
  const location = useLocation();
  return location.pathname.startsWith("/vocab-mobile")
    ? "/vocab-mobile"
    : "/vocab";
}