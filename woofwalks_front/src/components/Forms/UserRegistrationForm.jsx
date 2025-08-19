// src/components/UserRegistrationForm.js
import { useState } from "react";
import '../../style/UserRegistration.css';

const UserRegistrationForm = () => {
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

    const validationErrors = {}; 
    if (!email) {
      validationErrors.email = "L'e-mail est requis.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = "L'e-mail n'est pas valide.";
    }

    if (!username) {
      validationErrors.username = "Le nom d'utilisateur est requis.";
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
    if (!cgv) {
      validationErrors.cgv = "Vous devez accepter les conditions générales.";
    }


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      //Tentative de création d'un utilisateur
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          plainPassword: password,
          username,
          cgvAccepted: cgv,
        }),
      });

      let data = {};
      //Tentative de parser la reponse -- si probleme de parsing et response n'est pas ok, stoppe tout
      try {
        data = await response.json();
      } catch (e) {
        console.error("Erreur de parsing JSON de la réponse :", e);

        if (!response.ok) {
          setErrors({
            general: "Une erreur inattendue est survenue (réponse non JSON).",
          });
          setLoading(false);
          return;
        }
      }
      //Si parsing ok, set des parametres de l'utilisateur
      if (response.ok) {
        setUsername("");
        setRegistrationSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      } else {
    // Réponse Non OK : analyse des erreurs retournées par le serveur
        console.log("Données d'erreur du serveur :", data);
        //Récupération des erreurs
        const serverErrors = {};

        // 1. Erreurs de validation Symfony/API Platform
        if (data.violations && Array.isArray(data.violations)) {
          data.violations.forEach((violation) => {
            // Mappe l'erreur au champ spécifique du formulaire (ex: 'email', 'username', 'password')
            // Si propertyPath n'est pas défini, l'erreur est considérée comme générale
            const field = violation.propertyPath || "general";
            serverErrors[field] = violation.message;
          });
        }
          // 2. Si 'violations' absent, on vérifie 'detail'        
          else if (data.detail) {
          // Tente de parser le format "champ: message" si la propriété exacte n'est pas dans violations
          const match = data.detail.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
          if (match && match.length === 3) {
            const field = match[1];
            const message = match[2];
            serverErrors[field] = message;
          } else {
            // 3. Sinon, vérification de la présence d'un message global
            serverErrors.general = data.detail;
          }
        }
        // 3. Fallback pour un message générique directement dans 'message'
        else if (data.message) {
          serverErrors.general = data.message;
        }
        // 4. Dernier recours si aucun format d'erreur connu
        else {
          serverErrors.general =
            "Une erreur est survenue lors de l'inscription.";
        }

        setErrors(serverErrors);
      }
      //La tentative de création d'utilisateur a échoué
    } catch (error) {
      //Affichage des erreurs en console
      console.error("Erreur réseau :", error);
      setErrors({
        general: "Erreur de connexion au serveur. Veuillez réessayer.",
      });
    } finally {
      //Stop la tentative de chargement quoi qu'il arrive
      setLoading(false); 
    }
  };

  return (
   <form className="user-registration-form" onSubmit={handleSubmit}>
  <h2>Inscription</h2>

  {registrationSuccess && (
    <p className="success-message">
      Inscription réussie, un email de vérification vous a été envoyé !
    </p>
  )}
  {errors.general && <p className="error-message">{errors.general}</p>}

  <div className="form-group">
    <label htmlFor="email">E-mail:</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    {errors.email && <p className="error-message">{errors.email}</p>}
  </div>

  <div className="form-group">
    <label htmlFor="username">Nom d'utilisateur:</label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
    {errors.username && <p className="error-message">{errors.username}</p>}
  </div>

  <div className="form-group">
    <label htmlFor="password">Mot de passe:</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    {errors.password && <p className="error-message">{errors.password}</p>}
  </div>

  <div className="form-group">
    <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
    <input
      type="password"
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    {errors.confirmPassword && (
      <p className="error-message">{errors.confirmPassword}</p>
    )}
  </div>

  <div className="form-group">
    <label>
      <input
        type="checkbox"
        checked={cgv}
        onChange={(e) => setCgv(e.target.checked)}
      />
      J'accepte les{" "}
      <a href="/conditions" target="_blank">
        Conditions Générales de Vente
      </a>
    </label>
    {errors.cgv && <p className="error-message">{errors.cgv}</p>}
  </div>

  <button type="submit" disabled={loading}>
    {loading ? "Inscription en cours..." : "S'inscrire"}
  </button>
</form>
  );
};

export default UserRegistrationForm;
