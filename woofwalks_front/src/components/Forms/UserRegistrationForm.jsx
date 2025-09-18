// import DOMPurify from "dompurify";
// import { useState } from "react";
// import { registerUser } from "../../services/userService";
// import './UserRegistration.css';

// const UserRegistrationForm = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [cgv, setCgv] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [registrationSuccess, setRegistrationSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setErrors({}); 
//     setRegistrationSuccess(false);
//     setLoading(true);
//     //Sanitize les champs
//     const safeUsername = DOMPurify.sanitize(username.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
//     const safeEmail = DOMPurify.sanitize(email.trim(), { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
//     const safePassword = password; 
//     const safeConfirmPassword = confirmPassword;
//     //Init les erreurs
//     const validationErrors = {}; 
//     //Vérifications sur contraintes de l'email
//     if (!safeEmail) {
//       validationErrors.email = "L'e-mail est requis.";
//     } else if (!/\S+@\S+\.\S+/.test(safeEmail)) {
//       validationErrors.email = "L'e-mail n'est pas valide.";
//     } else if (safeEmail.length > 180) {
//       validationErrors.email = "L'e-mail ne peut pas dépasser 180 caractères.";
//     }
//     //Vérifications contraintes username
//     if (!safeUsername) {
//       validationErrors.username = "Le nom d'utilisateur est requis.";
//     } else if (safeUsername.length > 100) {
//       validationErrors.username = "Le nom d'utilisateur ne peut pas dépasser 100 caractères.";
//     }
//     //Vérifications contraintes mot passe
//     if (!safePassword) {
//       validationErrors.password = "Le mot de passe est requis.";
//     } else if (password.length < 6) {
//       validationErrors.password =
//         "Le mot de passe doit contenir au moins 6 caractères.";
//     } else if (!/[A-Z]/.test(safePassword) || !/\d/.test(safePassword) || !/[!@#$%^&*()_\-+=<>?]/.test(safePassword)) {
//       validationErrors.password = "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.";
//     }
//     //Vérification mot passe de confirmation
//     if (safePassword!== safeConfirmPassword) {
//       validationErrors.confirmPassword =
//         "Les mots de passe ne correspondent pas.";
//     }
//     if (!cgv) {
//       validationErrors.cgv = "Vous devez accepter les conditions générales.";
//     }

//     //Récupère clés de l'obj validationErrors - vérifie s'il y a au moins 1 err - et focus sur le champ de la premiere erreur      
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       setLoading(false);
//       const firstErrorField = Object.keys(validationErrors)[0];
//       document.getElementById(firstErrorField)?.focus();
//       return;
//     }


//     try {
//       //Tentative de création d'un utilisateur via UserService
//         await registerUser({
//               email: safeEmail,
//               username: safeUsername,
//               plainPassword: safePassword,
//               cgvAccepted: cgv,
//             });

//             // Succès → reset form
//             setUsername("");
//             setEmail("");
//             setPassword("");
//             setConfirmPassword("");
//             setErrors({});
//             setRegistrationSuccess(true);
//           } catch (err) {
//             console.error("Erreur d'inscription :", err);

//         //Récupération des erreurs
//         const serverErrors = {};
//         const data = err.response?.data;
//         //Data recue
//         if (data) {
//           // 1. Erreurs de validation Symfony/API Platform
//           if (data.violations && Array.isArray(data.violations)) {
//             data.violations.forEach((violation) => {
//               // Mappe l'erreur au champ spécifique du formulaire (ex: 'email', 'username', 'password')
//               // Si propertyPath n'est pas défini, l'erreur est considérée comme générale
//               const field = violation.propertyPath || "general";
//               serverErrors[field] = violation.message;
//             });
//             // 2. Si 'violations' absent, on vérifie 'detail'
//           } else if (data.detail) {
//           // Tente de parser le format "champ: message" si la propriété exacte n'est pas dans violations
//           const match = data.detail.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
//           if (match && match.length === 3) {
//             const field = match[1];
//             const message = match[2];
//             serverErrors[field] = message;
//           } else {
//             // 3. Sinon, vérification de la présence d'un message global
//             serverErrors.general = data.detail;
//           }
//         } else if (data.message) {
//           serverErrors.general = data.message;
//         }  else {
//           serverErrors.general = "Une erreur est survenue lors de l'inscription.";
//         }
//       // Data non reçue -> erreur réseau / Axios
//       } else {
//         if (err.message.includes("Duplicate entry")) {
//           serverErrors.email = "Cet email est déjà utilisé pour un autre compte.";
//         } else {
//           serverErrors.general = "Erreur de connexion au serveur. Veuillez réessayer.";
//         }
//       }
//       setErrors(serverErrors);
//     } finally {
//       //Stop la tentative de chargement quoi qu'il arrive
//       setLoading(false); 
//     }
//   };

//   return (
//    <form className="user-registration-form" onSubmit={handleSubmit}>
//     <h2>Inscription</h2>

//     {registrationSuccess && (
//       <p className="success-message">
//         Inscription réussie, un email de vérification vous a été envoyé !
//       </p>
//     )}
//     {errors.general && <p className="error-message">{errors.general}</p>}

//     <div className="form-group">
//       <label htmlFor="email">E-mail:</label>
//       <input
//         type="email"
//         id="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       {errors.email && <p className="error-message">{errors.email}</p>}
//     </div>

//     <div className="form-group">
//       <label htmlFor="username">Nom d'utilisateur:</label>
//       <input
//         type="text"
//         id="username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//       />
//       {errors.username && <p className="error-message">{errors.username}</p>}
//     </div>

//     <div className="form-group">
//       <label htmlFor="password">Mot de passe:</label>
//       <input
//         type="password"
//         id="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       {errors.password && <p className="error-message">{errors.password}</p>}
//     </div>

//     <div className="form-group">
//       <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
//       <input
//         type="password"
//         id="confirmPassword"
//         value={confirmPassword}
//         onChange={(e) => setConfirmPassword(e.target.value)}
//         required
//       />
//       {errors.confirmPassword && (
//         <p className="error-message">{errors.confirmPassword}</p>
//       )}
//     </div>

//     <div className="form-group">
//       <label>
//         <input
//           type="checkbox"
//           id="cgv"
//           checked={cgv}
//           onChange={(e) => setCgv(e.target.checked)}
//         />
//         J'accepte les{" "}
//         <a href="/conditions" target="_blank">
//           Conditions Générales de Vente
//         </a>
//       </label>
//       {errors.cgv && <p className="error-message">{errors.cgv}</p>}
//     </div>

//     <button type="submit" disabled={loading}>
//       {loading ? "Inscription en cours..." : "S'inscrire"}
//     </button>
// </form>
//   );
// };

// export default UserRegistrationForm;
import { useUserRegistration } from '../../hooks/useUserRegistration';
import './UserRegistration.css';

const UserRegistrationForm = () => {
  // Utilise le hook pour accéder à toute la logique
  const {
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
  } = useUserRegistration();

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
            id="cgv"
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