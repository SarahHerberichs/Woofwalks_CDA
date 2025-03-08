import React, { useState } from "react";

const PostWalkForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    max_participants: "",
  });
  const [photo, setPhoto] = useState(null); // Fichier photo sélectionné
  const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer l'état de soumission

  //Recupere champs walks et les injecte dans formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "max_participants" ? parseInt(value, 10) : value,
    });
  };
  //Récupere la photo et l'injecte dans Photo
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]); // Stocke le fichier sélectionné
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("Veuillez sélectionner une photo !");
      return;
    }

    setIsSubmitting(true);

    //Envoi a l'api la data de la photo, récup_re l'id , injecte l'id dans formdata , envoi la walk a api/walk
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
      const walkData = {
        ...formData,
        photo: photoId,
      };

      const walkResponse = await fetch(
        "https://127.0.0.1:8000/api/walkscustom",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(walkData),
        }
      );

      if (!walkResponse.ok) {
        throw new Error("Erreur lors de la création de la promenade.");
      }

      const walkResult = await walkResponse.json();
      alert("Promenade créée avec succès !");
      console.log("Réponse API Walks :", walkResult);
      // Réinitialisation du formulaire
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        max_participants: "",
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
      <div>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Heure:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Nombre maximum de participants:
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            min="1"
            required
          />
        </label>
      </div>
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
        {isSubmitting ? "En cours..." : "Créer la promenade"}
      </button>
    </form>
  );
};

export default PostWalkForm;
