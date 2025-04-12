import React, { useState } from "react";

const PostUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Veuillez d'abord sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://localhost:8000/api/photos", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer votre_token", //Si besoin token
        },
      });

      if (response.ok) {
        setMessage("File uploaded successfully");
      } else {
        setMessage(`Failed to upload file: ${response.statusText}`);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div>
      <h3>Upload a file</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PostUploadForm;
