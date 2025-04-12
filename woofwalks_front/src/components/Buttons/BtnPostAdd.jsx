import { useState } from "react";

const BtnPostAdd = ({ formContext, formComponents, entitySpecificFields }) => {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    setShowForm(true);
  };

  return (
    <>
      {showForm ? (
        formComponents.map((Component, index) => (
          <Component
            key={index}
            entityType={formContext}
            entitySpecificFields={entitySpecificFields} // Utilisez les props reçues
          />
        ))
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
