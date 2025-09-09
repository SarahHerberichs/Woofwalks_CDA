import api from "./api";

export const uploadPhoto = async (data) => {
  const response = await api.post("/main_photo", data);
  return response.data;
};