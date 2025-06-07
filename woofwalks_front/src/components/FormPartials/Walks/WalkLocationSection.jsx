import { Controller } from "react-hook-form";
import SelectLocationForm from "../Locations/SelectLocationForm";
import SelectParkForm from "../Parks/SelectParkForm";

const WalkLocationSection = ({
  locationType,
  control,
  register,
  errors,
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
            <SelectLocationForm
              value={field.value}
              onLocationDataChange={field.onChange}
            />
          )}
        />
      )}

      {locationType === "park" && (
        <SelectParkForm register={register} errors={errors} />
      )}
    </>
  );
};

export default WalkLocationSection;
