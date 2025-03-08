import { useState } from "react";
import walkSpecificFields from "../Forms/walkSpecificFields";

const BtnPostAdd = ({ formContext, formComponents }) => {
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
            entitySpecificFields={walkSpecificFields}
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
