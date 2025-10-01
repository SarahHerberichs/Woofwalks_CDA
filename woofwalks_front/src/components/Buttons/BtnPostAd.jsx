import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GenericPostAdForm from "../Forms/Ads/GenericPostAdForm";
const BtnPostAd = ({
  formContext,
  //Par exemple champs spécifiques à walks
  entitySpecificFields,
  onFormToggle
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    setShowForm(true);
    if (onFormToggle) onFormToggle(true);
  };

  return (
    <>
      {showForm ? (
        <GenericPostAdForm
          entityType={formContext}
          entitySpecificFields={entitySpecificFields}
          onClose={() => {
            setShowForm(false);
            // Notifie le parent que le formulaire est fermé
            if (onFormToggle) onFormToggle(false);
          }}
        />
      ) : (
        <button
          onClick={handleClick}
          className="btn btn-primary btn-lg me-md-2"
        >
          Postez votre annonce
        </button>
      )}
    </>
  );
};

export default BtnPostAd;