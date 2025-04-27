import React, { useState } from "react";

const LocationForm = ({ onSelectCoordinates }) => {
  const [cityInput, setCityInput] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCityCode, setSelectedCityCode] = useState(null);

  const [streetInput, setStreetInput] = useState("");
  const [streets, setStreets] = useState([]);

  const handleCityChange = async (e) => {
    const value = e.target.value;
    setCityInput(value);

    if (value.length > 2) {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${value}&type=municipality`
      );
      const data = await response.json();
      setCities(data.features);
    }
  };

  const handleCitySelect = (city) => {
    setCityInput(city.properties.label);
    setSelectedCityCode(city.properties.citycode);
    setCities([]);
  };

  const handleStreetChange = async (e) => {
    const value = e.target.value;
    setStreetInput(value);

    if (value.length > 2 && selectedCityCode) {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${value}&citycode=${selectedCityCode}`
      );
      const data = await response.json();
      setStreets(data.features);
    }
  };

  const handleStreetSelect = (street) => {
    setStreetInput(street.properties.name);
    setStreets([]);
    const [lng, lat] = street.geometry.coordinates;
    onSelectCoordinates({ lat, lng });
  };

  return (
    <div>
      <label>Ville:</label>
      <input
        type="text"
        value={cityInput}
        onChange={handleCityChange}
        placeholder="Entrez une ville"
      />
      {cities.length > 0 && (
        <ul>
          {cities.map((city) => (
            <li
              key={city.properties.citycode}
              onClick={() => handleCitySelect(city)}
            >
              {city.properties.label}
            </li>
          ))}
        </ul>
      )}

      {selectedCityCode && (
        <>
          <label>Rue:</label>
          <input
            type="text"
            value={streetInput}
            onChange={handleStreetChange}
            placeholder="Entrez une rue"
          />
          {streets.length > 0 && (
            <ul>
              {streets.map((street) => (
                <li
                  key={street.properties.id}
                  onClick={() => handleStreetSelect(street)}
                >
                  {street.properties.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default LocationForm;
