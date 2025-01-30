/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import Card from "../components/Card";
import HeaderDasboard from "../components/HeaderDashboard";
import Users from "./UsersDashboard";

function Dashboard() {
  const [data, setData] = useState({
    users: 0,
    classes: 0,
    materials: 0,
    quizzes: 0,
  });
  const userRole = localStorage.getItem("role");
  const [nameUser, setNameUser] = useState(localStorage.getItem("name"));


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/count-collections"
        );
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderContentByRole = () => {
    switch (userRole) {
      case "student":
        return (
          <>
            {/* Content & sidebar */}
            <div className="flex py-4">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
              <Content
                titlePage={"Dashboard"}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <h1 className="text-3xl my-5">
                  Welcome{" "}
                  <b className="bg-yellow-400 py-1 px-3 rounded text-white">
                    {nameUser}
                  </b>
                  , <br /> what will you do today?
                </h1>
              </Content>
            </div>
          </>
        );
      case "teacher":
        // jika rolenya teacher maka gunakan kode dibawah ini
        return (
          <>
            {/* Content & sidebar */}
            <div className="flex py-4">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
              <Content
                titlePage={"Dashboard"}
                headerDashboard={<HeaderDasboard />}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <h1 className="text-3xl my-5">
                  Welcome{" "}
                  <b className="bg-yellow-400 py-1 px-3 rounded text-white">
                    {nameUser}
                  </b>
                  , <br /> what will you do today?
                </h1>
              </Content>
            </div>
          </>
        );
      case "admin":
        return (
          <>
            {/* Content & sidebar */}
            <div className="flex py-4">
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              />
              <Content
                titlePage={"Dashboard"}
                // headerDashboard={<HeaderDasboard />}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
              >
                <div className="flex flex-wrap gap-5 justify-evenly">
                  <Card>
                    <img
                      src="banner-materials.png"
                      alt="Background Card"
                      className="rounded-md max-h-[150px]"
                    />
                    <h2>{data.users} Users</h2>
                  </Card>
                  <Card>
                    <img
                      src="banner-materials.png"
                      alt="Background Card"
                      className="rounded-md max-h-[150px]"
                    />
                    <h1 className="mt-3">{data.classes} Class</h1>
                  </Card>
                  <Card>
                    <img
                      src="banner-materials.png"
                      alt="Background Card"
                      className="rounded-md max-h-[150px]"
                    />
                    <h1 className="mt-3">{data.materials} Materials</h1>
                  </Card>
                  <Card>
                    <img
                      src="banner-materials.png"
                      alt="Background Card"
                      className="rounded-md max-h-[150px]"
                    />
                    <h1 className="mt-3">{data.quizzes} Quiz</h1>
                  </Card>
                </div>
              </Content>
            </div>
          </>
        );
      default:
        return <p>Sorry, You have invalid role.</p>;
    }
  };

  // const [users, setUsers] = useState([]);
  // const [usersCount, setUsersCount] = useState(0);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:3000/api/users-count")
  //     .then((res) => {
  //       setUsersCount(res.data.count);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full min-h-[100vh] text-lg [background:linear-gradient(240deg,#361f8e_0%,#7752FE_100%);]">
      {/* Navbar */}
      <Navbar />
      {/* render content berdasarkan role */}
      {renderContentByRole()}
    </div>
  );
}

export default Dashboard;
