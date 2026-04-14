import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/modules/shared/context/AuthContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate 
      to="/login" 
      replace 
      state={{ from: location }}
    />
  );
};

export default ProtectedRoute;