import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ConfirmEmail = () => {
  const [message, setMessage] = useState(
    "Confirmation de votre e-mail en cours..."
  );
  const [status, setStatus] = useState("loading");

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    const confirmAccount = async () => {
      if (!token) {
        setMessage(
          "Jeton de confirmation manquant. Le lien est peut-être invalide."
        );
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:8000/api/confirm-email/${token}`
        );
        const data = await response.json();

        if (response.ok) {
          if (data.status === "success") {
            setMessage(
              "Votre compte a été confirmé avec succès ! Vous pouvez maintenant vous connecter."
            );
            setStatus("success");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else {
            setMessage(`Erreur de confirmation : ${data.message}`);
            setStatus("error");
            console.error("7. Erreur API :", data.message);
          }
        } else {
          setMessage(
            `Erreur : ${data.message || "Une erreur inattendue est survenue."}`
          );
          setStatus("error");
          console.error("Erreur HTTP :", response.status, data);
        }
      } catch (error) {
        console.error(
          "Erreur réseau *capturée par catch* lors de la confirmation d'email :",
          error
        );
        setMessage(
          "Impossible de se connecter au serveur de confirmation. Veuillez réessayer plus tard."
        );
        setStatus("error");
      }
    };

    // Appeler la fonction asynchrone
    confirmAccount();
  }, [token, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Confirmation d'E-mail</h1>
      {status === "loading" && <p>{message}</p>}
      {status === "success" && (
        <p style={{ color: "green", fontWeight: "bold" }}>{message}</p>
      )}
      {status === "error" && (
        <p style={{ color: "red", fontWeight: "bold" }}>{message}</p>
      )}
      {status === "success" && <p>Redirection vers la page de connexion...</p>}
    </div>
  );
};

export default ConfirmEmail;
