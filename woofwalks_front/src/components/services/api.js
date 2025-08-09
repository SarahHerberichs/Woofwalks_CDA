import axios from "axios";

//Création instance axios et sa config par défaut
const api = axios.create({
  baseURL: "https://localhost:8443/api",
  withCredentials: true, // inclusion des cookies
});

api.interceptors.request.use((config) => {
  return config;
});

export default api;
