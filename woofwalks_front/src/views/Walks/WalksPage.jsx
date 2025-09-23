// import BtnPostAd from "../../components/Buttons/BtnPostAd";
// import walkSpecificFields from "../../components/FormSpecificFields/Walks/walkSpecificFields";
// import WalkList from "../../components/Lists/WalkList";

// const WalksPage = () => {
//   //Passage du context présent
//   const formContext = "walks";
//   return (
//     <>
//       <BtnPostAd
//         formContext={formContext}
//         entitySpecificFields={walkSpecificFields}
//       />
//       <WalkList />
//     </>
//   );
// };

// export default WalksPage;
import axios from 'axios';
import { useEffect, useState } from 'react';
import BtnPostAd from "../../components/Buttons/BtnPostAd";
import walkSpecificFields from "../../components/FormSpecificFields/Walks/walkSpecificFields";
import WalkList from "../../components/Lists/WalkList";
import CarteLeaflet from "../../components/Maps/CarteLeaflet";

const WalksPage = () => {
  const [walks, setWalks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const formContext = "walks";

  // Récupérer les walks (même logique que WalkList)
  useEffect(() => {
    const fetchWalks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/walks`, {
          headers: { Accept: "application/json" },
          withCredentials: true,
        });

        // Validate that the data is an array before setting the state
        if (Array.isArray(response.data)) {
          setWalks(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setError("Les données reçues ne sont pas valides.");
        }
      } catch (error) {
        console.error("Error fetching walks:", error);
        setError("Impossible de charger les marches pour le moment.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchWalks();
  }, []);


  return (
    <>
      <BtnPostAd
        formContext={formContext}
        entitySpecificFields={walkSpecificFields}
      />
      <WalkList />

      {/* Ajouter la carte en bas */}
      {!isLoading && !error && walks.length > 0 && (
        <CarteLeaflet walks={walks} />
      )}

      {/* Gestion des états de chargement et d'erreur */}
      {isLoading && (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}
    </>
  );
};

export default WalksPage;