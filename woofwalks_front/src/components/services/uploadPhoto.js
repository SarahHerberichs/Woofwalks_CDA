import api from "./api";

export const uploadPhoto = async (data) => {
  console.log(data);
  try {
    const response = await api.post("/main_photo", data);
    return response.data;
  } catch (error) {
    console.error("Erreur upload photo avec axios", error.response?.data || error.message);
    // Relance l'erreur pour que l'appelant puisse gérer
    throw error;
  }
};
