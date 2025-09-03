import api from "./api";

export const createLocation = async (data) => {
  // L'intercepteur gère les erreurs, donc pas besoin de try...catch ici.
  const response = await api.post("/locations", {
    longitude: data.longitude,
    latitude: data.latitude,
    city: data.city,
    street: data.street,
    name: data.name,
  });
  return response.data;
};