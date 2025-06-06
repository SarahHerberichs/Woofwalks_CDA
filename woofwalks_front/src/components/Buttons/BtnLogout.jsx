import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";

const BtnLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Déconnexion
    </button>
  );
};

export default BtnLogout;
