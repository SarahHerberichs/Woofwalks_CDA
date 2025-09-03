import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
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
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
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
    //Fonction récupération de l'id de la loc crée
    const getLocationId = async (data) => {
      if (data.use_custom_location === "custom") {
        const locationData = await createLocation(data.locationData);
        return parseInt(locationData["@id"].split("/").pop());
      } else if (data.use_custom_location === "park") {
        return parseInt(data.park_location_id);
      }
    return null;
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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

    const locationId = await getLocationId(data);

     if (!locationId) {
        // Tu peux gérer cette erreur localement si c'est spécifique au formulaire
        alert("La location doit être spécifiée.");
        setIsSubmitting(false);
        return;
    }

    try {
      // 1. Upload de la photo
      const photoFormData = new FormData();
      photoFormData.append("file", photo);
      //Méthode d'upload avec vérification du token via api.js
      const photoData = await uploadPhoto(photoFormData);
      const photoId = photoData.id;

      // Préparation des données à envoyer
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
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

 
  return (
    <form className="post-ad-form" onSubmit={handleSubmit(onSubmit)}>
      {/* titre */}
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
        {/* description */}
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
      {/* affiche champs spéciaux */}
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
      {/* Pour Walks, choix entre parc et loc custom pour les locations */}
      {entityType === "walks" ? (
        <WalkLocationSection
          locationType={locationType}
          control={control}
          register={register}
          errors={errors}
        />
      ) : (
        // localisation api gouvernement
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
      
      <button type="submit" className='button-green' disabled={isSubmitting}>
        {isSubmitting ? "En cours..." : `Créer ${entityType}`}
      </button>
    
    </form>

    );
  }


export default GenericPostAdForm;
