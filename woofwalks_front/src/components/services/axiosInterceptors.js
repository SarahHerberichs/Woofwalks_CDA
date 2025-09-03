//Intercepte erreur et affiche un toast 
import { toast } from 'react-toastify';

export const setupInterceptors = (axiosInstance) => { 
// Demande à Axios d'utiliser ces fonctions a chaque réponse serveur
  axiosInstance.interceptors.response.use(
    (response) => {
      // Si la réponse est OK
      return response;
    },
    (error) => {
      let errorMessage = 'Une erreur est survenue.';

      // DETERMINE MESSAGE D ERREUR
      if (error.response) {
        // Erreur dans la réponse du serveur (statut 4xx ou  5xx)
        if (error.response.data && error.response.data.detail) {
          errorMessage = `Détails: ${error.response.data.detail}`;
        } else if (error.response.data && error.response.data.message) {
          errorMessage = `Détails: ${error.response.data.message}`;
        } else {
          errorMessage = `Erreur du serveur (Statut: ${error.response.status})`;
        }
      } else if (error.request) {
        // Pas de réponse du serveur
        errorMessage = 'Pas de réponse du serveur. Vérifiez votre connexion.';
      } else {
        // Erreur de configuration
        errorMessage = `Erreur de configuration: ${error.message}`;
      }

      // Afficher le message d'erreur à l'utilisateur
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Relancer l'erreur pour que les fonctions appelantes puissent l'intercepter
      return Promise.reject(error);
    }
  );
};