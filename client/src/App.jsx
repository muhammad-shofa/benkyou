/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios"; // library untuk mengirim request HTTP ke backend
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Notfound from "./pages/Notfound";
import LoginNew from "./pages/LoginNew";
import RegisterNew from "./pages/RegisterNew";
import Dashboard from "./pages/Dashboard";
import UsersDashboard from "./pages/UsersDashboard";
import ClassDashboard from "./pages/ClassDashboard";
import EnteredClass from "./pages/entered-class/EnteredClass";
import MaterialsDashboard from "./pages/MaterialsDashboard";
import QuizzesDashboard from "./pages/QuizzesDashboard";
import Landing from "./pages/Landing";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import TakeQuiz from "./pages/take-quiz/TakeQuiz";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<Landing />} />
        {/* Login */}
        <Route path="/login" element={<LoginNew />} />
        {/* register */}
        <Route path="/register" element={<RegisterNew />} />
        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Main Dashboard */}
        <Route
          path="/main-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* User Dashboard*/}
        <Route
          path="/users-dashboard"
          element={
            <ProtectedRoute>
              <UsersDashboard />
            </ProtectedRoute>
          }
        />
        {/* Class Dashboard */}
        <Route
          path="/class-dashboard"
          element={
            <ProtectedRoute>
              <ClassDashboard />
            </ProtectedRoute>
          }
        />
        {/* Entered Class */}
        <Route
          // path="/entered-class"
          path="/entered-class/:class_id"
          element={
            <ProtectedRoute>
              <EnteredClass />
            </ProtectedRoute>
          }
        />
        {/* Take Quiz */}
        <Route
          path="/take-quiz/:quiz_id"
          element={
            <ProtectedRoute>
              <TakeQuiz />
            </ProtectedRoute>
          }
        />
        {/* Material Dashboard */}
        <Route
          path="/materials-dashboard"
          element={
            <ProtectedRoute>
              <MaterialsDashboard />
            </ProtectedRoute>
          }
        />
        {/* Quiz Dashboard */}
        <Route
          path="/quizzes-dashboard"
          element={
            <ProtectedRoute>
              <QuizzesDashboard />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        {/* <Route
          path="/main-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UsersDashboard />
              <ClassDashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
}

export default App;

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
