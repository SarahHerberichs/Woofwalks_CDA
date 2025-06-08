import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
const PrivateRoute = () => {
  const { authToken } = useAuth();
  //Authtoken est bien trouvé
  console.log(authToken)
  const isAuthenticated = authToken;
  console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
