/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // cek apakah user sudah login atau belum
  const isLogin = localStorage.getItem("token");

  // Tentukan apakah rute saat ini adalah "/"
  const isHomeRoute = location.pathname === "/";

  return (
    // saya ingin membuat ketika routenya berada pada / maka akan menggunakan fixed
    <nav
      className={`flex px-5 w-full h-[60px] rounded-b-xl items-center mx-auto shadow-sm justify-between ${
        isHomeRoute ? "fixed" : "relative"
      } [background:linear-gradient(240deg,#361f8e_0%,#7752FE_100%);]`}
    >
      {/* <nav className="flex px-5 w-full h-[60px] rounded-b-xl items-center mx-auto shadow-sm justify-between fixed [background:linear-gradient(240deg,#361f8e_0%,#7752FE_100%);]"> */}
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
      {isLogin ? (
        <button
          onClick={handleLogout}
          className="text-white bg-red-500 px-3 py-1 rounded-md"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="text-white bg-blue-500 px-3 py-1 rounded-md"
        >
          Login
        </button>
      )}
    </nav>
  );
}

export default Navbar;
