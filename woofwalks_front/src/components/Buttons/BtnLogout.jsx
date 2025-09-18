import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./BtnLogout.css";


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
