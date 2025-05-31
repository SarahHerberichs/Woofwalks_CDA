import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    const token = localStorage.getItem("authToken");
    return token;
  });

  const login = (token) => {
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 heures plus tard
    localStorage.setItem("authToken", token);
    localStorage.setItem("expiry", expiryTime.toJSON());
    setAuthToken(token); // Mettre à jour l'état avec le nouveau token
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiry");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = new Date(localStorage.getItem("expiry"));
    if (expiry < new Date()) {
      logout(); // Déconnexion si le token est expiré
    } else if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
