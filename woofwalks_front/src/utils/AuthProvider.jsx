import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider mounted");

  useEffect(() => {
    console.log("AuthProvider useEffect executed");
  }, []);

  //Récuperation Token
  const [authToken, setAuthToken] = useState(() => {
    const token = localStorage.getItem("authToken");
    return token;
  });
  //A la connexion Stockage du token et expiration
  const login = (token) => {
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    localStorage.setItem("authToken", token);
    localStorage.setItem("expiry", expiryTime.toJSON());
    setAuthToken(token);
  };

  //A la déconnexion Suppression su stockage token et expiration
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiry");
  };

  //Vérification à chaque montage d'un enfant de AuthProvider
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiryStr = localStorage.getItem("expiry");

    //Si plus de token, déconexion
    if (!token || !expiryStr) {
      logout();
      return;
    }

    const expiry = new Date(expiryStr);
    if (expiry < new Date()) {
      logout();
    } else {
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
