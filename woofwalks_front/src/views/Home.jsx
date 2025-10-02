import { useEffect } from "react";
import HorizontalWalkList from "../components/Lists/HorizontalWalkList";
import LocationDisplay from "../components/Location/LocationDisplay";

const Home = () => {
  useEffect(() => {
    document.title =
      "WoofWalks - Balades Canines et Parcs pour Chiens en France";
  }, []);

  return (
    <div className="mt-4">
      {/* Titre principal avec géolocalisation */}
      <div className="d-flex justify-content-between align-items-center mb-5 px-3 position-relative">
        <h1 className="text-center w-100 mb-0">Bienvenue sur WoofWalks</h1>

        {/* Section géolocalisation collée au titre */}
        <div className="position-absolute end-0">
          <LocationDisplay />
        </div>
      </div>

      {/* Ligne de balades scrollable */}
      <HorizontalWalkList />
    </div>
  );
};

export default Home;
