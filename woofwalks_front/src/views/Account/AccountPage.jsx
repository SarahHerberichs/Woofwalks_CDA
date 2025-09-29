import { useEffect, useState } from "react";
import PasswordChangeForm from "../../components/Forms/PasswordChangeForm";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfile } from "../../services/updateProfile";

const AccountPage = () => {
  const { isAuthenticated, user, updateUser, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    notificationsAccepted: false,
    geolocationAccepted: false,
  });

  //Quand user est dispo
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        notificationsAccepted: user.notificationsAccepted || 0,
        geolocationAccepted: user.geolocationAccepted || 0
      });
    }
  }, [user]);

  // Sauvegarde du profil
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const newProfile = await updateProfile(formData);
      if (newProfile.emailChanged || newProfile.requiresLogout) {
        setMessage("Profil modifié. Vous allez être déconnecté pour des raisons de sécurité.");
        setTimeout(() => {
          logout();
        }, 2000);
      } else {
        // Mise à jour normale
        updateUser(newProfile);
        setMessage("Profil sauvegardé avec succès !");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
    };
  }

  // Callback pour le succès du changement de mot de passe
  const handlePasswordSuccess = () => {
    setMessage("Mot de passe modifié avec succès !");
    setTimeout(() => setMessage(""), 3000);
  };

  // Callback pour les erreurs du changement de mot de passe
  const handlePasswordError = (error) => {
    const errorMessage = error.response?.data?.error || "Erreur lors du changement de mot de passe";
    setMessage(errorMessage);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Vous devez être connecté pour accéder à cette page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Mon Compte</h2>

          {message && (
            <div className="alert alert-success alert-dismissible fade show">
              {message}
              <button
                type="button"
                className="btn-close"
                onClick={() => setMessage("")}
              ></button>
            </div>
          )}

          <form onSubmit={handleSave}>
            {/* Informations personnelles */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Informations personnelles</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="notificationsAccepted"
                    checked={formData.notificationsAccepted}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notificationsAccepted: e.target.checked,
                      })
                    }
                  />
                  <label className="form-check-label" htmlFor="notificationsAccepted">
                    Accepter les notifications
                  </label>
                  <label className="form-check-label" htmlFor="geolocationAccepted">
                    Accepter la geolocalisation
                  </label>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Sauvegarder
              </button>
            </div>
          </form>

          {/* Utilisation du composant PasswordChangeForm */}
          <div className="mt-4">
            <PasswordChangeForm
              onSuccess={handlePasswordSuccess}
              onError={handlePasswordError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;