import { useState } from "react";
import { useAuth } from "../../utils/AuthContext";

const BtnPostAdd = ({
  formContext,
  formGenericFieldsComponent: FormGenericFieldsComponent,
  entitySpecificFields,
}) => {
  const { isAuthenticated } = useAuth();

  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      alert("Vous devez être connecté pour poster une annonce.");
      return;
    }
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
          disabled={!isAuthenticated} // optionnel : bouton désactivé si non connecté
          className="btn btn-success btn-lg shadow-lg rounded-pill px-3 py-1"
          title={!isAuthenticated ? "Connectez-vous pour poster" : undefined}
        >
          Post Add
        </button>
      )}
    </>
  );
};

export default BtnPostAdd;