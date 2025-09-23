
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