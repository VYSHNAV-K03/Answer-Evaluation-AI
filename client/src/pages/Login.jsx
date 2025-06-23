import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", formData);
      const { message, user, token } = response.data;

      if (!user.isVerified) {
        setMessage("Please verify your account before logging in.");
        setError("");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage(message);
      setError("");

      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "student") {
        navigate("/student");
      } else {
        navigate("/dashboard");
      }

      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center shadow rounded-4 overflow-hidden bg-white">
        {/* Illustration Image */}
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src="/images/login2.svg" // Make sure the image exists in public folder
            alt="Login illustration"
            className="img-fluid h-100 w-100"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Login Form */}
        <div className="col-md-6 p-5">
          <h2 className="text-center mb-4">Welcome Back 👋</h2>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
            </button>
            <p className="text-center text-muted">
              Don't have an account? <a href="/register">Register here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
