import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
//Englobe l'application
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //Vérification de l'authentification
  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/me`, {
        withCredentials: true
      });
      console.log("✅ /api/me success:", res.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.warn("❌ /api/me failed:", err.response?.status, err.response?.data);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("isAuthenticated a changé :", isAuthenticated);
  }, [isAuthenticated]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

//Procédure de connexion 
  const login = async (email, password) => {
    // Appel login
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/login_check`,
      { email, password },
      { withCredentials: true }
    );
    setIsAuthenticated(true);
  };

  //Déconnexion
  const logout = async () => {
    console.log('tentative logout');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Intercepteur de réponse axios pour refresh automatique du token en cas de 401
  useEffect(() => {
    //Va enregistrer les fonctions suivantes pr quelles soient apellées à chaque réponse recue
    const responseInterceptor = axios.interceptors.response.use(
      res => res,
      async err => {
        //Récupère la config de la requete qui a causé l'erreure
        const originalRequest = err.config;
        //Si 401(probleme token) et qu'on a pas encore réessayé)- on réessaye et déclare qu'on a déjà réessaye (Evite boucle infinie)
        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          //Appel au refresh du token pour ne plus etre en 401
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh`, {}, { withCredentials: true });
            return axios(originalRequest);
            //si le retry n'a pas été concluant, on rejete et fini
          } catch {
            setIsAuthenticated(false);
            return Promise.reject(err);
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(responseInterceptor);
  }, []);

  //Déclaration du contexte englobant l'appli, permettant de consommer les procédures partout 
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {isLoading ? <div>Chargement...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
