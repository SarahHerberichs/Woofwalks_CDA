import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/services/api";

const WalkDetailsPage = () => {
  const { id } = useParams();
  const [walk, setWalk] = useState(null);
  const [error, setError] = useState(null);

  
    const token = localStorage.getItem("authToken");
console.log(token)
  
  useEffect(() => {
    const fetchWalk = async () => {
      try {
        const response = await api.get(`/walks/${id}`);
        setWalk(response.data); // mettre à jour l'état avec les données
      } catch (error) {
        console.error("pas trouvé la walk", error);
        setError("Erreur lors de la récupération de la balade");
      }
    };

    fetchWalk();
  }, [id]);

  if (!walk) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Titre : {walk.title}</h1>
      <p>Lieu : {walk.location?.name}</p>
      <p>Date : {new Date(walk.date).toLocaleString("fr-FR")}</p>
     <button>Participer </button>
    </div>
  );
};

export default WalkDetailsPage;
