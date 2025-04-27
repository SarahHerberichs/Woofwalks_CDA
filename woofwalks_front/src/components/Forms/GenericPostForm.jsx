import React, { useState } from "react";
import LocationForm from "./LocationForm";
const GenericForm = ({ entityType, entitySpecificFields }) => {
  //Si localisation privée: nom de l'endroit et coordonnees gps à inserer en bdd
  //Si Park : Entrer nom du park, autocompletion se fera à partir de ca
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    ...entitySpecificFields.initialValues, // Injecte les champs spécifiques à l'entité
  });

  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer l'état de soumission

  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Token JWT manquant. Veuillez vous reconnecter.");
  }

  const onSelectCoordinates = ({ lat, lng }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      latitude: lat,
      longitude: lng,
    }));
  };
  // Gère le changement de valeurs des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gère la sélection de la photo
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Veuillez sélectionner une photo !");
      return;
    }

    setIsSubmitting(true);

    try {
      // Étape 1 : Upload de la photo
      const photoFormData = new FormData();
      photoFormData.append("file", photo);

      // Envoi de la photo avec l'authentification via le token JWT
      const photoResponse = await fetch(
        "https://localhost:8000/api/main_photos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
          },
          body: photoFormData,
        }
      );

      if (!photoResponse.ok) {
        throw new Error("Erreur lors de l'upload de la photo.");
      }

      const photoData = await photoResponse.json();
      const photoId = photoData.id;

      const coordResponse = await fetch(
        "https://localhost:8000/api/locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
          },
          body: JSON.stringify({
            longitude: formData.longitude,
            latitude: formData.latitude,
          }),
        }
      );
      if (!coordResponse.ok) {
        throw new Error("Erreur lors du paramétrage du lieu");
      }
      const locationData = await coordResponse.json();
      const location = parseInt(locationData["@id"].split("/").pop()); // Extrait l'ID à partir de l'URL
      // Convertir datetime pour l'API
      const formattedDateTime = new Date(formData.datetime).toISOString();

      // Étape 2 : Envoi des données avec l'ID de la photo
      const entityData = {
        ...formData,
        date: formattedDateTime, // Date au format ISO
        photo: photoId,
        location: location,
      };
      console.log(entityData);

      const entityResponse = await fetch(
        `https://localhost:8000/api/${entityType}custom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Ajout du token dans le header Authorization
          },
          body: JSON.stringify(entityData),
        }
      );

      if (!entityResponse.ok) {
        throw new Error(`Erreur lors de la création de ${entityType}.`);
      }

      const entityResult = await entityResponse.json();
      alert(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } créé avec succès !`
      );
      console.log(`Réponse API ${entityType}s :`, entityResult);

      // Réinitialisation du formulaire
      setFormData({
        title: "",
        description: "",
        creator: "",
        location: "",
        ...entitySpecificFields.initialValues,
      });

      // setPhoto(null);
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Titre:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>
      </div>

      {/* Champs spécifiques injectés pour chaque entité */}
      {entitySpecificFields.fields.map((field) => (
        <div key={field.name}>
          <label>
            {field.label}:
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required
            />
          </label>
        </div>
      ))}
      <LocationForm onSelectCoordinates={onSelectCoordinates} />
      <div>
        <label>
          Photo:
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "En cours..." : `Créer ${entityType}`}
      </button>
    </form>
  );
};

export default GenericForm;
