// src/components/LoginForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form"; // <-- Importer useForm
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { loginUser } from "../services/authService";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialiser useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(); // <-- Destructurer register et handleSubmit

  const onSubmit = async (data) => {
    // Renommer handleSubmit en onSubmit pour éviter la confusion
    setError("");
    setIsLoading(true);

    try {
      // Les données sont déjà validées et collectées par React Hook Form
      const token = await loginUser(data.email, data.password); // <-- Utiliser data.email et data.password

      login(token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {/* Utiliser le handleSubmit de React Hook Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {" "}
        {/* <-- Lier handleSubmit à votre fonction onSubmit */}
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            {...register("email", {
              // <-- Enregistrer l'input
              required: "L'email est requis",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Format d'email invalide",
              },
            })}
            type="email"
            id="email"
            placeholder="Entrez votre email"
            disabled={isLoading}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}{" "}
          {/* <-- Afficher les erreurs de validation */}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            {...register("password", {
              // <-- Enregistrer l'input
              required: "Le mot de passe est requis",
              minLength: {
                value: 6,
                message: "Le mot de passe doit contenir au moins 6 caractères",
              },
            })}
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            disabled={isLoading}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}{" "}
          {/* <-- Afficher les erreurs de validation */}
        </div>
        {error && <p className="error">{error}</p>}{" "}
        {/* <-- Erreurs de l'API ou générales */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
