/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";

function Profile() {
  const [profileImage, setProfileImage] = useState("profile-default.png");

  useEffect(() => {
    // Load initial profile picture from localStorage or a default image
    const storedProfilePicture = localStorage.getItem("profile_picture");
    if (storedProfilePicture) {
      setProfileImage(storedProfilePicture);
    }
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = localStorage.getItem("id");
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);
    //  user id
    formData.append("userId", userId);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const result = await response.json();
      setProfileImage(result.profilePicture); // Assuming the server returns the new file path
      localStorage.setItem("profile_picture", result.profilePicture);
      alert(result.message);
    } catch (error) {
      alert("There was a problem with the upload: " + error.message);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="profile-container">
      <h1>Profile Picture :</h1>
      <div className="profile-image-section">
        <img
          src={`http://localhost:3000/uploads/${profileImage}`}
          alt="Profile"
          className="profile-image"
          onClick={handleImageClick}
        />
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default Profile;
