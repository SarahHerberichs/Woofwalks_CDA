import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Vérifie si un jeton JWT est présent dans localStorage.
  // C'est notre indicateur d'authentification.
  const isAuthenticated = !!localStorage.getItem("jwt_token");

  // Si l'utilisateur est authentifié, on rend les "enfants" de cette route (Outlet).
  // Sinon, on le redirige vers la page de connexion.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
