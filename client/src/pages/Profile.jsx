/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import Card from "../components/Card";
import { Navigate } from "react-router-dom";

function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [username, setUser] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [full_name, setFullName] = useState("");
  const [no_hp, setNoHp] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("profile-default.png");
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = Navigate;

  // new
  const [profile, setProfile] = useState(null);
  
  // use effect ini untuk mengambil data profile dari server termasuk gambarnya
  useEffect(() => {
    // Ambil userId dari localStorage
    const storedUserId = localStorage.getItem("id");
    setUserId(storedUserId);

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/profile/${storedUserId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();

    const socket = new WebSocket(
      `ws://localhost:3000/profile-updates/${storedUserId}`
    );

    socket.onmessage = (event) => {
      const updatedProfile = JSON.parse(event.data);
      setProfile((prevProfile) => ({
        ...prevProfile,
        profile_picture: updatedProfile.profile_picture,
      }));
    };

    return () => {
      socket.close();
    };
  }, [userId]);
  // new

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const full_name = localStorage.getItem("full_name");
    const no_hp = localStorage.getItem("no_hp");
    const email = localStorage.getItem("email");
    const profile_picture = localStorage.getItem("profile_picture");

    setUser(username);
    setRole(role);
    setName(name);
    setFullName(full_name);
    setNoHp(no_hp);
    setEmail(email);
    setProfileImage(profile_picture || "profile-default.png");
  }, []);

  //   sidebar status o/c
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // function untuk menangani perubahan file atau upload file
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const userId = localStorage.getItem("id");

    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);
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
      alert(result.message);
    } catch (error) {
      alert("There was a problem with the upload: " + error.message);
    }
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div className="w-full text-lg [background:linear-gradient(240deg,#361f8e_0%,#7752FE_100%);]">
      {/* Navbar */}
      <Navbar />
      {/* Content & sidebar */}
      <div className="flex py-4">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Content
          titlePage="Profile"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        >
          <Card>
            {profile && profile.profile_picture ? (
              <img
                src={`http://localhost:3000/${profile.profile_picture}`}
                alt="Profile"
                className="profile-picture w-[240px] m-auto hover:brightness-75 hover:cursor-pointer"
                onClick={handleImageClick}
              />
            ) : (
              <img
                src={`profile-default.png`}
                alt="Default Profile"
                className="profile-picture w-[240px] m-auto hover:brightness-75 hover:cursor-pointer"
                onClick={handleImageClick}
              />
            )}
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Card>
          <Card>
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">{username}</h1>
                <p>{role}</p>
                <p>{name}</p>
                <p>{full_name}</p>
                <p>{no_hp}</p>
                <p>{email}</p>
              </div>
              <h2>
                <i className="fa-solid fa-pen text-gray-600 bg-slate-300 rounded p-3 hover:cursor-pointer"></i>
              </h2>
            </div>
          </Card>
        </Content>
      </div>
    </div>
  );
}

export default Profile;
