import { useState } from "react";

const LocationForm = ({ value, onLocationDataChange }) => {
  const [cityInput, setCityInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCityCode, setSelectedCityCode] = useState(null);
  const [streetInput, setStreetInput] = useState("");
  const [streets, setStreets] = useState([]);

  //Apellé quand city ou name  ou street changent
  const updateLocationData = (partialData) => {
    const newData = { ...value, ...partialData };
    onLocationDataChange(newData);
  };
  // Lors de la saisie dans le champ ville :
  // - mise à jour de cityInput avec la valeur tapée
  // - appel à l'API pour récupérer les villes correspondantes
  // - mise à jour de cities avec les suggestions de l'API
  const handleCityChange = async (e) => {
    const val = e.target.value;
    setCityInput(val);
    if (val.length > 2) {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${val}&type=municipality`
      );
      const data = await response.json();
      setCities(data.features);
    } else {
      setCities([]);
    }
    updateLocationData({ city: val });
  };

  // Lorsqu'une ville est sélectionnée parmi les suggestions :
  // - mise à jour de cityInput (affichage dans l'input)
  // - mise à jour de cityCode (utilisé pour restreindre les rues ensuite)
  // - réinitialisation de cities
  // - appel à updateLocationData avec la ville sélectionnée
  const handleCitySelect = (city) => {
    setCityInput(city.properties.label);
    setSelectedCityCode(city.properties.citycode);
    setCities([]);
    updateLocationData({ city: city.properties.label });
  };

  // Met à jour nameInput et appelle updateLocationData avec le nouveau nom  const handleNameChange = async (e) => {
  const handleNameChange = async (e) => {
    setNameInput(e.target.value);
    updateLocationData({ name: e.target.value });
  };
  // Suggère les rues correspondantes en fonction de la saisie et du code commune  const handleStreetChange = async (e) => {
  const handleStreetChange = async (e) => {
    const val = e.target.value;
    setStreetInput(val);
    if (val.length > 2 && selectedCityCode) {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${val}&citycode=${selectedCityCode}`
      );
      const data = await response.json();
      setStreets(data.features);
    } else {
      setStreets([]);
    }
    updateLocationData({ street: val });
  };

  const handleStreetSelect = (street) => {
    const [lng, lat] = street.geometry.coordinates;
    //Injection dans l'input de la valeur
    setStreetInput(street.properties.name);
    //RAZ streets
    setStreets([]);
    updateLocationData({
      street: street.properties.name,
      latitude: lat,
      longitude: lng,
    });
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
      <label>Nom du lieu:</label>
      <input
        type="text"
        value={nameInput}
        onChange={handleNameChange}
        placeholder="Donnez un nom"
      />
    </div>
  );
};

export default LocationForm;
