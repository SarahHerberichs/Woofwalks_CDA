import api from "./api";

export const loginUser = async (email, password) => {
  try {
    // L'URL de base est déjà dans l'instance 'api'
    // Axios gère automatiquement la sérialisation en JSON
    const response = await api.post("/login_check", { email, password });

    // Axios met la réponse du serveur dans `response.data`
    // Ici, nous nous attendons à ce que le token soit directement dans response.data.token
    return response.data.token;
  } catch (error) {
    // Gestion des erreurs d'Axios pour la connexion
    console.error("Erreur lors de la connexion:", error);

    // Retourne un message d'erreur plus spécifique si possible
    if (error.response && error.response.status === 401) {
      throw new Error(
        "Identifiants incorrects. Veuillez vérifier votre email et mot de passe."
      );
    } else if (error.response) {
      // Pour d'autres erreurs HTTP (ex: 400 Bad Request, 500 Internal Server Error)
      const errorMessage =
        error.response.data.message ||
        error.response.data.detail ||
        "Une erreur est survenue lors de la connexion.";
      throw new Error(errorMessage);
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      throw new Error(
        "Pas de réponse du serveur. Vérifiez votre connexion internet."
      );
    } else {
      // Autre chose a déclenché l'erreur (ex: problème de configuration Axios)
      throw new Error(`Erreur inattendue: ${error.message}`);
    }
  }
};
