import api from "./api";

export const registerUser = async ({ email, username, plainPassword, cgvAccepted, notificationsAccepted, geolocationAccepted }) => {
  const response = await api.post("api/users", {
    email,
    username,
    plainPassword,
    cgvAccepted,
    notificationsAccepted,
    geolocationAccepted
  });
  return response.data;
};
