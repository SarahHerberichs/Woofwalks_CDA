import { Controller } from "react-hook-form";
import LocationForm from "../LocationForm";
import ParkForm from "../Park/ParkForm";

const WalkLocationSection = ({
  locationType,
  control,
  register,
  errors,
  handleFileChange,
}) => {
  return (
    <>
      {locationType === "custom" && (
        <Controller
          name="locationData"
          control={control}
          defaultValue={{
            city: "",
            street: "",
            latitude: null,
            longitude: null,
            name: "",
          }}
          render={({ field }) => (
            <LocationForm
              value={field.value}
              onLocationDataChange={field.onChange}
            />
          )}
        />
      )}

      {locationType === "park" && (
        <ParkForm register={register} errors={errors} />
      )}

      <div>
        <label>
          Photo:
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
        </label>
      </div>
    </>
  );
};

export default WalkLocationSection;
