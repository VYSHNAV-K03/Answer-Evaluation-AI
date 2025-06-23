import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/Admin";
import Profile from "./pages/Profile";

import QAEvaluator from "./pages/QAEvaluator";
import StudentEvaluation from "./pages/StudentEvaluation";
import StudentForm from "./pages/StudentEvaluation";
import Performance from "./pages/Performance";
import StudentPanel from "./pages/StudentPanel";
import TeacherRegisterPage from "./pages/TeacherRegisterPage";

const App = () => {
  return (
    <Router>
      <div className="bg-custom vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ques" element={<StudentForm />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-teacher" element={<TeacherRegisterPage />} />
          <Route path="/dashboard" element={<StudentForm />} />
          <Route path="/dashboard_student" element={<StudentPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/student" element={<StudentPanel />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
