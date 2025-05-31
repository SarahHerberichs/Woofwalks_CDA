import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:8000",
  // Désactiver la vérification des certificats SSL directement via Axios
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  // URL navigateur courante (frontend)
  const currentPath = window.location.pathname;

  // Routes frontend à exclure
  const excludedFrontendRoutes = ["/walk", "/main"];

  const isExcludedFrontendRoute = excludedFrontendRoutes.some(
    (route) => currentPath === route
  );

  if (token && !isExcludedFrontendRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
