import useParks from "../../Lists/ParkList";
import './SelectPark.css';

const SelectParkForm = ({ register, errors }) => {
  const { parks, error } = useParks();

  return (
    <div className="select-park-container">
      <label className="select-park-label">Choisir un parc</label>
      <select
        {...register("park_location_id", {
          required: "Veuillez choisir un parc",
        })}
        className="select-park-select"
      >
        <option value="">-- Sélectionner un parc --</option>
        {parks.map((park) => (
          <option key={park.id} value={park.location.id}>
            {park.location.name}
          </option>
        ))}
      </select>
      {error && <p className="select-park-error">{error}</p>}
      {errors.park_location_id && (
        <p className="select-park-error">{errors.park_location_id.message}</p>
      )}
    </div>
  );
};

export default SelectParkForm;
