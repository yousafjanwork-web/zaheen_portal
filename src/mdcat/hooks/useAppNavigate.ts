import { useNavigate, useLocation } from "react-router-dom";
 
export function useAppNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const isMobileBase = location.pathname.startsWith("/mdcat-mobile");
  const basePath = isMobileBase ? "/mdcat-mobile" : "/mdcat";
 
  const appNavigate = (path: string, options?: object) => {
    // If navigating directly to root/home
    if (path === "/mdcat" || path === "/mdcat-mobile" || path === "/") {
      navigate(basePath, options);
      return;
    }
 
    // Strip redundant base prefixes
    let target = path
      .replace(/^\/mdcat-mobile/, "")
      .replace(/^\/mdcat/, "");
 
    if (!target.startsWith("/")) {
      target = `/${target}`;
    }
 
    navigate(`${basePath}${target}`, options);
  };
 
  return { navigate: appNavigate, basePath };
}