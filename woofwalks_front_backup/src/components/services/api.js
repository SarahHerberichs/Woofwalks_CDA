import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:8000",
  // Désactivation la vérification des certificats SSL directement via Axios
  withCredentials: true,
});

export default axiosInstance;
