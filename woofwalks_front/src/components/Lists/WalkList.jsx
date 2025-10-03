import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { filterAndSortByFutureDate } from "../../utils/orderAds";
import WalkCard from "../Cards/WalkCard";

const WalkList = ({ refreshTrigger }) => {
    const [walks, setWalks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(8);


    const fetchWalks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/walks`, {
                headers: { Accept: "application/json" },
                withCredentials: true,
            });

            if (Array.isArray(response.data)) {
                setWalks(response.data);
            } else {
                console.error("API response is not an array:", response.data);
                setError("Les données reçues ne sont pas valides.");
            }
        } catch (error) {
            setError("Impossible de charger les marches pour le moment.");
        } finally {
            setIsLoading(false);
        }
    };
    //Fetch les Walk au montage
    useEffect(() => {
        fetchWalks();
    }, []);
    //Surveille l'ajout d'une annonce 
    //Cherche Les Walks au changement de refreshTrigger - ce qui change par l'appel à la fonction d'incrémentation quand on post un form d'ajout d'annonce
    useEffect(() => {
        if (refreshTrigger > 0) {
            setIsLoading(true)
            fetchWalks();
        }
    }, [refreshTrigger]);

    //Fonciton de filtrage padate
    const filteredSortedWalks = useMemo(() => {
        // Only run this if walks is a valid array
        if (Array.isArray(walks)) {
            return filterAndSortByFutureDate(walks);
        }
        return [];
    }, [walks]);

    const visibleWalks = filteredSortedWalks.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 8);
    };

    return (
        <div className="container-fluid mt-4">
            {isLoading ? (
                <p>Chargement des marches...</p>
            ) : (
                <>
                    {error && <p className="text-danger">{error}</p>}
                    <div className="row g-4">
                        {visibleWalks.length === 0 && !error ? (
                            <p>Aucune marche disponible.</p>
                        ) : (
                            visibleWalks.map((walk) => (
                                <div
                                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                                    key={walk.id}
                                >
                                    <WalkCard walk={walk} />
                                </div>
                            ))
                        )}
                    </div>

                    {visibleCount < filteredSortedWalks.length && (
                        <div className="text-center mt-3">
                            <button className="btn btn-primary" onClick={handleLoadMore}>
                                Charger plus
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default WalkList;