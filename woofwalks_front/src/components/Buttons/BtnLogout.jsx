import { useNavigate } from "react-router-dom";
import "../../style/BtnLogout.css";
import { useAuth } from "../../utils/AuthContext";


const BtnLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

 return (
    <button className="btn btn-danger" onClick={handleLogout}>
      Déconnexion
    </button>
  );
};

export default BtnLogout;
