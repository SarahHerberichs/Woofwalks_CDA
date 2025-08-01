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
  
  const [user, setUser] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get('/me');
      
      setUser(response.data);
    } catch (err) {
      console.error("Utilisateur non authentifié ou erreur API /me", err);
      setUser(null);
    }
  };
  fetchUser();
}, []);


  // --- useEffect pour charger la balade et vérifier la participation ---
    useEffect(() => {
      const fetchWalk = async () => {
        try {
          const response = await api.get(`/walks/${id}`);
          const fetchedWalk = response.data;
          setWalk(fetchedWalk);

          if (user && fetchedWalk.participants) {
            const userIRI = `/api/users/${user.id}`;
            const participantIds = fetchedWalk.participants.map(p => p['@id']);
            setIsParticipating(participantIds.includes(userIRI));
          } else {
            setIsParticipating(false);
          }

          const nbParticipants = fetchedWalk.participants ? fetchedWalk.participants.length : 0;
          const maxParticipants = fetchedWalk.maxParticipants;
          setIsFull(typeof maxParticipants === "number" && nbParticipants >= maxParticipants);
        } catch (error) {
          console.error("Erreur lors de la récupération de la balade :", error);
          setError("Erreur lors de la récupération de la balade.");
        }
      };

      if (id) fetchWalk();
    }, [id, user]);



  const handleAlertRequest = async () => {
    if (!user) {
      alert("Vous devez être connecté pour demander une alerte.");
      return;
    }
    try {
      const alertRequestPayload = {
        user: `/api/users/${user.id}`,
        walk: `/api/walks/${id}`,
        requestedAt: new Date().toISOString(),
        notified: false
      };
      await api.post('walk_alert_requests', alertRequestPayload);
      alert('Demande de notif enregistrée');
    } catch (error) {
      console.error("Erreur lors de la demande d'alerte :", error.response ? error.response.data : error);
      alert("Erreur lors de la demande d'alerte.");
    }
  };



   // --- Fonction pour gérer la participation/désinscription ---
    const handleParticipate = async () => {
      if (!user) {
        alert("Vous devez être connecté pour participer à une balade.");
        return;
      }
      try {
        let updatedParticipants;
        const userIRI = `/api/users/${user.id}`;

        if (isParticipating) {
          updatedParticipants = walk.participants.filter(
            (participant) => (typeof participant === "string" ? participant : participant['@id']) !== userIRI
          );
        } else {
          updatedParticipants = walk.participants ? [...walk.participants, userIRI] : [userIRI];
          console.log("Inscription: Nouveaux participants:", updatedParticipants);
        }

        const response = await api.patch(`/walks/${id}`,
          { participants: updatedParticipants },
          {
            headers: {
              "Content-Type": "application/merge-patch+json",
              // Plus besoin d’Authorization, le cookie est envoyé automatiquement
            }
          }
        );

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
  {/* Affiche le bouton seulement si l'utilisateur est connecté */}
    {user ? (
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