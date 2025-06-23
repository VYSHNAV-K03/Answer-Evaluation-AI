import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    rno: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Full name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.rno.trim()) newErrors.rno = "Roll number is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.post("/register/user", formData);
      setMessage(response.data.message);
      setServerError("");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setServerError(err.response?.data?.message || "An error occurred");
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="row shadow-lg rounded-4 overflow-hidden">
        {/* Illustration */}
        <div className="col-md-6 bg-light d-none d-md-block p-0">
          <img
            src="/images/signup4.svg"
            alt="Register Illustration"
            className="img-fluid h-100"
            style={{ objectFit: "" }}
          />
        </div>

        {/* Registration Form */}
        <div className="col-md-6 bg-white p-5">
          <h2 className="text-center mb-4 text-primary">Register as Student</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {serverError && (
            <div className="alert alert-danger">{serverError}</div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className={`form-control ${errors.username && "is-invalid"}`}
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className={`form-control ${errors.password && "is-invalid"}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className={`form-control ${errors.phone && "is-invalid"}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            {/* Roll Number */}
            <div className="mb-4">
              <label htmlFor="rno" className="form-label">
                Roll Number
              </label>
              <input
                type="text"
                className={`form-control ${errors.rno && "is-invalid"}`}
                id="rno"
                name="rno"
                value={formData.rno}
                onChange={handleChange}
              />
              {errors.rno && (
                <div className="invalid-feedback">{errors.rno}</div>
              )}
            </div>

            {/* Buttons */}
            <button type="submit" className="btn btn-success w-100 mb-2">
              Register
            </button>
            <button
              type="button"
              className="btn btn-outline-primary w-100"
              onClick={() => navigate("/register-teacher")}
            >
              Register as Teacher
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
