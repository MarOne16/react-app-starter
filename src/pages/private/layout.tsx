import { Navigate, Outlet, useLocation } from "react-router";
import { useIsAuthenticated } from "@/store/session-store";

export default function PrivateLayout() {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
