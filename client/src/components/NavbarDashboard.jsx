/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="flex px-5 w-full h-[60px] rounded-b-xl items-center mx-auto shadow-sm justify-between [background:linear-gradient(240deg,#361f8e_0%,#7752FE_100%);]">
      <h1 className="font-bold text-xl text-white">Benkyou</h1>
      <ul className="flex gap-3 justify-between text-white">
        <li>
          <a href="#home">Home</a>
        </li>
        <li>
          <a href="#feature">Feature</a>
        </li>
        <li>
          <a href="#about">About</a>
        </li>
        <li>
          <a href="#contact">Contact</a>
        </li>
        {/* <li  onClick={() => navigate("/")}>Home</li> */}
      </ul>
      {/* tambahkan pengecekan apakah user sudah login atau belum */}
      <div className="flex">
        <button onClick={handleLogout} className="bg-red-600 px-2 py-1 text-white rounded-md">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
