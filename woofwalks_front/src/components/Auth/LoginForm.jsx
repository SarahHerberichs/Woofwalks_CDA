import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import BtnLogin from "../Buttons/BtnLogin";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //Controle format et taille email
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setError("Email invalide");
      return;
    }
    if (password.length < 6) {
      setError("Mot de passe trop court");
      return;
    }
    //Tentative de login et redirect si OK
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
    //429 ->Force brute
      if (err.response && err.response.status === 429) {
          setError("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
      }
      else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
      } else {
          setError("Email ou mot de passe incorrect.");
      }

    }
  };

 return (
<form className="login-form" onSubmit={handleSubmit}>
  {error && <p className="error-message">{error}</p>}

  <label htmlFor="email">Email</label>
  <input
    type="email"
    id="email"
    name="email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    placeholder="Email"
    required
  />

  <label htmlFor="password">Mot de passe</label>
  <input
    type="password"
    id="password"
    name="password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    placeholder="Mot de passe"
    required
  />

  <BtnLogin />
</form>

  );
};

export default LoginForm;
