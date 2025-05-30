export const uploadPhoto = async (data, token) => {
  const response = await fetch("https://localhost:8000/api/main_photos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });
  if (!response.ok) throw new Error("Erreur lors de l'upload de la photo.");
  return await response.json();
};
