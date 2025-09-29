import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import useGeolocation from "../../hooks/useGeolocation";
import "./LocationDisplay.css";

const LocationDisplay = () => {
    const { isAuthenticated } = useAuth();
    const {
        city,
        isLoading,
        error,
        getCurrentLocation,
    } = useGeolocation();

    useEffect(() => {
        if (isAuthenticated) {
            getCurrentLocation();
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="location-display">
            {isLoading && (
                <div className="location-loading">

                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Détection de votre position...</span>
                </div>
            )}

            {error && (
                <div className="location-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>{error}</span>
                </div>
            )}

            {city && !isLoading && !error && (
                <div className="location-success">
                    <span className="location-pin">📍</span>
                    <span className="location-city">{city.substring(0, 5)}</span>
                </div>
            )}
        </div>
    );
};

export default LocationDisplay;
