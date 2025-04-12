import axios from "axios";
import React, { useEffect, useState } from "react";
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
            // "Content-Type": "application/json",
          },
        });

        console.log("Premier log de la réponse:", response.data);
        setWalks(response.data);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
        console.error(error);
      }
    };

    // const fetchWalks = async () => {
    //   try {
    //     const response = await axios.get("http://localhost:8000/api/walks", {
    //       headers: {
    //         Accept: "application/json",
    //       },
    //     });

    //     console.log("Premier log de la réponse:", response.data);
    //     setWalks(response.data);
    //   } catch (error) {
    //     setError("Erreur lors de la récupération des données");
    //     console.error(error);
    //   }
    // };

    fetchWalks();
  }, []);

  return (
    <div className="container-fluid mt-4">
      <div className="row g-4">
        {walks.length === 0 ? (
          <p>Aucune marche disponible.</p>
        ) : (
          walks.map((walk, index) => (
            <div
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-3"
              key={index}
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
