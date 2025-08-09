import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/services/api";

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
    if (!user || !user.id) {
      setMessage("Vous devez être connecté pour participer à une balade.");
      return;
    }

    try {
      // L'IRI de l'utilisateur connecté est toujours correct.
      const userIRI = `/api/users/${user.id}`;
      
      // 1. On extrait les IRIs des participants existants.
      // On utilise p['@id'] si p est un objet, ou p si c'est déjà une chaîne.
      const existingIRIs = walk.participants ? walk.participants.map(p => typeof p === 'object' ? p['@id'] : p) : [];
      
      // 2. On corrige les IRIs mal formés ("/api/me") pour qu'ils correspondent à l'utilisateur connecté.
      const correctedIRIs = existingIRIs.map(iri => iri === '/api/me' ? userIRI : iri);

      let updatedParticipants;

      if (isParticipating) {
        // En cas de désinscription, on filtre le tableau d'IRIs
        updatedParticipants = correctedIRIs.filter(iri => iri !== userIRI);
      } else {
        // En cas d'inscription, on ajoute l'IRI de l'utilisateur
        updatedParticipants = [...correctedIRIs, userIRI];
      }

      // 3. On envoie le tableau d'IRIs mis à jour
      const response = await api.patch(`/walks/${id}`,
        { participants: updatedParticipants },
        {
          headers: {
            "Content-Type": "application/merge-patch+json",
          }
        }
      );

      setWalk(response.data);
      setIsParticipating(!isParticipating);
      setMessage(isParticipating ? "Vous ne participez plus à la balade !" : "Vous participez maintenant à la balade !");

    } catch (error) {
      console.error("Erreur lors de la mise à jour de la participation :", error.response ? error.response.data : error);
      setError("Erreur lors de la mise à jour de la participation.");
      setMessage("Erreur lors de la mise à jour de la participation.");
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