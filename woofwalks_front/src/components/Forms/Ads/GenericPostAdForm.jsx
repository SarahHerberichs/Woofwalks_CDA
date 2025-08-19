import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import '../../../style/PostAd.css';
import { useAuth } from "../../../utils/AuthContext";
import SelectLocationForm from "../../FormPartials/Locations/SelectLocationForm";
import WalkLocationSection from "../../FormPartials/Walks/WalkLocationSection";
import { createLocation } from "../../services/createLocation";
import { postGenericAd } from "../../services/postGenericAd";
import { uploadPhoto } from "../../services/uploadPhoto";
import PhotoForm from "../PhotoForm";

const GenericPostAdForm = ({ entityType, entitySpecificFields }) => {
 
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //Récupération token pour affichage immédiat de non autorisation de poster si non loggé
  const { isAuthenticated, isLoading } = useAuth();
  const {
    //Pour enregistrer un champ et appliquer des règles de validations
    register,
    //Fonction déclenchée onSubmit, s'assure des validations avant execution
    handleSubmit,
    control,
    reset,
    // Pour surveiller un champ en temps réel
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

  //Surveille et MAJ la variable à chaque modif du champ "use_custom_location"
  const locationType = watch("use_custom_location");

  // Gestion spécifique du fichier photo
  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  //Début du traitement de la soumission du formulaire
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
        //insert de la location en bdd
        const locationData = await createLocation(data.locationData);
        //Récup de son ID
        locationId = parseInt(locationData["@id"].split("/").pop());

        //Si park,récuperation de l'id de sa location
      } else if (data.use_custom_location === "park") {
        // Utilise l'ID du parc sélectionné
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

      if (!postAd) {
        console.log("échec de l'ajout final de l'annonce")
      }

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

 
    return (
      <div>
  <form className="post-ad-form" onSubmit={handleSubmit(onSubmit)}>
    <div className="form-group">
      <label>Titre:</label>
      <input
        {...register("title", { required: "Le titre est requis" })}
        type="text"
        name="title"
      />
      {errors.title && (
        <p className="error-message">{errors.title.message}</p>
      )}
    </div>

    <div className="form-group">
      <label>Description:</label>
      <textarea
        {...register("description", {
          required: "La description est requise",
        })}
        name="description"
      />
      {errors.description && (
        <p className="error-message">{errors.description.message}</p>
      )}
    </div>

    {entitySpecificFields.fields.map((field) => (
      <div key={field.name} className="form-group">
        <label>{field.label}:</label>
        {field.type === "radio" ? (
          field.options.map((option) => (
            <label key={option.value}>
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
          <p className="error-message">{errors[field.name].message}</p>
        )}
      </div>
    ))}

    {entityType === "walks" ? (
      <WalkLocationSection
        locationType={locationType}
        control={control}
        register={register}
        errors={errors}
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
          <SelectLocationForm
            value={field.value}
            onLocationDataChange={field.onChange}
          />
        )}
      />
    )}

    <PhotoForm photo={photo} onFileChange={handleFileChange} />

    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "En cours..." : `Créer ${entityType}`}
    </button>
  </form>
</div>
    );
  }


export default GenericPostAdForm;
