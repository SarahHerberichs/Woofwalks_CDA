import { useState } from "react";


export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const getCurrentLocation = () => {
    if (isLoading) {
      return;
    }

    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`
          );
          const data = await response.json();

          if (data.features && data.features.length > 0) {
            const cityName = data.features[0].properties.city;
            setCity(cityName);
          } else {
            setError("Impossible de déterminer la ville");
          }
        } catch (err) {
          console.error("Erreur lors de la récupération de la ville:", err);
          setError("Erreur lors de la récupération de la ville");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Erreur de géolocalisation:", err);
        let errorMessage = "Erreur de géolocalisation";

        setError(errorMessage);
        setIsLoading(false);
      },
      {
        timeout: 30000, 
        maximumAge: 600000, 
      }
    );
  }; 

  return {
    location,
    city,
    isLoading,
    error,
    getCurrentLocation,
  };
};

export default useGeolocation