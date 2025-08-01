import axios from "axios";

//Créer instance axios et sa config par défaut
const api = axios.create({
  baseURL: "https://localhost:8443/api",
  withCredentials: true, // inclure les cookies
});
//Avant chaque requête : Récupération token et l'ajoute dans l'en tête de la requête
api.interceptors.request.use((config) => {
  //Retour de la config finale
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && error.config.url !== "/login_check") {
      window.location.href = "/login";
    }
    console.error("Erreur dans l'intercepteur:", error);
    return Promise.reject(error);
  }
);


export default api;
