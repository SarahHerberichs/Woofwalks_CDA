import React, { useEffect, useState } from "react";

const WalkList = () => {
  const [walks, setWalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les promenades depuis l'API
    const fetchWalks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/walks");
        if (!response.ok) {
          throw new Error("Error fetching walks");
        }
        const data = await response.json();
        setWalks(data["hydra:member"]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Walks List</h1>
      {walks.length === 0 ? (
        <p>No walks available</p>
      ) : (
        <ul>
          {walks.map((walk) => (
            <li key={walk.id}>
              <h2>{walk.title}</h2>
              <p>{walk.description}</p>
              <p>Theme: {walk.theme}</p>
              <p>Date: {new Date(walk.date).toLocaleString()}</p>
              <p>Max Participants: {walk.maxParticipants}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WalkList;
