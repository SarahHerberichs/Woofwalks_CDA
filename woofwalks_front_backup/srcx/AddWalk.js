import React, { useState } from "react";

const AddWalk = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [date, setDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  // Fonction pour envoyer la requête POST avec fetch
  const handleSubmit = async (e) => {
    e.preventDefault();

    const walkData = {
      title,
      description,
      theme,
      date: new Date(date).toISOString(),
      maxParticipants: parseInt(maxParticipants, 10),
    };
    console.log(walkData);

    try {
      const response = await fetch("http://localhost:8000/api/walks", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
        },
        body: JSON.stringify(walkData),
      });

      if (response.ok) {
        alert("Walk added successfully!");
      } else {
        alert("Error adding walk!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding walk!");
    }
  };

  return (
    <div>
      <h1>Add a New Walk</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Theme:
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </label>
        <br />
        <label>
          Date:
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <br />
        <label>
          Max Participants:
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Add Walk</button>
      </form>
    </div>
  );
};

export default AddWalk;
