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
  const responseInterceptor = axios.interceptors.response.use(
    res => {
      console.log('Response OK:', res);
      return res;
    },
    async err => {
      const originalRequest = err.config;
      console.error('Interceptor caught error:', err.response?.status, err.response?.data);

     if (err.response?.status === 401 && !originalRequest._retry) {
  originalRequest._retry = true;
  try {
    console.log('Trying to refresh token...');
    await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh`, {}, { withCredentials: true });
    console.log('Token refreshed, retrying original request...');
    await new Promise(resolve => setTimeout(resolve, 100));
    await checkAuth();
    return axios({ ...originalRequest, withCredentials: true }); // ✅ Important !
  } catch (e) {
    console.error('Refresh token failed:', e);
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
