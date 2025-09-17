import DOMPurify from "dompurify";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { createLocation } from "../../../services/createLocation";
import { postGenericAd } from "../../../services/postGenericAd";
import { uploadPhoto } from "../../../services/uploadPhoto";
import SelectLocationForm from "../../FormPartials/Locations/SelectLocationForm";
import PhotoForm from "../../FormPartials/PhotoForm";
import WalkLocationSection from "../../FormPartials/Walks/WalkLocationSection";
import './PostAd.css';

const GenericPostAdForm = ({ entityType, entitySpecificFields }) => {
 
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const {
    //A son appel, surveille le champs via son nom pour savoir si il change, applique des regles de validations qu'on lui passe
    register,
    //Attend en parametre la vraie fonction a executer
    handleSubmit,
    //Object - gestionnaire d 'etat central - + puissant que register
    // contient la logique interne du form
    //Pour les champs qui sont pas enregistrés directement par register-> composant + complexe comme WalkLocationSection
    control,
    reset,
    //Surveille valeurs en temps réel
    watch,
    formState: { errors },
  } = useForm({
    //Initialisation des values au debut
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
  //Pour la partie Walk, surveille si le btn de choix de location(parc ou custom)change
  const locationType = watch("use_custom_location");

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    
    if (!photo) {
      alert("Veuillez sélectionner une photo !");
      return;
    }
    setIsSubmitting(true);

    // SANITIZATION
    const sanitizedData = {
      ...data,
      title: DOMPurify.sanitize(data.title),
      description: DOMPurify.sanitize(data.description),
    };
  // Vérif que locationData existe avant de Sanitize
  if (data.locationData) {
    sanitizedData.locationData = {
      city: DOMPurify.sanitize(data.locationData.city),
      street: DOMPurify.sanitize(data.locationData.street),
      name: DOMPurify.sanitize(data.locationData.name),
      latitude: data.locationData.latitude,
      longitude: data.locationData.longitude,
    };
  }

    const locationId = await getLocationId(sanitizedData);

    if (!locationId) {
      alert("La location doit être spécifiée.");
      setIsSubmitting(false);
      return;
    }
    try {
      const photoFormData = new FormData();
      photoFormData.append("file", photo);
      const photoData = await uploadPhoto(photoFormData);
      const photoId = photoData.id;

      const formattedDateTime = new Date(sanitizedData.datetime).toISOString();

      const entityData = {
        ...sanitizedData,
        date: formattedDateTime,
        photo: photoId,
        location: locationId,
        is_custom_location: sanitizedData.use_custom_location === "custom",
      };

      await postGenericAd(entityData, entityType);

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
        //Déclare ce champ comme à suivre, avec des messages si pas rempli
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
      {/* Pour Walks, choix entre parc et loc custom pour les locations + passage des fonctions du  useForm*/}
      {entityType === "walks" ? (
        <WalkLocationSection
          locationType={locationType}
           //Permet de donner le control sur le form au composant enfant
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
