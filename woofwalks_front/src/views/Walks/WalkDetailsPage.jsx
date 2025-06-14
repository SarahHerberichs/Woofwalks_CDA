import { jwtDecode } from "jwt-decode"; // <-- Ajoutez cette ligne pour importer le décodeur
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/services/api";

const WalkDetailsPage = () => {
  const { id } = useParams();
  const [walk, setWalk] = useState(null);
  const [error, setError] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isFull, setIsFull] = useState(false);
  //Chercher les détails de la walk dont l'id est dans l'url
  
  const token = localStorage.getItem("authToken");
  let userId = null;

  // Décoder le token pour obtenir l'ID de l'utilisateur actuel
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id; // <-- CORRECTED LINE!

    } catch (e) {
      console.error("Erreur lors du décodage du token :", e);

    }
  }

  // --- useEffect pour charger la balade et vérifier la participation ---
  useEffect(() => {
    const fetchWalk = async () => {
      try {
        const response = await api.get(`/walks/${id}`);
        const fetchedWalk = response.data;
        setWalk(fetchedWalk);

        // Vérifier si l'utilisateur est déjà participant
        if (userId && fetchedWalk.participants) {
          // API Platform utilise des IRIs (ex: /api/users/1) pour les relations.
          // Il faut donc créer l'IRI de l'utilisateur et le comparer avec ceux des participants.
          const userIRI = `/api/users/${userId}`;
          const participantIds = fetchedWalk.participants.map(p => p['@id']);
          setIsParticipating(participantIds.includes(userIRI));
        }

        //Vérifie et Set si la Walk est Full
        const nbParticipants = fetchedWalk.participants.length;
        const maxParticipants = fetchedWalk.maxParticipants;
        setIsFull (typeof maxParticipants === "number" && nbParticipants >= maxParticipants)
      } catch (error) {
        console.error("Erreur lors de la récupération de la balade :", error);
        setError("Erreur lors de la récupération de la balade.");
      }
    };
    fetchWalk();
  }, [id, userId]);

        const handleAlertRequest = async () => {
        try {
          const alertRequestPayload = {
            user : `api/users/${userId}`,
            walk: `api/walks/${id}`,
            requestedAt: new Date().toISOString(),
            notified:false
          }
          const response = await api.post('walk_alert_requests', alertRequestPayload, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          alert ('Demande de notif enregistree');
        } catch (error) {
          console.error("Erreur lors de la demande d'alerte :", error.response ? error.response.data : error);
          alert("Erreur lors de la demande d'alerte.");
        }
      }


  // --- Fonction pour gérer la participation/désinscription ---
  const handleParticipate = async () => {
    if (!token || !userId) {
      alert("Vous devez être connecté pour participer à une balade.");
      return;
    }
    try {
      let updatedParticipants;
      const userIRI = `/api/users/${userId}`;
      if (isParticipating) {
        // L'utilisateur participe déjà, il veut se désinscrire
       updatedParticipants = walk.participants.filter(
      (participant) => (typeof participant === "string" ? participant : participant['@id']) !== userIRI
    );
      } else {
          // L'utilisateur ne participe pas, il veut s'inscrire
          updatedParticipants = walk.participants ? [...walk.participants, userIRI] : [userIRI];
          console.log("Inscription: Nouveaux participants:", updatedParticipants);
      }

      // Envoyer la requête PATCH à l'API Platform pour mettre à jour les participants
      const response = await api.patch(`/walks/${id}`, 
        { participants: updatedParticipants },
        {
          headers: {
            // Indique à API Platform que c'est une mise à jour partielle
            "Content-Type": "application/merge-patch+json", 
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // Mettre à jour l'état local de la balade et de la participation après succès
      setWalk(response.data);
      setIsParticipating(!isParticipating);
      alert(isParticipating ? "Vous ne participez plus à la balade !" : "Vous participez maintenant à la balade !");

    } catch (error) {
      console.error("Erreur lors de la mise à jour de la participation :", error.response ? error.response.data : error);
      setError("Erreur lors de la mise à jour de la participation.");
      alert("Erreur lors de la mise à jour de la participation.");
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!walk) return <p>Chargement de la balade...</p>;

  return (
    <div>
      <h1>Titre : {walk.title}</h1>
      <p>Lieu : {walk.location?.name}</p>
      <p>Date : {new Date(walk.date).toLocaleString("fr-FR")}</p>
      <p>Participants : {walk.participants ? walk.participants.length : 0}</p>

      {/* Affiche le bouton seulement si l'utilisateur est connecté */}
      {token ? (
        isParticipating ? (
          <button onClick={handleParticipate}>
            Ne plus participer
          </button>
        ) : isFull ? (
          <button onClick={handleAlertRequest}>
            Demander une alerte
          </button>
        ) : (
          <button onClick={handleParticipate}>
            Participer
          </button>
        )
      ) : (
        <p>Connectez-vous pour participer à cette balade.</p>
      )}

    </div>
  );
};

export default WalkDetailsPage;