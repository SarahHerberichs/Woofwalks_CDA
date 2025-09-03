import api from "./api";

export const uploadPhoto = async (data) => {
  // L'intercepteur gère les erreurs, donc pas besoin de try...catch ici.
  const response = await api.post("/main_photo", data);
  return response.data;
};