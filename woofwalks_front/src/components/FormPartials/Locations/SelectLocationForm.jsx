import DOMPurify from "dompurify";
import { useState } from "react";
import "./SelectLocationForm.css";
const SelectLocationForm = ({ value, onLocationDataChange }) => {
  const [cityInput, setCityInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCityCode, setSelectedCityCode] = useState(null);
  const [streetInput, setStreetInput] = useState("");
  const [streets, setStreets] = useState([]);

  //Apellé quand city ou name  ou street changent après un set des nouvelles valeurs
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
    const santizedCity = DOMPurify.sanitize(val)
    updateLocationData({ city: santizedCity });
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
    const val = e.target.value;
    setNameInput(val); 
    const sanitizedName = DOMPurify.sanitize(val);
    updateLocationData({ name: sanitizedName })
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
    const santizedStreet = DOMPurify.sanitize(val)
    updateLocationData({ street: santizedStreet });
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
  <div className="form-location">
    {/* CHAMP VILLE */}
    <div className="form-row"> 
      <label htmlFor="city-input">Ville:</label> 
      <div className="autocomplete-wrapper">
        <input
          id="city-input" 
          type="text"
          value={cityInput}
          onChange={handleCityChange}
          placeholder="Entrez une ville"
        />
        {cities.length > 0 && (
          <div className="autocomplete-dropdown">
            {cities.map(city => (
              <div
                key={city.properties.citycode}
                className="autocomplete-item"
                onClick={() => handleCitySelect(city)}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleCitySelect(city)}
              >
                {city.properties.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* CHAMP RUE - MIS À JOUR */}
    {selectedCityCode && (
      <div className="form-row">
        <label htmlFor="street-input">Rue:</label> 
        <div className="autocomplete-wrapper">
          <input
            id="street-input" 
            type="text"
            value={streetInput}
            onChange={handleStreetChange}
            placeholder="Entrez une rue"
          />
          {streets.length > 0 && (
            <div className="autocomplete-dropdown">
              {streets.map((street) => (
                <div
                  key={street.properties.id}
                  className="autocomplete-item"
                  onClick={() => handleStreetSelect(street)}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleStreetSelect(street)
                  }
                >
                  {street.properties.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )}

    {/* CHAMP NOM DU LIEU */}
    <div className="form-row"> 
      <label htmlFor="name-input">Nom du lieu:</label>
      <input
        id="name-input"
        type="text"
        value={nameInput}
        onChange={handleNameChange}
        placeholder="Donnez un nom"
      />
    </div>

  </div>
);

};

export default SelectLocationForm;
