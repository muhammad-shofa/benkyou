/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import Card from "./Card";
import HeaderDasboard from "./HeaderDashboard";

function Content({
  titlePage,
  children,
  headerDashboard,
  tableData,
  isSidebarOpen,
  toggleSidebar,
}) {
  return (
    <div
      className={`flex-1 p-7 bg-white txet-black rounded-lg mx-4 duration-300 ${
        isSidebarOpen ? "ml-[270px]" : "ml-[100px]"
      }`}
    >
      <h1 className="text-2xl font-semibold mb-3">{titlePage}</h1>
      <div>{headerDashboard}</div>
      <div>{tableData}</div>
      <div className="all-card flex gap-5 my-3 flex-wrap">{children}</div>
    </div>
  );
}

export default Content;
