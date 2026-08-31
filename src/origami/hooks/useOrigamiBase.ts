import { useLocation } from "react-router-dom";

export function useOrigamiBase() {
  const location = useLocation();
  return location.pathname.startsWith("/origami-mobile")
    ? "/origami-mobile"
    : "/origami";
}