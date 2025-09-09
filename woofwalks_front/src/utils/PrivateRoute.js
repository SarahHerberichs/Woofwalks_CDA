import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();  //Authtoken est bien trouvé
 
    if (isLoading) {
        return <div>Vérification de l'authentification...</div>; // Ou un loader
    }


  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
