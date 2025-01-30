/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import TableClass from "../components/TableClass";
import TableClass2 from "../components/TableClass2";

function ClassDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="w-full text-lg [background:linear-gradient(240deg,#361f8e_0%,#7752FE_100%);]">
      {/* Navbar */}
      <Navbar />
      {/* Content & sidebar */}
      <div className="flex py-4">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <Content
          titlePage="Class"
          // tableData={<TableClass2 />}
          tableData={<TableClass />}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        >
          {/* <Card>
            <p>Ini kostum konten card</p>
          </Card> */}
        </Content>
      </div>
    </div>
  );
}

export default ClassDashboard;
