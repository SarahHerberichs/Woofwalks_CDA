import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const WalkDetailsPage = () => {
  const { id } = useParams();
  const [walk, setWalk] = useState(null);
  const [error, setError] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchWalkAndUser = async () => {
      try {
        // Récupérer l'utilisateur connecté
        const userResponse = await api.get('/me');
        const currentUser = userResponse.data;
        setUser(currentUser);

        // Récupérer les détails de la balade
        const walkResponse = await api.get(`/walks/${id}`);
        const fetchedWalk = walkResponse.data;
        setWalk(fetchedWalk);

        // Vérifier si l'utilisateur participe déjà
        if (currentUser && fetchedWalk.participants) {
          const userIsParticipant = fetchedWalk.participants.some(
            participant => {
              // Gestion de l'inconsistance de l'API
              if (typeof participant === 'object' && participant.email) {
                return participant.email === currentUser.email;
              } else if (typeof participant === 'string') {
                // Si c'est juste un IRI, on ne peut pas vérifier par email,
                // donc on considère qu'il n'est pas encore participant.
                return false;
              }
            }
          );
          setIsParticipating(userIsParticipant);
        } else {
          setIsParticipating(false);
        }

        // Vérifier si la balade est complète
        const nbParticipants = fetchedWalk.participants ? fetchedWalk.participants.length : 0;
        const maxParticipants = fetchedWalk.maxParticipants;
        setIsFull(typeof maxParticipants === "number" && nbParticipants >= maxParticipants);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Erreur lors de la récupération des données de la balade ou de l'utilisateur.");
      }
    };

    if (id) {
      fetchWalkAndUser();
    }
  }, [id]);

  const handleAlertRequest = async () => {
    if (!user || !user['@id']) {
      setMessage("Vous devez être connecté pour demander une alerte.");
      return;
    }
    try {
      const alertRequestPayload = {
        user: user['@id'], 
        walk: `/api/walks/${id}`,
        requestedAt: new Date().toISOString(),
        notified: false
      };
      await api.post('walk_alert_requests', alertRequestPayload);
      setMessage('Demande de notification enregistrée !');
    } catch (error) {
      console.error("Erreur lors de la demande d'alerte :", error.response ? error.response.data : error);
      setMessage("Erreur lors de la demande d'alerte.");
    }
  };

    const handleParticipate = async () => {
    if (!user) {
        setMessage("Vous devez être connecté pour participer à une balade.");
        return;
    }
    try {
        const response = await api.post(
        `api/walks/${id}/participate`,
        {}, // corps vide
        { headers: { "Content-Type": "application/json" } }
        );
        setWalk(response.data);
        setIsParticipating(true);
        setMessage("Vous participez maintenant à la balade !");
    } catch (error) {
        console.error("Erreur lors de la participation :", error.response?.data || error);
        setError("Erreur lors de la participation.");
    }
    };

    const handleUnparticipate = async () => {
    try {
        const response = await api.post(
        `/walks/${id}/unparticipate`,
        {}, // corps vide
        { headers: { "Content-Type": "application/json" } }
        );
        setWalk(response.data);
        setIsParticipating(false);
        setMessage("Vous ne participez plus à la balade !");
    } catch (error) {
        console.error("Erreur lors de la désinscription :", error.response?.data || error);
        setError("Erreur lors de la désinscription.");
    }
    };



  if (error) return <p className="error">{error}</p>;
  if (!walk) return <p>Chargement de la balade...</p>;

  return (
    <div>
      {message && <p className="message">{message}</p>}
      <h1>Titre : {walk.title}</h1>
      <p>Lieu : {walk.location?.name}</p>
      <p>Date : {new Date(walk.date).toLocaleString("fr-FR")}</p>
      <p>Participants : {walk.participants ? walk.participants.length : 0}</p>
      <div className="d-flex justify-content-center">
          {user ? (
            isParticipating ? (
              <button onClick={handleUnparticipate} className="btn btn-danger">
                Ne plus participer
              </button>
            ) : isFull ? (
              <button onClick={handleAlertRequest} className="button-orange">
                Demander une alerte
              </button>
            ) : (
              <button onClick={handleParticipate} className="button-green">
                Participer
              </button>
            )
          ) : (
            <p>Connectez-vous pour participer à cette balade.</p>
          )}
        </div>
    </div>
  );
};

export default WalkDetailsPage;