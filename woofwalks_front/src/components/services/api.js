import axios from "axios";

//Créer instance axios et sa config par défaut
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // inclure les cookies
});
//Avant chaque requête : Récupération token et l'ajoute dans l'en tête de la requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  //Retour de la config finale
  return config;
});

//Après chaque requete, retour de la réponse ou supression des elements de sécurité du LocalStorage
api.interceptors.response.use(
  //return response
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("expiry");
      window.location.href = "/login"; 
    }
    console.error("Erreur dans l'intercepteur:", error); 
    //Propagation de l'erreur
    return Promise.reject(error);
  }
);

export default api;
