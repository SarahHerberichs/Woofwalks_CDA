// import { useState } from "react";
// import LocationForm from "../../LocationForm";
// const GenericForm = ({ entityType, entitySpecificFields }) => {
//   //Si localisation privée: nom de l'endroit et coordonnees gps à inserer en bdd
//   //Si Park : Entrer nom du park, autocompletion se fera à partir de ca
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     location: "",
//     ...entitySpecificFields.initialValues, // Injecte les champs spécifiques à l'entité
//   });

//   const [photo, setPhoto] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false); // Pour gérer l'état de soumission

//   const token = localStorage.getItem("authToken");
//   if (!token) {
//     throw new Error("Token JWT manquant. Veuillez vous reconnecter.");
//   }
//  Modifie la lat et long dans la data du form
//   const onSelectCoordinates = ({ lat, lng }) => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       latitude: lat,
//       longitude: lng,
//     }));
//   };
//   // Gère le changement de valeurs des champs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // Gère la sélection de la photo
//   const handleFileChange = (e) => {
//     setPhoto(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!photo) {
//       alert("Veuillez sélectionner une photo !");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Étape 1 : Upload de la photo
//       const photoFormData = new FormData();
//       photoFormData.append("file", photo);

//       // Envoi de la photo avec l'authentification via le token JWT
//       const photoResponse = await fetch(
//         "https://localhost:8000/api/main_photos",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
//           },
//           body: photoFormData,
//         }
//       );

//       if (!photoResponse.ok) {
//         throw new Error("Erreur lors de l'upload de la photo.");
//       }

//       const photoData = await photoResponse.json();
//       const photoId = photoData.id;

//       const coordResponse = await fetch(
//         "https://localhost:8000/api/locations",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
//           },
//           body: JSON.stringify({
//             longitude: formData.longitude,
//             latitude: formData.latitude,
//           }),
//         }
//       );
//       if (!coordResponse.ok) {
//         throw new Error("Erreur lors du paramétrage du lieu");
//       }
//       const locationData = await coordResponse.json();
//       const location = parseInt(locationData["@id"].split("/").pop()); // Extrait l'ID à partir de l'URL
//       // Convertir datetime pour l'API
//       const formattedDateTime = new Date(formData.datetime).toISOString();

//       // Étape 2 : Envoi des données avec l'ID de la photo
//       const entityData = {
//         ...formData,
//         date: formattedDateTime, // Date au format ISO
//         photo: photoId,
//         location: location,
//       };
//       console.log(entityData);

//       const entityResponse = await fetch(
//         `https://localhost:8000/api/${entityType}custom`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Ajout du token dans le header Authorization
//           },
//           body: JSON.stringify(entityData),
//         }
//       );

//       if (!entityResponse.ok) {
//         throw new Error(`Erreur lors de la création de ${entityType}.`);
//       }

//       const entityResult = await entityResponse.json();
//       alert(
//         `${
//           entityType.charAt(0).toUpperCase() + entityType.slice(1)
//         } créé avec succès !`
//       );
//       console.log(`Réponse API ${entityType}s :`, entityResult);

//       // Réinitialisation du formulaire
//       setFormData({
//         title: "",
//         description: "",
//         creator: "",
//         location: "",
//         ...entitySpecificFields.initialValues,
//       });

//       // setPhoto(null);
//     } catch (error) {
//       console.error("Erreur :", error);
//       alert("Une erreur est survenue : " + error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>
//           Titre:
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </label>
//       </div>
//       <div>
//         <label>
//           Description:
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//           ></textarea>
//         </label>
//       </div>

//       {/* Champs spécifiques injectés pour chaque entité */}
//       {entitySpecificFields.fields.map((field) => (
//         <div key={field.name}>
//           <label>
//             {field.label}:
//             <input
//               type={field.type}
//               name={field.name}
//               value={formData[field.name]}
//               onChange={handleChange}
//               required
//             />
//           </label>
//         </div>
//       ))}
//       <LocationForm onSelectCoordinates={onSelectCoordinates} />
//       <div>
//         <label>
//           Photo:
//           <input
//             type="file"
//             name="photo"
//             accept="image/*"
//             onChange={handleFileChange}
//             required
//           />
//         </label>
//       </div>

//       <button type="submit" disabled={isSubmitting}>
//         {isSubmitting ? "En cours..." : `Créer ${entityType}`}
//       </button>
//     </form>
//   );
// };

// export default GenericForm;
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import LocationForm from "../LocationForm";

const GenericForm = ({ entityType, entitySpecificFields }) => {
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("authToken");
  // Initialisation de react-hook-form
  const {
    register,
    handleSubmit,
    control, // Pour les champs contrôlés (ex: LocationForm si besoin)
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      datetime: "", // Assure que tu as ce champ
      ...entitySpecificFields.initialValues,
    },
  });

  const locationType = watch("use_custom_location");
  //Reset des coordonnées latitude/longitude dans le formulaire (props de LocationForm attendue)
  const onSelectCoordinates = ({ lat, lng }) => {
    // Comme LocationForm est un composant enfant, on utilise reset partiel pour mettre à jour
    reset((formValues) => ({
      ...formValues,
      latitude: lat,
      longitude: lng,
    }));
  };

  // Gestion spécifique du fichier photo (pas pris en charge directement par RHF)
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    if (!photo) {
      alert("Veuillez sélectionner une photo !");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload de la photo
      const photoFormData = new FormData();
      photoFormData.append("file", photo);

      const photoResponse = await fetch(
        "https://localhost:8000/api/main_photos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: photoFormData,
        }
      );
      if (!photoResponse.ok)
        throw new Error("Erreur lors de l'upload de la photo.");

      const photoData = await photoResponse.json();
      const photoId = photoData.id;

      // 2. Upload des coordonnées (location)
      const coordResponse = await fetch(
        "https://localhost:8000/api/locations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            longitude: data.longitude,
            latitude: data.latitude,
          }),
        }
      );
      if (!coordResponse.ok)
        throw new Error("Erreur lors du paramétrage du lieu");

      const locationData = await coordResponse.json();
      const location = parseInt(locationData["@id"].split("/").pop());

      // 3. Préparation des données à envoyer
      const formattedDateTime = new Date(data.datetime).toISOString();

      const entityData = {
        ...data,
        date: formattedDateTime,
        photo: photoId,
        location: location,
      };

      // 4. Envoi des données entité
      const entityResponse = await fetch(
        `https://localhost:8000/api/${entityType}custom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(entityData),
        }
      );

      if (!entityResponse.ok)
        throw new Error(`Erreur lors de la création de ${entityType}.`);

      const entityResult = await entityResponse.json();
      alert(
        `${
          entityType.charAt(0).toUpperCase() + entityType.slice(1)
        } créé avec succès !`
      );
      console.log(`Réponse API ${entityType}s :`, entityResult);

      // Reset formulaire + photo
      reset({
        title: "",
        description: "",
        location: "",
        datetime: "",
        ...entitySpecificFields.initialValues,
      });
      setPhoto(null);
    } catch (error) {
      alert("Une erreur est survenue : " + error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          <h4 className="alert-heading">Connexion requise</h4>
          <p>Vous devez être connecté pour créer un(e) {entityType}.</p>
          <a href="/login" className="btn btn-primary mt-3">
            Se connecter
          </a>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>
              Titre:
              <input
                {...register("title", { required: "Le titre est requis" })}
                type="text"
                name="title"
              />
            </label>
            {errors.title && (
              <p style={{ color: "red" }}>{errors.title.message}</p>
            )}
          </div>

          <div>
            <label>
              Description:
              <textarea
                {...register("description", {
                  required: "La description est requise",
                })}
                name="description"
              />
            </label>
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description.message}</p>
            )}
          </div>

          {/* Champs spécifiques injectés dynamiquement */}
          {entitySpecificFields.fields.map((field) => (
            <div key={field.name}>
              <label>{field.label}:</label>
              {field.type === "radio" ? (
                field.options.map((option) => (
                  <label key={option.value} style={{ marginRight: "1em" }}>
                    <input
                      type="radio"
                      value={option.value}
                      {...register(field.name, { required: true })}
                    />
                    {option.label}
                  </label>
                ))
              ) : (
                <input
                  {...register(field.name, {
                    required: `${field.label} est requis`,
                  })}
                  type={field.type}
                  name={field.name}
                />
              )}
              {errors[field.name] && (
                <p style={{ color: "red" }}>{errors[field.name].message}</p>
              )}
            </div>
          ))}

          {/* LocationForm contrôle la sélection des coordonnées */}
          {locationType === "custom" && (
            <Controller
              name="location"
              control={control}
              render={() => (
                <LocationForm onSelectCoordinates={onSelectCoordinates} />
              )}
            />
          )}

          {locationType === "park" && (
            <div className="mb-3">
              <label className="form-label">Choisir un parc</label>
              <select
                {...register("park_id", {
                  required: "Veuillez choisir un parc",
                })}
                className="form-select"
              >
                <option value="">-- Sélectionner un parc --</option>
                <option value="1">Parc Montsouris</option>
                <option value="2">Parc de la Tête d'Or</option>
                <option value="3">Parc des Buttes-Chaumont</option>
              </select>
            </div>
          )}
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
      </div>
    );
  }
};

export default GenericForm;
