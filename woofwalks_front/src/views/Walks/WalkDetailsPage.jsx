import { jwtDecode } from "jwt-decode"; // <-- Ajoutez cette ligne pour importer le décodeur
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/services/api";

const WalkDetailsPage = () => {
  const { id } = useParams();
  const [walk, setWalk] = useState(null);
  const [error, setError] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false); // <-- Nouvel état pour suivre la participation

  const token = localStorage.getItem("authToken");
  let userId = null;

  // Décoder le token pour obtenir l'ID de l'utilisateur actuel
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id; // <-- CORRECTED LINE!

    } catch (e) {
      console.error("Erreur lors du décodage du token :", e);
      // Gérer le cas où le token est invalide ou corrompu
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
          setIsParticipating(fetchedWalk.participants.includes(userIRI));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la balade :", error);
        setError("Erreur lors de la récupération de la balade.");
      }
    };

    fetchWalk();
  }, [id, userId]); // <-- Ajoutez userId aux dépendances

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
          (participantIRI) => participantIRI !== userIRI
        );
        console.log("Désinscription: Nouveaux participants:", updatedParticipants);
      } else {
        // L'utilisateur ne participe pas, il veut s'inscrire
        // Assurez-vous que 'participants' est bien un tableau existant avant d'ajouter
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
        <button onClick={handleParticipate}>
          {isParticipating ? "Ne plus participer" : "Participer"}
        </button>
      ) : (
        <p>Connectez-vous pour participer à cette balade.</p>
      )}
    </div>
  );
};

export default WalkDetailsPage;