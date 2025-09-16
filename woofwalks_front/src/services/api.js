import axios from "axios";
import { setupInterceptors } from "./axiosInterceptors";

const apiUrl = process.env.REACT_APP_API_URL;
//Création instance axios et sa config par défaut
const api = axios.create({
    baseURL: `${apiUrl}/api`,
    withCredentials: true, 
});
// const api = axios.create({
//   baseURL: "https://localhost:8443/api",
//   // baseURL: "https://woofwalksback-prod-production.up.railway.app/api",
//   withCredentials: true, 
// });
//intercepteur qui affiche toast si erreur
setupInterceptors(api); 

// api.interceptors.request.use((config) => {
//   return config;
// });

export default api;
