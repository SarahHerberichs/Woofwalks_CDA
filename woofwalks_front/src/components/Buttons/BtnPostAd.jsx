import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import GenericPostAdForm from "../Forms/Ads/GenericPostAdForm";
const BtnPostAd = ({
  formContext,
  //Par exemple champs spécifiques à walks
  entitySpecificFields,
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
  };

 return (
    <>
      {showForm ? (
        <GenericPostAdForm 
          entityType={formContext}
          entitySpecificFields={entitySpecificFields}
        />
      ) : (
        <button
          onClick={handleClick}
          className="button-green btn-success btn-lg shadow-lg rounded-pill px-3 py-1"
        >
          Postez votre annonce
        </button>
      )}
    </>
  );
};

export default BtnPostAd;