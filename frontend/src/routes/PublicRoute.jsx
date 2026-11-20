import { Navigate, Outlet } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;