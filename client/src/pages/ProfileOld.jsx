/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { use } from "react";
import axios from "axios";

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleImageClick = () => {
    document.getElementById("fileInput").click();
  };
  

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append("profileImage", file);

  //     try {
  //       const response = await axios.post("upload-profile-img", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  //       setProfileImage(response.data.filePath);
  //       localStorage.setItem("profile_img", response.data.filePath);
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //     }
  //   }
  // };

  const handleFileChange = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const response = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert("There was a problem with the upload: " + error.message);
    }
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
            <img
              src={profileImage}
              alt=""
              className="rounded border w-[200px] m-auto cursor-pointer"
              onClick={handleImageClick}
            />
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
