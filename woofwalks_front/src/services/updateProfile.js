import api from "./api";

export const updateProfile = async (data) => {
  const response = await api.patch("api/me", {
    username: data.username,
    email: data.email,
    acceptNotifications : data.acceptNotifications
  });
  return response.data;
};