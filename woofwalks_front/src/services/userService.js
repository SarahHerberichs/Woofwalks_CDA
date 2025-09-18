import api from "./api";

export const registerUser = async ({ email, username, plainPassword, cgvAccepted }) => {
  const response = await api.post("api/users", {
    email,
    username,
    plainPassword,
    cgvAccepted,
  });
  return response.data;
};
