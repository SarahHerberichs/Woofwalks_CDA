import useParks from "../../Lists/ParkList";

const ParkForm = ({ register, errors }) => {
  const { parks, error } = useParks();

  return (
    <div className="mb-3">
      <label className="form-label">Choisir un parc</label>
      <select
        {...register("park_location_id", {
          required: "Veuillez choisir un parc",
        })}
        className="form-select"
      >
        <option value="">-- Sélectionner un parc --</option>
        {parks.map((park) => (
          <option key={park.id} value={park.location.id}>
            {park.location.name}
          </option>
        ))}
      </select>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {errors.park_location_id && (
        <p style={{ color: "red" }}>{errors.park_location_id.message}</p>
      )}
    </div>
  );
};

export default ParkForm;
