const WalkCard = ({ walk }) => {
  //Formatage des dates et heures
  const formattedDate = new Date(walk.date).toLocaleDateString("fr-FR");
  const formattedTime = new Date(walk.date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const walkDate = new Date(walk.date);
  const now = new Date();

  const diffMs = walkDate.getTime() - now.getTime();

  // Convertir la différence en minutes et heures
  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  const counter = `${hours}h${minutes}`;

  return (
    <div
      className="card"
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "350px",
        cursor: "pointer",
      }}
    >
      <div className="position-relative">
        <img
          src={`http://localhost:8000/media/${walk.mainPhoto.filePath}`}
          className="card-img-top"
          alt="Walk"
          style={{ height: "200px", objectFit: "cover" }}
        />

        <div
          className="position-absolute top-0 start-0 m-2"
          style={{ zIndex: 1 }}
        >
          <span className="badge bg-success rounded-circle p-3"> </span>
        </div>

        {/* Image sous le badge */}
        <div className="position-absolute bottom-0 start-0 mb-4 ms-2 text-white text-center">
          <img
            src={`${process.env.PUBLIC_URL}/images/sablier.png`}
            alt="Sablier"
            className="p-2 bg-light bg-opacity-75 rounded"
            width="50"
            height="50"
          />
          <p className="mt-1 px-2 py-1 bg-light bg-opacity-75 rounded small text-dark">
            {counter}
          </p>
        </div>
      </div>
      <div className="card-body" style={{ padding: "10px" }}>
        <p className="card-text text-muted" style={{ marginBottom: "5px" }}>
          Le : {formattedDate} à {formattedTime}
        </p>
        <h5 className="card-location" style={{ marginBottom: "5px" }}>
          {walk.location?.name}
        </h5>
        <p className="card-title" style={{ marginBottom: "5px" }}>
          {walk.title}
        </p>
      </div>
    </div>
  );
};

export default WalkCard;
