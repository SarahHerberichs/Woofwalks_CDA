import axios from "axios";
import { setupInterceptors } from "./axiosInterceptors";

//Création instance axios et sa config par défaut
const api = axios.create({
  // baseURL: "https://localhost:8443/api",
  baseURL: "https://woofwalksback-prod-production.up.railway.app",
  withCredentials: true, 
});
//intercepteur qui affiche toast si erreur
setupInterceptors(api); 

// api.interceptors.request.use((config) => {
//   return config;
// });

export default api;
