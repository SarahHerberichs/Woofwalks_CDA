// src/components/UserRegistrationForm.js
import { useState } from "react";

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
    setErrors({}); // Réinitialise les erreurs à chaque soumission
    setRegistrationSuccess(false);
    setLoading(true);

    const validationErrors = {}; // Erreurs de validation côté client
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

    // Si des erreurs de validation côté client existent, arrête la soumission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://localhost:8000/api/users", {
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
      try {
        // Tentative de parsing de la réponse JSON.
        // Si la réponse n'est pas un JSON valide (ex: vide, HTML d'erreur), cela échouera.
        data = await response.json();
      } catch (e) {
        console.error("Erreur de parsing JSON de la réponse :", e);
        // Si le parsing échoue mais la réponse n'est pas OK erreur générique
        if (!response.ok) {
          setErrors({
            general: "Une erreur inattendue est survenue (réponse non JSON).",
          });
          setLoading(false);
          return;
        }
      }

      if (response.ok) {
        //l'inscription a réussi
        setUsername("");
        setRegistrationSuccess(true);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({}); // Toutes les erreurs sont effacées
      } else {
        // Si la réponse n'est pas OK (statut 4xx, 5xx), c'est une erreur
        console.log("Données d'erreur du serveur :", data);

        const serverErrors = {};

        // 1. Priorité aux violations structurées (le plus courant pour les erreurs de validation Symfony/API Platform)
        if (data.violations && Array.isArray(data.violations)) {
          data.violations.forEach((violation) => {
            // Mappe l'erreur au champ spécifique du formulaire (ex: 'email', 'username', 'password')
            // Si propertyPath n'est pas défini, l'erreur est considérée comme générale
            const field = violation.propertyPath || "general";
            serverErrors[field] = violation.message;
          });
        }
        // 2. Fallback pour les messages dans 'detail' (souvent pour UniqueEntity si non dans violations)
        else if (data.detail) {
          // Tente de parser le format "champ: message" si la propriété exacte n'est pas dans violations
          const match = data.detail.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
          if (match && match.length === 3) {
            const field = match[1];
            const message = match[2];
            serverErrors[field] = message;
          } else {
            // Si 'detail' est juste un message général non mappé à un champ
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
    } catch (error) {
      // Gère les erreurs réseau (ex: serveur injoignable, CORS)
      console.error("Erreur réseau :", error);
      setErrors({
        general: "Erreur de connexion au serveur. Veuillez réessayer.",
      });
    } finally {
      setLoading(false); // Arrête le chargement quelle que soit l'issue
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>

      {registrationSuccess && (
        <p style={{ color: "green" }}>
          Inscription réussie, un email de vérification vous a été envoyé !
        </p>
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
        {/* Affiche l'erreur spécifique à l'email si elle existe */}
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="username">Nom d'utilisateur:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {/* Affiche l'erreur spécifique au nom d'utilisateur si elle existe */}
        {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
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
        {/* Affiche l'erreur spécifique au mot de passe si elle existe */}
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
        {/* Affiche l'erreur spécifique à la confirmation de mot de passe si elle existe */}
        {errors.confirmPassword && (
          <p style={{ color: "red" }}>{errors.confirmPassword}</p>
        )}
      </div>
      <div>
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
        {errors.cgv && <p style={{ color: "red" }}>{errors.cgv}</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </button>
    </form>
  );
};

export default UserRegistrationForm;
