export const postGenericAd = async (data, token, entityType) => {
  const response = await fetch(
    `https://localhost:8000/api/${entityType}custom`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erreur API :", errorText);
    throw new Error(`Erreur lors de la création de ${entityType}.`);
  }

  const result = await response.json();

  alert(
    `${
      entityType.charAt(0).toUpperCase() + entityType.slice(1)
    } créé avec succès !`
  );

  return result;
};
