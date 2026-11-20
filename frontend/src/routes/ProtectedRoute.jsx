import { Navigate, Outlet, useLocation } from "react-router";
import useAuthContext from "../hooks/useAuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;