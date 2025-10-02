import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { filterAndSortByFutureDate } from "../../utils/orderAds";
import WalkCard from "../Cards/WalkCard";

const HorizontalWalkList = () => {
    const [walks, setWalks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWalks = async () => {
            try {
                const response = await api.get("api/walks", {
                    headers: {
                        Accept: "application/ld+json",
                    },
                });
                // API Platform retourne un format JSON-LD avec les données dans 'member'
                const walksData = response.data.member || response.data;

                if (Array.isArray(walksData)) {
                    setWalks(walksData);
                    console.log("Walks loaded successfully:", walksData.length);
                } else {
                    console.error("API response is not an array:", walksData);
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
    //Fonction de filtrage par date
    const filteredSortedWalks = useMemo(() => {
        if (Array.isArray(walks)) {
            return filterAndSortByFutureDate(walks);
        }
        return [];
    }, [walks]);

    if (isLoading) {
        return <div className="text-center">Chargement...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div>
            <div className="container-fluid px-3">
                <h2 className="text-dark mb-3">Liste des Balades</h2>
            </div>
            <div className="d-flex overflow-auto px-3" style={{ gap: "1rem" }}>
                {filteredSortedWalks.map((walk) => (
                    <div key={walk.id} style={{ minWidth: "280px", flexShrink: 0 }}>
                        <WalkCard walk={walk} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HorizontalWalkList;
