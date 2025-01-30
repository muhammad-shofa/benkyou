/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { Route, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  // Handle perubahan input form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit form login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/login", form);
      localStorage.setItem("token", res.data.token); // Simpan token ke localStorage
      localStorage.setItem("id", res.data.data._id); // Simpan id ke localStorage
      localStorage.setItem("username", res.data.data.username); // Simpan username ke localStorage
      localStorage.setItem("role", res.data.data.role); // Simpan name ke localStorage
      localStorage.setItem("name", res.data.data.name); // Simpan name ke localStorage
      localStorage.setItem("full_name", res.data.data.full_name); // Simpan full_name ke localStorage
      localStorage.setItem("no_hp", res.data.data.no_hp); // Simpan no_hp ke localStorage
      localStorage.setItem("email", res.data.data.email); // Simpan email ke localStorage
      alert(res.data.message); // Alert pesan sukses
      navigate("/main-dashboard"); // Arahkan ke halaman dashboard setelah login sukses
      
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error occurred");
      //   console.error(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-md"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 mt-2 border rounded-md"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don`t have an account? {""}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
