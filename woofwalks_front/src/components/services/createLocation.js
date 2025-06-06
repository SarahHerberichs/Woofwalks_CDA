import api from "./api";

export const createLocation = async (data) => {
  try {
    const response = await api.post("/locations", {
      longitude: data.longitude,
      latitude: data.latitude,
      city: data.city,
      street: data.street,
      name: data.name,
    });
    return response.data;
  } catch (error) {
    // Gestion des erreurs d'Axios :
    console.error("Erreur lors de la création du lieu avec Axios:", error);
    throw new Error(
      "Erreur lors du paramétrage du lieu. Vérifiez la console pour plus de détails."
    );
  }
};
