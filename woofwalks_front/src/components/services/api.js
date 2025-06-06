import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("expiry");
      window.location.href = "/login"; // ou navigate()
    }
    console.error("Erreur dans l'intercepteur:", error); // Ajoutez ceci
    return Promise.reject(error);
  }
);

export default api;
