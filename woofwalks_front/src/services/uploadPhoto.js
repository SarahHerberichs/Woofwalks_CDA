import api from "./api";

export const uploadPhoto = async (data) => {
  const response = await api.post("api/main_photo", data);
  return response.data;
};