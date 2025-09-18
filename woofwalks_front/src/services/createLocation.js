import api from "./api";

export const createLocation = async (data) => {
  const response = await api.post("api/locations", {
    longitude: data.longitude,
    latitude: data.latitude,
    city: data.city,
    street: data.street,
    name: data.name,
  });
  return response.data;
};