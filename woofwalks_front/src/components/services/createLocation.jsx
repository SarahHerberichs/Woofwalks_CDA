export const createLocation = async (data, token) => {
  const response = await fetch("https://localhost:8000/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      longitude: data.longitude,
      latitude: data.latitude,
      city: data.city,
      street: data.street,
      name: data.name,
    }),
  });
  if (!response.ok) throw new Error("Erreur lors du paramétrage du lieu");
  return await response.json();
};
