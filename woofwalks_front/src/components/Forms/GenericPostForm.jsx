import React, { useState } from "react";

const GenericForm = ({ entityType, entitySpecificFields }) => {
  console.log(entityType);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ...entitySpecificFields.initialValues, // Injecte les champs spécifiques à l'entité
  });
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer l'état de soumission

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

      const photoResponse = await fetch("https://127.0.0.1:8000/api/photos", {
        method: "POST",
        body: photoFormData,
      });

      if (!photoResponse.ok) {
        throw new Error("Erreur lors de l'upload de la photo.");
      }

      const photoData = await photoResponse.json();
      const photoId = photoData.id;

      // Étape 2 : Envoi des données avec l'ID de la photo
      const entityData = {
        ...formData,
        photo: photoId,
      };

      const entityResponse = await fetch(
        `https://127.0.0.1:8000/api/${entityType}custom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
        ...entitySpecificFields.initialValues,
      });
      setPhoto(null);
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
