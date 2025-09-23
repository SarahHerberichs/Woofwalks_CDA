import { useNavigate } from "react-router-dom";
import { getTimeRemaining } from "../../utils/dateUtils";
import "./WalkCard.css";

const WalkCard = ({ walk }) => {
  const navigate = useNavigate();
  //Formatage des dates et heures
  const formattedDate = new Date(walk.date).toLocaleDateString("fr-FR");
  const formattedTime = new Date(walk.date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nbParticipants = walk.participants.length
  const maxParticipants = walk.maxParticipants;
  const isFull = nbParticipants === maxParticipants;
  const timeRemaining = getTimeRemaining(walk.date);

  const consultDetails = () => {
    navigate(`/walks/${walk.id}`);
  };

  return (
    // <div className="card" onClick={consultDetails}>
    <div
      className="card"
      onClick={consultDetails}
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && consultDetails()}
      aria-label={`Walk: ${walk.title} le ${formattedDate} à ${formattedTime}`}
    >
      <div className="position-relative">
        <p> </p>
        <img
          src={`${process.env.REACT_APP_API_URL}/media/${walk.mainPhoto.filePath}`}
          className="card-img-top"
          alt={walk.title || "Walk"}
        />

        <div className="position-absolute top-0 start-0 m-2">
          {isFull ? (
            <span className="badge-full"> </span>
          ) : (
            <span className="badge-available"> </span>
          )}
        </div>

        <div className="top-right-counter">
          <img
            src={`${process.env.PUBLIC_URL}/images/compteur-de-vitesse.png`}
            alt="Compteur de vitesse"
            width="50"
            height="50"
          />
          <p className="counter-text">Max: {maxParticipants}</p>
        </div>

        <div className="bottom-left-timer">
          <img
            src={`${process.env.PUBLIC_URL}/images/sablier.png`}
            alt="Sablier"
            width="50"
            height="50"
          />
          <p className="counter-text">{timeRemaining}</p>
        </div>
      </div>

      <div className="card-body">
        <p className="card-text">
          Le : {formattedDate} à {formattedTime}
        </p>
        <h5 className="card-location">{walk.location?.name}</h5>
        <p className="card-title">{walk.title}</p>
      </div>
    </div>
  );
};


export default WalkCard;
