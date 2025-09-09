import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Crée un contexte pour l'authentification.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        try {
            // Tente de vérifier si l'utilisateur est authentifié en appelant l'API.
            // En cas d'erreur 401, l'intercepteur Axios tentera de rafraîchir le token.
            await axios.get(`${process.env.REACT_APP_API_URL}/api/me`, {
                withCredentials: true
            });
            // Si la requête réussit, l'utilisateur est authentifié.
            setIsAuthenticated(true);
        } catch (err) {
            // Si la requête échoue même après les tentatives de rafraîchissement
            // gérées par l'intercepteur, l'utilisateur n'est pas authentifié.
            console.error('Initial authentication check failed after all retries:', err.response?.status, err.response?.data);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
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

    // Configuration de l'intercepteur Axios et de la vérification initiale de l'authentification.--gère les 401
    useEffect(() => {
        let isRefreshing = false; 
        const responseInterceptor = axios.interceptors.response.use(
            res => res,
            async err => {
                const originalRequest = err.config;
                // Ne gère que les erreurs 401 sur les requêtes non-refresh.
                if (err.response?.status === 401 && !originalRequest.url.endsWith('/api/token/refresh') && !isRefreshing) {
                    isRefreshing = true;
                    try {
                        console.log('Trying to refresh token...');
                        // Lance la requête de rafraîchissement.
                        await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh`, {}, { withCredentials: true });
                        isRefreshing = false;
                        console.log('Token refreshed, retrying original request...');
                        
                        // Retente la requête originale avec le nouveau token.
                        return axios({ ...originalRequest, withCredentials: true });
                    } catch (refreshErr) {
                        console.error('Refresh token failed:', refreshErr);
                        isRefreshing = false;
                        // Si le rafraîchissement échoue, on déconnecte et rejette la promesse.
                        setIsAuthenticated(false);
                        return Promise.reject(err);
                    }
                }
                // Pour les autres erreurs ou si un rafraîchissement est déjà en cours, on rejette la promesse.
                return Promise.reject(err);
            }
        );
        
        // Exécute la vérification d'authentification après que l'intercepteur soit prêt.
        checkAuth();

        // Fonction de nettoyage pour retirer l'intercepteur au démontage du composant.
        return () => {
            console.log('Ejecting Axios interceptor...');
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [checkAuth]);
    
    // Le fournisseur de contexte rend l'état et les fonctions d'authentification
    // disponibles pour tous les composants enfants.
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
