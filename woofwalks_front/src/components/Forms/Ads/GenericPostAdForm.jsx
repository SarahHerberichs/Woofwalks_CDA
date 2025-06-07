import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  const token = localStorage.getItem("authToken");

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
            />
          ) : (
            //Utilisation d'un controller car SelectLocationForm gère ses propres états 
          <Controller
            // Controller gère un champ unique "locationData" qui est un objet contenant plusieurs sous-champs
            name="locationData"
            control={control} // fournis par useForm, permet de gérer les champs contrôlés
            defaultValue={{      // Valeurs initiales du champ "locationData"
              city: "",
              street: "",
              latitude: null,
              longitude: null,
              name: "",
            }}
            // Dans render, on récupère un objet "field" fourni par react-hook-form,
            // qui contient la valeur actuelle (field.value) et la fonction pour la mettre à jour (field.onChange)
            render={({ field }) => (
              <SelectLocationForm
                value={field.value}                 // Valeur actuelle passée au composant
                onLocationDataChange={field.onChange}  // Fonction pour notifier les changements
              />
            )}
          />

          )}
            <PhotoForm photo={photo} onFileChange={handleFileChange}/>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "En cours..." : `Créer ${entityType}`}
          </button>
        </form>
      </div>
    );
  }
};

export default GenericPostAdForm;
