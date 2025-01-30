/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Cek token di LocalStorage

  if (!token) {
    // Jika tidak ada token, redirect ke halaman login
    return <Navigate to="/" />;
  }

  // Jika ada token, izinkan akses ke halaman
  return children;
};

export default ProtectedRoute;
