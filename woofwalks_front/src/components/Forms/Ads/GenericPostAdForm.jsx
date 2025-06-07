import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createLocation } from "../../services/createLocation";
import { postGenericAd } from "../../services/postGenericAd";
import { uploadPhoto } from "../../services/uploadPhoto";
import LocationForm from "../LocationForm";
import WalkLocationSection from "../Walks/WalkLocationSection";

const GenericPostAdForm = ({ entityType, entitySpecificFields }) => {
 
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      datetime: "",
      max_participants: "",
      use_custom_location: "park",
      park_location_id: "",
      locationData: {
        city: "",
        street: "",
        latitude: null,
        longitude: null,
        name: "",
      },
      ...entitySpecificFields.initialValues,
    },
  });
  //champ de choix du type de location
  const locationType = watch("use_custom_location");

  // Gestion spécifique du fichier photo
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
      //Méthode d'upload avec vérification du token via api.js
      const photoData = await uploadPhoto(photoFormData);
      const photoId = photoData.id;

      // 2.Gestion location selon le type
      let locationId;
      //Si custom, création d'une location et stockage de son id
      if (data.use_custom_location === "custom") {
        const locationData = await createLocation(data.locationData);
        locationId = parseInt(locationData["@id"].split("/").pop());

        //Si park,récuperation de l'id de sa location
      } else if (data.use_custom_location === "park") {
        // Utiliser l'ID du parc sélectionné
        locationId = parseInt(data.park_location_id);
      } else {
        // Gérer autres cas si besoin
        locationId = null;
      }

      if (!locationId) {
        throw new Error("La location doit être spécifiée.");
      }
      // 3. Préparation des données à envoyer
      const formattedDateTime = new Date(data.datetime).toISOString();

      const entityData = {
        ...data,
        date: formattedDateTime,
        photo: photoId,
        location: locationId,
        is_custom_location:
          data.use_custom_location === "custom" ? true : false,
      };

      // 4. Envoi des données via controlleur symfony

      const postAd = await postGenericAd(entityData, entityType);
      console.log(postAd); // Contient la réponse de l'API

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
      // Messages erreur
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
        {/* déclenchement du onSubmit : appel à handle sybmit qui récupere tous les champs register et fais les vérifications */}
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
              {/* SI c'est des input radio */}
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
                // Pour les autres cas
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
          {entityType === "walks" ? (
            <WalkLocationSection
              locationType={locationType}
              control={control}
              register={register}
              errors={errors}
              handleFileChange={handleFileChange}
            />
          ) : (
            <Controller
              name="locationData"
              control={control}
              defaultValue={{
                city: "",
                street: "",
                latitude: null,
                longitude: null,
                name: "",
              }}
              render={({ field }) => (
                <LocationForm
                  value={field.value}
                  onLocationDataChange={field.onChange}
                />
              )}
            />
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "En cours..." : `Créer ${entityType}`}
          </button>
        </form>
      </div>
    );
  }
};

export default GenericPostAdForm;
