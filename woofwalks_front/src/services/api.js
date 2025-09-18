import axios from "axios";
import { setupInterceptors } from "./axiosInterceptors";

const apiUrl = process.env.REACT_APP_API_URL;
//Création instance axios et sa config par défaut
const api = axios.create({
  baseURL: `${apiUrl}`,
  withCredentials: true,
  // Nom du cookie généré par Symfony
  xsrfCookieName: "XSRF-TOKEN", 
  // Nom du header que Symfony attend
  xsrfHeaderName: "X-CSRF-Token",
});
//intercepteur qui affiche toast si erreur
setupInterceptors(api); 

// api.interceptors.request.use((config) => {
//   return config;
// });

export default api;
