// export const postGenericAd = async (data, token, entityType) => {
//   const response = await fetch(
//     `https://localhost:8000/api/${entityType}custom`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     }
//   );

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error("Erreur API :", errorText);
//     throw new Error(`Erreur lors de la création de ${entityType}.`);
//   }

//   const result = await response.json();

//   alert(
//     `${
//       entityType.charAt(0).toUpperCase() + entityType.slice(1)
//     } créé avec succès !`
//   );

//   return result;
// };

import api from "./api";

export const postGenericAd = async (data, entityType) => {
  try {
    const response = await api.post(`${entityType}custom`, data);
    const result = response.data;

    alert(
      `${
        entityType.charAt(0).toUpperCase() + entityType.slice(1)
      } créé avec succès !`
    );
    return result;
  } catch (error) {
    let errorMessage = `Erreur lors de la création de ${entityType}.`;

    // Si l'erreur vient d'une réponse HTTP (et non un simple Network Error)
    if (error.response) {
      // API Platform renvoie souvent des messages d'erreur détaillés dans error.response.data.detail ou error.response.data.message
      if (error.response.data && error.response.data.detail) {
        errorMessage += ` Détails: ${error.response.data.detail}`;
      } else if (error.response.data && error.response.data.message) {
        errorMessage += ` Détails: ${error.response.data.message}`;
      } else {
        errorMessage += ` Statut: ${error.response.status}`;
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue (ex: network down)
      errorMessage += " Pas de réponse du serveur. Vérifiez votre connexion.";
    } else {
      // Autre chose a déclenché l'erreur (ex: erreur de configuration d'Axios)
      errorMessage += ` Erreur de configuration: ${error.message}`;
    }

    alert(errorMessage);
    throw new Error(errorMessage); // Relancer l'erreur pour la gestion en amont si nécessaire
  }
};
