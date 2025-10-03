
import axios from 'axios';
import { useEffect, useState } from 'react';
import BtnPostAd from "../../components/Buttons/BtnPostAd";
import walkSpecificFields from "../../components/FormSpecificFields/Walks/walkSpecificFields";
import WalkList from "../../components/Lists/WalkList";
import LocationDisplay from "../../components/Location/LocationDisplay";
import CarteLeaflet from "../../components/Maps/CarteLeaflet";

const WalksPage = () => {
  const [walks, setWalks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const formContext = "walks";

  //Fonction de récupération des Walks
  const fetchWalks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/walks`,
        {
          headers: { Accept: "application/json" },
          withCredentials: true,
        }
      );

      // Valide que data est array avant de setstate
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
  //Au premier rendu , chargement en cours et cherche les walks
  useEffect(() => {
    setIsLoading(true);
    fetchWalks();
  }, []);

  //Si post d'une annonce
  useEffect(() => {
    if (refreshTrigger > 0) {
      setIsLoading(true);
      fetchWalks();
    }
  }, [refreshTrigger]);

  //Fonction pour déclencher le refresh - à son appel on incrémente de 0 à 1
  const handleEntityCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <BtnPostAd
          formContext={formContext}
          entitySpecificFields={walkSpecificFields}
          onFormToggle={setIsFormOpen}
          onEntityCreated={handleEntityCreated}
        />
        {/* Masquer quand le formulaire est ouvert */}
        {!isFormOpen && <LocationDisplay />}

      </div>
      {/* Passe refreshTrigger initial à 0*/}
      <WalkList refreshTrigger={refreshTrigger} />

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