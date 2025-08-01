import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (email, password) => {
    // Appel login
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/login_check`,
      { email, password },
      { withCredentials: true }
    );
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Intercepteur réponse pour refresh automatique du token en cas de 401
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      res => res,
      async err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh`, {}, { withCredentials: true });
            return axios(originalRequest);
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
