import axios from "axios";
import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    try {
      // Envoie de la requête pour obtenir un token JWT
      const response = await axios.post(
        "https://localhost:8000/api/login_check",
        {
          email,
          password,
        }
      );

      // Stocke le token dans localStorage
      localStorage.setItem("authToken", response.data.token);
      setError(""); // Réinitialiser l'erreur
      window.location.href = "/"; // Redirection après connexion réussie
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Entrez votre email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default LoginForm;
