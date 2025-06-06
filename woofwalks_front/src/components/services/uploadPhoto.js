import api from "./api";

export const uploadPhoto = async (data) => {
  try {
    const response = await api.post("/main_photos", data);
    return response.data;
  } catch (error) {
    console.error("Erreur upload photo avec axios", error);
  }
};
