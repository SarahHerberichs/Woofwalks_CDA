import axios from "axios";
import { useEffect, useState } from "react";
import WalkCard from "../Cards/WalkCard";

const WalkList = () => {
  const [walks, setWalks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/walks", {
          headers: {
            Accept: "application/json",
          },
        });

        console.log("Premier log de la réponse:", response.data);

        setWalks(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de marche:",
          error
        );
        setError("Impossible de charger les marches pour le moment.");
      }
    };

    fetchWalks();
  }, []);

  return (
    <div className="container-fluid mt-4">
      {error && <p className="text-danger">{error}</p>}{" "}
      {/* Affiche l'erreur si elle existe */}
      <div className="row g-4">
        {walks.length === 0 && !error ? (
          <p>Aucune marche disponible.</p>
        ) : (
          walks.map((walk, index) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3"
              key={walk.id || index}
            >
              <WalkCard walk={walk} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalkList;
