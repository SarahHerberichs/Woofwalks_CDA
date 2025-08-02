import { useState } from "react";

const BtnPostAdd = ({
  formContext,
  formGenericFieldsComponent: FormGenericFieldsComponent,
  entitySpecificFields,
  isAuthenticated,
}) => {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour poster une annonce.");
      return;
    }
    setShowForm(true);
  };

  return (
    <>
      {showForm ? (
        <FormGenericFieldsComponent
          entityType={formContext}
          entitySpecificFields={entitySpecificFields}
        />
      ) : (
        <button
          onClick={handleClick}
          className="btn btn-success btn-lg shadow-lg rounded-pill px-3 py-1"
        >
          Post Add
        </button>
      )}
    </>
  );
};

export default BtnPostAdd;
