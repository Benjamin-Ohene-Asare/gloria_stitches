import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiScissors } from "react-icons/fi";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/signup/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.detail ||
            data.email?.[0] ||
            data.confirmPassword?.[0] ||
            data.fullName?.[0] ||
            "Signup failed."
        );
        setLoading(false);
        return;
      }

      setMessage("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-brand">
          <span className="auth-brand-icon">
            <FiScissors />
          </span>
          <div>
            <h1>Create Account</h1>
            <p>Sign up to order styles and manage your details</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-grid">
            <div className="auth-field">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <FiUser />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <FiMail />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Phone Number</label>
              <div className="auth-input-wrap">
                <FiPhone />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Register As</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="auth-select"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="auth-input-wrap">
                <FiLock />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <FiLock />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {message && <div className="auth-alert success">{message}</div>}

          <button type="submit" className="auth-primary-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;