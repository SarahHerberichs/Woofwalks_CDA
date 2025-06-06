import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
const PrivateRoute = () => {
  const { authToken } = useAuth();
  const isAuthenticated = !authToken;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
