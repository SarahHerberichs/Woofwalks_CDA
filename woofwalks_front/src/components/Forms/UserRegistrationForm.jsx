// src/components/UserRegistrationForm.js
import React, { useState } from "react";

const UserRegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setRegistrationSuccess(false);
    setLoading(true);

    const validationErrors = {};
    if (!email) {
      validationErrors.email = "L'e-mail est requis.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "L'e-mail n'est pas valide.";
    }
    if (!password) {
      validationErrors.password = "Le mot de passe est requis.";
    } else if (password.length < 6) {
      validationErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères.";
    }
    if (password !== confirmPassword) {
      validationErrors.confirmPassword =
        "Les mots de passe ne correspondent pas.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } else {
        setErrors(
          data.errors || {
            general: "Une erreur est survenue lors de l'inscription.",
          }
        );
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion au serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>

      {registrationSuccess && (
        <p style={{ color: "green" }}>Inscription réussie !</p>
      )}
      {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

      <div>
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Mot de passe:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword}</p>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </button>
    </form>
  );
};

export default UserRegistrationForm;
