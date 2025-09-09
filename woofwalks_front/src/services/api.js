import axios from "axios";
import { setupInterceptors } from "./axiosInterceptors";

//Création instance axios et sa config par défaut
const api = axios.create({
  baseURL: "https://woofwalkscda-production.up.railway.app/api",
  withCredentials: true, 
});
//intercepteur qui affiche toast si erreur
setupInterceptors(api); 

// api.interceptors.request.use((config) => {
//   return config;
// });

export default api;
