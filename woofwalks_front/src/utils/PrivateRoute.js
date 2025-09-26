import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth(); 
 
    if (isLoading) {
        return <div>Vérification de l'authentification...</div>; 
    }


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
