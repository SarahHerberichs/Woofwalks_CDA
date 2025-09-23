import DOMPurify from "dompurify";
import { useState } from "react";
import { registerUser } from '../services/userService';

export const useUserRegistration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cgv, setCgv] = useState(false);
  const [errors, setErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setRegistrationSuccess(false);
    setLoading(true);

    // SANITIZATION + Validation
    const safeUsername = DOMPurify.sanitize(username.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const safeEmail = DOMPurify.sanitize(email.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    const validationErrors = {};

    if (!safeEmail) {
      validationErrors.email = "L'e-mail est requis.";
    } else if (!/\S+@\S+\.\S+/.test(safeEmail)) {
      validationErrors.email = "L'e-mail n'est pas valide.";
    } else if (safeEmail.length > 180) {
      validationErrors.email = "L'e-mail ne peut pas dépasser 180 caractères.";
    }

    if (!safeUsername) {
      validationErrors.username = "Le nom d'utilisateur est requis.";
    } else if (safeUsername.length > 100) {
      validationErrors.username = "Le nom d'utilisateur ne peut pas dépasser 100 caractères.";
    }

    if (!password) {
      validationErrors.password = "Le mot de passe est requis.";
    } else if (password.length < 6) {
      validationErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    } else if (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()_\-+=<>?]/.test(password)) {
      validationErrors.password = "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.";
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    if (!cgv) {
      validationErrors.cgv = "Vous devez accepter les conditions générales.";
    }
    //Set des erreurs et focus sur premier champ concerné
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      const firstErrorField = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    try {
      //Envoi en BDD
      await registerUser({
        email: safeEmail,
        username: safeUsername,
        plainPassword: password,
        cgvAccepted: cgv,
      });
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});
      setRegistrationSuccess(true);
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      const serverErrors = {};
      const data = err.response?.data;
      if (data) {
        if (data.violations && Array.isArray(data.violations)) {
          data.violations.forEach((violation) => {
            const field = violation.propertyPath || "general";
            serverErrors[field] = violation.message;
          });
        } else if (data.detail) {
          const match = data.detail.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
          if (match && match.length === 3) {
            const field = match[1];
            const message = match[2];
            serverErrors[field] = message;
          } else {
            serverErrors.general = data.detail;
          }
        } else if (data.message) {
          serverErrors.general = data.message;
        } else {
          serverErrors.general = "Une erreur est survenue lors de l'inscription.";
        }
      } else {
        if (err.message.includes("Duplicate entry")) {
          serverErrors.email = "Cet email est déjà utilisé pour un autre compte.";
        } else {
          serverErrors.general = "Erreur de connexion au serveur. Veuillez réessayer.";
        }
      }
      setErrors(serverErrors);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    cgv,
    setCgv,
    errors,
    registrationSuccess,
    loading,
    handleSubmit,
  };
};